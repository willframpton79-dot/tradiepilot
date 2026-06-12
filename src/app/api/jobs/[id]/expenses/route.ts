import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAuth } from '@/lib/session';
import mongoose from 'mongoose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { id } = await params;
    const body = await req.json();
    await connectDB();

    let query: any = { userEmail };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { ...query, _id: id };
    } else {
      query = { ...query, jobId: id };
    }

    const job = await Job.findOne(query);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Add new expense entry to receiptLog
    const newExpense = {
      id: new mongoose.Types.ObjectId().toString(),
      date: body.date,
      item: body.description,
      supplier: body.supplier || 'N/A',
      cost: parseFloat(body.amount),
      category: body.category.toLowerCase(),
      note: body.note || '',
    };

    job.receiptLog.push(newExpense);

    // Recalculate totals
    job.actualMaterials = job.receiptLog
      .filter((log: any) => log.category === 'materials' || log.category === 'equipment' || log.category === 'other')
      .reduce((sum: number, log: any) => sum + (log.cost || 0), 0);
    
    job.actualSubcontractors = job.receiptLog
      .filter((log: any) => log.category === 'subcontractor')
      .reduce((sum: number, log: any) => sum + (log.cost || 0), 0);

    job.actualTotal = (job.actualLabour || 0) + (job.actualMaterials || 0) + (job.actualSubcontractors || 0);
    
    // Recalculate margin
    const quotedExGst = job.quotedTotalExGst || (job.quotedTotal / 1.1);
    const marginAmount = quotedExGst - job.actualTotal;
    job.marginPct = quotedExGst > 0 ? (marginAmount / quotedExGst) * 100 : 0;
    
    // Update status based on margin if needed
    if (job.marginPct < (job.targetMarginPct || 15)) {
      job.status = 'critical';
    } else if (job.marginPct < (job.targetMarginPct || 30)) {
      job.status = 'on-track';
    }

    await job.save();

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('POST /api/jobs/[id]/expenses error:', error);
    return NextResponse.json({ error: 'Failed to log expense' }, { status: 500 });
  }
}

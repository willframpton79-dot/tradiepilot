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

    // Add new time log entry
    const newLog = {
      id: new mongoose.Types.ObjectId().toString(),
      staff: body.staff,
      date: body.date,
      hours: parseFloat(body.hours),
      rate: parseFloat(body.rate),
      cost: parseFloat(body.hours) * parseFloat(body.rate),
      description: body.description || 'Labour',
    };

    job.timeLog.push(newLog);

    // Recalculate totals
    job.actualLabour = job.timeLog.reduce((sum: number, log: any) => sum + (log.cost || 0), 0);
    job.actualTotal = (job.actualLabour || 0) + (job.actualMaterials || 0) + (job.actualSubcontractors || 0);
    
    // Recalculate margin
    const quotedExGst = job.quotedTotalExGst || (job.quotedTotal / 1.1);
    const marginAmount = quotedExGst - job.actualTotal;
    job.marginPct = (marginAmount / quotedExGst) * 100;
    
    // Update status based on margin if needed
    if (job.marginPct < (job.targetMarginPct || 15)) {
      job.status = 'critical';
    } else if (job.marginPct < (job.targetMarginPct || 30)) {
      job.status = 'on-track';
    }

    await job.save();

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('POST /api/jobs/[id]/time-logs error:', error);
    return NextResponse.json({ error: 'Failed to log time' }, { status: 500 });
  }
}

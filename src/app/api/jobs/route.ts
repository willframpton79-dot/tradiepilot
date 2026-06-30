import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAuth } from '@/lib/session';

// GET /api/jobs — list all jobs for the current user
export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    await connectDB();
    const jobs = await Job.find({ userEmail }).lean();
    return NextResponse.json(jobs);
  } catch (error: any) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs — create a new job
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const body = await req.json();
    await connectDB();

    // Use random suffix to avoid race conditions on sequential counts
    const { randomBytes } = await import('crypto');
    const jobId = `JOB-${randomBytes(3).toString('hex').toUpperCase()}`;

    const jobData = {
      ...body,
      userEmail,
      jobId,
      timeLog: body.timeLog || [],
      receiptLog: body.receiptLog || [],
      actualTotal: 0,
      margin: 0,
      marginPct: 0,
      actualLabour: 0,
      actualMaterials: 0,
      actualSubcontractors: 0,
      gstCollected: 0,
      gstPaid: 0,
    };

    const newJob = await Job.create(jobData);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/jobs error:', error);
    // Provide more specific error if it's a validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: Object.keys(error.errors).map(key => error.errors[key].message) 
      }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create job', message: error.message }, { status: 500 });
  }
}

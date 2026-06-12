import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAuth } from '@/lib/session';

// GET /api/jobs — list all jobs for the current user
export async function GET() {
  try {
    const userEmail = await requireAuth();
    await connectDB();
    const jobs = await Job.find({ userEmail }).lean();
    return NextResponse.json(jobs);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs — create a new job
export async function POST(req: NextRequest) {
  try {
    const userEmail = await requireAuth();
    const body = await req.json();
    await connectDB();

    // Generate a unique jobId
    const count = await Job.countDocuments({ userEmail });
    const jobId = `JOB-${(count + 1).toString().padStart(3, '0')}`;

    const jobData = {
      ...body,
      userEmail,
      jobId,
      // Default empty arrays and values
      timeLog: [],
      receiptLog: [],
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
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

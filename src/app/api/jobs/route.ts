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
    console.log('POST /api/jobs: Starting job creation...');
    
    const auth = await requireAuth();
    if (auth instanceof NextResponse) {
      console.warn('POST /api/jobs: Unauthorized access attempt');
      return auth;
    }
    const userEmail = auth.email;
    console.log(`POST /api/jobs: Authenticated user: ${userEmail}`);

    const body = await req.json();
    console.log('POST /api/jobs: Request body:', JSON.stringify(body, null, 2));

    await connectDB();
    console.log('POST /api/jobs: Connected to MongoDB');

    // Generate a unique jobId for this user
    const count = await Job.countDocuments({ userEmail });
    const jobId = `JOB-${(count + 1).toString().padStart(3, '0')}`;
    console.log(`POST /api/jobs: Generated jobId: ${jobId}`);

    const jobData = {
      ...body,
      userEmail,
      jobId,
      // Default empty arrays and values
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

    console.log('POST /api/jobs: Attempting to create job in DB...');
    const newJob = await Job.create(jobData);
    console.log('POST /api/jobs: Job created successfully:', newJob._id);

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

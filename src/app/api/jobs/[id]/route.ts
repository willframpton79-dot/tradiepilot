import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAuth } from '@/lib/session';
import mongoose from 'mongoose';

// GET /api/jobs/[id] — single job detail for current user
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { id } = await params;
    await connectDB();

    let query: any = { userEmail };
    
    // Try to find by MongoDB _id if it's a valid ObjectId, otherwise try jobId
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { ...query, _id: id };
    } else {
      query = { ...query, jobId: id };
    }

    const job = await Job.findOne(query).lean();
    
    if (!job) {
      // One last try: if it was a valid ObjectId but not found, maybe it's actually a jobId string that looks like an ObjectId
      const jobByJobId = await Job.findOne({ jobId: id, userEmail }).lean();
      if (jobByJobId) return NextResponse.json(jobByJobId);
      
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json(job);
  } catch (error: any) {
    console.error('GET /api/jobs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

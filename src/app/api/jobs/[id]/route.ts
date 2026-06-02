import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';

// GET /api/jobs/[id] — single job detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const job = await Job.findOne({ jobId: id }).lean();
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json(job);
  } catch (error) {
    console.error(`GET /api/jobs/[id] error:`, error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
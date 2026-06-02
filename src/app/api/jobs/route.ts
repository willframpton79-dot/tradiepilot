import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';

// GET /api/jobs — list all jobs (for ActiveJobs component)
export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({}).lean();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
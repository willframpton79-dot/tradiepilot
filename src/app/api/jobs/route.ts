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
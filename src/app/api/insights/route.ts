import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Insight } from '@/models/Insight';
import { requireAuth } from '@/lib/session';

// GET /api/insights — fetch all insight sections for current user
export async function GET() {
  try {
    const userEmail = await requireAuth();
    await connectDB();
    const insights = await Insight.find({ userEmail }).lean();

    const result: Record<string, any> = {};
    for (const ins of insights) {
      result[(ins as any).section] = (ins as any).data;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Insight } from '@/models/Insight';
import { requireAuth } from '@/lib/session';

// GET /api/insights — fetch all insight sections for current user
export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;
    await connectDB();
    const insights = await Insight.find({ userEmail }).lean();

    const result: Record<string, any> = {};
    for (const ins of insights) {
      result[(ins as any).section] = (ins as any).data;
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('GET /api/insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
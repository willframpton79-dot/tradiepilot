import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Insight } from '@/models/Insight';

// GET /api/insights — fetch all insight sections, keyed by section name
export async function GET() {
  try {
    await connectDB();
    const insights = await Insight.find({}).lean();

    // Build a keyed object: { profit_alerts: {...}, customer_ltv: {...}, ... }
    const result: Record<string, any> = {};
    for (const ins of insights) {
      result[(ins as any).section] = (ins as any).data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
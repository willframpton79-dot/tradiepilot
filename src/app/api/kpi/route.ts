import { NextResponse } from 'next/server';
import { calculateKPIs } from '@/lib/kpi';
import { requireAuth } from '@/lib/session';

// GET /api/kpi — returns all business KPIs (profitability, quote win rate, DSO)
export async function GET() {
  try {
    const userEmail = await requireAuth();
    const result = await calculateKPIs();
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/kpi error:', error);
    return NextResponse.json({ success: false, error: 'KPI calculation failed' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { calculateKPIs } from '@/lib/kpi';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    await requireAuth();
    const result = await calculateKPIs();
    return NextResponse.json({ success: true, data: result.quoteWinRate });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
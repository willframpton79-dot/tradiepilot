import { NextResponse } from 'next/server';
import { calculateKPIs } from '@/lib/kpi';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;
    const result = await calculateKPIs(userEmail);
    return NextResponse.json({ success: true, data: result.quoteWinRate });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

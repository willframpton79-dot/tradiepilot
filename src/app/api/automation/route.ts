import { NextResponse } from 'next/server';
import { runAutomationEngine, runProfitLeakAnalysis } from '@/lib/automation';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const summary = await runAutomationEngine(auth.email);
    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    console.error('GET /api/automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Automation engine failed' },
      { status: 500 }
    );
  }
}

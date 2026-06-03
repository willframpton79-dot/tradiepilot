import { NextResponse } from 'next/server';
import { runAutomationEngine, runProfitLeakAnalysis } from '@/lib/automation';
import { requireAuth } from '@/lib/session';

// GET /api/automation — run full automation engine for current user
export async function GET() {
  try {
    const userEmail = await requireAuth();
    const summary = await runAutomationEngine(userEmail);
    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Automation engine failed' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { runAutomationEngine, runProfitLeakAnalysis } from '@/lib/automation';

// GET /api/automation — run full automation engine and return results
export async function GET() {
  try {
    const summary = await runAutomationEngine();
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error('GET /api/automation error:', error);
    return NextResponse.json(
      { success: false, error: 'Automation engine failed' },
      { status: 500 }
    );
  }
}
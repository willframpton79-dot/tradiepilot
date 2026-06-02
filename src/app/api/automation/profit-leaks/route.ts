import { NextResponse } from 'next/server';
import { runProfitLeakAnalysis } from '@/lib/automation';

// GET /api/automation/profit-leaks — profit leak detection on active jobs
export async function GET() {
  try {
    const result = await runProfitLeakAnalysis();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('GET /api/automation/profit-leaks error:', error);
    return NextResponse.json(
      { success: false, error: 'Profit leak analysis failed' },
      { status: 500 }
    );
  }
}
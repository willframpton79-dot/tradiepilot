import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { generateWeeklyReportForUser, sendWeeklyReportEmail } from '@/lib/weeklyReport';

// POST /api/ai/weekly-report
// Body: { preview?: boolean }
// preview: true  → generate only, do not send email
// preview: false → generate and send to user's email
export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { preview = false } = await req.json().catch(() => ({}));

    const { subject, body, userName } = await generateWeeklyReportForUser(userEmail);

    if (!preview) {
      await sendWeeklyReportEmail(userEmail, subject, body, userName);
    }

    return NextResponse.json({ success: true, subject, preview: body });
  } catch (error: any) {
    console.error('POST /api/ai/weekly-report error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
  }
}

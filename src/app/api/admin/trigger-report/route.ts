import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { generateWeeklyReportForUser, sendWeeklyReportEmail } from '@/lib/weeklyReport';

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email is required' }, { status: 400 });

  try {
    const { subject, body, userName } = await generateWeeklyReportForUser(email);
    await sendWeeklyReportEmail(email, subject, body, userName);
    return NextResponse.json({ success: true, subject });
  } catch (error: any) {
    console.error('trigger-report error:', error);
    return NextResponse.json({ error: error.message || 'Failed to send report' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateWeeklyReportForUser, sendWeeklyReportEmail } from '@/lib/weeklyReport';

// GET /api/cron/weekly-report
// Called by Vercel Cron every Monday at 7am UTC (5pm AEST)
// Requires Authorization: Bearer <CRON_SECRET>
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const proUsers = await User.find({
    tier: { $in: ['pro', 'enterprise'] },
    email: { $exists: true, $ne: '' },
  }).select('email').lean() as any[];

  let sent = 0;
  let failed = 0;

  for (const user of proUsers) {
    try {
      const { subject, body, userName } = await generateWeeklyReportForUser(user.email);
      await sendWeeklyReportEmail(user.email, subject, body, userName);
      sent++;
    } catch (err: any) {
      console.error(`Weekly report failed for ${user.email}:`, err.message);
      failed++;
    }
  }

  console.log(`Weekly reports: ${sent} sent, ${failed} failed`);
  return NextResponse.json({ success: true, sent, failed, total: proUsers.length });
}

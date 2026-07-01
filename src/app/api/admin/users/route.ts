import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

  // Aggregate job counts per userEmail
  const jobCounts: Record<string, number> = {};
  const jobAgg = await Job.aggregate([{ $group: { _id: '$userEmail', count: { $sum: 1 } } }]);
  for (const row of jobAgg) {
    if (row._id) jobCounts[row._id] = row.count;
  }

  const now = new Date();

  const enriched = users.map((u: any) => {
    let trialStatus: 'active' | 'expired' | 'none' = 'none';
    if (u.trialEndsAt) {
      trialStatus = new Date(u.trialEndsAt) > now ? 'active' : 'expired';
    }

    return {
      _id: u._id,
      email: u.email,
      name: u.name || '',
      businessName: u.businessName || '',
      tier: u.tier,
      trialStatus,
      trialEndsAt: u.trialEndsAt ?? null,
      xeroConnected: !!(u.xeroAccessToken && u.xeroTenantId),
      jobCount: jobCounts[u.email] || 0,
      onboardingComplete: u.onboardingComplete,
      createdAt: u.createdAt,
    };
  });

  const total = enriched.length;
  const activeTrials = enriched.filter(u => u.trialStatus === 'active').length;
  const expiredTrials = enriched.filter(u => u.trialStatus === 'expired').length;
  const paying = enriched.filter(u => !['free'].includes(u.tier)).length;

  return NextResponse.json({ users: enriched, stats: { total, activeTrials, expiredTrials, paying } });
}

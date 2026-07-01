import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await connectDB();

  const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

  // Aggregate job and quote counts per userEmail
  const [jobAgg, quoteAgg] = await Promise.all([
    Job.aggregate([{ $group: { _id: '$userEmail', count: { $sum: 1 } } }]),
    Quote.aggregate([{ $group: { _id: '$userEmail', count: { $sum: 1 } } }]),
  ]);

  const jobCounts: Record<string, number> = {};
  for (const row of jobAgg) { if (row._id) jobCounts[row._id] = row.count; }

  const quoteCounts: Record<string, number> = {};
  for (const row of quoteAgg) { if (row._id) quoteCounts[row._id] = row.count; }

  const now = new Date();

  const enriched = users.map((u: any) => {
    let trialStatus: 'active' | 'expired' | 'none' = 'none';
    if (u.trialEndsAt) {
      trialStatus = new Date(u.trialEndsAt) > now ? 'active' : 'expired';
    }

    const xeroConnected = !!(u.xeroAccessToken && u.xeroTenantId);
    const jobCount = jobCounts[u.email] || 0;
    const quoteCount = quoteCounts[u.email] || 0;

    const activationScore =
      (u.onboardingComplete ? 1 : 0) +
      (xeroConnected ? 1 : 0) +
      (jobCount >= 1 ? 1 : 0) +
      (quoteCount >= 1 ? 1 : 0);

    // Normalise tier: null/undefined → 'free', empty string → 'free'
    const tier = u.tier || 'free';

    return {
      _id: u._id,
      email: u.email,
      name: u.name || '',
      businessName: u.businessName || '',
      tier,
      trialStatus,
      trialEndsAt: u.trialEndsAt ?? null,
      xeroConnected,
      jobCount,
      quoteCount,
      activationScore,
      onboardingComplete: u.onboardingComplete,
      createdAt: u.createdAt,
    };
  });

  const total = enriched.length;
  const activeTrials = enriched.filter(u => u.trialStatus === 'active').length;
  const expiredTrials = enriched.filter(u => u.trialStatus === 'expired').length;
  const paying = enriched.filter(u => u.tier !== 'free').length;

  return NextResponse.json({ users: enriched, stats: { total, activeTrials, expiredTrials, paying } });
}

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';

export async function GET(_req: Request, { params }: { params: Promise<{ email: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { email } = await params;
  const userEmail = decodeURIComponent(email);

  await connectDB();

  const user = await User.findOne({ email: userEmail }).select('-password').lean() as any;
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const [jobs, quotes, invoices] = await Promise.all([
    Job.find({ userEmail }).sort({ createdAt: -1 }).limit(20).lean(),
    Quote.find({ userEmail }).sort({ createdAt: -1 }).limit(20).lean(),
    Invoice.find({ userEmail }).sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const now = new Date();
  let trialStatus: 'active' | 'expired' | 'none' = 'none';
  if (user.trialEndsAt) {
    trialStatus = new Date(user.trialEndsAt) > now ? 'active' : 'expired';
  }

  return NextResponse.json({
    user: {
      ...user,
      trialStatus,
      xeroConnected: !!(user.xeroAccessToken && user.xeroTenantId),
    },
    jobs,
    quotes,
    invoices,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ email: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { email } = await params;
  const userEmail = decodeURIComponent(email);
  const body = await req.json();

  await connectDB();

  const allowed = ['tier', 'trialEndsAt', 'adminNotes'];
  const update: Record<string, unknown> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      update[key] = body[key];
    }
  }

  if (body.action === 'extend-trial') {
    const user = await User.findOne({ email: userEmail }).lean() as any;
    const base = user?.trialEndsAt && new Date(user.trialEndsAt) > new Date()
      ? new Date(user.trialEndsAt)
      : new Date();
    base.setDate(base.getDate() + 7);
    update.trialEndsAt = base;
  }

  if (body.action === 'reset-trial') {
    const resetDate = new Date();
    resetDate.setDate(resetDate.getDate() + 14);
    update.trialEndsAt = resetDate;
    update.tier = 'free';
  }

  const user = await User.findOneAndUpdate(
    { email: userEmail },
    { $set: update },
    { new: true },
  ).select('-password').lean();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ success: true, user });
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummykeyforbuildonly', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select('stripeCustomerId');

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Complete a purchase first to access the billing portal.' },
        { status: 400 }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/settings/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Stripe Portal Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to open billing portal' }, { status: 500 });
  }
}

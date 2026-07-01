import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummykeyforbuildonly', {
  apiVersion: '2024-12-18.acacia' as any,
});

// Create new Stripe products at $49/mo, $149/mo, $497/mo and set these env vars
const PRICE_IDS: Record<string, string> = {
  solo: process.env.STRIPE_PRICE_SOLO || 'price_placeholder_solo',         // $49/mo
  pro: process.env.STRIPE_PRICE_PRO || 'price_placeholder_pro',            // $149/mo
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_placeholder_enterprise', // $497/mo
  starter: process.env.STRIPE_PRICE_SOLO || 'price_placeholder_solo',      // legacy → solo
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { plan, priceId, cancelUrl, successUrl } = await req.json().catch(() => ({}));
    
    // Resolve price ID
    let resolvedPriceId = priceId;
    if (plan && plan.toLowerCase() in PRICE_IDS) {
      resolvedPriceId = PRICE_IDS[plan.toLowerCase() as keyof typeof PRICE_IDS];
    }

    if (!resolvedPriceId) {
      return NextResponse.json({ error: 'Invalid plan or priceId provided' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: resolvedPriceId,
          quantity: 1,
        },
      ],
      client_reference_id: session.user.id,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        priceId: resolvedPriceId,
      },
      success_url: successUrl || `${origin}/settings/billing?checkout=success`,
      cancel_url: cancelUrl || `${origin}/settings/billing?checkout=cancelled`,
    });

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

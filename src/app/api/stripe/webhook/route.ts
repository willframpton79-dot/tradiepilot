import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { sendPaymentConfirmation } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummykeyforbuildonly', {
  apiVersion: '2024-12-18.acacia' as any,
});

const PRICE_TO_TIER_MAP: Record<string, 'solo' | 'starter' | 'pro' | 'enterprise'> = {
  // New pricing (set STRIPE_PRICE_SOLO/PRO/ENTERPRISE in env)
  ...(process.env.STRIPE_PRICE_SOLO ? { [process.env.STRIPE_PRICE_SOLO]: 'solo' as const } : {}),
  ...(process.env.STRIPE_PRICE_PRO ? { [process.env.STRIPE_PRICE_PRO]: 'pro' as const } : {}),
  ...(process.env.STRIPE_PRICE_ENTERPRISE ? { [process.env.STRIPE_PRICE_ENTERPRISE]: 'enterprise' as const } : {}),
  // Legacy price IDs kept for existing subscribers
  'price_1TcJIo1opAZJp3NeliN654IQ': 'starter',
  'price_1TcJJH1opAZJp3NeMhk5l8UH': 'pro',
  'price_1Tgfuq1opAZJp3NeZdCMfqcu': 'enterprise',
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    await connectDB();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id || session.metadata?.userId;
      const userEmail = session.customer_email || session.metadata?.userEmail;
      const priceId = session.metadata?.priceId;
      const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;

      if (!userId) {
        console.error('No userId found in checkout session client_reference_id or metadata');
        return NextResponse.json({ error: 'No userId found' }, { status: 400 });
      }

      let tier: 'solo' | 'starter' | 'pro' | 'enterprise' | 'free' = 'free';
      if (priceId && priceId in PRICE_TO_TIER_MAP) {
        tier = PRICE_TO_TIER_MAP[priceId];
      } else {
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const itemPriceId = lineItems.data[0]?.price?.id;
          if (itemPriceId && itemPriceId in PRICE_TO_TIER_MAP) {
            tier = PRICE_TO_TIER_MAP[itemPriceId];
          }
        } catch (lineError) {
          console.error('Error fetching checkout session line items:', lineError);
        }
      }

      const updateFields: any = { tier };
      if (stripeCustomerId) updateFields.stripeCustomerId = stripeCustomerId;

      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

      if (updatedUser) {
        try {
          const amount = (session.amount_total || 0) / 100;
          await sendPaymentConfirmation(
            updatedUser.email,
            updatedUser.name || 'TradiePilot User',
            tier.charAt(0).toUpperCase() + tier.slice(1),
            amount
          );
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
        }
      } else {
        console.error(`User with ID ${userId} not found during webhook processing`);
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id;
      const priceId = subscription.items.data[0]?.price?.id;
      const tier = priceId && priceId in PRICE_TO_TIER_MAP
        ? PRICE_TO_TIER_MAP[priceId]
        : null;

      if (tier) {
        await User.findOneAndUpdate({ stripeCustomerId }, { tier });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id;

      await User.findOneAndUpdate({ stripeCustomerId }, { tier: 'free' });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

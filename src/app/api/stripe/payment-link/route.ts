import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import Stripe from 'stripe';
import { sendPaymentLink } from '@/lib/email';

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const isDummyKey = !STRIPE_KEY || STRIPE_KEY.startsWith('sk_test_dummy');

const stripe = new Stripe(STRIPE_KEY || 'sk_test_dummykeyforbuildonly', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const { jobId, amount, clientEmail, clientName, description, jobName, sendEmail, paymentUrl } = await req.json().catch(() => ({}));

    if (!jobId || !amount) {
      return NextResponse.json({ error: 'Missing required fields: jobId and amount' }, { status: 400 });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    // If we only want to trigger the email send for an already generated payment link
    if (sendEmail) {
      const emailUrl = paymentUrl;
      if (!emailUrl) {
        return NextResponse.json({ error: 'Missing paymentUrl for sending email' }, { status: 400 });
      }

      const emailResult = await sendPaymentLink(
        clientName || 'Valued Client',
        clientEmail || session.user.email, // fallback to user email
        jobName || `Job #${jobId}`,
        numericAmount,
        emailUrl
      );

      if (!emailResult.success) {
        return NextResponse.json({ error: 'Failed to send email via Resend' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    }

    // Demo mode / Dummy key handling
    if (isDummyKey) {
      console.log('Stripe dummy key detected, returning mock payment link');
      return NextResponse.json({ 
        url: 'https://checkout.stripe.com/c/pay/test_demo_link', 
        paymentLinkId: 'plink_demo123',
        isMock: true 
      });
    }

    // Otherwise, generate the Stripe Payment Link
    // 1. Create a Stripe Product for this payment link
    const product = await stripe.products.create({
      name: `Payment request: ${jobName || 'Job #' + jobId}`,
      description: description || `Payment request for Job ID: ${jobId}`,
      metadata: {
        jobId,
        clientName: clientName || '',
        clientEmail: clientEmail || '',
      },
    });

    // 2. Create a Price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(numericAmount * 100), // in cents
      currency: 'aud',
    });

    // 3. Create a Stripe Payment Link using the Price
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      metadata: {
        jobId,
        clientName: clientName || '',
        clientEmail: clientEmail || '',
        description: description || '',
      },
    });

    return NextResponse.json({ url: paymentLink.url, paymentLinkId: paymentLink.id });
  } catch (error: any) {
    console.error('Stripe Payment Link Creation Error:', error);
    
    // Fallback for key errors during development/testing
    if (error.message.includes('API key') || error.message.includes('No API key')) {
      return NextResponse.json({ 
        url: 'https://checkout.stripe.com/c/pay/test_demo_link', 
        paymentLinkId: 'plink_demo123',
        isMock: true 
      });
    }

    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

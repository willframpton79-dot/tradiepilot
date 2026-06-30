import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { requireAuth } from '@/lib/session';
import { sendCustomQuoteReminder } from '@/lib/email';
import mongoose from 'mongoose';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { id } = await params;
    await connectDB();

    let query: any = { userEmail };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { ...query, _id: id };
    } else {
      query = { ...query, quoteId: id };
    }

    const quote = await Quote.findOne(query).lean();
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (!quote.clientEmail) {
      return NextResponse.json(
        { error: 'No client email on file for this quote. Edit the quote to add one before sending a reminder.' },
        { status: 400 }
      );
    }

    const result = await sendCustomQuoteReminder(
      quote.clientEmail,
      quote.client,
      quote.job || 'Your Project',
      quote.amountIncGst || quote.amount
    );

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 });
    }

    // Update quote record with last reminder date
    await Quote.updateOne(query, {
      $set: { lastReminderSent: new Date() },
      $inc: { followups: 1 }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/quotes/[id]/reminder error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

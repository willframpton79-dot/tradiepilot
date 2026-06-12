import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { requireAuth } from '@/lib/session';

// GET /api/quotes — list all quotes for current user
export async function GET() {
  try {
    const userEmail = await requireAuth();
    await connectDB();
    const quotes = await Quote.find({ userEmail }).sort({ daysSince: -1 }).lean();
    return NextResponse.json(quotes);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('GET /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}

// PATCH /api/quotes — update quote status (for follow-up tracking)
export async function PATCH(request: NextRequest) {
  try {
    const userEmail = await requireAuth();
    await connectDB();
    const body = await request.json();
    const { quoteId, status, followups } = body;

    if (!quoteId) {
      return NextResponse.json({ error: 'quoteId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (typeof followups === 'number') updateData.followups = followups;

    const updated = await Quote.findOneAndUpdate(
      { quoteId, userEmail },
      { $set: updateData },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('PATCH /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

// POST /api/quotes — create new quote
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    await connectDB();
    const body = await request.json();
    
    // Generate a simple quote ID if not provided
    const quoteId = body.quoteId || `Q-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const quoteNumber = body.quoteNumber || quoteId;

    const amount = parseFloat(body.amount) || 0;
    const amountIncGst = body.includeGst ? amount * 1.1 : amount;
    const amountExGst = body.includeGst ? amount : amount / 1.1;
    const gstAmount = amountIncGst - amountExGst;

    const newQuote = await Quote.create({
      ...body,
      userEmail,
      quoteId,
      quoteNumber,
      amount,
      amountExGst,
      amountIncGst,
      gstAmount,
      sentDate: new Date().toISOString().split('T')[0],
      daysSince: 0,
      status: 'pending',
    });

    return NextResponse.json(newQuote);
  } catch (error: any) {
    console.error('POST /api/quotes error:', error);
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
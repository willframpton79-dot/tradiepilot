import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';

interface QuoteUpdate {
  status?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: QuoteUpdate = await request.json();
    await connectDB();
    const quote = await Quote.findOneAndUpdate(
      { id },
      { ...(body.status && { status: body.status }) },
      { new: true }
    );
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, quote });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

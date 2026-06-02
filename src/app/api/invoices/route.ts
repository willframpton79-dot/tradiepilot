import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Invoice } from '@/models/Invoice';

// GET /api/invoices — list all invoices
export async function GET() {
  try {
    await connectDB();
    const invoices = await Invoice.find({}).sort({ daysOverdue: -1 }).lean();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('GET /api/invoices error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// PATCH /api/invoices — update invoice status (e.g. mark as paid)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { invoiceId, status } = body;

    if (!invoiceId || !status) {
      return NextResponse.json({ error: 'invoiceId and status are required' }, { status: 400 });
    }

    const updated = await Invoice.findOneAndUpdate(
      { invoiceId },
      { $set: { status } },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/invoices error:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
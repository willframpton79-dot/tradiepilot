import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { sendClientInvoiceReminder } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const { clientEmail, clientName, projectName, amount, dueDate } = body;

    if (!clientName || !projectName || !amount || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!clientEmail) {
      return NextResponse.json(
        { error: 'No client email on file for this invoice. Add one before sending a reminder.' },
        { status: 400 }
      );
    }

    const result = await sendClientInvoiceReminder(
      clientEmail,
      clientName,
      projectName,
      amount,
      dueDate
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/invoices/remind error:', error);
    return NextResponse.json({ error: 'Failed to send reminder' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { runAutomationEngine } from '@/lib/automation';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db';
import { sendQuoteFollowUpReminder, sendClientInvoiceReminder } from '@/lib/email';

export async function POST() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    await connectDB();

    // 1. Fetch user's name from User model
    const user = await User.findOne({ email: userEmail });
    const userName = user?.name || user?.businessName || 'Tradie';

    // 2. Run the automation engine
    const summary = await runAutomationEngine(userEmail);

    const todayStr = new Date().toDateString();
    let emailsSent = 0;
    const quotesProcessed: string[] = [];
    const invoicesProcessed: string[] = [];

    // 3. Process quote followups (urgent and high priority)
    const quoteActions = summary.quoteFollowups.filter(
      (a) => a.priority === 'urgent' || a.priority === 'high'
    );

    for (const action of quoteActions) {
      const quote = await Quote.findOne({ quoteId: action.targetId, userEmail });
      if (!quote) continue;

      const alreadySentToday = quote.lastReminderSent && 
        new Date(quote.lastReminderSent).toDateString() === todayStr;

      if (alreadySentToday) continue;

      // Send Email
      const result = await sendQuoteFollowUpReminder(
        userEmail,
        userName,
        quote.quoteNumber || quote.quoteId,
        quote.amount
      );

      if (result.success) {
        quote.lastReminderSent = new Date();
        await quote.save();
        emailsSent++;
        quotesProcessed.push(quote.quoteId);
      } else {
        console.error(`Failed to send quote follow-up reminder for ${quote.quoteId}:`, result.error);
      }
    }

    // 4. Process invoice chases (urgent and high priority)
    const invoiceActions = summary.invoiceChases.filter(
      (a) => a.priority === 'urgent' || a.priority === 'high'
    );

    for (const action of invoiceActions) {
      const invoice = await Invoice.findOne({ invoiceId: action.targetId, userEmail });
      if (!invoice) continue;

      const alreadySentToday = invoice.lastReminderSent &&
        new Date(invoice.lastReminderSent).toDateString() === todayStr;

      if (alreadySentToday) continue;
      if (!invoice.clientEmail) continue;

      // Send Email
      const result = await sendClientInvoiceReminder(
        invoice.clientEmail,
        invoice.client,
        invoice.job,
        invoice.amount,
        invoice.dueDate
      );

      if (result.success) {
        invoice.lastReminderSent = new Date();
        await invoice.save();
        emailsSent++;
        invoicesProcessed.push(invoice.invoiceId);
      } else {
        console.error(`Failed to send invoice chase reminder for ${invoice.invoiceId}:`, result.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed reminders. Sent ${emailsSent} email(s).`,
      details: {
        emailsSent,
        quotesProcessed,
        invoicesProcessed
      }
    });

  } catch (error: any) {
    console.error('POST /api/automation/trigger-reminders error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Trigger reminders failed' },
      { status: 500 }
    );
  }
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev_mode');

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TradiePilot <notifications@tradiepilot.app>',
      to: [email],
      subject: 'Welcome to TradiePilot — Let\'s Maximize Your Profit!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Welcome to TradiePilot, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            We are absolutely thrilled to have you on board. TradiePilot is built specifically for trade businesses like yours to gain real-time visibility into your active job margins, automate quote follow-ups, and proactively chase invoices.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Here are your next steps to get started:
          </p>
          <ol style="font-size: 16px; line-height: 1.6; color: #1e293b; padding-left: 20px;">
            <li>Complete your business onboarding profile.</li>
            <li>Connect your accounting software (Xero, MYOB, or QuickBooks).</li>
            <li>Set your business target margin to unlock intelligent profitability tracking.</li>
          </ol>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://tradiepilot.app/onboarding" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Onboarding</a>
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            TradiePilot Pty Ltd, Australia. All rights reserved.
          </p>
        </div>
      `,
      text: `Hello ${name},\n\nWelcome to TradiePilot! We're thrilled to help you keep your profit and understand your numbers.\n\nNext steps to get started:\n1. Complete your business onboarding profile at /onboarding\n2. Connect your Xero/MYOB data\n3. Set your target margin\n\nGo to onboarding: https://tradiepilot.app/onboarding\n\nBest,\nThe TradiePilot Team`,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send welcome email:', err);
    return { success: false, error: err.message || err };
  }
}

export async function sendPaymentConfirmation(email: string, name: string, tierName: string, amount: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TradiePilot <notifications@tradiepilot.app>',
      to: [email],
      subject: `Payment Confirmed: Welcome to TradiePilot ${tierName}!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Payment Confirmation</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Hi ${name},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Your payment has been successfully processed! You are now subscribed to the <strong>TradiePilot ${tierName} Plan</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; font-size: 15px; color: #334155; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0;"><strong>Plan:</strong></td>
                <td style="text-align: right; padding: 6px 0;">${tierName} Plan (Subscription)</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Amount Paid:</strong></td>
                <td style="text-align: right; padding: 6px 0; font-weight: bold; color: #4f46e5;">$${amount.toFixed(2)} AUD</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Billing Period:</strong></td>
                <td style="text-align: right; padding: 6px 0;">Monthly</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            All pro-tier automation features are now unlocked. If you haven't yet, log into your dashboard to set up your target margin and start tracking your job profitability.
          </p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://tradiepilot.app/dashboard" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            TradiePilot Pty Ltd, Australia. All rights reserved.
          </p>
        </div>
      `,
      text: `Hi ${name},\n\nYour payment has been successfully processed! You are now subscribed to the TradiePilot ${tierName} Plan.\n\nAmount Paid: ${amount.toFixed(2)} AUD\nBilling Period: Monthly\n\nLog in here: https://tradiepilot.app/dashboard\n\nBest,\nThe TradiePilot Team`,
    });

    if (error) {
      console.error('Error sending payment confirmation email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send payment confirmation email:', err);
    return { success: false, error: err.message || err };
  }
}

export async function sendQuoteFollowUpReminder(email: string, name: string, quoteNumber: string, amount: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TradiePilot <notifications@tradiepilot.app>',
      to: [email],
      subject: `Automated Quote Follow-up: Quote #${quoteNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Quote Follow-up Reminder</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Hi ${name},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            This is an automated reminder that your customer hasn't accepted <strong>Quote #${quoteNumber}</strong> yet (Valued at <strong>$${amount.toLocaleString()}</strong>).
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Following up on quotes within 3-5 days increases conversion rates by up to 28%. We recommend sending a quick, friendly text or email from your Smart Quoting dashboard to nudge the client.
          </p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://tradiepilot.app/quotes" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Manage Quote #${quoteNumber}</a>
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            TradiePilot Pty Ltd, Australia. All rights reserved.
          </p>
        </div>
      `,
      text: `Hi ${name},\n\nThis is an automated reminder that your customer hasn't accepted Quote #${quoteNumber} yet (Valued at ${amount.toLocaleString()}).\n\nFollowing up on quotes promptly increases conversion. Manage your quotes on your TradiePilot dashboard:\nhttps://tradiepilot.app/quotes\n\nBest,\nThe TradiePilot Team`,
    });

    if (error) {
      console.error('Error sending quote follow-up email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send quote follow-up email:', err);
    return { success: false, error: err.message || err };
  }
}

export async function sendInvoiceChaseReminder(email: string, name: string, invoiceNumber: string, amount: number, daysOverdue: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TradiePilot <notifications@tradiepilot.app>',
      to: [email],
      subject: `Overdue Invoice Alert: Invoice #${invoiceNumber} is ${daysOverdue} Days Overdue`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ef4444; margin-bottom: 20px;">Overdue Invoice Warning</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Hi ${name},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            We've detected that <strong>Invoice #${invoiceNumber}</strong> (Outstanding balance: <strong>$${amount.toLocaleString()}</strong>) is now <strong>${daysOverdue} days overdue</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            TradiePilot has prepared an automated payment nudge. You can also view this invoice in your Invoices page to initiate a formal statutory demand notice or use our SOPA (Security of Payment Act) escalations if needed.
          </p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="https://tradiepilot.app/invoices" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Invoice Escalations</a>
          </div>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            TradiePilot Pty Ltd, Australia. All rights reserved.
          </p>
        </div>
      `,
      text: `Hi ${name},\n\nWe've detected that Invoice #${invoiceNumber} (Outstanding balance: ${amount.toLocaleString()}) is now ${daysOverdue} days overdue.\n\nTradiePilot has prepared payment chases. Review outstanding invoices and SOPA escalations on your dashboard:\nhttps://tradiepilot.app/invoices\n\nBest,\nThe TradiePilot Team`,
    });

    if (error) {
      console.error('Error sending invoice chase email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send invoice chase email:', err);
    return { success: false, error: err.message || err };
  }
}

export async function sendPaymentLink(clientName: string, clientEmail: string, jobName: string, amount: number, paymentUrl: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'TradiePilot Payments <billing@tradiepilot.app>',
      to: [clientEmail],
      subject: `Secure Payment Request: ${jobName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">Payment Request</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            Dear ${clientName},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            A secure payment request of <strong>$${amount.toFixed(2)} AUD</strong> has been generated for the job <strong>${jobName}</strong>.
          </p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <table style="width: 100%; font-size: 15px; color: #334155; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0;"><strong>Job / Project:</strong></td>
                <td style="text-align: right; padding: 6px 0;">${jobName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><strong>Amount Due:</strong></td>
                <td style="text-align: right; padding: 6px 0; font-weight: bold; color: #4f46e5;">$${amount.toFixed(2)} AUD</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #1e293b;">
            To complete this payment securely on-site or online via Stripe, please click the link below:
          </p>
          <div style="margin-top: 30px; text-align: center;">
            <a href="${paymentUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Pay Securely Now</a>
          </div>
          <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 20px;">
            This is a secure on-site payment request powered by Stripe.
          </p>
          <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            TradiePilot Pty Ltd, Australia. All rights reserved.
          </p>
        </div>
      `,
      text: `Dear ${clientName},\n\nA secure payment request of $${amount.toFixed(2)} AUD has been generated for the job ${jobName}.\n\nTo complete this payment securely, please visit: ${paymentUrl}\n\nThis is a secure on-site payment powered by Stripe.\n\nBest regards,\nThe TradiePilot Team`,
    });

    if (error) {
      console.error('Error sending payment link email:', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Failed to send payment link email:', err);
    return { success: false, error: err.message || err };
  }
}

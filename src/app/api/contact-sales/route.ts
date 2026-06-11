import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_dev_mode');

export async function POST(req: Request) {
  try {
    const { name, businessName, annualRevenue, staffCount, email, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'TradiePilot Leads <onboarding@resend.dev>',
      to: ['william@automation-layer.com'],
      subject: `New Enterprise Lead: ${businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">New Enterprise Lead Received</h2>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Business Name:</strong> ${businessName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Annual Revenue:</strong> ${annualRevenue}</p>
            <p style="margin: 0 0 10px 0;"><strong>Number of Staff:</strong> ${staffCount}</p>
            <p style="margin: 0 0 10px 0;"><strong>Work Email:</strong> ${email}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; line-height: 1.5; color: #334155;">${message || 'No message provided.'}</p>
          </div>
          <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 30px;">
            TradiePilot Lead Generation System
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Contact sales API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

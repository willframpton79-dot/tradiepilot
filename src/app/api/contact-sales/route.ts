import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log('POST /api/contact-sales reached');
  
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is missing');
      return NextResponse.json({ error: 'Email configuration error (Missing API Key)' }, { status: 500 });
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Failed to parse request body as JSON');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { name, businessName, annualRevenue, staffCount, email, message } = body;
    console.log('Lead data received:', { name, businessName, email });

    // Dynamic import to avoid build-time instantiation issues
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    
    const { data, error } = await resend.emails.send({
      from: 'TradiePilot Leads <notifications@tradiepilot.app>',
      to: ['willframpton79@gmail.com'],
      subject: `New Enterprise Lead: ${businessName || 'Unknown'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">New Enterprise Lead Received</h2>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px;">
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Business Name:</strong> ${businessName || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Annual Revenue:</strong> ${annualRevenue || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Number of Staff:</strong> ${staffCount || 'N/A'}</p>
            <p style="margin: 0 0 10px 0;"><strong>Work Email:</strong> ${email || 'N/A'}</p>
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
      console.error('Resend API returned an error:', error);
      return NextResponse.json({ 
        error: 'Resend API failure', 
        details: error.message || error 
      }, { status: 500 });
    }

    console.log('Email sent successfully via Resend:', data?.id);
    return NextResponse.json({ success: true, id: data?.id });

  } catch (err: any) {
    console.error('CRITICAL: Contact sales API crashed:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}

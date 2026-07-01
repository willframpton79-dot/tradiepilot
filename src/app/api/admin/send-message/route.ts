import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/session';

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { email, subject, message } = await req.json();
  if (!email || !subject || !message) {
    return NextResponse.json({ error: 'email, subject and message are required' }, { status: 400 });
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
      <div style="margin-bottom: 24px;">
        ${message
          .split('\n')
          .map((line: string) => line.trim()
            ? `<p style="margin: 0 0 12px 0; line-height: 1.6;">${line}</p>`
            : '<br>')
          .join('')}
      </div>
      <p style="margin: 0; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        Will — TradiePilot<br>
        <a href="https://tradiepilot.app" style="color: #4f46e5;">tradiepilot.app</a>
      </p>
    </div>
  `;

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
    const { error } = await resend.emails.send({
      from: 'TradiePilot <notifications@tradiepilot.app>',
      to: [email],
      subject,
      html,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('send-message error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send' }, { status: 500 });
  }
}

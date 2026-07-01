import Anthropic from '@anthropic-ai/sdk';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { User } from '@/models/User';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-dummy-for-build',
});

const SYSTEM_PROMPT = `You are TradiePilot's profit intelligence advisor. You write a weekly business summary for Australian trade business owners and their office managers.

Your tone is: direct, practical, plain English. No jargon. No filler phrases. You speak like a sharp accountant who actually understands trades — not a generic AI assistant.

You always write in this structure:
1. One opening sentence on overall business health this week (margin vs target, trending up or down)
2. The single most urgent invoice or payment to chase — specific client name, amount, days overdue
3. The single most important quote to follow up — specific client, amount, days since sent
4. One job-level margin alert — a job trending below target that needs attention now
5. One positive observation — a job type or client performing above average that they should do more of
6. One clear action for this week — the single most important thing they should do in the next 7 days

Keep the entire email under 250 words. Use the business owner's first name in the opening. Address it to the office manager if userRole is 'admin'.

Never say "unlock", "streamline", "leverage", "game-changer", or anything that sounds like generic SaaS marketing copy.`;

export async function generateWeeklyReportForUser(userEmail: string): Promise<{
  subject: string;
  body: string;
  userName: string;
}> {
  await connectDB();

  const user = await User.findOne({ email: userEmail }).lean() as any;
  if (!user) throw new Error(`User not found: ${userEmail}`);

  const firstName = ((user.name as string) || 'there').split(' ')[0];
  const userRole = (user.userRole as string) || 'owner';
  const businessName = (user.businessName as string) || 'your business';
  const targetMarginPct = (user.targetMargin as number) || 30;

  const [jobs, quotes, invoices] = await Promise.all([
    Job.find({ userEmail }).lean(),
    Quote.find({ userEmail }).lean(),
    Invoice.find({ userEmail }).lean(),
  ]);

  const activeJobs = jobs as any[];
  const allQuotes = quotes as any[];
  const allInvoices = invoices as any[];

  const avgMargin = activeJobs.length > 0
    ? (activeJobs.reduce((s, j) => s + (j.marginPct || 0), 0) / activeJobs.length).toFixed(1)
    : '0';

  const overdueInvoices = allInvoices
    .filter(inv => inv.status === 'overdue')
    .sort((a, b) => (b.amount || 0) - (a.amount || 0));

  const pendingQuotes = allQuotes
    .filter(q => !['won', 'lost'].includes(q.status))
    .sort((a, b) => (b.amount || 0) - (a.amount || 0));

  const belowTargetJobs = activeJobs
    .filter(j => (j.marginPct || 0) < targetMarginPct)
    .sort((a, b) => (a.marginPct || 0) - (b.marginPct || 0));

  const bestJob = [...activeJobs].sort((a, b) => (b.marginPct || 0) - (a.marginPct || 0))[0];

  const dataContext = `
BUSINESS: ${businessName}
USER: ${firstName} (${userRole === 'admin' ? 'office manager / admin' : 'business owner'})
TARGET MARGIN: ${targetMarginPct}%
CURRENT AVG MARGIN: ${avgMargin}%

ACTIVE JOBS (${activeJobs.length} total):
${activeJobs.slice(0, 6).map(j => `- ${j.title || 'Untitled'} (${j.client?.name || 'No client'}) — ${j.marginPct || 0}% margin, $${(j.quotedTotal || 0).toLocaleString()} contract`).join('\n') || 'No jobs yet'}

OVERDUE INVOICES (${overdueInvoices.length} total):
${overdueInvoices.slice(0, 3).map(inv => `- ${inv.client || 'Unknown client'}: $${(inv.amount || 0).toLocaleString()} — ${inv.daysOverdue || 0} days overdue`).join('\n') || 'None'}

PENDING QUOTES (${pendingQuotes.length} total):
${pendingQuotes.slice(0, 3).map(q => `- ${q.client || 'Unknown client'}: $${(q.amount || 0).toLocaleString()} — ${q.daysSince || 0} days since sent`).join('\n') || 'None'}

JOB BELOW TARGET:
${belowTargetJobs[0] ? `${belowTargetJobs[0].title || 'Untitled'} — ${belowTargetJobs[0].marginPct || 0}% (target: ${targetMarginPct}%)` : 'All jobs at or above target'}

BEST PERFORMING JOB:
${bestJob ? `${bestJob.title || 'Untitled'} — ${bestJob.marginPct || 0}% margin` : 'No jobs yet'}
`.trim();

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate this week's profit summary for ${firstName}.\n\n${dataContext}`,
      },
    ],
  });

  const body = message.content[0].type === 'text' ? message.content[0].text : '';
  const week = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const subject = `Your weekly profit summary — ${week}`;

  return { subject, body, userName: firstName };
}

export async function sendWeeklyReportEmail(
  userEmail: string,
  subject: string,
  body: string,
  userName: string,
): Promise<void> {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

  const htmlBody = body
    .split('\n\n')
    .map(para => `<p style="font-size:15px;line-height:1.7;color:#1e293b;margin:0 0 16px;">${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  await resend.emails.send({
    from: 'TradiePilot <reports@tradiepilot.app>',
    to: [userEmail],
    subject,
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;">
  <div style="margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #4f46e5;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#4f46e5;letter-spacing:0.1em;text-transform:uppercase;">TradiePilot Weekly Profit Summary</p>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:800;color:#0f172a;">${subject.replace('Your weekly profit summary — ', '')}</h1>
  </div>
  ${htmlBody}
  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;">
    <a href="https://tradiepilot.app/dashboard" style="display:inline-block;background:#4f46e5;color:#ffffff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:8px;text-decoration:none;">Open Dashboard</a>
  </div>
  <p style="margin-top:24px;font-size:11px;color:#94a3b8;text-align:center;">
    TradiePilot · Automation Layer ABN 55 388 054 921 · <a href="https://tradiepilot.app/settings/email-preferences" style="color:#94a3b8;">Manage email preferences</a>
  </p>
</div>`,
    text: `${subject}\n\n${body}\n\nOpen your dashboard: https://tradiepilot.app/dashboard`,
  });
}

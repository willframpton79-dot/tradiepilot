import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { requireAuth } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { AiCache } from '@/models/AiCache';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { User } from '@/models/User';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-dummy-for-build',
});

const DAILY_LIMIT = 20;

function getDailyKey() {
  return `chat-usage-${new Date().toISOString().split('T')[0]}`;
}

function getMidnight() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// GET /api/ai/chat — return today's usage
export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    await connectDB();
    const doc = await AiCache.findOne({ userEmail, key: getDailyKey() }).lean() as any;
    const used = doc?.data?.count || 0;
    return NextResponse.json({ used, remaining: Math.max(0, DAILY_LIMIT - used), limit: DAILY_LIMIT });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/ai/chat — stream a reply
export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { message, conversationHistory = [] } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await connectDB();

    // Check + increment rate limit atomically
    const key = getDailyKey();
    const usageDoc = await AiCache.findOne({ userEmail, key }).lean() as any;
    const currentCount = usageDoc?.data?.count || 0;

    if (currentCount >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit of ${DAILY_LIMIT} messages reached. Resets at midnight UTC.` },
        { status: 429 },
      );
    }

    const newCount = currentCount + 1;
    await AiCache.findOneAndUpdate(
      { userEmail, key },
      { userEmail, key, data: { count: newCount }, generatedAt: new Date(), expiresAt: getMidnight() },
      { upsert: true },
    );

    // Fetch user context
    const [user, jobs, quotes, invoices] = await Promise.all([
      User.findOne({ email: userEmail }).select('businessName targetMargin name').lean() as any,
      Job.find({ userEmail }).sort({ createdAt: -1 }).limit(10).lean(),
      Quote.find({ userEmail, status: { $nin: ['won', 'lost'] } }).lean(),
      Invoice.find({ userEmail, status: 'overdue' }).lean(),
    ]);

    const businessName = (user as any)?.businessName || 'your business';
    const targetMargin = (user as any)?.targetMargin || 30;
    const jobList = jobs as any[];
    const quoteList = quotes as any[];
    const invoiceList = invoices as any[];

    const avgMargin = jobList.length
      ? (jobList.reduce((s, j) => s + (j.marginPct || 0), 0) / jobList.length).toFixed(1)
      : '0';

    const dataContext = `
ACTIVE JOBS (${jobList.length}, most recent first):
${jobList.map(j => `- ${j.title} | ${j.client?.name || 'No client'} | ${j.marginPct || 0}% margin | $${(j.quotedTotal || 0).toLocaleString()} contract | Status: ${j.status}`).join('\n') || 'No jobs'}

PENDING QUOTES (${quoteList.length}):
${quoteList.map(q => `- ${q.client} | $${(q.amount || 0).toLocaleString()} | ${q.daysSince || 0} days since sent | Status: ${q.status}`).join('\n') || 'None'}

OVERDUE INVOICES (${invoiceList.length}):
${invoiceList.map(i => `- ${i.client} | $${(i.amount || 0).toLocaleString()} | ${i.daysOverdue || 0} days overdue`).join('\n') || 'None'}

BUSINESS SUMMARY:
- Average margin across all jobs: ${avgMargin}%
- Target margin: ${targetMargin}%
- Business name: ${businessName}`.trim();

    const systemPrompt = `You are TradiePilot's business advisor for ${businessName}. You have access to their real business data.

THEIR CURRENT DATA:
${dataContext}

You answer questions about their business in plain English. You are direct, specific, and practical. You reference their actual numbers when answering.

You can help them understand:
- Which jobs made the most money and why
- Which clients or job types to prioritise
- What their margin trends mean
- What to chase or follow up this week
- How to read their dashboard data

You cannot: access external market data, make legal or tax decisions, or access data you haven't been given above.

If asked something outside your scope, say so directly and suggest they ask their accountant or bookkeeper.

Never use filler phrases. Never say "Great question!" or "Certainly!" — just answer.`;

    const messages = [
      ...conversationHistory.slice(-10).map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const remaining = Math.max(0, DAILY_LIMIT - newCount);

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Usage-Remaining': String(remaining),
        'X-Usage-Used': String(newCount),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('POST /api/ai/chat error:', error);
    return NextResponse.json({ error: error.message || 'Failed to respond' }, { status: 500 });
  }
}

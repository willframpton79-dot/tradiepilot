import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { requireAuth } from '@/lib/session';
import { connectDB } from '@/lib/db';
import { AiCache } from '@/models/AiCache';
import { runAutomationEngine } from '@/lib/automation';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-ant-dummy-for-build',
});

const SYSTEM_PROMPT = `You are TradiePilot's in-app profit coach. You write short, sharp, actionable insight cards for Australian trade business owners.

Each insight must be:
- Maximum 2 sentences
- Specific (include job names, amounts, percentages from the data)
- Action-oriented (what should they do, not just what's happening)
- Plain English — no jargon, no filler

Return a JSON array of up to 3 insight objects, each with:
- type: "warning" | "opportunity" | "action"
- title: string (5 words max)
- body: string (2 sentences max)
- action: string (the CTA text, e.g. "Raise a variation" or "Follow up today")
- link: string (the route to navigate to, e.g. "/jobs" or "/invoices" or "/quotes")

Only return the JSON array. No preamble, no explanation.`;

// GET /api/ai/profit-coach?refresh=true
export async function GET(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const url = new URL(req.url);
    const refresh = url.searchParams.get('refresh') === 'true';

    await connectDB();

    // Return cached result if fresh
    if (!refresh) {
      const cached = await AiCache.findOne({
        userEmail,
        key: 'profit-coach',
        expiresAt: { $gt: new Date() },
      }).lean() as any;

      if (cached?.data) {
        return NextResponse.json({ insights: cached.data, cached: true });
      }
    }

    // Run the automation engine to get structured business data
    const automation = await runAutomationEngine(userEmail);

    const dataContext = `
AUTOMATION ENGINE OUTPUT:

Quote follow-ups needed (${automation.quoteFollowups.length}):
${automation.quoteFollowups.slice(0, 3).map(a => `- ${a.title} | Client: ${a.customerName} | $${a.amount.toLocaleString()} | ${a.daysElapsed} days | Action: ${a.recommendedAction}`).join('\n') || 'None'}

Overdue invoices (${automation.invoiceChases.length}):
${automation.invoiceChases.slice(0, 3).map(a => `- ${a.title} | Client: ${a.customerName} | $${a.amount.toLocaleString()} | ${a.daysElapsed} days overdue`).join('\n') || 'None'}

Profit leaks on active jobs (${automation.profitLeaks.length}):
${automation.profitLeaks.slice(0, 3).map(a => `- ${a.title} | Client: ${a.customerName} | Slippage: $${a.amount.toLocaleString()} | Action: ${a.recommendedAction}`).join('\n') || 'None'}

Summary: ${automation.totalActionsRequired} total actions, ${automation.urgentActions} urgent. Invoices overdue: ${automation.stats.invoicesOverdue} ($${automation.stats.totalEstimatedLeakAmount.toLocaleString()} leak exposure).
`.trim();

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: dataContext }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '[]';
    let insights: unknown[];
    try {
      const clean = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
      insights = JSON.parse(clean);
      if (!Array.isArray(insights)) insights = [];
    } catch {
      insights = [];
    }

    // Cache for 4 hours
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);
    await AiCache.findOneAndUpdate(
      { userEmail, key: 'profit-coach' },
      { userEmail, key: 'profit-coach', data: insights, generatedAt: new Date(), expiresAt },
      { upsert: true, new: true },
    );

    return NextResponse.json({ insights, cached: false });
  } catch (error: any) {
    console.error('GET /api/ai/profit-coach error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate insights' }, { status: 500 });
  }
}

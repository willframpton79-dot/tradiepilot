/**
 * TradiePilot Automation Engine
 *
 * Core business logic for:
 * 1. Quote Follow-up Scheduling — identifies sent quotes needing attention
 * 2. Invoice Chasing — prioritises overdue invoices by severity
 * 3. Profit Leak Detection — detects active jobs trending over budget
 *
 * Designed to work with both MongoDB (when MONGODB_URI is set) and static data.
 * All functions are pure — they take data and return results.
 */

import { connectDB } from '@/lib/db';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { Job as MongooseJob } from '@/models/Job';
import sampleData, { type Quote as QuoteType, type Invoice as InvoiceType, type JobDetail, type Job as SampleJob } from '@/lib/sampleData';
import insightsData from '@/lib/insightsData';

const DB_ENABLED = !!process.env.MONGODB_URI;
const NOW = new Date();

function daysBetween(dateStr: string, from: Date = NOW): number {
  const d = new Date(dateStr);
  return Math.floor((from.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateStr: string, from: Date = NOW): number {
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export interface FollowUpAction {
  id: string;
  type: 'quote_followup' | 'invoice_chase' | 'profit_leak';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  targetId: string;
  targetType: 'quote' | 'invoice' | 'job';
  customerName: string;
  amount: number;
  daysElapsed: number;
  recommendedAction: string;
  suggestedChannel: 'phone' | 'email' | 'sms' | 'letter';
  autoDraftMessage?: string;
}

export interface AutomationSummary {
  asAtDate: string;
  totalActionsRequired: number;
  urgentActions: number;
  quoteFollowups: FollowUpAction[];
  invoiceChases: FollowUpAction[];
  profitLeaks: FollowUpAction[];
  stats: {
    quotesPendingFollowup: number;
    quotesExpiringThisWeek: number;
    invoicesOverdue: number;
    invoicesCritical: number;
    activeJobsWithLeak: number;
    totalEstimatedLeakAmount: number;
  };
}

export interface ProfitLeakAnalysis {
  jobId: string;
  jobTitle: string;
  customer: string;
  status: string;
  quotedTotal: number;
  spentToDate: number;
  remainingBudget: number;
  estimatedFinalCost: number;
  projectedMargin: number;
  projectedMarginPct: number;
  quotedMargin: number;
  quotedMarginPct: number;
  slippageAmount: number;
  slippagePct: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  recommendations: string[];
}

export function analyzeQuoteFollowups(quotes: { id: string; client: string; job: string; amount: number; sentDate: string; daysSince: number; status: string; followups: number }[]): FollowUpAction[] {
  const actions: FollowUpAction[] = [];

  for (const q of quotes) {
    if (q.status === 'won' || q.status === 'lost') continue;
    const daysSinceSent = q.daysSince;

    if (q.status === 'pending' && daysSinceSent >= 14 && q.followups === 0) {
      actions.push({
        id: `qfu_urgent_${q.id}`, type: 'quote_followup', priority: 'urgent',
        title: `Quote sent ${daysSinceSent} days ago — no response`,
        description: `$${q.amount.toLocaleString()} quote for ${q.job} at ${q.client} has been sitting for ${daysSinceSent} days without any follow-up or response.`,
        targetId: q.id, targetType: 'quote', customerName: q.client, amount: q.amount, daysElapsed: daysSinceSent,
        recommendedAction: `Call ${q.client} immediately. Quote is losing relevance. Ask if they have questions or need a revised price.`,
        suggestedChannel: 'phone',
        autoDraftMessage: `Hi ${q.client.split(' ')[0]}, just checking in on the ${q.job} quote ($${q.amount.toLocaleString()}) I sent ${daysSinceSent} days ago. Happy to answer any questions or adjust the scope. — Dave, OzWise Plumbing`,
      });
    }

    if (q.status === 'followed-up' && daysSinceSent >= 7) {
      actions.push({
        id: `qfu_high_${q.id}`, type: 'quote_followup', priority: 'high',
        title: `Followed up ${q.followups}x — still no decision`,
        description: `$${q.amount.toLocaleString()} quote for ${q.client} has been followed up ${q.followups} time(s) over ${daysSinceSent} days. Customer is going cold.`,
        targetId: q.id, targetType: 'quote', customerName: q.client, amount: q.amount, daysElapsed: daysSinceSent,
        recommendedAction: `Send a final "last chance" email with a limited-time discount offer (5% off if accepted within 7 days).`,
        suggestedChannel: 'email',
        autoDraftMessage: `Hi ${q.client.split(' ')[0]}, I wanted to check one last time on the ${q.job} quote. As a courtesy, I can offer 5% off if you accept within the next 7 days. Let me know! — Dave, OzWise Plumbing`,
      });
    }

    if (q.status === 'urgent') {
      actions.push({
        id: `qfu_med_${q.id}`, type: 'quote_followup', priority: 'medium',
        title: `Quote flagged urgent — ${daysSinceSent} days without conversion`,
        description: `$${q.amount.toLocaleString()} quote marked urgent. ${q.followups} follow-ups attempted. Consider moving on unless customer re-engages.`,
        targetId: q.id, targetType: 'quote', customerName: q.client, amount: q.amount, daysElapsed: daysSinceSent,
        recommendedAction: `Move to cold storage. Tag for re-engagement in 90 days. In the meantime, focus on warmer leads.`,
        suggestedChannel: 'email',
        autoDraftMessage: `Hi ${q.client.split(' ')[0]}, just touching base on the ${q.job} quote. No pressure — the quote remains valid. Feel free to reach out anytime. — Dave`,
      });
    }
  }

  return actions;
}

export function analyzeInvoiceChases(invoices: { id: string; job: string; client: string; amount: number; sentDate: string; dueDate: string; daysOverdue: number; status: string }[]): FollowUpAction[] {
  const actions: FollowUpAction[] = [];

  for (const inv of invoices) {
    if (inv.status === 'paid') continue;
    const overdue = inv.daysOverdue;

    if (overdue >= 30) {
      actions.push({
        id: `inv_crit_${inv.id}`, type: 'invoice_chase', priority: 'urgent',
        title: `$${inv.amount.toLocaleString()} overdue for ${overdue} days — critical`,
        description: `Invoice for ${inv.job} at ${inv.client} is ${overdue} days past due.`,
        targetId: inv.id, targetType: 'invoice', customerName: inv.client, amount: inv.amount, daysElapsed: overdue,
        recommendedAction: `Escalate to formal debt collection. Send final notice with 7-day deadline via registered post. Consider engaging a collection agency.`,
        suggestedChannel: 'letter',
        autoDraftMessage: `FINAL NOTICE: Invoice ${inv.id} for $${inv.amount.toLocaleString()} is now ${overdue} days overdue. Payment must be received within 7 days to avoid debt collection proceedings. — OzWise Plumbing Accounts`,
      });
    }

    if (overdue >= 14 && overdue < 30) {
      actions.push({
        id: `inv_high_${inv.id}`, type: 'invoice_chase', priority: 'high',
        title: `$${inv.amount.toLocaleString()} overdue — ${overdue} days`,
        description: `Invoice for ${inv.job} at ${inv.client} is ${overdue} days past due.`,
        targetId: inv.id, targetType: 'invoice', customerName: inv.client, amount: inv.amount, daysElapsed: overdue,
        recommendedAction: `Call the customer directly. Offer a payment plan if needed. Mention any late payment fees applicable per your terms.`,
        suggestedChannel: 'phone',
        autoDraftMessage: `Hi ${inv.client.split(' ')[0]}, I'm following up on invoice ${inv.id} for $${inv.amount.toLocaleString()} which is now ${overdue} days overdue. Is there an issue with the work or can we arrange payment? Happy to set up a payment plan if needed. — Dave, OzWise Plumbing`,
      });
    }

    if (overdue >= 7 && overdue < 14) {
      actions.push({
        id: `inv_med_${inv.id}`, type: 'invoice_chase', priority: 'medium',
        title: `$${inv.amount.toLocaleString()} payment reminder — ${overdue} days overdue`,
        description: `Invoice for ${inv.job} at ${inv.client} is ${overdue} days overdue.`,
        targetId: inv.id, targetType: 'invoice', customerName: inv.client, amount: inv.amount, daysElapsed: overdue,
        recommendedAction: `Send a friendly email reminder with the invoice attached. No need to call yet.`,
        suggestedChannel: 'email',
        autoDraftMessage: `Hi ${inv.client.split(' ')[0]}, just a friendly reminder that invoice ${inv.id} for $${inv.amount.toLocaleString()} was due ${overdue} days ago. Please let me know if you need anything else. Thanks! — Dave, OzWise Plumbing`,
      });
    }

    if (overdue > 0 && overdue < 7) {
      actions.push({
        id: `inv_low_${inv.id}`, type: 'invoice_chase', priority: 'low',
        title: `$${inv.amount.toLocaleString()} — ${overdue} day(s) overdue`,
        description: `Invoice for ${inv.job} at ${inv.client} just became overdue.`,
        targetId: inv.id, targetType: 'invoice', customerName: inv.client, amount: inv.amount, daysElapsed: overdue,
        recommendedAction: `Send an automated SMS reminder. No phone call needed yet.`,
        suggestedChannel: 'sms',
        autoDraftMessage: `Hi ${inv.client.split(' ')[0]}, quick heads up that invoice ${inv.id} for $${inv.amount.toLocaleString()} is due. Payment link: [URL]. Thanks! — OzWise Plumbing`,
      });
    }
  }

  return actions;
}

export function analyzeProfitLeaks(jobs: { jobId?: string; id?: string; title: string; client?: any; customer?: any; status: string; quotedTotal: number; actualTotal: number; quotedLabour: number; actualLabour: number; quotedMaterials: number; actualMaterials: number; marginPct: number; margin: number; timeLog?: any[]; receiptLog?: any[] }[]): { actions: FollowUpAction[]; analyses: ProfitLeakAnalysis[] } {
  const actions: FollowUpAction[] = [];
  const analyses: ProfitLeakAnalysis[] = [];

  for (const job of jobs) {
    const jobId = job.jobId || job.id || 'unknown';
    const customerName = job.client?.name || job.customer?.name || 'Unknown';
    if (job.status !== 'active') continue;

    const spentPct = job.quotedTotal > 0 ? (job.actualTotal / job.quotedTotal) * 100 : 0;
    const estimatedFinalCost = job.actualTotal > 0 ? job.actualTotal / Math.min(spentPct / 100, 0.9) : job.quotedTotal;
    const projectedMargin = job.quotedTotal - estimatedFinalCost;
    const projectedMarginPct = job.quotedTotal > 0 ? (projectedMargin / job.quotedTotal) * 100 : 0;
    const slippageAmount = estimatedFinalCost - (job.quotedTotal - job.margin);
    const labourOverrunAmount = job.actualLabour - job.quotedLabour;
    const materialsOverrunAmount = job.actualMaterials - job.quotedMaterials;

    let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (projectedMarginPct < -10) riskLevel = 'critical';
    else if (projectedMarginPct < 0) riskLevel = 'high';
    else if (projectedMarginPct < 20) riskLevel = 'medium';

    const recommendations: string[] = [];
    if (labourOverrunAmount > 0) recommendations.push(`Labour is $${labourOverrunAmount.toFixed(2)} over quote. Review time entries for inefficiencies or scope creep.`);
    if (materialsOverrunAmount > 0) recommendations.push(`Materials are $${materialsOverrunAmount.toFixed(2)} over quote. Check for unapproved purchases.`);
    if (projectedMarginPct < 15 && projectedMarginPct > 0) recommendations.push(`Projected margin of ${projectedMarginPct.toFixed(1)}% is below the target of 30%.`);
    if (projectedMarginPct < 0) recommendations.push(`JOB IS PROJECTED TO LOSE MONEY. Immediate action required.`);
    if (recommendations.length === 0) recommendations.push(`Job is tracking within budget. Continue monitoring.`);

    analyses.push({
      jobId, jobTitle: job.title, customer: customerName, status: job.status,
      quotedTotal: job.quotedTotal, spentToDate: job.actualTotal,
      remainingBudget: job.quotedTotal - job.actualTotal,
      estimatedFinalCost: Math.round(estimatedFinalCost * 100) / 100,
      projectedMargin: Math.round(projectedMargin * 100) / 100,
      projectedMarginPct: Math.round(projectedMarginPct * 100) / 100,
      quotedMargin: job.margin, quotedMarginPct: job.marginPct,
      slippageAmount: Math.round(Math.max(0, slippageAmount) * 100) / 100,
      slippagePct: Math.round(Math.max(0, job.quotedTotal > 0 ? (slippageAmount / job.quotedTotal) * 100 : 0) * 100) / 100,
      riskLevel, recommendations,
    });

    if (riskLevel === 'critical' || riskLevel === 'high') {
      actions.push({
        id: `leak_${riskLevel === 'critical' ? 'crit' : 'high'}_${jobId}`, type: 'profit_leak',
        priority: riskLevel === 'critical' ? 'urgent' : 'high',
        title: `${riskLevel === 'critical' ? 'Profit leak' : 'Margin warning'} on ${job.title.substring(0, 40)} — projected ${projectedMarginPct.toFixed(1)}% margin`,
        description: `${job.title} is ${riskLevel === 'critical' ? 'projected to lose money' : 'trending below target margin'}. Quoted $${job.quotedTotal.toLocaleString()}.`,
        targetId: jobId, targetType: 'job', customerName,
        amount: Math.round(Math.max(0, slippageAmount) * 100) / 100,
        daysElapsed: 0, recommendedAction: recommendations[0] || 'Review job costs urgently.',
        suggestedChannel: 'phone',
      });
    }
  }

  return { actions, analyses };
}

export async function runAutomationEngine(userEmail?: string): Promise<AutomationSummary> {
  let quotes: any[];
  let invoices: any[];
  let jobs: any[];

  if (DB_ENABLED) {
    try {
      await connectDB();
      const filter = userEmail ? { userEmail } : {};
      quotes = await Quote.find(filter).lean();
      invoices = await Invoice.find(filter).lean();
      jobs = await MongooseJob.find(filter).lean();
    } catch {
      quotes = sampleData.quotes;
      invoices = sampleData.invoices;
      jobs = Object.values(sampleData.jobDetails);
    }
  } else {
    quotes = sampleData.quotes;
    invoices = sampleData.invoices;
    jobs = Object.values(sampleData.jobDetails);
  }

  const quoteActions = analyzeQuoteFollowups(quotes);
  const invoiceActions = analyzeInvoiceChases(invoices);
  const { actions: leakActions } = analyzeProfitLeaks(jobs);
  const allActions = [...quoteActions, ...invoiceActions, ...leakActions];
  const urgentActions = allActions.filter(a => a.priority === 'urgent');

  return {
    asAtDate: NOW.toISOString(),
    totalActionsRequired: allActions.length,
    urgentActions: urgentActions.length,
    quoteFollowups: quoteActions,
    invoiceChases: invoiceActions,
    profitLeaks: leakActions,
    stats: {
      quotesPendingFollowup: quoteActions.length,
      quotesExpiringThisWeek: quoteActions.filter(a => a.daysElapsed >= 14).length,
      invoicesOverdue: invoiceActions.length,
      invoicesCritical: invoiceActions.filter(a => a.priority === 'urgent').length,
      activeJobsWithLeak: leakActions.length,
      totalEstimatedLeakAmount: Math.round(leakActions.reduce((sum, a) => sum + Math.max(0, a.amount), 0) * 100) / 100,
    },
  };
}

export async function runProfitLeakAnalysis(userEmail?: string): Promise<{ actions: FollowUpAction[]; analyses: ProfitLeakAnalysis[] }> {
  let jobs: any[];

  if (DB_ENABLED) {
    try {
      await connectDB();
      const filter = userEmail ? { userEmail, status: 'active' } : { status: 'active' };
      jobs = await MongooseJob.find(filter).lean();
    } catch {
      jobs = Object.values(sampleData.jobDetails).filter(j => j.status === 'active');
    }
  } else {
    jobs = Object.values(sampleData.jobDetails).filter(j => j.status === 'active');
  }

  const { actions, analyses } = analyzeProfitLeaks(jobs); return { actions, analyses };
}

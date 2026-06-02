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
import { Job } from '@/models/Job';
import sampleData, { type Quote as QuoteType, type Invoice as InvoiceType, type JobDetail, type Job } from '@/lib/sampleData';
import insightsData from '@/lib/insightsData';

const DB_ENABLED = !!process.env.MONGODB_URI;
const NOW = new Date();

// ─── Helpers ────────────────────────────────────────────────────────

function daysBetween(dateStr: string, from: Date = NOW): number {
  const d = new Date(dateStr);
  return Math.floor((from.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(dateStr: string, from: Date = NOW): number {
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Types ──────────────────────────────────────────────────────────

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

// ─── Quote Follow-up Logic ──────────────────────────────────────────

export function analyzeQuoteFollowups(quotes: { id: string; client: string; job: string; amount: number; sentDate: string; daysSince: number; status: string; followups: number }[]): FollowUpAction[] {
  const actions: FollowUpAction[] = [];

  for (const q of quotes) {
    // Skip converted/won/lost quotes
    if (q.status === 'won' || q.status === 'lost') continue;

    const daysSinceSent = q.daysSince;

    // Urgent: sent > 14 days, no response, no follow-ups
    if (q.status === 'pending' && daysSinceSent >= 14 && q.followups === 0) {
      actions.push({
        id: `qfu_urgent_${q.id}`,
        type: 'quote_followup',
        priority: 'urgent',
        title: `Quote sent ${daysSinceSent} days ago — no response`,
        description: `$${q.amount.toLocaleString()} quote for ${q.job} at ${q.client} has been sitting for ${daysSinceSent} days without any follow-up or response.`,
        targetId: q.id,
        targetType: 'quote',
        customerName: q.client,
        amount: q.amount,
        daysElapsed: daysSinceSent,
        recommendedAction: `Call ${q.client} immediately. Quote is losing relevance. Ask if they have questions or need a revised price.`,
        suggestedChannel: 'phone',
        autoDraftMessage: `Hi ${q.client.split(' ')[0]}, just checking in on the ${q.job} quote ($${q.amount.toLocaleString()}) I sent ${daysSinceSent} days ago. Happy to answer any questions or adjust the scope. — Dave, OzWise Plumbing`,
      });
    }

    // High: sent > 7 days, followed-up once but no response
    if (q.status === 'followed-up' && daysSinceSent >= 7) {
      actions.push({
        id: `qfu_high_${q.id}`,
        type: 'quote_followup',
        priority: 'high',
        title: `Followed up ${q.followups}x — still no decision`,
        description: `$${q.amount.toLocaleString()} quote for ${q.client} has been followed up ${q.followups} time(s) over ${daysSinceSent} days. Customer is going cold.`,
        targetId: q.id,
        targetType: 'quote',
        customerName: q.client,
        amount: q.amount,
        daysElapsed: daysSinceSent,
        recommendedAction: `Send a final "last chance" email with a limited-time discount offer (5% off if accepted within 7 days).`,
        suggestedChannel: 'email',
        autoDraftMessage: `Hi ${q.client.split(' ')[0]}, I wanted to check one last time on the ${q.job} quote. As a courtesy, I can offer 5% off if you accept within the next 7 days. Let me know! — Dave, OzWise Plumbing`,
      });
    }

    // Medium: marked urgent (no response, many follow-ups already)
    if (q.status === 'urgent') {
      actions.push({
        id: `qfu_med_${q.id}`,
        type: 'quote_followup',
        priority: 'medium',
        title: `Quote flagged urgent — ${daysSinceSent} days without conversion`,
        description: `$${q.amount.toLocaleString()} quote marked urgent. ${q.followups} follow-ups attempted. Consider moving on unless customer re-engages.`,
        targetId: q.id,
        targetType: 'quote',
        customerName: q.client,
        amount: q.amount,
        daysElapsed: daysSinceSent,
        recommendedAction: `Move to cold storage. Tag for re-engagement in 90 days. In the meantime, focus on warmer leads.`,
        suggestedChannel: 'email',
        autoDraftMessage: `Hi ${q.client.split(' ')[0]}, just touching base on the ${q.job} quote. No pressure — the quote remains valid until ${'expiry'}. Feel free to reach out anytime. — Dave`,
      });
    }
  }

  return actions;
}

// ─── Invoice Chasing Logic ──────────────────────────────────────────

export function analyzeInvoiceChases(invoices: { id: string; job: string; client: string; amount: number; sentDate: string; dueDate: string; daysOverdue: number; status: string }[]): FollowUpAction[] {
  const actions: FollowUpAction[] = [];

  for (const inv of invoices) {
    if (inv.status === 'paid') continue;

    const overdue = inv.daysOverdue;

    // Critical: > 30 days overdue
    if (overdue >= 30) {
      actions.push({
        id: `inv_crit_${inv.id}`,
        type: 'invoice_chase',
        priority: 'urgent',
        title: `$${inv.amount.toLocaleString()} overdue for ${overdue} days — critical`,
        description: `Invoice for ${inv.job} at ${inv.client} is ${overdue} days past due. Multiple reminders likely already sent.`,
        targetId: inv.id,
        targetType: 'invoice',
        customerName: inv.client,
        amount: inv.amount,
        daysElapsed: overdue,
        recommendedAction: `Escalate to formal debt collection. Send final notice with 7-day deadline via registered post. Consider engaging a collection agency.`,
        suggestedChannel: 'letter',
        autoDraftMessage: `FINAL NOTICE: Invoice ${inv.id} for $${inv.amount.toLocaleString()} is now ${overdue} days overdue. Payment must be received within 7 days to avoid debt collection proceedings. — OzWise Plumbing Accounts`,
      });
    }

    // High: 14-30 days overdue
    if (overdue >= 14 && overdue < 30) {
      actions.push({
        id: `inv_high_${inv.id}`,
        type: 'invoice_chase',
        priority: 'high',
        title: `$${inv.amount.toLocaleString()} overdue — ${overdue} days`,
        description: `Invoice for ${inv.job} at ${inv.client} is ${overdue} days past due. This is entering critical territory.`,
        targetId: inv.id,
        targetType: 'invoice',
        customerName: inv.client,
        amount: inv.amount,
        daysElapsed: overdue,
        recommendedAction: `Call the customer directly. Offer a payment plan if needed. Mention any late payment fees applicable per your terms.`,
        suggestedChannel: 'phone',
        autoDraftMessage: `Hi ${inv.client.split(' ')[0]}, I'm following up on invoice ${inv.id} for $${inv.amount.toLocaleString()} which is now ${overdue} days overdue. Is there an issue with the work or can we arrange payment? Happy to set up a payment plan if needed. — Dave, OzWise Plumbing`,
      });
    }

    // Medium: 7-14 days overdue (gentle reminder)
    if (overdue >= 7 && overdue < 14) {
      actions.push({
        id: `inv_med_${inv.id}`,
        type: 'invoice_chase',
        priority: 'medium',
        title: `$${inv.amount.toLocaleString()} payment reminder — ${overdue} days overdue`,
        description: `Invoice for ${inv.job} at ${inv.client} is ${overdue} days overdue. A gentle reminder is appropriate.`,
        targetId: inv.id,
        targetType: 'invoice',
        customerName: inv.client,
        amount: inv.amount,
        daysElapsed: overdue,
        recommendedAction: `Send a friendly email reminder with the invoice attached. No need to call yet.`,
        suggestedChannel: 'email',
        autoDraftMessage: `Hi ${inv.client.split(' ')[0]}, just a friendly reminder that invoice ${inv.id} for $${inv.amount.toLocaleString()} was due ${overdue} days ago. Please let me know if you need anything else. Thanks! — Dave, OzWise Plumbing`,
      });
    }

    // Low: 1-6 days overdue (barely)
    if (overdue > 0 && overdue < 7) {
      actions.push({
        id: `inv_low_${inv.id}`,
        type: 'invoice_chase',
        priority: 'low',
        title: `$${inv.amount.toLocaleString()} — ${overdue} day(s) overdue`,
        description: `Invoice for ${inv.job} at ${inv.client} just became overdue. Likely an oversight.`,
        targetId: inv.id,
        targetType: 'invoice',
        customerName: inv.client,
        amount: inv.amount,
        daysElapsed: overdue,
        recommendedAction: `Send an automated SMS reminder. No phone call needed yet.`,
        suggestedChannel: 'sms',
        autoDraftMessage: `Hi ${inv.client.split(' ')[0]}, quick heads up that invoice ${inv.id} for $${inv.amount.toLocaleString()} is due. Payment link: [URL]. Thanks! — OzWise Plumbing`,
      });
    }
  }

  return actions;
}

// ─── Profit Leak Detection ──────────────────────────────────────────

export function analyzeProfitLeaks(jobs: { jobId?: string; id?: string; title: string; client?: any; customer?: any; status: string; quotedTotal: number; actualTotal: number; quotedLabour: number; actualLabour: number; quotedMaterials: number; actualMaterials: number; marginPct: number; margin: number; timeLog?: any[]; receiptLog?: any[] }[]): { actions: FollowUpAction[]; analyses: ProfitLeakAnalysis[] } {
  const actions: FollowUpAction[] = [];
  const analyses: ProfitLeakAnalysis[] = [];

  for (const job of jobs) {
    const jobId = job.jobId || job.id || 'unknown';
    const customerName = job.client?.name || job.customer?.name || 'Unknown';

    // Only analyze active/in-progress jobs
    if (job.status !== 'active') continue;

    // Calculate spend rate based on actual vs quoted
    const spentPct = job.quotedTotal > 0 ? (job.actualTotal / job.quotedTotal) * 100 : 0;
    
    // Project final cost based on current spend rate and completion estimate
    // If we've spent X% of budget but work is only partially done, that's a leak
    const impliedCompletionPct = spentPct; // rough proxy
    const estimatedFinalCost = job.actualTotal > 0 
      ? job.actualTotal / Math.min(impliedCompletionPct / 100, 0.9) 
      : job.quotedTotal;
    
    const projectedMargin = job.quotedTotal - estimatedFinalCost;
    const projectedMarginPct = job.quotedTotal > 0 ? (projectedMargin / job.quotedTotal) * 100 : 0;
    const slippageAmount = estimatedFinalCost - (job.quotedTotal - job.margin); // actual cost exceeding quoted cost components
    const slippagePct = job.quotedTotal > 0 ? (slippageAmount / job.quotedTotal) * 100 : 0;

    // Detect specific leak types
    const labourOverrun = job.actualLabour > job.quotedLabour;
    const materialsOverrun = job.actualMaterials > job.quotedMaterials;
    const labourOverrunAmount = job.actualLabour - job.quotedLabour;
    const materialsOverrunAmount = job.actualMaterials - job.quotedMaterials;

    let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (projectedMarginPct < -10) riskLevel = 'critical';
    else if (projectedMarginPct < 0) riskLevel = 'high';
    else if (projectedMarginPct < 20) riskLevel = 'medium';

    const recommendations: string[] = [];

    if (labourOverrun && labourOverrunAmount > 0) {
      recommendations.push(`Labour is $${labourOverrunAmount.toFixed(2)} over quote. Review time entries for inefficiencies or scope creep. Consider reassigning to a less experienced tradie if the work is routine.`);
    }
    if (materialsOverrun && materialsOverrunAmount > 0) {
      recommendations.push(`Materials are $${materialsOverrunAmount.toFixed(2)} over quote. Check for unapproved purchases or price increases from suppliers.`);
    }
    if (projectedMarginPct < 15 && projectedMarginPct > 0) {
      recommendations.push(`Projected margin of ${projectedMarginPct.toFixed(1)}% is below the target of 30%. Review pricing on remaining work.`);
    }
    if (projectedMarginPct < 0) {
      recommendations.push(`⚠️ JOB IS PROJECTED TO LOSE MONEY. Immediate action required. Review scope with customer and issue a variation/change order before proceeding further.`);
    }
    if (recommendations.length === 0) {
      recommendations.push(`Job is tracking within budget. Continue monitoring — no action required.`);
    }

    analyses.push({
      jobId,
      jobTitle: job.title,
      customer: customerName,
      status: job.status,
      quotedTotal: job.quotedTotal,
      spentToDate: job.actualTotal,
      remainingBudget: job.quotedTotal - job.actualTotal,
      estimatedFinalCost: Math.round(estimatedFinalCost * 100) / 100,
      projectedMargin: Math.round(projectedMargin * 100) / 100,
      projectedMarginPct: Math.round(projectedMarginPct * 100) / 100,
      quotedMargin: job.margin,
      quotedMarginPct: job.marginPct,
      slippageAmount: Math.round(Math.max(0, slippageAmount) * 100) / 100,
      slippagePct: Math.round(Math.max(0, slippagePct) * 100) / 100,
      riskLevel,
      recommendations,
    });

    // Create a follow-up action for critical/high leaks
    if (riskLevel === 'critical' || riskLevel === 'high') {
      const isCritical = riskLevel === 'critical';
      actions.push({
        id: `leak_${isCritical ? 'crit' : 'high'}_${jobId}`,
        type: 'profit_leak',
        priority: isCritical ? 'urgent' : 'high',
        title: isCritical
          ? `🔴 Profit leak on ${job.title.substring(0, 40)} — projected ${projectedMarginPct.toFixed(1)}% margin`
          : `🟡 Margin warning on ${job.title.substring(0, 40)} — projected ${projectedMarginPct.toFixed(1)}% margin`,
        description: isCritical
          ? `${job.title} is projected to lose money. Quoted $${job.quotedTotal.toLocaleString()}, estimated final cost $${Math.round(estimatedFinalCost).toLocaleString()}. Action needed now.`
          : `${job.title} is trending below target margin. Est. final cost $${Math.round(estimatedFinalCost).toLocaleString()} vs quoted $${job.quotedTotal.toLocaleString()}.`,
        targetId: jobId,
        targetType: 'job',
        customerName,
        amount: Math.round(slippageAmount * 100) / 100,
        daysElapsed: 0,
        recommendedAction: recommendations[0] || 'Review job costs urgently.',
        suggestedChannel: 'phone',
      });
    }
  }

  return { actions, analyses };
}

// ─── Master Automation Run ──────────────────────────────────────────

/**
 * Runs all automation engines and returns a comprehensive summary.
 * Gracefully falls back to static data when MongoDB is unavailable.
 */
export async function runAutomationEngine(): Promise<AutomationSummary> {
  let quotes: any[];
  let invoices: any[];
  let jobs: any[];

  if (DB_ENABLED) {
    try {
      await connectDB();
      quotes = await Quote.find({}).lean();
      invoices = await Invoice.find({}).lean();
      jobs = await Job.find({}).lean();
    } catch {
      // Fallback to static data
      quotes = sampleData.quotes;
      invoices = sampleData.invoices;
      jobs = Object.values(sampleData.jobDetails);
    }
  } else {
    quotes = sampleData.quotes;
    invoices = sampleData.invoices;
    jobs = Object.values(sampleData.jobDetails);
  }

  // Get existing profit alerts for enrichment
  const existingAlerts = insightsData.profitAlerts || [];

  const quoteActions = analyzeQuoteFollowups(quotes);
  const invoiceActions = analyzeInvoiceChases(invoices);
  const { actions: leakActions, analyses: leakAnalyses } = analyzeProfitLeaks(jobs);

  const allActions = [...quoteActions, ...invoiceActions, ...leakActions];

  const urgentActions = allActions.filter(a => a.priority === 'urgent');

  const stats = {
    quotesPendingFollowup: quoteActions.length,
    quotesExpiringThisWeek: quoteActions.filter(a => a.daysElapsed >= 14).length,
    invoicesOverdue: invoiceActions.length,
    invoicesCritical: invoiceActions.filter(a => a.priority === 'urgent').length,
    activeJobsWithLeak: leakActions.length,
    totalEstimatedLeakAmount: Math.round(leakActions.reduce((sum, a) => sum + Math.max(0, a.amount), 0) * 100) / 100,
  };

  return {
    asAtDate: NOW.toISOString(),
    totalActionsRequired: allActions.length,
    urgentActions: urgentActions.length,
    quoteFollowups: quoteActions,
    invoiceChases: invoiceActions,
    profitLeaks: leakActions,
    stats,
  };
}

/**
 * Runs profit leak detection on active jobs and returns detailed analysis.
 */
export async function runProfitLeakAnalysis(): Promise<{ leaks: FollowUpAction[]; analyses: ProfitLeakAnalysis[] }> {
  let jobs: any[];

  if (DB_ENABLED) {
    try {
      await connectDB();
      jobs = await Job.find({ status: 'active' }).lean();
    } catch {
      jobs = Object.values(sampleData.jobDetails).filter(j => j.status === 'active');
    }
  } else {
    jobs = Object.values(sampleData.jobDetails).filter(j => j.status === 'active');
  }

  return analyzeProfitLeaks(jobs);
}
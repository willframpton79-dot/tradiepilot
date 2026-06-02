// Server-side data fetching functions for TradiePilot
// These replace the static sample data with MongoDB-backed reads
// For the demo, we fall back to sampleData if MongoDB is unavailable

import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { Insight } from '@/models/Insight';
import sampleData from '@/lib/sampleData';
import insightsData from '@/lib/insightsData';

const DB_ENABLED = !!process.env.MONGODB_URI;

export async function fetchJobs() {
  if (!DB_ENABLED) return sampleData.jobs;
  try {
    await connectDB();
    const jobs = await Job.find({}).lean();
    return jobs.map((j: any) => ({
      id: j.jobId,
      name: j.title,
      client: j.client?.name || '',
      budget: j.quotedTotal,
      cost: j.actualTotal,
      profit: j.margin,
      margin: j.marginPct,
      status: j.status === 'active' ? 'on-track' : 'completed',
      progress: j.status === 'completed' ? 100 : 65,
      dueDate: j.dueDate || '',
    }));
  } catch {
    return sampleData.jobs;
  }
}

export async function fetchJobDetail(id: string) {
  if (!DB_ENABLED) return sampleData.jobDetails[id];
  try {
    await connectDB();
    const job = await Job.findOne({ jobId: id }).lean();
    return job || sampleData.jobDetails[id];
  } catch {
    return sampleData.jobDetails[id];
  }
}

export async function fetchQuotes() {
  if (!DB_ENABLED) return sampleData.quotes;
  try {
    await connectDB();
    const quotes = await Quote.find({}).sort({ daysSince: -1 }).lean();
    return quotes.map((q: any) => ({
      id: q.quoteId,
      client: q.client,
      job: q.job,
      amount: q.amount,
      sentDate: q.sentDate,
      daysSince: q.daysSince,
      status: q.status,
      followups: q.followups,
      category: q.category,
    }));
  } catch {
    return sampleData.quotes;
  }
}

export async function fetchInvoices() {
  if (!DB_ENABLED) return sampleData.invoices;
  try {
    await connectDB();
    const invoices = await Invoice.find({}).sort({ daysOverdue: -1 }).lean();
    return invoices.map((inv: any) => ({
      id: inv.invoiceId,
      job: inv.job,
      client: inv.client,
      amount: inv.amount,
      sentDate: inv.sentDate,
      dueDate: inv.dueDate,
      daysOverdue: inv.daysOverdue,
      status: inv.status,
    }));
  } catch {
    return sampleData.invoices;
  }
}

export async function fetchInsights() {
  if (!DB_ENABLED) return insightsData;
  try {
    await connectDB();
    const insights = await Insight.find({}).lean();
    if (insights.length === 0) return insightsData;

    const result: Record<string, any> = {};
    for (const ins of insights) {
      result[(ins as any).section] = (ins as any).data;
    }

    // Rebuild the insightsData shape expected by the frontend
    return {
      profitAlerts: result.profit_alerts?.alerts || insightsData.profitAlerts,
      hotLeads: result.quote_hot_leads?.leads || insightsData.hotLeads,
      customerLTV: result.customer_ltv?.top_customers || insightsData.customerLTV,
      suburbHotspots: result.suburb_hotspots?.hotspots || insightsData.suburbHotspots,
      marketingTips: result.marketing_tips?.tips || insightsData.marketingTips,
      growthForecast: result.growth_forecast || insightsData.growthForecast,
      cashflowForecast: result.cashflow_forecast || null,
      efficiencyTips: result.efficiency_tips || null,
    };
  } catch {
    return insightsData;
  }
}
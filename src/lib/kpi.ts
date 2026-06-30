/**
 * TradiePilot KPI Calculation Service
 *
 * Calculates business KPIs: Job Profitability, Quote Win Rate, DSO.
 * Works with both MongoDB (when MONGODB_URI is set) and static sample data.
 */

import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { Insight } from '@/models/Insight';
import sampleData, { type JobDetail, type Invoice as InvoiceType } from '@/lib/sampleData';

const DB_ENABLED = !!process.env.MONGODB_URI;

export interface JobProfitability {
  jobId: string;
  title: string;
  status: string;
  revenue: number;
  materialCosts: number;
  labourCosts: number;
  totalCosts: number;
  profit: number;
  marginPct: number;
}

export interface QuoteWinRate {
  totalSent: number;
  totalAccepted: number;
  winRatePct: number;
  periodDays: number;
}

export interface DSOData {
  averageDays: number;
  invoiceCount: number;
  details: { invoiceId: string; daysToPayment: number }[];
}

export interface KPIResult {
  profitability: JobProfitability[];
  quoteWinRate: QuoteWinRate;
  dso: DSOData;
  calculatedAt: string;
}

const DEFAULT_LABOUR_RATE = 85;

// ─── Job Profitability ────────────────────────────────────────────

export function calculateJobProfitability(jobs: any[]): JobProfitability[] {
  return jobs.map((job: any) => {
    const revenue = job.quotedTotal || 0;
    const materialCosts = job.actualMaterials || job.actualTotal || 0;
    const labourHours = job.timeLog?.length
      ? job.timeLog.reduce((s: number, e: any) => s + (e.hours || 0), 0)
      : 0;
    const labourRate = job.timeLog?.[0]?.rate || DEFAULT_LABOUR_RATE;
    const labourCosts = labourHours * labourRate;
    const totalCosts = materialCosts + labourCosts;
    const profit = revenue - totalCosts;
    const marginPct = revenue > 0 ? Math.round((profit / revenue) * 10000) / 100 : 0;

    return {
      jobId: job.jobId || job.id || 'unknown',
      title: job.title,
      status: job.status,
      revenue,
      materialCosts,
      labourCosts: Math.round(labourCosts * 100) / 100,
      totalCosts: Math.round(totalCosts * 100) / 100,
      profit: Math.round(profit * 100) / 100,
      marginPct,
    };
  });
}

// ─── Quote Win Rate ──────────────────────────────────────────────

export function calculateQuoteWinRate(quotes: any[], days: number = 30): QuoteWinRate {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recent = quotes.filter((q: any) => {
    const sentDate = q.sentDate || q.issueDate;
    if (!sentDate) return false;
    return new Date(sentDate) >= cutoff;
  });

  const accepted = recent.filter(
    (q: any) => q.status === 'won' || q.status === 'accepted' || q.status === 'converted'
  );
  const total = recent.length;

  return {
    totalSent: total,
    totalAccepted: accepted.length,
    winRatePct: total > 0 ? Math.round((accepted.length / total) * 10000) / 100 : 0,
    periodDays: days,
  };
}

// ─── Days Sales Outstanding ──────────────────────────────────────

export function calculateDSO(invoices: any[], count: number = 10): DSOData {
  const paid = invoices
    .filter((inv: any) => inv.status === 'paid')
    .slice(0, count);

  const details = paid.map((inv: any) => {
    const sent = new Date(inv.sentDate || inv.issueDate);
    const paidDate = inv.paidDate ? new Date(inv.paidDate) : new Date();
    const days = Math.round((paidDate.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
    return { invoiceId: inv.invoiceId || inv.id || 'unknown', daysToPayment: Math.max(0, days) };
  });

  const totalDays = details.reduce((s: number, d: any) => s + d.daysToPayment, 0);

  return {
    averageDays: details.length > 0 ? Math.round((totalDays / details.length) * 100) / 100 : 0,
    invoiceCount: details.length,
    details,
  };
}

// ─── Master KPI Calculation ─────────────────────────────────────

export async function calculateKPIs(userEmail: string): Promise<KPIResult> {
  let jobs: any[];
  let quotes: any[];
  let invoices: any[];

  if (DB_ENABLED) {
    try {
      await connectDB();
      jobs = await Job.find({ userEmail }).lean();
      quotes = await Quote.find({ userEmail }).lean();
      invoices = await Invoice.find({ userEmail }).lean();
    } catch {
      jobs = Object.values(sampleData.jobDetails);
      quotes = sampleData.quotes;
      invoices = sampleData.invoices;
    }
  } else {
    jobs = Object.values(sampleData.jobDetails);
    quotes = sampleData.quotes;
    invoices = sampleData.invoices;
  }

  const profitability = calculateJobProfitability(jobs);
  const quoteWinRate = calculateQuoteWinRate(quotes);
  const dso = calculateDSO(invoices);

  const result: KPIResult = {
    profitability,
    quoteWinRate,
    dso,
    calculatedAt: new Date().toISOString(),
  };

  // Persist to Insight model if MongoDB is enabled
  if (DB_ENABLED) {
    try {
      await connectDB();
      await Insight.findOneAndUpdate(
        { section: 'kpi', userEmail },
        { $set: { data: result, userEmail } },
        { upsert: true, new: true }
      );
    } catch {
      // Silently fail persistence
    }
  }

  return result;
}
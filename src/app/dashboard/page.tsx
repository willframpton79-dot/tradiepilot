"use client";

import { useState, useEffect, useMemo } from "react";
import { stats as fallbackStats, invoices as fallbackInvoices } from "@/lib/sampleData";
import { api } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import ActiveJobs from "@/components/dashboard/ActiveJobs";
import QuoteFollowUp from "@/components/dashboard/QuoteFollowUp";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, DollarSign, Phone, Send, AlertTriangle, Clock, TrendingUp, Lightbulb, Loader2, Ban } from "lucide-react";

function computeStats(jobs: any[], quotes: any[], invoices: any[]) {
  const activeJobs = jobs.filter((j: any) => j.status === "active" || j.status === "on-track" || j.status === "at-risk" || j.status === "critical");
  const totalMargin = activeJobs.reduce((s: number, j: any) => s + (j.marginPct ?? j.margin ?? 0), 0);
  const avgMargin = activeJobs.length > 0 ? totalMargin / activeJobs.length : 34.2;
  const won = quotes.filter((q: any) => q.status === "won").length;
  const lost = quotes.filter((q: any) => q.status === "lost").length;
  const winRate = won + lost > 0 ? (won / (won + lost)) * 100 : 68.5;
  const overdueInvs = invoices.filter((i: any) => i.daysOverdue > 0);
  const avgDSO = overdueInvs.length > 0 ? overdueInvs.reduce((s: number, i: any) => s + i.daysOverdue, 0) / overdueInvs.length : 24;
  const totalRevenue = invoices.reduce((s: number, i: any) => s + (i.amount || 0), 0);

  return [
    { label: "Average Job Margin", value: `${avgMargin.toFixed(1)}%`, change: `${avgMargin >= 30 ? "+" : ""}${(avgMargin - 30).toFixed(1)}% vs target`, changeType: (avgMargin >= 20 ? "positive" : avgMargin >= 0 ? "negative" : "negative") as "positive" | "negative" | "neutral" },
    { label: "Quote Win Rate", value: `${winRate.toFixed(1)}%`, change: `${winRate >= 50 ? "+" : ""}${(winRate - 50).toFixed(1)}% vs industry avg`, changeType: (winRate >= 50 ? "positive" : "negative") as "positive" | "negative" | "neutral" },
    { label: "Days Sales Outstanding", value: `${Math.round(avgDSO)} days`, change: `${avgDSO <= 30 ? "-" : "+"}${Math.abs(Math.round(avgDSO - 30))} days vs target`, changeType: (avgDSO <= 30 ? "positive" : "negative") as "positive" | "negative" | "neutral" },
    { label: "Revenue (MTD)", value: `$${(totalRevenue || 84200).toLocaleString()}`, change: "+12.8% vs last month", changeType: "positive" as const },
  ];
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [automationData, setAutomationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dash, auto] = await Promise.allSettled([api.getDashboard(), api.getAutomation()]);
        if (dash.status === "fulfilled") setDashboardData(dash.value);
        if (auto.status === "fulfilled") setAutomationData(auto.value);
        if (dash.status === "rejected" && auto.status === "rejected") {
          console.warn("Both API calls failed, using sample data:", dash.reason, auto.reason);
        }
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = useMemo(() => {
    if (dashboardData?.jobs && dashboardData?.quotes && dashboardData?.invoices) {
      const jobs = Array.isArray(dashboardData.jobs) ? dashboardData.jobs : [];
      const quotes = Array.isArray(dashboardData.quotes) ? dashboardData.quotes : [];
      const invoices = Array.isArray(dashboardData.invoices) ? dashboardData.invoices : [];
      if (jobs.length > 0 || quotes.length > 0 || invoices.length > 0) return computeStats(jobs, quotes, invoices);
    }
    return fallbackStats;
  }, [dashboardData]);

  const profitAlerts = dashboardData?.profit_alerts?.alerts || [];
  const hasAlerts = profitAlerts.length > 0;

  const jobs = useMemo(() => {
    if (dashboardData?.jobs && Array.isArray(dashboardData.jobs) && dashboardData.jobs.length > 0) {
      return dashboardData.jobs.map((j: any) => ({
        id: j.jobId || j.id || j._id, name: j.title || j.name, client: j.client?.name || j.client || "",
        budget: j.quotedTotal || j.budget || 0, cost: j.actualTotal || j.cost || 0,
        profit: (j.margin ?? j.profit ?? 0), margin: j.marginPct ?? j.margin ?? 0,
        status: j.status === "active" ? "on-track" : (j.status || "on-track"), progress: j.progress ?? 65, dueDate: j.dueDate || "",
      }));
    }
    return null;
  }, [dashboardData]);

  const quotes = useMemo(() => {
    if (dashboardData?.quotes && Array.isArray(dashboardData.quotes) && dashboardData.quotes.length > 0) {
      return dashboardData.quotes.map((q: any) => ({
        id: q.quoteId || q.id || q._id, client: q.client, job: q.job, amount: q.amount || 0,
        sentDate: q.sentDate || "", daysSince: q.daysSince ?? 0, status: q.status || "pending",
        followups: q.followups ?? 0, category: q.category || "",
      }));
    }
    return null;
  }, [dashboardData]);

  const invoiceChaseItems = useMemo(() => {
    if (automationData?.invoiceChases && Array.isArray(automationData.invoiceChases) && automationData.invoiceChases.length > 0) return automationData.invoiceChases;
    if (dashboardData?.invoices && Array.isArray(dashboardData.invoices) && dashboardData.invoices.length > 0) {
      return dashboardData.invoices.filter((i: any) => i.status !== "paid").map((i: any) => ({
        id: i.invoiceId || i.id || i._id, targetId: i.invoiceId || i.id || i._id, type: "invoice_chase",
        priority: i.daysOverdue >= 30 ? "urgent" : i.daysOverdue >= 14 ? "high" : i.daysOverdue > 0 ? "medium" : "low",
        title: `${i.job}`, description: `Invoice ${i.invoiceId || i.id}`, customerName: i.client,
        amount: i.amount || 0, daysElapsed: i.daysOverdue || 0, targetType: "invoice",
        recommendedAction: "Chase payment", suggestedChannel: i.daysOverdue >= 14 ? "phone" : "email",
        dueDate: i.dueDate || "", sentDate: i.sentDate || "",
      }));
    }
    return null;
  }, [automationData, dashboardData]);

  const invoiceDisplayItems = invoiceChaseItems || fallbackInvoices.map((inv) => ({
    id: inv.id, targetId: inv.id, type: "invoice_chase",
    priority: inv.daysOverdue >= 30 ? "urgent" : inv.daysOverdue >= 14 ? "high" : inv.daysOverdue > 0 ? "medium" : "low",
    title: inv.job, description: inv.job, customerName: inv.client, amount: inv.amount,
    daysElapsed: inv.daysOverdue, targetType: "invoice" as const, recommendedAction: "Chase payment",
    suggestedChannel: "email", dueDate: inv.dueDate, sentDate: inv.sentDate,
  }));

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-slate-900">Profit Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, Joe. Here&apos;s your numbers.</p>
        </div>
        <button onClick={() => alert("No new notifications (placeholder)")} className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {hasAlerts && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />}
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-slate-500 text-sm">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {stats.map((stat, index) => (<StatCard key={stat.label} {...stat} index={index} />))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <ActiveJobs jobs={jobs ?? undefined} />
            <QuoteFollowUp quotes={quotes ?? undefined} />
          </div>

          {hasAlerts && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-indigo-500" /> Profit Alerts
                </h2>
                <Link href="/growth" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">View Intelligence</Link>
              </div>
              <div className="space-y-3">
                {profitAlerts.filter((a: any) => a.is_active !== false).map((alert: any, index: number) => {
                  const alertStyles: Record<string, string> = {
                    critical: "bg-red-50 border-red-200 text-red-600",
                    warning: "bg-amber-50 border-amber-200 text-amber-600",
                    info: "bg-indigo-50 border-indigo-200 text-indigo-600",
                    insight: "bg-green-50 border-green-200 text-green-700",
                  };
                  const style = alertStyles[alert.type] || alertStyles.info;
                  return (
                    <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className={`rounded-lg p-3 border ${style}`}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-slate-800">{alert.title}</h3>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${style}`}>{alert.type}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-400">Customer: {alert.customer}</span>
                            <span className="text-[10px] text-slate-300">|</span>
                            <span className="text-xs text-slate-400">{alert.job_title}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 italic">{alert.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mb-6">
            <Link href="/growth" className="bg-white rounded-lg border border-slate-200 p-6 block hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">Growth Intelligence</h3>
                    <p className="text-xs text-slate-400">View customer LTV, suburb hotspots, and marketing tips</p>
                  </div>
                </div>
                <Lightbulb className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>
            </Link>
          </motion.div>

          <InvoiceChaseSection items={invoiceDisplayItems} />
        </>
      )}
    </div>
  );
}

function InvoiceChaseSection({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-heading font-bold text-slate-800 mb-4">Invoice Chase</h2>
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Ban className="w-8 h-8 mb-2" />
          <p className="text-sm text-slate-500">No overdue invoices</p>
          <p className="text-xs mt-1">All caught up on payments!</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-slate-800">Invoice Chase</h2>
        <Link href="/invoices" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">View All</Link>
      </div>
      <div className="space-y-3">
        {items.map((inv: any, index: number) => {
          const isOverdue = inv.daysElapsed > 0;
          const jobName = inv.title || inv.targetId;
          const clientName = inv.customerName;
          const amount = inv.amount || 0;
          const dueDate = inv.dueDate || "";
          const sentDate = inv.sentDate || "";
          const daysElapsed = inv.daysElapsed || 0;

          return (
            <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.08 }}
              className={`rounded-lg p-3 border transition-all duration-200 ${isOverdue ? "bg-red-50 border-red-200" : "bg-white border-slate-100"}`}>
              <div className="flex items-start gap-3">
                {isOverdue ? <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" /> : <Clock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-slate-800">{jobName}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isOverdue ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"}`}>
                      {isOverdue ? `${daysElapsed} days overdue` : "Due soon"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-slate-600">
                      <DollarSign className="w-3 h-3 text-indigo-500" />
                      <span className="financial-figure">${amount.toLocaleString()}</span>
                    </span>
                    {clientName && <><span className="text-[10px] text-slate-300">|</span><span className="text-xs text-slate-400">{clientName}</span></>}
                    {dueDate && <><span className="text-[10px] text-slate-300">|</span><span className="text-xs text-slate-400">Due {dueDate}</span></>}
                    {sentDate && <><span className="text-[10px] text-slate-300">|</span><span className="text-xs text-slate-400">Sent {sentDate}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link href="/invoices" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${isOverdue ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                    <Send className="w-3 h-3" /> Chase now
                  </Link>
                  <button onClick={() => alert(`Calling client about ${jobName} payment (placeholder)`)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Call client">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
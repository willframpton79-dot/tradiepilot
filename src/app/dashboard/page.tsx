"use client";
import { useState, useEffect } from "react";
import { stats as staticStats } from "@/lib/sampleData";
import { api } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import ActiveJobs from "@/components/dashboard/ActiveJobs";
import QuoteFollowUp from "@/components/dashboard/QuoteFollowUp";
import { motion } from "framer-motion";
import Link from "next/link";
import { Send, AlertTriangle, Lightbulb, Loader2, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [automationData, setAutomationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dash, auto] = await Promise.all([api.getDashboard(), api.getAutomation()]);
        setDashboardData(dash);
        setAutomationData(auto);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-indigo animate-spin" />
    </div>
  );

  const stats = dashboardData ? [
    { label: "Active Jobs", value: dashboardData.jobs?.length || 0, trend: "+2", icon: "clipboard" },
    { label: "Avg. Margin", value: "32%", trend: "+4%", icon: "trending" },
    { label: "Pending Quotes", value: `$${(dashboardData.quotes?.reduce((acc: any, q: any) => acc + q.amount, 0) || 0).toLocaleString()}`, trend: "12 total", icon: "file" },
    { label: "Overdue Invoices", value: `$${(dashboardData.invoices?.filter((i: any) => i.status === 'overdue').reduce((acc: any, i: any) => acc + i.amount, 0) || 0).toLocaleString()}`, trend: "3 high risk", icon: "dollar" },
  ] : staticStats;

  const profitAlerts = dashboardData?.profit_alerts?.alerts || [];
  const chaseInvoices = automationData?.invoice_chase?.overdue_invoices || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Profit Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time visibility into your crew&apos;s performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat: any, index: number) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ActiveJobs jobs={dashboardData?.jobs} />
          <div className="grid md:grid-cols-2 gap-8">
            <QuoteFollowUp quotes={dashboardData?.quotes} />
            <InvoiceChaseSection invoices={chaseInvoices} />
          </div>
        </div>

        <div className="space-y-8">
          {/* Profit Leaks */}
          <div className="card border-rose-100 bg-rose-50/20 shadow-sm shadow-rose-500/5">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> 
              Profit Leaks
            </h2>
            <div className="space-y-4">
              {profitAlerts.length > 0 ? profitAlerts.map((alert: any, i: number) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-rose-100 shadow-sm shadow-rose-500/5">
                  <p className="text-sm font-semibold text-slate-800">{alert.job_title}</p>
                  <p className="text-xs text-rose-600 mt-1 font-medium">{alert.issue}</p>
                </div>
              )) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400 italic">No margin alerts detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card bg-indigo-50/30 border-indigo-100">
             <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-indigo" />
              <h2 className="text-lg font-semibold text-slate-800">Intelligence</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-indigo-100 shadow-sm shadow-indigo-500/5">
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  &quot;Plumbing supply costs in 3000 are up 12%. Adjust your material markup on pending quotes.&quot;
                </p>
                <button className="text-[11px] font-bold text-indigo uppercase tracking-wider mt-3 hover:text-indigo-hover transition-colors">
                  Apply to quotes →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InvoiceChaseSection({ invoices }: { invoices: any[] }) {
  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Invoice Chase</h2>
        <Link href="/invoices" className="text-sm font-medium text-indigo hover:text-indigo-hover">View all</Link>
      </div>
      <div className="space-y-4">
        {invoices.length > 0 ? invoices.slice(0, 3).map((inv, i) => {
          const isOverdue = inv.daysOverdue > 0 || inv.status === 'overdue';
          return (
            <div
              key={inv.id || inv._id}
              className={`p-4 rounded-xl border transition-all ${
                isOverdue ? "bg-amber-50/30 border-amber-100" : "bg-white border-slate-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${isOverdue ? 'bg-amber-100' : 'bg-slate-100'}`}>
                  <TrendingUp className={`w-4 h-4 ${isOverdue ? 'text-amber-600' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">{inv.job || inv.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    ${inv.amount?.toLocaleString()} — <span className={isOverdue ? 'text-amber-600' : ''}>{isOverdue ? 'Overdue' : 'Due soon'}</span>
                  </p>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-indigo transition-colors">
                   <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        }) : (
           <div className="text-center py-10">
             <p className="text-sm text-slate-400 italic">No invoices to chase.</p>
           </div>
        )}
      </div>
    </div>
  );
}

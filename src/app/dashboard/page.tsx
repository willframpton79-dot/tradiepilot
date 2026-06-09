"use client";

import { useState, useEffect } from "react";
import { stats as staticStats, invoices as staticInvoices } from "@/lib/sampleData";
import { api } from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import ActiveJobs from "@/components/dashboard/ActiveJobs";
import QuoteFollowUp from "@/components/dashboard/QuoteFollowUp";
import { motion } from "framer-motion";
import Link from "next/link";
import { Bell, DollarSign, Phone, Send, AlertTriangle, Clock, TrendingUp, Lightbulb, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDashboard();
        setDashboardData(data);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const profitAlerts = dashboardData?.profit_alerts?.alerts || [];
  const hotLeads = dashboardData?.quote_hot_leads?.leads || [];
  const hasAlerts = profitAlerts.length > 0;

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
            Profit Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back, Joe. Here&apos;s your numbers.
          </p>
        </div>
        <button
          onClick={() => alert("No new notifications (placeholder)")}
          className="relative p-2 text-gray-400 hover:text-white hover:bg-navy-elevated rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {hasAlerts && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-profit-red rounded-full" />
          )}
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-amber animate-spin" />
          <span className="ml-3 text-gray-400 text-sm">Loading dashboard...</span>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            {staticStats.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
            <ActiveJobs />
            <QuoteFollowUp />
          </div>

          {/* Profit Alerts */}
          {hasAlerts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="card mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber" /> Profit Alerts
                </h2>
                <Link href="/growth" className="text-xs text-amber hover:text-amber-400 font-medium transition-colors">
                  View Intelligence
                </Link>
              </div>
              <div className="space-y-3">
                {profitAlerts.filter((a: any) => a.is_active !== false).map((alert: any, index: number) => {
                  const alertStyles: Record<string, string> = {
                    critical: "bg-profit-red/5 border-profit-red/20 text-profit-red",
                    warning: "bg-profit-amber/5 border-profit-amber/20 text-profit-amber",
                    info: "bg-blue-500/5 border-blue-500/20 text-blue-400",
                    insight: "bg-profit-green/5 border-profit-green/20 text-profit-green",
                  };
                  const style = alertStyles[alert.type] || alertStyles.info;
                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className={`rounded-lg p-3 border ${style}`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${style}`}>{alert.type}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Customer: {alert.customer}</span>
                            <span className="text-[10px] text-gray-500">|</span>
                            <span className="text-xs text-gray-500">{alert.job_title}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 italic">{alert.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Growth Quick Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-6"
          >
            <Link href="/growth" className="card-elevated block hover:border-amber/30 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-amber" />
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-amber transition-colors">Growth Intelligence</h3>
                    <p className="text-xs text-gray-400">View customer LTV, suburb hotspots, and marketing tips</p>
                  </div>
                </div>
                <Lightbulb className="w-5 h-5 text-gray-400 group-hover:text-amber transition-colors" />
              </div>
            </Link>
          </motion.div>

          {/* Invoice Chase */}
          <InvoiceChaseSection />
        </>
      )}
    </div>
  );
}

function InvoiceChaseSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-white">
          Invoice Chase — Overdue
        </h2>
        <Link
          href="/invoices"
          className="text-xs text-amber hover:text-amber-400 font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {staticInvoices.map((inv, index) => {
          const isOverdue = inv.daysOverdue > 0;
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className={`rounded-lg p-3 border transition-all duration-200 ${
                isOverdue
                  ? "bg-profit-red/5 border-profit-red/20"
                  : "bg-navy border-navy-border"
              }`}
            >
              <div className="flex items-start gap-3">
                {isOverdue ? (
                  <AlertTriangle className="w-5 h-5 text-profit-red mt-0.5 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">
                      {inv.job}
                    </h3>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        isOverdue
                          ? "bg-profit-red/10 text-profit-red"
                          : "bg-profit-amber/10 text-profit-amber"
                      }`}
                    >
                      {isOverdue ? `${inv.daysOverdue} days overdue` : "Due soon"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-300">
                      <DollarSign className="w-3 h-3 text-amber" />
                      <span className="financial-figure">
                        ${inv.amount.toLocaleString()}
                      </span>
                    </span>
                    <span className="text-[10px] text-gray-500">|</span>
                    <span className="text-xs text-gray-400">
                      Due {inv.dueDate}
                    </span>
                    <span className="text-[10px] text-gray-500">|</span>
                    <span className="text-xs text-gray-400">
                      Sent {inv.sentDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href="/invoices"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
                      isOverdue
                        ? "bg-amber text-navy hover:bg-amber-600"
                        : "bg-navy-elevated text-gray-300 hover:text-white border border-navy-border"
                    }`}
                  >
                    <Send className="w-3 h-3" />
                    Chase now
                  </Link>
                  <button
                    onClick={() =>
                      alert(`Calling client about ${inv.job} payment (placeholder)`)
                    }
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-navy-elevated rounded-lg transition-colors"
                    title="Call client"
                  >
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
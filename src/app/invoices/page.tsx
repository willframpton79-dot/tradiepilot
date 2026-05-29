"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Phone, Send, Eye, DollarSign, AlertTriangle, Clock, FileText, TrendingDown } from "lucide-react";
import { invoices } from "@/lib/sampleData";

const overdueColor = (days: number) => {
  if (days >= 30) return { border: "border-profit-red", bg: "bg-profit-red/5", text: "text-profit-red", label: "Critical" };
  if (days >= 7) return { border: "border-profit-amber", bg: "bg-profit-amber/5", text: "text-profit-amber", label: "Overdue" };
  if (days > 0) return { border: "border-yellow-500", bg: "bg-yellow-500/5", text: "text-yellow-400", label: "Due Soon" };
  return { border: "border-navy-border", bg: "bg-navy", text: "text-gray-400", label: "Pending" };
};

export default function InvoiceChaserDashboard() {
  const stats = useMemo(() => {
    const totalOutstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
    const overdue = invoices.filter((i) => i.daysOverdue > 0);
    const overdueTotal = overdue.reduce((s, i) => s + i.amount, 0);
    const critical = invoices.filter((i) => i.daysOverdue >= 30).length;
    return { totalOutstanding, overdueCount: overdue.length, overdueTotal, critical };
  }, []);

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-amber hover:text-amber-400 transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-white mb-6">
        Invoice Chaser
      </motion.h1>

      {/* Hero Outstanding */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-elevated mb-6 text-center py-6 lg:py-8">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Outstanding</p>
        <p className="financial-figure text-4xl lg:text-5xl font-bold text-amber">${stats.totalOutstanding.toLocaleString()}</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-profit-red" />{stats.overdueCount} overdue</span>
          <span className="text-[10px] text-gray-500">|</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-profit-amber" />${stats.overdueTotal.toLocaleString()} at risk</span>
          <span className="text-[10px] text-gray-500">|</span>
          <span className="flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-profit-red" />{stats.critical} critical</span>
        </div>
      </motion.div>

      {/* Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {invoices
          .sort((a, b) => b.daysOverdue - a.daysOverdue)
          .map((inv, index) => {
            const color = overdueColor(inv.daysOverdue);
            return (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`rounded-xl border ${color.border} ${color.bg} p-4 lg:p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{inv.job}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{inv.client}</p>
                  </div>
                  {inv.daysOverdue > 0 && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border}`}>
                      {color.label}
                    </span>
                  )}
                </div>

                {/* Amount & Due */}
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Amount</p>
                    <p className="financial-figure text-lg font-bold text-white">${inv.amount.toLocaleString()}</p>
                  </div>
                  <div className="w-px h-8 bg-navy-border" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Due Date</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className={`text-sm font-medium ${inv.daysOverdue > 0 ? "text-profit-red" : "text-gray-300"}`}>
                        {inv.dueDate}
                      </span>
                    </div>
                    {inv.daysOverdue > 0 && (
                      <p className="text-[10px] text-profit-red mt-0.5">{inv.daysOverdue} days overdue</p>
                    )}
                  </div>
                  <div className="w-px h-8 bg-navy-border" />
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Sent</p>
                    <p className="text-sm text-gray-300">{inv.sentDate}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-navy-border">
                  <button
                    onClick={() => alert(`Sending payment reminder for ${inv.id} (placeholder)`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${inv.daysOverdue > 0 ? "bg-amber text-navy hover:bg-amber-600" : "bg-navy-elevated text-gray-300 hover:text-white border border-navy-border"}`}
                  >
                    <Send className="w-3 h-3" /> Send Reminder
                  </button>
                  <button onClick={() => alert(`Calling ${inv.client} about ${inv.job} (placeholder)`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-navy-elevated text-gray-300 hover:text-white border border-navy-border transition-all">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                  <button onClick={() => alert(`Viewing invoice ${inv.id} (placeholder)`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-navy-elevated text-gray-300 hover:text-white border border-navy-border transition-all ml-auto">
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
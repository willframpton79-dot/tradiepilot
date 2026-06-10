"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Phone, Send, Eye, DollarSign, AlertTriangle, Clock, FileText, TrendingDown, Loader2 } from "lucide-react";
import { invoices as fallbackInvoices } from "@/lib/sampleData";
import { api } from "@/lib/api";

const overdueColor = (days: number) => {
  if (days >= 30) return { border: "border-red-200", bg: "bg-red-50", text: "text-red-500", label: "Critical" };
  if (days >= 7) return { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-500", label: "Overdue" };
  if (days > 0) return { border: "border-yellow-200", bg: "bg-yellow-50", text: "text-yellow-500", label: "Due Soon" };
  return { border: "border-slate-200", bg: "bg-white", text: "text-slate-400", label: "Pending" };
};

export default function InvoiceChaserDashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvoices()
      .then((data: any) => setInvoices(Array.isArray(data) && data.length > 0 ? data : fallbackInvoices))
      .catch(() => setInvoices(fallbackInvoices))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const totalOutstanding = invoices.filter((i: any) => i.status !== "paid").reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const overdue = invoices.filter((i: any) => (i.daysOverdue || 0) > 0);
    const overdueTotal = overdue.reduce((s: number, i: any) => s + (i.amount || 0), 0);
    const critical = invoices.filter((i: any) => (i.daysOverdue || 0) >= 30).length;
    return { totalOutstanding, overdueCount: overdue.length, overdueTotal, critical };
  }, [invoices]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="ml-3 text-slate-500">Loading invoices...</span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-slate-900 mb-6">
        Invoice Chaser
      </motion.h1>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-elevated mb-6 text-center py-6 lg:py-8">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Outstanding</p>
        <p className="financial-figure text-4xl lg:text-5xl font-bold text-indigo-600">${stats.totalOutstanding.toLocaleString()}</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-500" />{stats.overdueCount} overdue</span>
          <span className="text-[10px] text-slate-300">|</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-amber-500" />${stats.overdueTotal.toLocaleString()} at risk</span>
          <span className="text-[10px] text-slate-300">|</span>
          <span className="flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-red-500" />{stats.critical} critical</span>
        </div>
      </motion.div>

      {invoices.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...invoices].sort((a: any, b: any) => (b.daysOverdue || 0) - (a.daysOverdue || 0)).map((inv: any, index: number) => {
            const daysOverdue = inv.daysOverdue || 0;
            const color = overdueColor(daysOverdue);
            return (
              <motion.div key={inv.id || inv.invoiceId || index} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
                className={`rounded-xl border ${color.border} ${color.bg} p-4 lg:p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <div><h3 className="text-sm font-semibold text-slate-800">{inv.job}</h3><p className="text-xs text-slate-500 mt-0.5">{inv.client}</p></div>
                  {daysOverdue > 0 && <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text} border ${color.border}`}>{color.label}</span>}
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Amount</p><p className="financial-figure text-lg font-bold text-slate-800">${(inv.amount || 0).toLocaleString()}</p></div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Due Date</p>
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /><span className={`text-sm font-medium ${daysOverdue > 0 ? "text-red-500" : "text-slate-600"}`}>{inv.dueDate}</span></div>
                    {daysOverdue > 0 && <p className="text-[10px] text-red-500 mt-0.5">{daysOverdue} days overdue</p>}
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div><p className="text-[10px] text-slate-400 uppercase tracking-wider">Sent</p><p className="text-sm text-slate-600">{inv.sentDate}</p></div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button onClick={() => alert(`Sending payment reminder for ${inv.id || inv.invoiceId} (placeholder)`)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${daysOverdue > 0 ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                    <Send className="w-3 h-3" /> Send Reminder
                  </button>
                  <button onClick={() => alert(`Calling ${inv.client} about ${inv.job} (placeholder)`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 transition-all">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                  <button onClick={() => alert(`Viewing invoice ${inv.id || inv.invoiceId} (placeholder)`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 transition-all ml-auto">
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center py-10">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No invoices yet</p>
          <p className="text-xs text-slate-400 mt-1">Invoices will appear here once you create them.</p>
        </div>
      )}
    </div>
  );
}
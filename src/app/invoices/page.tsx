"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, Clock, Send, Phone, 
  AlertTriangle, DollarSign, TrendingDown,
  Eye, FileText, Search, MoreHorizontal,
  Mail, Calendar
} from "lucide-react";
import { invoices } from "@/lib/sampleData";

const overdueColor = (days: number) => {
  if (days > 14) return { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", label: "Critical" };
  if (days > 0) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Overdue" };
  return { text: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100", label: "Upcoming" };
};

export default function InvoiceChaser() {
  const stats = {
    totalOutstanding: invoices.reduce((acc, inv) => acc + inv.amount, 0),
    overdueCount: invoices.filter((inv) => inv.daysOverdue > 0).length,
    overdueTotal: invoices.filter((inv) => inv.daysOverdue > 0).reduce((acc, inv) => acc + inv.amount, 0),
    critical: invoices.filter((inv) => inv.daysOverdue > 14).length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Invoice Chaser</h1>
          <p className="text-slate-500 text-sm mt-1">Get paid faster with automated reminders.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm self-start sm:self-center">
           <Mail className="w-4 h-4" /> Batch Reminders
        </button>
      </div>

      {/* Hero Outstanding */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="card border-indigo-100 bg-indigo-50/20 mb-8 text-center py-10"
      >
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Total Outstanding</p>
        <p className="text-5xl font-bold text-slate-800 tracking-tight">
          ${stats.totalOutstanding.toLocaleString()}
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-rose-100 shadow-sm">
             <AlertTriangle className="w-4 h-4 text-rose-500" />
             <span className="text-xs font-bold text-slate-700">{stats.overdueCount} Overdue</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-amber-100 shadow-sm">
             <DollarSign className="w-4 h-4 text-amber-500" />
             <span className="text-xs font-bold text-slate-700">${stats.overdueTotal.toLocaleString()} At Risk</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-rose-100 shadow-sm">
             <TrendingDown className="w-4 h-4 text-rose-500" />
             <span className="text-xs font-bold text-slate-700">{stats.critical} Critical</span>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                className={`card p-6 hover:shadow-md transition-shadow flex flex-col ${color.border}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{inv.job}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{inv.client}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${color.bg} ${color.text} ${color.border}`}>
                    {color.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-50 my-2">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Amount</p>
                    <p className="text-lg font-bold text-slate-800">${inv.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Due Date</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <Calendar className="w-3 h-3 text-slate-400" />
                       <span className={`text-xs font-bold ${inv.daysOverdue > 0 ? "text-rose-500" : "text-slate-600"}`}>
                        {inv.dueDate}
                       </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Sent</p>
                    <p className="text-xs text-slate-600 font-medium mt-1">{inv.sentDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button className="flex-1 btn-primary text-xs flex items-center justify-center gap-2">
                    <Send className="w-3.5 h-3.5" /> Send Reminder
                  </button>
                  <button className="btn-secondary text-xs flex items-center justify-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}

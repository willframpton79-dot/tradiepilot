'use client';

import { 
  DollarSign, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  MoreHorizontal,
  Mail,
  Phone,
  Eye,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const invoices = [
  { id: '1', client: 'Sarah Johnson', project: 'Kitchen Electrical', amount: 8400, status: 'Overdue', daysOverdue: 14, dueDate: '2026-05-27', sentDate: '2026-05-13' },
  { id: '2', client: 'John Smith', project: 'Bathroom Reno', amount: 12500, status: 'Pending', daysOverdue: 0, dueDate: '2026-06-15', sentDate: '2026-06-01' },
  { id: '3', client: 'CBD Office Ltd', project: 'Office Fit-out', amount: 42000, status: 'Overdue', daysOverdue: 32, dueDate: '2026-05-09', sentDate: '2026-04-25' },
  { id: '4', client: 'Emma Brown', project: 'Garden Design', amount: 5600, status: 'Overdue', daysOverdue: 5, dueDate: '2026-06-05', sentDate: '2026-05-22' },
  { id: '5', client: 'Mike Wilson', project: 'Deck Build', amount: 12457, status: 'Pending', daysOverdue: 0, dueDate: '2026-06-20', sentDate: '2026-06-06' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function InvoicesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Invoice Chaser</h1>
            <p className="text-slate-500 mt-1 font-medium">Auto-follow up on outstanding payments.</p>
          </div>
          <div className="bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Outstanding</p>
              <p className="text-2xl font-bold text-indigo-700 financial-figure">$80,957</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-indigo-200" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overdue</p>
              <p className="text-2xl font-bold text-red-600 financial-figure">$28,157</p>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((inv) => (
            <motion.div 
              key={inv.id}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                {/* Client Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">{inv.client}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      inv.status === 'Overdue' 
                        ? 'bg-red-50 text-red-700 border-red-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">{inv.project}</p>
                </div>

                {/* Amount & Dates */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                  <div className="min-w-[100px] sm:min-w-[120px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 financial-figure">${inv.amount.toLocaleString()}</p>
                  </div>
                  <div className="min-w-[100px] sm:min-w-[120px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Due Date</p>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(inv.dueDate).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  {inv.daysOverdue > 0 && (
                    <div className="min-w-[80px] sm:min-w-[100px]">
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Overdue</p>
                      <p className="text-xs sm:text-sm font-bold text-red-600">{inv.daysOverdue} days</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-50 lg:border-l lg:border-slate-100 lg:pl-6">
                  <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all text-xs">
                    <Mail className="w-3.5 h-3.5" /> Remind
                  </button>
                  <button className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

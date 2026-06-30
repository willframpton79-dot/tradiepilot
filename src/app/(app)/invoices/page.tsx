'use client';

import { 
  ArrowLeft, 
  Mail,
  Phone,
  Eye,
  Calendar,
  Download,
  X as CloseIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { exportCSV } from "@/lib/export";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const fmtAmount = (n: number) =>
  n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n.toLocaleString()}`;

const getDaysInfo = (dueDate: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)} days overdue`,
      color: 'text-red-600',
      badgeLabel: 'OVERDUE',
      badgeColor: 'bg-red-50 text-red-700 border-red-100',
      isOverdue: true
    };
  } else {
    return {
      text: `Due in ${diffDays} days`,
      color: 'text-slate-500',
      badgeLabel: 'PENDING',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      isOverdue: false
    };
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.ok ? r.json() : [])
      .then((data: any[]) =>
        setInvoices(data.map(inv => ({
          ...inv,
          id: inv._id?.toString() || inv.invoiceId,
          project: inv.job,
        })))
      )
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalOverdue = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const handleRemind = async (inv: any) => {
    setLoadingId(inv.id);
    try {
      const res = await fetch('/api/invoices/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: inv.clientEmail,
          clientName: inv.client,
          projectName: inv.project,
          amount: inv.amount,
          dueDate: inv.dueDate
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Reminder sent to ${inv.client}`);
      } else {
        toast.error(data.error || 'Failed to send reminder');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoadingId(null);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

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
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => exportCSV(invoices.map(inv => ({
                ...inv,
                status: getDaysInfo(inv.dueDate).badgeLabel,
                days: getDaysInfo(inv.dueDate).text
              })), 'invoices-export.csv', [
                { key: 'id', label: 'ID' },
                { key: 'client', label: 'Client' },
                { key: 'project', label: 'Project' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
                { key: 'days', label: 'Days' },
                { key: 'dueDate', label: 'Due Date' },
              ])}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-4 sm:gap-6 bg-indigo-50 px-4 sm:px-6 py-4 rounded-2xl border border-indigo-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Outstanding</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-700 financial-figure">{fmtAmount(totalOutstanding)}</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-indigo-200" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overdue</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 financial-figure">{fmtAmount(totalOverdue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="grid grid-cols-1 gap-4">
          {invoices.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="font-medium text-sm">No invoices found.</p>
              <p className="text-xs mt-1">Connect your Xero account in Settings to sync invoices automatically.</p>
            </div>
          )}
          {invoices.map((inv) => {
            const daysInfo = getDaysInfo(inv.dueDate);
            return (
              <motion.div 
                key={inv.id}
                variants={fadeUp}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* 1. Client & Project */}
                  <div className="lg:col-span-3 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{inv.client}</h3>
                    <p className="text-sm text-slate-500 font-medium">{inv.project}</p>
                  </div>

                  {/* 2. Amount */}
                  <div className="lg:col-span-2">
                    <p className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-lg font-bold text-slate-900 financial-figure">${inv.amount.toLocaleString()}</p>
                  </div>

                  {/* 3. Due Date */}
                  <div className="lg:col-span-2">
                    <p className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Due Date</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(inv.dueDate).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>

                  {/* 4. Status */}
                  <div className="lg:col-span-1">
                    <p className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block ${daysInfo.badgeColor}`}>
                      {daysInfo.badgeLabel}
                    </span>
                  </div>

                  {/* 5. Days */}
                  <div className="lg:col-span-2">
                    <p className="lg:hidden text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Days</p>
                    <p className={`text-sm font-bold ${daysInfo.color}`}>{daysInfo.text}</p>
                  </div>

                  {/* 6. Actions */}
                  <div className="lg:col-span-2 flex items-center justify-end gap-2 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
                    <button 
                      onClick={() => handleRemind(inv)}
                      disabled={loadingId === inv.id}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-xs disabled:opacity-50"
                    >
                      {loadingId === inv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />} Remind
                    </button>
                    <button 
                      onClick={() => toast(`Calling ${inv.client}...`)}
                      className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Invoice Details</h2>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Client</p>
                    <p className="text-sm font-bold text-slate-900">{selectedInvoice.client}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Project</p>
                    <p className="text-sm font-bold text-slate-900">{selectedInvoice.project}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-sm font-bold text-slate-900">${selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-sm font-bold text-slate-900">{selectedInvoice.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-bold text-slate-900">{getDaysInfo(selectedInvoice.dueDate).badgeLabel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Days</p>
                    <p className={`text-sm font-bold ${getDaysInfo(selectedInvoice.dueDate).color}`}>
                      {getDaysInfo(selectedInvoice.dueDate).text}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Internal Note</p>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Add a note about this invoice..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 flex justify-end gap-3">
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    toast.success('Note saved locally');
                    setSelectedInvoice(null);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

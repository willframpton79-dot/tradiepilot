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
import { useState } from "react";
import { toast } from "react-hot-toast";

const initialInvoices = [
  { id: '1', client: 'Meridian Property Group', project: 'Commercial Kitchen Fitout', amount: 8400, status: 'Overdue', daysOverdue: 14, dueDate: '2026-05-27', sentDate: '2026-05-13' },
  { id: '2', client: 'Apex Commercial Developments', project: 'Level 3 Bathroom Amenities', amount: 12500, status: 'Pending', daysOverdue: 0, dueDate: '2026-06-15', sentDate: '2026-06-01' },
  { id: '3', client: 'NorthWest Build Co', project: 'Landscaping & External Works', amount: 5600, status: 'Overdue', daysOverdue: 5, dueDate: '2026-06-05', sentDate: '2026-05-22' },
  { id: '4', client: 'Pacific Retail Partners', project: 'Rooftop Deck Construction', amount: 12457, status: 'Pending', daysOverdue: 0, dueDate: '2026-06-20', sentDate: '2026-06-06' },
  { id: '5', client: 'CBD Office Ltd', project: 'Office Fit-out', amount: 42000, status: 'Overdue', daysOverdue: 32, dueDate: '2026-05-09', sentDate: '2026-04-25' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function InvoicesPage() {
  const [invoices] = useState(initialInvoices);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const handleRemind = async (inv: any) => {
    setLoadingId(inv.id);
    try {
      const res = await fetch('/api/invoices/remind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: inv.client,
          projectName: inv.project,
          amount: inv.amount,
          dueDate: inv.dueDate
        }),
      });
      
      if (res.ok) {
        toast.success(`Payment reminder sent for ${inv.project}`);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to send reminder');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoadingId(null);
    }
  };

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
              onClick={() => exportCSV(invoices, 'invoices-export.csv', [
                { key: 'id', label: 'ID' },
                { key: 'client', label: 'Client' },
                { key: 'project', label: 'Project' },
                { key: 'amount', label: 'Amount' },
                { key: 'status', label: 'Status' },
                { key: 'daysOverdue', label: 'Days Overdue' },
                { key: 'dueDate', label: 'Due Date' },
              ])}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-4 sm:gap-6 bg-indigo-50 px-4 sm:px-6 py-4 rounded-2xl border border-indigo-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-700 financial-figure">$81k</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-indigo-200" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overdue</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 financial-figure">$28k</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((inv) => (
            <motion.div 
              key={inv.id}
              variants={fadeUp}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{inv.client}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      inv.status === 'Overdue' 
                        ? 'bg-red-50 text-red-700 border-red-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{inv.project}</p>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  <div className="min-w-[120px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount</p>
                    <p className="text-lg font-bold text-slate-900 financial-figure">${inv.amount.toLocaleString()}</p>
                  </div>
                  <div className="min-w-[120px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Due Date</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(inv.dueDate).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  {inv.daysOverdue > 0 && (
                    <div className="min-w-[100px]">
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Overdue</p>
                      <p className="text-sm font-bold text-red-600">{inv.daysOverdue} days</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
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
          ))}
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
                    <p className="text-sm font-bold text-slate-900">{selectedInvoice.status}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Days Overdue</p>
                    <p className={`text-sm font-bold ${selectedInvoice.daysOverdue > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                      {selectedInvoice.daysOverdue} days
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

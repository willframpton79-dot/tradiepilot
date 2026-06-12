'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  FileText,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  Download,
  AlertTriangle,
  Lightbulb,
  Loader2,
  X as CloseIcon
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { exportCSV } from '@/lib/export';
import { sampleData } from '@/lib/sampleData';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const statusStyles: Record<string, string> = {
  'won': 'bg-green-50 text-green-700 border-green-100',
  'pending': 'bg-amber-50 text-amber-700 border-amber-100',
  'followed-up': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'urgent': 'bg-red-50 text-red-700 border-red-100',
  'lost': 'bg-slate-50 text-slate-700 border-slate-100',
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssistExpanded, setIsAssistExpanded] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderLoading, setReminderLoading] = useState(false);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const res = await fetch('/api/quotes');
        if (res.ok) {
          const data = await res.json();
          setQuotes(data);
        }
      } catch (err) {
        console.error('Failed to fetch quotes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuotes();
  }, []);

  const handleSendReminder = async (quoteId: string) => {
    setReminderLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/reminder`, {
        method: 'POST',
      });
      if (res.ok) {
        toast.success('Reminder email sent successfully');
        // Refresh quotes to show updated followup count
        const updatedRes = await fetch('/api/quotes');
        if (updatedRes.ok) setQuotes(await updatedRes.json());
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to send reminder');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while sending the reminder.');
    } finally {
      setReminderLoading(false);
    }
  };

  const filtered = quotes.filter(q =>
    (q.client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (q.project?.toLowerCase() || q.job?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const priorityQuote = quotes.find(q => q.status === 'urgent' || q.status === 'pending');

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quotes</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your project proposals and estimates.</p>
        </div>
        <Link 
          href="/quotes/new"
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Create Quote
        </Link>
      </div>

      <div className="space-y-6 mb-8">
        <AnimatePresence>
          {isAssistExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-indigo-600 rounded-2xl overflow-hidden shadow-lg shadow-indigo-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-200 fill-indigo-200" />
                    <h3 className="font-bold tracking-tight text-white">Smart Quote Assist</h3>
                  </div>
                  <button 
                    onClick={() => setIsAssistExpanded(false)}
                    className="text-indigo-200 hover:text-white transition-colors"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-1">Historical Performance</p>
                      <p className="text-xl font-bold text-white">38.5% Avg Margin</p>
                      <p className="text-xs text-indigo-200 mt-1">Across last 5 completed jobs</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-3 h-3 text-indigo-200" />
                        <p className="text-[10px] font-bold text-white uppercase">Best Suburb</p>
                      </div>
                      <p className="text-sm font-bold text-white">Pyrmont (42% avg)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-1">Best Performing Type</p>
                      <p className="text-xl font-bold text-white">Commercial Fit-Outs</p>
                      <p className="text-xs text-indigo-200 mt-1">42% average margin</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="w-3 h-3 text-indigo-200" />
                        <p className="text-[10px] font-bold text-white uppercase">Recommended Min</p>
                      </div>
                      <p className="text-sm font-bold text-white">Quote at minimum $14,200</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="bg-amber-400/20 rounded-xl p-4 border border-amber-400/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-300" />
                        <p className="text-xs font-bold text-white">Benchmark Warning</p>
                      </div>
                      <p className="text-xs text-indigo-100 leading-relaxed">
                        Quoting below 25% margin puts you in the bottom 30% of your history. Consider revising your labour ratios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isAssistExpanded && (
          <button 
            onClick={() => setIsAssistExpanded(true)}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors"
          >
            <Zap className="w-4 h-4" /> Show Smart Quote Assist
          </button>
        )}
      </div>




      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search quotes or clients..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button 
                onClick={() => exportCSV(quotes, 'quotes-export.csv', [
                  { key: 'id', label: 'ID' },
                  { key: 'client', label: 'Client' },
                  { key: 'project', label: 'Project' },
                  { key: 'value', label: 'Value' },
                  { key: 'status', label: 'Status' },
                  { key: 'date', label: 'Date' },
                ])}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client & Project</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Loading quotes...</p>
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((quote, idx) => (
                      <motion.tr 
                        key={quote._id || quote.id}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{quote.client}</p>
                              <p className="text-xs text-slate-500 font-medium">{quote.job || quote.project}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900 financial-figure">${(quote.amountIncGst || quote.amount || quote.value || 0).toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${statusStyles[quote.status.toLowerCase()] || statusStyles['pending']}`}>
                            {quote.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400">
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                        No quotes found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="space-y-6">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeUp}
            className="bg-indigo-600 rounded-2xl p-6 shadow-lg shadow-indigo-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-200 fill-indigo-200" />
              <h3 className="font-bold tracking-tight text-sm text-white">Quote Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-1">Monthly Win Rate</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white">64%</p>
                  <div className="flex items-center text-green-300 text-xs font-bold mb-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-3">Priority Follow-up</p>
                {priorityQuote ? (
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <p className="text-sm font-bold text-white">{priorityQuote.client}</p>
                    <p className="text-xs text-indigo-200 mt-1">High-value lead for {priorityQuote.job || priorityQuote.project}</p>
                    <button 
                      onClick={() => handleSendReminder(priorityQuote.quoteId || priorityQuote._id)}
                      disabled={reminderLoading}
                      className="mt-3 w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {reminderLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Send Reminder"} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-center">
                    <p className="text-xs text-indigo-200">No pending quotes to follow up.</p>
                  </div>
                )}
              </div>

              <div className="bg-indigo-700/50 rounded-xl p-4 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-indigo-200" />
                  <p className="text-xs font-bold text-white">Smart Insight</p>
                </div>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Quotes sent on Tuesdays have a 15% higher acceptance rate for your business.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Conversion Funnel</h4>
            <div className="space-y-3">
              {[
                { label: 'Sent', count: 24, color: 'bg-indigo-100', w: '100%' },
                { label: 'Viewed', count: 18, color: 'bg-indigo-300', w: '75%' },
                { label: 'Accepted', count: 12, color: 'bg-indigo-600', w: '50%' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="text-slate-900">{stat.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const quotes = [
  { id: '1', client: 'John Smith', project: 'Bathroom Renovation', value: 12500, status: 'Accepted', date: '2026-06-01' },
  { id: '2', client: 'Sarah Johnson', project: 'Kitchen Electrical', value: 8400, status: 'Pending', date: '2026-06-03' },
  { id: '3', client: 'Mike Wilson', project: 'Deck Construction', value: 24000, status: 'Pending', date: '2026-06-05' },
  { id: '4', client: 'Emma Brown', project: 'Garden Landscaping', value: 15700, status: 'Draft', date: '2026-06-07' },
  { id: '5', client: 'David Lee', project: 'Roof Repair', value: 3200, status: 'Rejected', date: '2026-06-08' },
];

const statusStyles: Record<string, string> = {
  'Accepted': 'bg-green-50 text-green-700 border-green-100',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
  'Draft': 'bg-slate-50 text-slate-700 border-slate-100',
  'Rejected': 'bg-red-50 text-red-700 border-red-100',
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Quotes</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your project proposals and estimates.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm">
          <Plus className="w-4 h-4" /> Create Quote
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center">
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
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Quotes Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="sm:hidden px-6 py-2 border-b border-slate-50 bg-indigo-50/30">
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <ArrowRight className="w-3 h-3 animate-pulse" /> Swipe to see more
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-0">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client & Project</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {quotes.map((quote, idx) => (
                    <motion.tr 
                      key={quote.id}
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                      custom={idx}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{quote.client}</p>
                            <p className="text-xs text-slate-500 font-medium">{quote.project}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900 financial-figure">${quote.value.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles[quote.status]}`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
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
            className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-200 fill-indigo-200" />
              <h3 className="font-bold tracking-tight text-sm">Quote Intelligence</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-1">Monthly Win Rate</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold">64%</p>
                  <div className="flex items-center text-green-300 text-xs font-bold mb-1">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-3">Priority Follow-up</p>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-sm font-bold">Sarah Johnson</p>
                  <p className="text-xs text-indigo-100 mt-1">High-value lead for Kitchen Electrical</p>
                  <button className="mt-3 w-full bg-white text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1">
                    Send Reminder <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-indigo-700/50 rounded-xl p-4 border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-indigo-200" />
                  <p className="text-xs font-bold">Smart Insight</p>
                </div>
                <p className="text-xs text-indigo-100 leading-relaxed">
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
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'

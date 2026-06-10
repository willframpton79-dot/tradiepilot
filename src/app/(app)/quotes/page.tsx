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
  XCircle
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quotes</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your project proposals and estimates.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm">
          <Plus className="w-4 h-4" /> Create Quote
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
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
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <select className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none hover:bg-slate-50 transition-all">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
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
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
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
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {new Date(quote.date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short' })}
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
        
        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500">Showing 5 of 24 quotes</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

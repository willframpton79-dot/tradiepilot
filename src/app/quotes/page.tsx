"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Search, Filter, Send, Phone, 
  CheckCircle, XCircle, Clock, MessageSquare, 
  TrendingUp, Download, Plus, AlertCircle,
  MoreHorizontal, ChevronDown
} from "lucide-react";
import { quotes as sampleQuotes } from "@/lib/sampleData";

const statusStyles: any = {
  won: { label: "Won", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  lost: { label: "Lost", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  pending: { label: "Sent", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
  urgent: { label: "Urgent", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  draft: { label: "Draft", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-100" },
};

const filters = ["All Quotes", "Pending", "Won", "Lost", "Draft"];

export default function QuotesPage() {
  const [activeFilter, setActiveFilter] = useState("All Quotes");
  const [searchTerm, setSearchTerm] = useState("");
  const [quotes] = useState(sampleQuotes);

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchesSearch = q.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           q.job.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "All Quotes" || q.status.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [quotes, searchTerm, activeFilter]);

  const stats = {
    total: quotes.length,
    won: quotes.filter(q => q.status === "won").length,
    lost: quotes.filter(q => q.status === "lost").length,
    pending: quotes.filter(q => q.status === "pending" || q.status === "urgent").length,
    noResponse: quotes.filter(q => q.followups >= 3).length,
    winRate: Math.round((quotes.filter(q => q.status === "won").length / (quotes.filter(q => q.status === "won" || q.status === "lost").length || 1)) * 100)
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Quotes</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your pipeline and win more jobs.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Export
           </button>
           <button className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> New Quote
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Sent", value: stats.total, icon: FileText, color: "text-indigo", bg: "bg-indigo-50" },
          { label: "Won", value: stats.won, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "Lost", value: stats.lost, icon: XCircle, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "High Risk", value: stats.noResponse, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Win Rate", value: `${stats.winRate}%`, icon: TrendingUp, color: "text-indigo", bg: "bg-indigo-50" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.05 }} 
            className="card p-4 text-center"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          {filters.map((f) => (
            <button 
              key={f} 
              onClick={() => setActiveFilter(f)} 
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeFilter === f ? "bg-white text-indigo shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search quotes..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo/10 focus:border-indigo" 
          />
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                <th className="text-left py-4 px-6 font-semibold">Customer</th>
                <th className="text-left py-4 px-6 font-semibold">Job Details</th>
                <th className="text-right py-4 px-6 font-semibold">Value</th>
                <th className="text-left py-4 px-6 font-semibold">Sent</th>
                <th className="text-center py-4 px-6 font-semibold">Follow-ups</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote, index) => {
                const s = statusStyles[quote.status] || statusStyles.pending;
                return (
                  <motion.tr 
                    key={quote.id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: index * 0.03 }} 
                    className="group hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-semibold text-slate-800">{quote.client}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">{quote.category}</span>
                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{quote.job}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-bold text-slate-800">${quote.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-slate-700 font-medium">{quote.sentDate}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{quote.daysSince} days ago</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-xs font-bold ${quote.followups >= 3 ? "text-rose-500" : quote.followups >= 1 ? "text-amber-500" : "text-slate-400"}`}>
                        {quote.followups}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.bg} ${s.color} ${s.border}`}>{s.label}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-2 text-slate-400 hover:text-indigo hover:bg-white hover:shadow-sm rounded-lg transition-all">
                          <Send className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-indigo hover:bg-white hover:shadow-sm rounded-lg transition-all">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredQuotes.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
               <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-slate-500 text-sm font-medium">No quotes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

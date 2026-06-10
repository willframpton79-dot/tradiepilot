"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Phone, Send, FileText, TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Quote } from "@/lib/sampleData";

const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
  "followed-up": { label: "Followed Up", color: "text-indigo-600", bg: "bg-indigo-50" },
  urgent: { label: "Urgent", color: "text-red-600", bg: "bg-red-50" },
  won: { label: "Won", color: "text-green-600", bg: "bg-green-50" },
  lost: { label: "Lost", color: "text-slate-400", bg: "bg-slate-50" },
};

const filters = ["All", "Pending", "Won", "Lost", "No Response"] as const;
type FilterType = (typeof filters)[number];

const filterMap: Record<FilterType, string[]> = {
  "All": [], "Pending": ["pending", "followed-up"], "Won": ["won"], "Lost": ["lost"], "No Response": ["urgent"],
};

export default function QuotesDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getQuotes().then((data: any) => setAllQuotes(data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const total = allQuotes.length;
    const won = allQuotes.filter((q) => q.status === "won").length;
    const lost = allQuotes.filter((q) => q.status === "lost").length;
    const pending = allQuotes.filter((q) => q.status === "pending" || q.status === "followed-up").length;
    const noResponse = allQuotes.filter((q) => q.status === "urgent").length;
    const winRate = total > 0 ? ((won / (won + lost)) * 100).toFixed(1) : "0";
    return { total, won, lost, pending, noResponse, winRate };
  }, [allQuotes]);

  const filteredQuotes = useMemo(() => {
    const allowed = filterMap[activeFilter];
    let result = allowed.length === 0 ? allQuotes : allQuotes.filter((q) => allowed.includes(q.status));
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((q) => q.client?.toLowerCase().includes(term) || q.job?.toLowerCase().includes(term) || (q as any).category?.toLowerCase().includes(term));
    }
    return result;
  }, [activeFilter, searchTerm, allQuotes]);

  if (loading) {
    return (
      <div className="p-4 lg:p-6 pb-24 lg:pb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
        <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /><span className="ml-3 text-slate-500 text-sm">Loading quotes...</span></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors text-sm mb-4"><ArrowLeft className="w-4 h-4" /> Back to Dashboard</Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-slate-900 mb-6">Quotes Management</motion.h1>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Sent", value: stats.total.toString(), icon: FileText, color: "text-indigo-600" },
          { label: "Won", value: stats.won.toString(), icon: CheckCircle, color: "text-green-600" },
          { label: "Lost", value: stats.lost.toString(), icon: XCircle, color: "text-red-500" },
          { label: "Pending", value: stats.pending.toString(), icon: Clock, color: "text-amber-500" },
          { label: "No Response", value: stats.noResponse.toString(), icon: MessageSquare, color: "text-red-400" },
          { label: "Win Rate", value: `${stats.winRate}%`, icon: TrendingUp, color: "text-green-600" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <stat.icon className={`w-4 h-4 mx-auto ${stat.color}`} />
            <p className="financial-figure text-xl font-bold text-slate-800 mt-1">{stat.value}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-white rounded-lg p-1 border border-slate-200">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeFilter === f ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{f}</button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input type="text" placeholder="Search quotes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400" />
        </div>
      </div>

      {filteredQuotes.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 font-medium">Job Type</th>
                  <th className="text-right py-3 px-4 font-medium">Value</th>
                  <th className="text-left py-3 px-4 font-medium">Sent</th>
                  <th className="text-center py-3 px-4 font-medium">Follow-ups</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-right py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((quote, index) => {
                  const s = statusStyles[quote.status] || statusStyles.pending;
                  return (
                    <motion.tr key={quote.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4"><p className="text-sm font-medium text-slate-800">{quote.client}</p></td>
                      <td className="py-3 px-4"><span className="text-xs text-slate-500">{quote.category}</span><p className="text-xs text-slate-400 mt-0.5">{quote.job}</p></td>
                      <td className="py-3 px-4 text-right"><span className="financial-figure text-sm font-semibold text-slate-800">${quote.amount.toLocaleString()}</span></td>
                      <td className="py-3 px-4"><span className="text-xs text-slate-500">{quote.sentDate}</span><p className="text-[10px] text-slate-400">{quote.daysSince} days ago</p></td>
                      <td className="py-3 px-4 text-center"><span className={`text-xs font-medium ${quote.followups >= 3 ? "text-red-500" : quote.followups >= 1 ? "text-amber-500" : "text-slate-400"}`}>{quote.followups}</span></td>
                      <td className="py-3 px-4"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span></td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => alert(`Following up with ${quote.client} (placeholder)`)}
                            className={`p-1.5 rounded-lg transition-colors ${quote.status === "urgent" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"}`}>
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => alert(`Calling ${quote.client} (placeholder)`)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center py-8">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No quotes match your filter.</p>
          <p className="text-xs text-slate-400 mt-1">Send your first quote to get started.</p>
        </div>
      )}
    </div>
  );
}
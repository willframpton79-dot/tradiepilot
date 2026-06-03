"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Phone, Send, FileText, Filter, TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Quote } from "@/lib/sampleData";

const statusStyles: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-profit-amber", bg: "bg-profit-amber/10" },
  "followed-up": { label: "Followed Up", color: "text-blue-400", bg: "bg-blue-400/10" },
  urgent: { label: "Urgent", color: "text-profit-red", bg: "bg-profit-red/10" },
  won: { label: "Won", color: "text-profit-green", bg: "bg-profit-green/10" },
  lost: { label: "Lost", color: "text-gray-400", bg: "bg-gray-400/10" },
};

const filters = ["All", "Pending", "Won", "Lost", "No Response"] as const;
type FilterType = (typeof filters)[number];

const filterMap: Record<FilterType, string[]> = {
  "All": [],
  "Pending": ["pending", "followed-up"],
  "Won": ["won"],
  "Lost": ["lost"],
  "No Response": ["urgent"],
};

export default function QuotesDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [allQuotes, setAllQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getQuotes().then((data: any) => {
      setAllQuotes(data || []);
    }).catch(console.error).finally(() => setLoading(false));
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
      result = result.filter(
        (q) => q.client?.toLowerCase().includes(term) || q.job?.toLowerCase().includes(term) || (q as any).category?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [activeFilter, searchTerm, allQuotes]);

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-amber hover:text-amber-400 transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-white mb-6">
        Quotes Management
      </motion.h1>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Sent", value: stats.total.toString(), icon: FileText, color: "text-amber" },
          { label: "Won", value: stats.won.toString(), icon: CheckCircle, color: "text-profit-green" },
          { label: "Lost", value: stats.lost.toString(), icon: XCircle, color: "text-profit-red" },
          { label: "Pending", value: stats.pending.toString(), icon: Clock, color: "text-profit-amber" },
          { label: "No Response", value: stats.noResponse.toString(), icon: MessageSquare, color: "text-red-400" },
          { label: "Win Rate", value: `${stats.winRate}%`, icon: TrendingUp, color: "text-profit-green" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card text-center">
            <stat.icon className={`w-4 h-4 mx-auto ${stat.color}`} />
            <p className="financial-figure text-xl font-bold text-white mt-1">{stat.value}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-navy-surface rounded-lg p-1 border border-navy-border">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeFilter === f ? "bg-amber text-navy" : "text-gray-400 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px] relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search quotes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-navy-surface border border-navy-border rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber/40" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-navy-border text-xs text-gray-400 uppercase tracking-wider">
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
                const s = statusStyles[quote.status];
                return (
                  <motion.tr key={quote.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="border-b border-navy-border last:border-0 hover:bg-navy-elevated/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-white">{quote.client}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-400">{quote.category}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{quote.job}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="financial-figure text-sm font-semibold text-white">${quote.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-400">{quote.sentDate}</span>
                      <p className="text-[10px] text-gray-500">{quote.daysSince} days ago</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-medium ${quote.followups >= 3 ? "text-profit-red" : quote.followups >= 1 ? "text-profit-amber" : "text-gray-500"}`}>
                        {quote.followups}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => alert(`Following up with ${quote.client} (placeholder)`)} className={`p-1.5 rounded-lg transition-colors ${quote.status === "urgent" ? "bg-amber text-navy hover:bg-amber-600" : "text-gray-400 hover:text-white hover:bg-navy-elevated"}`}>
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => alert(`Calling ${quote.client} (placeholder)`)} className="p-1.5 text-gray-400 hover:text-white hover:bg-navy-elevated rounded-lg">
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
        {filteredQuotes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No quotes match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'

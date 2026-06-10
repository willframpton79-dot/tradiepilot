"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Send, AlertTriangle, Clock, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import { quotes as fallbackQuotes } from "@/lib/sampleData";
import { api } from "@/lib/api";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-amber-600", bg: "bg-amber-50" },
  "followed-up": { label: "Followed Up", color: "text-green-600", bg: "bg-green-50" },
  urgent: { label: "Urgent", color: "text-red-600", bg: "bg-red-50" },
  won: { label: "Won", color: "text-green-600", bg: "bg-green-50" },
  lost: { label: "Lost", color: "text-slate-400", bg: "bg-slate-50" },
};

export default function QuoteFollowUp({ quotes: propQuotes }: { quotes?: any[] }) {
  const [apiQuotes, setApiQuotes] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propQuotes) {
      setLoading(true);
      api.getQuotes()
        .then((data: any) => {
          if (Array.isArray(data) && data.length > 0) setApiQuotes(data);
        })
        .catch(() => { /* fallback */ })
        .finally(() => setLoading(false));
    }
  }, [propQuotes]);

  const items = propQuotes && propQuotes.length > 0
    ? propQuotes
    : apiQuotes && apiQuotes.length > 0
      ? apiQuotes
      : fallbackQuotes;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-slate-800">
          Quote Follow-Up
        </h2>
        <Link
          href="/quotes"
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((quote: any, index: number) => {
            const status = statusConfig[quote.status] || statusConfig.pending;
            const isUrgent = quote.status === "urgent";

            return (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={`rounded-lg p-3 border transition-all duration-200 ${
                  isUrgent
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-slate-100 hover:border-indigo-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isUrgent ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {quote.client}
                      </h3>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{quote.job}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-slate-600">
                        <DollarSign className="w-3 h-3 text-indigo-500" />
                        <span className="financial-figure">
                          ${(quote.amount || 0).toLocaleString()}
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-300">|</span>
                      <span className="text-xs text-slate-400">
                        {quote.daysSince || 0} days ago
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href="/quotes"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
                        isUrgent
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      Follow up now
                    </Link>
                    <button
                      onClick={() => alert(`Calling ${quote.client} about ${quote.job} (placeholder)`)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Call client"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <FileText className="w-8 h-8 mb-2" />
          <p className="text-sm text-slate-500">No pending quotes</p>
          <p className="text-xs mt-1">Quotes you send will appear here.</p>
        </div>
      )}
    </div>
  );
}
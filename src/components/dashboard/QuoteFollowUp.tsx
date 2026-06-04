"use client";

import { motion } from "framer-motion";
import { Phone, Send, AlertTriangle, Clock, DollarSign, FileText } from "lucide-react";
import Link from "next/link";
import { quotes as fallbackQuotes } from "@/lib/sampleData";

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-profit-amber", bg: "bg-profit-amber/10" },
  "followed-up": { label: "Followed Up", color: "text-profit-green", bg: "bg-profit-green/10" },
  urgent: { label: "Urgent", color: "text-profit-red", bg: "bg-profit-red/10" },
  won: { label: "Won", color: "text-profit-green", bg: "bg-profit-green/10" },
  lost: { label: "Lost", color: "text-gray-400", bg: "bg-gray-400/10" },
};

export default function QuoteFollowUp({ quotes }: { quotes?: any[] }) {
  const items = quotes && quotes.length > 0 ? quotes : fallbackQuotes;
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-white">
          Quote Follow-Up
        </h2>
        <Link
          href="/quotes"
          className="text-xs text-amber hover:text-amber-400 font-medium transition-colors"
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
                    ? "bg-profit-red/5 border-profit-red/20"
                    : "bg-navy border-navy-border hover:border-amber/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isUrgent ? (
                    <AlertTriangle className="w-5 h-5 text-profit-red mt-0.5 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">
                        {quote.client}
                      </h3>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{quote.job}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-300">
                        <DollarSign className="w-3 h-3 text-amber" />
                        <span className="financial-figure">
                          ${(quote.amount || 0).toLocaleString()}
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-500">|</span>
                      <span className="text-xs text-gray-400">
                        {quote.daysSince || 0} days ago
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href="/quotes"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 ${
                        isUrgent
                          ? "bg-amber text-navy hover:bg-amber-600"
                          : "bg-navy-elevated text-gray-300 hover:text-white border border-navy-border"
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      Follow up now
                    </Link>
                    <button
                      onClick={() =>
                        alert(`Calling ${quote.client} about ${quote.job} (placeholder)`)
                      }
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-navy-elevated rounded-lg transition-colors"
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
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <FileText className="w-8 h-8 mb-2" />
          <p className="text-sm">No pending quotes</p>
          <p className="text-xs mt-1">Quotes you send will appear here.</p>
        </div>
      )}
    </div>
  );
}
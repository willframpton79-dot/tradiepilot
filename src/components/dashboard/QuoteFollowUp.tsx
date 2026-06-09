"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Send, Phone, AlertTriangle, DollarSign } from "lucide-react";

interface QuoteFollowUpProps {
  quotes?: any[];
}

const statusConfig: any = {
  pending: { label: "Sent", color: "text-slate-600", bg: "bg-slate-100" },
  urgent: { label: "Urgent", color: "text-rose-600", bg: "bg-rose-50" },
  "followed-up": { label: "Followed Up", color: "text-indigo-600", bg: "bg-indigo-50" },
};

export default function QuoteFollowUp({ quotes = [] }: QuoteFollowUpProps) {
  // Use sample if empty for demo feel, or just show empty
  const displayQuotes = quotes.length > 0 ? quotes.slice(0, 3) : [];

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Quote Follow-Up</h2>
        <Link 
          href="/quotes" 
          className="text-sm font-medium text-indigo hover:text-indigo-hover transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {displayQuotes.length > 0 ? (
          displayQuotes.map((quote, index) => {
            const status = statusConfig[quote.status] || statusConfig.pending;
            const isUrgent = quote.status === "urgent";

            return (
              <motion.div
                key={quote.id || quote._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isUrgent ? "bg-rose-50/30 border-rose-100 shadow-sm shadow-rose-500/5" : "bg-white border-slate-100 hover:border-indigo/20 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                      {isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
                   </div>
                   <div className="flex items-center gap-1.5">
                      <button className="p-1.5 text-slate-400 hover:text-indigo hover:bg-indigo-50 rounded-lg transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-indigo hover:bg-indigo-50 rounded-lg transition-colors">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>

                <div className="min-w-0 mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">{quote.client}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{quote.job}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm tracking-tight">${quote.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {quote.daysSince} days ago
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400 italic">No quotes requiring follow-up.</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, Send, Phone, AlertTriangle, DollarSign, MessageSquare, ArrowRight } from "lucide-react";
import { type Quote, quotes as fallbackQuotes } from "@/lib/sampleData";

const statusConfig: any = {
  pending: { label: "Sent", color: "text-slate-600", bg: "bg-slate-100" },
  urgent: { label: "Urgent", color: "text-rose-600", bg: "bg-rose-50" },
  "followed-up": { label: "Followed Up", color: "text-indigo-600", bg: "bg-indigo-50" },
};

export default function QuoteFollowUp({ quotes: propsQuotes }: { quotes?: any[] }) {
  const [quotes, setQuotes] = useState<any[]>(propsQuotes || []);
  const [isLoading, setIsLoading] = useState(!propsQuotes);

  useEffect(() => {
    if (propsQuotes) {
      setQuotes(propsQuotes);
      return;
    }

    async function fetchQuotes() {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        if (data.quotes && Array.isArray(data.quotes)) {
          setQuotes(data.quotes.slice(0, 3));
        } else {
          setQuotes(fallbackQuotes.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch quotes:", error);
        setQuotes(fallbackQuotes.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuotes();
  }, [propsQuotes]);

  if (isLoading) {
    return <div className="card h-full animate-pulse flex flex-col">
      <div className="h-6 w-1/3 bg-slate-100 rounded mb-4" />
      <div className="space-y-4">
        <div className="h-24 bg-slate-50 rounded-xl" />
        <div className="h-24 bg-slate-50 rounded-xl" />
      </div>
    </div>;
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Quote Follow-up</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Don&apos;t let leads go cold</p>
        </div>
        <Link 
          href="/quotes" 
          className="text-sm font-semibold text-indigo hover:text-indigo-hover transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {quotes.length > 0 ? (
          quotes.map((quote, index) => {
            const status = statusConfig[quote.status] || statusConfig.pending;
            const isUrgent = quote.status === "urgent" || quote.daysSince > 7;

            return (
              <motion.div
                key={quote.id || quote._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  isUrgent ? "bg-rose-50/30 border-rose-100" : "bg-white border-slate-100 hover:border-indigo/20 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isUrgent ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                        {isUrgent ? 'Urgent' : 'Pending'}
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
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">{quote.client}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{quote.job}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-slate-900 font-bold">
                    <span className="text-xs sm:text-sm tracking-tight">${quote.amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {quote.daysSince}d ago
                  </div>
                </div>
                
                <button className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo text-white text-xs font-bold py-2 rounded-lg hover:bg-indigo-hover transition-all">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Follow up now
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-400 italic">No quotes requiring follow-up.</p>
          </div>
        )}
      </div>

      <Link href="/quotes" className="mt-4 p-3 bg-slate-50 rounded-lg text-slate-600 hover:text-indigo hover:bg-indigo-50 transition-all text-xs font-bold flex items-center justify-center gap-2 group">
        View all pending quotes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

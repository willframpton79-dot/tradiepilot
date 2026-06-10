'use client';

import { useEffect, useState } from "react";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { type Quote, fallbackQuotes } from "@/lib/sampleData";

export default function QuoteFollowUp({ quotes: propsQuotes }: { quotes?: Quote[] }) {
  const [quotes, setQuotes] = useState<Quote[]>(propsQuotes || []);
  const [isLoading, setIsLoading] = useState(!propsQuotes);

  useEffect(() => {
    if (propsQuotes) return;

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
    return <div className="bg-white border border-slate-200 rounded-xl p-6 h-[300px] animate-pulse" />;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Quote Follow-up</h3>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Don't let leads go cold</p>
      </div>

      <div className="divide-y divide-slate-50 flex-1">
        {quotes.map((quote) => (
          <div key={quote.id} className="p-5 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{quote.client}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{quote.project}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 financial-figure">
                  ${quote.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  <span>{quote.daysOpen}d ago</span>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2.5 rounded-lg transition-all">
              <MessageSquare className="w-3.5 h-3.5" />
              Follow up now
            </button>
          </div>
        ))}
      </div>

      <button className="p-4 bg-slate-50 border-t border-slate-100 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-bold flex items-center justify-center gap-2">
        View all pending quotes <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

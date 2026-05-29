"use client";

import { motion } from "framer-motion";
import { Receipt, Store } from "lucide-react";
import type { ReceiptEntry } from "@/lib/sampleData";

interface ReceiptLogProps {
  entries: ReceiptEntry[];
}

const categoryColors: Record<string, string> = {
  materials: "text-profit-green bg-profit-green/10",
  supplies: "text-profit-amber bg-profit-amber/10",
  equipment: "text-blue-400 bg-blue-400/10",
  subcontractor: "text-purple-400 bg-purple-400/10",
};

export default function ReceiptLog({ entries }: ReceiptLogProps) {
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-white">Receipt Log</h2>
        <button
          onClick={() => alert("Adding receipt (placeholder)")}
          className="btn-primary text-xs px-3 py-1.5"
        >
          + Add Receipt
        </button>
      </div>

      {/* Summary */}
      <div className="mb-4 pb-3 border-b border-navy-border">
        <span className="text-xs text-gray-400">Total spent on materials & supplies: </span>
        <span className="financial-figure text-white font-semibold text-sm">
          ${totalCost.toLocaleString()}
        </span>
      </div>

      {/* Entries */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
        {entries.map((entry, index) => {
          const colorClass = categoryColors[entry.category] || "text-gray-400 bg-gray-400/10";
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-navy rounded-lg p-3 border border-navy-border hover:border-amber/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium">{entry.item}</p>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${colorClass}`}>
                      {entry.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Store className="w-3 h-3" />
                      {entry.supplier}
                    </span>
                    <span className="text-[10px] text-gray-500">|</span>
                    <span className="text-xs text-gray-400">{entry.date}</span>
                  </div>
                </div>
                <span className="financial-figure text-sm font-semibold text-white ml-2">
                  ${entry.cost.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
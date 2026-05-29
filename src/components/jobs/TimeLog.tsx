"use client";

import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import type { TimeEntry } from "@/lib/sampleData";

interface TimeLogProps {
  entries: TimeEntry[];
}

export default function TimeLog({ entries }: TimeLogProps) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-white">Time Log</h2>
        <button
          onClick={() => alert("Logging time entry (placeholder)")}
          className="btn-primary text-xs px-3 py-1.5"
        >
          + Log Time
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-4 pb-3 border-b border-navy-border">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="w-3.5 h-3.5 text-amber" />
          <span className="financial-figure text-white font-semibold">{totalHours.toFixed(1)}h</span>
          <span>total</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="financial-figure text-white font-semibold">${totalCost.toLocaleString()}</span>
          <span>total cost</span>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-navy rounded-lg p-3 border border-navy-border hover:border-amber/20 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">{entry.date}</p>
                <p className="text-sm text-white mt-0.5">{entry.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    {entry.staff}
                  </span>
                  <span className="text-[10px] text-gray-500">|</span>
                  <span className="text-xs text-gray-400">
                    {entry.hours}h @ ${entry.rate}/hr
                  </span>
                </div>
              </div>
              <span className="financial-figure text-sm font-semibold text-white ml-2">
                ${entry.cost.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
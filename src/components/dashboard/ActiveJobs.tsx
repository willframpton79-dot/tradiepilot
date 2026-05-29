"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye } from "lucide-react";
import { activeJobs } from "@/lib/sampleData";
import ProfitGauge from "./ProfitGauge";

const statusConfig = {
  "on-track": { label: "On Track", color: "text-profit-green" },
  "at-risk": { label: "At Risk", color: "text-profit-amber" },
  critical: { label: "Critical", color: "text-profit-red" },
};

const progressBarColor = (margin: number) => {
  if (margin >= 30) return "bg-profit-green";
  if (margin >= 20) return "bg-profit-amber";
  return "bg-profit-red";
};

export default function ActiveJobs() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-white">
          Active Jobs
        </h2>
        <button
          onClick={() => alert("Viewing all active jobs (placeholder)")}
          className="text-xs text-amber hover:text-amber-400 font-medium transition-colors"
        >
          View All
        </button>
      </div>
      <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
        {activeJobs.map((job, index) => {
          const status = statusConfig[job.status];
          return (
            <Link
              href={`/jobs/${job.id}`}
              key={job.id}
              className="block"
            >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              className="bg-navy rounded-lg p-3 border border-navy-border hover:border-amber/20 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Profit Gauge */}
                <ProfitGauge margin={job.margin} size={52} />

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {job.name}
                    </h3>
                    <span className={`text-[10px] font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{job.client}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="financial-figure text-xs text-gray-300">
                      ${job.profit.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500">|</span>
                    <span className="text-xs text-gray-400">
                      Due {job.dueDate}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 bg-navy-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressBarColor(
                        job.margin
                      )}`}
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>

                {/* View Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, Briefcase, Loader2 } from "lucide-react";
import { activeJobs as fallbackJobs } from "@/lib/sampleData";
import { api } from "@/lib/api";
import ProfitGauge from "./ProfitGauge";

const statusConfig: Record<string, { label: string; color: string }> = {
  "on-track": { label: "On Track", color: "text-green-600" },
  "at-risk": { label: "At Risk", color: "text-amber-500" },
  critical: { label: "Critical", color: "text-red-500" },
};

const progressBarColor = (margin: number) => {
  if (margin >= 30) return "bg-green-500";
  if (margin >= 20) return "bg-amber-500";
  return "bg-red-500";
};

export default function ActiveJobs({ jobs: propJobs }: { jobs?: any[] }) {
  const [apiJobs, setApiJobs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propJobs) {
      setLoading(true);
      api.getJobs()
        .then((data: any) => {
          if (Array.isArray(data) && data.length > 0) setApiJobs(data);
        })
        .catch(() => { /* fallback */ })
        .finally(() => setLoading(false));
    }
  }, [propJobs]);

  const items = propJobs && propJobs.length > 0
    ? propJobs
    : apiJobs && apiJobs.length > 0
      ? apiJobs
      : fallbackJobs;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold text-slate-800">
          Active Jobs
        </h2>
        <button
          onClick={() => alert("Viewing all active jobs (placeholder)")}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View All
        </button>
      </div>
      {items.length > 0 ? (
        <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
          {items.map((job: any, index: number) => {
            const status = statusConfig[job.status] || statusConfig["on-track"];
            return (
              <Link href={`/jobs/${job.id}`} key={job.id} className="block">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="bg-white rounded-lg p-3 border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ProfitGauge margin={job.margin} size={52} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">
                          {job.name}
                        </h3>
                        <span className={`text-[10px] font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{job.client}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="financial-figure text-xs text-slate-600">
                          ${(job.profit || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-300">|</span>
                        <span className="text-xs text-slate-400">
                          Due {job.dueDate}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressBarColor(job.margin)}`}
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <Briefcase className="w-8 h-8 mb-2" />
          <p className="text-sm text-slate-500">No active jobs yet</p>
          <p className="text-xs mt-1">Create your first job to get started.</p>
        </div>
      )}
    </div>
  );
}
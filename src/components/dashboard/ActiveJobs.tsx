"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Clock, AlertCircle } from "lucide-react";

interface ActiveJobsProps {
  jobs?: any[];
}

export default function ActiveJobs({ jobs = [] }: ActiveJobsProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Active Jobs</h2>
        <Link 
          href="/dashboard" 
          className="text-sm font-medium text-indigo hover:text-indigo-hover transition-colors"
        >
          View pipeline
        </Link>
      </div>

      <div className="space-y-1">
        {jobs.length > 0 ? (
          jobs.slice(0, 4).map((job, i) => (
            <Link 
              key={job.id || job._id} 
              href={`/jobs/${job.id || job._id}`}
              className="group block"
            >
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-2 h-10 rounded-full ${
                    job.marginPct > 30 ? 'bg-emerald-400' : job.marginPct > 20 ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {job.client?.name || 'Private Client'}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-400 px-1.5 py-0.5 bg-slate-100 rounded">
                        {job.jobId}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{job.marginPct}%</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Margin</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo transition-colors" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
             <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
             <p className="text-sm text-slate-500 font-medium">No active jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

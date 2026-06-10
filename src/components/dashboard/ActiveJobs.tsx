"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Clock, AlertCircle } from "lucide-react";
import { type Job, activeJobs as fallbackJobs } from "@/lib/sampleData";

export default function ActiveJobs({ jobs: propsJobs }: { jobs?: any[] }) {
  const [jobs, setJobs] = useState<any[]>(propsJobs || fallbackJobs.slice(0, 5));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (propsJobs) {
      setJobs(propsJobs);
      return;
    }
    async function fetchJobs() {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs.slice(0, 5));
        }
      } catch (error) {
        // keep fallback already set in useState
      }
    }
    fetchJobs();
  }, [propsJobs]);

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Active Jobs</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Real-time profitability</p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-indigo hover:text-indigo-hover transition-colors">
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin -mx-6 px-6">
        {jobs.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <Link
                key={job.id || job._id}
                href={`/jobs/${job.id || job._id}`}
                className="group flex items-center py-4 hover:bg-slate-50 transition-all duration-200 -mx-4 sm:-mx-6 px-4 sm:px-6"
              >
                <div className="flex-1 min-w-0 mr-3 sm:mr-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-indigo transition-colors">
                      {job.name || job.title}
                    </h4>
                    <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                      (job.margin || job.marginPct) < 20 ? 'bg-red-500 animate-pulse' : 
                      (job.margin || job.marginPct) < 30 ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`} />
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        (job.margin || job.marginPct) < 20 ? 'bg-red-500' :
                        (job.margin || job.marginPct) < 30 ? 'bg-amber-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, (job.margin || job.marginPct) * 2))}%` }}
                    />
                  </div>
                </div>

                <div className="text-right mr-3 sm:mr-4 shrink-0">
                  <p className={`text-xs sm:text-sm font-bold financial-figure ${
                    (job.margin || job.marginPct) < 20 ? 'text-red-600' :
                    (job.margin || job.marginPct) < 30 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {(job.margin || job.marginPct).toFixed(1)}%
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider">Margin</p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No active jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

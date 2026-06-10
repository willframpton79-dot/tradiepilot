'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type Job, activeJobs as fallbackJobs } from "@/lib/sampleData";

export default function ActiveJobs({ jobs: propsJobs }: { jobs?: Job[] }) {
  const [jobs, setJobs] = useState<Job[]>(propsJobs || []);
  const [isLoading, setIsLoading] = useState(!propsJobs);

  useEffect(() => {
    if (propsJobs) return;
    async function fetchJobs() {
      try {
        const res = await fetch("/api/data");
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs.slice(0, 5));
        } else {
          setJobs(fallbackJobs.slice(0, 5));
        }
      } catch (error) {
        setJobs(fallbackJobs.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
  }, [propsJobs]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-slate-100 rounded"></div>
          <div className="h-3 w-24 bg-slate-50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Active Jobs</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">Real-time profitability</p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-50 overflow-y-auto scrollbar-thin">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="group flex items-center p-5 hover:bg-slate-50 transition-all duration-200"
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                  {job.name}
                </h4>
                {job.margin < 20 ? (
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ) : job.margin < 30 ? (
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                ) : (
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-500" />
                )}
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    job.margin < 20 ? 'bg-red-500' :
                    job.margin < 30 ? 'bg-amber-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, job.margin * 2))}%` }}
                />
              </div>
            </div>

            <div className="text-right mr-4 shrink-0">
              <p className={`text-sm font-bold financial-figure ${
                job.margin < 20 ? 'text-red-600' :
                job.margin < 30 ? 'text-amber-600' :
                'text-green-600'
              }`}>
                {job.margin.toFixed(1)}%
              </p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Margin</p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </Link>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="p-10 text-center flex-1 flex flex-col items-center justify-center">
          <p className="text-slate-400 text-sm">No active jobs found.</p>
        </div>
      )}
    </div>
  );
}

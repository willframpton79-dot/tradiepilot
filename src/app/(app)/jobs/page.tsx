'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  Building2, 
  MapPin, 
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  _id: string;
  jobId: string;
  title: string;
  client: {
    name: string;
  };
  quotedTotal: number;
  marginPct: number;
  status: string;
  suburb: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.suburb.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (margin >= 15) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'active':
      case 'in progress': return <Clock className="w-4 h-4 text-indigo-500 animate-pulse" />;
      default: return <AlertCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-slate-500 font-medium italic">Loading your jobs portfolio...</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-indigo-600" />
              Active Jobs
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor your project profitability and progress in real-time.</p>
          </div>
          <Link
            href="/jobs/new"
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 sm:shrink-0 w-full md:w-auto"
          >
            <Plus className="w-5 h-5" /> New Job
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search jobs, clients, or suburbs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">No jobs yet</h3>
              <p className="text-slate-500 mt-1 max-w-sm">Add your first job to start tracking margins and capturing profit leaks before they happen.</p>
            </div>
            <Link 
              href="/jobs/new"
              className="mt-4 flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
            >
              Add your first job <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <div className="col-span-4">Job / Client</div>
              <div className="col-span-2">Suburb</div>
              <div className="col-span-2">Contract Value</div>
              <div className="col-span-2">Current Margin</div>
              <div className="col-span-2">Status</div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Link 
                    href={`/jobs/${job._id}`}
                    className="group bg-white border border-slate-200 rounded-2xl p-4 lg:px-6 lg:py-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col lg:grid lg:grid-cols-12 lg:items-center gap-4 relative overflow-hidden"
                  >
                    {/* Hover indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="col-span-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {job.jobId}
                        </span>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {job.title}
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.client.name}
                      </p>
                    </div>

                    <div className="col-span-2 lg:block flex items-center justify-between border-t lg:border-t-0 pt-3 lg:pt-0">
                      <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Location</span>
                      <p className="text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.suburb}
                      </p>
                    </div>

                    <div className="col-span-2 lg:block flex items-center justify-between">
                      <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Contract</span>
                      <p className="font-bold text-slate-900">
                        ${job.quotedTotal?.toLocaleString()}
                      </p>
                    </div>

                    <div className="col-span-2 lg:block flex items-center justify-between">
                      <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Margin</span>
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-bold ${getMarginColor(job.marginPct)}`}>
                        {job.marginPct}%
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between lg:justify-start gap-3">
                      <span className="lg:hidden text-xs font-bold text-slate-400 uppercase">Status</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-50 p-1.5 rounded-lg">
                          {getStatusIcon(job.status)}
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          {job.status || 'Active'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all ml-auto hidden lg:block" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredJobs.length === 0 && jobs.length > 0 && (
              <div className="text-center py-10">
                <p className="text-slate-400 font-medium italic">No jobs match your search &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

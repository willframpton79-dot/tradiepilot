"use client";
import { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, Clock, AlertTriangle, 
  CheckCircle, MoreHorizontal, User,
  Calendar, MapPin, DollarSign,
  Plus, Receipt as ReceiptIcon
} from "lucide-react";
import { activeJobs } from "@/lib/sampleData";
import HeroGauge from "@/components/jobs/HeroGauge";
import CostBreakdown from "@/components/jobs/CostBreakdown";
import TimeLog from "@/components/jobs/TimeLog";
import ReceiptLog from "@/components/jobs/ReceiptLog";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = activeJobs.find((j) => j.id === id) || activeJobs[0];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo transition-colors text-sm font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">
               {job.jobId}
             </span>
             <span className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
               <Calendar className="w-3.5 h-3.5" /> Started {job.startDate}
             </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{job.title}</h1>
          <div className="flex items-center gap-4 mt-3">
             <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <User className="w-4 h-4" /> {job.client.name}
             </div>
             <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <MapPin className="w-4 h-4" /> {job.client.suburb}
             </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn-secondary flex items-center gap-2">
              <MoreHorizontal className="w-4 h-4" />
           </button>
           <button className="btn-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Mark Complete
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Gauge Section */}
           <div className="card bg-white shadow-sm">
              <HeroGauge 
                quotedTotal={job.quotedTotal}
                actualTotal={job.actualTotal}
              />
           </div>

           {/* Logs */}
           <div className="grid md:grid-cols-2 gap-8">
              <TimeLog entries={job.timeLog} />
              <ReceiptLog entries={job.receiptLog} />
           </div>
        </div>

        <div className="space-y-8">
           {/* Cost Breakdown */}
           <CostBreakdown 
              receipts={job.receiptLog}
              time={job.timeLog}
              quoted={job.quotedTotal}
           />

           {/* Quick Actions */}
           <div className="card">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Crew Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                 <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo/30 hover:bg-indigo-50/30 transition-all group">
                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-white transition-colors">
                       <Clock className="w-6 h-6 text-indigo" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Log Time</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo/30 hover:bg-indigo-50/30 transition-all group">
                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-white transition-colors">
                       <ReceiptIcon className="w-6 h-6 text-indigo" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Add Receipt</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-amber/30 hover:bg-amber-50/30 transition-all group">
                    <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-white transition-colors">
                       <AlertTriangle className="w-6 h-6 text-amber-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Variation</span>
                 </button>
                 <button className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-indigo/30 hover:bg-indigo-50/30 transition-all group">
                    <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-white transition-colors">
                       <DollarSign className="w-6 h-6 text-indigo" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Invoice</span>
                 </button>
              </div>
           </div>

           {/* Overrun Notes */}
           {job.overrunNotes && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
                   <AlertTriangle className="w-4 h-4" /> Profit Alert
                </div>
                <p className="text-xs text-rose-700 leading-relaxed font-medium">
                  {job.overrunNotes}
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

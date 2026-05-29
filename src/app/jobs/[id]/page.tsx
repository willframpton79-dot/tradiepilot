"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, AlertTriangle, Timer, User, CheckCircle, Clock } from "lucide-react";
import { getJobDetail } from "@/lib/sampleData";
import HeroGauge from "@/components/jobs/HeroGauge";
import CostBreakdown from "@/components/jobs/CostBreakdown";
import TimeLog from "@/components/jobs/TimeLog";
import ReceiptLog from "@/components/jobs/ReceiptLog";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: "Active", color: "text-profit-green", icon: Timer },
  completed: { label: "Completed", color: "text-blue-400", icon: CheckCircle },
  on_hold: { label: "On Hold", color: "text-profit-amber", icon: Clock },
  cancelled: { label: "Cancelled", color: "text-profit-red", icon: AlertTriangle },
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const job = getJobDetail(id);

  if (!job) {
    return (
      <div className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-amber hover:text-amber-400 transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="card text-center py-12">
          <AlertTriangle className="w-12 h-12 text-profit-amber mx-auto mb-3" />
          <h2 className="text-xl font-heading font-bold text-white">Job Not Found</h2>
          <p className="text-gray-400 text-sm mt-1">The job &quot;{id}&quot; could not be found.</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[job.status] || statusConfig.active;
  const StatusIcon = status.icon;
  const isOverBudget = job.marginPct < 0;

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-amber hover:text-amber-400 transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl lg:text-2xl font-heading font-bold text-white">
                {job.title}
              </h1>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-navy-elevated ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{job.description}</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber" />
            {job.client.name}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber" />
            {job.suburb}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber" />
            {job.startDate} — {job.dueDate}
          </span>
        </div>

        {/* Overrun warning */}
        {job.overrunNotes && (
          <div className="mt-3 bg-profit-red/5 border border-profit-red/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-profit-red mt-0.5 shrink-0" />
            <p className="text-xs text-gray-300">{job.overrunNotes}</p>
          </div>
        )}
      </motion.div>

      {/* Hero Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated mb-6"
      >
        <HeroGauge
          margin={job.margin}
          marginPct={job.marginPct}
          quotedTotal={job.quotedTotal}
          actualTotal={job.actualTotal}
        />
      </motion.div>

      {/* Cost Breakdown + Action Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <CostBreakdown
          quotedLabour={job.quotedLabour}
          actualLabour={job.actualLabour}
          quotedMaterials={job.quotedMaterials}
          actualMaterials={job.actualMaterials}
          quotedSubcontractors={job.quotedSubcontractors}
          actualSubcontractors={job.actualSubcontractors}
        />

        {/* Action Buttons */}
        <div className="card">
          <h2 className="text-lg font-heading font-bold text-white mb-4">Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => alert("Logging time for this job (placeholder)")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-navy border border-navy-border hover:border-amber/20 hover:bg-navy-elevated transition-all duration-200 active:scale-95"
            >
              <Clock className="w-6 h-6 text-amber" />
              <span className="text-xs font-medium text-white">Log Time</span>
            </button>
            <button
              onClick={() => alert("Adding receipt for this job (placeholder)")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-navy border border-navy-border hover:border-amber/20 hover:bg-navy-elevated transition-all duration-200 active:scale-95"
            >
              <ReceiptIcon className="w-6 h-6 text-amber" />
              <span className="text-xs font-medium text-white">Add Receipt</span>
            </button>
            <button
              onClick={() => alert("Raising a variation for this job (placeholder)")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-navy border border-navy-border hover:border-amber/20 hover:bg-navy-elevated transition-all duration-200 active:scale-95"
            >
              <AlertTriangle className="w-6 h-6 text-amber" />
              <span className="text-xs font-medium text-white">Raise Variation</span>
            </button>
            <button
              onClick={() => alert(`Marking "${job.title}" as complete (placeholder)`)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-navy border border-navy-border hover:border-amber/20 hover:bg-navy-elevated transition-all duration-200 active:scale-95"
            >
              <CheckCircle className="w-6 h-6 text-profit-green" />
              <span className="text-xs font-medium text-white">Mark Complete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Time Log & Receipt Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <TimeLog entries={job.timeLog} />
        <ReceiptLog entries={job.receiptLog} />
      </div>
    </div>
  );
}

function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}
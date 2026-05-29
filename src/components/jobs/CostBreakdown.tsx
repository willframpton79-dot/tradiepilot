"use client";

import { motion } from "framer-motion";
import { DollarSign, Wrench, PackageOpen, Users } from "lucide-react";

interface CostRowProps {
  label: string;
  quoted: number;
  actual: number;
  icon: React.ReactNode;
  delay: number;
}

function CostRow({ label, quoted, actual, icon, delay }: CostRowProps) {
  const maxVal = Math.max(quoted, actual, 1);
  const quotedWidth = (quoted / maxVal) * 100;
  const actualWidth = (actual / maxVal) * 100;
  const variance = actual - quoted;
  const isOver = variance > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <span
          className={`financial-figure text-xs font-medium ${
            isOver ? "text-profit-red" : "text-profit-green"
          }`}
        >
          {isOver ? "+" : ""}${variance.toLocaleString()}
        </span>
      </div>

      {/* Quoted bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Quoted</span>
          <span className="financial-figure text-gray-300">${quoted.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-navy-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-amber/70"
            initial={{ width: 0 }}
            animate={{ width: `${quotedWidth}%` }}
            transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Actual bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Actual</span>
          <span className="financial-figure text-gray-300">${actual.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-navy-surface rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isOver ? "bg-profit-red" : "bg-profit-green"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${actualWidth}%` }}
            transition={{ duration: 1, delay: delay + 0.4, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface CostBreakdownProps {
  quotedLabour: number;
  actualLabour: number;
  quotedMaterials: number;
  actualMaterials: number;
  quotedSubcontractors: number;
  actualSubcontractors: number;
}

export default function CostBreakdown({
  quotedLabour,
  actualLabour,
  quotedMaterials,
  actualMaterials,
  quotedSubcontractors,
  actualSubcontractors,
}: CostBreakdownProps) {
  return (
    <div className="card">
      <h2 className="text-lg font-heading font-bold text-white mb-4">
        Cost Breakdown
      </h2>
      <div className="space-y-5">
        <CostRow
          label="Labour"
          quoted={quotedLabour}
          actual={actualLabour}
          icon={<Wrench className="w-4 h-4" />}
          delay={0.1}
        />
        <CostRow
          label="Materials"
          quoted={quotedMaterials}
          actual={actualMaterials}
          icon={<PackageOpen className="w-4 h-4" />}
          delay={0.2}
        />
        <CostRow
          label="Subcontractors"
          quoted={quotedSubcontractors}
          actual={actualSubcontractors}
          icon={<Users className="w-4 h-4" />}
          delay={0.3}
        />
      </div>
    </div>
  );
}
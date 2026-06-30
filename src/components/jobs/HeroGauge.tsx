"use client";
import { motion } from "framer-motion";

interface HeroGaugeProps {
  quotedTotal: number;
  actualTotal: number;
  targetMarginPct?: number;
}

export default function HeroGauge({ quotedTotal, actualTotal, targetMarginPct = 30 }: HeroGaugeProps) {
  const margin = quotedTotal - actualTotal;
  const marginPct = (margin / quotedTotal) * 100;
  const isNegative = margin < 0;

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const displayPct = Math.max(0, Math.min(100, marginPct));
  // At target margin → ~67% fill (looks healthy); at 1.5× target → full arc
  const fillRatio = Math.min(displayPct / (targetMarginPct * 1.5), 1);
  const offset = circumference - fillRatio * circumference;

  const color = isNegative ? "#ef4444" : marginPct >= 30 ? "#10b981" : marginPct >= 20 ? "#f59e0b" : "#ef4444";
  const label = isNegative ? "Loss" : marginPct >= 30 ? "Strong" : marginPct >= 20 ? "Caution" : "Critical";
  const formattedPct = isNegative ? `${Math.abs(marginPct).toFixed(1)}%` : `${marginPct.toFixed(1)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px]">
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
          <motion.circle
            cx="80" cy="80" r={radius} fill="none"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ color }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            {formattedPct}
          </motion.span>
          <motion.span
            className="text-[10px] font-bold uppercase tracking-widest mt-1"
            style={{ color }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          >
            {label}
          </motion.span>
        </div>
      </div>

      <motion.div
        className="flex items-center gap-6 sm:gap-8 mt-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Quoted</p>
          <p className="text-base font-bold text-slate-800">${quotedTotal.toLocaleString()}</p>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cost</p>
          <p className="text-base font-bold text-slate-800">${actualTotal.toLocaleString()}</p>
        </div>
        <div className="w-px h-8 bg-slate-100" />
        <div className="text-center">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Profit</p>
          <p className={`text-base font-bold ${isNegative ? 'text-rose-500' : 'text-emerald-500'}`}>
            {isNegative ? '-' : '+'}${Math.abs(margin).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

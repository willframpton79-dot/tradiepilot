"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface HeroGaugeProps {
  margin: number;
  marginPct: number;
  quotedTotal: number;
  actualTotal: number;
}

export default function HeroGauge({ margin, marginPct, quotedTotal, actualTotal }: HeroGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.abs(marginPct), 100);
  const offset = circumference - (percentage / 100) * circumference;
  const isNegative = marginPct < 0;

  const color = isNegative ? "#EF4444" : marginPct >= 30 ? "#10B981" : marginPct >= 20 ? "#F59E0B" : "#EF4444";
  const label = isNegative ? "Loss" : marginPct >= 30 ? "Strong" : marginPct >= 20 ? "Caution" : "Critical";
  const formattedPct = isNegative ? `${Math.abs(marginPct).toFixed(1)}%` : `${marginPct.toFixed(1)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center"
    >
      {/* Gauge */}
      <div className="relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px]">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full transform -rotate-90"
        >
          {/* Background ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#2A3A50"
            strokeWidth="10"
          />
          {/* Progress ring */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="financial-figure text-3xl lg:text-4xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {formattedPct}
          </motion.span>
          <motion.span
            className="text-xs font-medium mt-1"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {label}
          </motion.span>
        </div>
      </div>

      {/* Legend */}
      <motion.div
        className="flex items-center gap-6 mt-4 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="text-center">
          <p className="text-gray-400 text-xs">Quoted</p>
          <p className="financial-figure text-white font-bold text-base">
            ${quotedTotal.toLocaleString()}
          </p>
        </div>
        <div className="w-px h-8 bg-navy-border" />
        <div className="text-center">
          <p className="text-gray-400 text-xs">Actual Cost</p>
          <p className="financial-figure text-white font-bold text-base">
            ${actualTotal.toLocaleString()}
          </p>
        </div>
        <div className="w-px h-8 bg-navy-border" />
        <div className="text-center">
          <p className="text-gray-400 text-xs">Profit</p>
          <p
            className="financial-figure font-bold text-base"
            style={{ color: isNegative ? "#EF4444" : "#10B981" }}
          >
            {isNegative ? "-" : "+"}${Math.abs(margin).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
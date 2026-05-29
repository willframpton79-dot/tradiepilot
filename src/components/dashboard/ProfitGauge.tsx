"use client";

import { motion } from "framer-motion";

interface ProfitGaugeProps {
  margin: number;
  size?: number;
}

export default function ProfitGauge({ margin, size = 48 }: ProfitGaugeProps) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (margin / 100) * circumference;

  const getColor = (m: number) => {
    if (m >= 30) return "#10B981";
    if (m >= 20) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = (m: number) => {
    if (m >= 30) return "Good";
    if (m >= 20) return "Caution";
    return "Critical";
  };

  const color = getColor(margin);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#2A3A50"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="financial-figure text-xs font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {margin.toFixed(0)}%
        </motion.span>
      </div>
    </div>
  );
}
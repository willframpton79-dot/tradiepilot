"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  index: number;
}

const changeIcons = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
};

const changeColors = {
  positive: "text-green-600",
  negative: "text-red-500",
  neutral: "text-slate-400",
};

export default function StatCard({
  label,
  value,
  change,
  changeType,
  index,
}: StatCardProps) {
  const Icon = changeIcons[changeType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-default"
    >
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="financial-figure text-2xl font-bold text-slate-800 mt-2">
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        <Icon className={`w-3.5 h-3.5 ${changeColors[changeType]}`} />
        <span className={`text-xs font-medium ${changeColors[changeType]}`}>
          {change}
        </span>
      </div>
    </motion.div>
  );
}
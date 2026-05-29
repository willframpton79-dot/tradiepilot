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
  positive: "text-profit-green",
  negative: "text-profit-red",
  neutral: "text-gray-400",
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
      className="card hover:border-amber/20 transition-colors duration-300 group cursor-default"
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <Icon
          className={`w-4 h-4 ${changeColors[changeType]} opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      </div>
      <p className="financial-figure text-2xl font-bold text-white mt-2">
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
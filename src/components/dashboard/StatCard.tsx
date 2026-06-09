"use client";
import { motion } from "framer-motion";
import { ClipboardList, TrendingUp, FileText, DollarSign } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  icon: string;
  index: number;
}

const iconMap: any = {
  clipboard: ClipboardList,
  trending: TrendingUp,
  file: FileText,
  dollar: DollarSign,
};

export default function StatCard({ label, value, trend, icon, index }: StatCardProps) {
  const Icon = iconMap[icon] || ClipboardList;
  const isPositive = trend.startsWith("+");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:border-indigo/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <Icon className="w-5 h-5 text-indigo" />
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPositive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-600 border border-slate-100"
        }`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">
          {value}
        </h3>
      </div>
    </motion.div>
  );
}

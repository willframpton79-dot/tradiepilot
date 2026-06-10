"use client";

import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  index?: number;
}

export default function StatCard({ label, value, trend, trendType, icon: Icon, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:border-indigo/30 transition-all hover:shadow-md group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-indigo/5 group-hover:border-indigo/10 transition-colors">
          {Icon && <Icon className="w-5 h-5 text-indigo" />}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full border ${
            trendType === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
            trendType === 'negative' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
            'bg-slate-50 text-slate-500 border-slate-100'
          }`}>
            {trendType === 'positive' ? <ArrowUpRight className="w-3.5 h-3.5" /> : 
             trendType === 'negative' ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight financial-figure">{value}</h3>
      </div>
    </motion.div>
  );
}

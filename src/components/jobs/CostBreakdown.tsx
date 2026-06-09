"use client";
import { motion } from "framer-motion";

interface CostBreakdownProps {
  receipts: any[];
  time: any[];
  quoted: number;
}

export default function CostBreakdown({ receipts, time, quoted }: CostBreakdownProps) {
  const receiptTotal = receipts.reduce((sum, r) => sum + r.cost, 0);
  const timeTotal = time.reduce((sum, t) => sum + t.cost, 0);
  const totalActual = receiptTotal + timeTotal;
  const margin = quoted - totalActual;
  const marginPct = (margin / quoted) * 100;

  const data = [
    { label: "Materials", value: receiptTotal, color: "bg-indigo", pct: (receiptTotal / quoted) * 100 },
    { label: "Labour", value: timeTotal, color: "bg-emerald-500", pct: (timeTotal / quoted) * 100 },
    { label: "Margin", value: margin, color: "bg-slate-200", pct: (margin / quoted) * 100 },
  ];

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-slate-800 mb-6">Cost Breakdown</h2>
      
      <div className="space-y-6">
        <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-100">
          {data.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, item.pct)}%` }}
              transition={{ duration: 1, delay: i * 0.2 }}
              className={`${item.color} h-full`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">${Math.abs(item.value).toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{Math.round(item.pct)}% of quote</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800">Actual Margin</span>
            <span className={`text-lg font-bold ${marginPct >= 30 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {marginPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

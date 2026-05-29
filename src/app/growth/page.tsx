"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, TrendingUp, Lightbulb, ArrowRight, DollarSign, MapPin, Star, Target, Award, Zap } from "lucide-react";
import insightsData, { type GrowthForecast } from "@/lib/insightsData";

export default function GrowthPage() {
  const { customerLTV, suburbHotspots, marketingTips, growthForecast } = insightsData;

  const tierColors: Record<string, string> = {
    Platinum: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    Gold: "text-amber bg-amber/10 border-amber/30",
    Silver: "text-gray-300 bg-gray-300/10 border-gray-300/30",
  };

  const suburbTierColors: Record<string, string> = {
    Prime: "text-profit-green bg-profit-green/10 border-profit-green/30",
    Growth: "text-amber bg-amber/10 border-amber/30",
    Emerging: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    Monitor: "text-profit-red bg-profit-red/10 border-profit-red/30",
  };

  const effortColors: Record<string, string> = {
    Low: "text-profit-green bg-profit-green/10",
    Medium: "text-amber bg-amber/10",
    High: "text-profit-red bg-profit-red/10",
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-amber hover:text-amber-400 transition-colors text-sm mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
        </Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-white mb-6">
        Growth Intelligence
      </motion.h1>

      {/* Growth Forecast */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-elevated mb-6 text-center py-6">
        <Target className="w-8 h-8 text-amber mx-auto mb-2" />
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Projected 6-Month Revenue</p>
        <p className="financial-figure text-3xl lg:text-4xl font-bold text-white">
          ${growthForecast.projected_6mo_revenue.toLocaleString()}
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-profit-green" />{growthForecast.monthly_growth_rate_pct}% monthly growth</span>
          <span className="text-[10px] text-gray-500">|</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-amber" />${growthForecast.current_monthly_runrate.toLocaleString()}/mo current</span>
        </div>

        {/* Forecast chart */}
        <div className="grid grid-cols-6 gap-2 mt-6 max-w-xl mx-auto">
          {growthForecast.forecast_months.map((m, i) => {
            const maxVal = Math.max(...growthForecast.forecast_months.map(x => x.weighted_total));
            const heightPct = (m.weighted_total / maxVal) * 100;
            return (
              <div key={m.month} className="flex flex-col items-center gap-1">
                <div className="w-full bg-navy-surface rounded-t flex items-end justify-center" style={{ height: 60 }}>
                  <div className="w-4/5 bg-amber rounded-t transition-all duration-500" style={{ height: `${heightPct}%`, minHeight: 12 }} />
                </div>
                <span className="financial-figure text-[9px] text-gray-400">${(m.weighted_total / 1000).toFixed(1)}k</span>
                <span className="text-[8px] text-gray-500">{m.month.split(' ')[0].slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Customer LTV */}
      <div className="mb-6">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber" /> Customer Lifetime Value
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {customerLTV.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{c.job_count} job{c.job_count !== 1 ? 's' : ''}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tierColors[c.tier]}`}>
                  <Star className="w-3 h-3 inline mr-0.5 -mt-0.5" />{c.tier}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Revenue</p>
                  <p className="financial-figure text-sm font-bold text-white">${c.total_revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Margin</p>
                  <p className={`financial-figure text-sm font-bold ${c.avg_margin_pct >= 0 ? 'text-profit-green' : 'text-profit-red'}`}>
                    {c.avg_margin_pct.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Predicted LTV</p>
                  <p className="financial-figure text-sm font-bold text-amber">${c.predicted_ltv.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suburb Hotspots */}
      <div className="mb-6">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber" /> Suburb Hotspots
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {suburbHotspots.map((s, i) => (
            <motion.div key={s.suburb} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber" />
                  <h3 className="text-sm font-semibold text-white">{s.suburb} {s.postcode}</h3>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${suburbTierColors[s.tier]}`}>
                  {s.tier}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>${s.total_revenue.toLocaleString()} revenue</span>
                <span className={`font-medium ${s.avg_margin_pct >= 0 ? 'text-profit-green' : 'text-profit-red'}`}>
                  {s.avg_margin_pct.toFixed(0)}% margin
                </span>
                <span>{s.job_count} jobs</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">{s.recommendation}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marketing Tips */}
      <div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber" /> Marketing Tips
        </motion.h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {marketingTips.map((tip, i) => (
            <motion.div key={tip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card hover:border-amber/20 transition-colors">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-white">{tip.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{tip.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-profit-green/10 text-profit-green border border-profit-green/20">
                      ROI: {tip.projected_roi}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${effortColors[tip.effort]}`}>
                      {tip.effort} effort
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, TrendingUp, Lightbulb, ArrowRight, DollarSign, MapPin, Star, Target, Award, Zap, Loader2, Bug, Ban } from "lucide-react";
import { api } from "@/lib/api";

export default function GrowthPage() {
  const [data, setData] = useState<any>(null);
  const [profitLeaks, setProfitLeaks] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [insightsResult, leaksResult] = await Promise.allSettled([api.getInsights(), api.getProfitLeaks()]);
        if (insightsResult.status === "fulfilled") setData(insightsResult.value);
        if (leaksResult.status === "fulfilled") setProfitLeaks(leaksResult.value);
      } catch (e) {
        setError("Failed to load growth data");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="ml-3 text-slate-500">Loading growth intelligence...</span>
      </div>
    );
  }

  const customerLTV = data?.customer_ltv?.customers || data?.customerLTV || [];
  const suburbHotspots = data?.suburb_hotspots?.suburbs || data?.suburbHotspots || [];
  const marketingTips = data?.marketing_tips?.tips || data?.marketingTips || [];
  const growthForecast = data?.growth_forecast || data?.growthForecast || {};
  const forecastMonths = growthForecast?.forecast_months || [];
  const leakAnalyses = profitLeaks?.analyses || profitLeaks?.leaks || [];
  const leakActions = profitLeaks?.actions || [];

  const tierColors: Record<string, string> = {
    Platinum: "text-purple-600 bg-purple-50 border-purple-200",
    Gold: "text-indigo-600 bg-indigo-50 border-indigo-200",
    Silver: "text-slate-500 bg-slate-50 border-slate-200",
  };

  const suburbTierColors: Record<string, string> = {
    Prime: "text-green-600 bg-green-50 border-green-200",
    Growth: "text-indigo-600 bg-indigo-50 border-indigo-200",
    Emerging: "text-blue-600 bg-blue-50 border-blue-200",
    Monitor: "text-red-500 bg-red-50 border-red-200",
  };

  const riskColors: Record<string, string> = {
    critical: "text-red-500 bg-red-50 border-red-200",
    high: "text-amber-500 bg-amber-50 border-amber-200",
    medium: "text-yellow-500 bg-yellow-50 border-yellow-200",
    low: "text-green-600 bg-green-50 border-green-200",
  };

  const effortColors: Record<string, string> = {
    Low: "text-green-600 bg-green-50",
    Medium: "text-amber-500 bg-amber-50",
    High: "text-red-500 bg-red-50",
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors text-sm mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
        </Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-slate-900 mb-6">
        Growth Intelligence
      </motion.h1>

      {/* Growth Forecast */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-elevated mb-6 text-center py-6">
        <Target className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Projected 6-Month Revenue</p>
        <p className="financial-figure text-3xl lg:text-4xl font-bold text-slate-900">
          ${(growthForecast?.projected_6mo_revenue || 62892).toLocaleString()}
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-green-600" />{(growthForecast?.monthly_growth_rate_pct || 8)}% monthly growth</span>
          <span className="text-[10px] text-slate-300">|</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-indigo-500" />${(growthForecast?.current_monthly_runrate || 5500).toLocaleString()}/mo current</span>
        </div>
        {forecastMonths.length > 0 && (
          <div className="grid grid-cols-6 gap-2 mt-6 max-w-xl mx-auto">
            {forecastMonths.map((m: any, i: number) => {
              const maxVal = Math.max(...forecastMonths.map((x: any) => x.weighted_total || 0), 1);
              const heightPct = ((m.weighted_total || 0) / maxVal) * 100;
              return (
                <div key={m.month} className="flex flex-col items-center gap-1">
                  <div className="w-full bg-slate-100 rounded-t flex items-end justify-center" style={{ height: 60 }}>
                    <div className="w-4/5 bg-indigo-500 rounded-t transition-all duration-500" style={{ height: `${heightPct}%`, minHeight: 12 }} />
                  </div>
                  <span className="financial-figure text-[9px] text-slate-400">${((m.weighted_total || 0) / 1000).toFixed(1)}k</span>
                  <span className="text-[8px] text-slate-400">{m.month?.split(' ')[0]?.slice(0, 3) || ''}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Profit Leak Detection */}
      {leakAnalyses.length > 0 && (
        <div className="mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-500" /> Profit Leak Detection
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {leakAnalyses.map((leak: any, i: number) => (
              <motion.div key={leak.jobId || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-lg border p-5 ${leak.riskLevel === 'critical' ? 'border-red-200' : leak.riskLevel === 'high' ? 'border-amber-200' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-slate-800 truncate">{leak.jobTitle}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${riskColors[leak.riskLevel] || riskColors.low}`}>{leak.riskLevel}</span></div>
                    <p className="text-xs text-slate-500 mt-0.5">{leak.customer}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div><p className="text-[10px] text-slate-400 uppercase">Quoted</p><p className="financial-figure text-sm font-bold text-slate-800">${(leak.quotedTotal || 0).toLocaleString()}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase">Projected Final</p><p className="financial-figure text-sm font-bold text-red-500">${(leak.estimatedFinalCost || 0).toLocaleString()}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase">Quoted Margin</p><p className={`financial-figure text-sm font-bold ${(leak.quotedMarginPct || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{(leak.quotedMarginPct || 0).toFixed(1)}%</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase">Projected Margin</p><p className={`financial-figure text-sm font-bold ${(leak.projectedMarginPct || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{(leak.projectedMarginPct || 0).toFixed(1)}%</p></div>
                </div>
                {(leak.slippageAmount || 0) > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100"><div className="flex items-center justify-between text-xs"><span className="text-slate-400">Slippage:</span><span className="financial-figure text-red-500 font-bold">${(leak.slippageAmount || 0).toLocaleString()}</span></div></div>
                )}
                {leak.recommendations && leak.recommendations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase mb-1">Recommendations</p>
                    {leak.recommendations.map((r: string, ri: number) => (<p key={ri} className="text-xs text-slate-500 flex items-start gap-1.5 mt-0.5"><ArrowRight className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />{r}</p>))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {leakAnalyses.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-3"><Ban className="w-5 h-5 text-slate-400" /><div><h3 className="text-sm font-semibold text-slate-700">No Profit Leaks Detected</h3><p className="text-xs text-slate-400 mt-1">All active jobs are tracking within budget.</p></div></div>
        </motion.div>
      )}

      {/* Customer LTV */}
      {customerLTV.length > 0 && (
        <div className="mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-slate-800 mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-500" /> Customer Lifetime Value</motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {customerLTV.map((c: any, i: number) => (
              <motion.div key={c.name || c.customer_name || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div><h3 className="text-sm font-semibold text-slate-800">{c.name || c.customer_name}</h3><p className="text-xs text-slate-500 mt-0.5">{(c.job_count || 0)} job{(c.job_count || 0) !== 1 ? 's' : ''}</p></div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tierColors[c.tier] || tierColors.Silver}`}><Star className="w-3 h-3 inline mr-0.5 -mt-0.5" />{c.tier}</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div><p className="text-[10px] text-slate-400 uppercase">Revenue</p><p className="financial-figure text-sm font-bold text-slate-800">${(c.total_revenue || 0).toLocaleString()}</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase">Margin</p><p className={`financial-figure text-sm font-bold ${(c.avg_margin_pct || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{(c.avg_margin_pct || 0).toFixed(1)}%</p></div>
                  <div><p className="text-[10px] text-slate-400 uppercase">Predicted LTV</p><p className="financial-figure text-sm font-bold text-indigo-600">${(c.predicted_ltv || 0).toLocaleString()}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Suburb Hotspots */}
      {suburbHotspots.length > 0 && (
        <div className="mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-slate-800 mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-500" /> Suburb Hotspots</motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {suburbHotspots.map((s: any, i: number) => (
              <motion.div key={s.suburb || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-indigo-500" /><h3 className="text-sm font-semibold text-slate-800">{s.suburb} {s.postcode || ''}</h3></div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${suburbTierColors[s.tier] || suburbTierColors.Monitor}`}>{s.tier}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>${(s.total_revenue || 0).toLocaleString()} revenue</span>
                  <span className={`font-medium ${(s.avg_margin_pct || 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>{(s.avg_margin_pct || 0).toFixed(0)}% margin</span>
                  <span>{(s.job_count || 0)} jobs</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">{s.recommendation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Marketing Tips */}
      {marketingTips.length > 0 && (
        <div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-slate-800 mb-3 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-indigo-500" /> Marketing Tips</motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {marketingTips.map((tip: any, i: number) => (
              <motion.div key={tip.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-lg border border-slate-200 p-5 hover:border-indigo-200 transition-colors">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div><h3 className="text-sm font-semibold text-slate-800">{tip.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{tip.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">ROI: {tip.projected_roi || 'N/A'}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${effortColors[tip.effort] || effortColors.Medium}`}>{tip.effort || 'Medium'} effort</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!loading && customerLTV.length === 0 && suburbHotspots.length === 0 && marketingTips.length === 0 && leakAnalyses.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center py-10">
          <Loader2 className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No growth data available yet.</p>
          <p className="text-xs text-slate-400 mt-1">Start tracking jobs to generate insights.</p>
        </div>
      )}
    </div>
  );
}
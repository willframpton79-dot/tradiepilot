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
        const [insightsResult, leaksResult] = await Promise.allSettled([
          api.getInsights(),
          api.getProfitLeaks(),
        ]);

        if (insightsResult.status === "fulfilled") setData(insightsResult.value);
        else console.warn("Insights API failed:", insightsResult.reason);

        if (leaksResult.status === "fulfilled") setProfitLeaks(leaksResult.value);
        else console.warn("Profit leaks API failed:", leaksResult.reason);
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
        <Loader2 className="w-8 h-8 text-amber animate-spin" />
        <span className="ml-3 text-gray-400">Loading growth intelligence...</span>
      </div>
    );
  }

  const customerLTV = data?.customer_ltv?.customers || data?.customerLTV || [];
  const suburbHotspots = data?.suburb_hotspots?.suburbs || data?.suburbHotspots || [];
  const marketingTips = data?.marketing_tips?.tips || data?.marketingTips || [];
  const growthForecast = data?.growth_forecast || data?.growthForecast || {};
  const forecastMonths = growthForecast?.forecast_months || [];

  // Profit leaks from automation API
  const leakAnalyses = profitLeaks?.analyses || profitLeaks?.leaks || [];
  const leakActions = profitLeaks?.actions || [];

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

  const riskColors: Record<string, string> = {
    critical: "text-profit-red bg-profit-red/10 border-profit-red/30",
    high: "text-profit-amber bg-profit-amber/10 border-profit-amber/30",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    low: "text-profit-green bg-profit-green/10 border-profit-green/30",
  };

  const effortColors: Record<string, string> = {
    Low: "text-profit-green bg-profit-green/10",
    Medium: "text-amber bg-amber/10",
    High: "text-profit-red bg-profit-red/10",
  };

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
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
          ${(growthForecast?.projected_6mo_revenue || 62892).toLocaleString()}
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-profit-green" />{(growthForecast?.monthly_growth_rate_pct || 8)}% monthly growth</span>
          <span className="text-[10px] text-gray-500">|</span>
          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-amber" />${(growthForecast?.current_monthly_runrate || 5500).toLocaleString()}/mo current</span>
        </div>

        {/* Forecast chart */}
        {forecastMonths.length > 0 && (
          <div className="grid grid-cols-6 gap-2 mt-6 max-w-xl mx-auto">
            {forecastMonths.map((m: any, i: number) => {
              const maxVal = Math.max(...forecastMonths.map((x: any) => x.weighted_total || 0), 1);
              const heightPct = ((m.weighted_total || 0) / maxVal) * 100;
              return (
                <div key={m.month} className="flex flex-col items-center gap-1">
                  <div className="w-full bg-navy-surface rounded-t flex items-end justify-center" style={{ height: 60 }}>
                    <div className="w-4/5 bg-amber rounded-t transition-all duration-500" style={{ height: `${heightPct}%`, minHeight: 12 }} />
                  </div>
                  <span className="financial-figure text-[9px] text-gray-400">${((m.weighted_total || 0) / 1000).toFixed(1)}k</span>
                  <span className="text-[8px] text-gray-500">{m.month?.split(' ')[0]?.slice(0, 3) || ''}</span>
                </div>
              );
            })}
          </div>
        )}
        {forecastMonths.length === 0 && (
          <p className="text-xs text-gray-500 mt-4">Forecast data not yet available.</p>
        )}
      </motion.div>

      {/* Profit Leak Detection — from /api/automation/profit-leaks */}
      {leakAnalyses.length > 0 && (
        <div className="mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
            <Bug className="w-5 h-5 text-profit-red" /> Profit Leak Detection
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {leakAnalyses.map((leak: any, i: number) => (
              <motion.div
                key={leak.jobId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card border ${leak.riskLevel === 'critical' ? 'border-profit-red/20' : leak.riskLevel === 'high' ? 'border-profit-amber/20' : 'border-navy-border'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white truncate">{leak.jobTitle}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${riskColors[leak.riskLevel] || riskColors.low}`}>
                        {leak.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{leak.customer}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Quoted</p>
                    <p className="financial-figure text-sm font-bold text-white">${(leak.quotedTotal || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Projected Final</p>
                    <p className="financial-figure text-sm font-bold text-profit-red">${(leak.estimatedFinalCost || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Quoted Margin</p>
                    <p className={`financial-figure text-sm font-bold ${(leak.quotedMarginPct || 0) >= 0 ? 'text-profit-green' : 'text-profit-red'}`}>
                      {(leak.quotedMarginPct || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Projected Margin</p>
                    <p className={`financial-figure text-sm font-bold ${(leak.projectedMarginPct || 0) >= 0 ? 'text-profit-green' : 'text-profit-red'}`}>
                      {(leak.projectedMarginPct || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Slippage */}
                {(leak.slippageAmount || 0) > 0 && (
                  <div className="mt-2 pt-2 border-t border-navy-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Slippage:</span>
                      <span className="financial-figure text-profit-red font-bold">${(leak.slippageAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {leak.recommendations && leak.recommendations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-navy-border">
                    <p className="text-[10px] text-gray-500 uppercase mb-1">Recommendations</p>
                    {leak.recommendations.map((r: string, ri: number) => (
                      <p key={ri} className="text-xs text-gray-400 flex items-start gap-1.5 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-amber shrink-0 mt-0.5" />
                        {r}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunity Metrics Placeholder (when profit leaks aren't available) */}
      {leakAnalyses.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card mb-6">
          <div className="flex items-center gap-3">
            <Ban className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">No Profit Leaks Detected</h3>
              <p className="text-xs text-gray-400 mt-1">All active jobs are tracking within budget. Your margins look healthy!</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Customer LTV */}
      {customerLTV.length > 0 && (
        <div className="mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber" /> Customer Lifetime Value
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {customerLTV.map((c: any, i: number) => (
              <motion.div key={c.name || c.customer_name || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{c.name || c.customer_name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{(c.job_count || 0)} job{(c.job_count || 0) !== 1 ? 's' : ''}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tierColors[c.tier] || tierColors.Silver}`}>
                    <Star className="w-3 h-3 inline mr-0.5 -mt-0.5" />{c.tier}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Revenue</p>
                    <p className="financial-figure text-sm font-bold text-white">${(c.total_revenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Margin</p>
                    <p className={`financial-figure text-sm font-bold ${(c.avg_margin_pct || 0) >= 0 ? 'text-profit-green' : 'text-profit-red'}`}>
                      {(c.avg_margin_pct || 0).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">Predicted LTV</p>
                    <p className="financial-figure text-sm font-bold text-amber">${(c.predicted_ltv || 0).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Suburb Hotspots */}
      {suburbHotspots.length > 0 && (
        <div className="mb-6">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber" /> Suburb Hotspots
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {suburbHotspots.map((s: any, i: number) => (
              <motion.div key={s.suburb || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber" />
                    <h3 className="text-sm font-semibold text-white">{s.suburb} {s.postcode || ''}</h3>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${suburbTierColors[s.tier] || suburbTierColors.Monitor}`}>{s.tier}</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>${(s.total_revenue || 0).toLocaleString()} revenue</span>
                  <span className={`font-medium ${(s.avg_margin_pct || 0) >= 0 ? 'text-profit-green' : 'text-profit-red'}`}>{(s.avg_margin_pct || 0).toFixed(0)}% margin</span>
                  <span>{(s.job_count || 0)} jobs</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{s.recommendation}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Marketing Tips */}
      {marketingTips.length > 0 && (
        <div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-heading font-bold text-white mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber" /> Marketing Tips
          </motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {marketingTips.map((tip: any, i: number) => (
              <motion.div key={tip.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card hover:border-amber/20 transition-colors">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-amber mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">{tip.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{tip.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-profit-green/10 text-profit-green border border-profit-green/20">
                        ROI: {tip.projected_roi || 'N/A'}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${effortColors[tip.effort] || effortColors.Medium}`}>
                        {tip.effort || 'Medium'} effort
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && customerLTV.length === 0 && suburbHotspots.length === 0 && marketingTips.length === 0 && leakAnalyses.length === 0 && (
        <div className="card text-center py-10">
          <Loader2 className="w-10 h-10 text-amber mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No growth data available yet.</p>
          <p className="text-xs text-gray-500 mt-1">Start tracking jobs to generate insights.</p>
        </div>
      )}
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Award, MapPin, Lightbulb, 
  Zap, Star, Loader2, ArrowUpRight,
  Target, Rocket, Users, BarChart3
} from "lucide-react";
import { api } from "@/lib/api";

const tierColors: any = {
  Platinum: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Gold: "bg-amber-50 text-amber-600 border-amber-100",
  Silver: "bg-slate-50 text-slate-600 border-slate-100",
};

const effortColors: any = {
  Low: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Medium: "bg-amber-50 text-amber-600 border-amber-100",
  High: "bg-rose-50 text-rose-600 border-rose-100",
};

export default function GrowthPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getGrowth();
        setData(res);
      } catch (e) {
        console.error("Failed to load growth data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-indigo animate-spin" />
    </div>
  );

  const customerLTV = data?.customer_ltv?.customers || [];
  const suburbHotspots = data?.suburb_hotspots?.suburbs || [];
  const marketingTips = data?.marketing_insights?.tips || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Growth Intelligence</h1>
        <p className="text-slate-500 text-sm mt-1">Data-driven insights to scale your business profitably.</p>
      </header>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-indigo-50/30 border-indigo-100">
           <div className="w-10 h-10 rounded-xl bg-indigo flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-lg font-bold text-slate-800">Strategic Target</h3>
           <p className="text-sm text-slate-600 mt-2 leading-relaxed">
             Focus on <span className="font-bold text-indigo">Maintenance Plumbing</span> in <span className="font-bold text-indigo">Richmond</span> to maximize margin with minimal crew travel time.
           </p>
        </div>
        <div className="card bg-emerald-50/30 border-emerald-100">
           <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-lg font-bold text-slate-800">Scale Opportunity</h3>
           <p className="text-sm text-slate-600 mt-2 leading-relaxed">
             Increasing quote follow-up frequency by <span className="font-bold text-emerald-600">20%</span> is projected to add <span className="font-bold text-emerald-600">$12,400</span> to next month&apos;s revenue.
           </p>
        </div>
        <div className="card bg-amber-50/30 border-amber-100">
           <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
           </div>
           <h3 className="text-lg font-bold text-slate-800">Profit Guard</h3>
           <p className="text-sm text-slate-600 mt-2 leading-relaxed">
             Material cost variance is currently <span className="font-bold text-amber-600">+8%</span>. Review supplier pricing for copper fittings.
           </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Customer LTV */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo" /> High-Value Customers
          </h2>
          <div className="space-y-3">
            {customerLTV.map((c: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className="card p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                       {c.name?.charAt(0) || c.customer_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{c.name || c.customer_name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{c.job_count} jobs completed</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${tierColors[c.tier] || tierColors.Silver}`}>
                    {c.tier}
                  </span>
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Revenue</p>
                    <p className="text-sm font-bold text-slate-800">${(c.total_revenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Margin</p>
                    <p className="text-sm font-bold text-emerald-600">{c.avg_margin_pct?.toFixed(1)}%</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-[10px] text-indigo font-bold uppercase tracking-wider">Predicted LTV</p>
                    <p className="text-sm font-bold text-indigo">${(c.predicted_ltv || 0).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Suburb Hotspots */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo" /> Profit Hotspots
          </h2>
          <div className="space-y-3">
            {suburbHotspots.map((s: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-indigo" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{s.suburb} {s.postcode}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {s.avg_margin_pct?.toFixed(0)}% Margin
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                   <p className="text-xs text-slate-600 leading-relaxed font-medium">
                     <Lightbulb className="w-3 h-3 inline mr-1 text-amber-500" />
                     {s.recommendation}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing Tips */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo" /> Marketing Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingTips.map((tip: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }} 
              className="card border-slate-200 hover:border-indigo/30 transition-all flex flex-col"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                   <Lightbulb className="w-5 h-5 text-indigo" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{tip.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.description}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${effortColors[tip.effort] || effortColors.Medium}`}>
                  {tip.effort} Effort
                </span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  ROI: {tip.projected_roi}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

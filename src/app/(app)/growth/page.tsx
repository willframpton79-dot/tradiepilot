'use client';

import { 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowUpRight,
  ChevronRight,
  Lightbulb,
  Loader2,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

// Dynamic import for the chart component to avoid SSR issues
const ForecastChart = dynamic(() => import('@/components/growth/ForecastChart'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
    </div>
  )
});

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const insights = [
  {
    title: 'Focus on Bathroom Renos',
    description: 'Data shows bathroom renovations have a 42% average margin, while deck builds are currently at 24%.',
    impact: '+12% Profit',
    type: 'success'
  },
  {
    title: 'Material Cost Alert',
    description: 'Timber costs have risen 8% this month. Adjust your upcoming quotes to maintain margins.',
    impact: 'Protect Margin',
    type: 'warning'
  },
  {
    title: 'Labour Efficiency',
    description: 'Your team is finishing electrical rough-ins 15% faster than estimated. Good job!',
    impact: 'Efficiency up',
    type: 'success'
  }
];

const benchmarkData = [
  { trade: 'Builders', user: 31, industry: 28 },
  { trade: 'Plumbers', user: 34, industry: 29 },
  { trade: 'Electrical', user: 38, industry: 32 },
  { trade: 'HVAC', user: 29, industry: 27 },
];

export default function GrowthPage() {
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Growth Intelligence</h1>
          <p className="text-slate-500 mt-1 font-medium">Data-driven insights to scale your construction business.</p>
        </motion.div>

        {/* Forecasting Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Profit Forecast</h3>
                <p className="text-sm text-slate-500">Projected vs Actual performance (2026)</p>
              </div>
            </div>
            
            <div className="h-72 w-full">
              <ForecastChart />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-indigo-600 rounded-2xl p-6 lg:p-8 shadow-lg shadow-indigo-200 relative overflow-hidden">
            <Zap className="absolute -right-4 -top-4 w-24 h-24 sm:w-32 sm:h-32 text-white/10" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2">Growth Target</h3>
              <p className="text-indigo-200 text-sm mb-8">You are currently at 84% of your Q2 profit goal.</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 text-indigo-200">
                  <span>Progress</span>
                  <span>$168k / $200k</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <Link href="/settings/alert-thresholds" className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm flex items-center justify-center gap-2">
                Update Goals <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Insights Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Smart Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${
                    insight.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {insight.impact}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{insight.description}</p>
                </div>
                
                <Link href="/jobs" className="mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                  Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Industry Benchmark Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Industry Benchmark</h3>
                <p className="text-sm text-slate-500">TradiePilot Profit Index</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                Based on anonymised TradiePilot network data
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">The Headline</h4>
                <p className="text-2xl font-bold text-slate-900">
                  Your margins are <span className="text-indigo-600">2.4% above</span> the industry average for your trade.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Job Type</th>
                      <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Your Avg</th>
                      <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Industry</th>
                      <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {benchmarkData.map((item) => (
                      <tr key={item.trade} className="group">
                        <td className="py-4 text-sm font-bold text-slate-900">{item.trade}</td>
                        <td className="py-4 text-sm font-bold text-indigo-600">{item.user}%</td>
                        <td className="py-4 text-sm font-medium text-slate-500">{item.industry}%</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            +{item.user - item.industry}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm h-full">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8">Visual Comparison</h4>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={benchmarkData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="trade" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px', fontSize: '12px', fontWeight: 600 }}
                    />
                    <Bar 
                      name="Your Margin" 
                      dataKey="user" 
                      fill="#4f46e5" 
                      radius={[0, 4, 4, 0]} 
                      barSize={20}
                    />
                    <Bar 
                      name="Industry Avg" 
                      dataKey="industry" 
                      fill="#e2e8f0" 
                      radius={[0, 4, 4, 0]} 
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your efficiency in <strong>Plumbing</strong> and <strong>Electrical</strong> is significantly higher than the network average. This suggests strong crew management or superior quoting accuracy in these categories.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="sm:hidden text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
              Based on anonymised TradiePilot network data
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

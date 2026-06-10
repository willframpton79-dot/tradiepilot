'use client';

import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  ArrowUpRight,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";

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
                <p className="text-sm text-slate-500">Projected vs Actual performance</p>
              </div>
              <select className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-3 py-1.5 focus:outline-none">
                <option>Last 6 Months</option>
                <option>Year to Date</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end gap-2 sm:gap-4 overflow-hidden">
              {[45, 62, 58, 85, 74, 92].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-50 rounded-t-lg relative group h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg group-hover:bg-indigo-600 transition-colors"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-indigo-600 rounded-2xl p-6 lg:p-8 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
            <Zap className="absolute -right-4 -top-4 w-24 h-24 sm:w-32 sm:h-32 text-white/10" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Growth Target</h3>
              <p className="text-indigo-100 text-sm mb-8">You are currently at 84% of your Q2 profit goal.</p>
              
              <div className="mb-8">
                <div className="flex justify-between text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Progress</span>
                  <span className="text-[10px] sm:text-xs">$168k / $200k</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all text-sm flex items-center justify-center gap-2">
                Update Goals <ArrowUpRight className="w-4 h-4" />
              </button>
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
                
                <button className="mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                  Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'

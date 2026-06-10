'use client';

import { useSession } from "next-auth/react";
import { 
  TrendingUp, 
  DollarSign, 
  ClipboardList, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import ActiveJobs from "@/components/dashboard/ActiveJobs";
import QuoteFollowUp from "@/components/dashboard/QuoteFollowUp";
import ProfitGauge from "@/components/dashboard/ProfitGauge";
import UpgradeBanner from "@/components/dashboard/UpgradeBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, {session?.user?.name?.split(' ')[0] || 'Partner'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Here's your profit intelligence for today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-lg hover:border-indigo-300 transition-all text-sm">
              Export Report
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-sm">
              <Plus className="w-4 h-4" /> New Job
            </button>
          </div>
        </motion.div>

        {/* Upgrade Banner (Conditional) */}
        <UpgradeBanner />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeUp}>
            <StatCard 
              label="Active Jobs" 
              value="14" 
              trend="+2 this month" 
              trendType="positive"
              icon={ClipboardList}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard 
              label="Avg. Margin" 
              value="34.2%" 
              trend="+4.1%" 
              trendType="positive"
              icon={TrendingUp}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard 
              label="Pending Quotes" 
              value="$84,200" 
              trend="5 quotes" 
              icon={Clock}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard 
              label="Overdue Invoices" 
              value="$12,450" 
              trend="Action required" 
              trendType="negative"
              icon={AlertCircle}
            />
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Active Jobs */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <ActiveJobs />
          </motion.div>

          {/* Right Column: Profit Intelligence & Quotes */}
          <div className="space-y-8">
            <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Profit Gauge</h3>
              <ProfitGauge margin={0.342} />
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Target Margin</span>
                <span className="text-sm font-bold text-slate-400">30.0%</span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <QuoteFollowUp />
            </motion.div>
          </div>
        </div>

        {/* Profit Alerts Section */}
        <motion.div variants={fadeUp} className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Profit Alerts</h3>
              <p className="text-sm text-slate-500">Automated insights from your financial data</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Margin Warning</h4>
                <p className="text-xs text-slate-500 mt-1">Bondi Electrical job has dropped below 20% margin due to higher material costs.</p>
                <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Investigate <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Growth Opportunity</h4>
                <p className="text-xs text-slate-500 mt-1">Bathroom renovations show a 12% higher margin than other services this quarter.</p>
                <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View Analysis <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import ActiveJobs from "@/components/dashboard/ActiveJobs";
import QuoteFollowUp from "@/components/dashboard/QuoteFollowUp";
import ProfitGauge from "@/components/dashboard/ProfitGauge";
import UpgradeBanner from "@/components/dashboard/UpgradeBanner";
import ProfitCoach from "@/components/dashboard/ProfitCoach";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [userTier, setUserTier] = useState<string | undefined>(undefined);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [overdueAmount, setOverdueAmount] = useState<number | null>(null);
  const [activeJobCount, setActiveJobCount] = useState<number | null>(null);
  const [avgMargin, setAvgMargin] = useState<number | null>(null);
  const [pendingQuotesTotal, setPendingQuotesTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setUserTier(data.tier);
        setTrialEndsAt(data.trialEndsAt || null);
        setIsAdmin(!!data.isAdmin);
      })
      .catch(() => {});

    fetch('/api/invoices')
      .then(r => r.ok ? r.json() : [])
      .then((invoices: any[]) => {
        const total = invoices
          .filter((inv: any) => inv.status === 'overdue')
          .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
        setOverdueAmount(total);
      })
      .catch(() => setOverdueAmount(0));

    fetch('/api/jobs')
      .then(r => r.ok ? r.json() : [])
      .then((jobs: any[]) => {
        const active = jobs.filter((j: any) => j.status?.toLowerCase() !== 'completed');
        setActiveJobCount(active.length);
        if (jobs.length > 0) {
          const avg = jobs.reduce((sum: number, j: any) => sum + (j.marginPct || 0), 0) / jobs.length;
          setAvgMargin(parseFloat(avg.toFixed(1)));
        } else {
          setAvgMargin(0);
        }
      })
      .catch(() => { setActiveJobCount(0); setAvgMargin(0); });

    fetch('/api/quotes')
      .then(r => r.ok ? r.json() : [])
      .then((quotes: any[]) => {
        const pending = quotes.filter((q: any) => !['won', 'lost'].includes(q.status));
        const total = pending.reduce((sum: number, q: any) => sum + (q.amount || 0), 0);
        setPendingQuotesTotal(total);
      })
      .catch(() => setPendingQuotesTotal(0));
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Good morning, {(() => {
                const name = session?.user?.name?.split(' ')[0] || 'Partner';
                return name.charAt(0).toUpperCase() + name.slice(1);
              })()}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 font-medium">Here&apos;s your profit intelligence for today.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-lg hover:border-indigo-300 transition-all text-xs sm:text-sm">
              Export Report
            </button>
            <Link 
              href="/jobs/new"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" /> New Job
            </Link>
          </div>
        </motion.div>

        {/* Upgrade Banner (free/trial users only) */}
        <UpgradeBanner tier={userTier} trialEndsAt={trialEndsAt} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={fadeUp}>
            <Link href="/jobs" className="block">
              <StatCard
                label="Active Jobs"
                value={activeJobCount === null ? '…' : activeJobCount.toString()}
                trend={activeJobCount === null ? '' : `${activeJobCount} job${activeJobCount !== 1 ? 's' : ''}`}
                trendType="positive"
                icon={ClipboardList}
              />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link href="/growth" className="block">
              <StatCard
                label="Avg. Margin"
                value={avgMargin === null ? '…' : `${avgMargin}%`}
                trend={avgMargin === null ? '' : avgMargin >= 30 ? 'On target' : avgMargin > 0 ? 'Below target' : 'No jobs yet'}
                trendType={avgMargin !== null && avgMargin >= 30 ? 'positive' : 'negative'}
                icon={TrendingUp}
              />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link href="/quotes" className="block">
              <StatCard
                label="Pending Quotes"
                value={pendingQuotesTotal === null ? '…' : pendingQuotesTotal === 0 ? '$0' : `$${pendingQuotesTotal.toLocaleString()}`}
                trend={pendingQuotesTotal === null ? '' : pendingQuotesTotal === 0 ? 'No open quotes' : 'Awaiting response'}
                icon={Clock}
              />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link href="/invoices" className="block">
              <StatCard
                label="Overdue Invoices"
                value={overdueAmount === null ? '…' : overdueAmount === 0 ? '$0' : `$${overdueAmount.toLocaleString()}`}
                trend={overdueAmount === null || overdueAmount === 0 ? 'All clear' : 'Action required'}
                trendType={overdueAmount && overdueAmount > 0 ? 'negative' : 'positive'}
                icon={AlertCircle}
              />
            </Link>
          </motion.div>
        </div>

        {/* AI Profit Coach */}
        <motion.div variants={fadeUp}>
          <ProfitCoach tier={userTier} isAdmin={isAdmin} />
        </motion.div>

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
              <ProfitGauge margin={avgMargin !== null ? avgMargin / 100 : 0} />
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Avg. Margin</span>
                <span className="text-sm font-bold text-slate-400">{avgMargin !== null ? `${avgMargin}%` : '…'}</span>
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
                <p className="text-xs text-slate-500 mt-1">North Sydney Retail job has dropped below 0% margin due to structural variations.</p>
                <Link href="/jobs" className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Investigate <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Growth Opportunity</h4>
                <p className="text-xs text-slate-500 mt-1">Commercial office fit-outs show a 12% higher margin than other services this quarter.</p>
                <Link href="/growth" className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  View Analysis <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

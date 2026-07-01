"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, DollarSign, Clock,
  ArrowRight, CheckCircle, Play, ChevronRight,
  Quote, Target, Zap
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fadeUp, stagger } from "@/lib/animations";

// ─── Hero ───
function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#eef2ff] via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-green-50 border border-green-200/60 rounded-full px-4 py-1.5 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-700">Profit intelligence for Australian construction &amp; trades</span>
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200/70 rounded-full px-3.5 py-1 text-xs font-semibold text-indigo-700">
              🤖 Now with AI Profit Coach
            </span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Not Just a Dashboard.{" "}
            <span className="text-indigo-600">Your Entire Profit Engine.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-xl sm:text-2xl font-semibold text-slate-700 max-w-2xl mx-auto leading-snug">
            Real-time job profit &mdash; before the accountant runs the numbers.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Built for Australian trades businesses doing $500K&ndash;$3M. Connect your tools, track every dollar, and know exactly where you&apos;re making money before the quarterly review tells you it&apos;s too late.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-lg shadow-lg shadow-indigo-200/50 transition-all text-base">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#features" className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-indigo-300 text-slate-700 font-semibold px-7 py-3.5 rounded-lg transition-all text-base shadow-sm">
              <Play className="w-4 h-4 text-indigo-500" /> See How It Works
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {["No credit card required", "14-day free trial", "Cancel anytime", "Australian-owned"].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" /> {item}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Premium Dashboard Screenshot Display */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.5 }} 
          className="relative mx-auto max-w-5xl mt-16 hidden sm:block"
        >
          {/* Indigo glow behind frame */}
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-3xl -z-10 scale-95" />
          
          {/* Browser chrome */}
          <div className="rounded-xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-slate-200 bg-white"
               style={{transform: 'perspective(1200px) rotateX(2deg)'}}>
            <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"/>
              <div className="w-3 h-3 rounded-full bg-amber-400"/>
              <div className="w-3 h-3 rounded-full bg-green-400"/>
              <div className="mx-auto bg-slate-700 rounded px-4 py-1 text-slate-300 text-xs">app.tradiepilot.com.au/dashboard</div>
            </div>
            <div className="bg-slate-100">
              <img src="/images/dashboard.png" alt="TradiePilot Profit Dashboard" className="w-full block" />
            </div>
          </div>
          
          {/* AI Profit Coach floating card */}
          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="absolute bottom-16 right-4 lg:-right-6 w-64 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] border border-slate-200 border-l-4 border-l-red-400 p-4 z-10"
          >
            <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 mb-2">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              AI Profit Coach
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1 leading-snug">Labour blowout on Northside Warehouse</p>
            <p className="text-[10px] text-slate-500 leading-relaxed mb-3">Running $2,100 over quote. Review time entries before it eats into your margin.</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-600">Review time entries →</span>
              <span className="text-[9px] text-slate-300">Just now</span>
            </div>
          </motion.div>

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Strip ───
function StatsStrip() {
  const stats = [
    { val: "3,217", label: "Construction insolvencies in 2024" },
    { val: "27%", label: "Of all national corporate failures" },
    { val: "92%", label: "Involved businesses with fewer than 5 staff" },
    { val: "$4.3B", label: "In unpaid ATO obligations across the trades sector" },
  ];
  return (
    <section className="bg-slate-900 py-14 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-center text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">
          The Burning Platform
        </motion.p>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-center text-xl sm:text-2xl font-bold text-white mb-10 max-w-3xl mx-auto leading-snug">
          Australian construction is losing money in a predictable, preventable way. TradiePilot is built to fix it.
        </motion.p>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <p className="text-3xl lg:text-4xl font-bold text-indigo-400">{s.val}</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
        <p className="text-center text-xs text-slate-500 mt-8">Source: ASIC corporate insolvency data, ATO debt statistics 2024.</p>
      </div>
    </section>
  );
}

// ─── Problem Section ───
function ProblemSection() {
  const problems = [
    { 
      icon: BarChart3, 
      title: "Five jobs on. No idea which three are making money.", 
      desc: "You're turning over $1M+ but your margin visibility ends at the quote stage. By the time costs land in Xero, the job's already finished." 
    },
    { 
      icon: Clock, 
      title: "Your estimator quoted it tight. Your crew ran over. You found out at the end.", 
      desc: "Labour variance and scope creep kill margins silently. You need alerts when a job is going wrong — not a post-mortem." 
    },
    { 
      icon: Quote, 
      title: "Three quotes went out last month. You haven't followed up any of them.", 
      desc: "You're on site. Your phone's full. $180K in pending quotes is sitting there going cold while your competitor calls them back." 
    },
    { 
      icon: DollarSign, 
      title: "$57K in overdue invoices. Chasing feels awkward. So you don't.", 
      desc: "You've done the work. Written the invoice. But following up a client you want to keep feels like a risk. So it sits." 
    },
    { 
      icon: Target, 
      title: "Newtown jobs make 42%. Parramatta jobs make 11%. You're still pricing them the same.", 
      desc: "Without suburb and job-type profitability data, you're quoting on gut feel and winning the wrong work." 
    },
    { 
      icon: Zap, 
      title: "Your accountant sees last quarter. You need to see right now.", 
      desc: "Xero tells you what happened. TradiePilot tells you what's happening on every active job — before it costs you." 
    },
  ];

  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">You&apos;re turning over good revenue. But which jobs are actually making you money?</motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── AI Profit Coach mock card ───
function ProfitCoachMock() {
  return (
    <div className="p-6 space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-red-400 p-5 shadow-sm">
        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600 mb-3">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          Warning
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1.5">Labour blowout on Northside Warehouse Extension</p>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">Labour is running $2,100 over quote on this job. If the trend continues, you&apos;ll be under your 30% target margin by completion. Review time entries this week before it eats further into profit.</p>
        <button className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all">
          Review time entries <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-emerald-400 p-5 shadow-sm opacity-60">
        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 mb-3">
          <TrendingUp className="w-3 h-3" /> Opportunity
        </div>
        <p className="text-sm font-bold text-slate-900 mb-1.5">Bathroom renos tracking at 42% margin</p>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">Your last 4 bathroom renos averaged 42% — your highest-margin job type. Consider quoting more of them this quarter.</p>
        <button className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
          View growth analysis <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Ask TradiePilot mock chat ───
function AskTradiePilotMock() {
  return (
    <div className="p-5 space-y-4 bg-white rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white fill-white/50" viewBox="0 0 24 24" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        </div>
        <span className="text-sm font-bold text-slate-900">Ask TradiePilot</span>
        <span className="ml-auto text-[10px] text-slate-400">3 / 20 messages today</span>
      </div>
      {/* User message */}
      <div className="flex justify-end">
        <div className="bg-indigo-600 text-white text-xs leading-relaxed px-3 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
          What&apos;s the job that&apos;s gonna make me the most profit?
        </div>
      </div>
      {/* AI response */}
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-indigo-600 fill-indigo-200" viewBox="0 0 24 24" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        </div>
        <div className="bg-slate-50 border border-slate-100 text-slate-700 text-xs leading-relaxed px-3 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%]">
          Based on your current active jobs, <strong>Northside Warehouse Extension</strong> is tracking at 38% margin — your strongest job right now. Worth keeping an eye on your Parramatta job too, it&apos;s close to target but labour costs are creeping up.
        </div>
      </div>
      {/* Follow-up user message */}
      <div className="flex justify-end">
        <div className="bg-indigo-600 text-white text-xs leading-relaxed px-3 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
          Any invoices I should chase this week?
        </div>
      </div>
      {/* Typing indicator */}
      <div className="flex gap-2.5">
        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-indigo-600 fill-indigo-200" viewBox="0 0 24 24" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2.5">
          <div className="flex items-center gap-1 py-0.5">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Features Section ───
function FeaturesSection() {
  const [active, setActive] = useState(0);
  const tabs = ["Profit dashboard", "Quote follow-up", "Invoice chaser", "Growth intelligence", "AI Profit Coach", "Ask TradiePilot"];

  interface TabContent {
    heading?: string;
    items: string[];
    visual?: ReactNode;
  }

  const tabContent: TabContent[] = [
    {
      items: [
        "Real-time margin tracking on every active job — see problems before they cost you",
        "Custom profit alerts when a job slips below your target margin",
        "One-click drill-down into job costing, time logs, and receipts",
      ],
    },
    {
      items: [
        "Automatic detection of quotes that need follow-up — never let one go cold",
        "Smart prioritisation: urgent, high-value leads surface first",
        "One-click send with pre-written, customisable follow-up messages",
      ],
    },
    {
      items: [
        "Overdue invoices ranked by severity — know who to chase first",
        "Automated reminder sequences via email and SMS",
        "Escalation triggers for invoices past 30 days",
      ],
    },
    {
      items: [
        "Customer lifetime value tiers — know your best clients",
        "Suburb hotspot mapping — find where your next job should be",
        "Personalised marketing recommendations based on your actual data",
      ],
    },
    {
      heading: "AI that reads your numbers so you don't have to",
      items: [
        "Proactive alerts when a job's margin is slipping — before it's too late to raise a variation",
        "Flags quotes that have gone quiet and suggests when to follow up",
        "Refreshes daily, based on your real job data — not generic advice",
      ],
      visual: <ProfitCoachMock />,
    },
    {
      heading: "Ask your business a question. Get a real answer.",
      items: [
        "Answers based on your real business data, not a generic chatbot",
        "Ask anything — margins, cash flow, what to prioritise today",
        "Available on every page, one click away",
      ],
      visual: <AskTradiePilotMock />,
    },
  ];

  const current = tabContent[active];

  const imageMap: Record<number, string> = {
    0: "/images/feature-dashboard.png",
    1: "/images/feature-quotes.png",
    2: "/images/feature-invoices.png",
    3: "/images/feature-growth.png",
  };

  return (
    <section id="features" className="bg-white py-16 lg:py-24" style={{ scrollBehavior: 'smooth' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need to run a profitable construction business</motion.h2>
        </motion.div>
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActive(i)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === i
                  ? i >= 4 ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/30" : "bg-indigo-600 text-white shadow-md"
                  : i >= 4 ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              {i >= 4 && <span className="mr-1.5">✦</span>}{t}
            </button>
          ))}
        </div>
        {/* Two column content */}
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-5">
            {current.heading && (
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 leading-snug">{current.heading}</h3>
            )}
            {active === 4 && (
              <p className="text-base text-slate-500 leading-relaxed">
                Every day, TradiePilot&apos;s AI checks your active jobs against their quoted margin, flags quotes going cold, and spots invoices worth chasing — then tells you exactly what to do about it in plain English. Not a dashboard you have to interpret. An answer.
              </p>
            )}
            {active === 5 && (
              <p className="text-base text-slate-500 leading-relaxed">
                Which job&apos;s making me the most money? What should I chase this week? Do I have any invoices at risk? Ask TradiePilot answers using your actual jobs, quotes, and invoices — not generic advice. It&apos;s your own numbers, explained in plain English, any time you want them.
              </p>
            )}
            {current.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-base text-slate-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          {/* Visual: custom node or image */}
          <div className={`relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 ${current.visual ? "bg-slate-50" : "bg-slate-100"}`}>
            {current.visual ?? (
              <img
                src={imageMap[active]}
                alt={tabs[active]}
                className="w-full block"
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Integrations Row ───
function IntegrationsRow() {
  const tools = ["Xero", "MYOB", "Tradify", "Jobber", "Fergus", "ServiceM8"];
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6">Designed to complement your existing workflow tools</p>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-wrap justify-center gap-3">
          {tools.map((t, i) => (
            <motion.span key={t} variants={fadeUp} custom={i}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
              <CheckCircle className="w-4 h-4 text-green-500" /> {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Industries Grid ───
function IndustriesGrid() {
  const items = [
    { emoji: "🔨", title: "Builders", desc: "Track project margins across multiple sites and crews.", emojiLabel: "hammer" },
    { emoji: "🔧", title: "Plumbers", desc: "Know which call-outs are profitable and which aren't.", emojiLabel: "wrench" },
    { emoji: "⚡", title: "Electricians", desc: "Stop losing money on fixed-price switchboard upgrades.", emojiLabel: "zap" },
    { emoji: "❄️", title: "HVAC & Mechanical", desc: "Optimise maintenance contract profitability year-round.", emojiLabel: "snowflake" },
    { emoji: "🏗️", title: "Fit-Out Contractors", desc: "Stay on top of multi-trade margins on commercial fit-outs.", emojiLabel: "building" },
    { emoji: "🌿", title: "Landscaping", desc: "Know your profit per project before the last load of mulch lands.", emojiLabel: "leaf" },
  ];
  return (
    <section id="industries" className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12">
          Built for construction and trades businesses
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <span className="text-3xl block mb-3">{item.emoji}</span>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{item.desc}</p>
              <a href="/signup" className="mt-3 theme-smooth-scroll inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 group-hover:gap-1.5 transition-all">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Objections ───
const objections = [
  {
    q: '"I already use Simpro / Tradify — doesn\'t that do this?"',
    a: "Simpro manages your jobs and schedule. It doesn't give you a live profit number per job that links back to a warranty service call two years later. Ask Simpro what your current job's real net margin is today — it won't tell you without a manual export and an accountant.",
  },
  {
    q: '"My bookkeeper does this for me monthly."',
    a: "Your bookkeeper tells you what happened. By that point the job is finished and the money is gone. TradiePilot tells you what is happening — while there's still a conversation to have with the client about the variation, or a call-back cost to dispute.",
  },
  {
    q: '"$149 a month is a lot for software we might not use."',
    a: "One undocumented variation claim or warranty callback typically costs $3,000–$12,000. One captured and documented cost allocation in your first month pays for more than a full year at the Pro rate. Compare it to 10 hours of bookkeeper reconciliation time — not to Tradify.",
  },
  {
    q: '"My admin doesn\'t have time to learn new software."',
    a: "TradiePilot is designed for the admin — not an add-on for the owner on the tools. Setup takes one session. The daily workflow is: costs get logged as they happen, the dashboard updates automatically. Your admin saves time, not spends it.",
  },
  {
    q: '"We\'ve tried software before and it never got used."',
    a: "The adoption champion is your office manager — not you on the tools. TradiePilot is designed for the person already handling invoice reconciliation and cost matching. It makes their existing job faster and more powerful. The owner sees the output; the admin drives the input.",
  },
  {
    q: '"Is this just another chatbot that makes things up?"',
    a: "No. Ask TradiePilot and the AI Profit Coach only work from your actual business data — your jobs, your quotes, your invoices, your costs. If your margin on the Northside job is 38%, it says 38%. It doesn't hallucinate a number. There's no generic advice, no recycled content. It reads your numbers, explains them in plain English, and tells you what to do about it. If there's no data, it says so.",
  },
];

function ObjectionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">The questions we get asked</motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-slate-500">Honest answers to the objections we hear from trades businesses every week.</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-3">
          {objections.map((item, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
              >
                <span className="text-sm sm:text-base font-semibold text-slate-800">{item.q}</span>
                <span className={`shrink-0 text-indigo-600 transition-transform duration-200 ${openIndex === i ? "rotate-45" : ""}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pricing ───
const plans = [
  {
    id: "solo",
    name: "Solo",
    price: 49,
    desc: "For sole operators and 1–2 staff running up to 5 active jobs.",
    features: ["Up to 5 active jobs", "Real-time job profitability", "Quote follow-up alerts", "Invoice chasing", "Basic Xero sync", "Email support"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    desc: "For small crews of 2–10 staff who need the full toolkit.",
    features: ["Unlimited active jobs", "Full Xero sync", "AI Profit Coach — daily insights on every job", "Ask TradiePilot — chat with your business data", "Weekly AI profit report every Monday", "Priority support"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 497,
    desc: "For established operators with multiple crews and custom workflows.",
    features: ["Everything in Pro", "Multi-crew job costing", "Custom workflow configuration", "Dedicated onboarding", "Phone support"],
    popular: false,
  },
];

function PricingSection() {
  const { data: session } = useSession();

  const handleCheckout = async (planId: string) => {
    if (planId === "enterprise") {
      window.location.href = "/contact-sales";
      return;
    }
    if (!session) {
      window.location.href = `/signup?plan=${planId}`;
      return;
    }
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <section id="pricing" className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">Simple, Transparent Pricing</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-500">No hidden fees. No surprise charges. Cancel anytime.</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className={`relative rounded-xl border p-6 lg:p-8 bg-white transition-all hover:shadow-lg ${plan.popular ? "border-indigo-300 ring-2 ring-indigo-500/20" : "border-slate-200"}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</div>}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-bold text-slate-900">${plan.price}</span><span className="text-sm text-slate-400">/month</span></div>
              <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
              <ul className="mt-5 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {plan.id === "enterprise" ? (
                <Link
                  href="/contact-sales"
                  className="w-full mt-6 block text-center font-semibold px-5 py-3 rounded-lg transition-all text-sm bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Contact Sales
                </Link>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.id)}
                  className={`w-full mt-6 block text-center font-semibold px-5 py-3 rounded-lg transition-all text-sm ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                >
                  Start Free Trial
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── QS Section ───
function QSSection() {
  return (
    <section className="bg-[#1e293b] py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div variants={stagger}>
            <motion.p variants={fadeUp} className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">For quantity surveyors</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Recommended by the professionals who live and breathe construction margins
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-slate-300 leading-relaxed">
              Quantity surveyors rely on TradiePilot to give their clients real-time visibility into project profitability. When the numbers matter most, this is what they trust.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6">
              <a href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 lg:p-8">
            <Quote className="w-8 h-8 text-indigo-400 mb-4" />
            <p className="text-lg text-slate-200 leading-relaxed font-medium">
              &ldquo;TradiePilot gives me and my clients a live view of project profitability that we simply couldn&apos;t get before. It&apos;s become an essential part of how we track construction margins.&rdquo;
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white">CM</div>
              <div>
                <p className="text-sm font-semibold text-white">Chris M.</p>
                <p className="text-xs text-slate-400">Quantity Surveyor, North Sydney</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA Section ───
function CTASection() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white">Ready to know your numbers?</motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-indigo-100">Built for Australian construction and trades businesses doing $500K&ndash;$3M in revenue.</motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <a href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-lg shadow-lg hover:bg-indigo-50 transition-all text-base">
              Start free trial today <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-sm text-indigo-200">No credit card required &middot; Free for 14 days &middot; Cancel anytime</motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Main Page ───
export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-slate-900 scroll-smooth">
      <Navbar />
      <Hero />
      <StatsStrip />
      <ProblemSection />
      <FeaturesSection />
      <IntegrationsRow />
      <IndustriesGrid />
      <ObjectionsSection />
      <PricingSection />
      <QSSection />
      <CTASection />
      <Footer />
    </div>
  );
}

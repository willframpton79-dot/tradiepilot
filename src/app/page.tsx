"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu, X, BarChart3, TrendingUp, DollarSign, Clock,
  ArrowRight, Star, CheckCircle, ChevronRight, Play,
  Shield, Users, Target, Zap, Wrench, Building2,
  Thermometer, HardDrive, Quote, Layers
} from "lucide-react";

// ─── Reusable ───
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } }),
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

// ─── Navbar ───
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Tradie<span className="text-indigo-600">Pilot</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Industries", "Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">{l}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-4 py-2">Log in</a>
            <a href="/signup" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all shadow-sm">Get Started</a>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-600">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden bg-white border-t border-slate-200 overflow-hidden">
          <div className="px-4 py-4 space-y-3">
            {["Features","Industries","Pricing"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600 py-2">{l}</a>
            ))}
            <hr className="border-slate-200" />
            <a href="/login" className="block text-sm font-semibold text-slate-700 py-2">Log in</a>
            <a href="/signup" className="block text-center text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-lg">Get Started</a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

// ─── Hero ───
function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#eef2ff] via-white to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-green-50 border border-green-200/60 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-700">Profit intelligence for Australian construction &amp; trades</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
            Not Just a Dashboard.{" "}
            <span className="text-indigo-600">Your Entire Profit Engine.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Purpose-built for construction and trades businesses doing $500K&ndash;$3M — connect your tools, track every dollar, and know exactly where you&apos;re making money.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-lg shadow-lg shadow-indigo-200/50 transition-all text-base">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#demo" className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-indigo-300 text-slate-700 font-semibold px-7 py-3.5 rounded-lg transition-all text-base shadow-sm">
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

        {/* Dashboard Mockup with Sidebar */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 lg:mt-18 max-w-6xl mx-auto">
          <div className="bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700/50">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-amber-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
              <div className="flex-1 flex justify-center"><div className="bg-slate-700/50 rounded-md px-3 py-1 text-xs text-slate-400">app.tradiepilot.com.au/dashboard</div></div>
            </div>
            <div className="flex">
              {/* Left Sidebar */}
              <div className="w-[200px] bg-white border-r border-slate-200 shrink-0 hidden sm:block">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
                    <span className="text-sm font-bold text-slate-800">TradiePilot</span>
                  </div>
                </div>
                <nav className="p-3 space-y-1">
                  {[
                    { label: "Dashboard", active: true },
                    { label: "Quotes" },
                    { label: "Growth" },
                    { label: "Invoice Chaser" },
                    { label: "Active Jobs" },
                  ].map(n => (
                    <div key={n.label} className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${n.active ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                      {n.label}
                    </div>
                  ))}
                </nav>
              </div>
              {/* Right Content */}
              <div className="flex-1 bg-slate-50 p-4 lg:p-5 space-y-4 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Profit Dashboard &mdash; June 2026</h3>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live</span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Active Jobs", value: "14", color: "text-indigo-600" },
                    { label: "Avg Margin", value: "34%", color: "text-green-600" },
                    { label: "Quotes Pending", value: "$84K", color: "text-indigo-600" },
                    { label: "Overdue Invoices", value: "$12K", color: "text-red-500" },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-lg p-3 border border-slate-200">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color} mt-0.5`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Woollahra Bathroom Reno", margin: 42, status: "Healthy", color: "text-green-600", border: "border-green-500" },
                    { name: "Bondi Electrical Upgrade", margin: 18, status: "Warning", color: "text-amber-600", border: "border-amber-500" },
                    { name: "CBD Office Fit-Out", margin: 38, status: "Healthy", color: "text-green-600", border: "border-green-500" },
                  ].map((job, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-slate-100 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${job.border}`}
                        style={{ color: job.margin >= 30 ? "#16a34a" : job.margin >= 15 ? "#d97706" : "#dc2626" }}>
                        {job.margin}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{job.name}</p>
                        <p className="text-xs text-slate-400">Profit margin tracking</p>
                      </div>
                      <span className={`text-xs font-medium ${job.color}`}>{job.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats Strip ───
function StatsStrip() {
  return (
    <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { val: "$340K", label: "Average revenue recovered per year", icon: TrendingUp },
            { val: "23%", label: "Average margin improvement", icon: TrendingUp },
            { val: "4.2×", label: "Return on subscription investment", icon: TrendingUp },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}>
              <p className="text-4xl lg:text-5xl font-bold text-indigo-600">{s.val}</p>
              <p className="text-sm text-slate-500 mt-1.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Problem Section ───
function ProblemSection() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">You&apos;re busy. But are you actually profitable?</motion.h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "You're busy but flying blind", desc: "Long hours, lots of jobs, but no clear picture of which ones are actually making you money." },
            { icon: Clock, title: "Quotes go cold while you're on site", desc: "You send a quote, get pulled onto the next job, and by the time you follow up they've gone elsewhere." },
            { icon: DollarSign, title: "You finish a job and still don't know", desc: "Materials, labour, subcontractors — by the time you tally it up, the margin has already slipped." },
          ].map((p, i) => (
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

// ─── Features Section ───
function FeaturesSection() {
  const [active, setActive] = useState(0);
  const tabs = ["Profit dashboard", "Quote follow-up", "Invoice chaser", "Growth intelligence"];
  const tabContent = [
    {
      items: [
        "Real-time margin tracking on every active job — see problems before they cost you",
        "Custom profit alerts when a job slips below your target margin",
        "One-click drill-down into job costing, time logs, and receipts",
      ],
      mockRows: [
        { name: "Woollahra Bathroom Reno", margin: "$3,244", pct: 46 },
        { name: "Bondi Electrical Upgrade", margin: "$412", pct: 18 },
        { name: "CBD Office Fit-Out", margin: "$8,930", pct: 38 },
        { name: "Surry Hills Hot Water", margin: "-$258", pct: -13 },
      ],
    },
    {
      items: [
        "Automatic detection of quotes that need follow-up — never let one go cold",
        "Smart prioritisation: urgent, high-value leads surface first",
        "One-click send with pre-written, customisable follow-up messages",
      ],
      mockRows: [
        { name: "Wilson Family — Paint", margin: "$15,800", pct: null },
        { name: "Greenwood Cafe — Fitout", margin: "$42,000", pct: null },
        { name: "Parkinson — HWS", margin: "$3,800", pct: null },
      ],
    },
    {
      items: [
        "Overdue invoices ranked by severity — know who to chase first",
        "Automated reminder sequences via email and SMS",
        "Escalation triggers for invoices past 30 days",
      ],
      mockRows: [
        { name: "Kitchen Reno — Smith", margin: "$28,700", pct: null },
        { name: "Bathroom Demo — Jones", margin: "$15,900", pct: null },
        { name: "Roof Repair — Williams", margin: "$10,200", pct: null },
      ],
    },
    {
      items: [
        "Customer lifetime value tiers — know your best clients",
        "Suburb hotspot mapping — find where your next job should be",
        "Personalised marketing recommendations based on your actual data",
      ],
      mockRows: [
        { name: "Emma & James Patterson", margin: "$7,029", pct: null },
        { name: "Newtown Strata Corp", margin: "$4,850", pct: null },
        { name: "Bella Vista Cafe", margin: "$8,900", pct: null },
      ],
    },
  ];
  const current = tabContent[active];

  return (
    <section id="features" className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-10">
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">Everything you need to run a profitable construction business</motion.h2>
        </motion.div>
        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActive(i)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${active === i ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
              {t}
            </button>
          ))}
        </div>
        {/* Two column content */}
        <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-5">
            {current.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-base text-slate-600 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          {/* Mock screen */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
              <div className="flex gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-400" /><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /><div className="w-2.5 h-2.5 rounded-full bg-green-400" /></div>
              <span className="text-[10px] text-slate-400 font-mono">{tabs[active]}</span>
            </div>
            <div className="space-y-2">
              {current.mockRows.map((row, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50">
                  {row.pct !== null && (
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 ${row.pct >= 30 ? 'border-green-500 text-green-600' : row.pct >= 0 ? 'border-amber-500 text-amber-600' : 'border-red-500 text-red-600'}`}>
                      {Math.abs(row.pct)}%
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{row.name}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{row.margin}</span>
                </div>
              ))}
            </div>
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
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6">Works alongside the tools you already use</p>
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
    { emoji: "❄️", title: "HVAC", desc: "Optimise maintenance contract profitability year-round.", emojiLabel: "snowflake" },
  ];
  return (
    <section id="industries" className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-12">
          Built for construction and trades businesses
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg transition-all group">
              <span className="text-3xl block mb-3">{item.emoji}</span>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{item.desc}</p>
              <a href="#" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 group-hover:gap-1.5 transition-all">
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pricing ───
const plans = [
  { name: "Starter", price: 97, desc: "For construction businesses getting started with profit tracking.", features: ["Up to 10 active jobs", "Profit dashboard", "Quote follow-up alerts", "Invoice chasing", "Email support"], popular: false },
  { name: "Pro", price: 197, desc: "For growing teams that need the full toolkit.", features: ["Unlimited active jobs", "Everything in Starter", "Growth intelligence", "Xero & MYOB sync", "Priority support"], popular: true },
  { name: "Enterprise", price: 497, desc: "For larger operations with advanced needs.", features: ["Everything in Pro", "Multi-crew management", "Custom integrations", "Dedicated account manager", "API access"], popular: false },
];

function PricingSection() {
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
              <a href="/signup" className={`mt-6 block text-center font-semibold px-5 py-3 rounded-lg transition-all text-sm ${plan.popular ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
              </a>
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
          <motion.p variants={fadeUp} className="mt-4 text-lg text-indigo-100">Join hundreds of Australian construction business owners who already track their profit with TradiePilot.</motion.p>
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

// ─── Footer ───
function Footer() {
  return (
    <footer className="bg-slate-900 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><BarChart3 className="w-4 h-4 text-white" /></div>
            <span className="text-lg font-bold text-white">Tradie<span className="text-indigo-400">Pilot</span></span>
          </a>
          <p className="text-xs text-slate-500 order-3 md:order-2">&copy; {new Date().getFullYear()} TradiePilot. All rights reserved. ABN 12 345 678 901.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400 order-2 md:order-3">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───
export default function LandingPage() {
  return (
    <div className="bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <StatsStrip />
      <ProblemSection />
      <FeaturesSection />
      <IntegrationsRow />
      <IndustriesGrid />
      <PricingSection />
      <QSSection />
      <CTASection />
      <Footer />
    </div>
  );
}
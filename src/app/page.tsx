"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, BarChart3, TrendingUp, DollarSign, Clock, CheckCircle,
  ArrowRight, Star, ChevronDown, Quote, Layers, Zap, Shield,
  Wrench, Building2, ZapIcon, Thermometer, HardDrive,
  ChevronRight, Users, Briefcase, Play, Send
} from "lucide-react";

// ─── Reusable animation variants ───
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Navbar ───
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "Industries", href: "#industries" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Tradie<span className="text-indigo-600">Pilot</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-indigo-200/50"
            >
              Get Started
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-600 hover:text-indigo-600"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-medium text-slate-600 hover:text-indigo-600 py-2"
                >
                  {l.label}
                </a>
              ))}
              <hr className="border-slate-200" />
              <a
                href="/login"
                className="block text-sm font-semibold text-slate-700 py-2"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="block text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero ───
function Hero() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0ZjQ2ZTUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-emerald-700">
              Profit intelligence for Australian construction &amp; trades
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight"
          >
            Not Just a Dashboard.{" "}
            <span className="text-indigo-600">Your Entire Profit Engine.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            Stop guessing which jobs are leaking profit. TradiePilot connects your Xero,
            tracks every dollar, and surfaces exactly where to follow up — so you keep
            more of what you earn.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-7 py-3.5 rounded-lg shadow-lg shadow-indigo-200/50 transition-all text-base"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-indigo-300 text-slate-700 font-semibold px-7 py-3.5 rounded-lg transition-all text-base shadow-sm"
            >
              <Play className="w-4 h-4 text-indigo-500" /> See How It Works
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-1.5"
          >
            <Shield className="w-4 h-4 text-emerald-500" /> No credit card required
            <span className="mx-2">·</span> Free for 14 days
            <span className="mx-2">·</span> Cancel anytime
          </motion.p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 lg:mt-18 max-w-5xl mx-auto"
        >
          <div className="bg-slate-800/90 rounded-xl shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-sm">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-slate-700/50 rounded-md px-3 py-1 text-xs text-slate-400 max-w-[200px] truncate">
                  app.tradiepilot.com.au/dashboard
                </div>
              </div>
            </div>

            {/* Mock dashboard UI */}
            <div className="p-5 lg:p-6 space-y-4">
              {/* Stat cards row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Avg Job Margin", value: "34.2%", change: "+2.1%", up: true },
                  { label: "Quote Win Rate", value: "68.5%", change: "+5.3%", up: true },
                  { label: "Days Outstanding", value: "24 days", change: "-3 days", up: true },
                  { label: "Revenue (MTD)", value: "$84.2K", change: "+12.8%", up: true },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 border border-slate-200"
                  >
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {s.label}
                    </p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{s.value}</p>
                    <p className={`text-[11px] font-medium mt-0.5 ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                      {s.change} vs last month
                    </p>
                  </div>
                ))}
              </div>

              {/* Job rows */}
              <div className="space-y-2">
                {[
                  { name: "CCTV Drain Inspection", client: "Strata Corp", profit: "$4,238", margin: 87, status: "on-track" },
                  { name: "HWS Replacement — Torres", client: "Michael Torres", profit: "-$258", margin: -13, status: "critical" },
                  { name: "Bathroom Renovation", client: "Patterson", profit: "$3,244", margin: 46, status: "on-track" },
                ].map((job, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 border border-slate-100 flex items-center gap-3"
                  >
                    {/* Mini gauge */}
                    <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        borderColor: job.margin >= 30 ? "#10B981" : job.margin >= 0 ? "#F59E0B" : "#EF4444",
                        color: job.margin >= 30 ? "#10B981" : job.margin >= 0 ? "#F59E0B" : "#EF4444",
                      }}
                    >
                      {Math.abs(job.margin)}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{job.name}</p>
                      <p className="text-xs text-slate-400">{job.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{job.profit}</p>
                      <span className={`text-[10px] font-medium ${
                        job.status === "on-track" ? "text-emerald-600" : "text-red-500"
                      }`}>
                        {job.status === "on-track" ? "On Track" : "Critical"}
                      </span>
                    </div>
                  </div>
                ))}
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
  const stats = [
    { value: "$12.4K", label: "Average recovered per month", icon: TrendingUp },
    { value: "82%", label: "Improvement in cash flow visibility", icon: TrendingUp },
    { value: "14:1", label: "Average ROI for Pro subscribers", icon: TrendingUp },
  ];
  return (
    <section className="bg-white border-y border-slate-200 py-10 lg:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i}>
              <s.icon className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
              <p className="text-3xl lg:text-4xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Problem Section ───
function ProblemSection() {
  const problems = [
    {
      icon: DollarSign,
      title: "Can't see which jobs are profitable",
      desc: "You're working hard but don't know which jobs actually make money until it's too late.",
    },
    {
      icon: Clock,
      title: "Quotes go cold without follow-up",
      desc: "You send a quote, get busy, and forget to follow up. Weeks later, the customer went elsewhere.",
    },
    {
      icon: TrendingUp,
      title: "Invoices pile up unpaid",
      desc: "Chasing payment is awkward and time-consuming. Overdue invoices drain your cash flow silently.",
    },
  ];
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">
            The Real Cost of Flying Blind
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Most tradies lose 10–20% of their profit to things they never see coming.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-md transition-all"
            >
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

// ─── Features (Tab Switcher) ───
const featureTabs = [
  {
    id: "dashboard",
    label: "Profit Dashboard",
    icon: BarChart3,
    title: "See your real-time profit snapshot",
    desc: "Know exactly where every job stands. Active jobs, margins, alerts — all on one screen that updates in real time.",
    items: ["Live job margin tracking", "Profit alerts when jobs go over budget", "One-click drill-down to job details"],
  },
  {
    id: "quotes",
    label: "Quote Follow-up",
    icon: Send,
    title: "Never lose a quote again",
    desc: "TradiePilot automatically surfaces quotes that need attention and drafts personalised follow-up messages.",
    items: ["Auto-detect stale quotes", "Smart follow-up scheduling", "Pre-written message templates"],
  },
  {
    id: "invoices",
    label: "Invoice Chaser",
    icon: DollarSign,
    title: "Get paid faster, automatically",
    desc: "Prioritise overdue invoices by severity and send automated reminders — no more awkward phone calls.",
    items: ["Severity-based invoice triage", "Automated SMS & email reminders", "Debt collection escalation triggers"],
  },
  {
    id: "growth",
    label: "Growth Intelligence",
    icon: TrendingUp,
    title: "Find your next best customer",
    desc: "Surface your highest-value customers, hottest suburbs, and actionable marketing tips — powered by your own data.",
    items: ["Customer lifetime value tiers", "Suburb hotspot mapping", "Personalised marketing recommendations"],
  },
];

function FeaturesSection() {
  const [active, setActive] = useState(featureTabs[0].id);
  const current = featureTabs.find((f) => f.id === active)!;
  const Icon = current.icon;

  return (
    <section id="features" className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-10"
        >
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">
            Everything you need to run a profitable trade business
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Four tools that work together to protect your margin and grow your revenue.
          </motion.p>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {featureTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="bg-slate-50 rounded-xl border border-slate-200 p-8 lg:p-10"
          >
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{current.title}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{current.desc}</p>
                <ul className="mt-4 space-y-2">
                  {current.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Integrations ───
function IntegrationsSection() {
  const tools = ["Xero", "MYOB", "QuickBooks", "SimPRO", "JobAdder", "Google Calendar", "Stripe", "Bank Feeds"];
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6"
        >
          Integrates with your existing tools
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-wrap justify-center gap-3"
        >
          {tools.map((t, i) => (
            <motion.span
              key={t}
              variants={fadeUp}
              custom={i}
              className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Industries ───
function IndustriesSection() {
  const industries = [
    { name: "Builders", icon: Building2, desc: "Track project margins across multiple sites." },
    { name: "Plumbers", icon: Wrench, desc: "Know which call-outs are actually profitable." },
    { name: "Electricians", icon: ZapIcon, desc: "Stop losing money on fixed-price switchboard upgrades." },
    { name: "HVAC", icon: Thermometer, desc: "Optimise maintenance contract profitability." },
  ];
  return (
    <section id="industries" className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">
            Built for Australian Trades
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Whether you&apos;re a sole trader or a crew of 20, TradiePilot adapts to how you work.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {industries.map((ind, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-md transition-all cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                <ind.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{ind.name}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{ind.desc}</p>
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
    name: "Starter",
    price: 97,
    desc: "For sole operators getting started with profit tracking.",
    features: ["Up to 10 active jobs", "Profit dashboard", "Quote follow-up alerts", "Invoice chasing", "Email support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Pro",
    price: 197,
    desc: "For growing teams that need the full toolkit.",
    features: ["Unlimited active jobs", "Everything in Starter", "Growth intelligence", "Xero & MYOB sync", "Priority support"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 497,
    desc: "For larger operations with advanced needs.",
    features: ["Everything in Pro", "Multi-crew management", "Custom integrations", "Dedicated account manager", "API access"],
    cta: "Contact Sales",
    popular: false,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="bg-slate-50 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-slate-900">
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            No hidden fees. No surprise charges. Cancel anytime.
          </motion.p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className={`relative rounded-xl border p-6 lg:p-8 bg-white transition-all hover:shadow-lg ${
                plan.popular
                  ? "border-indigo-300 ring-2 ring-indigo-500/20 shadow-indigo-100"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-sm text-slate-400">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>
              <ul className="mt-5 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/signup"
                className={`mt-6 block text-center font-semibold px-5 py-3 rounded-lg transition-all text-sm ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Testimonial / QS Section ───
function TestimonialSection() {
  return (
    <section className="bg-slate-800 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <Quote className="w-10 h-10 text-indigo-400" />
          </motion.div>
          <motion.blockquote variants={fadeUp} className="text-xl lg:text-2xl text-slate-200 leading-relaxed font-medium">
            &ldquo;TradiePilot showed me I was losing money on every fixed-price
            electrical upgrade. Within a month I changed my quoting and
            recovered $4,200 in margin.&rdquo;
          </motion.blockquote>
          <motion.div variants={fadeUp} className="mt-6">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-sm font-semibold text-white">Chris M.</p>
            <p className="text-xs text-slate-400 mt-0.5">Director, M&eacute;rida Electrical Solutions, Sydney</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Final CTA ───
function CTASection() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-white">
            Ready to know your numbers?
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-indigo-100 max-w-xl mx-auto">
            Join hundreds of Australian tradies who already track their profit with TradiePilot.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-lg shadow-lg hover:bg-indigo-50 transition-all text-base"
            >
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold px-5 py-3.5 transition-all text-base"
            >
              <Play className="w-4 h-4" /> Watch Demo
            </a>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-sm text-indigo-200">
            No credit card required · Free for 14 days · Cancel anytime
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  const sections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Industries", "Integrations", "Changelog"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press", "Contact"],
    },
    {
      title: "Support",
      links: ["Help Center", "Documentation", "API Status", "Community"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    },
  ];
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Tradie<span className="text-indigo-400">Pilot</span>
              </span>
            </a>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed max-w-xs">
              Profit intelligence for Australian trade businesses. Know your numbers. Keep your profit.
            </p>
          </div>

          {/* Link columns */}
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {s.title}
              </h4>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} TradiePilot. All rights reserved. ABN 12 345 678 901.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span>Made on Gadigal land</span>
            <span>·</span>
            <span>悉尼 · Melbourne · Brisbane</span>
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
      <IntegrationsSection />
      <IndustriesSection />
      <PricingSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
}

"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white font-body selection:bg-tradie-orange/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-navy/80 backdrop-blur-md border-b border-navy-border h-16 flex items-center px-6 lg:px-12 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-tradie-orange flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">
            Tradie<span className="text-tradie-orange">Pilot</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#problem" className="hover:text-tradie-orange transition-colors">The Problem</a>
          <a href="#solution" className="hover:text-tradie-orange transition-colors">The Solution</a>
          <a href="#pricing" className="hover:text-tradie-orange transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-tradie-orange transition-colors">Login</Link>
          <Link href="/signup" className="bg-tradie-orange hover:bg-tradie-orange/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-tradie-orange/20">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tradie-orange rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tradie-navy rounded-full blur-[128px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6">
              Your quotes. Followed up.<br />
              <span className="text-tradie-orange">Automatically.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              TradiePilot is profit intelligence for Australian trades businesses doing $500K-$3M. 
              Know your numbers, follow up your quotes, and find out exactly where your margin is going.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto bg-tradie-orange hover:bg-tradie-orange/90 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-tradie-orange/30 flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#problem" className="w-full sm:w-auto bg-navy-elevated hover:bg-navy-border text-white px-8 py-4 rounded-xl text-lg font-bold transition-all border border-navy-border flex items-center justify-center">
                See How It Works
              </a>
            </div>
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tradie-orange" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-tradie-orange" />
                14-day free trial
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-24 bg-navy-surface px-6 border-y border-navy-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">The profit is in the follow-up.</h2>
            <p className="text-lg text-gray-400">Most tradies are leaking margin without even knowing it.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "You're busy but you don't know if you're profitable",
                icon: BarChart3,
                desc: "Cash in the bank isn't profit. If you don't know your margin on every job, you're flying blind."
              },
              {
                title: "Quotes go cold because you're on the tools",
                icon: MessageSquare,
                desc: "You send a quote, don't hear back, and forget to chase it. That's money left on the table every single week."
              },
              {
                title: "You finish a job and still don't know if you made money",
                icon: Clock,
                desc: "Between variations, materials, and labor, the margin you quoted is rarely the margin you keep."
              }
            ].map((item, i) => (
              <div key={i} className="bg-navy-elevated p-8 rounded-2xl border border-navy-border hover:border-tradie-orange/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-navy-border flex items-center justify-center mb-6 group-hover:bg-tradie-orange/10 transition-colors">
                  <item.icon className="w-6 h-6 text-tradie-orange" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section id="solution" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tradie-orange/10 text-tradie-orange text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3" /> Built for Australian Tradies
              </div>
              <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">Stop leaking profit and start winning more work.</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Profit Dashboard",
                    desc: "See your real margin on every job, every week. Know exactly which jobs are making you money and which ones are a waste of time.",
                    icon: BarChart3
                  },
                  {
                    title: "Quote Follow-Up",
                    desc: "Automated SMS and email chases quotes until you get a yes or a no. Professional, persistent, and entirely hands-off.",
                    icon: MessageSquare
                  },
                  {
                    title: "Invoice Chaser",
                    desc: "Flags overdue invoices before they become a cash flow problem. Keep your cash moving without having to play debt collector.",
                    icon: DollarSign
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-navy-surface border border-navy-border flex items-center justify-center mt-1">
                      <item.icon className="w-5 h-5 text-tradie-orange" />
                    </div>
                    <div>
                      <h4 className="text-xl font-heading font-bold mb-2">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-navy-elevated rounded-2xl border border-navy-border p-4 shadow-2xl">
                <div className="bg-navy-surface rounded-xl overflow-hidden border border-navy-border aspect-video flex items-center justify-center">
                   <div className="text-center p-8">
                      <TrendingUp className="w-16 h-16 text-tradie-orange mx-auto mb-4 opacity-20" />
                      <p className="text-sm text-gray-500 font-mono">[ Dashboard Preview Visualization ]</p>
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-tradie-orange p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="text-3xl font-heading font-bold mb-1">+24%</p>
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Avg. Quote Win Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 bg-navy-surface px-6 border-y border-navy-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">Already using Tradify, Jobber, or Fergus? Good. Keep using them.</h2>
          <p className="text-lg text-gray-400 mb-12">
            TradiePilot isn't a replacement for your job management software. It's the profit intelligence layer on top. 
            Tradify and Jobber tell you what jobs you've done. TradiePilot tells you which ones actually made you money — 
            and which ones are quietly killing your margins.
          </p>
          
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Works alongside tools you already use</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Xero", "Tradify", "Jobber", "Fergus", "MYOB"].map((tool) => (
              <span key={tool} className="px-6 py-3 bg-navy-elevated border border-navy-border rounded-xl font-bold text-gray-300">
                {tool}
              </span>
            ))}
          </div>
          
          <p className="mt-12 text-gray-400 italic">
            Most trades businesses running Xero, Tradify, Jobber or Fergus still have no clear picture of their real job profitability. TradiePilot fixes that.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4">Simple, straight-up pricing.</h2>
            <p className="text-lg text-gray-400">Choose the plan that fits your crew.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "97",
                desc: "Perfect for sole traders or small crews just getting started.",
                features: ["20 quotes per month", "5 active jobs", "Basic profit reports", "Quote follow-up automation"]
              },
              {
                name: "Pro",
                price: "197",
                popular: true,
                desc: "Full profit intelligence for growing trade businesses.",
                features: ["Unlimited everything", "Full margin dashboard", "Receipt scanning", "Benchmark data", "Xero integration"]
              },
              {
                name: "Agency",
                price: "497",
                desc: "For consultants or larger groups managing multiple entities.",
                features: ["Up to 20 tradie accounts", "White-label ready", "Custom reporting", "Priority support"]
              }
            ].map((plan, i) => (
              <div key={i} className={`bg-navy-elevated p-8 rounded-3xl border flex flex-col ${plan.popular ? 'border-tradie-orange shadow-2xl shadow-tradie-orange/10 relative scale-105 z-10' : 'border-navy-border'}`}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tradie-orange text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-heading font-bold">$ {plan.price}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                <p className="text-sm text-gray-400 mb-8 min-h-[40px]">{plan.desc}</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex gap-3 text-sm text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-tradie-orange shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`w-full py-4 rounded-xl font-bold transition-all text-center ${plan.popular ? 'bg-tradie-orange hover:bg-tradie-orange/90 text-white' : 'bg-navy-surface hover:bg-navy-border text-white border border-navy-border'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-tradie-navy opacity-50" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-heading font-bold mb-8">Ready to know your numbers?</h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Start your free 14-day trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto bg-tradie-orange hover:bg-tradie-orange/90 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all shadow-2xl shadow-tradie-orange/30">
              Start Free Trial Now
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 opacity-50">
            <ShieldCheck className="w-8 h-8" />
            <div className="text-left">
              <p className="text-sm font-bold uppercase tracking-wider">Secure & Trusted</p>
              <p className="text-xs text-gray-400">Used by tradies across Australia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-navy-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-navy" />
            </div>
            <span className="font-heading font-bold tracking-tight">TradiePilot</span>
          </div>
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} TradiePilot. Built for Australian Trade Businesses.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

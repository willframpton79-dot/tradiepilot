import Link from "next/link";
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
    <div className="min-h-screen bg-white text-slate-600 font-body selection:bg-indigo/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 lg:px-12 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
            Tradie<span className="text-indigo">Pilot</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#problem" className="hover:text-indigo transition-colors">The Problem</a>
          <a href="#solution" className="hover:text-indigo transition-colors">The Solution</a>
          <a href="#pricing" className="hover:text-indigo transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo transition-colors">Login</Link>
          <Link href="/signup" className="btn-primary text-sm shadow-md shadow-indigo/10">
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo rounded-full blur-[128px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo/10 text-indigo text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" /> Now in Beta
          </div>
          <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-tight mb-6 text-slate-900">
            Your quotes. Followed up.<br />
            <span className="text-indigo">Automatically.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-500 max-w-3xl mx-auto mb-10 leading-relaxed">
            TradiePilot is profit intelligence for Australian trades businesses doing $500K-$3M.
            Know your numbers, follow up your quotes, and find out exactly where your margin is going.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary px-8 py-4 text-lg shadow-xl shadow-indigo/20 flex items-center justify-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#problem" className="btn-secondary px-8 py-4 text-lg flex items-center justify-center gap-2">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-24 bg-slate-50 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4 text-slate-900">The profit is in the follow-up.</h2>
            <p className="text-lg text-slate-500">Most tradies are leaking margin without even knowing it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Blind Profitability",
                icon: BarChart3,
                desc: "Cash in the bank isn't profit. If you don't know your margin on every job, you're flying blind."
              },
              {
                title: "Cold Quotes",
                icon: Clock,
                desc: "Quotes go cold because you're on site. By the time you follow up, the client has gone elsewhere."
              },
              {
                title: "Price Leaks",
                icon: DollarSign,
                desc: "Materials are going up. If you don't adjust quotes instantly, you pay from your own pocket."
              }
            ].map((item, i) => (
              <div key={i} className="card bg-white">
                <div className="w-12 h-12 rounded-xl bg-indigo/10 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-indigo" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-heading font-bold mb-4 text-slate-900">Simple, straight-up pricing.</h2>
            <p className="text-lg text-slate-500">Choose the plan that fits your crew.</p>
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
              <div key={i} className={`card relative flex flex-col ${plan.popular ? 'border-indigo border-2 shadow-xl scale-105 z-10' : ''}`}>
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-heading font-bold mb-2 text-slate-900">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-heading font-bold text-slate-900">$ {plan.price}</span>
                  <span className="text-slate-400 text-sm">/month</span>
                </div>
                <p className="text-sm text-slate-500 mb-8 min-h-[40px]">{plan.desc}</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`w-full py-4 rounded-xl font-bold transition-all text-center ${plan.popular ? 'bg-indigo text-white hover:bg-indigo/90' : 'btn-secondary'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo flex items-center justify-center text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold tracking-tight text-slate-900">TradiePilot</span>
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} TradiePilot. Built for Australian Trade Businesses.</p>
        </div>
      </footer>
    </div>
  );
}

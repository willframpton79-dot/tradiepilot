"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
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
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Tradie<span className="text-indigo-600">Pilot</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[
              { name: "Features", href: "/#features" },
              { name: "Industries", href: "/#industries" },
              { name: "Pricing", href: "/#pricing" }
            ].map(l => (
              <Link key={l.name} href={l.href} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                {l.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-4 py-2">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition-all shadow-sm">
              Get Started
            </Link>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-600">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden bg-white border-t border-slate-200 overflow-hidden">
          <div className="px-4 py-4 space-y-3">
            {[
              { name: "Features", href: "/#features" },
              { name: "Industries", href: "/#industries" },
              { name: "Pricing", href: "/#pricing" }
            ].map(l => (
              <Link key={l.name} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600 py-2">
                {l.name}
              </Link>
            ))}
            <hr className="border-slate-200" />
            <Link href="/login" className="block text-sm font-semibold text-slate-700 py-2">
              Log in
            </Link>
            <Link href="/signup" className="block text-center text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-lg">
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

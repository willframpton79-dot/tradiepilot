'use client';

import { Sparkles, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function UpgradeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden mb-10"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-full bg-white/10 -skew-x-12 translate-x-20 z-0" />
        <div className="absolute top-0 left-0 w-32 h-full bg-indigo-400/20 skew-x-12 -translate-x-10 z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-7 h-7 text-indigo-100 fill-indigo-100/50" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Unlock Unlimited Profit Intelligence</h3>
              <p className="text-indigo-100 text-sm mt-1 font-medium max-w-xl">
                You&apos;re currently on the free trial. Upgrade to Pro to unlock unlimited active jobs, Xero/MYOB sync, and Suburban Hotspot mapping.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link 
              href="/#pricing" 
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all text-sm shadow-md"
            >
              Upgrade Now <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-3 bg-indigo-700/30 hover:bg-indigo-700/50 text-indigo-100 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

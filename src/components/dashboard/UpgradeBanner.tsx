'use client';
import { Sparkles, X, ArrowRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface UpgradeBannerProps {
  tier?: string;
  trialEndsAt?: string | null;
}

export default function UpgradeBanner({ tier, trialEndsAt }: UpgradeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (tier && tier !== 'free') return null;

  const now = new Date();
  const endsAt = trialEndsAt ? new Date(trialEndsAt) : null;
  const daysRemaining = endsAt ? Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  if (isExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl shadow-red-200 overflow-hidden mb-6 sm:mb-10"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 text-red-100" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-xl font-bold tracking-tight text-white">Your free trial has ended</h3>
              <p className="text-red-100 text-[10px] sm:text-sm mt-1 font-medium max-w-xl">
                Upgrade to continue accessing all your profit intelligence features. No credit card was collected during your trial — choose a plan to continue.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/#pricing"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-red-600 font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-red-50 transition-all text-xs sm:text-sm shadow-md"
            >
              Choose a Plan <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isDismissed) return null;

  const trialCopy = daysRemaining !== null
    ? daysRemaining === 1
      ? '1 day remaining in your trial.'
      : `${daysRemaining} days remaining in your trial.`
    : 'You\'re on the free trial.';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden mb-6 sm:mb-10 max-h-80 sm:max-h-none"
      >
        <div className="absolute top-0 right-0 w-64 h-full bg-white/10 -skew-x-12 translate-x-20 z-0" />
        <div className="absolute top-0 left-0 w-32 h-full bg-indigo-400/20 skew-x-12 -translate-x-10 z-0" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-100 fill-indigo-100/50" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-xl font-bold tracking-tight text-white">Unlock Unlimited Profit Intelligence</h3>
              <p className="text-indigo-100 text-[10px] sm:text-sm mt-1 font-medium max-w-xl">
                {trialCopy} Upgrade to Pro to unlock unlimited active jobs, Xero sync, and Suburban Hotspot mapping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/#pricing"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-indigo-50 transition-all text-xs sm:text-sm shadow-md"
            >
              Upgrade Now <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-2.5 sm:p-3 bg-indigo-700/30 hover:bg-indigo-700/50 text-indigo-100 rounded-xl transition-all"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

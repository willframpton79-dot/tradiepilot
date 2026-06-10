"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Settings, User, Bell, Palette, CreditCard, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

const settingsSections = [
  { icon: User, label: "Profile", desc: "Name, email, phone, and business details" },
  { icon: Bell, label: "Notifications", desc: "Quote follow-up and invoice reminders" },
  { icon: Palette, label: "Appearance", desc: "Theme and display preferences" },
  { icon: CreditCard, label: "Billing", desc: "Subscription plan and payment method" },
  { icon: Shield, label: "Security", desc: "Password and team access controls" },
];

export default function SettingsPage() {
  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors text-sm mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-500" /> Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {settingsSections.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white rounded-lg border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group"
            onClick={() => alert(`Opening ${section.label} settings (placeholder)`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <section.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{section.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{section.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
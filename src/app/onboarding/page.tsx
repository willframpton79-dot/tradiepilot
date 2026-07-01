'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Database,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "Plumbing",
    userRole: "" as "owner" | "admin" | "",
    dataTool: "Xero",
    jobManagementTool: "",
    targetMargin: 35,
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleComplete = async () => {
    setSaving(true);
    try {
      await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          industry: formData.industry,
          userRole: formData.userRole || undefined,
          jobManagementTool: formData.jobManagementTool,
          targetMargin: formData.targetMargin,
        }),
      });
    } catch {
      // non-blocking — proceed to dashboard regardless
    } finally {
      router.push('/dashboard');
    }
  };

  const toolOptions = [
    {
      label: "Xero",
      value: "Xero",
      note: "Connect Xero in Settings after setup to sync invoices automatically.",
    },
    {
      label: "I use Tradify / ServiceM8 / Simpro",
      value: "tradify_servicem8_simpro",
      note: null,
    },
    {
      label: "I use spreadsheets",
      value: "spreadsheets",
      note: null,
    },
    {
      label: "I'll set this up later",
      value: "",
      note: null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">TradiePilot</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-[10px] sm:text-sm text-slate-400 font-medium">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <div className="w-16 sm:w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-600"
                initial={{ width: `${(1 / TOTAL_STEPS) * 100}%` }}
                animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">

            {/* Step 1 — Business Setup */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/60 border border-slate-100"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Let&apos;s set up your business</h2>
                <p className="text-slate-500 mt-2 font-medium">This helps us tailor your profit engine.</p>

                <div className="mt-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Plumbing &amp; Drainage"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Primary Industry</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Plumbing", "Electrical", "Building", "HVAC & Mechanical", "Fit-Out", "Other"].map(ind => (
                        <button
                          key={ind}
                          onClick={() => setFormData({ ...formData, industry: ind })}
                          className={`px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                            formData.industry === ind
                              ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  disabled={!formData.businessName}
                  className="mt-10 w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Step 2 — Who's setting this up? */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Who&apos;s setting this up?</h2>
                <p className="text-slate-500 mt-2 font-medium">This helps us personalise your dashboard and weekly reports.</p>

                <div className="mt-8 space-y-3">
                  {[
                    {
                      value: "owner" as const,
                      label: "I'm the business owner",
                      desc: "You run the business and make the calls.",
                    },
                    {
                      value: "admin" as const,
                      label: "I manage the admin / books",
                      desc: "You handle the office side — invoicing, cost tracking, reconciliation.",
                    },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData({ ...formData, userRole: opt.value })}
                      className={`w-full text-left flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all ${
                        formData.userRole === opt.value
                          ? "bg-indigo-50 border-indigo-600 shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        formData.userRole === opt.value ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                      }`}>
                        {formData.userRole === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-sm sm:text-base ${formData.userRole === opt.value ? "text-indigo-700" : "text-slate-700"}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-10 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 sm:py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.userRole}
                    className="flex-[2] bg-indigo-600 text-white font-bold py-3 sm:py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Connect your tools */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Connect your tools</h2>
                <p className="text-slate-500 mt-2 font-medium">TradiePilot works alongside your current software.</p>

                <div className="mt-8 space-y-3">
                  {toolOptions.map(tool => (
                    <div key={tool.value}>
                      <button
                        onClick={() => setFormData({ ...formData, dataTool: tool.value === "Xero" ? "Xero" : "other", jobManagementTool: tool.value !== "Xero" ? tool.value : "" })}
                        className={`w-full flex items-center justify-between px-6 py-3 sm:py-4 rounded-2xl border transition-all ${
                          (tool.value === "Xero" ? formData.dataTool === "Xero" : formData.jobManagementTool === tool.value)
                            ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span className="font-bold text-sm sm:text-base">{tool.label}</span>
                        {(tool.value === "Xero" ? formData.dataTool === "Xero" : formData.jobManagementTool === tool.value) && (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </button>
                      {tool.note && (tool.value === "Xero" ? formData.dataTool === "Xero" : false) && (
                        <p className="text-xs text-slate-400 mt-1.5 ml-1">{tool.note}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 sm:py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-[2] bg-indigo-600 text-white font-bold py-3 sm:py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    Continue <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4 — Set target margin */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Set your target margin</h2>
                <p className="text-slate-500 mt-2 font-medium">We&apos;ll alert you if a job falls below this threshold.</p>

                <div className="mt-10 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 border-indigo-50 bg-white text-3xl sm:text-4xl font-black text-indigo-600 mb-8">
                    {formData.targetMargin}%
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="1"
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={formData.targetMargin}
                    onChange={(e) => setFormData({ ...formData, targetMargin: parseInt(e.target.value) })}
                  />

                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-2">
                    <span>Low (10%)</span>
                    <span>Industry Avg (35%)</span>
                    <span>Premium (60%)</span>
                  </div>
                </div>

                <div className="mt-8 bg-indigo-50 rounded-2xl p-4 sm:p-6 border border-indigo-100 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                  <p className="text-xs sm:text-sm text-indigo-900 font-medium leading-relaxed">
                    A {formData.targetMargin}% target margin means for every $1,000 you bill, you aim for ${((formData.targetMargin / 100) * 1000).toLocaleString()} in profit after all costs.
                  </p>
                </div>

                <div className="mt-10 flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 sm:py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={saving}
                    className="flex-[2] bg-indigo-600 text-white font-bold py-3 sm:py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <>Complete Setup <CheckCircle2 className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-slate-400 text-xs font-medium">
          &copy; 2026 TradiePilot Australian Operations Pty Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

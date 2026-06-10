'use client';

import { 
  AlertTriangle, 
  FileText, 
  Download, 
  ShieldCheck, 
  Gavel, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Phone
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function EscalationPage() {
  const [showAgencyModal, setShowAgencyModal] = useState(false);

  const escalationInvoices = [
    { id: '3', client: 'CBD Office Ltd', project: 'Office Fit-out', amount: 42000, daysOverdue: 32, status: 'Critical' },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/invoices" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Invoices
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <Gavel className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Legal Escalation</h1>
          </div>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl font-medium">
            Take formal action on severely overdue invoices. These tools are designed to help you recover large debts using Australian Security of Payment (SOPA) frameworks.
          </p>
        </div>

        {/* SOPA Badge / Info */}
        <motion.div variants={fadeUp} className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-lg shadow-indigo-200">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8 text-indigo-200" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold">SOPA Protected</h3>
            <p className="text-indigo-100 text-sm mt-1">
              Your invoices are automatically tagged with Security of Payment Act (SOPA) notices. This gives you the legal right to suspend work and seek adjudication for unpaid work.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg text-[10px] font-bold border border-white/20 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            ACTIVE PROTECTION
          </div>
        </motion.div>

        {/* Critical Invoices */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" /> 
            Qualified for Escalation
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {escalationInvoices.map((inv) => (
              <motion.div 
                key={inv.id}
                variants={fadeUp}
                className="bg-white border-2 border-red-100 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full -mr-16 -mt-16 -z-10" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{inv.client}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{inv.project}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Amount</p>
                        <p className="text-base font-bold text-slate-900 financial-figure">${inv.amount.toLocaleString()}</p>
                      </div>
                      <div className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Days Overdue</p>
                        <p className="text-base font-bold text-red-600">{inv.daysOverdue} Days</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-800 transition-all text-sm">
                      <AlertCircle className="w-4 h-4" /> Final Notice
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all text-sm group">
                      <FileText className="w-4 h-4" /> 
                      <span className="whitespace-nowrap">Stat Demand</span>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Secondary Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-indigo-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Payment Schedule</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Generate a formal response to a payment claim under the SOPA legislation. Essential for defending disputed amounts.
            </p>
            <button className="mt-6 font-bold text-indigo-600 text-sm hover:text-indigo-700 inline-flex items-center gap-2">
              Generate Document <Download className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:border-indigo-200 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Collection Agency</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Hand over this debt to our partner collection agency. No upfront fees, they only take a percentage of recovered funds.
            </p>
            <button 
              onClick={() => setShowAgencyModal(true)}
              className="mt-6 font-bold text-orange-600 text-sm hover:text-orange-700 inline-flex items-center gap-2"
            >
              Request Handover <CheckCircle2 className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Modal (Mock) */}
        {showAgencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-slate-900">Debt Recovery Handover</h3>
              <p className="text-slate-500 mt-4 leading-relaxed">
                You are about to hand over <strong>CBD Office Ltd ($42,000)</strong> to our recovery partners. They will contact you within 24 hours to confirm the details.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button 
                  onClick={() => setShowAgencyModal(false)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
                >
                  Confirm Handover
                </button>
                <button 
                  onClick={() => setShowAgencyModal(false)}
                  className="w-full bg-white text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'

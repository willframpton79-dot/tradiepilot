"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

export default function ContactSalesPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      businessName: formData.get("businessName"),
      annualRevenue: formData.get("annualRevenue"),
      staffCount: formData.get("staffCount"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Message sent successfully!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Toaster position="top-center" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Message Sent</h1>
          <p className="text-slate-600 mb-8">
            Thank you for your interest in TradiePilot. Our sales team will be in touch within 24 hours.
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toaster position="top-center" />
      
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Tradie<span className="text-indigo-600">Pilot</span>
            </span>
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Copy */}
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
              Scale Your Trade Business with Confidence
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Our Enterprise plan is designed for construction and trade businesses managing multiple crews and complex projects. Get a custom solution tailored to your specific workflow.
            </p>
            
            <div className="space-y-6">
              {[
                "Custom integrations with your existing tech stack",
                "Dedicated account manager and priority support",
                "Multi-crew management and advanced reporting",
                "Onboarding and team training included",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="bg-indigo-50 p-1 rounded-full mt-1">
                    <CheckCircle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-600 italic">
                "TradiePilot has completely changed how we look at our job margins. We're now making decisions based on data, not gut feel."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Michael S.</p>
                  <p className="text-xs text-slate-500">Director, Premium Builders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Contact our sales team</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="businessName" className="text-sm font-semibold text-slate-700">Business Name</label>
                  <input
                    required
                    type="text"
                    id="businessName"
                    name="businessName"
                    placeholder="Acme Construction"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="annualRevenue" className="text-sm font-semibold text-slate-700">Annual Revenue</label>
                  <select
                    required
                    id="annualRevenue"
                    name="annualRevenue"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="">Select revenue...</option>
                    <option value="$500K–$1M">$500K–$1M</option>
                    <option value="$1M–$2M">$1M–$2M</option>
                    <option value="$2M–$5M">$2M–$5M</option>
                    <option value="$5M+">$5M+</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="staffCount" className="text-sm font-semibold text-slate-700">Number of Staff</label>
                  <input
                    required
                    type="number"
                    id="staffCount"
                    name="staffCount"
                    placeholder="e.g. 15"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Work Email</label>
                <input
                  required
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your business and what you're looking for..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                ></textarea>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} TradiePilot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

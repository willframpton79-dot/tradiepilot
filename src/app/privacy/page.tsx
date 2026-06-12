"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeUp}>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Privacy Policy</h1>
              <p className="text-slate-500 font-medium">Last updated: June 12, 2026</p>
            </motion.div>

            <motion.div variants={fadeUp} className="prose prose-slate max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
                <p className="text-slate-600 leading-relaxed">
                  TradiePilot ("we", "us", or "our") is a product of Automation Layer (ABN 55 388 054 921). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, store, and protect your data in accordance with the Australian Privacy Act 1988 (Cth).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We collect information that you provide directly to us when you create an account, use our services, or communicate with us. This includes:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, and business details.</li>
                  <li><strong>Financial Information:</strong> Billing details and data synchronized from accounting platforms like Xero.</li>
                  <li><strong>Usage Data:</strong> Information about how you use our application, including log data, device information, and IP addresses.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li>Provide, maintain, and improve our services.</li>
                  <li>Process transactions and send related information, including invoices and confirmations.</li>
                  <li>Send technical notices, updates, security alerts, and support messages.</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Storage and Security</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Your data is stored securely using industry-standard encryption. We use <strong>MongoDB</strong> for data storage. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Services</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We engage third-party service providers to perform functions and provide services to us. These providers may have access to your information only to perform these tasks on our behalf:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Stripe:</strong> For payment processing.</li>
                  <li><strong>Xero:</strong> For accounting data synchronization (only if you choose to connect your account).</li>
                  <li><strong>Resend:</strong> For transactional email delivery.</li>
                  <li><strong>MongoDB:</strong> For database management and storage.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookies</h2>
                <p className="text-slate-600 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Your Rights Under Australian Law</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Under the Australian Privacy Act 1988, you have the right to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li>Access the personal information we hold about you.</li>
                  <li>Request the correction of inaccurate personal information.</li>
                  <li>Make a complaint if you believe we have breached the Australian Privacy Principles.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Us</h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                  <br />
                  <strong>Email:</strong> <a href="mailto:william@automation-layer.com" className="text-indigo-600 hover:underline">william@automation-layer.com</a>
                  <br />
                  <strong>Company:</strong> Automation Layer (ABN 55 388 054 921)
                </p>
              </section>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

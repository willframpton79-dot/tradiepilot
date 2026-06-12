"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";

export default function TermsOfService() {
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
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Terms of Service</h1>
              <p className="text-slate-500 font-medium">Last updated: June 12, 2026</p>
            </motion.div>

            <motion.div variants={fadeUp} className="prose prose-slate max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-600 leading-relaxed">
                  By accessing or using TradiePilot ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. TradiePilot is a product of Automation Layer (ABN 55 388 054 921).
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Description of Service</h2>
                <p className="text-slate-600 leading-relaxed">
                  TradiePilot provides job profitability intelligence, automated quote follow-ups, and invoice chasing tools for Australian trade businesses. We reserve the right to modify or discontinue the Service at any time without notice.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Subscriptions and Payments</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Access to certain features of the Service requires a paid subscription. All payments are processed securely via <strong>Stripe</strong>.
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li>Subscriptions are billed in advance on a monthly or annual basis.</li>
                  <li>You agree to provide current, complete, and accurate purchase and account information.</li>
                  <li>We reserve the right to refuse any order or subscription.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Cancellation and Refund Policy</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We strive to be fair and transparent with our billing:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li><strong>Monthly Subscriptions:</strong> You may cancel your monthly subscription at any time. Upon cancellation, we will provide a pro-rata refund for the remaining days in your current billing cycle.</li>
                  <li><strong>Annual Subscriptions:</strong> Annual subscriptions offer a significant discount and are non-refundable. You will continue to have access to the Service until the end of your current annual term.</li>
                  <li>All cancellation requests must be made via the account settings within the application or by contacting support.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">5. User Responsibilities</h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  As a user of the Service, you agree to:
                </p>
                <ul className="list-disc pl-6 text-slate-600 space-y-2">
                  <li>Maintain the confidentiality of your account credentials.</li>
                  <li>Provide accurate information for quote and invoice generation.</li>
                  <li>Comply with all applicable Australian laws and regulations.</li>
                  <li>Not use the Service for any deceptive, fraudulent, or abusive outreach.</li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Third-Party Integrations</h2>
                <p className="text-slate-600 leading-relaxed">
                  The Service integrates with third-party platforms such as <strong>Xero</strong>. Your use of these integrations is subject to the terms and conditions of those third-party providers. We are not responsible for any data loss or issues caused by third-party services.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-slate-600 leading-relaxed">
                  To the maximum extent permitted by law, Automation Layer shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law</h2>
                <p className="text-slate-600 leading-relaxed">
                  These Terms of Service are governed by and construed in accordance with the laws of New South Wales, Australia. You irrevocably submit to the exclusive jurisdiction of the courts in that State.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contact Information</h2>
                <p className="text-slate-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
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

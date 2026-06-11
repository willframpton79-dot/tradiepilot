'use client';

import { useParams } from "next/navigation";
import { useState } from "react";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  X,
  Copy,
  Check,
  Mail,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { printJobReport } from "@/lib/export";
import ProfitGauge from "@/components/dashboard/ProfitGauge";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function JobDetailPage() {
  const params = useParams();
  
  // Mock data for the specific job
  const job = {
    id: params.id,
    name: "Woollahra Bathroom Renovation",
    client: "Sarah Johnson",
    address: "123 Ocean St, Woollahra NSW",
    status: "In Progress",
    startDate: "2026-05-10",
    estimatedEnd: "2026-06-25",
    contractValue: 24500,
    costsToDate: 14200,
    margin: 0.42,
    tasks: [
      { id: 1, name: "Demolition", status: "Completed", date: "2026-05-12" },
      { id: 2, name: "Plumbing Rough-in", status: "Completed", date: "2026-05-18" },
      { id: 3, name: "Waterproofing", status: "In Progress", date: "2026-06-05" },
      { id: 4, name: "Tiling", status: "Scheduled", date: "2026-06-12" },
    ]
  };

  // Payment Link States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(job.contractValue.toString());
  const [clientEmail, setClientEmail] = useState("sarah.johnson@example.com");
  const [clientName, setClientName] = useState(job.client);
  const [description, setDescription] = useState(`Secure Payment Request for ${job.name}`);
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          amount,
          clientEmail,
          clientName,
          description,
          jobName: job.name
        }),
      });
      const data = await response.json();
      if (response.ok && data.url) {
        setGeneratedUrl(data.url);
      } else {
        alert(data.error || 'Failed to generate payment link');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while generating the payment link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setEmailLoading(true);
    try {
      const response = await fetch('/api/stripe/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.id,
          amount,
          clientEmail,
          clientName,
          description,
          jobName: job.name,
          sendEmail: true,
          paymentUrl: generatedUrl
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
      } else {
        alert(data.error || 'Failed to send email');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending the email.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGeneratedUrl("");
    setEmailSent(false);
    setCopied(false);
  };

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Header */}
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{job.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {job.client}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" /> {job.address}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-bold uppercase tracking-wider">
                {job.status}
              </span>
              <button
                onClick={() => printJobReport({
                  title: job.name,
                  client: { name: job.client },
                  quotedTotal: job.contractValue,
                  actualTotal: job.costsToDate,
                  margin: job.contractValue - job.costsToDate,
                  marginPct: job.margin * 100,
                  quotedLabour: job.contractValue * 0.4,
                  actualLabour: job.costsToDate * 0.45,
                  quotedMaterials: job.contractValue * 0.5,
                  actualMaterials: job.costsToDate * 0.45,
                  quotedSubcontractors: job.contractValue * 0.1,
                  actualSubcontractors: job.costsToDate * 0.1,
                  startDate: job.startDate,
                  dueDate: job.estimatedEnd,
                  status: job.status,
                })}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                <Download className="w-4 h-4" /> PDF Report
              </button>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
              >
                <CreditCard className="w-4 h-4 text-indigo-600" /> Send Payment Link
              </button>

              <button className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all text-sm">
                Edit Job
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Current Margin</h3>
            <ProfitGauge margin={job.margin} />
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contract Value</p>
              <p className="text-2xl font-bold text-slate-900 financial-figure">${job.contractValue.toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Costs to Date</p>
                <p className="text-xl font-bold text-slate-700 financial-figure">${job.costsToDate.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Started May 10</p>
                  <p className="text-xs text-slate-500 font-medium">Est. finish Jun 25</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Task List */}
        <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Project Timeline</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {job.tasks.map((task) => (
              <div key={task.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : task.status === 'In Progress' ? (
                    <Clock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />
                  )}
                  <div>
                    <p className={`text-sm font-bold ${task.status === 'Completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                      {task.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{task.date}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-50 text-green-700' :
                  task.status === 'In Progress' ? 'bg-amber-50 text-amber-700' :
                  'bg-slate-50 text-slate-500'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Collect On-Site Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Collect On-Site Payment
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!generatedUrl ? (
                <>
                  <p className="text-xs text-slate-500">
                    Generate a secure Stripe Payment Link to collect credit card payment on-site or send directly to the client.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Amount (AUD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-medium">$</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                        placeholder="Client Name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Client Email
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                        placeholder="client@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Payment Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium resize-none"
                        placeholder="e.g. Final payment for bathroom renovation"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateLink}
                      disabled={loading || !amount || parseFloat(amount) <= 0}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                        </>
                      ) : (
                        "Generate Payment Link"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-green-800">Payment Link Ready</h4>
                      <p className="text-xs text-green-700 mt-1">
                        You can now copy this link to collect payment immediately, or send a branded reminder email to the client.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Generated Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generatedUrl}
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm font-medium outline-none select-all"
                      />
                      <button
                        onClick={handleCopyLink}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all flex items-center gap-1.5 ${
                          copied 
                            ? "bg-green-50 border-green-200 text-green-700" 
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSendEmail}
                      disabled={emailLoading}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        emailSent
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                      }`}
                    >
                      {emailLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                        </>
                      ) : emailSent ? (
                        <>
                          <Check className="w-4 h-4" /> Email Sent Successfully!
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" /> Send via Email
                        </>
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

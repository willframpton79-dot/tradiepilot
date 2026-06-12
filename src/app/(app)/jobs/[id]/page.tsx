'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
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
import { jobDetails as fallbackJobData } from "@/lib/sampleData";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment Link States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Try to fetch from MongoDB API
        const response = await fetch(`/api/jobs/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            setJobData(data);
            return;
          }
        }
        
        // 2. Fallback to sampleData.ts if API fails or returns error
        console.log(`Job ${id} not found in MongoDB, falling back to sample data`);
        const fallbackJob = fallbackJobData[id];
        
        if (fallbackJob) {
          // Map sample data to the shape expected by the UI if needed
          // The sample data in src/lib/sampleData.ts already matches the JobDetail interface
          setJobData(transformFallbackData(fallbackJob));
        } else {
          throw new Error('Job not found');
        }
      } catch (err: any) {
        console.error('Error fetching job:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    function setJobData(data: any) {
      setJob(data);
      setAmount((data.quotedTotal || data.contractValue || 0).toString());
      setClientEmail(data.client?.email || "");
      setClientName(data.client?.name || "");
      setDescription(`Secure Payment Request for ${data.title || data.name}`);
    }

    function transformFallbackData(data: any) {
      // Ensure all fields expected by the UI exist
      return {
        ...data,
        title: data.title || data.name,
        quotedTotal: data.quotedTotal || data.budget || 0,
        actualTotal: data.actualTotal || data.cost || 0,
        marginPct: data.marginPct !== undefined ? data.marginPct : (data.margin || 0),
        status: data.status || 'active',
        suburb: data.suburb || '',
        startDate: data.startDate || '',
        dueDate: data.dueDate || '',
        timeLog: data.timeLog || [],
        receiptLog: data.receiptLog || [],
      };
    }

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleGenerateLink = async () => {
    setLinkLoading(true);
    try {
      const response = await fetch('/api/stripe/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.jobId || job._id || job.id,
          amount,
          clientEmail,
          clientName,
          description,
          jobName: job.title || job.name
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
      setLinkLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setEmailLoading(true);
    try {
      const response = await fetch('/api/stripe/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job.jobId || job._id || job.id,
          amount,
          clientEmail,
          clientName,
          description,
          jobName: job.title || job.name,
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium">Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Job Not Found</h1>
        <p className="text-slate-500 mb-6">{error || "The job you are looking for does not exist."}</p>
        <Link href="/dashboard" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{job.title || job.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {job.client?.name}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4" /> {job.suburb}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${
                job.status === 'active' || job.status === 'on-track' ? 'bg-green-50 text-green-700 border-green-100' : 
                job.status === 'critical' ? 'bg-red-50 text-red-700 border-red-100' :
                'bg-slate-50 text-slate-700 border-slate-100'
              }`}>
                {job.status === 'active' || job.status === 'on-track' ? 'In Progress' : job.status}
              </span>
              <button
                onClick={() => printJobReport({
                  title: job.title || job.name,
                  client: { name: job.client?.name },
                  quotedTotal: job.quotedTotal || job.budget || 0,
                  actualTotal: job.actualTotal || job.cost || 0,
                  margin: (job.quotedTotal || job.budget || 0) - (job.actualTotal || job.cost || 0),
                  marginPct: job.marginPct !== undefined ? job.marginPct : (job.margin || 0),
                  quotedLabour: job.quotedLabour || 0,
                  actualLabour: job.actualLabour || 0,
                  quotedMaterials: job.quotedMaterials || 0,
                  actualMaterials: job.actualMaterials || 0,
                  quotedSubcontractors: job.quotedSubcontractors || 0,
                  actualSubcontractors: job.actualSubcontractors || 0,
                  startDate: job.startDate,
                  dueDate: job.dueDate,
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
            <ProfitGauge margin={(job.marginPct !== undefined ? job.marginPct : (job.margin || 0)) / 100} />
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contract Value</p>
              <p className="text-2xl font-bold text-slate-900 financial-figure">${(job.quotedTotal || job.budget || 0).toLocaleString()}</p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Costs to Date</p>
                <p className="text-xl font-bold text-slate-700 financial-figure">${(job.actualTotal || job.cost || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Started {job.startDate}</p>
                  <p className="text-xs text-slate-500 font-medium">Due {job.dueDate}</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                  <span>Completion Estimate</span>
                  <span>{job.progress || Math.round(((job.actualTotal || job.cost || 0) / (job.quotedTotal || job.budget || 1)) * 100) || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, job.progress || ((job.actualTotal || job.cost || 0) / (job.quotedTotal || job.budget || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Overrun Notes if any */}
        {job.overrunNotes && (
          <motion.div variants={fadeUp} className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800">Cost Overrun Insight</h3>
              <p className="text-sm text-red-700 mt-1 leading-relaxed">{job.overrunNotes}</p>
            </div>
          </motion.div>
        )}

        {/* Logs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Log */}
          <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Labour Log
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total: ${job.actualLabour?.toLocaleString() || '0'}</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
              {job.timeLog?.length > 0 ? job.timeLog.map((log: any) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.staff}</p>
                    <p className="text-xs text-slate-500">{log.description}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{log.date} • {log.hours}hrs @ ${log.rate}/hr</p>
                  </div>
                  <p className="text-sm font-bold text-slate-700">${log.cost?.toLocaleString()}</p>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400 text-sm">No labour entries recorded yet.</div>
              )}
            </div>
          </motion.div>

          {/* Receipt Log */}
          <motion.div variants={fadeUp} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" /> Materials & Expenses
              </h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total: ${job.actualMaterials?.toLocaleString() || '0'}</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
              {job.receiptLog?.length > 0 ? job.receiptLog.map((log: any) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{log.item}</p>
                    <p className="text-xs text-slate-500">{log.supplier} • <span className="capitalize">{log.category}</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">{log.date}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-700">${log.cost?.toLocaleString()}</p>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400 text-sm">No receipts recorded yet.</div>
              )}
            </div>
          </motion.div>
        </div>
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
                        placeholder="e.g. Final payment for renovation"
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
                      disabled={linkLoading || !amount || parseFloat(amount) <= 0}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {linkLoading ? (
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

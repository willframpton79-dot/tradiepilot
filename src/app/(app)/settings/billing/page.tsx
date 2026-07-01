'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';
import { CheckCircle2, Zap, ExternalLink, Mail, X, Send, Loader2 } from 'lucide-react';

function BillingContent() {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tier, setTier] = useState('free');
  const [reportModal, setReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState<{ subject: string; body: string } | null>(null);
  const [sendingReport, setSendingReport] = useState(false);
  const searchParams = useSearchParams();
  const checkoutStatus = searchParams.get('checkout');

  const fetchTier = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setTier(data.tier || 'free');
    } catch (error) {
      toast.error('Failed to load billing info');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTier();
    // Re-poll once after 3s to pick up the tier update from the Stripe webhook
    if (checkoutStatus === 'success') {
      const timer = setTimeout(fetchTier, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handlePreviewReport = async () => {
    setReportLoading(true);
    setReportModal(true);
    setReportContent(null);
    try {
      const res = await fetch('/api/ai/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preview: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setReportContent({ subject: data.subject, body: data.preview });
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate report preview');
      setReportModal(false);
    } finally {
      setReportLoading(false);
    }
  };

  const handleSendReport = async () => {
    setSendingReport(true);
    try {
      const res = await fetch('/api/ai/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preview: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send report');
      toast.success('Weekly report sent to your inbox');
      setReportModal(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send report');
    } finally {
      setSendingReport(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to open portal');
      if (data.url) window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to initiate checkout');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <SettingsWrapper
      title="Billing & Subscription"
      description="Manage your subscription plan and billing history."
    >
      <div className="space-y-8">
        {/* Post-checkout banners */}
        {checkoutStatus === 'success' && (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Payment successful — welcome to Pro!</p>
              <p className="text-xs text-emerald-700 mt-0.5">Your plan is being activated. If it doesn&apos;t update in the next few seconds, refresh the page.</p>
            </div>
          </div>
        )}
        {checkoutStatus === 'cancelled' && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
            <Zap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-800">Checkout was cancelled — no charge was made. Upgrade any time below.</p>
          </div>
        )}

        {/* Current Plan */}
        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-indigo-600 font-bold uppercase tracking-wider">Current Plan</p>
              <h3 className="text-xl font-black text-slate-900 capitalize">{tier} Plan</h3>
            </div>
          </div>
          {(tier === 'free' || tier === 'solo' || tier === 'starter') ? (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Zap className="w-4 h-4 fill-current" />
              )}
              Upgrade to Pro — $149/mo
            </button>
          ) : tier === 'pro' ? (
            <button
              onClick={() => window.location.href = '/contact-sales'}
              className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-100 flex items-center justify-center gap-2"
            >
              Upgrade to Enterprise — $497/mo
            </button>
          ) : null}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Included in your plan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(tier === 'pro' || tier === 'enterprise'
              ? tier === 'enterprise'
                ? ['Unlimited active jobs', 'Full Xero sync', 'AI weekly profit report', 'Multi-crew job costing', 'Custom workflow configuration', 'Dedicated onboarding', 'Phone support']
                : ['Unlimited active jobs', 'Full Xero sync', 'AI weekly profit report', 'Priority support']
              : ['Up to 5 active jobs', 'Real-time job profitability', 'Basic Xero sync', 'Email support']
            ).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* AI Weekly Report Preview — Pro/Enterprise only */}
        {(tier === 'pro' || tier === 'enterprise') && (
          <div className="pt-8 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Weekly Profit Report</h4>
                <p className="text-sm text-slate-500 mt-1">
                  Every Monday morning TradiePilot sends you a personalised profit summary. Preview what this week&apos;s report looks like.
                </p>
              </div>
              <button
                onClick={handlePreviewReport}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
              >
                <Mail className="w-4 h-4" />
                Preview this week&apos;s report
              </button>
            </div>
          </div>
        )}

        {/* Billing Portal */}
        <div className="pt-8 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Billing &amp; Invoices</h4>
          <p className="text-sm text-slate-500 mb-4">
            View your invoices, update your payment method, or cancel your subscription via the Stripe billing portal.
          </p>
          <button
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-50"
          >
            {portalLoading
              ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400" />
              : <ExternalLink className="w-4 h-4" />}
            Manage Billing
          </button>
        </div>
      </div>
      {/* Report Preview Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Weekly Profit Report</p>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 truncate">
                  {reportContent?.subject || 'Generating…'}
                </h3>
              </div>
              <button onClick={() => setReportModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {reportLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <p className="text-sm text-slate-500">Generating your weekly report…</p>
                </div>
              ) : reportContent ? (
                <div className="space-y-3">
                  {reportContent.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm text-slate-700 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Modal footer */}
            {reportContent && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button onClick={() => setReportModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                  Close
                </button>
                <button
                  onClick={handleSendReport}
                  disabled={sendingReport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  {sendingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send to my inbox
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </SettingsWrapper>
  );
}

export default function BillingSettings() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}

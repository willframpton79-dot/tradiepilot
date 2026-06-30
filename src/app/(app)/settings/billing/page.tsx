'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle2, Zap, ExternalLink } from 'lucide-react';

export default function BillingSettings() {
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tier, setTier] = useState('free');

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

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
          {tier === 'free' || tier === 'starter' ? (
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
              Upgrade to Pro
            </button>
          ) : tier === 'pro' ? (
            <button
              className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md shadow-slate-100 flex items-center justify-center gap-2"
            >
              Upgrade to Enterprise
            </button>
          ) : null}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Included in your plan</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Up to 5 active jobs',
              'Real-time job profitability',
              'Basic Xero sync',
              'Email support',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

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
    </SettingsWrapper>
  );
}

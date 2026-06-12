'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';

export default function BillingSettings() {
  const [loading, setLoading] = useState(false);
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

        {/* Billing History Placeholder */}
        <div className="pt-8 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Billing History</h4>
          <div className="rounded-xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <CreditCard className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 font-medium">No invoices yet.</p>
            <p className="text-xs text-slate-400 mt-1">Your billing history will appear here after your first payment.</p>
          </div>
        </div>
      </div>
    </SettingsWrapper>
  );
}

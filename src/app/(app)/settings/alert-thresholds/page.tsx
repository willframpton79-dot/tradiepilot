'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';
import { Bell, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlertThresholdSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    alertThresholds: {
      marginThreshold: 20,
      overdueInvoiceAlert: true,
      overdueInvoiceDays: 14,
      quoteExpiryAlert: true,
      quoteExpiryDays: 7,
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.alertThresholds) {
          setFormData({ alertThresholds: data.alertThresholds });
        }
      } catch (error) {
        toast.error('Failed to load alert thresholds');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertThresholds: formData.alertThresholds }),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      toast.success('Alert thresholds updated');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const updateThreshold = (key: string, value: any) => {
    setFormData({
      ...formData,
      alertThresholds: {
        ...formData.alertThresholds,
        [key]: value,
      }
    });
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
      title="Alert Thresholds" 
      description="Configure custom triggers for margin warnings and overdue reminders."
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Margin Threshold */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
              Margin Profitability
            </h3>
          </div>
          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Margin Alert Threshold</p>
                <p className="text-xs text-slate-500">Flag jobs as &apos;Critical&apos; if their gross margin drops below this percentage.</p>
              </div>
              <div className="text-xl font-black text-indigo-600 w-16 text-right">
                {formData.alertThresholds.marginThreshold}%
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={formData.alertThresholds.marginThreshold}
              onChange={(e) => updateThreshold('marginThreshold', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span>0% (Risk Heavy)</span>
              <span>25% (Standard)</span>
              <span>50% (High Growth)</span>
            </div>
          </div>
        </div>

        {/* Invoice Chasers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Invoice Management</h3>
            <button
              type="button"
              onClick={() => updateThreshold('overdueInvoiceAlert', !formData.alertThresholds.overdueInvoiceAlert)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.alertThresholds.overdueInvoiceAlert ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.alertThresholds.overdueInvoiceAlert ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className={`p-6 rounded-2xl border border-slate-100 transition-all ${formData.alertThresholds.overdueInvoiceAlert ? 'bg-slate-50/50 opacity-100' : 'bg-slate-50/20 opacity-50'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Overdue Invoice Alert</p>
                <p className="text-xs text-slate-500">Notify me when an invoice remains unpaid after the due date.</p>
              </div>
              <select
                disabled={!formData.alertThresholds.overdueInvoiceAlert}
                value={formData.alertThresholds.overdueInvoiceDays}
                onChange={(e) => updateThreshold('overdueInvoiceDays', parseInt(e.target.value))}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700"
              >
                <option value="7">7 Days Overdue</option>
                <option value="14">14 Days Overdue</option>
                <option value="30">30 Days Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quote Expiry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Quote Follow-ups</h3>
            <button
              type="button"
              onClick={() => updateThreshold('quoteExpiryAlert', !formData.alertThresholds.quoteExpiryAlert)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.alertThresholds.quoteExpiryAlert ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.alertThresholds.quoteExpiryAlert ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className={`p-6 rounded-2xl border border-slate-100 transition-all ${formData.alertThresholds.quoteExpiryAlert ? 'bg-slate-50/50 opacity-100' : 'bg-slate-50/20 opacity-50'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Quote Expiry Alert</p>
                <p className="text-xs text-slate-500">Nudge me to follow up if a quote hasn&apos;t been accepted within a specific window.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  disabled={!formData.alertThresholds.quoteExpiryAlert}
                  value={formData.alertThresholds.quoteExpiryDays}
                  onChange={(e) => updateThreshold('quoteExpiryDays', parseInt(e.target.value))}
                  className="w-20 px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold text-slate-700"
                />
                <span className="text-xs font-bold text-slate-400 uppercase">Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Alert Thresholds
          </button>
        </div>
      </form>
    </SettingsWrapper>
  );
}

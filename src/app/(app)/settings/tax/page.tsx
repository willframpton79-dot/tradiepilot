'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';

export default function TaxSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    gstRegistered: false,
    basPeriod: 'quarterly',
    taxRate: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setFormData({
          gstRegistered: data.gstRegistered || false,
          basPeriod: data.basPeriod || 'quarterly',
          taxRate: data.taxRate || 10,
        });
      } catch (error) {
        toast.error('Failed to load tax settings');
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
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      toast.success('Tax settings updated');
    } catch (error) {
      toast.error('Something went wrong');
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
      title="Tax Information" 
      description="Configure GST and BAS reporting preferences for your business."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-sm font-bold text-slate-900">GST Registered</p>
              <p className="text-xs text-slate-500 text-pretty max-w-xs">Enable if your business is registered for GST with the ATO.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gstRegistered: !formData.gstRegistered })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.gstRegistered ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.gstRegistered ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className={`${!formData.gstRegistered && 'opacity-50 pointer-events-none'}`}>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              BAS Reporting Period
            </label>
            <select
              value={formData.basPeriod}
              onChange={(e) => setFormData({ ...formData, basPeriod: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Standard GST Rate (%)
            </label>
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="10"
              min="0"
              max="100"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              Standard Australian GST is 10%.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </SettingsWrapper>
  );
}

'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';

export default function BusinessSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    businessName: '',
    tradeType: '',
    state: '',
    staffCount: '',
    targetMargin: 20,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setFormData({
          businessName: data.businessName || '',
          tradeType: data.tradeType || '',
          state: data.state || '',
          staffCount: data.staffCount || '',
          targetMargin: data.targetMargin || 20,
        });
      } catch (error) {
        toast.error('Failed to load business settings');
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

      toast.success('Business settings updated');
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
      title="Business Profile" 
      description="Update your trade business details and operational targets."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="e.g. Accurate Plumbing"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Trade Type
            </label>
            <select
              value={formData.tradeType}
              onChange={(e) => setFormData({ ...formData, tradeType: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              required
            >
              <option value="">Select trade...</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
              <option value="landscaping">Landscaping</option>
              <option value="builder">General Builder</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              State / Territory
            </label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              required
            >
              <option value="">Select state...</option>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Staff Count
            </label>
            <select
              value={formData.staffCount}
              onChange={(e) => setFormData({ ...formData, staffCount: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              required
            >
              <option value="">Select count...</option>
              <option value="solo">Solo (Just me)</option>
              <option value="2-5">2-5 members</option>
              <option value="6-15">6-15 members</option>
              <option value="15+">15+ members</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Target Margin (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.targetMargin}
                onChange={(e) => setFormData({ ...formData, targetMargin: parseInt(e.target.value) })}
                className="flex-1 accent-indigo-600"
              />
              <span className="font-bold text-slate-900 min-w-[3rem]">{formData.targetMargin}%</span>
            </div>
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

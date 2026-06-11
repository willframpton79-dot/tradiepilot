'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';

export default function EmailPreferenceSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    emailPreferences: {
      marketing: false,
      productUpdates: true,
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.emailPreferences) {
          setFormData({ emailPreferences: data.emailPreferences });
        }
      } catch (error) {
        toast.error('Failed to load email preferences');
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
        body: JSON.stringify({ emailPreferences: formData.emailPreferences }),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      toast.success('Email preferences updated');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (key: keyof typeof formData.emailPreferences) => {
    setFormData({
      ...formData,
      emailPreferences: {
        ...formData.emailPreferences,
        [key]: !formData.emailPreferences[key],
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
      title="Email Preferences" 
      description="Control the types of emails you receive from TradiePilot."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">Product Updates</p>
              <p className="text-xs text-slate-500">New features, improvements, and monthly reports.</p>
            </div>
            <button
              type="button"
              onClick={() => togglePreference('productUpdates')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.emailPreferences.productUpdates ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.emailPreferences.productUpdates ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="pr-4">
              <p className="text-sm font-bold text-slate-900">Marketing & Tips</p>
              <p className="text-xs text-slate-500">Insights on how to grow your trade business and special offers.</p>
            </div>
            <button
              type="button"
              onClick={() => togglePreference('marketing')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formData.emailPreferences.marketing ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.emailPreferences.marketing ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </SettingsWrapper>
  );
}

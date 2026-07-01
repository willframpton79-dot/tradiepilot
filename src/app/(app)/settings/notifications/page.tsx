'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';
import { Mail, X, Send, Loader2, Sparkles, Lock } from 'lucide-react';

export default function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [tier, setTier] = useState<string>('free');
  const [formData, setFormData] = useState({
    notifications: {
      quoteReminders: true,
      invoiceChasers: true,
      marginAlerts: true,
    }
  });
  const [reportModal, setReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState<{ subject: string; body: string } | null>(null);
  const [sendingReport, setSendingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.notifications) {
          setFormData({ notifications: data.notifications });
        }
        if (data.tier) setTier(data.tier);
      } catch (error) {
        toast.error('Failed to load notification settings');
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
        body: JSON.stringify({ notifications: formData.notifications }),
      });

      if (!res.ok) throw new Error('Failed to update settings');

      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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

  const toggleNotification = (key: keyof typeof formData.notifications) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key],
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

  const notificationItems = [
    {
      id: 'quoteReminders',
      title: 'Quote Follow-ups',
      description: 'Receive reminders when a sent quote hasn\'t been accepted within 3 days.',
    },
    {
      id: 'invoiceChasers',
      title: 'Invoice Chasers',
      description: 'Get notified when an automated invoice follow-up is sent to a client.',
    },
    {
      id: 'marginAlerts',
      title: 'Low Margin Alerts',
      description: 'Receive immediate alerts if a job\'s actual margin drops below your target.',
    },
  ];

  return (
    <SettingsWrapper 
      title="Notification Preferences" 
      description="Choose how and when you want to be notified about your business."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="pr-4">
                <p className="text-sm font-bold text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleNotification(item.id as any)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  (formData.notifications as any)[item.id] ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    (formData.notifications as any)[item.id] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
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

      {/* Weekly Profit Report */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Weekly Profit Report</h3>
            <p className="text-xs text-slate-500">Sent every Monday morning to your inbox</p>
          </div>
        </div>

        {tier === 'pro' || tier === 'enterprise' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <p className="text-sm text-slate-600">
              Every Monday TradiePilot sends you a personalised profit summary. Preview what this week&apos;s report will look like.
            </p>
            <button
              onClick={handlePreviewReport}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Preview this week&apos;s report
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-700">Pro feature</p>
              <p className="text-xs text-slate-500 mt-0.5">Upgrade to Pro to receive and preview your weekly AI profit report.</p>
            </div>
            <a
              href="/settings/billing"
              className="shrink-0 text-xs font-bold text-indigo-600 hover:text-indigo-700"
            >
              Upgrade →
            </a>
          </div>
        )}
      </div>

      {/* Report Preview Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col">
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
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {reportLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                  <p className="text-sm text-slate-500">Generating your weekly report…</p>
                </div>
              ) : reportContent ? (
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                  {reportContent.body.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-3 text-sm">{para}</p>
                  ))}
                </div>
              ) : null}
            </div>
            {reportContent && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button onClick={() => setReportModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                  Close
                </button>
                <button
                  onClick={handleSendReport}
                  disabled={sendingReport}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
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

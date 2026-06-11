'use client';

import { useState, useEffect } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';

export default function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    notifications: {
      quoteReminders: true,
      invoiceChasers: true,
      marginAlerts: true,
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.notifications) {
          setFormData({ notifications: data.notifications });
        }
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
    </SettingsWrapper>
  );
}

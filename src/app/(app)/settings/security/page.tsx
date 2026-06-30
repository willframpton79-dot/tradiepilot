'use client';

import { useState } from 'react';
import SettingsWrapper from '@/components/settings/SettingsWrapper';
import { toast } from 'react-hot-toast';
import { Key } from 'lucide-react';

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      toast.success('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsWrapper 
      title="Security" 
      description="Protect your account with a secure password and session management."
    >
      <div className="space-y-8">
        {/* Password Change */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Change Password</h3>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

      </div>
    </SettingsWrapper>
  );
}

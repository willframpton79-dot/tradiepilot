'use client';

import { useState, useEffect, useMemo } from 'react';
import { Users, TrendingUp, AlertCircle, CheckCircle2, Search, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  businessName: string;
  tier: string;
  trialStatus: 'active' | 'expired' | 'none';
  trialEndsAt: string | null;
  xeroConnected: boolean;
  jobCount: number;
  onboardingComplete: boolean;
  createdAt: string;
}

interface Stats {
  total: number;
  activeTrials: number;
  expiredTrials: number;
  paying: number;
}

const TIER_COLORS: Record<string, string> = {
  free: 'bg-slate-100 text-slate-600',
  solo: 'bg-blue-100 text-blue-700',
  starter: 'bg-purple-100 text-purple-700',
  pro: 'bg-indigo-100 text-indigo-700',
  enterprise: 'bg-amber-100 text-amber-700',
};

const TRIAL_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-red-100 text-red-600',
  none: 'bg-slate-100 text-slate-500',
};

const TIERS = ['free', 'solo', 'pro', 'enterprise'];

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierSelects, setTierSelects] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data.users);
      setStats(data.stats);
      const selects: Record<string, string> = {};
      for (const u of data.users) selects[u.email] = u.tier;
      setTierSelects(selects);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u =>
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.businessName.toLowerCase().includes(q),
    );
  }, [users, search]);

  const patch = async (email: string, body: Record<string, unknown>, label: string) => {
    setActionLoading(prev => ({ ...prev, [email + label]: true }));
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed');
      }
      toast.success(`${label} applied`);
      await fetchUsers();
    } catch (e: any) {
      toast.error(e.message || 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [email + label]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">TradiePilot Admin</h1>
            <p className="text-xs text-slate-500 mt-0.5">Internal dashboard — restricted access</p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats?.total ?? '—', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
            { label: 'Active Trials', value: stats?.activeTrials ?? '—', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Expired Trials', value: stats?.expiredTrials ?? '—', icon: AlertCircle, color: 'text-red-500 bg-red-50' },
            { label: 'Paying Subscribers', value: stats?.paying ?? '—', icon: CheckCircle2, color: 'text-amber-600 bg-amber-50' },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                <card.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* User table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email or business…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>
            <span className="text-xs text-slate-400 shrink-0">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['User', 'Tier', 'Trial', 'Signed up', 'Xero', 'Jobs', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(u => {
                    const busy = (label: string) => !!actionLoading[u.email + label];
                    return (
                      <tr key={u.email} className="hover:bg-slate-50/50 transition-colors">
                        {/* User */}
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-900 text-xs">{u.name || '—'}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                          {u.businessName && <p className="text-[11px] text-slate-400">{u.businessName}</p>}
                        </td>

                        {/* Tier */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${TIER_COLORS[u.tier] || 'bg-slate-100 text-slate-500'}`}>
                            {u.tier}
                          </span>
                        </td>

                        {/* Trial */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {u.tier === 'free' ? (
                            <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${TRIAL_COLORS[u.trialStatus]}`}>
                              {u.trialStatus}
                            </span>
                          ) : (
                            <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                              subscriber
                            </span>
                          )}
                        </td>

                        {/* Signup */}
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
                        </td>

                        {/* Xero */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold ${u.xeroConnected ? 'text-emerald-600' : 'text-slate-300'}`}>
                            {u.xeroConnected ? 'Yes' : 'No'}
                          </span>
                        </td>

                        {/* Jobs */}
                        <td className="px-4 py-3 text-xs font-bold text-slate-700">
                          {u.jobCount}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Tier select + apply */}
                            <select
                              value={tierSelects[u.email] ?? u.tier}
                              onChange={e => setTierSelects(prev => ({ ...prev, [u.email]: e.target.value }))}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 outline-none focus:border-indigo-400"
                            >
                              {TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button
                              disabled={busy('tier') || tierSelects[u.email] === u.tier}
                              onClick={() => patch(u.email, { tier: tierSelects[u.email] }, 'tier')}
                              className="text-[11px] font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 transition-all"
                            >
                              Apply
                            </button>

                            <button
                              disabled={busy('extend-trial')}
                              onClick={() => patch(u.email, { action: 'extend-trial' }, 'extend-trial')}
                              className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-40 transition-all whitespace-nowrap"
                            >
                              +7d
                            </button>

                            <button
                              disabled={busy('reset-trial')}
                              onClick={() => patch(u.email, { action: 'reset-trial' }, 'reset-trial')}
                              className="text-[11px] font-bold px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-all whitespace-nowrap"
                            >
                              Reset
                            </button>

                            <Link
                              href={`/admin/users/${encodeURIComponent(u.email)}`}
                              className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2.5 py-1 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-all whitespace-nowrap"
                            >
                              Detail <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

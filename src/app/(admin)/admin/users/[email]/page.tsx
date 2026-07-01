'use client';

import { useState, useEffect, use } from 'react';
import { ArrowLeft, Send, Loader2, Briefcase, FileText, Receipt, RefreshCw, Mail, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserDetail {
  email: string;
  name: string;
  businessName: string;
  tier: string;
  trialStatus: 'active' | 'expired' | 'none';
  trialEndsAt: string | null;
  xeroConnected: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  targetMargin: number;
  tradeType: string;
  state: string;
  adminNotes?: string;
}

const TIER_COLORS: Record<string, string> = {
  free: 'bg-slate-100 text-slate-600',
  solo: 'bg-blue-100 text-blue-700',
  starter: 'bg-blue-100 text-blue-700',
  pro: 'bg-indigo-100 text-indigo-700',
  enterprise: 'bg-amber-100 text-amber-700',
};

export default function AdminUserDetail({ params }: { params: Promise<{ email: string }> }) {
  const { email } = use(params);
  const userEmail = decodeURIComponent(email);
  const router = useRouter();

  const [user, setUser] = useState<UserDetail | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [triggeringReport, setTriggeringReport] = useState(false);

  // Delete state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Send message state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [msgSubject, setMsgSubject] = useState('A message from TradiePilot');
  const [msgBody, setMsgBody] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userEmail)}`);
      if (!res.ok) throw new Error('Failed to load user');
      const data = await res.json();
      setUser(data.user);
      setJobs(data.jobs);
      setQuotes(data.quotes);
      setInvoices(data.invoices);
      setNotes(data.user.adminNotes || '');
    } catch {
      toast.error('Failed to load user detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDetail(); }, [userEmail]);

  const saveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userEmail)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notes }),
      });
      if (!res.ok) throw new Error('Failed to save');
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const triggerReport = async () => {
    setTriggeringReport(true);
    try {
      const res = await fetch('/api/admin/trigger-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(`Report sent: "${data.subject}"`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to send report');
    } finally {
      setTriggeringReport(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userEmail)}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete');
      }
      toast.success('Account deleted');
      router.push('/admin');
    } catch (e: any) {
      toast.error(e.message || 'Delete failed');
      setDeleting(false);
    }
  };

  const sendMessage = async () => {
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    try {
      const res = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, subject: msgSubject, message: msgBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      toast.success('Message sent');
      setShowMessageModal(false);
      setMsgBody('');
      setMsgSubject('A message from TradiePilot');
    } catch (e: any) {
      toast.error(e.message || 'Failed to send message');
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">User not found</p>
      </div>
    );
  }

  const tierLabel = user.tier === 'starter' ? 'solo' : (user.tier || 'free');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/admin" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-bold text-slate-900">{user.name || user.email}</h1>
            <p className="text-xs text-slate-500">{user.email} · {user.businessName || 'No business name'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMessageModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              Send Message
            </button>
            <button
              onClick={triggerReport}
              disabled={triggeringReport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {triggeringReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send Weekly Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Profile + meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</h2>
            {[
              ['Tier', <span key="t" className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${TIER_COLORS[user.tier] || 'bg-slate-100 text-slate-500'}`}>{tierLabel}</span>],
              ['Trial', user.trialStatus === 'none' ? '—' : `${user.trialStatus}${user.trialEndsAt ? ' · ' + new Date(user.trialEndsAt).toLocaleDateString('en-AU') : ''}`],
              ['Signed up', user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
              ['Onboarding', user.onboardingComplete ? '✓ Complete' : '✗ Incomplete'],
              ['Xero', user.xeroConnected ? '✓ Connected' : '✗ Not connected'],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-bold text-slate-800">{val}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business</h2>
            {[
              ['Business Name', user.businessName || '—'],
              ['Trade Type', user.tradeType || '—'],
              ['State', user.state || '—'],
              ['Target Margin', user.targetMargin ? `${user.targetMargin}%` : '—'],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-bold text-slate-800">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin notes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Admin Notes</h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Internal notes about this user…"
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {savingNotes ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Save Notes
            </button>
          </div>
        </div>

        {/* Jobs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Jobs ({jobs.length})</h2>
          </div>
          {jobs.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No jobs</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Title', 'Client', 'Status', 'Margin', 'Contract'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {jobs.map((j: any) => (
                    <tr key={j._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-bold text-slate-800 max-w-[200px] truncate">{j.title}</td>
                      <td className="px-4 py-2.5 text-slate-500">{j.client?.name || '—'}</td>
                      <td className="px-4 py-2.5 text-slate-500 capitalize">{j.status}</td>
                      <td className="px-4 py-2.5">
                        <span className={`font-bold ${(j.marginPct || 0) >= 20 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {(j.marginPct || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-700">${(j.quotedTotal || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quotes */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Quotes ({quotes.length})</h2>
          </div>
          {quotes.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No quotes</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Client', 'Amount', 'Status', 'Days since sent'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {quotes.map((q: any) => (
                    <tr key={q._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-bold text-slate-800">{q.client}</td>
                      <td className="px-4 py-2.5 text-slate-700">${(q.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2.5 capitalize text-slate-500">{q.status}</td>
                      <td className="px-4 py-2.5 text-slate-500">{q.daysSince ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
            <Receipt className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold text-slate-900">Invoices ({invoices.length})</h2>
          </div>
          {invoices.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-400">No invoices</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Client', 'Amount', 'Status', 'Days overdue'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {invoices.map((inv: any) => (
                    <tr key={inv._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-bold text-slate-800">{inv.client}</td>
                      <td className="px-4 py-2.5 text-slate-700">${(inv.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2.5">
                        <span className={`font-bold capitalize ${inv.status === 'overdue' ? 'text-red-500' : inv.status === 'paid' ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">{inv.status === 'overdue' ? inv.daysOverdue : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border-2 border-red-200 p-6">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-1">Danger Zone</h2>
          <p className="text-xs text-slate-500 mb-4">
            Permanently deletes this user account and all associated data — jobs, quotes, invoices, staff, and AI cache. This cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Delete Account</h3>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-1">
              This will permanently delete <strong>{userEmail}</strong> and all their data.
            </p>
            <p className="text-sm text-slate-600 mb-4">Type <strong>DELETE</strong> to confirm.</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/10 transition-all mb-4 font-mono"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-40"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send message modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900">Send Message</h3>
              <button onClick={() => setShowMessageModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">To</label>
                <input
                  type="text"
                  value={userEmail}
                  readOnly
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject</label>
                <input
                  type="text"
                  value={msgSubject}
                  onChange={e => setMsgSubject(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Message</label>
                <textarea
                  value={msgBody}
                  onChange={e => setMsgBody(e.target.value)}
                  rows={6}
                  placeholder="Write your message…"
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-5">
              <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                Cancel
              </button>
              <button
                onClick={sendMessage}
                disabled={!msgBody.trim() || !msgSubject.trim() || sendingMsg}
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-40"
              >
                {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

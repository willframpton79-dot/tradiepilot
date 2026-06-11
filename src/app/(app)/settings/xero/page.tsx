'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Link2, Link2Off, RefreshCw, Loader2, CheckCircle, AlertCircle, XCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

function XeroSettingsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [connected, setConnected] = useState(false);
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const error = searchParams.get('error');
  const success = searchParams.get('success');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated') {
      checkStatus();
    }
  }, [status, router]);

  async function checkStatus() {
    try {
      setLoading(true);
      const res = await fetch('/api/xero/status');
      const data = await res.json();
      setConnected(data.connected);
      setConnectedAt(data.connectedAt);
      setLastSyncedAt(data.lastSyncedAt);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    window.location.href = '/api/xero/connect';
  }

  async function handleDisconnect() {
    try {
      await fetch('/api/xero/disconnect', { method: 'POST' });
      setConnected(false);
      setConnectedAt(null);
      setLastSyncedAt(null);
    } catch {
      console.error('Failed to disconnect');
    }
  }

  async function handleSync() {
    try {
      setSyncing(true);
      setSyncResult(null);
      const res = await fetch('/api/xero/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`✅ Synced: ${data.data.invoicesSynced} invoices, ${data.data.contactsFound} contacts`);
        setLastSyncedAt(data.data.syncedAt);
      } else {
        setSyncResult(`❌ ${data.error}`);
      }
    } catch {
      setSyncResult('❌ Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <ExternalLink className="w-6 h-6 text-indigo-600" />
            </div>
            Xero Integration
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Connect your Xero account to sync invoices, contacts, and transactions into TradiePilot.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-800">Xero connected successfully!</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-800">
              {error === 'config' ? 'Xero integration not configured by admin.' :
               error === 'no-code' ? 'No authorisation code received from Xero.' :
               error === 'callback-failed' ? 'Failed to complete Xero connection.' :
               `Connection error: ${error}`}
            </p>
          </div>
        )}

        {syncResult && (
          <div className={`flex items-center gap-3 rounded-xl p-4 border ${
            syncResult.startsWith('✅') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            {syncResult.startsWith('✅') ? (
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <p className="text-sm">{syncResult}</p>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-slate-300'}`} />
              <span className="font-bold text-slate-900">
                {connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {connected ? (
              <button onClick={handleDisconnect}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Link2Off className="w-4 h-4" /> Disconnect
              </button>
            ) : (
              <button onClick={handleConnect}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                <Link2 className="w-4 h-4" /> Connect Xero
              </button>
            )}
          </div>

          {connected && (
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Connected since</span>
                <span className="font-medium text-slate-900">{formatDate(connectedAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Last synced</span>
                <span className="font-medium text-slate-900">{formatDate(lastSyncedAt)}</span>
              </div>
              <button onClick={handleSync} disabled={syncing}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors">
                {syncing ? <><Loader2 className="w-4 h-4 animate-spin" />Syncing...</> : <><RefreshCw className="w-4 h-4" />Sync Now</>}
              </button>
            </div>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">About Xero Integration</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Syncs invoices from Xero into TradiePilot for unified reporting</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Imports your customer contacts</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />Fetches bank transactions for cashflow analysis</li>
            <li className="flex items-start gap-2"><AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />Read-only access — TradiePilot never modifies your Xero data</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default function XeroSettingsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>}>
      <XeroSettingsContent />
    </Suspense>
  );
}

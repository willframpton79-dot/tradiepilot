'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, RefreshCw, ArrowRight, AlertTriangle, TrendingUp, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

interface Insight {
  type: 'warning' | 'opportunity' | 'action';
  title: string;
  body: string;
  action: string;
  link: string;
}

interface ProfitCoachProps {
  tier?: string;
  isAdmin?: boolean;
}

// Claude sometimes returns action as "[text](url)" — parse it out
function parseAction(action: string, link: string): { label: string; href: string } {
  const mdLink = action.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (mdLink) {
    return { label: mdLink[1], href: mdLink[2] || link || '/dashboard' };
  }
  return { label: action, href: link || '/dashboard' };
}

const borderColor = {
  warning: 'border-l-red-400',
  opportunity: 'border-l-emerald-400',
  action: 'border-l-indigo-400',
};

const badgeStyle = {
  warning: 'bg-red-50 text-red-600',
  opportunity: 'bg-emerald-50 text-emerald-700',
  action: 'bg-indigo-50 text-indigo-700',
};

const TypeIcon = ({ type }: { type: Insight['type'] }) => {
  if (type === 'warning') return <AlertTriangle className="w-3.5 h-3.5" />;
  if (type === 'opportunity') return <TrendingUp className="w-3.5 h-3.5" />;
  return <Zap className="w-3.5 h-3.5" />;
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 border-l-4 border-l-slate-200 animate-pulse">
      <div className="h-3 w-16 bg-slate-100 rounded mb-3" />
      <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-full bg-slate-100 rounded mb-1" />
      <div className="h-3 w-2/3 bg-slate-100 rounded mb-4" />
      <div className="h-7 w-28 bg-slate-100 rounded-lg" />
    </div>
  );
}

export default function ProfitCoach({ tier, isAdmin = false }: ProfitCoachProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isGated = !isAdmin && (tier === 'free' || tier === 'solo');
  const tierKnown = tier !== undefined;

  const fetchInsights = useCallback(async (refresh = false) => {
    if (isGated) return;
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ai/profit-coach${refresh ? '?refresh=true' : ''}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load insights');
      setInsights(Array.isArray(data.insights) ? data.insights : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isGated]);

  useEffect(() => {
    if (!tierKnown) return;
    if (!isGated) fetchInsights();
  }, [tierKnown, isGated, fetchInsights]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Profit Coach</h3>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Proactive insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Powered by AI</span>
          {!isGated && !loading && (
            <button
              onClick={() => fetchInsights(true)}
              disabled={refreshing}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all disabled:opacity-40"
              title="Refresh insights"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 relative">
        {/* Loading skeletons */}
        {(loading || (!tierKnown)) && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Gated state — blur + overlay */}
        {tierKnown && isGated && (
          <div className="relative">
            <div className="space-y-3 blur-sm pointer-events-none select-none">
              {[
                { title: 'Invoice overdue — chase now', body: 'A $12,400 invoice is 18 days overdue. Call the client directly.', type: 'warning' as const },
                { title: 'High-margin job type', body: 'Bathroom renos are running at 42% margin. Quote more of them.', type: 'opportunity' as const },
                { title: 'Quote going cold', body: 'A $28,000 quote has been out for 14 days without a follow-up.', type: 'action' as const },
              ].map((mock, i) => (
                <div key={i} className={`bg-white border border-slate-200 rounded-xl p-5 border-l-4 ${borderColor[mock.type]}`}>
                  <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${badgeStyle[mock.type]}`}>
                    <TypeIcon type={mock.type} /> {mock.type}
                  </div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{mock.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{mock.body}</p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-sm font-bold text-slate-900 text-center px-4">AI Profit Coach is a Pro feature</p>
              <p className="text-xs text-slate-500 mt-1 text-center px-6">Upgrade to see personalised insights from your real data</p>
              <Link
                href="/settings/billing"
                className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                Upgrade to Pro <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && !isGated && tierKnown && error && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400 mb-3">{error}</p>
            <button onClick={() => fetchInsights()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Try again
            </button>
          </div>
        )}

        {/* Insight cards */}
        {!loading && !isGated && tierKnown && !error && insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className={`bg-white border border-slate-200 rounded-xl p-5 border-l-4 ${borderColor[insight.type] || 'border-l-slate-200'}`}>
                <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${badgeStyle[insight.type] || 'bg-slate-50 text-slate-500'}`}>
                  <TypeIcon type={insight.type} /> {insight.type}
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">{insight.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{insight.body}</p>
                {(() => {
                  const { label, href } = parseAction(insight.action, insight.link);
                  return (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {label} <ArrowRight className="w-3 h-3" />
                    </Link>
                  );
                })()}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !isGated && tierKnown && !error && insights.length === 0 && (
          <div className="text-center py-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-slate-700">Looking good this week</p>
            <p className="text-xs text-slate-400 mt-1">No urgent actions — keep adding job data for sharper insights</p>
          </div>
        )}
      </div>
    </div>
  );
}

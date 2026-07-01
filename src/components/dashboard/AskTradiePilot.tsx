'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, X, Send, Trash2, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GREETING = "Ask me anything about your business — margins, quotes, invoices, what to focus on this week.";

export default function AskTradiePilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [usageRemaining, setUsageRemaining] = useState<number | null>(null);
  const [usageUsed, setUsageUsed] = useState(0);
  const [tier, setTier] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedUsage = useRef(false);

  const isGated = tier === 'free' || tier === 'solo';

  // Fetch tier and today's usage when panel first opens
  useEffect(() => {
    if (!isOpen || hasFetchedUsage.current) return;
    hasFetchedUsage.current = true;

    Promise.all([
      fetch('/api/settings').then(r => r.ok ? r.json() : ({} as Record<string, unknown>)),
      fetch('/api/ai/chat').then(r => r.ok ? r.json() : { remaining: 20, used: 0 }),
    ]).then(([settings, usage]) => {
      setTier((settings.tier as string) || 'free');
      setUsageRemaining(usage.remaining ?? 20);
      setUsageUsed(usage.used ?? 0);
    }).catch(() => {
      setTier('free');
      setUsageRemaining(20);
    });
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isGated) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isGated]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading || isGated) return;
    if (usageRemaining !== null && usageRemaining <= 0) return;

    const userMessage: Message = { role: 'user', content: text };
    const history = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory: history }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: err.error || 'Something went wrong. Try again.',
        }]);
        return;
      }

      // Update usage from headers
      const remaining = res.headers.get('X-Usage-Remaining');
      const used = res.headers.get('X-Usage-Used');
      if (remaining !== null) setUsageRemaining(parseInt(remaining));
      if (used !== null) setUsageUsed(parseInt(used));

      // Read the stream
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingContent(full);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: full }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Check your internet and try again.',
      }]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  }, [input, isLoading, isGated, messages, usageRemaining]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setStreamingContent('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-full shadow-xl shadow-indigo-300/40 transition-all hover:scale-105 active:scale-95"
      >
        <Sparkles className="w-4 h-4 fill-indigo-200/50" />
        <span className="text-sm hidden sm:inline">Ask TradiePilot</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-5 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 flex flex-col overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-indigo-700 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">Ask TradiePilot</span>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                  title="Clear conversation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Greeting */}
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3 h-3 text-indigo-600" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                <p className="text-xs text-slate-600 leading-relaxed">{GREETING}</p>
              </div>
            </div>

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                  </div>
                )}
                <div className={`px-3 py-2.5 rounded-2xl max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                    : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'
                }`}>
                  <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Streaming content */}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2.5 max-w-[85%]">
                  {streamingContent ? (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap text-slate-700">{streamingContent}</p>
                  ) : (
                    <div className="flex items-center gap-1 py-0.5">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t border-slate-100 px-3 py-3 bg-white">
            {isGated ? (
              <div className="text-center py-2">
                <p className="text-xs text-slate-500">
                  Upgrade to Pro to ask unlimited questions about your business
                </p>
                <a
                  href="/settings/billing"
                  className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Upgrade to Pro →
                </a>
              </div>
            ) : usageRemaining !== null && usageRemaining <= 0 ? (
              <div className="text-center py-2">
                <p className="text-xs text-slate-500">Daily limit reached. Resets at midnight UTC.</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  placeholder="Ask about your margins, quotes, jobs…"
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            {/* Usage counter */}
            {!isGated && usageRemaining !== null && (
              <p className="text-[10px] text-slate-300 text-right mt-1.5 pr-1">
                {usageUsed} / 20 messages today
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

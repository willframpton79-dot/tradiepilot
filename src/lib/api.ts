const API_BASE = '/api/data';

export interface FetchOptions {
  revalidate?: number;
}

async function fetchJSON<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    next: options?.revalidate ? { revalidate: options.revalidate } : undefined,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  getJobs: () => fetchJSON<any[]>('?type=jobs'),

  getQuotes: () => fetchJSON<any[]>('?type=quotes'),

  getInvoices: () => fetchJSON<any[]>('?type=invoices'),

  getDashboard: () => fetchJSON<any>('?type=dashboard'),

  getInsights: () => fetchJSON<any>('?type=insights'),

  getAlerts: () => fetchJSON<any>('?type=alerts'),

  /** GET /api/automation — run automation engine for current user */
  getAutomation: async (): Promise<any> => {
    const res = await fetch(`${API_BASE.replace('/data', '')}/automation`);
    if (!res.ok) throw new Error(`Automation API error: ${res.status}`);
    const json = await res.json();
    return json.data || json;
  },

  /** GET /api/automation/profit-leaks — profit leak analysis */
  getProfitLeaks: async (): Promise<any> => {
    const res = await fetch(`${API_BASE.replace('/data', '')}/automation/profit-leaks`);
    if (!res.ok) throw new Error(`Profit leaks API error: ${res.status}`);
    const json = await res.json();
    return json.data || json;
  },

  updateQuoteStatus: async (quoteId: string, status: string) => {
    const res = await fetch(`${API_BASE}/quotes/${quoteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  addReceipt: async (data: any) => {
    const res = await fetch(`${API_BASE}/receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  logTime: async (data: any) => {
    const res = await fetch(`${API_BASE}/time-entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  createQuote: async (data: any) => {
    const res = await fetch(`${API_BASE}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
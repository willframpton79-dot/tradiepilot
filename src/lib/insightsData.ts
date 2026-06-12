export interface ProfitAlert {
  id: string;
  type: 'critical' | 'warning' | 'insight' | 'info';
  category: string;
  severity: string;
  title: string;
  description: string;
  job_id: string;
  job_title: string;
  customer: string;
  recommendation: string;
  is_active: boolean;
}

export interface HotLead {
  id: string;
  customer_name: string;
  job_title: string;
  value_incl_gst: number;
  status: string;
  priority: string;
  lead_score: number;
  days_until_expiry: number | null;
}

export interface LTVCustomer {
  name: string;
  tier: string;
  total_revenue: number;
  job_count: number;
  avg_margin_pct: number;
  predicted_ltv: number;
}

export interface SuburbHotspot {
  suburb: string;
  tier: string;
  total_revenue: number;
  total_margin: number;
  avg_margin_pct: number;
  job_count: number;
  recommendation: string;
  postcode: string;
}

export interface MarketingTip {
  id: string;
  category: string;
  title: string;
  description: string;
  projected_roi: string;
  effort: string;
}

export interface GrowthForecast {
  current_monthly_runrate: number;
  projected_6mo_revenue: number;
  monthly_growth_rate_pct: number;
  forecast_months: Array<{
    month: string;
    base_revenue: number;
    weighted_total: number;
    cumulative_revenue: number;
  }>;
}

const insightsData: {
  profitAlerts: ProfitAlert[];
  hotLeads: HotLead[];
  customerLTV: LTVCustomer[];
  suburbHotspots: SuburbHotspot[];
  marketingTips: MarketingTip[];
  growthForecast: GrowthForecast;
} = {
  profitAlerts: [
    {
      id: 'alert_001',
      type: 'critical',
      category: 'cost_overrun',
      severity: 'high',
      title: 'North Sydney Retail job is 8% over budget',
      description: 'Structural issues in shopfront support required 24 hours of emergency welding and additional engineering sign-off, costing $14,200 more than quoted.',
      job_id: 'job_003',
      job_title: 'North Sydney Retail Refurbishment',
      customer: 'Pacific Retail Partners',
      recommendation: 'Review variation process with Pacific Retail Partners. Ensure structural inspections are completed prior to final quote on future refurbishments.',
      is_active: true,
    },
    {
      id: 'alert_002',
      type: 'warning',
      category: 'scope_creep_risk',
      severity: 'medium',
      title: 'Parramatta Warehouse extension has undocumented variations',
      description: 'Additional concrete pour for loading dock ramp ($5,400) has been completed but not yet added to contract value.',
      job_id: 'job_004',
      job_title: 'Parramatta Warehouse Extension',
      customer: 'NorthWest Build Co',
      recommendation: 'Issue variation notice to NorthWest Build Co immediately to lock in the additional revenue.',
      is_active: true,
    },
    {
      id: 'alert_003',
      type: 'insight',
      category: 'efficiency_gain',
      severity: 'low',
      title: 'Pyrmont Fit-Out tracking 4% ahead of margin target',
      description: 'Labour efficiency on partitioning phase was 15% better than estimated due to early delivery of materials.',
      job_id: 'job_001',
      job_title: 'Pyrmont Commercial Office Fit-Out',
      customer: 'Meridian Property Group',
      recommendation: 'Document the scheduling approach used here for future commercial fit-out projects.',
      is_active: true,
    },
  ],
  hotLeads: [
    {
      id: 'lead_001',
      customer_name: 'Meridian Property Group',
      job_title: 'Level 4 Lobby Refurbishment',
      value_incl_gst: 145000,
      status: 'sent',
      priority: 'high',
      lead_score: 92,
      days_until_expiry: 3,
    },
    {
      id: 'lead_002',
      customer_name: 'Apex Commercial Developments',
      job_title: 'Penthouse Balcony Remediation',
      value_incl_gst: 68000,
      status: 'followed-up',
      priority: 'medium',
      lead_score: 75,
      days_until_expiry: 14,
    },
    {
      id: 'lead_003',
      customer_name: 'NorthWest Build Co',
      job_title: 'Loading Dock Expansion',
      value_incl_gst: 112000,
      status: 'draft',
      priority: 'low',
      lead_score: 45,
      days_until_expiry: null,
    },
  ],
  customerLTV: [
    { name: 'Meridian Property Group', tier: 'Platinum', total_revenue: 450000, job_count: 3, avg_margin_pct: 38.5, predicted_ltv: 1200000 },
    { name: 'Apex Commercial Developments', tier: 'Gold', total_revenue: 340000, job_count: 1, avg_margin_pct: 38.0, predicted_ltv: 850000 },
    { name: 'NorthWest Build Co', tier: 'Gold', total_revenue: 210000, job_count: 1, avg_margin_pct: 51.0, predicted_ltv: 600000 },
    { name: 'HealthCare Realty Trust', tier: 'Silver', total_revenue: 128000, job_count: 1, avg_margin_pct: 34.0, predicted_ltv: 450000 },
    { name: 'Pacific Retail Partners', tier: 'Monitor', total_revenue: 92000, job_count: 1, avg_margin_pct: -8.0, predicted_ltv: 150000 },
  ],
  suburbHotspots: [
    { suburb: 'Pyrmont', tier: 'Prime', total_revenue: 185000, total_margin: 77700, avg_margin_pct: 42.0, job_count: 1, recommendation: 'Target commercial office fit-outs in heritage woolstores.', postcode: '2009' },
    { suburb: 'Parramatta', tier: 'Growth', total_revenue: 210000, total_margin: 107100, avg_margin_pct: 51.0, job_count: 1, recommendation: 'Focus on warehouse extensions and light industrial upgrades.', postcode: '2150' },
    { suburb: 'Surry Hills', tier: 'Prime', total_revenue: 340000, total_margin: 129200, avg_margin_pct: 38.0, job_count: 1, recommendation: 'High demand for high-end residential complex remediation.', postcode: '2010' },
    { suburb: 'North Sydney', tier: 'Monitor', total_revenue: 92000, total_margin: -7360, avg_margin_pct: -8.0, job_count: 1, recommendation: 'Review refurb pricing. Account for structural contingencies in older builds.', postcode: '2060' },
  ],
  marketingTips: [
    { id: 'mkt_001', category: 'referral', title: 'Partner with Commercial Real Estate Agents', description: 'Referrals from agents in Pyrmont and Surry Hills convert at 40%+ margins.', projected_roi: '5x ROI', effort: 'Medium' },
    { id: 'mkt_002', category: 'branding', title: 'Project Signage on Surry Hills Site', description: 'Surry Hills site has high foot traffic. Premium signage could generate residential lead inquiries.', projected_roi: '$50k+ potential', effort: 'Low' },
  ],
  growthForecast: {
    current_monthly_runrate: 185000,
    projected_6mo_revenue: 1250000,
    monthly_growth_rate_pct: 12.0,
    forecast_months: [
      { month: 'Jun 2026', base_revenue: 185000, weighted_total: 210000, cumulative_revenue: 210000 },
      { month: 'Jul 2026', base_revenue: 207200, weighted_total: 245000, cumulative_revenue: 455000 },
      { month: 'Aug 2026', base_revenue: 232064, weighted_total: 280000, cumulative_revenue: 735000 },
      { month: 'Sep 2026', base_revenue: 259911, weighted_total: 310000, cumulative_revenue: 1045000 },
      { month: 'Oct 2026', base_revenue: 291100, weighted_total: 340000, cumulative_revenue: 1385000 },
      { month: 'Nov 2026', base_revenue: 326032, weighted_total: 380000, cumulative_revenue: 1765000 },
    ],
  },
};

export default insightsData;

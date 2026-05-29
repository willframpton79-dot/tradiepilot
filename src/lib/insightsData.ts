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
      category: 'labour_rate_variance',
      severity: 'high',
      title: 'Labour rate exceeding quote assumption on Surry Hills CCTV job',
      description: 'Job 004 is billing at $121/hr but the quote assumed $110/hr. If remaining units follow the same pattern, total labour cost will reach $1,089 vs quoted $990.',
      job_id: 'job_004',
      job_title: 'CCTV Drain Inspection & Jetting — Strata Townhouses (x3)',
      customer: 'Thompson Realty Group',
      recommendation: 'Review the labour rate in the quote. Update quote template to reflect $121/hr.',
      is_active: true,
    },
    {
      id: 'alert_002',
      type: 'warning',
      category: 'scope_creep_risk',
      severity: 'medium',
      title: 'Phase 2 of commercial kitchen job has no approved scope',
      description: 'Job 005 Phase 2 repiping has no approved quote or change order. $1,880 unbilled and undocumented.',
      job_id: 'job_005',
      job_title: 'Commercial Kitchen — Grease Trap Maintenance & Repipe',
      customer: 'Green Leaf Cafe',
      recommendation: 'Prepare and send a detailed scope of work for Phase 2 repiping before any further work begins.',
      is_active: true,
    },
    {
      id: 'alert_003',
      type: 'insight',
      category: 'historical_loss',
      severity: 'medium',
      title: 'Job 002 lost 12.57% margin due to unforeseen corroded pipework',
      description: 'HWS replacement went $258.50 over budget. Corroded pipework required 4.5 extra hours and $420 in materials.',
      job_id: 'job_002',
      job_title: 'Hot Water System Replacement — 50L Electric (Cost Overrun)',
      customer: 'Michael Torres',
      recommendation: 'Add a "concealed conditions" clause to all HWS replacement quotes.',
      is_active: false,
    },
    {
      id: 'alert_004',
      type: 'info',
      category: 'cashflow_risk',
      severity: 'high',
      title: '$2,057 overdue for 63 days — Michael Torres HWS replacement',
      description: 'Invoice INV-2025-002 is 63 days overdue. Multiple reminders sent with no response.',
      job_id: 'job_002',
      job_title: 'Hot Water System Replacement — 50L Electric',
      customer: 'Michael Torres',
      recommendation: 'Escalate to formal debt collection. Send final notice with 7-day deadline.',
      is_active: true,
    },
  ],
  hotLeads: [
    {
      id: 'lead_001',
      customer_name: 'Thompson Realty Group',
      job_title: 'CCTV Drain Inspection & Jetting — Strata Townhouses (x3)',
      value_incl_gst: 4191,
      status: 'sent',
      priority: 'high',
      lead_score: 85,
      days_until_expiry: 1,
    },
    {
      id: 'lead_002',
      customer_name: "Liam O'Brien",
      job_title: 'Gas Line Installation — Outdoor BBQ Kitchen',
      value_incl_gst: 1754.50,
      status: 'draft',
      priority: 'medium',
      lead_score: 60,
      days_until_expiry: 13,
    },
    {
      id: 'lead_003',
      customer_name: 'Green Leaf Cafe',
      job_title: 'Commercial Kitchen Grease Trap Installation',
      value_incl_gst: 5973,
      status: 'rejected',
      priority: 'low',
      lead_score: 25,
      days_until_expiry: -7,
    },
  ],
  customerLTV: [
    { name: 'Emma & James Patterson', tier: 'Platinum', total_revenue: 7029, job_count: 1, avg_margin_pct: 46.14, predicted_ltv: 28000 },
    { name: 'Sarah Chen', tier: 'Gold', total_revenue: 2629, job_count: 1, avg_margin_pct: 68.12, predicted_ltv: 15000 },
    { name: 'Newtown Strata Corp', tier: 'Gold', total_revenue: 4850, job_count: 1, avg_margin_pct: 87.38, predicted_ltv: 22000 },
    { name: 'Bella Vista Cafe', tier: 'Gold', total_revenue: 8900, job_count: 1, avg_margin_pct: 82.13, predicted_ltv: 35000 },
    { name: 'Thompson Realty Group', tier: 'Silver', total_revenue: 4191, job_count: 1, avg_margin_pct: 87.4, predicted_ltv: 18000 },
    { name: 'Michael Torres', tier: 'Silver', total_revenue: 2057, job_count: 1, avg_margin_pct: -12.57, predicted_ltv: 5000 },
  ],
  suburbHotspots: [
    { suburb: 'Newtown', tier: 'Prime', total_revenue: 16379, total_margin: 11790.2, avg_margin_pct: 72.0, job_count: 3, recommendation: 'Focus marketing on inner-west strata and commercial kitchen maintenance.', postcode: '2042' },
    { suburb: 'Paddington', tier: 'Growth', total_revenue: 7029, total_margin: 3243.9, avg_margin_pct: 46.14, job_count: 1, recommendation: 'Target bathroom renovation referrals — high-value single-job customers.', postcode: '2021' },
    { suburb: 'Surry Hills', tier: 'Emerging', total_revenue: 4191, total_margin: 3662, avg_margin_pct: 87.4, job_count: 1, recommendation: 'Expand strata management outreach — high margin commercial work.', postcode: '2010' },
    { suburb: 'Glebe', tier: 'Monitor', total_revenue: 2057, total_margin: -258.5, avg_margin_pct: -12.57, job_count: 1, recommendation: 'Review pricing for HWS replacements. Consider contingency clauses.', postcode: '2037' },
  ],
  marketingTips: [
    { id: 'mkt_001', category: 'channel_effectiveness', title: 'Google Local Services Ads deliver 3x better ROI in inner-city suburbs', description: 'Jobs in Newtown and Paddington convert at 68%+ margin with minimal travel time.', projected_roi: '3x ROI', effort: 'Low' },
    { id: 'mkt_002', category: 'referral_program', title: 'Referral program targeting bathroom renovators', description: 'The $7,029 Patterson renovation came via word-of-mouth. A $100 Bunnings voucher could incentivise more.', projected_roi: '$7k+ repeat revenue', effort: 'Low' },
    { id: 'mkt_003', category: 'seasonal_marketing', title: 'Winter is peak season for HWS replacements', description: 'Electric HWS replacements average $2,057/job. Start campaign in April.', projected_roi: '$6k incremental', effort: 'Medium' },
    { id: 'mkt_004', category: 'commercial_outreach', title: 'Strata management outreach in Surry Hills', description: 'Thompson Realty quote ($4,191) shows commercial strata work has high value.', projected_roi: '$4k+ per property', effort: 'Medium' },
    { id: 'mkt_005', category: 'online_presence', title: 'Google Business Profile optimisation', description: 'Add before/after photos and respond to all reviews to increase local visibility.', projected_roi: '+40% visibility', effort: 'Low' },
    { id: 'mkt_006', category: 'customer_retention', title: 'Commercial maintenance contracts', description: 'Green Leaf Cafe generates $1,320/month. Signing 5 similar contracts would add $6,600/mo.', projected_roi: '$6.6k/mo', effort: 'High' },
  ],
  growthForecast: {
    current_monthly_runrate: 5500,
    projected_6mo_revenue: 62892.05,
    monthly_growth_rate_pct: 8.0,
    forecast_months: [
      { month: 'May 2025', base_revenue: 5500, weighted_total: 9897.25, cumulative_revenue: 9897.25 },
      { month: 'Jun 2025', base_revenue: 5940, weighted_total: 7618.80, cumulative_revenue: 17516.05 },
      { month: 'Jul 2025', base_revenue: 6415.20, weighted_total: 8025.80, cumulative_revenue: 25541.85 },
      { month: 'Aug 2025', base_revenue: 6928.42, weighted_total: 8450.00, cumulative_revenue: 33991.85 },
      { month: 'Sep 2025', base_revenue: 7482.69, weighted_total: 8892.00, cumulative_revenue: 42883.85 },
      { month: 'Oct 2025', base_revenue: 8081.31, weighted_total: 9355.00, cumulative_revenue: 52238.85 },
    ],
  },
};

export default insightsData;
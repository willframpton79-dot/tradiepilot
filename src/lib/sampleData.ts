export interface Job {
  id: string;
  name: string;
  client: string;
  budget: number;
  cost: number;
  profit: number;
  margin: number;
  status: 'on-track' | 'at-risk' | 'critical';
  progress: number;
  dueDate: string;
}

export interface Quote {
  id: string;
  client: string;
  job: string;
  amount: number;
  sentDate: string;
  daysSince: number;
  status: 'pending' | 'followed-up' | 'urgent' | 'won' | 'lost';
  followups: number;
  category: string;
}

export interface Invoice {
  id: string;
  job: string;
  client: string;
  amount: number;
  sentDate: string;
  dueDate: string;
  daysOverdue: number;
  status: 'pending' | 'overdue' | 'paid';
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

// --- New types for Job Detail View ---

export interface CostBreakdown {
  quoted: number;
  actual: number;
}

export interface TimeEntry {
  id: string;
  date: string;
  staff: string;
  hours: number;
  rate: number;
  cost: number;
  description: string;
}

export interface ReceiptEntry {
  id: string;
  date: string;
  item: string;
  supplier: string;
  cost: number;
  category: 'materials' | 'supplies' | 'equipment' | 'subcontractor';
}

export interface JobDetail {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  status: string;
  suburb: string;
  quotedTotal: number;
  actualTotal: number;
  margin: number;
  marginPct: number;
  quotedLabour: number;
  actualLabour: number;
  quotedMaterials: number;
  actualMaterials: number;
  quotedSubcontractors: number;
  actualSubcontractors: number;
  startDate: string;
  dueDate: string;
  overrunNotes?: string;
  timeLog: TimeEntry[];
  receiptLog: ReceiptEntry[];
}

// --- Sample Data ---

export const stats: StatCard[] = [
  {
    label: 'Average Job Margin',
    value: '31.4%',
    change: '+1.2% vs last month',
    changeType: 'positive',
  },
  {
    label: 'Quote Win Rate',
    value: '62.5%',
    change: '+4.1% vs last month',
    changeType: 'positive',
  },
  {
    label: 'Days Sales Outstanding',
    value: '22 days',
    change: '-2 days vs last month',
    changeType: 'positive',
  },
  {
    label: 'Revenue (MTD)',
    value: '$248,500',
    change: '+15.2% vs last month',
    changeType: 'positive',
  },
];

export const activeJobs: Job[] = [
  {
    id: 'job_001',
    name: 'Commercial Bathroom Fitout',
    client: 'Meridian Property Group',
    budget: 185000,
    cost: 107300,
    profit: 77700,
    margin: 42,
    status: 'on-track',
    progress: 65,
    dueDate: '20 Jun 2026',
  },
  {
    id: 'job_002',
    name: 'Office Electrical Upgrade',
    client: 'Apex Commercial Developments',
    budget: 340000,
    cost: 210800,
    profit: 129200,
    margin: 38,
    status: 'on-track',
    progress: 40,
    dueDate: '15 Aug 2026',
  },
  {
    id: 'job_003',
    name: 'Rooftop Terrace Construction',
    client: 'Pacific Retail Partners',
    budget: 92000,
    cost: 99360,
    profit: -7360,
    margin: -8,
    status: 'critical',
    progress: 90,
    dueDate: '5 Jun 2026',
  },
  {
    id: 'job_004',
    name: 'Commercial Landscaping',
    client: 'NorthWest Build Co',
    budget: 210000,
    cost: 102900,
    profit: 107100,
    margin: 51,
    status: 'on-track',
    progress: 25,
    dueDate: '10 Sep 2026',
  },
  {
    id: 'job_005',
    name: 'Industrial Roof Restoration',
    client: 'HealthCare Realty Trust',
    budget: 128000,
    cost: 84480,
    profit: 43520,
    margin: 34,
    status: 'on-track',
    progress: 55,
    dueDate: '12 Jul 2026',
  },
];

export const quotes: Quote[] = [
  {
    id: 'Q-101',
    client: 'Meridian Property Group',
    job: 'Commercial Bathroom Fitout',
    amount: 145000,
    sentDate: '28 May 2026',
    daysSince: 4,
    status: 'pending',
    followups: 0,
    category: 'Commercial',
  },
  {
    id: 'Q-102',
    client: 'Apex Commercial Developments',
    job: 'Office Electrical Upgrade',
    amount: 68000,
    sentDate: '15 May 2026',
    daysSince: 17,
    status: 'urgent',
    followups: 3,
    category: 'Remedial',
  },
  {
    id: 'Q-103',
    client: 'NorthWest Build Co',
    job: 'Rooftop Terrace Construction',
    amount: 112000,
    sentDate: '22 May 2026',
    daysSince: 10,
    status: 'followed-up',
    followups: 1,
    category: 'Industrial',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-201',
    job: 'Commercial Bathroom Fitout',
    client: 'Meridian Property Group',
    amount: 45000,
    sentDate: '10 May 2026',
    dueDate: '24 May 2026',
    daysOverdue: 8,
    status: 'overdue',
  },
  {
    id: 'INV-202',
    job: 'Industrial Roof Restoration',
    client: 'HealthCare Realty Trust',
    amount: 32000,
    sentDate: '25 May 2026',
    dueDate: '8 Jun 2026',
    daysOverdue: 0,
    status: 'pending',
  },
  {
    id: 'INV-203',
    job: 'Rooftop Terrace Construction',
    client: 'Pacific Retail Partners',
    amount: 12500,
    sentDate: '15 Apr 2026',
    dueDate: '29 Apr 2026',
    daysOverdue: 33,
    status: 'overdue',
  },
];

// --- Job Detail Data ---

export const jobDetails: Record<string, JobDetail> = {
  'job_001': {
    id: 'job_001',
    title: 'Commercial Bathroom Fitout',
    description: 'High-end office fit-out including custom workstations, boardroom integration, and kitchen breakout area.',
    client: {
      name: 'Meridian Property Group',
      phone: '02 9123 4567',
      email: 'projects@meridianpg.com.au',
      address: 'Level 12, 100 Harris St, Pyrmont NSW 2009',
    },
    status: 'active',
    suburb: 'Pyrmont',
    quotedTotal: 185000,
    actualTotal: 107300,
    margin: 77700,
    marginPct: 42,
    quotedLabour: 74000,
    actualLabour: 45000,
    quotedMaterials: 92500,
    actualMaterials: 52300,
    quotedSubcontractors: 18500,
    actualSubcontractors: 10000,
    startDate: '10 May 2026',
    dueDate: '20 Jun 2026',
    timeLog: [
      { id: 'TL-101', date: '12 May 2026', staff: 'Project Manager', hours: 8, rate: 120, cost: 960, description: 'Site setup and subcontractor induction' },
    ],
    receiptLog: [
      { id: 'RC-101', date: '15 May 2026', item: 'Structural Steel Frame', supplier: 'Metals Express', cost: 12500, category: 'materials' },
    ],
  },
  'job_002': {
    id: 'job_002',
    title: 'Office Electrical Upgrade',
    description: 'External remediation and internal common area upgrades for 24-unit complex.',
    client: {
      name: 'Apex Commercial Developments',
      phone: '02 8765 4321',
      email: 'ops@apexcommercial.com.au',
      address: '45 Foveaux St, Surry Hills NSW 2010',
    },
    status: 'active',
    suburb: 'Surry Hills',
    quotedTotal: 340000,
    actualTotal: 210800,
    margin: 129200,
    marginPct: 38,
    quotedLabour: 136000,
    actualLabour: 85000,
    quotedMaterials: 170000,
    actualMaterials: 110000,
    quotedSubcontractors: 34000,
    actualSubcontractors: 15800,
    startDate: '1 Apr 2026',
    dueDate: '15 Aug 2026',
    timeLog: [],
    receiptLog: [],
  },
  'job_003': {
    id: 'job_003',
    title: 'Rooftop Terrace Construction',
    description: 'Shopfront replacement and interior retail display upgrades.',
    client: {
      name: 'Pacific Retail Partners',
      phone: '02 9988 7766',
      email: 'maintenance@pacificretail.com.au',
      address: 'Shop 4, 101 Miller St, North Sydney NSW 2060',
    },
    status: 'active',
    suburb: 'North Sydney',
    quotedTotal: 92000,
    actualTotal: 99360,
    margin: -7360,
    marginPct: -8,
    quotedLabour: 36800,
    actualLabour: 42000,
    quotedMaterials: 46000,
    actualMaterials: 48500,
    quotedSubcontractors: 9200,
    actualSubcontractors: 8860,
    startDate: '1 May 2026',
    dueDate: '5 Jun 2026',
    overrunNotes: 'Unexpected structural issues found in shopfront support required 24 hours of emergency welding and additional engineering sign-off.',
    timeLog: [],
    receiptLog: [],
  },
  'job_004': {
    id: 'job_004',
    title: 'Commercial Landscaping',
    description: '200sqm extension to existing industrial warehouse including concrete slab and portal frame.',
    client: {
      name: 'NorthWest Build Co',
      phone: '02 9630 1122',
      email: 'tenders@northwestbuild.com.au',
      address: '15 James Ruse Dr, Parramatta NSW 2150',
    },
    status: 'active',
    suburb: 'Parramatta',
    quotedTotal: 210000,
    actualTotal: 102900,
    margin: 107100,
    marginPct: 51,
    quotedLabour: 84000,
    actualLabour: 40000,
    quotedMaterials: 105000,
    actualMaterials: 55000,
    quotedSubcontractors: 21000,
    actualSubcontractors: 7900,
    startDate: '20 May 2026',
    dueDate: '10 Sep 2026',
    timeLog: [],
    receiptLog: [],
  },
  'job_005': {
    id: 'job_005',
    title: 'Industrial Roof Restoration',
    description: 'Medical grade fit-out for private clinic including 4 consult rooms and sterile area.',
    client: {
      name: 'HealthCare Realty Trust',
      phone: '02 9411 2233',
      email: 'facilities@healthcarerealty.com.au',
      address: 'Level 2, 12 Help St, Chatswood NSW 2067',
    },
    status: 'active',
    suburb: 'Chatswood',
    quotedTotal: 128000,
    actualTotal: 84480,
    margin: 43520,
    marginPct: 34,
    quotedLabour: 51200,
    actualLabour: 32000,
    quotedMaterials: 64000,
    actualMaterials: 45000,
    quotedSubcontractors: 12800,
    actualSubcontractors: 7480,
    startDate: '15 May 2026',
    dueDate: '12 Jul 2026',
    timeLog: [],
    receiptLog: [],
  },
};

export function getJobDetail(id: string): JobDetail | undefined {
  return jobDetails[id];
}
export const sampleData = {
  stats,
  jobs: activeJobs,
  quotes,
  invoices,
  jobDetails
};

export default sampleData;

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
    value: '34.2%',
    change: '+2.1% vs last month',
    changeType: 'positive',
  },
  {
    label: 'Quote Win Rate',
    value: '68.5%',
    change: '+5.3% vs last month',
    changeType: 'positive',
  },
  {
    label: 'Days Sales Outstanding',
    value: '24 days',
    change: '-3 days vs last month',
    changeType: 'positive',
  },
  {
    label: 'Revenue (MTD)',
    value: '$84,200',
    change: '+12.8% vs last month',
    changeType: 'positive',
  },
];

export const activeJobs: Job[] = [
  {
    id: 'job_004',
    name: 'CCTV Drain Inspection & Jetting',
    client: 'Strata Corp — Newtown',
    budget: 4850,
    cost: 612,
    profit: 4238,
    margin: 87.4,
    status: 'on-track',
    progress: 30,
    dueDate: '15 Jun 2026',
  },
  {
    id: 'job_005',
    name: 'Grease Trap Maintenance',
    client: 'Bella Vista Cafe',
    budget: 8900,
    cost: 1590,
    profit: 7310,
    margin: 82.1,
    status: 'on-track',
    progress: 45,
    dueDate: '22 Jun 2026',
  },
  {
    id: 'job_002',
    name: 'HWS Replacement — Torres',
    client: 'Michael Torres',
    budget: 2057,
    cost: 2315,
    profit: -258,
    margin: -12.6,
    status: 'critical',
    progress: 100,
    dueDate: '6 Mar 2026',
  },
  {
    id: 'job_001',
    name: 'Burst Pipe Repair — Chen',
    client: 'Sarah Chen',
    budget: 2629,
    cost: 838,
    profit: 1791,
    margin: 68.1,
    status: 'on-track',
    progress: 100,
    dueDate: '14 Feb 2026',
  },
  {
    id: 'job_003',
    name: 'Bathroom Renovation — Patterson',
    client: 'Emma & James Patterson',
    budget: 7029,
    cost: 3785,
    profit: 3244,
    margin: 46.1,
    status: 'on-track',
    progress: 100,
    dueDate: '25 Mar 2026',
  },
];

export const quotes: Quote[] = [
  {
    id: 'Q-001',
    client: 'Wilson Family',
    job: 'Full House Paint',
    amount: 15800,
    sentDate: '10 May 2026',
    daysSince: 16,
    status: 'urgent',
    followups: 3,
    category: 'Painting',
  },
  {
    id: 'Q-002',
    client: 'Greenwood Cafe',
    job: 'Commercial Fitout',
    amount: 42000,
    sentDate: '14 May 2026',
    daysSince: 12,
    status: 'pending',
    followups: 1,
    category: 'Commercial',
  },
  {
    id: 'Q-003',
    client: 'Parkinson',
    job: 'Hot Water System',
    amount: 3800,
    sentDate: '18 May 2026',
    daysSince: 8,
    status: 'pending',
    followups: 0,
    category: 'Plumbing',
  },
  {
    id: 'Q-004',
    client: 'Roberts',
    job: 'Garden Shed Build',
    amount: 7200,
    sentDate: '20 May 2026',
    daysSince: 6,
    status: 'followed-up',
    followups: 2,
    category: 'Construction',
  },
  {
    id: 'Q-005',
    client: 'Henderson',
    job: 'Fence Replacement',
    amount: 5600,
    sentDate: '8 May 2026',
    daysSince: 18,
    status: 'urgent',
    followups: 4,
    category: 'Fencing',
  },
  {
    id: 'Q-006',
    client: 'St Vincent\'s Church',
    job: 'Restroom Plumbing Upgrade',
    amount: 24500,
    sentDate: '22 Apr 2026',
    daysSince: 34,
    status: 'won',
    followups: 2,
    category: 'Commercial',
  },
  {
    id: 'Q-007',
    client: 'Thompson',
    job: 'Gas Line Installation',
    amount: 4100,
    sentDate: '15 Apr 2026',
    daysSince: 41,
    status: 'lost',
    followups: 1,
    category: 'Gas',
  },
  {
    id: 'Q-008',
    client: 'Harbourside Apartments',
    job: 'Blocked Drain Investigation',
    amount: 9800,
    sentDate: '5 Apr 2026',
    daysSince: 51,
    status: 'won',
    followups: 3,
    category: 'Strata',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV-001',
    job: 'Kitchen Reno — Smith',
    client: 'Michael Smith',
    amount: 28700,
    sentDate: '12 May 2026',
    dueDate: '2 Jun 2026',
    daysOverdue: 0,
    status: 'pending',
  },
  {
    id: 'INV-002',
    job: 'Bathroom Demolition — Jones',
    client: 'Sarah Jones',
    amount: 15900,
    sentDate: '28 Apr 2026',
    dueDate: '19 May 2026',
    daysOverdue: 8,
    status: 'overdue',
  },
  {
    id: 'INV-003',
    job: 'Roof Repair — Williams',
    client: 'Tom Williams',
    amount: 10200,
    sentDate: '5 May 2026',
    dueDate: '26 May 2026',
    daysOverdue: 1,
    status: 'overdue',
  },
  {
    id: 'INV-004',
    job: 'Electrical Rewire — Davis',
    client: 'James Davis',
    amount: 24100,
    sentDate: '10 May 2026',
    dueDate: '31 May 2026',
    daysOverdue: 0,
    status: 'pending',
  },
  {
    id: 'INV-005',
    job: 'HWS Replacement — Torres',
    client: 'Michael Torres',
    amount: 2057,
    sentDate: '15 Mar 2026',
    dueDate: '5 Apr 2026',
    daysOverdue: 51,
    status: 'overdue',
  },
];

// --- Job Detail Data ---

export const jobDetails: Record<string, JobDetail> = {
  'job_001': {
    id: 'job_001',
    title: 'Burst Pipe Repair — Kitchen Hot Water Line',
    description: 'Emergency call-out for burst copper pipe under kitchen sink. Repaired damaged section, installed new isolation valves, and repaired plaster wall.',
    client: {
      name: 'Sarah Chen',
      phone: '0411 222 333',
      email: 'sarah.chen@email.com.au',
      address: '42 Wilson St, Newtown NSW 2042',
    },
    status: 'completed',
    suburb: 'Newtown',
    quotedTotal: 2629,
    actualTotal: 838.2,
    margin: 1790.8,
    marginPct: 68.12,
    quotedLabour: 880,
    actualLabour: 484,
    quotedMaterials: 1749,
    actualMaterials: 354.2,
    quotedSubcontractors: 0,
    actualSubcontractors: 0,
    startDate: '14 Feb 2025',
    dueDate: '14 Feb 2025',
    timeLog: [
      { id: 'TL-001', date: '14 Feb 2025', staff: 'Joe Tradie', hours: 2.5, rate: 110, cost: 275, description: 'Emergency call-out & assessment' },
      { id: 'TL-002', date: '14 Feb 2025', staff: 'Joe Tradie', hours: 1.0, rate: 110, cost: 110, description: 'Pipe repair & isolation valve install' },
      { id: 'TL-003', date: '14 Feb 2025', staff: 'Apprentice', hours: 0.9, rate: 110, cost: 99, description: 'Plaster repair assistance' },
    ],
    receiptLog: [
      { id: 'RC-001', date: '14 Feb 2025', item: 'Copper pipe 15mm x 1m', supplier: 'PlumbMart Newtown', cost: 24.50, category: 'materials' },
      { id: 'RC-002', date: '14 Feb 2025', item: 'Isolation valves x2', supplier: 'PlumbMart Newtown', cost: 38.00, category: 'materials' },
      { id: 'RC-003', date: '14 Feb 2025', item: 'Plaster repair kit', supplier: 'Bunnings Newtown', cost: 45.70, category: 'supplies' },
      { id: 'RC-004', date: '14 Feb 2025', item: 'Misc fittings & consumables', supplier: 'PlumbMart Newtown', cost: 246.00, category: 'materials' },
    ],
  },
  'job_002': {
    id: 'job_002',
    title: 'Hot Water System Replacement — 50L Electric',
    description: 'Replaced old Rheem electric HWS with new 50L unit. Discovered severely corroded pipework during installation — required additional labour and materials to cut out and replace affected copper lines.',
    client: {
      name: 'Michael Torres',
      phone: '0422 333 444',
      email: 'mike.torres@outlook.com',
      address: '15 Glebe Point Rd, Glebe NSW 2037',
    },
    status: 'completed',
    suburb: 'Glebe',
    quotedTotal: 2057,
    actualTotal: 2315.5,
    margin: -258.5,
    marginPct: -12.57,
    quotedLabour: 605,
    actualLabour: 1023,
    quotedMaterials: 1452,
    actualMaterials: 1292.5,
    quotedSubcontractors: 0,
    actualSubcontractors: 0,
    startDate: '5 Mar 2025',
    dueDate: '6 Mar 2025',
    overrunNotes: 'Corroded pipework found during install required 4.5 extra labour hours ($358.50) and $420 in additional copper pipe, fittings, and tooling. Could not have been identified before work began.',
    timeLog: [
      { id: 'TL-004', date: '5 Mar 2025', staff: 'Joe Tradie', hours: 4.0, rate: 110, cost: 440, description: 'HWS removal & replacement' },
      { id: 'TL-005', date: '5 Mar 2025', staff: 'Apprentice', hours: 2.0, rate: 110, cost: 220, description: 'Assist with HWS install' },
      { id: 'TL-006', date: '6 Mar 2025', staff: 'Joe Tradie', hours: 3.3, rate: 110, cost: 363, description: 'Cut out corroded pipework & replace' },
    ],
    receiptLog: [
      { id: 'RC-005', date: '5 Mar 2025', item: 'Rheem 50L Electric HWS', supplier: 'PlumbMart Glebe', cost: 825.00, category: 'materials' },
      { id: 'RC-006', date: '5 Mar 2025', item: 'T&P relief valve', supplier: 'PlumbMart Glebe', cost: 38.50, category: 'materials' },
      { id: 'RC-007', date: '5 Mar 2025', item: 'Flexible hoses & fittings', supplier: 'PlumbMart Glebe', cost: 94.00, category: 'materials' },
      { id: 'RC-008', date: '6 Mar 2025', item: 'Copper pipe & fittings (extra)', supplier: 'PlumbMart Glebe', cost: 285.00, category: 'materials' },
      { id: 'RC-009', date: '6 Mar 2025', item: 'Thread sealant & consumables', supplier: 'Bunnings Glebe', cost: 50.00, category: 'supplies' },
    ],
  },
  'job_003': {
    id: 'job_003',
    title: 'Full Bathroom Renovation — Plumbing Rough-In',
    description: 'Complete bathroom plumbing rough-in for renovation. Includes new vanity, toilet suite, shower mixer, and all waste pipework.',
    client: {
      name: 'Emma & James Patterson',
      phone: '0433 444 555',
      email: 'patterson.house@bigpond.com',
      address: '88 Oxford St, Paddington NSW 2021',
    },
    status: 'completed',
    suburb: 'Paddington',
    quotedTotal: 7029,
    actualTotal: 3785.1,
    margin: 3243.9,
    marginPct: 46.14,
    quotedLabour: 2310,
    actualLabour: 2084.5,
    quotedMaterials: 4719,
    actualMaterials: 1700.6,
    quotedSubcontractors: 0,
    actualSubcontractors: 0,
    startDate: '24 Mar 2025',
    dueDate: '25 Mar 2025',
    timeLog: [
      { id: 'TL-007', date: '24 Mar 2025', staff: 'Joe Tradie', hours: 8.0, rate: 110, cost: 880, description: 'Rough-in plumbing — waste pipework' },
      { id: 'TL-008', date: '24 Mar 2025', staff: 'Apprentice', hours: 6.5, rate: 110, cost: 715, description: 'Assist with rough-in' },
      { id: 'TL-009', date: '25 Mar 2025', staff: 'Joe Tradie', hours: 4.5, rate: 110, cost: 495, description: 'Fit vanity, toilet suite & shower mixer' },
    ],
    receiptLog: [
      { id: 'RC-010', date: '24 Mar 2025', item: 'PVC waste pipe & fittings', supplier: 'PlumbMart Paddington', cost: 345.00, category: 'materials' },
      { id: 'RC-011', date: '24 Mar 2025', item: 'Copper pipe & fittings', supplier: 'PlumbMart Paddington', cost: 289.50, category: 'materials' },
      { id: 'RC-012', date: '25 Mar 2025', item: 'Vanity waste kit', supplier: 'PlumbMart Paddington', cost: 68.00, category: 'materials' },
      { id: 'RC-013', date: '25 Mar 2025', item: 'Toilet suite connections', supplier: 'PlumbMart Paddington', cost: 124.10, category: 'materials' },
      { id: 'RC-014', date: '25 Mar 2025', item: 'Shower mixer & trim', supplier: 'Reece Plumbing', cost: 495.00, category: 'materials' },
      { id: 'RC-015', date: '25 Mar 2025', item: 'Thread tape & sealants', supplier: 'Bunnings Paddington', cost: 78.00, category: 'supplies' },
      { id: 'RC-016', date: '25 Mar 2025', item: 'Copper elbows & joiner x12', supplier: 'PlumbMart Paddington', cost: 301.00, category: 'materials' },
    ],
  },
  'job_004': {
    id: 'job_004',
    title: 'CCTV Drain Inspection & Jetting',
    description: 'Strata townhouse complex with blocked stormwater drains. Conducted CCTV inspection to locate blockage, followed by high-pressure jetting to clear roots and debris.',
    client: {
      name: 'Newtown Strata Corp',
      phone: '0400 111 222',
      email: 'manager@newtownstrata.com.au',
      address: '88 Wilson St, Newtown NSW 2042',
    },
    status: 'active',
    suburb: 'Newtown',
    quotedTotal: 4850,
    actualTotal: 612,
    margin: 4238,
    marginPct: 87.38,
    quotedLabour: 1650,
    actualLabour: 385,
    quotedMaterials: 450,
    actualMaterials: 227,
    quotedSubcontractors: 2750,
    actualSubcontractors: 0,
    startDate: '10 Jun 2025',
    dueDate: '15 Jun 2026',
    timeLog: [
      { id: 'TL-010', date: '10 Jun 2025', staff: 'Joe Tradie', hours: 3.5, rate: 110, cost: 385, description: 'CCTV inspection & jetting' },
    ],
    receiptLog: [
      { id: 'RC-017', date: '10 Jun 2025', item: 'Drain jetting nozzle', supplier: 'PlumbMart Newtown', cost: 129.00, category: 'equipment' },
      { id: 'RC-018', date: '10 Jun 2025', item: 'CCTV camera wand attachment', supplier: 'PlumbMart Newtown', cost: 98.00, category: 'equipment' },
    ],
  },
  'job_005': {
    id: 'job_005',
    title: 'Commercial Kitchen — Grease Trap Maintenance',
    description: 'Scheduled grease trap maintenance and repair at commercial kitchen. Includes cleaning, inspection, and replacement of worn baffle assembly.',
    client: {
      name: 'Bella Vista Cafe',
      phone: '0455 666 777',
      email: 'info@bellavistacafe.com.au',
      address: '55 King St, Newtown NSW 2042',
    },
    status: 'active',
    suburb: 'Newtown',
    quotedTotal: 8900,
    actualTotal: 1590,
    margin: 7310,
    marginPct: 82.13,
    quotedLabour: 3520,
    actualLabour: 1100,
    quotedMaterials: 980,
    actualMaterials: 490,
    quotedSubcontractors: 4400,
    actualSubcontractors: 0,
    startDate: '12 Jun 2025',
    dueDate: '22 Jun 2026',
    timeLog: [
      { id: 'TL-011', date: '12 Jun 2025', staff: 'Joe Tradie', hours: 6.0, rate: 110, cost: 660, description: 'Grease trap clean & inspection' },
      { id: 'TL-012', date: '12 Jun 2025', staff: 'Apprentice', hours: 4.0, rate: 110, cost: 440, description: 'Assist with cleaning & baffle replacement' },
    ],
    receiptLog: [
      { id: 'RC-019', date: '12 Jun 2025', item: 'Grease trap baffle assembly', supplier: 'PlumbMart Newtown', cost: 350.00, category: 'materials' },
      { id: 'RC-020', date: '12 Jun 2025', item: 'Gasket & seal kit', supplier: 'PlumbMart Newtown', cost: 89.00, category: 'materials' },
      { id: 'RC-021', date: '12 Jun 2025', item: 'Degreaser & cleaning chems', supplier: 'Bunnings Newtown', cost: 51.00, category: 'supplies' },
    ],
  },
};

export function getJobDetail(id: string): JobDetail | undefined {
  return jobDetails[id];
}
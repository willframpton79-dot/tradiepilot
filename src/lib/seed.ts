import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { Quote } from '@/models/Quote';
import { Invoice } from '@/models/Invoice';
import { Insight } from '@/models/Insight';
import sampleData from '@/lib/sampleData';
import fs from 'fs';
import path from 'path';

async function seed() {
  const start = Date.now();
  console.log('🌱 Seeding MongoDB with TradiePilot demo data...');
  await connectDB();

  // Read shared JSON files from the team directory
  const demoDataPath = '/home/team/shared/tradiepilo_demo_data.json';
  const insightsDataPath = '/home/team/shared/tradiepilo_insights.json';

  const rawDemoData = JSON.parse(fs.readFileSync(demoDataPath, 'utf-8'));
  const rawInsightsData = JSON.parse(fs.readFileSync(insightsDataPath, 'utf-8'));

  // 1. SEED JOBS from frontend sampleData (which matches the pages)
  console.log('\n📋 Seeding jobs...');
  await Job.deleteMany({});
  const jobEntries = Object.entries(sampleData.jobDetails).map(([jobId, job]: [string, any]) => ({
    jobId,
    title: job.title,
    description: job.description,
    client: {
      name: job.client.name,
      phone: job.client.phone || '',
      email: job.client.email || '',
      address: job.client.address || '',
    },
    status: job.status,
    suburb: job.suburb,
    quotedTotal: job.quotedTotal,
    actualTotal: job.actualTotal,
    margin: job.margin,
    marginPct: job.marginPct,
    quotedLabour: job.quotedLabour,
    actualLabour: job.actualLabour,
    quotedMaterials: job.quotedMaterials,
    actualMaterials: job.actualMaterials,
    quotedSubcontractors: job.quotedSubcontractors,
    actualSubcontractors: job.actualSubcontractors,
    startDate: job.startDate,
    dueDate: job.dueDate,
    overrunNotes: job.overrunNotes || '',
    timeLog: job.timeLog || [],
    receiptLog: job.receiptLog || [],
  }));
  const jobsResult = await Job.insertMany(jobEntries);
  console.log(`  ✅ ${jobsResult.length} jobs inserted`);

  // 2. SEED QUOTES from sampleData
  console.log('\n📋 Seeding quotes...');
  await Quote.deleteMany({});
  const quoteEntries = sampleData.quotes.map((q: any) => ({
    quoteId: q.id,
    quoteNumber: q.id,
    client: q.client,
    job: q.job,
    amount: q.amount,
    sentDate: q.sentDate,
    daysSince: q.daysSince,
    status: q.status,
    followups: q.followups,
    category: q.category,
  }));
  const quotesResult = await Quote.insertMany(quoteEntries);
  console.log(`  ✅ ${quotesResult.length} quotes inserted`);

  // 3. SEED INVOICES from sampleData
  console.log('\n📋 Seeding invoices...');
  await Invoice.deleteMany({});
  const invoiceEntries = sampleData.invoices.map((inv: any) => ({
    invoiceId: inv.id,
    invoiceNumber: inv.id,
    job: inv.job,
    client: inv.client,
    amount: inv.amount,
    sentDate: inv.sentDate,
    dueDate: inv.dueDate,
    daysOverdue: inv.daysOverdue,
    status: inv.status,
  }));
  const invoicesResult = await Invoice.insertMany(invoiceEntries);
  console.log(`  ✅ ${invoicesResult.length} invoices inserted`);

  // 4. SEED INSIGHTS from the rich JSON insights file
  console.log('\n📋 Seeding insights...');
  await Insight.deleteMany({});

  const insightSections: { section: string; data: any }[] = [
    { section: 'profit_alerts', data: rawInsightsData.profit_alerts },
    { section: 'quote_hot_leads', data: rawInsightsData.quote_hot_leads },
    { section: 'cashflow_forecast', data: rawInsightsData.cashflow_forecast },
    { section: 'efficiency_tips', data: rawInsightsData.efficiency_tips },
    { section: 'customer_ltv', data: rawInsightsData.customer_ltv },
    { section: 'suburb_hotspots', data: rawInsightsData.suburb_hotspots },
    { section: 'marketing_tips', data: rawInsightsData.marketing_tips },
    { section: 'growth_forecast', data: rawInsightsData.growth_forecast },
    { section: 'dashboard_metrics', data: rawInsightsData.dashboard_metrics },
  ];

  const insightsResult = await Insight.insertMany(insightSections);
  console.log(`  ✅ ${insightsResult.length} insight sections inserted`);

  const duration = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n🎉 Seeding complete in ${duration}s`);
  console.log(`   ${jobsResult.length} jobs | ${quotesResult.length} quotes | ${invoicesResult.length} invoices | ${insightsResult.length} insight sections`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
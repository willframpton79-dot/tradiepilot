import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = '/home/team/shared';

function readJSON(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';

  if (type === 'jobs') {
    const data = readJSON('tradiepilo_demo_data.json');
    return NextResponse.json(data?.jobs || []);
  }
  if (type === 'quotes') {
    const data = readJSON('tradiepilo_demo_data.json');
    return NextResponse.json(data?.quotes || []);
  }
  if (type === 'invoices') {
    const data = readJSON('tradiepilo_demo_data.json');
    return NextResponse.json(data?.invoices || []);
  }
  if (type === 'insights') {
    const data = readJSON('tradiepilo_insights.json');
    return NextResponse.json(data || {});
  }
  if (type === 'alerts') {
    const data = readJSON('tradiepilo_insights.json');
    return NextResponse.json(data?.profit_alerts || {});
  }
  if (type === 'dashboard') {
    const demo = readJSON('tradiepilo_demo_data.json');
    const insights = readJSON('tradiepilo_insights.json');
    return NextResponse.json({
      jobs: demo?.jobs || [],
      quotes: demo?.quotes || [],
      invoices: demo?.invoices || [],
      dashboard_summary: demo?.dashboard_summary || {},
      profit_alerts: insights?.profit_alerts || {},
      quote_hot_leads: insights?.quote_hot_leads || {},
      customer_ltv: insights?.customer_ltv || {},
      suburb_hotspots: insights?.suburb_hotspots || {},
      marketing_tips: insights?.marketing_tips || {},
      growth_forecast: insights?.growth_forecast || {},
    });
  }

  // Return all
  const demo = readJSON('tradiepilo_demo_data.json');
  const insights = readJSON('tradiepilo_insights.json');
  return NextResponse.json({ ...demo, ...insights });
}
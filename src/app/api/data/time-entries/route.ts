import { NextResponse } from 'next/server';
import fs from 'fs';

const DATA_FILE = '/home/team/shared/tradiepilo_demo_data.json';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);

    if (!data.labour_entries) data.labour_entries = [];

    const newEntry = {
      id: `tl_${Date.now()}`,
      job_id: body.job_id || 'unknown',
      staff: body.staff || '',
      hours: body.hours || 0,
      rate: body.rate || 110,
      cost: (body.hours || 0) * (body.rate || 110),
      description: body.description || '',
      date: new Date().toISOString().split('T')[0],
    };

    data.labour_entries.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, entry: newEntry });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
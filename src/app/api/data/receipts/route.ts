import { NextResponse } from 'next/server';
import fs from 'fs';

const DATA_FILE = '/home/team/shared/tradiepilo_demo_data.json';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);

    if (!data.material_purchases) data.material_purchases = [];

    const newEntry = {
      id: `rc_${Date.now()}`,
      job_id: body.job_id || 'unknown',
      item: body.item || '',
      supplier: body.supplier || '',
      cost: body.cost || 0,
      category: body.category || 'materials',
      date: new Date().toISOString().split('T')[0],
    };

    data.material_purchases.push(newEntry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, receipt: newEntry });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
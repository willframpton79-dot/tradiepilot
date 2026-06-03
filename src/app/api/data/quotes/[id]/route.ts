import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = '/home/team/shared/tradiepilo_demo_data.json';

interface QuoteUpdate {
  status?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body: QuoteUpdate = await request.json();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);

    const quotes = data.quotes || [];
    const idx = quotes.findIndex((q: any) => q.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (body.status) {
      quotes[idx].status = body.status;
    }

    data.quotes = quotes;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, quote: quotes[idx] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Staff } from '@/models/Staff';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    await connectDB();
    const staff = await Staff.find({ userEmail }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('GET /api/settings/team error:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const body = await req.json();
    await connectDB();
    
    const staff = await Staff.create({
      ...body,
      userEmail,
    });
    
    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('POST /api/settings/team error:', error);
    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}

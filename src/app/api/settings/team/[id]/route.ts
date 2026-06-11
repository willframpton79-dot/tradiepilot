import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Staff } from '@/models/Staff';
import { requireAuth } from '@/lib/session';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    
    const staff = await Staff.findOneAndUpdate(
      { _id: id, userEmail },
      body,
      { new: true }
    );
    
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }
    
    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('PUT /api/settings/team/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    const { id } = await params;
    await connectDB();
    
    const staff = await Staff.findOneAndDelete({ _id: id, userEmail });
    
    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Staff deleted' });
  } catch (error: any) {
    console.error('DELETE /api/settings/team/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}

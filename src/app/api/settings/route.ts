import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { isAdminEmail } from '@/lib/session';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select('-password');
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const data = user.toObject ? user.toObject() : { ...user };
  if (isAdminEmail(data.email)) {
    data.tier = 'enterprise';
    data.isAdmin = true;
  }
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  await connectDB();

  // Allow updating specific fields
  const allowedFields = [
    'name', 
    'businessName', 
    'tradeType', 
    'state', 
    'staffCount', 
    'targetMargin',
    'gstRegistered',
    'basPeriod',
    'taxRate',
    'notifications',
    'emailPreferences',
    'alertThresholds'
  ];

  const updateData: any = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    session.user.id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

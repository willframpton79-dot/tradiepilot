import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;

    await connectDB();

    const { businessName, industry, userRole, jobManagementTool, targetMargin } = await req.json();

    const updateFields: Record<string, unknown> = {
      onboardingComplete: true,
    };

    if (businessName) updateFields.businessName = businessName;
    if (industry) updateFields.tradeType = industry;
    if (userRole) updateFields.userRole = userRole;
    if (jobManagementTool !== undefined) updateFields.jobManagementTool = jobManagementTool;
    if (typeof targetMargin === 'number') updateFields.targetMargin = targetMargin;

    await User.findOneAndUpdate({ email: userEmail }, { $set: updateFields });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/onboarding/complete error:', error);
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}

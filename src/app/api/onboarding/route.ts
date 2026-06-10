import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const {
      businessName,
      tradeType,
      state,
      staffCount,
      targetMargin,
      onboardingComplete = true,
    } = await req.json().catch(() => ({}));

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        businessName,
        tradeType,
        state,
        staffCount,
        targetMargin: typeof targetMargin === 'number' ? targetMargin : parseFloat(targetMargin || '0'),
        onboardingComplete: !!onboardingComplete,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        tier: updatedUser.tier,
        businessName: updatedUser.businessName,
        tradeType: updatedUser.tradeType,
        state: updatedUser.state,
        staffCount: updatedUser.staffCount,
        targetMargin: updatedUser.targetMargin,
        onboardingComplete: updatedUser.onboardingComplete,
      },
    });
  } catch (error: any) {
    console.error('Onboarding API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email }).lean() as any;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        tier: user.tier,
        businessName: user.businessName,
        tradeType: user.tradeType,
        state: user.state,
        staffCount: user.staffCount,
        targetMargin: user.targetMargin,
        onboardingComplete: user.onboardingComplete,
      },
    });
  } catch (error: any) {
    console.error('Onboarding GET API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

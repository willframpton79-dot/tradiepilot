import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth } from '@/lib/session';

export async function POST() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;
    await connectDB();

    await User.findOneAndUpdate(
      { email: userEmail },
      {
        $unset: {
          xeroAccessToken: '',
          xeroRefreshToken: '',
          xeroTenantId: '',
          xeroConnectedAt: '',
          xeroLastSyncedAt: '',
        },
        $set: { xeroTokenExpiresAt: 0 },
      }
    );

    return NextResponse.json({ success: true, message: 'Xero disconnected successfully' });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to disconnect Xero' }, { status: 500 });
  }
}
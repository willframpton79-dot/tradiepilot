import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth } from '@/lib/session';

export async function GET() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;
    await connectDB();

    const user = await User.findOne({ email: userEmail }).select(
      'xeroAccessToken xeroTenantId xeroConnectedAt xeroLastSyncedAt xeroTokenExpiresAt'
    );

    if (!user?.xeroAccessToken || !user?.xeroTenantId) {
      return NextResponse.json({
        connected: false,
        connectedAt: null,
        lastSyncedAt: null,
      });
    }

    const isExpired = user.xeroTokenExpiresAt && Date.now() > user.xeroTokenExpiresAt;

    return NextResponse.json({
      connected: true,
      connectedAt: user.xeroConnectedAt || null,
      lastSyncedAt: user.xeroLastSyncedAt || null,
      tokenExpired: !!isExpired,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to check Xero status' }, { status: 500 });
  }
}
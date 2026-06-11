import { NextRequest, NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL('/login?error=xero-auth', req.url));
    }

    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(new URL('/settings/xero?error=config', req.url));
    }

    const xero = new XeroClient({
      clientId,
      clientSecret,
      redirectUris: [redirectUri],
      scopes: ['openid', 'profile', 'email', 'accounting.transactions.read', 'accounting.contacts.read', 'offline_access'],
    });

    // Build the full callback URL from the incoming request
    const callbackUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}${req.nextUrl.pathname}${req.nextUrl.search}`;

    // Exchange auth code for tokens
    const tokenSet = await xero.apiCallback(callbackUrl);
    xero.setTokenSet(tokenSet);

    // Get tenant ID from the tenants list
    const tenants = xero.tenants;
    const tenantId = tenants?.[0]?.tenantId || '';
    const expiresAt = (tokenSet as any).expiresAt;

    console.log('[Xero Callback] Tenant:', tenantId, 'User:', session.user.email);

    // Save tokens to user record
    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          xeroAccessToken: JSON.stringify(tokenSet.accessToken),
          xeroRefreshToken: JSON.stringify(tokenSet.refreshToken),
          xeroTenantId: tenantId,
          xeroTokenExpiresAt: expiresAt ? new Date(expiresAt).getTime() : 0,
          xeroConnectedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.redirect(new URL('/settings/xero?success=connected', req.url));
  } catch (error: any) {
    console.error('[Xero Callback] Error:', error);
    return NextResponse.redirect(new URL('/settings/xero?error=callback-failed', req.url));
  }
}
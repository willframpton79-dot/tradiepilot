import { NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';

export async function GET() {
  try {
    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Xero integration not configured. Set XERO_CLIENT_ID, XERO_CLIENT_SECRET, and XERO_REDIRECT_URI.' },
        { status: 500 }
      );
    }

    const xero = new XeroClient({
      clientId,
      clientSecret,
      redirectUris: [redirectUri],
      scopes: ['openid', 'profile', 'email', 'accounting.invoices.read', 'accounting.contacts.read', 'accounting.banktransactions.read', 'offline_access'],
    });

    const consentUrl = await xero.buildConsentUrl();
    console.log('[Xero Connect] Redirecting to Xero consent');
    return NextResponse.redirect(consentUrl);
  } catch (error: any) {
    console.error('[Xero Connect] Error:', error);
    return NextResponse.json({ error: 'Failed to initiate Xero connection' }, { status: 500 });
  }
}

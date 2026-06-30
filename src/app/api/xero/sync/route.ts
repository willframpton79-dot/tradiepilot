import { NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Invoice } from '@/models/Invoice';
import { requireAuth } from '@/lib/session';
import { encryptToken, decryptToken } from '@/lib/crypto';

function parseToken(token: any): string {
  if (!token) return '';
  if (typeof token === 'string') {
    try { return typeof JSON.parse(token) === 'string' ? JSON.parse(token) : token; } catch { return token; }
  }
  return String(token);
}

export async function POST() {
  try {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;
    const userEmail = auth.email;
    await connectDB();

    const user = await User.findOne({ email: userEmail });
    if (!user?.xeroAccessToken || !user?.xeroTenantId) {
      return NextResponse.json({ error: 'Xero not connected. Connect in Settings first.' }, { status: 400 });
    }

    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json({ error: 'Xero integration not configured' }, { status: 500 });
    }

    const xero = new XeroClient({
      clientId,
      clientSecret,
      redirectUris: [redirectUri],
      scopes: ['openid', 'profile', 'email', 'accounting.transactions.read', 'accounting.contacts.read', 'offline_access'],
    });

    // Set tokens using the public setTokenSet method
    const accessToken = parseToken(decryptToken(user.xeroAccessToken));
    const refreshToken = parseToken(decryptToken(user.xeroRefreshToken));
    const expiresAt = user.xeroTokenExpiresAt || 0;

    xero.setTokenSet({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt ? String(Math.floor(expiresAt / 1000)) : undefined,
    } as any);

    // Try to refresh if token is close to expiry
    if (expiresAt && Date.now() > expiresAt - 300000) {
      try {
        const newTokenSet = await xero.refreshToken();
        const newExpiresAt = (newTokenSet as any).expiresAt;
        await User.findOneAndUpdate(
          { email: userEmail },
          {
            xeroAccessToken: encryptToken(JSON.stringify(newTokenSet.accessToken)),
            xeroRefreshToken: encryptToken(JSON.stringify(newTokenSet.refreshToken)),
            xeroTokenExpiresAt: newExpiresAt ? new Date(newExpiresAt).getTime() : 0,
          }
        );
      } catch (refreshErr) {
        console.error('[Xero Sync] Token refresh failed:', refreshErr);
        return NextResponse.json({ error: 'Xero session expired. Reconnect in Settings.' }, { status: 401 });
      }
    }

    const tenantId = user.xeroTenantId;

    // ─── Fetch Invoices from Xero ──────────────────────────────────
    let xeroInvoices: any[] = [];
    try {
      const invResp = await xero.accountingApi.getInvoices(tenantId);
      xeroInvoices = invResp.body.invoices || [];
    } catch (err) {
      console.error('[Xero Sync] Failed to fetch invoices:', err);
    }

    let syncedInvoices = 0;
    for (const xInv of xeroInvoices) {
      const amount = parseFloat(xInv.total || 0);
      const amountIncGst = amount;
      const amountExGst = amount / 1.1;
      const gstAmount = amount - amountExGst;

      let tpStatus: string = 'pending';
      if (xInv.status === 'PAID' || xInv.amountDue === 0) tpStatus = 'paid';
      else if (xInv.status === 'OVERDUE' || xInv.amountDue > 0) tpStatus = 'overdue';

      await Invoice.findOneAndUpdate(
        { invoiceId: `xero_${xInv.invoiceID}`, userEmail },
        {
          userEmail,
          invoiceId: `xero_${xInv.invoiceID}`,
          invoiceNumber: xInv.invoiceNumber || '',
          job: xInv.reference || 'Xero Import',
          client: xInv.contact?.name || 'Unknown',
          amount,
          amountExGst: Math.round(amountExGst * 100) / 100,
          amountIncGst,
          gstAmount: Math.round(gstAmount * 100) / 100,
          sentDate: xInv.dateString || xInv.date || '',
          dueDate: xInv.dueDateString || xInv.dueDate || '',
          daysOverdue: xInv.daysOverdue || 0,
          status: tpStatus,
          paidDate: xInv.fullyPaidOnDate || null,
        },
        { upsert: true, new: true }
      );
      syncedInvoices++;
    }

    // ─── Fetch Contacts from Xero ──────────────────────────────────
    let xeroContacts: any[] = [];
    try {
      const contactsResp = await xero.accountingApi.getContacts(tenantId);
      xeroContacts = contactsResp.body.contacts || [];
    } catch (err) {
      console.error('[Xero Sync] Failed to fetch contacts:', err);
    }

    // ─── Fetch Bank Transactions ───────────────────────────────────
    let syncedTransactions = 0;
    try {
      const txnsResp = await xero.accountingApi.getBankTransactions(tenantId);
      const bankTxns = txnsResp.body.bankTransactions || [];
      syncedTransactions = bankTxns.length;
    } catch (err) {
      console.error('[Xero Sync] Failed to fetch bank transactions:', err);
    }

    // Update last synced timestamp
    await User.findOneAndUpdate(
      { email: userEmail },
      { xeroLastSyncedAt: new Date().toISOString() }
    );

    return NextResponse.json({
      success: true,
      message: 'Xero sync completed',
      data: {
        invoicesSynced: syncedInvoices,
        contactsFound: xeroContacts.length,
        transactionsFound: syncedTransactions,
        syncedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Xero Sync] Error:', error);
    return NextResponse.json({ error: 'Xero sync failed' }, { status: 500 });
  }
}
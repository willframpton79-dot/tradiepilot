import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { NextResponse } from 'next/server';

export function isAdminEmail(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!(adminEmail && email.toLowerCase() === adminEmail.toLowerCase());
}

export async function getSessionEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function requireAuth(): Promise<{ email: string } | NextResponse> {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  return { email };
}

export async function requireAdmin(): Promise<{ email: string } | NextResponse> {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }
  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return { email };
}

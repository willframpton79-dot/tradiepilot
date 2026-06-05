import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { NextResponse } from 'next/server';

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

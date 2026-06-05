import { auth } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function getSessionEmail(): Promise<string | null> {
  const session = await auth();
  return session?.user?.email || null;
}

export async function requireAuth(): Promise<string> {
  const email = await getSessionEmail();
  if (!email) {
    throw new Error('Unauthorized');
  }
  return email;
}
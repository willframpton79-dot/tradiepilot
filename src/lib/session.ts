import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function getSessionEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email || null;
}

export async function requireAuth(): Promise<string> {
  const email = await getSessionEmail();
  if (!email) {
    throw new Error('Unauthorized');
  }
  return email;
}
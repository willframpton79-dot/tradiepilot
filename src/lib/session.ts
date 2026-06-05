import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';

export async function getSessionEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

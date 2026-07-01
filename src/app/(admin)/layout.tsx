import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!session?.user?.email || !adminEmail || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}

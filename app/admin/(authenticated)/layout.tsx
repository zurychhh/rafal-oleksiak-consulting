import { redirect } from 'next/navigation';
import { getSession, getToken } from '@/lib/blog/session';
import { getMe } from '@/lib/blog/admin-api';
import { AdminShell } from './AdminShell';

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/admin');

  const token = (await getToken())!;

  let user;
  try {
    user = await getMe(token);
  } catch {
    redirect('/admin');
  }

  return (
    <AdminShell user={user} token={token}>
      {children}
    </AdminShell>
  );
}

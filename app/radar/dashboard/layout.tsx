import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/radar/auth/session';
import DashboardShell from './DashboardShell';

export default async function RadarDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('radar_session')?.value;

  if (!sessionToken) {
    redirect('/radar/login');
  }

  const user = await validateSession(sessionToken);

  if (!user) {
    redirect('/radar/login');
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}

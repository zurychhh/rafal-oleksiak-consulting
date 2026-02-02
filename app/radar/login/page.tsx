import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/radar/auth/session';
import LoginClient from './LoginClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — RADAR Dashboard | Oleksiak Consulting',
  description: 'Sign in to your RADAR Competitive Intelligence dashboard.',
};

export default async function RadarLoginPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('radar_session')?.value;

  if (sessionToken) {
    const user = await validateSession(sessionToken);
    if (user) redirect('/radar/dashboard');
  }

  return <LoginClient />;
}

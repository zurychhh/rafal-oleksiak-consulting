import { getToken } from '@/lib/blog/session';
import { getSchedules, getAgents } from '@/lib/blog/admin-api';
import { redirect } from 'next/navigation';
import { SchedulesClient } from './SchedulesClient';

export default async function SchedulesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const token = await getToken();
  if (!token) redirect('/admin');

  let schedules, agents;
  try {
    [schedules, agents] = await Promise.all([
      getSchedules(token),
      getAgents(token),
    ]);
  } catch {
    redirect('/admin');
  }

  return (
    <SchedulesClient
      initialSchedules={schedules}
      agents={agents}
      projectSlug={projectId}
      token={token}
    />
  );
}

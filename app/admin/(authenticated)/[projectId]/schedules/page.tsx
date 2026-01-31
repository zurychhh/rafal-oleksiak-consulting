import { getToken } from '@/lib/blog/session';
import { getSchedules, getAgents, getTenants } from '@/lib/blog/admin-api';
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

  let schedules, agents, tenants;
  try {
    [schedules, agents, tenants] = await Promise.all([
      getSchedules(token),
      getAgents(token),
      getTenants(token),
    ]);
  } catch {
    redirect('/admin');
  }

  // Find current tenant by slug and filter agents/schedules to this project
  const tenant = tenants.find((t) => t.slug === projectId);
  if (tenant) {
    const tenantAgentIds = new Set(
      agents.filter((a) => a.tenant_id === tenant.id).map((a) => a.id),
    );
    agents = agents.filter((a) => tenantAgentIds.has(a.id));
    schedules = {
      ...schedules,
      items: schedules.items.filter((s) => tenantAgentIds.has(s.agent_id)),
      total: schedules.items.filter((s) => tenantAgentIds.has(s.agent_id)).length,
    };
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

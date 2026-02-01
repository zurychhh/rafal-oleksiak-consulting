import { getToken } from '@/lib/blog/session';
import { getPosts, getAgents, getTenants, getSchedules, getScheduleStats, getTenantUsage } from '@/lib/blog/admin-api';
import { redirect } from 'next/navigation';
import { OverviewClient } from './OverviewClient';

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const token = await getToken();
  if (!token) redirect('/admin');

  let posts, agents, tenants, schedules, scheduleStats;
  try {
    [posts, agents, tenants, schedules, scheduleStats] = await Promise.all([
      getPosts(token, 1, 5),
      getAgents(token),
      getTenants(token),
      getSchedules(token),
      getScheduleStats(token),
    ]);
  } catch {
    redirect('/admin');
  }

  // Find current tenant by slug
  const tenant = tenants.find((t) => t.slug === projectId);
  if (!tenant) redirect('/admin/dashboard');

  // Filter data to this tenant
  const tenantAgentIds = new Set(
    agents.filter((a) => a.tenant_id === tenant.id).map((a) => a.id),
  );

  const filteredPosts = posts.items.filter((p) => tenantAgentIds.has(p.agent_id));
  const filteredAgents = agents.filter((a) => tenantAgentIds.has(a.id));
  const filteredSchedules = schedules.items.filter((s) => tenantAgentIds.has(s.agent_id));

  // Fetch usage data
  let usage = null;
  try {
    usage = await getTenantUsage(token, tenant.id);
  } catch {
    // usage may not be available
  }

  return (
    <OverviewClient
      posts={filteredPosts}
      agents={filteredAgents}
      schedules={filteredSchedules}
      scheduleStats={scheduleStats}
      tenant={tenant}
      usage={usage}
      projectSlug={projectId}
      token={token}
    />
  );
}

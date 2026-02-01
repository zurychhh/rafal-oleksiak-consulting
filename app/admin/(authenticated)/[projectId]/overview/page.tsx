import { getToken } from '@/lib/blog/session';
import { getPosts, getAgents, getTenants, getSchedules, getTenantUsage } from '@/lib/blog/admin-api';
import { redirect } from 'next/navigation';
import { OverviewClient } from './OverviewClient';
import type { ScheduleStats } from '@/lib/blog/types';

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const token = await getToken();
  if (!token) redirect('/admin');

  let posts, agents, tenants, schedules;
  try {
    [posts, agents, tenants, schedules] = await Promise.all([
      getPosts(token, 1, 200),
      getAgents(token),
      getTenants(token),
      getSchedules(token),
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

  // Compute tenant-specific schedule stats from filtered data
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const publishedPosts = filteredPosts.filter((p) => p.status === 'published');
  const postsLast7Days = publishedPosts.filter(
    (p) => p.published_at && new Date(p.published_at) >= sevenDaysAgo,
  ).length;
  const postsLast30Days = publishedPosts.filter(
    (p) => p.published_at && new Date(p.published_at) >= thirtyDaysAgo,
  ).length;

  const totalGenerated = filteredSchedules.reduce((s, sch) => s + sch.total_posts_generated, 0);
  const successfulPosts = filteredSchedules.reduce((s, sch) => s + sch.successful_posts, 0);
  const failedPosts = filteredSchedules.reduce((s, sch) => s + sch.failed_posts, 0);

  const tenantScheduleStats: ScheduleStats = {
    total_schedules: filteredSchedules.length,
    active_schedules: filteredSchedules.filter((s) => s.is_active).length,
    total_posts_generated: totalGenerated,
    successful_posts: successfulPosts,
    failed_posts: failedPosts,
    success_rate: totalGenerated > 0 ? (successfulPosts / totalGenerated) * 100 : 0,
    posts_last_7_days: postsLast7Days,
    posts_last_30_days: postsLast30Days,
    upcoming_posts: [],
  };

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
      scheduleStats={tenantScheduleStats}
      tenant={tenant}
      usage={usage}
      projectSlug={projectId}
      token={token}
    />
  );
}

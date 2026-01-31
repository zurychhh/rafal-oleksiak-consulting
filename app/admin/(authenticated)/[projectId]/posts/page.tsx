import { getToken } from '@/lib/blog/session';
import { getPosts, getAgents, getTenants } from '@/lib/blog/admin-api';
import { redirect } from 'next/navigation';
import { PostsClient } from './PostsClient';

export default async function PostsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const token = await getToken();
  if (!token) redirect('/admin');

  let posts, agents, tenants;
  try {
    [posts, agents, tenants] = await Promise.all([
      getPosts(token),
      getAgents(token),
      getTenants(token),
    ]);
  } catch {
    redirect('/admin');
  }

  // Find current tenant by slug and filter agents/posts to this project
  const tenant = tenants.find((t) => t.slug === projectId);
  if (tenant) {
    const tenantAgentIds = new Set(
      agents.filter((a) => a.tenant_id === tenant.id).map((a) => a.id),
    );
    agents = agents.filter((a) => tenantAgentIds.has(a.id));
    posts = {
      ...posts,
      items: posts.items.filter((p) => tenantAgentIds.has(p.agent_id)),
      total: posts.items.filter((p) => tenantAgentIds.has(p.agent_id)).length,
    };
  }

  return (
    <PostsClient
      initialPosts={posts}
      agents={agents}
      projectSlug={projectId}
      token={token}
    />
  );
}

import { getToken } from '@/lib/blog/session';
import { getPosts, getAgents } from '@/lib/blog/admin-api';
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

  let posts, agents;
  try {
    [posts, agents] = await Promise.all([
      getPosts(token),
      getAgents(token),
    ]);
  } catch {
    redirect('/admin');
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

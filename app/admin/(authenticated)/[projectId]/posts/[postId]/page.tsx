import { getToken } from '@/lib/blog/session';
import { getPost } from '@/lib/blog/admin-api';
import { redirect } from 'next/navigation';
import { PostEditorClient } from './PostEditorClient';

export default async function PostEditorPage({
  params,
}: {
  params: Promise<{ projectId: string; postId: string }>;
}) {
  const { projectId, postId } = await params;
  const token = await getToken();
  if (!token) redirect('/admin');

  let post;
  try {
    post = await getPost(token, postId);
  } catch {
    redirect(`/admin/${projectId}/posts`);
  }

  return (
    <PostEditorClient
      post={post}
      projectSlug={projectId}
      token={token}
    />
  );
}

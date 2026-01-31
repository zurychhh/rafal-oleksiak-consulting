import type { PostListResponse, PostResponse } from './types';

const API_URL = process.env.BLOG_API_URL || process.env.NEXT_PUBLIC_BLOG_API_URL;
const AGENT_ID = process.env.NEXT_PUBLIC_BLOG_AGENT_ID;

export async function getPosts(page = 1, pageSize = 20): Promise<PostListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (AGENT_ID) params.set('agent_id', AGENT_ID);

  const res = await fetch(`${API_URL}/public/posts?${params}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return { items: [], total: 0, page: 1, page_size: pageSize, total_pages: 0 };
  return res.json();
}

export async function getFeaturedPosts(limit = 3): Promise<PostResponse[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (AGENT_ID) params.set('agent_id', AGENT_ID);

  const res = await fetch(`${API_URL}/public/posts/featured?${params}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];
  return res.json();
}

export async function getPostBySlug(slug: string): Promise<PostResponse | null> {
  const res = await fetch(`${API_URL}/public/posts/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

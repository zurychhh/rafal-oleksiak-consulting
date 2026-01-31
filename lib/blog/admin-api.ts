import type {
  PostResponse,
  PostListResponse,
  TenantResponse,
  TenantUsageResponse,
  AgentResponse,
  ScheduleResponse,
  ScheduleListResponse,
  ScheduleStats,
  UserResponse,
} from './types';

const API_URL = process.env.BLOG_API_URL || process.env.NEXT_PUBLIC_BLOG_API_URL;

async function adminFetch<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export function getMe(token: string) {
  return adminFetch<UserResponse>('/auth/me', token);
}

// Tenants
export function getTenants(token: string) {
  return adminFetch<TenantResponse[]>('/tenants', token);
}

export function getMyTenant(token: string) {
  return adminFetch<TenantResponse>('/tenants/me', token);
}

export function getTenantUsage(token: string, tenantId: string) {
  return adminFetch<TenantUsageResponse>(`/tenants/${tenantId}/usage`, token);
}

// Agents
export function getAgents(token: string) {
  return adminFetch<AgentResponse[]>('/agents', token);
}

export function getAgent(token: string, agentId: string) {
  return adminFetch<AgentResponse>(`/agents/${agentId}`, token);
}

// Posts
export function getPosts(token: string, page = 1, pageSize = 50, status?: string) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (status) params.set('status', status);
  return adminFetch<PostListResponse>(`/posts?${params}`, token);
}

export function getPost(token: string, postId: string) {
  return adminFetch<PostResponse>(`/posts/${postId}`, token);
}

export function createPost(token: string, data: {
  agent_id: string;
  title: string;
  content: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}) {
  return adminFetch<PostResponse>('/posts', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function formatPost(token: string, data: { content: string; title: string }) {
  return adminFetch<{ formatted_content: string }>('/posts/format', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function generatePost(token: string, data: {
  agent_id: string;
  topic: string;
  target_keyword: string;
}) {
  return adminFetch<PostResponse>('/posts/generate', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updatePost(token: string, postId: string, data: Partial<{
  title: string;
  content: string;
  status: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
}>) {
  return adminFetch<PostResponse>(`/posts/${postId}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deletePost(token: string, postId: string) {
  return adminFetch<void>(`/posts/${postId}`, token, { method: 'DELETE' });
}

// Schedules
export function getSchedules(token: string) {
  return adminFetch<ScheduleListResponse>('/schedules', token);
}

export function getScheduleStats(token: string) {
  return adminFetch<ScheduleStats>('/schedules/stats', token);
}

export function createSchedule(token: string, data: {
  agent_id: string;
  interval: string;
  publish_hour: number;
  timezone?: string;
  auto_publish?: boolean;
  target_keywords?: string[];
  exclude_keywords?: string[];
  post_length?: string;
  is_active?: boolean;
}) {
  return adminFetch<ScheduleResponse>('/schedules', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSchedule(token: string, scheduleId: string, data: Partial<{
  interval: string;
  publish_hour: number;
  timezone: string;
  auto_publish: boolean;
  target_keywords: string[];
  exclude_keywords: string[];
  post_length: string;
  is_active: boolean;
}>) {
  return adminFetch<ScheduleResponse>(`/schedules/${scheduleId}`, token, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteSchedule(token: string, scheduleId: string) {
  return adminFetch<void>(`/schedules/${scheduleId}`, token, { method: 'DELETE' });
}

export function toggleSchedule(token: string, scheduleId: string) {
  return adminFetch<ScheduleResponse>(`/schedules/${scheduleId}/toggle`, token, {
    method: 'POST',
  });
}

export function runSchedule(token: string, scheduleId: string) {
  return adminFetch<{ success: boolean; message: string; task_id?: string }>(
    `/schedules/${scheduleId}/run`,
    token,
    { method: 'POST' },
  );
}

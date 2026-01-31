export interface PostResponse {
  id: string;
  agent_id: string;
  publisher_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string[];
  schema_markup: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  readability_score: number | null;
  keyword_density: number | null;
  word_count: number;
  status: 'draft' | 'published' | 'scheduled';
  scheduled_at: string | null;
  published_at: string | null;
  published_url: string | null;
  source_urls: string[];
  tokens_used: number;
  created_at: string;
  updated_at: string;
}

export interface PostListResponse {
  items: PostResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  tokens_limit: number;
  tokens_used: number;
  posts_limit: number;
  posts_used: number;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TenantUsageResponse {
  tenant_id: string;
  tokens_used: number;
  tokens_limit: number;
  tokens_percentage: number;
  posts_used: number;
  posts_limit: number;
  posts_percentage: number;
}

export interface UserResponse {
  id: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
  tenant_id: string | null;
  is_active: boolean;
}

export interface AgentResponse {
  id: string;
  tenant_id: string;
  name: string;
  expertise: string;
  persona: string | null;
  tone: string;
  post_length: string;
  schedule_cron: string | null;
  workflow: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ScheduleResponse {
  id: string;
  agent_id: string;
  interval: 'daily' | 'every_3_days' | 'weekly' | 'biweekly';
  interval_display: string;
  publish_hour: number;
  timezone: string;
  cron_expression: string;
  is_active: boolean;
  auto_publish: boolean;
  target_keywords: string[];
  exclude_keywords: string[];
  post_length: string;
  last_run_at: string | null;
  next_run_at: string | null;
  total_posts_generated: number;
  successful_posts: number;
  failed_posts: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleListResponse {
  items: ScheduleResponse[];
  total: number;
}

export interface ScheduleStats {
  total_schedules: number;
  active_schedules: number;
  total_posts_generated: number;
  successful_posts: number;
  failed_posts: number;
  success_rate: number;
  posts_last_7_days: number;
  posts_last_30_days: number;
  upcoming_posts: unknown[];
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface JWTPayload {
  sub: string;
  tenant_id: string | null;
  role: 'superadmin' | 'admin' | 'editor';
  exp: number;
}

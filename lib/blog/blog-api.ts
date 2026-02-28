import type { PostListResponse, PostResponse } from './types';

const API_URL = process.env.BLOG_API_URL || process.env.NEXT_PUBLIC_BLOG_API_URL;
const AGENT_ID = process.env.NEXT_PUBLIC_BLOG_AGENT_ID || '2519697e-bb93-47c8-a0bc-f1115e128d88';

// Off-topic keywords — posts containing ONLY these terms (and none of the allowed ones) are rejected.
// Defense-in-depth: even if agent_id matches, obviously off-topic content won't appear on the blog.
const OFF_TOPIC_KEYWORDS = [
  'prawo pracy', 'kodeks pracy', 'zwolnienie dyscyplinarne', 'prawo karne',
  'terroryzm', 'sankcje', 'podatki', 'pit', 'skala podatkowa', 'e-pit',
  'pieszy', 'piesi', 'mieszkalnictwo', 'samorząd', 'mundurowy', 'karta rodziny',
  'paramount', 'skydance',
];

const ON_TOPIC_KEYWORDS = [
  'ecommerce', 'e-commerce', 'crm', 'marketing', 'seo', 'konwersja', 'conversion',
  'sprzedaż', 'sales', 'koszyk', 'cart', 'checkout', 'automatyzacja', 'automation',
  'analityka', 'analytics', 'reklama', 'ads', 'google ads', 'meta ads', 'facebook',
  'instagram', 'linkedin', 'email marketing', 'newsletter', 'hubspot', 'shopify',
  'woocommerce', 'magento', 'prestashop', 'roi', 'kpi', 'ux', 'ui', 'landing page',
  'lead', 'funnel', 'retargeting', 'remarketing', 'campaign', 'kampania',
  'personalizacja', 'personalization', 'a/b test', 'ab test', 'customer journey',
  'omnichannel', 'b2b', 'b2c', 'content marketing', 'social media', 'branding',
  'digital', 'growth', 'marketplace', 'dropshipping', 'fulfillment',
];

function isOffTopic(post: PostResponse): boolean {
  const text = [
    post.title,
    post.excerpt,
    ...(post.keywords || []),
  ].join(' ').toLowerCase();

  const hasOnTopic = ON_TOPIC_KEYWORDS.some((kw) => text.includes(kw));
  if (hasOnTopic) return false;

  const hasOffTopic = OFF_TOPIC_KEYWORDS.some((kw) => text.includes(kw));
  return hasOffTopic;
}

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
  const post: PostResponse = await res.json();

  // Reject posts from other agents/tenants
  if (AGENT_ID && post.agent_id !== AGENT_ID) {
    return null;
  }

  // Reject obviously off-topic content
  if (isOffTopic(post)) {
    return null;
  }

  return post;
}

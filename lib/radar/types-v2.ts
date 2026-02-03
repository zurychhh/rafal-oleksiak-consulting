// RADAR 2.0 - Enhanced Type Definitions
// Free-first competitive intelligence with real data

// ============================================
// Provider Response Types
// ============================================

export interface ProviderResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  cached?: boolean;
}

export interface SerperResult {
  organicResults: SerperOrganicResult[];
  peopleAlsoAsk: string[];
  relatedSearches: string[];
  searchParameters: {
    q: string;
    num: number;
  };
}

export interface SerperOrganicResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  sitelinks?: { title: string; link: string }[];
}

export interface PageSpeedResult {
  score: number;
  metrics: {
    lcp: number;  // Largest Contentful Paint (ms)
    fid: number;  // First Input Delay (ms)
    cls: number;  // Cumulative Layout Shift
    fcp: number;  // First Contentful Paint (ms)
    ttfb: number; // Time to First Byte (ms)
  };
  recommendations: string[];
}

export interface SitemapResult {
  totalPages: number;
  blogPosts: number;
  products: number;
  categories: string[];
  lastUpdated: string | null;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'unknown';
  blockedPaths: string[];
  sitemapUrls: string[];
}

export interface SchemaOrgResult {
  type: string | null;
  name: string | null;
  description: string | null;
  logo: string | null;
  foundingDate: string | null;
  employees: string | null;
  priceRange: string | null;
  aggregateRating: { value: number; count: number } | null;
  products: SchemaProduct[];
  socialProfiles: string[];
  contactInfo: {
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export interface SchemaProduct {
  name: string;
  price: string | null;
  currency: string | null;
  availability: string | null;
  rating: number | null;
  reviewCount: number | null;
}

export interface TechStackResult {
  cms: string | null;
  framework: string | null;
  analytics: string[];
  marketing: string[];
  cdn: string | null;
  hosting: string | null;
  ecommerce: string | null;
  other: string[];
}

export interface HeadersResult {
  server: string | null;
  poweredBy: string | null;
  cacheControl: string | null;
  contentType: string | null;
  security: {
    hsts: boolean;
    xFrameOptions: string | null;
    xContentTypeOptions: boolean;
    csp: boolean;
  };
  performance: {
    compression: string | null;
    http2: boolean;
  };
}

export interface ContentResult {
  wordCount: number;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  internalLinks: number;
  externalLinks: number;
  images: number;
  imagesWithAlt: number;
  hasBlog: boolean;
  hasPricing: boolean;
  hasSocialProof: boolean;
  ctaCount: number;
  metaTitle: string;
  metaDescription: string;
}

// ============================================
// Aggregated Intelligence Types
// ============================================

export interface SeoIntelligence {
  organicVisibility: number;
  topKeywords: SerpKeyword[];
  serpFeatures: string[];
  peopleAlsoAsk: string[];
  relatedSearches: string[];
  estimatedTraffic: 'low' | 'medium' | 'high' | 'very_high';
  queriesUsed?: number; // Track Serper API usage
}

export interface SerpKeyword {
  keyword: string;
  position: number;
  title: string;
  snippet: string;
}

export interface PerformanceIntelligence {
  mobileScore: number;
  desktopScore: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  recommendations: string[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface BusinessIntelligence {
  name: string | null;
  type: string | null;
  foundingDate: string | null;
  employees: string | null;
  priceRange: string | null;
  aggregateRating: { value: number; count: number } | null;
  products: SchemaProduct[];
  socialProfiles: string[];
  contactInfo: {
    email: string | null;
    phone: string | null;
    address: string | null;
  };
}

export interface StructureIntelligence {
  totalPages: number;
  blogPosts: number;
  products: number;
  categories: string[];
  lastUpdated: string | null;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'unknown';
  contentFreshness: 'fresh' | 'moderate' | 'stale' | 'unknown';
}

export interface TechIntelligence {
  cms: string | null;
  framework: string | null;
  analytics: string[];
  marketing: string[];
  cdn: string | null;
  hosting: string | null;
  ecommerce: string | null;
  security: {
    ssl: boolean;
    hsts: boolean;
    securityHeaders: number;
  };
}

export interface ContentIntelligence {
  wordCount: number;
  headingStructure: string[];
  internalLinks: number;
  externalLinks: number;
  imageOptimization: number;
  hasBlog: boolean;
  hasPricing: boolean;
  socialProof: boolean;
  ctaPresence: 'none' | 'weak' | 'strong';
}

// ============================================
// Opportunity Types
// ============================================

export interface Opportunity {
  type: 'seo' | 'content' | 'technical' | 'market';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: 'low' | 'medium' | 'high';
  steps: string[];
}

export interface ActionItemV2 {
  title: string;
  description: string;
  priority: number; // 1-5
  category: 'seo' | 'content' | 'technical' | 'marketing' | 'security';
}

export interface AiInsights {
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  threatLevel: 'low' | 'medium' | 'high';
  opportunities: Opportunity[];
  keywordGaps: string[];
  contentIdeas: string[];
  quickWins: string[];
  actionItems: ActionItemV2[];
}

// ============================================
// Main Report Types
// ============================================

export interface CompetitorIntelV2 {
  url: string;
  domain: string;
  analyzedAt: string;

  // All fields nullable - some providers may fail
  seo: SeoIntelligence | null;
  performance: PerformanceIntelligence | null;
  structure: StructureIntelligence | null;
  business: BusinessIntelligence | null;
  tech: TechIntelligence | null;
  content: ContentIntelligence | null;

  // Raw data tracking
  rawData: {
    htmlFetched: boolean;
    headersAnalyzed: boolean;
    schemaFound: boolean;
    sitemapFound: boolean;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
  };
}

export interface RadarReportV2 {
  id: string;
  createdAt: string;

  // Your site data
  yourSite: CompetitorIntelV2;

  // Competitor data
  competitors: CompetitorIntelV2[];

  // Overall analysis
  overallPosition: 'leading' | 'competitive' | 'catching_up' | 'behind';

  // Provider stats
  providerSummary: Record<string, {
    success: number;
    failed: number;
    avgMs: number;
  }>;

  // API usage tracking
  serperQueriesUsed: number;

  // AI insights (added by opportunity-finder)
  aiInsights: AiInsights | null;
}

// ============================================
// Legacy Types (for compatibility)
// ============================================

export interface ActionItemLegacy {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'seo' | 'content' | 'technical' | 'marketing' | 'product';
  title: string;
  description: string;
  estimatedImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps?: string[];
}

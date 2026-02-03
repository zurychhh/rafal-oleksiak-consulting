// RADAR 2.0 - Serper.dev Provider
// Free tier: 2,500 queries/month
// Docs: https://serper.dev/

import type { SerperResult, ProviderResult, SeoIntelligence, SerpKeyword } from '../types-v2';

const SERPER_API_KEY = process.env.SERPER_API_KEY || '';
const SERPER_ENDPOINT = 'https://google.serper.dev/search';

interface SerperApiResponse {
  organic?: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
    sitelinks?: { title: string; link: string }[];
  }>;
  peopleAlsoAsk?: Array<{
    question: string;
    snippet?: string;
    link?: string;
  }>;
  relatedSearches?: Array<{
    query: string;
  }>;
  searchParameters?: {
    q: string;
    num?: number;
  };
}

/**
 * Search Google via Serper API
 */
export async function searchGoogle(
  query: string,
  options: { num?: number; gl?: string; hl?: string } = {}
): Promise<ProviderResult<SerperResult>> {
  if (!SERPER_API_KEY) {
    return {
      success: false,
      error: 'SERPER_API_KEY not configured',
    };
  }

  try {
    const response = await fetch(SERPER_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: options.num || 10,
        gl: options.gl || 'pl', // Poland by default
        hl: options.hl || 'pl',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Serper API error: ${response.status} - ${errorText}`,
      };
    }

    const data: SerperApiResponse = await response.json();

    return {
      success: true,
      data: {
        organicResults: (data.organic || []).map((r) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
          position: r.position,
          sitelinks: r.sitelinks,
        })),
        peopleAlsoAsk: (data.peopleAlsoAsk || []).map((p) => p.question),
        relatedSearches: (data.relatedSearches || []).map((r) => r.query),
        searchParameters: {
          q: data.searchParameters?.q || query,
          num: data.searchParameters?.num || options.num || 10,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Serper request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get site's organic presence in Google
 * Uses site:domain.com query to find indexed pages
 */
export async function getSitePresence(domain: string): Promise<ProviderResult<SerperResult>> {
  // Clean domain
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  return searchGoogle(`site:${cleanDomain}`, { num: 10 });
}

/**
 * Get competitor's top organic keywords
 * Searches for the domain and extracts keywords from snippets
 */
export async function getCompetitorKeywords(
  domain: string,
  industry?: string
): Promise<ProviderResult<SerpKeyword[]>> {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];

  // Search for the site
  const siteResult = await searchGoogle(`site:${cleanDomain}`, { num: 20 });

  if (!siteResult.success || !siteResult.data) {
    return { success: false, error: siteResult.error };
  }

  // Extract keywords from titles and snippets
  const keywords: SerpKeyword[] = siteResult.data.organicResults.map((r) => ({
    keyword: extractMainKeyword(r.title),
    position: r.position,
    title: r.title,
    snippet: r.snippet,
  }));

  return { success: true, data: keywords };
}

/**
 * Compare two domains' SERP presence
 */
export async function compareDomains(
  yourDomain: string,
  competitorDomain: string,
  keywords: string[] = []
): Promise<ProviderResult<{
  yourPresence: number;
  competitorPresence: number;
  keywordComparison: Array<{
    keyword: string;
    yourPosition: number | null;
    competitorPosition: number | null;
  }>;
}>> {
  const yourClean = yourDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  const compClean = competitorDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];

  // Get both site presences
  const [yourResult, compResult] = await Promise.all([
    searchGoogle(`site:${yourClean}`, { num: 10 }),
    searchGoogle(`site:${compClean}`, { num: 10 }),
  ]);

  if (!yourResult.success || !compResult.success) {
    return {
      success: false,
      error: yourResult.error || compResult.error,
    };
  }

  return {
    success: true,
    data: {
      yourPresence: yourResult.data?.organicResults.length || 0,
      competitorPresence: compResult.data?.organicResults.length || 0,
      keywordComparison: [], // Would need additional queries per keyword
    },
  };
}

/**
 * Get "People Also Ask" questions for a topic
 */
export async function getPeopleAlsoAsk(topic: string): Promise<ProviderResult<string[]>> {
  const result = await searchGoogle(topic, { num: 10 });

  if (!result.success || !result.data) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    data: result.data.peopleAlsoAsk,
  };
}

/**
 * Get related searches for keyword ideas
 */
export async function getRelatedSearches(keyword: string): Promise<ProviderResult<string[]>> {
  const result = await searchGoogle(keyword, { num: 10 });

  if (!result.success || !result.data) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    data: result.data.relatedSearches,
  };
}

/**
 * Build full SEO intelligence for a domain
 */
export async function buildSeoIntelligence(
  domain: string,
  industry?: string
): Promise<ProviderResult<SeoIntelligence>> {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];

  // Get site presence
  const siteResult = await getSitePresence(cleanDomain);

  if (!siteResult.success || !siteResult.data) {
    return {
      success: false,
      error: siteResult.error || 'Failed to get site presence',
    };
  }

  const organicResults = siteResult.data.organicResults;

  // Calculate organic visibility (0-100)
  // Based on number of indexed pages found in top 10
  const organicVisibility = Math.min(100, organicResults.length * 10);

  // Extract keywords
  const topKeywords: SerpKeyword[] = organicResults.slice(0, 10).map((r, i) => ({
    keyword: extractMainKeyword(r.title),
    position: i + 1,
    title: r.title,
    snippet: r.snippet,
  }));

  // Estimate traffic based on presence
  let estimatedTraffic: 'low' | 'medium' | 'high' | 'very_high' = 'low';
  if (organicResults.length >= 8) estimatedTraffic = 'very_high';
  else if (organicResults.length >= 5) estimatedTraffic = 'high';
  else if (organicResults.length >= 2) estimatedTraffic = 'medium';

  // Detect SERP features (simplified)
  const serpFeatures: string[] = [];
  for (const result of organicResults) {
    if (result.sitelinks && result.sitelinks.length > 0) {
      if (!serpFeatures.includes('Sitelinks')) serpFeatures.push('Sitelinks');
    }
  }

  return {
    success: true,
    data: {
      organicVisibility,
      topKeywords,
      serpFeatures,
      peopleAlsoAsk: siteResult.data.peopleAlsoAsk,
      relatedSearches: siteResult.data.relatedSearches,
      estimatedTraffic,
    },
  };
}

/**
 * Extract main keyword from a title
 */
function extractMainKeyword(title: string): string {
  // Remove common suffixes like "| Company Name" or "- Brand"
  const cleaned = title
    .split(/[|\-–—]/)[0]
    .trim()
    .toLowerCase();

  // Take first 5-6 words as the main keyword phrase
  const words = cleaned.split(/\s+/).slice(0, 6);
  return words.join(' ');
}

/**
 * Check if Serper API is configured
 */
export function isSerperConfigured(): boolean {
  return !!SERPER_API_KEY;
}

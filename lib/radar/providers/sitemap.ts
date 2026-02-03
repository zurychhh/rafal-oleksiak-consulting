// RADAR 2.0 - Sitemap & robots.txt Provider
// Free, unlimited - parses public XML sitemaps

import type { SitemapResult, ProviderResult, StructureIntelligence } from '../types-v2';

const USER_AGENT = 'RADAR-Bot/2.0 (+https://oleksiakconsulting.com)';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

/**
 * Fetch and parse robots.txt
 */
export async function fetchRobotsTxt(
  domain: string
): Promise<ProviderResult<{ sitemapUrls: string[]; blockedPaths: string[]; raw: string }>> {
  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    const robotsUrl = `https://${cleanDomain}/robots.txt`;

    const response = await fetch(robotsUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        success: true,
        data: { sitemapUrls: [], blockedPaths: [], raw: '' },
      };
    }

    const text = await response.text();

    // Extract sitemap URLs
    const sitemapUrls: string[] = [];
    const sitemapMatches = text.matchAll(/Sitemap:\s*(.+)/gi);
    for (const match of sitemapMatches) {
      sitemapUrls.push(match[1].trim());
    }

    // Extract blocked paths (Disallow directives)
    const blockedPaths: string[] = [];
    const disallowMatches = text.matchAll(/Disallow:\s*(.+)/gi);
    for (const match of disallowMatches) {
      const path = match[1].trim();
      if (path && path !== '/') {
        blockedPaths.push(path);
      }
    }

    return {
      success: true,
      data: { sitemapUrls, blockedPaths, raw: text },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch robots.txt: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Fetch and parse a sitemap XML
 */
export async function fetchSitemap(
  sitemapUrl: string
): Promise<ProviderResult<SitemapUrl[]>> {
  try {
    const response = await fetch(sitemapUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Sitemap returned ${response.status}`,
      };
    }

    const xml = await response.text();

    // Check if this is a sitemap index (contains other sitemaps)
    if (xml.includes('<sitemapindex')) {
      const indexUrls: string[] = [];
      const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/gi);
      for (const match of locMatches) {
        indexUrls.push(match[1].trim());
      }

      // Fetch first few sub-sitemaps (limit to avoid too many requests)
      const allUrls: SitemapUrl[] = [];
      const subSitemaps = indexUrls.slice(0, 3); // Max 3 sub-sitemaps

      for (const subUrl of subSitemaps) {
        const subResult = await fetchSitemap(subUrl);
        if (subResult.success && subResult.data) {
          allUrls.push(...subResult.data);
        }
      }

      return { success: true, data: allUrls };
    }

    // Parse regular sitemap
    const urls: SitemapUrl[] = [];
    const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/gi);

    for (const match of urlMatches) {
      const urlBlock = match[1];

      const locMatch = urlBlock.match(/<loc>([^<]+)<\/loc>/i);
      const lastmodMatch = urlBlock.match(/<lastmod>([^<]+)<\/lastmod>/i);
      const changefreqMatch = urlBlock.match(/<changefreq>([^<]+)<\/changefreq>/i);
      const priorityMatch = urlBlock.match(/<priority>([^<]+)<\/priority>/i);

      if (locMatch) {
        urls.push({
          loc: locMatch[1].trim(),
          lastmod: lastmodMatch?.[1]?.trim(),
          changefreq: changefreqMatch?.[1]?.trim(),
          priority: priorityMatch?.[1]?.trim(),
        });
      }
    }

    return { success: true, data: urls };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch sitemap: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Analyze site structure from sitemap
 */
export async function analyzeSiteStructure(
  domain: string
): Promise<ProviderResult<SitemapResult>> {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];

  // First get robots.txt
  const robotsResult = await fetchRobotsTxt(cleanDomain);
  const blockedPaths = robotsResult.success ? robotsResult.data?.blockedPaths || [] : [];

  // Get sitemap URLs from robots.txt or try common locations
  let sitemapUrls = robotsResult.success ? robotsResult.data?.sitemapUrls || [] : [];

  if (sitemapUrls.length === 0) {
    // Try common sitemap locations
    const commonPaths = [
      `https://${cleanDomain}/sitemap.xml`,
      `https://${cleanDomain}/sitemap_index.xml`,
      `https://${cleanDomain}/sitemap-index.xml`,
    ];
    sitemapUrls = commonPaths;
  }

  // Fetch sitemaps
  let allUrls: SitemapUrl[] = [];
  for (const sitemapUrl of sitemapUrls.slice(0, 2)) {
    // Max 2 sitemaps
    const result = await fetchSitemap(sitemapUrl);
    if (result.success && result.data) {
      allUrls = [...allUrls, ...result.data];
      break; // Found a working sitemap
    }
  }

  // Analyze URLs
  const totalPages = allUrls.length;

  // Categorize pages
  let blogPosts = 0;
  let products = 0;
  const categories = new Set<string>();

  for (const url of allUrls) {
    const path = url.loc.toLowerCase();

    // Detect blog posts
    if (
      path.includes('/blog/') ||
      path.includes('/post/') ||
      path.includes('/article/') ||
      path.includes('/news/') ||
      path.includes('/insights/')
    ) {
      blogPosts++;
      categories.add('Blog');
    }

    // Detect products
    if (
      path.includes('/product/') ||
      path.includes('/products/') ||
      path.includes('/shop/') ||
      path.includes('/sklep/') ||
      path.includes('/item/')
    ) {
      products++;
      categories.add('Products');
    }

    // Detect other categories
    if (path.includes('/service') || path.includes('/uslugi')) {
      categories.add('Services');
    }
    if (path.includes('/about') || path.includes('/o-nas')) {
      categories.add('About');
    }
    if (path.includes('/contact') || path.includes('/kontakt')) {
      categories.add('Contact');
    }
    if (path.includes('/pricing') || path.includes('/cennik')) {
      categories.add('Pricing');
    }
    if (path.includes('/case') || path.includes('/portfolio')) {
      categories.add('Case Studies');
    }
  }

  // Find last updated date
  const dates = allUrls
    .map((u) => u.lastmod)
    .filter((d): d is string => !!d)
    .sort()
    .reverse();
  const lastUpdated = dates[0] || null;

  // Determine update frequency
  let updateFrequency: 'daily' | 'weekly' | 'monthly' | 'unknown' = 'unknown';
  if (lastUpdated) {
    const lastDate = new Date(lastUpdated);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) updateFrequency = 'daily';
    else if (daysDiff <= 7) updateFrequency = 'weekly';
    else if (daysDiff <= 30) updateFrequency = 'monthly';
  }

  return {
    success: true,
    data: {
      totalPages,
      blogPosts,
      products,
      categories: Array.from(categories),
      lastUpdated,
      updateFrequency,
      blockedPaths,
      sitemapUrls,
    },
  };
}

/**
 * Build structure intelligence
 */
export async function buildStructureIntelligence(
  domain: string
): Promise<ProviderResult<StructureIntelligence>> {
  const result = await analyzeSiteStructure(domain);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || 'Failed to analyze site structure',
    };
  }

  // Determine content freshness
  let contentFreshness: 'fresh' | 'moderate' | 'stale' | 'unknown' = 'unknown';
  if (result.data.lastUpdated) {
    const lastDate = new Date(result.data.lastUpdated);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 7) contentFreshness = 'fresh';
    else if (daysDiff <= 30) contentFreshness = 'moderate';
    else contentFreshness = 'stale';
  }

  return {
    success: true,
    data: {
      totalPages: result.data.totalPages,
      blogPosts: result.data.blogPosts,
      products: result.data.products,
      categories: result.data.categories,
      lastUpdated: result.data.lastUpdated,
      updateFrequency: result.data.updateFrequency,
      contentFreshness,
    },
  };
}

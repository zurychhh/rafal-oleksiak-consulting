// RADAR 2.0 - Content Analysis Provider
// Free, unlimited - analyzes HTML content structure

import type { ContentResult, ProviderResult, ContentIntelligence } from '../types-v2';

const USER_AGENT = 'RADAR-Bot/2.0 (+https://oleksiakconsulting.com)';

/**
 * Analyze content from HTML
 */
export function analyzeContentFromHtml(html: string): ContentResult {
  // Extract text content (remove scripts, styles, tags)
  const textOnly = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const wordCount = textOnly.split(/\s+/).filter((w) => w.length > 0).length;

  // Extract headings
  const h1Matches = html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2Matches = html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  const h3Matches = html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);

  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];

  for (const match of h1Matches) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 0) h1.push(text);
  }
  for (const match of h2Matches) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 0 && h2.length < 20) h2.push(text);
  }
  for (const match of h3Matches) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 0 && h3.length < 20) h3.push(text);
  }

  // Count links
  const allLinks = html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi);
  let internalLinks = 0;
  let externalLinks = 0;

  for (const match of allLinks) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://')) {
      externalLinks++;
    } else if (href.startsWith('/') || href.startsWith('#')) {
      internalLinks++;
    }
  }

  // Count images
  const allImages = html.matchAll(/<img[^>]+/gi);
  let images = 0;
  let imagesWithAlt = 0;

  for (const match of allImages) {
    images++;
    if (match[0].includes('alt=') && !match[0].match(/alt=["']\s*["']/)) {
      imagesWithAlt++;
    }
  }

  // Detect blog presence
  const hasBlog =
    /(?:\/blog|\/articles|\/news|\/insights|\/resources|\/posts)/i.test(html) ||
    /<a[^>]*>(?:Blog|Articles|News|Insights|Resources)<\/a>/i.test(html);

  // Detect pricing presence
  const hasPricing =
    /(?:\/pricing|\/plans|\/packages|\/cennik)/i.test(html) ||
    /<a[^>]*>(?:Pricing|Plans|Packages|Cennik|Ceny)<\/a>/i.test(html) ||
    /\$\d+|\€\d+|\d+\s*(?:zł|PLN)/i.test(html);

  // Detect social proof
  const hasSocialProof =
    /(?:testimonial|review|case.?study|client|customer|trusted.?by|partner|logo|rating)/i.test(html);

  // Count CTAs
  const ctaPatterns = [
    /(?:contact|kontakt|get.?started|sign.?up|subscribe|book|schedule|demo|free.?trial|try.?free)/gi,
    /<button[^>]*>/gi,
    /class=["'][^"']*(?:cta|btn-primary|button-primary)[^"']*["']/gi,
  ];

  let ctaCount = 0;
  for (const pattern of ctaPatterns) {
    const matches = html.matchAll(pattern);
    for (const _ of matches) {
      ctaCount++;
    }
  }

  // Meta tags
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const metaTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  const descMatch =
    html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
    html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
  const metaDescription = descMatch ? descMatch[1].trim() : '';

  return {
    wordCount,
    headings: { h1, h2, h3 },
    internalLinks,
    externalLinks,
    images,
    imagesWithAlt,
    hasBlog,
    hasPricing,
    hasSocialProof,
    ctaCount: Math.min(ctaCount, 50), // Cap at 50
    metaTitle,
    metaDescription,
  };
}

/**
 * Analyze content from URL
 */
export async function analyzeContent(url: string): Promise<ProviderResult<ContentResult>> {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch URL: ${response.status}`,
      };
    }

    const html = await response.text();
    return { success: true, data: analyzeContentFromHtml(html) };
  } catch (error) {
    return {
      success: false,
      error: `Content analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Build content intelligence
 */
export async function buildContentIntelligence(
  url: string
): Promise<ProviderResult<ContentIntelligence>> {
  const result = await analyzeContent(url);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || 'Failed to analyze content',
    };
  }

  const data = result.data;

  // Build heading structure summary
  const headingStructure: string[] = [];
  if (data.headings.h1.length > 0) {
    headingStructure.push(`H1: ${data.headings.h1[0].slice(0, 60)}`);
  }
  for (const h2 of data.headings.h2.slice(0, 5)) {
    headingStructure.push(`  H2: ${h2.slice(0, 50)}`);
  }

  // Calculate image optimization
  const imageOptimization = data.images > 0 ? Math.round((data.imagesWithAlt / data.images) * 100) : 100;

  // Determine CTA presence
  let ctaPresence: 'none' | 'weak' | 'strong' = 'none';
  if (data.ctaCount > 5) ctaPresence = 'strong';
  else if (data.ctaCount > 0) ctaPresence = 'weak';

  return {
    success: true,
    data: {
      wordCount: data.wordCount,
      headingStructure,
      internalLinks: data.internalLinks,
      externalLinks: data.externalLinks,
      imageOptimization,
      hasBlog: data.hasBlog,
      hasPricing: data.hasPricing,
      socialProof: data.hasSocialProof,
      ctaPresence,
    },
  };
}

/**
 * Compare content between two URLs
 */
export async function compareContent(
  url1: string,
  url2: string
): Promise<ProviderResult<{
  url1: ContentIntelligence;
  url2: ContentIntelligence;
  comparison: {
    wordCountDiff: number;
    linkingDiff: string;
    ctaDiff: string;
  };
}>> {
  const [result1, result2] = await Promise.all([
    buildContentIntelligence(url1),
    buildContentIntelligence(url2),
  ]);

  if (!result1.success || !result2.success) {
    return {
      success: false,
      error: result1.error || result2.error,
    };
  }

  const data1 = result1.data!;
  const data2 = result2.data!;

  const wordCountDiff = data1.wordCount - data2.wordCount;
  const linkingDiff =
    data1.internalLinks > data2.internalLinks
      ? `${url1} has more internal links`
      : data2.internalLinks > data1.internalLinks
        ? `${url2} has more internal links`
        : 'Similar internal linking';

  const ctaDiff =
    data1.ctaPresence === data2.ctaPresence
      ? 'Similar CTA presence'
      : `${data1.ctaPresence === 'strong' ? url1 : url2} has stronger CTAs`;

  return {
    success: true,
    data: {
      url1: data1,
      url2: data2,
      comparison: {
        wordCountDiff,
        linkingDiff,
        ctaDiff,
      },
    },
  };
}

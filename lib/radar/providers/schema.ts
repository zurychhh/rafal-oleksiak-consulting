// RADAR 2.0 - Schema.org / JSON-LD Provider
// Free, unlimited - extracts structured data from HTML

import type { SchemaOrgResult, ProviderResult, BusinessIntelligence, SchemaProduct } from '../types-v2';

const USER_AGENT = 'RADAR-Bot/2.0 (+https://oleksiakconsulting.com)';

interface JsonLdObject {
  '@type'?: string | string[];
  '@context'?: string;
  name?: string;
  description?: string;
  logo?: string | { url?: string };
  image?: string | { url?: string };
  foundingDate?: string;
  numberOfEmployees?: { value?: number } | number | string;
  priceRange?: string;
  aggregateRating?: {
    ratingValue?: number | string;
    reviewCount?: number | string;
    bestRating?: number | string;
  };
  sameAs?: string | string[];
  email?: string;
  telephone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  } | string;
  offers?: {
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
  } | Array<{
    price?: number | string;
    priceCurrency?: string;
    availability?: string;
  }>;
  review?: Array<{
    reviewRating?: { ratingValue?: number | string };
  }>;
  // Product specific
  sku?: string;
  brand?: { name?: string } | string;
}

/**
 * Extract JSON-LD scripts from HTML
 */
export function extractJsonLd(html: string): JsonLdObject[] {
  const results: JsonLdObject[] = [];

  // Match all JSON-LD script tags
  const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

  for (const match of scriptMatches) {
    try {
      const jsonContent = match[1].trim();
      const parsed = JSON.parse(jsonContent);

      // Handle both single objects and arrays
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else if (parsed['@graph']) {
        // Handle @graph format
        results.push(...parsed['@graph']);
      } else {
        results.push(parsed);
      }
    } catch {
      // Skip invalid JSON
    }
  }

  return results;
}

/**
 * Find objects of specific types in JSON-LD
 */
function findByType(objects: JsonLdObject[], types: string[]): JsonLdObject | undefined {
  const normalizedTypes = types.map((t) => t.toLowerCase());

  return objects.find((obj) => {
    const objTypes = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
    return objTypes.some((t) => t && normalizedTypes.includes(t.toLowerCase()));
  });
}

/**
 * Extract social profiles from sameAs
 */
function extractSocialProfiles(sameAs: string | string[] | undefined): string[] {
  if (!sameAs) return [];

  const urls = Array.isArray(sameAs) ? sameAs : [sameAs];
  const socialPatterns = [
    'facebook.com',
    'twitter.com',
    'x.com',
    'linkedin.com',
    'instagram.com',
    'youtube.com',
    'tiktok.com',
    'pinterest.com',
    'github.com',
  ];

  return urls.filter((url) => socialPatterns.some((pattern) => url.toLowerCase().includes(pattern)));
}

/**
 * Parse Schema.org data from HTML
 */
export async function parseSchemaOrg(url: string): Promise<ProviderResult<SchemaOrgResult>> {
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
    return parseSchemaFromHtml(html);
  } catch (error) {
    return {
      success: false,
      error: `Schema parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Parse Schema.org data from HTML string
 */
export function parseSchemaFromHtml(html: string): ProviderResult<SchemaOrgResult> {
  const jsonLdObjects = extractJsonLd(html);

  // Find organization or business info
  const org = findByType(jsonLdObjects, [
    'Organization',
    'LocalBusiness',
    'Corporation',
    'Company',
    'Store',
    'Restaurant',
    'ProfessionalService',
  ]);

  // Find products
  const productObjects = jsonLdObjects.filter((obj) => {
    const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
    return types.some((t) => t?.toLowerCase() === 'product');
  });

  // Find website
  const website = findByType(jsonLdObjects, ['WebSite', 'WebPage']);

  // Extract products
  const products: SchemaProduct[] = productObjects.slice(0, 10).map((p) => {
    const offers = Array.isArray(p.offers) ? p.offers[0] : p.offers;
    return {
      name: p.name || 'Unknown',
      price: offers?.price?.toString() || null,
      currency: offers?.priceCurrency || null,
      availability: offers?.availability || null,
      rating: p.aggregateRating?.ratingValue
        ? parseFloat(p.aggregateRating.ratingValue.toString())
        : null,
      reviewCount: p.aggregateRating?.reviewCount
        ? parseInt(p.aggregateRating.reviewCount.toString(), 10)
        : null,
    };
  });

  // Build result
  const result: SchemaOrgResult = {
    type: org?.['@type']?.toString() || null,
    name: org?.name || website?.name || null,
    description: org?.description || website?.description || null,
    logo: typeof org?.logo === 'string' ? org.logo : org?.logo?.url || null,
    foundingDate: org?.foundingDate || null,
    employees: parseEmployees(org?.numberOfEmployees),
    priceRange: org?.priceRange || null,
    aggregateRating: org?.aggregateRating
      ? {
          value: parseFloat(org.aggregateRating.ratingValue?.toString() || '0'),
          count: parseInt(org.aggregateRating.reviewCount?.toString() || '0', 10),
        }
      : null,
    products,
    socialProfiles: extractSocialProfiles(org?.sameAs),
    contactInfo: {
      email: org?.email || null,
      phone: org?.telephone || null,
      address: typeof org?.address === 'string'
        ? org.address
        : org?.address
          ? [
              org.address.streetAddress,
              org.address.addressLocality,
              org.address.addressRegion,
              org.address.postalCode,
              org.address.addressCountry,
            ]
              .filter(Boolean)
              .join(', ')
          : null,
    },
  };

  return { success: true, data: result };
}

/**
 * Parse employee count from various formats
 */
function parseEmployees(value: JsonLdObject['numberOfEmployees']): string | null {
  if (!value) return null;

  if (typeof value === 'number') {
    return categorizeEmployees(value);
  }

  if (typeof value === 'string') {
    const num = parseInt(value, 10);
    if (!isNaN(num)) return categorizeEmployees(num);
    return value;
  }

  if (typeof value === 'object' && value.value) {
    return categorizeEmployees(value.value);
  }

  return null;
}

/**
 * Categorize employee count into ranges
 */
function categorizeEmployees(count: number): string {
  if (count <= 10) return '1-10';
  if (count <= 50) return '11-50';
  if (count <= 200) return '51-200';
  if (count <= 500) return '201-500';
  if (count <= 1000) return '501-1000';
  return '1000+';
}

/**
 * Build business intelligence from Schema.org
 */
export async function buildBusinessIntelligence(
  url: string
): Promise<ProviderResult<BusinessIntelligence>> {
  const result = await parseSchemaOrg(url);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error || 'Failed to parse schema',
    };
  }

  return {
    success: true,
    data: {
      name: result.data.name,
      type: result.data.type,
      foundingDate: result.data.foundingDate,
      employees: result.data.employees,
      priceRange: result.data.priceRange,
      aggregateRating: result.data.aggregateRating,
      products: result.data.products,
      socialProfiles: result.data.socialProfiles,
      contactInfo: result.data.contactInfo,
    },
  };
}

/**
 * Extract Open Graph and Twitter meta tags
 */
export function extractSocialMeta(html: string): {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
} {
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1] || null;

  const ogDescription = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)?.[1] || null;

  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] || null;

  const twitterCard = html.match(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:card["']/i)?.[1] || null;

  return { ogTitle, ogDescription, ogImage, twitterCard };
}

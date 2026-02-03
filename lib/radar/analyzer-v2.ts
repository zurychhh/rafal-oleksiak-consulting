// RADAR 2.0 - Main Analyzer Orchestrator
// Combines all free providers into comprehensive competitor intelligence

import type {
  CompetitorIntelV2,
  RadarReportV2,
  ProviderResult,
  SeoIntelligence,
  PerformanceIntelligence,
  BusinessIntelligence,
  StructureIntelligence,
  TechIntelligence,
  ContentIntelligence,
} from './types-v2';

// Import all providers
import { buildSeoIntelligence, compareDomains } from './providers/serper';
import { buildPerformanceIntelligence } from './providers/pagespeed';
import { buildStructureIntelligence } from './providers/sitemap';
import { buildBusinessIntelligence, extractSocialMeta, parseSchemaFromHtml } from './providers/schema';
import { buildTechIntelligence, detectFromHtml, detectFromHeaders, analyzeHeaders } from './providers/techstack';
import { buildContentIntelligence, analyzeContentFromHtml } from './providers/content';

const USER_AGENT = 'RADAR-Bot/2.0 (+https://oleksiakconsulting.com)';

interface AnalysisOptions {
  skipSerper?: boolean;      // Skip Serper API (to save quota)
  skipPageSpeed?: boolean;   // Skip PageSpeed (slow, 60s timeout)
  includeKeywords?: string[]; // Optional keywords for SEO analysis
}

interface ProviderStatus {
  name: string;
  success: boolean;
  error?: string;
  durationMs: number;
}

interface AnalysisResult {
  competitor: CompetitorIntelV2;
  providerStatuses: ProviderStatus[];
  serperQueriesUsed: number;
}

/**
 * Fetch HTML for a URL with error handling
 */
async function fetchHtml(url: string): Promise<ProviderResult<{ html: string; headers: Headers }>> {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(20000),
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const html = await response.text();
    return {
      success: true,
      data: { html, headers: response.headers },
    };
  } catch (error) {
    return {
      success: false,
      error: `Fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Analyze a single competitor URL
 */
export async function analyzeCompetitor(
  url: string,
  options: AnalysisOptions = {}
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const providerStatuses: ProviderStatus[] = [];
  let serperQueriesUsed = 0;

  // Normalize URL
  const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const domain = cleanUrl.split('/')[0];

  // Initialize empty competitor intel
  const competitor: CompetitorIntelV2 = {
    url: cleanUrl,
    domain,
    analyzedAt: new Date().toISOString(),
    seo: null,
    performance: null,
    structure: null,
    business: null,
    tech: null,
    content: null,
    rawData: {
      htmlFetched: false,
      headersAnalyzed: false,
      schemaFound: false,
      sitemapFound: false,
    },
  };

  // Step 1: Fetch HTML (needed for multiple providers)
  const htmlStart = Date.now();
  const htmlResult = await fetchHtml(url);

  if (htmlResult.success && htmlResult.data) {
    competitor.rawData.htmlFetched = true;
    const { html, headers } = htmlResult.data;

    // Run HTML-based analyses synchronously to avoid duplicate fetches
    // Content analysis from HTML
    try {
      const contentData = analyzeContentFromHtml(html);
      competitor.content = {
        wordCount: contentData.wordCount,
        headingStructure: [
          ...(contentData.headings.h1.length > 0 ? [`H1: ${contentData.headings.h1[0].slice(0, 60)}`] : []),
          ...contentData.headings.h2.slice(0, 5).map((h) => `  H2: ${h.slice(0, 50)}`),
        ],
        internalLinks: contentData.internalLinks,
        externalLinks: contentData.externalLinks,
        imageOptimization: contentData.images > 0 ? Math.round((contentData.imagesWithAlt / contentData.images) * 100) : 100,
        hasBlog: contentData.hasBlog,
        hasPricing: contentData.hasPricing,
        socialProof: contentData.hasSocialProof,
        ctaPresence: contentData.ctaCount > 5 ? 'strong' : contentData.ctaCount > 0 ? 'weak' : 'none',
      };
      providerStatuses.push({ name: 'content', success: true, durationMs: Date.now() - htmlStart });
    } catch (error) {
      providerStatuses.push({
        name: 'content',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: Date.now() - htmlStart,
      });
    }

    // Tech stack from HTML + headers
    try {
      const techHtml = detectFromHtml(html);
      const techHeaders = detectFromHeaders(headers);
      const headersAnalysis = analyzeHeaders(headers);
      competitor.rawData.headersAnalyzed = true;

      const isHttps = url.startsWith('https://') || !url.startsWith('http://');
      let securityHeaders = 0;
      if (headersAnalysis.security.hsts) securityHeaders++;
      if (headersAnalysis.security.xFrameOptions) securityHeaders++;
      if (headersAnalysis.security.xContentTypeOptions) securityHeaders++;
      if (headersAnalysis.security.csp) securityHeaders++;

      competitor.tech = {
        cms: techHtml.cms,
        framework: techHtml.framework,
        analytics: techHtml.analytics,
        marketing: techHtml.marketing,
        cdn: techHeaders.cdn || techHtml.cdn,
        hosting: techHeaders.hosting || techHtml.hosting,
        ecommerce: techHtml.ecommerce,
        security: {
          ssl: isHttps,
          hsts: headersAnalysis.security.hsts,
          securityHeaders,
        },
      };
      providerStatuses.push({ name: 'tech', success: true, durationMs: Date.now() - htmlStart });
    } catch (error) {
      providerStatuses.push({
        name: 'tech',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: Date.now() - htmlStart,
      });
    }

    // Schema.org / Business intelligence from HTML
    try {
      const schemaResult = parseSchemaFromHtml(html);
      if (schemaResult.success && schemaResult.data) {
        const data = schemaResult.data;
        competitor.rawData.schemaFound = !!(data.name || data.type || data.products.length > 0);

        competitor.business = {
          name: data.name,
          type: data.type,
          foundingDate: data.foundingDate,
          employees: data.employees,
          priceRange: data.priceRange,
          aggregateRating: data.aggregateRating,
          products: data.products,
          socialProfiles: data.socialProfiles,
          contactInfo: data.contactInfo,
        };
      }
      providerStatuses.push({ name: 'schema', success: true, durationMs: Date.now() - htmlStart });
    } catch (error) {
      providerStatuses.push({
        name: 'schema',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        durationMs: Date.now() - htmlStart,
      });
    }

    // Social meta tags
    try {
      const socialMeta = extractSocialMeta(html);
      // Attach to business if exists
      if (!competitor.business) {
        competitor.business = {
          name: null,
          type: null,
          foundingDate: null,
          employees: null,
          priceRange: null,
          aggregateRating: null,
          products: [],
          socialProfiles: [],
          contactInfo: { email: null, phone: null, address: null },
        };
      }
      // Store OG data in rawData for now
      competitor.rawData.ogTitle = socialMeta.ogTitle;
      competitor.rawData.ogDescription = socialMeta.ogDescription;
      competitor.rawData.ogImage = socialMeta.ogImage;
    } catch {
      // Non-critical, ignore errors
    }
  } else {
    providerStatuses.push({
      name: 'html-fetch',
      success: false,
      error: htmlResult.error,
      durationMs: Date.now() - htmlStart,
    });
  }

  // Step 2: Run parallel API calls
  const parallelProviders: Promise<void>[] = [];

  // Sitemap analysis
  parallelProviders.push(
    (async () => {
      const start = Date.now();
      try {
        const result = await buildStructureIntelligence(domain);
        if (result.success && result.data) {
          competitor.structure = result.data;
          competitor.rawData.sitemapFound = result.data.totalPages > 0;
        }
        providerStatuses.push({
          name: 'sitemap',
          success: result.success,
          error: result.error,
          durationMs: Date.now() - start,
        });
      } catch (error) {
        providerStatuses.push({
          name: 'sitemap',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          durationMs: Date.now() - start,
        });
      }
    })()
  );

  // PageSpeed analysis (optional, slow)
  if (!options.skipPageSpeed) {
    parallelProviders.push(
      (async () => {
        const start = Date.now();
        try {
          const result = await buildPerformanceIntelligence(url);
          if (result.success && result.data) {
            competitor.performance = result.data;
          }
          providerStatuses.push({
            name: 'pagespeed',
            success: result.success,
            error: result.error,
            durationMs: Date.now() - start,
          });
        } catch (error) {
          providerStatuses.push({
            name: 'pagespeed',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            durationMs: Date.now() - start,
          });
        }
      })()
    );
  }

  // Serper SEO analysis (optional, uses API quota)
  if (!options.skipSerper) {
    parallelProviders.push(
      (async () => {
        const start = Date.now();
        try {
          const industry = options.includeKeywords?.[0]; // Use first keyword as industry
          const result = await buildSeoIntelligence(domain, industry);
          if (result.success && result.data) {
            competitor.seo = result.data;
            serperQueriesUsed += result.data.queriesUsed || 1;
          }
          providerStatuses.push({
            name: 'serper',
            success: result.success,
            error: result.error,
            durationMs: Date.now() - start,
          });
        } catch (error) {
          providerStatuses.push({
            name: 'serper',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            durationMs: Date.now() - start,
          });
        }
      })()
    );
  }

  // Wait for all parallel providers
  await Promise.allSettled(parallelProviders);

  return {
    competitor,
    providerStatuses,
    serperQueriesUsed,
  };
}

/**
 * Analyze your site vs competitors
 */
export async function runRadarAnalysisV2(
  yourUrl: string,
  competitorUrls: string[],
  options: AnalysisOptions = {}
): Promise<{
  report: RadarReportV2;
  totalSerperQueries: number;
  totalDurationMs: number;
}> {
  const startTime = Date.now();
  let totalSerperQueries = 0;

  // Analyze your site first
  const yourResult = await analyzeCompetitor(yourUrl, options);
  totalSerperQueries += yourResult.serperQueriesUsed;

  // Analyze competitors in parallel
  const competitorResults = await Promise.all(
    competitorUrls.map((url) => analyzeCompetitor(url, options))
  );

  for (const result of competitorResults) {
    totalSerperQueries += result.serperQueriesUsed;
  }

  // Build provider summary
  const allStatuses = [
    ...yourResult.providerStatuses,
    ...competitorResults.flatMap((r) => r.providerStatuses),
  ];

  const providerSummary: Record<string, { success: number; failed: number; avgMs: number }> = {};
  for (const status of allStatuses) {
    if (!providerSummary[status.name]) {
      providerSummary[status.name] = { success: 0, failed: 0, avgMs: 0 };
    }
    if (status.success) {
      providerSummary[status.name].success++;
    } else {
      providerSummary[status.name].failed++;
    }
    providerSummary[status.name].avgMs =
      (providerSummary[status.name].avgMs + status.durationMs) / 2;
  }

  // Calculate overall position (simplified scoring)
  const position = calculatePosition(yourResult.competitor, competitorResults.map((r) => r.competitor));

  // Build report
  const report: RadarReportV2 = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    yourSite: yourResult.competitor,
    competitors: competitorResults.map((r) => r.competitor),
    overallPosition: position,
    providerSummary,
    serperQueriesUsed: totalSerperQueries,
    aiInsights: null, // Will be filled by opportunity-finder
  };

  return {
    report,
    totalSerperQueries,
    totalDurationMs: Date.now() - startTime,
  };
}

/**
 * Calculate relative market position
 */
function calculatePosition(
  yourSite: CompetitorIntelV2,
  competitors: CompetitorIntelV2[]
): 'leading' | 'competitive' | 'catching_up' | 'behind' {
  let yourScore = 0;
  let avgCompetitorScore = 0;

  // Score based on available data
  const scoreFactors = {
    performance: (perf: PerformanceIntelligence | null) => {
      if (!perf) return 0;
      return (perf.mobileScore + perf.desktopScore) / 2;
    },
    content: (content: ContentIntelligence | null) => {
      if (!content) return 0;
      let score = 0;
      if (content.hasBlog) score += 20;
      if (content.hasPricing) score += 10;
      if (content.socialProof) score += 15;
      if (content.ctaPresence === 'strong') score += 15;
      else if (content.ctaPresence === 'weak') score += 5;
      score += Math.min(content.wordCount / 100, 20);
      return Math.min(score, 100);
    },
    tech: (tech: TechIntelligence | null) => {
      if (!tech) return 0;
      let score = 0;
      if (tech.security.ssl) score += 20;
      if (tech.security.hsts) score += 10;
      score += tech.security.securityHeaders * 5;
      if (tech.analytics.length > 0) score += 15;
      if (tech.marketing.length > 0) score += 15;
      if (tech.framework) score += 10;
      return Math.min(score, 100);
    },
    structure: (structure: StructureIntelligence | null) => {
      if (!structure) return 0;
      let score = 0;
      score += Math.min(structure.totalPages / 10, 30);
      if (structure.blogPosts > 0) score += 20;
      if (structure.contentFreshness === 'fresh') score += 25;
      else if (structure.contentFreshness === 'moderate') score += 15;
      if (structure.updateFrequency === 'daily') score += 25;
      else if (structure.updateFrequency === 'weekly') score += 15;
      else if (structure.updateFrequency === 'monthly') score += 5;
      return Math.min(score, 100);
    },
  };

  // Calculate your score
  yourScore += scoreFactors.performance(yourSite.performance);
  yourScore += scoreFactors.content(yourSite.content);
  yourScore += scoreFactors.tech(yourSite.tech);
  yourScore += scoreFactors.structure(yourSite.structure);
  yourScore = yourScore / 4; // Average across factors

  // Calculate average competitor score
  if (competitors.length > 0) {
    for (const comp of competitors) {
      let compScore = 0;
      compScore += scoreFactors.performance(comp.performance);
      compScore += scoreFactors.content(comp.content);
      compScore += scoreFactors.tech(comp.tech);
      compScore += scoreFactors.structure(comp.structure);
      avgCompetitorScore += compScore / 4;
    }
    avgCompetitorScore = avgCompetitorScore / competitors.length;
  }

  // Determine position
  const diff = yourScore - avgCompetitorScore;
  if (diff > 20) return 'leading';
  if (diff > 0) return 'competitive';
  if (diff > -20) return 'catching_up';
  return 'behind';
}

/**
 * Quick scan (no Serper, no PageSpeed) - fast and free
 */
export async function quickScan(
  yourUrl: string,
  competitorUrls: string[]
): Promise<{
  report: RadarReportV2;
  totalDurationMs: number;
}> {
  const result = await runRadarAnalysisV2(yourUrl, competitorUrls, {
    skipSerper: true,
    skipPageSpeed: true,
  });

  return {
    report: result.report,
    totalDurationMs: result.totalDurationMs,
  };
}

/**
 * Full scan with all providers
 */
export async function fullScan(
  yourUrl: string,
  competitorUrls: string[],
  keywords?: string[]
): Promise<{
  report: RadarReportV2;
  totalSerperQueries: number;
  totalDurationMs: number;
}> {
  return runRadarAnalysisV2(yourUrl, competitorUrls, {
    includeKeywords: keywords,
  });
}

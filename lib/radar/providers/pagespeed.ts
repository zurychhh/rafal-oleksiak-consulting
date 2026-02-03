// RADAR 2.0 - Google PageSpeed Insights Provider
// Free, unlimited (rate limited ~1-2 queries/second)
// Docs: https://developers.google.com/speed/docs/insights/v5/get-started

import type { PageSpeedResult, ProviderResult, PerformanceIntelligence } from '../types-v2';

// PageSpeed API is free, no key required for basic usage
// Optional API key for higher rate limits
const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY || '';
const PAGESPEED_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

interface PageSpeedApiResponse {
  lighthouseResult?: {
    categories?: {
      performance?: {
        score: number;
      };
    };
    audits?: {
      'largest-contentful-paint'?: { numericValue: number };
      'first-input-delay'?: { numericValue: number };
      'max-potential-fid'?: { numericValue: number };
      'cumulative-layout-shift'?: { numericValue: number };
      'first-contentful-paint'?: { numericValue: number };
      'server-response-time'?: { numericValue: number };
      'speed-index'?: { numericValue: number };
      'total-blocking-time'?: { numericValue: number };
      'interactive'?: { numericValue: number };
    };
  };
  loadingExperience?: {
    metrics?: {
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile: number };
      FIRST_INPUT_DELAY_MS?: { percentile: number };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: { percentile: number };
    };
    overall_category?: 'FAST' | 'AVERAGE' | 'SLOW';
  };
}

/**
 * Run PageSpeed analysis for a URL
 */
export async function analyzePageSpeed(
  url: string,
  strategy: 'mobile' | 'desktop' = 'mobile'
): Promise<ProviderResult<PageSpeedResult>> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const params = new URLSearchParams({
      url: fullUrl,
      strategy,
      category: 'performance',
    });

    if (PAGESPEED_API_KEY) {
      params.append('key', PAGESPEED_API_KEY);
    }

    const response = await fetch(`${PAGESPEED_ENDPOINT}?${params.toString()}`, {
      signal: AbortSignal.timeout(60000), // 60s timeout - PageSpeed can be slow
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `PageSpeed API error: ${response.status} - ${errorText.slice(0, 200)}`,
      };
    }

    const data: PageSpeedApiResponse = await response.json();

    const lighthouse = data.lighthouseResult;
    const fieldData = data.loadingExperience;

    // Calculate score (0-100)
    const score = Math.round((lighthouse?.categories?.performance?.score || 0) * 100);

    // Extract metrics (in milliseconds)
    const audits = lighthouse?.audits || {};

    const lcp = Math.round(audits['largest-contentful-paint']?.numericValue || 0);
    const fid = Math.round(
      audits['first-input-delay']?.numericValue ||
        audits['max-potential-fid']?.numericValue ||
        0
    );
    const cls = audits['cumulative-layout-shift']?.numericValue || 0;
    const fcp = Math.round(audits['first-contentful-paint']?.numericValue || 0);
    const ttfb = Math.round(audits['server-response-time']?.numericValue || 0);

    // Generate recommendations based on metrics
    const recommendations: string[] = [];

    if (lcp > 2500) {
      recommendations.push('Improve Largest Contentful Paint (LCP) - target under 2.5s');
    }
    if (fid > 100) {
      recommendations.push('Reduce First Input Delay (FID) - target under 100ms');
    }
    if (cls > 0.1) {
      recommendations.push('Fix Cumulative Layout Shift (CLS) - target under 0.1');
    }
    if (ttfb > 600) {
      recommendations.push('Improve server response time (TTFB) - target under 600ms');
    }
    if (score < 50) {
      recommendations.push('Consider optimizing images and enabling compression');
      recommendations.push('Reduce JavaScript execution time');
    }

    return {
      success: true,
      data: {
        score,
        metrics: {
          lcp,
          fid,
          cls,
          fcp,
          ttfb,
        },
        recommendations,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `PageSpeed analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Get both mobile and desktop scores
 */
export async function getFullPerformance(url: string): Promise<ProviderResult<{
  mobile: PageSpeedResult;
  desktop: PageSpeedResult;
}>> {
  const [mobileResult, desktopResult] = await Promise.all([
    analyzePageSpeed(url, 'mobile'),
    analyzePageSpeed(url, 'desktop'),
  ]);

  if (!mobileResult.success || !desktopResult.success) {
    return {
      success: false,
      error: mobileResult.error || desktopResult.error,
    };
  }

  return {
    success: true,
    data: {
      mobile: mobileResult.data!,
      desktop: desktopResult.data!,
    },
  };
}

/**
 * Build performance intelligence from PageSpeed data
 */
export async function buildPerformanceIntelligence(
  url: string
): Promise<ProviderResult<PerformanceIntelligence>> {
  // Get mobile score (primary for modern web)
  const mobileResult = await analyzePageSpeed(url, 'mobile');

  if (!mobileResult.success || !mobileResult.data) {
    // Try desktop as fallback
    const desktopResult = await analyzePageSpeed(url, 'desktop');
    if (!desktopResult.success || !desktopResult.data) {
      return {
        success: false,
        error: mobileResult.error || desktopResult.error || 'PageSpeed analysis failed',
      };
    }

    // Use desktop data with mobile as unknown
    return {
      success: true,
      data: {
        mobileScore: 0, // Unknown
        desktopScore: desktopResult.data.score,
        coreWebVitals: {
          lcp: desktopResult.data.metrics.lcp,
          fid: desktopResult.data.metrics.fid,
          cls: desktopResult.data.metrics.cls,
        },
        recommendations: desktopResult.data.recommendations,
        grade: scoreToGrade(desktopResult.data.score),
      },
    };
  }

  // Try to get desktop too (optional)
  let desktopScore = 0;
  try {
    const desktopResult = await analyzePageSpeed(url, 'desktop');
    if (desktopResult.success && desktopResult.data) {
      desktopScore = desktopResult.data.score;
    }
  } catch {
    // Ignore desktop errors
  }

  return {
    success: true,
    data: {
      mobileScore: mobileResult.data.score,
      desktopScore,
      coreWebVitals: {
        lcp: mobileResult.data.metrics.lcp,
        fid: mobileResult.data.metrics.fid,
        cls: mobileResult.data.metrics.cls,
      },
      recommendations: mobileResult.data.recommendations,
      grade: scoreToGrade(mobileResult.data.score),
    },
  };
}

/**
 * Convert score to letter grade
 */
function scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 70) return 'B';
  if (score >= 50) return 'C';
  if (score >= 30) return 'D';
  return 'F';
}

/**
 * Compare performance between two URLs
 */
export async function comparePerformance(
  url1: string,
  url2: string
): Promise<ProviderResult<{
  url1: PerformanceIntelligence;
  url2: PerformanceIntelligence;
  winner: string;
  comparison: string;
}>> {
  const [result1, result2] = await Promise.all([
    buildPerformanceIntelligence(url1),
    buildPerformanceIntelligence(url2),
  ]);

  if (!result1.success || !result2.success) {
    return {
      success: false,
      error: result1.error || result2.error,
    };
  }

  const score1 = result1.data!.mobileScore || result1.data!.desktopScore;
  const score2 = result2.data!.mobileScore || result2.data!.desktopScore;

  const winner = score1 > score2 ? url1 : score2 > score1 ? url2 : 'tie';
  const diff = Math.abs(score1 - score2);

  let comparison = '';
  if (diff < 5) {
    comparison = 'Performance is roughly equal';
  } else if (diff < 20) {
    comparison = `${winner} has slightly better performance (+${diff} points)`;
  } else {
    comparison = `${winner} has significantly better performance (+${diff} points)`;
  }

  return {
    success: true,
    data: {
      url1: result1.data!,
      url2: result2.data!,
      winner,
      comparison,
    },
  };
}

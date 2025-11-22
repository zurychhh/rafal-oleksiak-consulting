// LAMA - STAY Analyzer (Was: Performance)
// User Question: "Will people STAY on my website?"
// Analyzes: Page speed, mobile experience, Core Web Vitals (LCP, CLS)

import type { PerformanceAnalysis, Issue, CategoryScore } from '../types';

interface PageSpeedResponse {
  lighthouseResult: {
    categories: {
      performance: {
        score: number;
      };
    };
    audits: {
      'largest-contentful-paint': {
        displayValue: string;
        numericValue: number;
      };
      'cumulative-layout-shift': {
        displayValue: string;
        numericValue: number;
      };
      'first-contentful-paint': {
        displayValue: string;
        numericValue: number;
      };
      'total-blocking-time': {
        displayValue: string;
        numericValue: number;
      };
      'speed-index': {
        displayValue: string;
        numericValue: number;
      };
    };
  };
}

export async function analyzePerformance(url: string): Promise<CategoryScore> {
  const issues: Issue[] = [];

  try {
    // Test both mobile and desktop
    const [mobileResult, desktopResult] = await Promise.all([
      fetchPageSpeedData(url, 'mobile'),
      fetchPageSpeedData(url, 'desktop'),
    ]);

    const mobileScore = Math.round((mobileResult.lighthouseResult.categories.performance.score || 0) * 100);
    const desktopScore = Math.round((desktopResult.lighthouseResult.categories.performance.score || 0) * 100);

    // Mobile metrics (primary)
    const lcp = mobileResult.lighthouseResult.audits['largest-contentful-paint'].numericValue;
    const cls = mobileResult.lighthouseResult.audits['cumulative-layout-shift'].numericValue;
    const fcp = mobileResult.lighthouseResult.audits['first-contentful-paint'].numericValue;
    const tbt = mobileResult.lighthouseResult.audits['total-blocking-time'].numericValue;
    const si = mobileResult.lighthouseResult.audits['speed-index'].numericValue;

    // Analyze Core Web Vitals
    // LCP (Largest Contentful Paint) - should be < 2.5s
    if (lcp > 4000) {
      issues.push({
        severity: 'critical',
        title: 'Very slow Largest Contentful Paint',
        description: `LCP is ${(lcp / 1000).toFixed(1)}s. Target: < 2.5s`,
        impact: 'Poor user experience leads to 32% higher bounce rate',
      });
    } else if (lcp > 2500) {
      issues.push({
        severity: 'warning',
        title: 'Slow Largest Contentful Paint',
        description: `LCP is ${(lcp / 1000).toFixed(1)}s. Target: < 2.5s`,
        impact: 'Users may leave before seeing main content (estimated -15% conversion)',
      });
    }

    // CLS (Cumulative Layout Shift) - should be < 0.1
    if (cls > 0.25) {
      issues.push({
        severity: 'critical',
        title: 'High layout shift',
        description: `CLS score is ${cls.toFixed(2)}. Target: < 0.1`,
        impact: 'Frustrating user experience (estimated -20% conversion)',
      });
    } else if (cls > 0.1) {
      issues.push({
        severity: 'warning',
        title: 'Moderate layout shift',
        description: `CLS score is ${cls.toFixed(2)}. Target: < 0.1`,
        impact: 'Some content jumping may frustrate users (estimated -10% conversion)',
      });
    }

    // FCP (First Contentful Paint) - should be < 1.8s
    if (fcp > 3000) {
      issues.push({
        severity: 'warning',
        title: 'Slow First Contentful Paint',
        description: `FCP is ${(fcp / 1000).toFixed(1)}s. Target: < 1.8s`,
        impact: 'Users see blank screen for too long (estimated -18% bounce rate increase)',
      });
    }

    // Mobile vs Desktop gap
    if (mobileScore < desktopScore - 20) {
      issues.push({
        severity: 'warning',
        title: 'Poor mobile performance',
        description: `Mobile score (${mobileScore}) is ${desktopScore - mobileScore} points lower than desktop (${desktopScore})`,
        impact: `60% of traffic is mobile - you\'re losing potential customers (estimated -${desktopScore - mobileScore}% mobile conversions)`,
      });
    }

    // Overall score assessment
    let overallScore = Math.round((mobileScore + desktopScore) / 2);

    if (overallScore < 50) {
      issues.push({
        severity: 'critical',
        title: 'Critical performance issues',
        description: `Overall PageSpeed score is ${overallScore}/100. This is significantly below industry standards.`,
        impact: 'Estimated 40-60% loss in potential conversions due to slow site',
      });
    } else if (overallScore < 70) {
      issues.push({
        severity: 'warning',
        title: 'Performance needs improvement',
        description: `Overall PageSpeed score is ${overallScore}/100. There is significant room for optimization.`,
        impact: 'Estimated 20-30% loss in potential conversions due to speed',
      });
    }

    const recommendations = generatePerformanceRecommendations(issues, mobileScore, desktopScore);

    return {
      category: 'Stay',
      score: overallScore,
      issues,
      recommendations,
    };
  } catch (error) {
    console.error('Performance analysis error:', error);

    return {
      category: 'Stay',
      score: 0,
      issues: [
        {
          severity: 'critical',
          title: 'Performance analysis failed',
          description: error instanceof Error ? error.message : 'Unable to analyze performance',
          impact: 'Cannot measure page speed - may indicate severe issues',
        },
      ],
      recommendations: [
        'Ensure website is publicly accessible',
        'Check if site is blocking Google PageSpeed API',
        'Consider basic performance optimizations (image compression, caching)',
      ],
    };
  }
}

async function fetchPageSpeedData(url: string, strategy: 'mobile' | 'desktop'): Promise<PageSpeedResponse> {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || '';
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance${apiKey ? `&key=${apiKey}` : ''}`;

  const response = await fetch(apiUrl, {
    headers: {
      'User-Agent': 'LAMA-Audit/1.0',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PageSpeed API error (${strategy}): ${response.status} - ${errorText}`);
  }

  return response.json();
}

function generatePerformanceRecommendations(
  issues: Issue[],
  mobileScore: number,
  desktopScore: number
): string[] {
  const recommendations: string[] = [];

  if (issues.some(i => i.title.includes('Largest Contentful Paint'))) {
    recommendations.push('Optimize images (use WebP, lazy loading, proper sizing)');
    recommendations.push('Reduce server response time (upgrade hosting, use CDN)');
  }

  if (issues.some(i => i.title.includes('layout shift'))) {
    recommendations.push('Reserve space for images/ads with width/height attributes');
    recommendations.push('Avoid inserting content above existing content');
  }

  if (issues.some(i => i.title.includes('First Contentful Paint'))) {
    recommendations.push('Minimize render-blocking resources (defer non-critical CSS/JS)');
    recommendations.push('Use browser caching and compression (Gzip/Brotli)');
  }

  if (mobileScore < 70) {
    recommendations.push('Prioritize mobile optimization - 60% of users are on mobile');
    recommendations.push('Consider AMP or lightweight mobile version');
  }

  if (desktopScore < 70) {
    recommendations.push('Audit third-party scripts (analytics, chat widgets, etc.)');
    recommendations.push('Minify and bundle CSS/JavaScript files');
  }

  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push('Continue monitoring Core Web Vitals monthly');
    recommendations.push('Set up performance budgets for new features');
  }

  return recommendations.slice(0, 4); // Limit to top 4 recommendations
}

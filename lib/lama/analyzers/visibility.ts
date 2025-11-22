// LAMA - FIND Analyzer (Was: Visibility)
// User Question: "Will people FIND my website?"
// Analyzes: SEO fundamentals, meta tags, headings, robots.txt, sitemap

import type { VisibilityAnalysis, Issue, CategoryScore } from '../types';

export async function analyzeVisibility(url: string): Promise<CategoryScore> {
  const issues: Issue[] = [];
  let score = 100;

  try {
    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LAMA-Audit-Bot/1.0 (+https://oleksiakconsulting.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();

    // Parse HTML (simple regex-based parsing for MVP)
    const analysis: Partial<VisibilityAnalysis> = {
      hasMetaTitle: false,
      metaTitleLength: 0,
      hasMetaDescription: false,
      metaDescriptionLength: 0,
      hasH1: false,
      h1Count: 0,
      hasRobotsTxt: false,
      hasSitemap: false,
    };

    // Check Meta Title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      analysis.hasMetaTitle = true;
      analysis.metaTitleLength = titleMatch[1].trim().length;

      if (analysis.metaTitleLength < 30) {
        score -= 15;
        issues.push({
          severity: 'warning',
          title: 'Meta title too short',
          description: `Your title is ${analysis.metaTitleLength} characters. Recommended: 50-60 characters.`,
          impact: 'Lower click-through rates in search results (estimated -20% CTR)',
        });
      } else if (analysis.metaTitleLength > 60) {
        score -= 10;
        issues.push({
          severity: 'warning',
          title: 'Meta title too long',
          description: `Your title is ${analysis.metaTitleLength} characters. It will be truncated in search results.`,
          impact: 'Incomplete message in Google results (estimated -10% CTR)',
        });
      }
    } else {
      score -= 25;
      issues.push({
        severity: 'critical',
        title: 'Missing meta title',
        description: 'No <title> tag found. This is critical for SEO.',
        impact: 'Google cannot understand your page topic (estimated -50% organic traffic)',
      });
    }

    // Check Meta Description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
    if (descMatch) {
      analysis.hasMetaDescription = true;
      analysis.metaDescriptionLength = descMatch[1].trim().length;

      if (analysis.metaDescriptionLength < 120) {
        score -= 10;
        issues.push({
          severity: 'info',
          title: 'Meta description too short',
          description: `Your description is ${analysis.metaDescriptionLength} characters. Recommended: 150-160 characters.`,
          impact: 'Less compelling search result snippet (estimated -15% CTR)',
        });
      } else if (analysis.metaDescriptionLength > 160) {
        score -= 5;
        issues.push({
          severity: 'info',
          title: 'Meta description too long',
          description: `Your description is ${analysis.metaDescriptionLength} characters. It will be truncated.`,
          impact: 'Incomplete message in search results (estimated -8% CTR)',
        });
      }
    } else {
      score -= 15;
      issues.push({
        severity: 'warning',
        title: 'Missing meta description',
        description: 'No meta description found. Google will auto-generate one (usually poor quality).',
        impact: 'Lower click-through rate from search results (estimated -25% CTR)',
      });
    }

    // Check H1 tags
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
    if (h1Matches) {
      analysis.hasH1 = true;
      analysis.h1Count = h1Matches.length;

      if (analysis.h1Count > 1) {
        score -= 10;
        issues.push({
          severity: 'warning',
          title: 'Multiple H1 tags detected',
          description: `Found ${analysis.h1Count} H1 tags. Best practice: 1 H1 per page.`,
          impact: 'Confuses search engines about main topic (estimated -5% ranking)',
        });
      }
    } else {
      score -= 20;
      issues.push({
        severity: 'critical',
        title: 'Missing H1 tag',
        description: 'No H1 heading found. H1 is crucial for SEO and accessibility.',
        impact: 'Search engines cannot identify main topic (estimated -30% organic traffic)',
      });
    }

    // Check robots.txt
    try {
      const robotsUrl = new URL('/robots.txt', url).toString();
      const robotsResponse = await fetch(robotsUrl);
      analysis.hasRobotsTxt = robotsResponse.ok;

      if (!analysis.hasRobotsTxt) {
        score -= 5;
        issues.push({
          severity: 'info',
          title: 'Missing robots.txt',
          description: 'No robots.txt file found. Not critical but recommended.',
          impact: 'Minor: search engine crawling may be suboptimal',
        });
      }
    } catch {
      analysis.hasRobotsTxt = false;
    }

    // Check sitemap.xml
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).toString();
      const sitemapResponse = await fetch(sitemapUrl);
      analysis.hasSitemap = sitemapResponse.ok;

      if (!analysis.hasSitemap) {
        score -= 10;
        issues.push({
          severity: 'warning',
          title: 'Missing sitemap.xml',
          description: 'No XML sitemap found. This helps search engines discover all pages.',
          impact: 'Slower indexing of new pages (estimated 2-4 weeks delay)',
        });
      }
    } catch {
      analysis.hasSitemap = false;
    }

    // Ensure score is within 0-100
    score = Math.max(0, Math.min(100, score));

    const recommendations = generateVisibilityRecommendations(issues);

    return {
      category: 'Find',
      score,
      issues,
      recommendations,
    };
  } catch (error) {
    console.error('Visibility analysis error:', error);

    return {
      category: 'Find',
      score: 0,
      issues: [
        {
          severity: 'critical',
          title: 'Analysis failed',
          description: error instanceof Error ? error.message : 'Unknown error',
          impact: 'Unable to assess if people can find your website',
        },
      ],
      recommendations: ['Fix website accessibility to allow analysis', 'Check if URL is correct and publicly accessible'],
    };
  }
}

function generateVisibilityRecommendations(issues: Issue[]): string[] {
  const recommendations: string[] = [];

  if (issues.some(i => i.title.includes('Missing meta title'))) {
    recommendations.push('Add a unique, descriptive <title> tag (50-60 characters) to every page');
  }

  if (issues.some(i => i.title.includes('Meta title too'))) {
    recommendations.push('Optimize title length to 50-60 characters for best display in search results');
  }

  if (issues.some(i => i.title.includes('Missing meta description'))) {
    recommendations.push('Write compelling meta descriptions (150-160 characters) for key pages');
  }

  if (issues.some(i => i.title.includes('Missing H1'))) {
    recommendations.push('Add one clear H1 heading per page that describes the main topic');
  }

  if (issues.some(i => i.title.includes('Multiple H1'))) {
    recommendations.push('Use only one H1 per page; use H2-H6 for subheadings');
  }

  if (issues.some(i => i.title.includes('sitemap'))) {
    recommendations.push('Create and submit XML sitemap to Google Search Console');
  }

  if (issues.some(i => i.title.includes('robots.txt'))) {
    recommendations.push('Add robots.txt file to guide search engine crawlers');
  }

  // Default recommendation if no specific issues
  if (recommendations.length === 0) {
    recommendations.push('Continue monitoring meta tags and headings for optimal SEO');
  }

  return recommendations;
}

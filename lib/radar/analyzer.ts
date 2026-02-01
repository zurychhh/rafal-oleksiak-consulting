// RADAR - Core Analyzer
// Scrapes competitor websites and generates AI-powered intelligence report

import Anthropic from '@anthropic-ai/sdk';
import type {
  CompetitorSnapshot,
  CompetitorAnalysis,
  RadarReport,
  ActionItem,
} from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const USER_AGENT = 'RADAR-Bot/1.0 (+https://oleksiakconsulting.com)';

/**
 * Scrape a single website and extract key signals
 */
export async function scrapeWebsite(url: string): Promise<CompetitorSnapshot> {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();

  // Meta title
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const metaTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

  // Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i)
    || html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
  const metaDescription = descMatch ? descMatch[1].trim() : '';

  // H1
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // Navigation links
  const navigation: string[] = [];
  const navMatch = html.match(/<nav[^>]*>(.*?)<\/nav>/is);
  if (navMatch) {
    const linkMatches = navMatch[1].matchAll(/<a[^>]*>(.*?)<\/a>/gi);
    for (const m of linkMatches) {
      const text = m[1].replace(/<[^>]+>/g, '').trim();
      if (text && text.length > 0 && text.length < 50) {
        navigation.push(text);
      }
    }
  }

  // Value proposition (first meaningful paragraphs)
  const paragraphs: string[] = [];
  const pMatches = html.matchAll(/<p[^>]*>(.*?)<\/p>/gi);
  for (const m of pMatches) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 20) {
      paragraphs.push(text);
      if (paragraphs.length >= 5) break;
    }
  }
  const valueProposition = paragraphs.slice(0, 3).join(' ');

  // Key phrases from headings
  const keyPhrases: string[] = [];
  const headingMatches = html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi);
  for (const m of headingMatches) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 3 && text.length < 100) {
      keyPhrases.push(text);
    }
  }

  // Product/service indicators
  const productPatterns = html.match(/(?:product|service|pricing|plan|package|solution)/gi) || [];
  const productCount = new Set(productPatterns.map(p => p.toLowerCase())).size;

  // Has pricing page?
  const hasPricing = /(?:pricing|plans|packages|price|kosten|cennik|ceny)/i.test(html);

  // Has blog?
  const hasBlog = /(?:\/blog|\/articles|\/news|\/insights|\/resources)/i.test(html);

  // Social proof
  const hasSocialProof = /(?:testimonial|review|case.?study|client|customer|trusted.?by|partner)/i.test(html);

  // Tech stack signals
  const techStack: string[] = [];
  if (html.includes('shopify')) techStack.push('Shopify');
  if (html.includes('wordpress') || html.includes('wp-content')) techStack.push('WordPress');
  if (html.includes('woocommerce')) techStack.push('WooCommerce');
  if (html.includes('next') || html.includes('__next')) techStack.push('Next.js');
  if (html.includes('react')) techStack.push('React');
  if (html.includes('webflow')) techStack.push('Webflow');
  if (html.includes('squarespace')) techStack.push('Squarespace');
  if (html.includes('wix.com')) techStack.push('Wix');
  if (html.includes('hubspot')) techStack.push('HubSpot');
  if (html.includes('intercom')) techStack.push('Intercom');
  if (html.includes('crisp')) techStack.push('Crisp');
  if (html.includes('ga4') || html.includes('gtag') || html.includes('google-analytics')) techStack.push('Google Analytics');
  if (html.includes('hotjar')) techStack.push('Hotjar');
  if (html.includes('segment')) techStack.push('Segment');

  // Content length (text only)
  const textOnly = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const contentLength = textOnly.split(/\s+/).length;

  return {
    url,
    scrapedAt: new Date().toISOString(),
    metaTitle,
    metaDescription,
    h1,
    navigation: navigation.slice(0, 15),
    valueProposition,
    keyPhrases: keyPhrases.slice(0, 10),
    productCount,
    hasPricing,
    hasBlog,
    hasSocialProof,
    techStack,
    contentLength,
  };
}

/**
 * Use Claude to analyze a competitor relative to your site
 */
async function analyzeCompetitorWithAI(
  yourSnapshot: CompetitorSnapshot,
  competitorSnapshot: CompetitorSnapshot,
): Promise<CompetitorAnalysis['aiInsights']> {
  const prompt = `You are a competitive intelligence analyst. Compare these two websites and provide strategic insights.

YOUR CLIENT'S WEBSITE: ${yourSnapshot.url}
- Title: "${yourSnapshot.metaTitle}"
- H1: "${yourSnapshot.h1}"
- Description: "${yourSnapshot.metaDescription}"
- Key content: "${yourSnapshot.valueProposition.slice(0, 300)}"
- Headings: ${yourSnapshot.keyPhrases.slice(0, 5).join(', ')}
- Has pricing: ${yourSnapshot.hasPricing}
- Has blog: ${yourSnapshot.hasBlog}
- Has social proof: ${yourSnapshot.hasSocialProof}
- Tech: ${yourSnapshot.techStack.join(', ') || 'unknown'}

COMPETITOR: ${competitorSnapshot.url}
- Title: "${competitorSnapshot.metaTitle}"
- H1: "${competitorSnapshot.h1}"
- Description: "${competitorSnapshot.metaDescription}"
- Key content: "${competitorSnapshot.valueProposition.slice(0, 300)}"
- Headings: ${competitorSnapshot.keyPhrases.slice(0, 5).join(', ')}
- Navigation: ${competitorSnapshot.navigation.slice(0, 8).join(', ')}
- Has pricing: ${competitorSnapshot.hasPricing}
- Has blog: ${competitorSnapshot.hasBlog}
- Has social proof: ${competitorSnapshot.hasSocialProof}
- Tech: ${competitorSnapshot.techStack.join(', ') || 'unknown'}
- Content word count: ${competitorSnapshot.contentLength}

Analyze the competitor relative to the client. Respond ONLY in JSON (no markdown, no code blocks):
{
  "positioning": "One sentence describing how this competitor positions themselves in the market",
  "strengths": ["Up to 3 specific strengths this competitor has over the client"],
  "weaknesses": ["Up to 3 specific weaknesses or gaps this competitor has"],
  "uniqueAngles": ["Up to 2 unique differentiators this competitor uses"],
  "threatLevel": "low|medium|high",
  "threatReason": "One sentence explaining the threat level"
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return JSON.parse(text);
  } catch (error) {
    console.error(`[RADAR] AI analysis failed for ${competitorSnapshot.url}:`, error);
    return {
      positioning: 'Unable to analyze positioning',
      strengths: ['Analysis unavailable'],
      weaknesses: ['Analysis unavailable'],
      uniqueAngles: [],
      threatLevel: 'medium' as const,
      threatReason: 'AI analysis failed - manual review recommended',
    };
  }
}

/**
 * Generate strategic insights comparing your site against all competitors
 */
async function generateStrategicInsights(
  yourSnapshot: CompetitorSnapshot,
  competitors: CompetitorAnalysis[],
): Promise<RadarReport['strategicInsights']> {
  const competitorSummary = competitors.map(c => ({
    url: c.url,
    positioning: c.aiInsights.positioning,
    strengths: c.aiInsights.strengths,
    weaknesses: c.aiInsights.weaknesses,
    threatLevel: c.aiInsights.threatLevel,
  }));

  const prompt = `You are a senior competitive strategy consultant. Based on this competitive intelligence, provide strategic recommendations.

CLIENT: ${yourSnapshot.url}
- Title: "${yourSnapshot.metaTitle}"
- H1: "${yourSnapshot.h1}"
- Value prop: "${yourSnapshot.valueProposition.slice(0, 200)}"
- Has pricing: ${yourSnapshot.hasPricing}, Blog: ${yourSnapshot.hasBlog}, Social proof: ${yourSnapshot.hasSocialProof}
- Tech: ${yourSnapshot.techStack.join(', ') || 'unknown'}

COMPETITORS:
${JSON.stringify(competitorSummary, null, 2)}

Provide strategic analysis. Respond ONLY in JSON (no markdown, no code blocks):
{
  "marketGaps": ["Up to 3 market gaps the client could exploit that competitors are missing"],
  "yourAdvantages": ["Up to 3 specific advantages the client has over competitors"],
  "yourVulnerabilities": ["Up to 3 areas where the client is most exposed to competitive pressure"],
  "actionItems": [
    {
      "priority": "critical|high|medium|low",
      "title": "Action title",
      "description": "What to do and why",
      "estimatedImpact": "Expected business impact"
    }
  ],
  "overallCompetitivePosition": "leading|competitive|catching_up|behind",
  "positionReason": "One sentence explaining the overall competitive position"
}

Include 3-5 action items sorted by priority (critical first).`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return JSON.parse(text);
  } catch (error) {
    console.error('[RADAR] Strategic insights generation failed:', error);
    return {
      marketGaps: ['Strategic analysis unavailable - AI processing error'],
      yourAdvantages: ['Manual competitive review recommended'],
      yourVulnerabilities: ['Unable to assess automatically'],
      actionItems: [{
        priority: 'high',
        title: 'Manual competitive review needed',
        description: 'AI analysis encountered an error. Review competitors manually.',
        estimatedImpact: 'Critical for strategic planning',
      }],
      overallCompetitivePosition: 'competitive',
      positionReason: 'Unable to determine - manual review recommended',
    };
  }
}

/**
 * Main RADAR analysis function
 * Scrapes your site + competitors, generates AI analysis
 */
export async function runRadarAnalysis(
  yourUrl: string,
  competitorUrls: string[],
): Promise<RadarReport> {
  const startTime = Date.now();

  // 1. Scrape all sites in parallel
  const allUrls = [yourUrl, ...competitorUrls];
  const scrapeResults = await Promise.allSettled(
    allUrls.map(url => scrapeWebsite(url))
  );

  // Extract your snapshot
  const yourResult = scrapeResults[0];
  if (yourResult.status === 'rejected') {
    throw new Error(`Failed to scrape your website: ${yourResult.reason}`);
  }
  const yourSnapshot = yourResult.value;

  // Extract competitor snapshots (skip failed ones)
  const competitorSnapshots: CompetitorSnapshot[] = [];
  for (let i = 1; i < scrapeResults.length; i++) {
    const result = scrapeResults[i];
    if (result.status === 'fulfilled') {
      competitorSnapshots.push(result.value);
    } else {
      console.warn(`[RADAR] Failed to scrape ${competitorUrls[i - 1]}:`, result.reason);
    }
  }

  if (competitorSnapshots.length === 0) {
    throw new Error('Failed to scrape any competitor websites');
  }

  // 2. Run AI analysis for each competitor in parallel
  const analysisResults = await Promise.allSettled(
    competitorSnapshots.map(snapshot =>
      analyzeCompetitorWithAI(yourSnapshot, snapshot)
    )
  );

  const competitors: CompetitorAnalysis[] = competitorSnapshots.map((snapshot, i) => ({
    url: snapshot.url,
    snapshot,
    aiInsights: analysisResults[i].status === 'fulfilled'
      ? analysisResults[i].value
      : {
          positioning: 'Analysis failed',
          strengths: ['Unable to analyze'],
          weaknesses: ['Unable to analyze'],
          uniqueAngles: [],
          threatLevel: 'medium' as const,
          threatReason: 'AI analysis encountered an error',
        },
  }));

  // 3. Generate strategic insights
  const strategicInsights = await generateStrategicInsights(yourSnapshot, competitors);

  return {
    yourUrl,
    yourSnapshot,
    competitors,
    strategicInsights,
    executionTime: Date.now() - startTime,
    analyzedAt: new Date().toISOString(),
  };
}

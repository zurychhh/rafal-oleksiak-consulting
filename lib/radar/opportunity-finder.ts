// RADAR 2.0 - AI Opportunity Finder
// Uses Claude to analyze competitor data and find actionable opportunities

import Anthropic from '@anthropic-ai/sdk';
import type { RadarReportV2, AiInsights, Opportunity, ActionItemV2 } from './types-v2';

const anthropic = new Anthropic();

/**
 * Build a structured prompt from report data
 */
function buildAnalysisPrompt(report: RadarReportV2): string {
  const your = report.yourSite;
  const competitors = report.competitors;

  // Build competitor summaries
  const competitorSummaries = competitors.map((comp, i) => {
    const sections: string[] = [`## Competitor ${i + 1}: ${comp.domain}`];

    // SEO
    if (comp.seo) {
      sections.push(`### SEO Intelligence`);
      sections.push(`- Organic visibility: ${comp.seo.organicVisibility}`);
      if (comp.seo.topKeywords.length > 0) {
        sections.push(`- Top keywords: ${comp.seo.topKeywords.slice(0, 5).map(k => k.keyword).join(', ')}`);
      }
      if (comp.seo.serpFeatures.length > 0) {
        sections.push(`- SERP features: ${comp.seo.serpFeatures.join(', ')}`);
      }
      if (comp.seo.peopleAlsoAsk.length > 0) {
        sections.push(`- People Also Ask: ${comp.seo.peopleAlsoAsk.slice(0, 3).join(', ')}`);
      }
    }

    // Performance
    if (comp.performance) {
      sections.push(`### Performance`);
      sections.push(`- Mobile score: ${comp.performance.mobileScore}/100`);
      sections.push(`- Desktop score: ${comp.performance.desktopScore}/100`);
      sections.push(`- LCP: ${comp.performance.coreWebVitals.lcp}ms, CLS: ${comp.performance.coreWebVitals.cls}`);
      sections.push(`- Grade: ${comp.performance.grade}`);
    }

    // Tech Stack
    if (comp.tech) {
      sections.push(`### Tech Stack`);
      if (comp.tech.cms) sections.push(`- CMS: ${comp.tech.cms}`);
      if (comp.tech.framework) sections.push(`- Framework: ${comp.tech.framework}`);
      if (comp.tech.analytics.length > 0) sections.push(`- Analytics: ${comp.tech.analytics.join(', ')}`);
      if (comp.tech.marketing.length > 0) sections.push(`- Marketing: ${comp.tech.marketing.join(', ')}`);
      if (comp.tech.ecommerce) sections.push(`- Ecommerce: ${comp.tech.ecommerce}`);
      sections.push(`- SSL: ${comp.tech.security.ssl ? 'Yes' : 'No'}, HSTS: ${comp.tech.security.hsts ? 'Yes' : 'No'}`);
    }

    // Content
    if (comp.content) {
      sections.push(`### Content`);
      sections.push(`- Word count: ${comp.content.wordCount}`);
      sections.push(`- Has blog: ${comp.content.hasBlog ? 'Yes' : 'No'}`);
      sections.push(`- Has pricing: ${comp.content.hasPricing ? 'Yes' : 'No'}`);
      sections.push(`- Social proof: ${comp.content.socialProof ? 'Yes' : 'No'}`);
      sections.push(`- CTA presence: ${comp.content.ctaPresence}`);
      sections.push(`- Internal links: ${comp.content.internalLinks}, External links: ${comp.content.externalLinks}`);
    }

    // Structure
    if (comp.structure) {
      sections.push(`### Site Structure`);
      sections.push(`- Total pages: ${comp.structure.totalPages}`);
      sections.push(`- Blog posts: ${comp.structure.blogPosts}`);
      sections.push(`- Products: ${comp.structure.products}`);
      sections.push(`- Content freshness: ${comp.structure.contentFreshness}`);
      sections.push(`- Update frequency: ${comp.structure.updateFrequency}`);
    }

    // Business
    if (comp.business && comp.business.name) {
      sections.push(`### Business Intelligence`);
      if (comp.business.name) sections.push(`- Name: ${comp.business.name}`);
      if (comp.business.type) sections.push(`- Type: ${comp.business.type}`);
      if (comp.business.foundingDate) sections.push(`- Founded: ${comp.business.foundingDate}`);
      if (comp.business.employees) sections.push(`- Employees: ${comp.business.employees}`);
      if (comp.business.priceRange) sections.push(`- Price range: ${comp.business.priceRange}`);
      if (comp.business.aggregateRating) {
        sections.push(`- Rating: ${comp.business.aggregateRating.value}/5 (${comp.business.aggregateRating.count} reviews)`);
      }
      if (comp.business.products.length > 0) {
        sections.push(`- Products found: ${comp.business.products.length}`);
        const topProducts = comp.business.products.slice(0, 3).map(p =>
          `${p.name}${p.price ? ` ($${p.price})` : ''}`
        ).join(', ');
        sections.push(`- Sample products: ${topProducts}`);
      }
      if (comp.business.socialProfiles.length > 0) {
        sections.push(`- Social profiles: ${comp.business.socialProfiles.length}`);
      }
    }

    return sections.join('\n');
  }).join('\n\n---\n\n');

  // Build your site summary (similar format)
  const yourSummary = buildSiteSummary('Your Site', your);

  return `# RADAR Competitive Intelligence Report

${yourSummary}

---

# Competitors Analysis

${competitorSummaries}

---

# Overall Position: ${report.overallPosition.toUpperCase()}
`;
}

function buildSiteSummary(title: string, site: RadarReportV2['yourSite']): string {
  const sections: string[] = [`## ${title}: ${site.domain}`];

  if (site.seo) {
    sections.push(`### SEO Intelligence`);
    sections.push(`- Organic visibility: ${site.seo.organicVisibility}`);
    if (site.seo.topKeywords.length > 0) {
      sections.push(`- Top keywords: ${site.seo.topKeywords.slice(0, 5).map(k => k.keyword).join(', ')}`);
    }
  }

  if (site.performance) {
    sections.push(`### Performance`);
    sections.push(`- Mobile: ${site.performance.mobileScore}/100, Desktop: ${site.performance.desktopScore}/100`);
    sections.push(`- Grade: ${site.performance.grade}`);
  }

  if (site.tech) {
    sections.push(`### Tech Stack`);
    if (site.tech.cms) sections.push(`- CMS: ${site.tech.cms}`);
    if (site.tech.framework) sections.push(`- Framework: ${site.tech.framework}`);
    if (site.tech.analytics.length > 0) sections.push(`- Analytics: ${site.tech.analytics.join(', ')}`);
    if (site.tech.marketing.length > 0) sections.push(`- Marketing: ${site.tech.marketing.join(', ')}`);
  }

  if (site.content) {
    sections.push(`### Content`);
    sections.push(`- Word count: ${site.content.wordCount}`);
    sections.push(`- Has blog: ${site.content.hasBlog ? 'Yes' : 'No'}, Pricing: ${site.content.hasPricing ? 'Yes' : 'No'}`);
    sections.push(`- CTA presence: ${site.content.ctaPresence}`);
  }

  if (site.structure) {
    sections.push(`### Site Structure`);
    sections.push(`- Total pages: ${site.structure.totalPages}, Blog posts: ${site.structure.blogPosts}`);
    sections.push(`- Freshness: ${site.structure.contentFreshness}`);
  }

  return sections.join('\n');
}

/**
 * Analyze report and generate AI insights
 */
export async function findOpportunities(report: RadarReportV2): Promise<AiInsights> {
  const dataPrompt = buildAnalysisPrompt(report);

  const systemPrompt = `You are a competitive intelligence analyst specializing in digital marketing and SEO strategy.
You analyze competitor data to find actionable opportunities for businesses to improve their market position.

Your analysis should be:
- Data-driven: Base recommendations on the actual metrics provided
- Actionable: Give specific, implementable recommendations
- Prioritized: Rank opportunities by impact and difficulty
- Strategic: Consider both quick wins and long-term advantages

Focus on finding OPPORTUNITIES - gaps in the market, competitor weaknesses to exploit, and areas where the client can differentiate.`;

  const userPrompt = `${dataPrompt}

---

Based on this competitive intelligence data, provide a comprehensive analysis in the following JSON format:

{
  "positioning": "A 2-3 sentence summary of the client's market position relative to competitors",
  "strengths": ["List 3-5 key strengths the client has over competitors"],
  "weaknesses": ["List 3-5 areas where competitors outperform the client"],
  "threatLevel": "low|medium|high - based on how competitive the landscape is",
  "opportunities": [
    {
      "type": "seo|content|technical|market",
      "title": "Brief title for the opportunity",
      "description": "2-3 sentences explaining the opportunity and why it matters",
      "difficulty": "easy|medium|hard",
      "impact": "low|medium|high",
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "keywordGaps": ["Keywords competitors rank for that the client doesn't target"],
  "contentIdeas": ["Specific content topics/formats to create based on competitor gaps"],
  "quickWins": ["3-5 things that can be done this week with immediate impact"],
  "actionItems": [
    {
      "title": "Action item title",
      "description": "What to do",
      "priority": 1-5,
      "category": "seo|content|technical|marketing|security"
    }
  ]
}

Provide at least:
- 5 opportunities
- 5 keyword gaps (if SEO data available)
- 5 content ideas
- 3 quick wins
- 10 action items

Be specific and actionable. Reference actual data from the report.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    // Extract text content
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as AiInsights;

    // Validate and normalize
    return {
      positioning: parsed.positioning || 'Analysis in progress',
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      threatLevel: parsed.threatLevel || 'medium',
      opportunities: (parsed.opportunities || []).map(normalizeOpportunity),
      keywordGaps: parsed.keywordGaps || [],
      contentIdeas: parsed.contentIdeas || [],
      quickWins: parsed.quickWins || [],
      actionItems: (parsed.actionItems || []).map(normalizeActionItem),
    };
  } catch (error) {
    console.error('AI analysis failed:', error);

    // Return fallback insights based on data
    return generateFallbackInsights(report);
  }
}

function normalizeOpportunity(opp: Partial<Opportunity>): Opportunity {
  return {
    type: opp.type || 'market',
    title: opp.title || 'Opportunity',
    description: opp.description || '',
    difficulty: opp.difficulty || 'medium',
    impact: opp.impact || 'medium',
    steps: opp.steps || [],
  };
}

function normalizeActionItem(item: Partial<ActionItemV2>): ActionItemV2 {
  return {
    title: item.title || 'Action Item',
    description: item.description || '',
    priority: item.priority || 3,
    category: item.category || 'marketing',
  };
}

/**
 * Generate basic insights without AI (fallback)
 */
function generateFallbackInsights(report: RadarReportV2): AiInsights {
  const your = report.yourSite;
  const competitors = report.competitors;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const opportunities: Opportunity[] = [];
  const quickWins: string[] = [];
  const actionItems: ActionItemV2[] = [];

  // Performance comparison
  if (your.performance) {
    const yourScore = your.performance.mobileScore;
    const avgCompScore = competitors.reduce((sum, c) =>
      sum + (c.performance?.mobileScore || 0), 0) / competitors.length || 0;

    if (yourScore > avgCompScore) {
      strengths.push(`Better mobile performance (${yourScore} vs avg ${Math.round(avgCompScore)})`);
    } else if (yourScore < avgCompScore) {
      weaknesses.push(`Lower mobile performance (${yourScore} vs avg ${Math.round(avgCompScore)})`);
      opportunities.push({
        type: 'technical',
        title: 'Improve Mobile Performance',
        description: 'Your site scores below competitors on mobile. Improving this could boost SEO and user experience.',
        difficulty: 'medium',
        impact: 'high',
        steps: ['Run PageSpeed Insights for detailed recommendations', 'Optimize images', 'Enable caching'],
      });
    }
  }

  // Content comparison
  if (your.content) {
    if (!your.content.hasBlog && competitors.some(c => c.content?.hasBlog)) {
      weaknesses.push('No blog while competitors have one');
      opportunities.push({
        type: 'content',
        title: 'Start a Blog',
        description: 'Competitors have blogs driving organic traffic. Starting one could capture keywords they rank for.',
        difficulty: 'medium',
        impact: 'high',
        steps: ['Identify top 10 keywords in your niche', 'Create content calendar', 'Write first 5 posts'],
      });
    }

    if (your.content.ctaPresence === 'none' || your.content.ctaPresence === 'weak') {
      quickWins.push('Add stronger calls-to-action to your homepage');
      actionItems.push({
        title: 'Improve CTA visibility',
        description: 'Add clear call-to-action buttons above the fold',
        priority: 2,
        category: 'marketing',
      });
    }
  }

  // Tech comparison
  if (your.tech) {
    if (!your.tech.security.hsts) {
      quickWins.push('Enable HSTS for better security');
      actionItems.push({
        title: 'Enable HSTS',
        description: 'Add Strict-Transport-Security header for improved security',
        priority: 3,
        category: 'security',
      });
    }

    if (your.tech.analytics.length === 0 && competitors.some(c => (c.tech?.analytics.length || 0) > 0)) {
      quickWins.push('Set up analytics tracking');
      actionItems.push({
        title: 'Implement Analytics',
        description: 'Add Google Analytics or similar to track visitor behavior',
        priority: 1,
        category: 'technical',
      });
    }

    if (your.tech.marketing.length === 0 && competitors.some(c => (c.tech?.marketing.length || 0) > 0)) {
      opportunities.push({
        type: 'market',
        title: 'Add Marketing Tools',
        description: 'Competitors use marketing automation. Adding tools like HubSpot or Intercom could improve lead capture.',
        difficulty: 'easy',
        impact: 'medium',
        steps: ['Evaluate HubSpot free tier', 'Add live chat widget', 'Set up email capture forms'],
      });
    }
  }

  // Structure comparison
  if (your.structure) {
    const avgPages = competitors.reduce((sum, c) => sum + (c.structure?.totalPages || 0), 0) / competitors.length || 0;
    if (your.structure.totalPages < avgPages * 0.5) {
      weaknesses.push(`Fewer indexed pages than competitors (${your.structure.totalPages} vs avg ${Math.round(avgPages)})`);
      opportunities.push({
        type: 'content',
        title: 'Expand Content Library',
        description: 'Competitors have significantly more indexed pages. More content = more keyword coverage.',
        difficulty: 'hard',
        impact: 'high',
        steps: ['Audit existing content', 'Identify content gaps', 'Create 20+ new pages targeting key topics'],
      });
    }
  }

  // Always add some general action items
  actionItems.push({
    title: 'Review competitor strategies',
    description: 'Study top competitor marketing and content approaches',
    priority: 2,
    category: 'marketing',
  });

  return {
    positioning: `Based on the analysis, your site is ${report.overallPosition} compared to ${competitors.length} competitors.`,
    strengths: strengths.length > 0 ? strengths : ['Data collection complete - run full analysis for detailed insights'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['No major weaknesses detected based on available data'],
    threatLevel: competitors.length > 3 ? 'high' : competitors.length > 1 ? 'medium' : 'low',
    opportunities,
    keywordGaps: [],
    contentIdeas: ['Industry trend analysis', 'Competitor comparison guide', 'How-to tutorials'],
    quickWins,
    actionItems,
  };
}

/**
 * Add AI insights to an existing report
 */
export async function enrichReportWithAi(report: RadarReportV2): Promise<RadarReportV2> {
  const insights = await findOpportunities(report);

  return {
    ...report,
    aiInsights: insights,
  };
}

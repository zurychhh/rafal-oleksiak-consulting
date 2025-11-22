// LAMA - UNDERSTAND Analyzer (Was: Clarity)
// User Question: "Will people UNDERSTAND what I offer?"
// Analyzes: H1 clarity, value proposition, navigation, messaging readability

import Anthropic from '@anthropic-ai/sdk';
import type { CategoryScore, Issue } from '../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface ClarityAnalysisResult {
  h1Clarity: {
    score: number; // 0-100
    feedback: string;
  };
  valueProposition: {
    score: number; // 0-100
    feedback: string;
    detected: boolean;
  };
  navigationClarity: {
    score: number; // 0-100
    feedback: string;
  };
  readability: {
    score: number; // 0-100
    feedback: string;
  };
}

export async function analyzeClarity(url: string): Promise<CategoryScore> {
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

    // Extract key content for analysis
    const content = extractContentForAnalysis(html);

    // Use Claude to analyze clarity
    const analysis = await analyzeWithClaude(content, url);

    // Process H1 Clarity
    if (analysis.h1Clarity.score < 70) {
      const severityH1 = analysis.h1Clarity.score < 40 ? 'critical' : 'warning';
      score -= (100 - analysis.h1Clarity.score) * 0.3; // 30% weight

      issues.push({
        severity: severityH1,
        title: 'H1 heading needs improvement',
        description: analysis.h1Clarity.feedback,
        impact: 'Unclear headlines reduce engagement by up to 50%',
      });
    }

    // Process Value Proposition
    if (!analysis.valueProposition.detected || analysis.valueProposition.score < 70) {
      const severityVP = analysis.valueProposition.score < 40 ? 'critical' : 'warning';
      score -= (100 - analysis.valueProposition.score) * 0.35; // 35% weight

      issues.push({
        severity: severityVP,
        title: analysis.valueProposition.detected
          ? 'Value proposition unclear'
          : 'No clear value proposition found',
        description: analysis.valueProposition.feedback,
        impact: 'Missing value prop = 60-80% bounce rate increase',
      });
    }

    // Process Navigation
    if (analysis.navigationClarity.score < 70) {
      const severityNav = analysis.navigationClarity.score < 40 ? 'warning' : 'info';
      score -= (100 - analysis.navigationClarity.score) * 0.2; // 20% weight

      issues.push({
        severity: severityNav,
        title: 'Navigation could be clearer',
        description: analysis.navigationClarity.feedback,
        impact: 'Confusing navigation increases bounce rate by 30%',
      });
    }

    // Process Readability
    if (analysis.readability.score < 70) {
      const severityRead = analysis.readability.score < 40 ? 'warning' : 'info';
      score -= (100 - analysis.readability.score) * 0.15; // 15% weight

      issues.push({
        severity: severityRead,
        title: 'Content readability needs work',
        description: analysis.readability.feedback,
        impact: 'Poor readability = 40% lower comprehension',
      });
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, Math.round(score));

    // Add recommendations based on issues
    const recommendations: string[] = [];

    if (analysis.h1Clarity.score < 70) {
      recommendations.push('Rewrite H1 to clearly state what you do and for whom');
    }

    if (!analysis.valueProposition.detected || analysis.valueProposition.score < 70) {
      recommendations.push('Add clear value proposition above the fold (within first screen)');
    }

    if (analysis.navigationClarity.score < 70) {
      recommendations.push('Simplify navigation - max 5-7 main menu items');
    }

    if (analysis.readability.score < 70) {
      recommendations.push('Break up long paragraphs, use bullet points, add subheadings');
    }

    if (issues.length === 0) {
      recommendations.push('Great clarity! Keep messaging clear and focused.');
    }

    return {
      category: 'Understand',
      score,
      issues,
      recommendations,
    };

  } catch (error) {
    console.error('[LAMA] Clarity analysis failed:', error);

    return {
      category: 'Understand',
      score: 0,
      issues: [{
        severity: 'critical',
        title: 'Clarity analysis failed',
        description: error instanceof Error ? error.message : 'Unable to analyze content clarity',
      }],
      recommendations: ['Ensure website is publicly accessible and Claude API key is configured'],
    };
  }
}

/**
 * Extract relevant content from HTML for Claude analysis
 */
function extractContentForAnalysis(html: string): {
  h1: string;
  navigation: string[];
  firstParagraphs: string;
  metaDescription: string;
} {
  // Extract H1
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';

  // Extract navigation links (simple approach)
  const navMatches = html.match(/<nav[^>]*>(.*?)<\/nav>/is);
  const navigation: string[] = [];

  if (navMatches) {
    const linkMatches = navMatches[1].matchAll(/<a[^>]*>(.*?)<\/a>/gi);
    for (const match of linkMatches) {
      const linkText = match[1].replace(/<[^>]+>/g, '').trim();
      if (linkText && linkText.length > 0 && linkText.length < 50) {
        navigation.push(linkText);
      }
    }
  }

  // Extract first 3 paragraphs after H1
  const paragraphs: string[] = [];
  const pMatches = html.matchAll(/<p[^>]*>(.*?)<\/p>/gi);

  for (const match of pMatches) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text.length > 20) { // Skip very short paragraphs
      paragraphs.push(text);
      if (paragraphs.length >= 3) break;
    }
  }

  const firstParagraphs = paragraphs.join('\n\n');

  // Extract meta description
  const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  const metaDescription = metaMatch ? metaMatch[1] : '';

  return {
    h1,
    navigation,
    firstParagraphs,
    metaDescription,
  };
}

/**
 * Use Claude API to analyze content clarity
 */
async function analyzeWithClaude(
  content: {
    h1: string;
    navigation: string[];
    firstParagraphs: string;
    metaDescription: string;
  },
  url: string
): Promise<ClarityAnalysisResult> {
  const prompt = `You are a website UX expert analyzing content clarity for: ${url}

Content to analyze:
- H1 Heading: "${content.h1}"
- Navigation items: ${content.navigation.join(', ')}
- Meta Description: "${content.metaDescription}"
- First paragraphs: "${content.firstParagraphs}"

Analyze this content and provide scores (0-100) for:

1. H1 CLARITY (0-100):
   - Is it clear what the business does?
   - Does it speak to a specific audience?
   - Is it benefit-focused (not just a company name)?
   Score: [0-100]
   Feedback: [one sentence explaining score]

2. VALUE PROPOSITION (0-100):
   - Is there a clear value proposition visible?
   - Does it answer "why choose us"?
   - Is it specific and compelling?
   Score: [0-100]
   Detected: [yes/no]
   Feedback: [one sentence explaining what's missing or good]

3. NAVIGATION CLARITY (0-100):
   - Are menu items clear and action-oriented?
   - Is it easy to understand where each link goes?
   - Are there too many or too few items?
   Score: [0-100]
   Feedback: [one sentence about navigation]

4. READABILITY (0-100):
   - Is the text easy to scan and understand?
   - Are sentences concise?
   - Is jargon kept to minimum?
   Score: [0-100]
   Feedback: [one sentence about readability]

Respond ONLY in this JSON format (no markdown, no code blocks):
{
  "h1Clarity": {"score": 85, "feedback": "Clear and benefit-focused"},
  "valueProposition": {"score": 70, "detected": true, "feedback": "Value prop exists but could be more specific"},
  "navigationClarity": {"score": 90, "feedback": "Navigation is clear and well-organized"},
  "readability": {"score": 80, "feedback": "Text is scannable with good use of whitespace"}
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : '';

    // Parse Claude's response
    const analysis: ClarityAnalysisResult = JSON.parse(responseText);

    return analysis;

  } catch (error) {
    console.error('[LAMA] Claude API error:', error);

    // Fallback to basic heuristics if Claude fails
    return {
      h1Clarity: {
        score: content.h1 ? 50 : 0,
        feedback: content.h1
          ? 'Unable to analyze with AI (fallback score)'
          : 'No H1 heading found',
      },
      valueProposition: {
        score: 50,
        detected: content.firstParagraphs.length > 0,
        feedback: 'Unable to analyze value proposition (fallback)',
      },
      navigationClarity: {
        score: content.navigation.length > 0 && content.navigation.length < 8 ? 70 : 40,
        feedback: `${content.navigation.length} navigation items detected`,
      },
      readability: {
        score: 50,
        feedback: 'Unable to analyze readability (fallback)',
      },
    };
  }
}

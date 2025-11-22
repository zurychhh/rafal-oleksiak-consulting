// LAMA - CONVERT Analyzer (Was: Conversion)
// User Question: "Will people CONVERT into customers?"
// Analyzes: Forms, CTAs, contact methods, chat widgets, lead capture

import type { CategoryScore, Issue } from '../types';

export async function analyzeConversion(url: string): Promise<CategoryScore> {
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
    const lowercaseHtml = html.toLowerCase();

    // 1. Forms Detection (30% weight)
    const formCount = (html.match(/<form/gi) || []).length;
    const hasInput = lowercaseHtml.includes('<input');
    const hasTextarea = lowercaseHtml.includes('<textarea');
    const hasSubmitButton =
      lowercaseHtml.includes('type="submit"') ||
      lowercaseHtml.includes("type='submit'");

    if (formCount === 0 || !hasInput) {
      score -= 30;
      issues.push({
        severity: 'critical',
        title: 'No contact form found',
        description: 'Could not detect any forms on your website',
        impact: 'Forms are the #1 lead generation tool. Missing form = 70% conversion loss.',
      });
    } else if (formCount === 1) {
      score -= 10;
      issues.push({
        severity: 'warning',
        title: 'Only one form detected',
        description: 'Consider adding forms in multiple places (header, footer, dedicated page)',
        impact: 'Multiple form placements increase lead capture by 50%.',
      });
    }

    if (formCount > 0 && !hasSubmitButton) {
      score -= 10;
      issues.push({
        severity: 'warning',
        title: 'Form might not be functional',
        description: 'Form detected but no submit button found',
        impact: 'Users cannot submit = 100% form abandonment.',
      });
    }

    // 2. CTA Buttons Count (25% weight)
    const ctaPatterns = [
      /button/gi,
      /btn/gi,
      /get started/gi,
      /contact us/gi,
      /learn more/gi,
      /book|zarezerwuj/gi,
      /schedule|umów/gi,
      /try|wypróbuj/gi,
      /download|pobierz/gi,
    ];

    let ctaCount = 0;
    ctaPatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches) ctaCount += matches.length;
    });

    // Normalize CTA count (more than 3 is good)
    if (ctaCount === 0) {
      score -= 25;
      issues.push({
        severity: 'critical',
        title: 'No clear CTAs detected',
        description: 'Could not find call-to-action buttons',
        impact: 'No CTAs = users don\'t know what to do next. ~80% conversion loss.',
      });
    } else if (ctaCount < 3) {
      score -= 15;
      issues.push({
        severity: 'warning',
        title: 'Not enough CTAs',
        description: `Only ${ctaCount} CTA(s) detected. Aim for at least 3-5 throughout the page`,
        impact: 'More CTAs (strategically placed) increase conversions by 35%.',
      });
    } else if (ctaCount > 15) {
      score -= 10;
      issues.push({
        severity: 'info',
        title: 'Too many CTAs might overwhelm',
        description: `${ctaCount} CTAs detected. Consider reducing to avoid choice paralysis`,
        impact: 'Too many options can reduce conversions by 20% (paradox of choice).',
      });
    }

    // 3. Direct Contact Methods (25% weight)
    const contactMethods = {
      emailLinks: (html.match(/mailto:/gi) || []).length,
      phoneLinks: (html.match(/tel:/gi) || []).length,
      whatsappLinks: lowercaseHtml.includes('whatsapp') || lowercaseHtml.includes('wa.me'),
    };

    const totalContactMethods =
      (contactMethods.emailLinks > 0 ? 1 : 0) +
      (contactMethods.phoneLinks > 0 ? 1 : 0) +
      (contactMethods.whatsappLinks ? 1 : 0);

    if (totalContactMethods === 0) {
      score -= 25;
      issues.push({
        severity: 'critical',
        title: 'No direct contact methods',
        description: 'No mailto: or tel: links found',
        impact: 'Click-to-call and click-to-email increase mobile conversions by 60%.',
      });
    } else if (totalContactMethods === 1) {
      score -= 10;
      issues.push({
        severity: 'warning',
        title: 'Limited contact options',
        description: 'Add more contact methods (email, phone, WhatsApp)',
        impact: 'Multiple contact methods increase lead generation by 40%.',
      });
    }

    // 4. Chat Widget / Live Chat (20% weight)
    const chatWidgets = [
      'livechat',
      'intercom',
      'drift',
      'tawk.to',
      'crisp',
      'zendesk',
      'olark',
      'tidio',
      'live chat',
      'livesupport',
    ];

    const hasChatWidget = chatWidgets.some(widget =>
      lowercaseHtml.includes(widget.toLowerCase())
    );

    if (!hasChatWidget) {
      score -= 20;
      issues.push({
        severity: 'info',
        title: 'No live chat widget detected',
        description: 'Consider adding live chat for instant support',
        impact: 'Live chat increases conversions by 38% and reduces bounce rate by 20%.',
      });
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, Math.round(score));

    // Build recommendations
    const recommendations: string[] = [];

    if (formCount === 0) {
      recommendations.push('Add a contact form above the fold (first screen) immediately');
    }

    if (ctaCount < 3) {
      recommendations.push('Add more CTAs: hero section, mid-page, and footer minimum');
    }

    if (totalContactMethods < 2) {
      recommendations.push('Add clickable email (mailto:) and phone (tel:) links');
    }

    if (!hasChatWidget) {
      recommendations.push('Consider adding live chat (Intercom, Drift, Tidio) for instant engagement');
    }

    if (formCount > 0 && ctaCount >= 3 && totalContactMethods >= 2) {
      recommendations.push('Add A/B testing to optimize CTA copy and form placement');
    }

    if (issues.length === 0) {
      recommendations.push('Great conversion setup! Monitor analytics to optimize further.');
    }

    return {
      category: 'Convert',
      score,
      issues,
      recommendations,
    };

  } catch (error) {
    console.error('[LAMA] Conversion analysis failed:', error);

    return {
      category: 'Convert',
      score: 0,
      issues: [{
        severity: 'critical',
        title: 'Conversion analysis failed',
        description: error instanceof Error ? error.message : 'Unable to analyze conversion elements',
      }],
      recommendations: ['Ensure website is publicly accessible'],
    };
  }
}

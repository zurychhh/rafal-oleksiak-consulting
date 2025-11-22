// LAMA - TRUST Analyzer
// User Question: "Will people TRUST my business?"
// Analyzes: SSL certificate, privacy policy, contact info, testimonials, badges

import type { CategoryScore, Issue } from '../types';

export async function analyzeTrust(url: string): Promise<CategoryScore> {
  const issues: Issue[] = [];
  let score = 100;

  try {
    // Parse URL to check SSL
    const urlObj = new URL(url);
    const isHTTPS = urlObj.protocol === 'https:';

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

    // 1. SSL Certificate Check (25% weight)
    if (!isHTTPS) {
      score -= 25;
      issues.push({
        severity: 'critical',
        title: 'No SSL certificate (not HTTPS)',
        description: 'Your website is not using HTTPS, which is a major security red flag',
        impact: 'Google penalizes non-HTTPS sites. Users see "Not Secure" warning. ~40% trust loss.',
      });
    }

    // 2. Privacy Policy Detection (20% weight)
    const hasPrivacyPolicy =
      lowercaseHtml.includes('privacy policy') ||
      lowercaseHtml.includes('privacy-policy') ||
      lowercaseHtml.includes('privacypolicy') ||
      lowercaseHtml.includes('/privacy');

    if (!hasPrivacyPolicy) {
      score -= 20;
      issues.push({
        severity: 'warning',
        title: 'No privacy policy found',
        description: 'Could not detect a privacy policy link on your website',
        impact: 'Required by law (GDPR, CCPA). Missing = legal risk + trust issues.',
      });
    }

    // 3. Contact Information Detection (30% weight)
    const contactSignals = {
      email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(html),
      phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(html),
      contactPage: lowercaseHtml.includes('contact') || lowercaseHtml.includes('kontakt'),
      address: lowercaseHtml.includes('address') || lowercaseHtml.includes('adres') ||
               lowercaseHtml.includes('street') || lowercaseHtml.includes('ulica'),
    };

    const contactScore = Object.values(contactSignals).filter(Boolean).length;

    if (contactScore === 0) {
      score -= 30;
      issues.push({
        severity: 'critical',
        title: 'No contact information found',
        description: 'Could not find email, phone, or contact page',
        impact: 'No way to reach you = instant credibility loss. ~60% of users won\'t trust.',
      });
    } else if (contactScore === 1) {
      score -= 20;
      issues.push({
        severity: 'warning',
        title: 'Limited contact information',
        description: 'Only found 1 type of contact info (email, phone, or address)',
        impact: 'More contact options = higher trust. Add at least 2-3 ways to reach you.',
      });
    } else if (contactScore === 2) {
      score -= 10;
      issues.push({
        severity: 'info',
        title: 'Good contact info, could be better',
        description: 'Found 2 contact methods. Consider adding more for maximum trust.',
        impact: 'Adding all contact types (email, phone, address) boosts conversions by 15%.',
      });
    }

    // 4. Social Proof / Testimonials Detection (15% weight)
    const hasSocialProof =
      lowercaseHtml.includes('testimonial') ||
      lowercaseHtml.includes('review') ||
      lowercaseHtml.includes('client') ||
      lowercaseHtml.includes('customer') ||
      lowercaseHtml.includes('5 star') ||
      lowercaseHtml.includes('★★★') ||
      lowercaseHtml.includes('rating') ||
      lowercaseHtml.includes('opinie') ||
      lowercaseHtml.includes('referencje');

    if (!hasSocialProof) {
      score -= 15;
      issues.push({
        severity: 'warning',
        title: 'No social proof detected',
        description: 'Could not find testimonials, reviews, or client logos',
        impact: 'Social proof increases conversions by 34%. Add customer testimonials!',
      });
    }

    // 5. Trust Badges / Certifications (10% weight)
    const hasTrustBadges =
      lowercaseHtml.includes('certified') ||
      lowercaseHtml.includes('verified') ||
      lowercaseHtml.includes('accredited') ||
      lowercaseHtml.includes('iso') ||
      lowercaseHtml.includes('award') ||
      lowercaseHtml.includes('certyfikat');

    if (!hasTrustBadges) {
      score -= 10;
      issues.push({
        severity: 'info',
        title: 'No trust badges found',
        description: 'Could not detect industry certifications or trust seals',
        impact: 'Trust badges increase perceived credibility by 25%.',
      });
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, Math.round(score));

    // Build recommendations
    const recommendations: string[] = [];

    if (!isHTTPS) {
      recommendations.push('Enable HTTPS immediately - it\'s free with Let\'s Encrypt or most hosting providers');
    }

    if (!hasPrivacyPolicy) {
      recommendations.push('Add privacy policy (use generators like termly.io or iubenda)');
    }

    if (contactScore < 3) {
      recommendations.push('Add complete contact info: email, phone, and physical address');
    }

    if (!hasSocialProof) {
      recommendations.push('Add testimonials from real clients with photos and company names');
    }

    if (!hasTrustBadges) {
      recommendations.push('Display relevant certifications, awards, or industry memberships');
    }

    if (issues.length === 0) {
      recommendations.push('Excellent trust signals! Keep maintaining transparency and accessibility.');
    }

    return {
      category: 'Trust',
      score,
      issues,
      recommendations,
    };

  } catch (error) {
    console.error('[LAMA] Trust analysis failed:', error);

    return {
      category: 'Trust',
      score: 0,
      issues: [{
        severity: 'critical',
        title: 'Trust analysis failed',
        description: error instanceof Error ? error.message : 'Unable to analyze trust signals',
      }],
      recommendations: ['Ensure website is publicly accessible'],
    };
  }
}

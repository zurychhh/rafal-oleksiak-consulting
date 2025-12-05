// LAMA - ENGAGE Analyzer (CRM & Marketing Automation Maturity)
// User Question: "How mature is my CRM & marketing automation setup?"
// Analyzes: Email marketing, GDPR consent, marketing automation, MarTech stack

import type { CategoryScore, Issue } from '../types';

interface EmailMarketingDetection {
  detected: boolean;
  provider: string | null;
  signupForm: boolean;
  score: number;
}

interface ConsentDetection {
  detected: boolean;
  cookieBanner: boolean;
  privacyPolicy: boolean;
  consentCheckbox: boolean;
  cmp: string | null;
  score: number;
}

interface MarketingAutomationDetection {
  detected: boolean;
  tools: string[];
  score: number;
}

interface MartechStackDetection {
  toolCount: number;
  tools: string[];
  hasGTM: boolean;
  score: number;
}

export async function analyzeEngagement(url: string): Promise<CategoryScore> {
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

    // 1. Email Marketing Detection (25% weight)
    const emailMarketing = detectEmailMarketing(html);
    if (!emailMarketing.detected) {
      score -= 25;
      issues.push({
        severity: 'warning',
        title: 'No email marketing platform detected',
        description: 'Missing newsletter signup form or email service provider integration',
        impact: 'Email marketing generates 25-30% of digital revenue for B2B companies',
      });
    } else if (emailMarketing.score < 70) {
      score -= (100 - emailMarketing.score) * 0.25;
      issues.push({
        severity: 'info',
        title: `Email marketing setup incomplete (${emailMarketing.provider})`,
        description: emailMarketing.signupForm
          ? 'Email provider detected but signup form could be improved'
          : 'Email provider detected but no signup form found',
        impact: 'Incomplete email marketing setup reduces list growth by 40-60%',
      });
    }

    // 2. GDPR Consent Management (30% weight - CRITICAL)
    const consent = detectConsentMechanism(html);
    if (!consent.detected) {
      score -= 30;
      issues.push({
        severity: 'critical',
        title: 'No GDPR consent mechanism detected',
        description: 'Missing cookie consent banner and marketing consent checkboxes',
        impact: 'GDPR non-compliance = fines up to €20M or 4% of annual revenue',
      });
    } else if (consent.score < 70) {
      score -= (100 - consent.score) * 0.3;
      const missing = [];
      if (!consent.cookieBanner) missing.push('cookie banner');
      if (!consent.privacyPolicy) missing.push('privacy policy link');
      if (!consent.consentCheckbox) missing.push('marketing consent checkbox');

      issues.push({
        severity: consent.score < 40 ? 'critical' : 'warning',
        title: 'Incomplete GDPR compliance',
        description: `Missing: ${missing.join(', ')}`,
        impact: 'Partial compliance still exposes to regulatory risk and user distrust',
      });
    }

    // 3. Marketing Automation (25% weight)
    const automation = detectMarketingAutomation(html);
    if (!automation.detected) {
      score -= 25;
      issues.push({
        severity: 'warning',
        title: 'No marketing automation detected',
        description: 'Missing CRM, personalization, or behavioral tracking tools',
        impact: 'Manual processes cost 10-15 hours/week in lost productivity',
      });
    } else if (automation.score < 70) {
      score -= (100 - automation.score) * 0.25;
      issues.push({
        severity: 'info',
        title: 'Basic marketing automation only',
        description: `Found: ${automation.tools.join(', ')}. Consider adding CRM and personalization.`,
        impact: 'Companies with mature automation convert 2-3x better than basic setups',
      });
    }

    // 4. MarTech Stack Integration (20% weight)
    const martech = detectMartechStack(html);
    if (martech.toolCount < 3) {
      score -= 20;
      issues.push({
        severity: 'info',
        title: 'Limited MarTech stack',
        description: `Only ${martech.toolCount} marketing tool${martech.toolCount === 1 ? '' : 's'} detected`,
        impact: 'Competitors with mature stacks (5+ tools) convert 2-3x better',
      });
    } else if (martech.score < 70) {
      score -= (100 - martech.score) * 0.2;
      issues.push({
        severity: 'info',
        title: 'MarTech stack could be optimized',
        description: `${martech.toolCount} tools detected but missing tag manager or key integrations`,
        impact: 'Unmanaged tools create data silos and slow down marketing operations',
      });
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, Math.round(score));

    // Generate recommendations
    const recommendations: string[] = [];

    if (!consent.detected || consent.score < 70) {
      recommendations.push('Implement GDPR-compliant consent management (OneTrust, Cookiebot)');
    }

    if (!emailMarketing.detected || emailMarketing.score < 70) {
      recommendations.push('Set up email marketing platform (HubSpot, Klaviyo, Mailchimp)');
    }

    if (!automation.detected || automation.score < 70) {
      recommendations.push('Integrate CRM and marketing automation (HubSpot, Salesforce)');
    }

    if (martech.toolCount < 3 || !martech.hasGTM) {
      recommendations.push('Implement Google Tag Manager for easier tool management');
    }

    if (martech.toolCount >= 3 && automation.detected && emailMarketing.detected && consent.detected) {
      recommendations.push('Optimize data flow between marketing tools for better attribution');
    }

    if (issues.length === 0) {
      recommendations.push('Excellent CRM maturity! Focus on optimization and advanced personalization.');
    }

    return {
      category: 'Engage',
      score,
      issues,
      recommendations,
    };

  } catch (error) {
    console.error('[LAMA] Engagement analysis failed:', error);

    return {
      category: 'Engage',
      score: 0,
      issues: [{
        severity: 'critical',
        title: 'Engagement analysis failed',
        description: error instanceof Error ? error.message : 'Unable to analyze CRM & marketing automation',
      }],
      recommendations: ['Ensure website is publicly accessible for CRM maturity assessment'],
    };
  }
}

/**
 * Detect email marketing platforms and signup forms
 */
function detectEmailMarketing(html: string): EmailMarketingDetection {
  const providers = [
    { name: 'Mailchimp', pattern: /cdn\.list-manage\.com|mailchimp/i },
    { name: 'Klaviyo', pattern: /static\.klaviyo\.com|klaviyo/i },
    { name: 'HubSpot', pattern: /js\.hs-analytics\.net|hubspot.*?forms/i },
    { name: 'SendGrid', pattern: /sendgrid/i },
    { name: 'ActiveCampaign', pattern: /trackcmp\.net|activecampaign/i },
    { name: 'ConvertKit', pattern: /convertkit/i },
    { name: 'Drip', pattern: /drip\.com/i },
    { name: 'MailerLite', pattern: /mailerlite/i },
  ];

  let detectedProvider: string | null = null;
  for (const provider of providers) {
    if (provider.pattern.test(html)) {
      detectedProvider = provider.name;
      break;
    }
  }

  // Check for newsletter/email signup forms
  const signupForm =
    /newsletter|subscribe|email.*?signup|signup.*?email|join.*?list/i.test(html) &&
    /<input[^>]*type=["']email["']/i.test(html);

  let score = 0;
  if (detectedProvider && signupForm) {
    score = 100; // Perfect setup
  } else if (detectedProvider) {
    score = 60; // Provider but no visible signup form
  } else if (signupForm) {
    score = 40; // Signup form but no known provider (might be custom)
  }

  return {
    detected: detectedProvider !== null || signupForm,
    provider: detectedProvider,
    signupForm,
    score,
  };
}

/**
 * Detect GDPR consent mechanisms
 */
function detectConsentMechanism(html: string): ConsentDetection {
  // Cookie banner detection
  const cookieBanner =
    /cookie|consent|gdpr|privacy.*?banner|banner.*?privacy/i.test(html);

  // Privacy policy link
  const privacyPolicy =
    /<a[^>]*href[^>]*privacy[^>]*>|privacy.*?policy/i.test(html);

  // Marketing consent checkbox in forms
  const consentCheckbox =
    /<input[^>]*type=["']checkbox["'][^>]*consent|consent[^>]*checkbox/i.test(html);

  // Consent Management Platforms
  const cmps = [
    { name: 'OneTrust', pattern: /onetrust/i },
    { name: 'Cookiebot', pattern: /cookiebot/i },
    { name: 'Termly', pattern: /termly/i },
    { name: 'Iubenda', pattern: /iubenda/i },
    { name: 'CookieYes', pattern: /cookieyes/i },
    { name: 'Osano', pattern: /osano/i },
  ];

  let detectedCMP: string | null = null;
  for (const cmp of cmps) {
    if (cmp.pattern.test(html)) {
      detectedCMP = cmp.name;
      break;
    }
  }

  // Scoring logic
  let score = 0;
  const elements = [cookieBanner, privacyPolicy, consentCheckbox, detectedCMP !== null];
  const detectedCount = elements.filter(Boolean).length;

  if (detectedCMP && cookieBanner && privacyPolicy) {
    score = 100; // Full CMP with proper implementation
  } else if (detectedCount === 3) {
    score = 75; // Most elements present
  } else if (detectedCount === 2) {
    score = 50; // Partial implementation
  } else if (detectedCount === 1) {
    score = 25; // Minimal compliance
  }

  return {
    detected: detectedCount > 0,
    cookieBanner,
    privacyPolicy,
    consentCheckbox,
    cmp: detectedCMP,
    score,
  };
}

/**
 * Detect marketing automation and personalization tools
 */
function detectMarketingAutomation(html: string): MarketingAutomationDetection {
  const tools: string[] = [];

  const automationTools = [
    { name: 'HubSpot CRM', pattern: /hs-analytics|hubspot.*?tracking/i },
    { name: 'Salesforce Pardot', pattern: /pardot|pi\.pardot\.com/i },
    { name: 'Marketo', pattern: /marketo/i },
    { name: 'Segment', pattern: /segment\.com|segment\.io/i },
    { name: 'Hotjar', pattern: /hotjar\.com/i },
    { name: 'FullStory', pattern: /fullstory/i },
    { name: 'Intercom', pattern: /intercom/i },
    { name: 'Drift', pattern: /drift\.com/i },
    { name: 'Optimizely', pattern: /optimizely/i },
    { name: 'Google Optimize', pattern: /optimize\.google\.com/i },
    { name: 'VWO', pattern: /visualwebsiteoptimizer|vwo\.com/i },
    { name: 'Mixpanel', pattern: /mixpanel/i },
    { name: 'Amplitude', pattern: /amplitude/i },
  ];

  for (const tool of automationTools) {
    if (tool.pattern.test(html)) {
      tools.push(tool.name);
    }
  }

  // Exit-intent and personalization detection
  if (/exit.*?intent|bounce.*?track/i.test(html)) {
    tools.push('Exit-intent tracking');
  }

  if (/personali[sz]ation|dynamic.*?content/i.test(html)) {
    tools.push('Personalization engine');
  }

  let score = 0;
  if (tools.length >= 4) {
    score = 100; // Mature automation stack
  } else if (tools.length === 3) {
    score = 75;
  } else if (tools.length === 2) {
    score = 50;
  } else if (tools.length === 1) {
    score = 30; // Basic tracking only
  }

  return {
    detected: tools.length > 0,
    tools,
    score,
  };
}

/**
 * Detect overall MarTech stack maturity
 */
function detectMartechStack(html: string): MartechStackDetection {
  const tools: string[] = [];

  const martechTools = [
    { name: 'Google Tag Manager', pattern: /googletagmanager\.com|gtm\.js/i },
    { name: 'Google Analytics 4', pattern: /gtag\/js|analytics\.google\.com/i },
    { name: 'Facebook Pixel', pattern: /facebook.*?pixel|fbevents\.js/i },
    { name: 'LinkedIn Insight', pattern: /linkedin.*?insight|snap\.licdn\.com/i },
    { name: 'Twitter Pixel', pattern: /twitter.*?pixel|analytics\.twitter\.com/i },
    { name: 'TikTok Pixel', pattern: /tiktok.*?pixel|analytics\.tiktok\.com/i },
    { name: 'Crazy Egg', pattern: /crazyegg/i },
    { name: 'Lucky Orange', pattern: /luckyorange/i },
    { name: 'Heap Analytics', pattern: /heapanalytics/i },
    { name: 'Pendo', pattern: /pendo/i },
  ];

  for (const tool of martechTools) {
    if (tool.pattern.test(html)) {
      tools.push(tool.name);
    }
  }

  const hasGTM = /googletagmanager\.com|gtm\.js/i.test(html);

  let score = 0;
  const toolCount = tools.length;

  if (toolCount >= 6 && hasGTM) {
    score = 100; // Mature, well-managed stack
  } else if (toolCount >= 4) {
    score = 75;
  } else if (toolCount >= 3) {
    score = 50;
  } else if (toolCount >= 2) {
    score = 30;
  } else if (toolCount === 1) {
    score = 20; // Basic analytics only
  }

  return {
    toolCount,
    tools,
    hasGTM,
    score,
  };
}

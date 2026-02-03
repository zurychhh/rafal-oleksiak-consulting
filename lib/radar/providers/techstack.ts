// RADAR 2.0 - Tech Stack Detection Provider
// Free, unlimited - pattern matching on HTML and headers
// Inspired by Wappalyzer

import type { TechStackResult, ProviderResult, TechIntelligence, HeadersResult } from '../types-v2';

const USER_AGENT = 'RADAR-Bot/2.0 (+https://oleksiakconsulting.com)';

// Tech detection patterns
const TECH_PATTERNS = {
  // CMS
  cms: [
    { name: 'WordPress', patterns: ['wp-content', 'wp-includes', 'wordpress'] },
    { name: 'Shopify', patterns: ['cdn.shopify', 'shopify.com', 'myshopify'] },
    { name: 'Wix', patterns: ['wix.com', 'wixsite.com', 'parastorage.com'] },
    { name: 'Squarespace', patterns: ['squarespace.com', 'sqsp.net', 'squarespace-cdn'] },
    { name: 'Webflow', patterns: ['webflow.com', 'assets.website-files'] },
    { name: 'Ghost', patterns: ['ghost.io', 'ghost.org'] },
    { name: 'Drupal', patterns: ['drupal.js', 'drupal.org'] },
    { name: 'Joomla', patterns: ['joomla', '/components/com_'] },
    { name: 'HubSpot CMS', patterns: ['hs-scripts.com', 'hubspot.net', 'hscollectedforms'] },
    { name: 'Contentful', patterns: ['contentful.com', 'ctfassets.net'] },
  ],

  // Frameworks
  framework: [
    { name: 'Next.js', patterns: ['_next/', '__next', 'next/static'] },
    { name: 'React', patterns: ['react-dom', 'data-reactroot', '__REACT_DEVTOOLS'] },
    { name: 'Vue.js', patterns: ['vue.js', 'vue.min.js', 'data-v-', '__VUE__'] },
    { name: 'Angular', patterns: ['ng-version', 'angular.io', 'ng-'] },
    { name: 'Svelte', patterns: ['svelte', '__svelte'] },
    { name: 'Nuxt.js', patterns: ['_nuxt/', '__nuxt'] },
    { name: 'Gatsby', patterns: ['gatsby', '/static/'] },
    { name: 'Remix', patterns: ['remix.run', '__remix'] },
    { name: 'Astro', patterns: ['astro', '/_astro/'] },
  ],

  // Analytics
  analytics: [
    { name: 'Google Analytics', patterns: ['google-analytics.com', 'gtag', 'ga.js', 'analytics.js'] },
    { name: 'GA4', patterns: ['googletagmanager.com', 'gtag/js'] },
    { name: 'Hotjar', patterns: ['hotjar.com', 'static.hotjar.com'] },
    { name: 'Mixpanel', patterns: ['mixpanel.com', 'api.mixpanel.com'] },
    { name: 'Amplitude', patterns: ['amplitude.com', 'cdn.amplitude.com'] },
    { name: 'Segment', patterns: ['segment.com', 'cdn.segment.com'] },
    { name: 'Heap', patterns: ['heap.io', 'heapanalytics.com'] },
    { name: 'FullStory', patterns: ['fullstory.com', 'fullstory.js'] },
    { name: 'Plausible', patterns: ['plausible.io'] },
    { name: 'Fathom', patterns: ['usefathom.com', 'cdn.usefathom.com'] },
  ],

  // Marketing
  marketing: [
    { name: 'HubSpot', patterns: ['hs-scripts.com', 'hubspot.net', 'hs-analytics'] },
    { name: 'Intercom', patterns: ['intercom.io', 'intercomcdn.com', 'widget.intercom.io'] },
    { name: 'Crisp', patterns: ['crisp.chat', 'client.crisp.chat'] },
    { name: 'Drift', patterns: ['drift.com', 'js.driftt.com'] },
    { name: 'Zendesk', patterns: ['zendesk.com', 'zdassets.com'] },
    { name: 'LiveChat', patterns: ['livechatinc.com', 'livechat.com'] },
    { name: 'Mailchimp', patterns: ['mailchimp.com', 'list-manage.com'] },
    { name: 'ConvertKit', patterns: ['convertkit.com', 'convertkit-mail'] },
    { name: 'Klaviyo', patterns: ['klaviyo.com', 'a.klaviyo.com'] },
    { name: 'ActiveCampaign', patterns: ['activecampaign.com', 'trackcmp.net'] },
    { name: 'Calendly', patterns: ['calendly.com', 'assets.calendly.com'] },
  ],

  // CDN
  cdn: [
    { name: 'Cloudflare', patterns: ['cloudflare.com', 'cdnjs.cloudflare.com', 'cf-'] },
    { name: 'AWS CloudFront', patterns: ['cloudfront.net', 'amazonaws.com'] },
    { name: 'Fastly', patterns: ['fastly.net', 'fastly.com'] },
    { name: 'Akamai', patterns: ['akamai.net', 'akamaihd.net', 'akamaized.net'] },
    { name: 'Vercel', patterns: ['vercel.app', 'vercel-analytics'] },
    { name: 'Netlify', patterns: ['netlify.app', 'netlify.com'] },
  ],

  // E-commerce
  ecommerce: [
    { name: 'Shopify', patterns: ['shopify.com', 'myshopify.com'] },
    { name: 'WooCommerce', patterns: ['woocommerce', 'wc-ajax'] },
    { name: 'Magento', patterns: ['magento', 'mage/'] },
    { name: 'BigCommerce', patterns: ['bigcommerce.com', 'bigcommerce-stencil'] },
    { name: 'PrestaShop', patterns: ['prestashop', 'presta'] },
    { name: 'Stripe', patterns: ['stripe.com', 'js.stripe.com'] },
    { name: 'PayPal', patterns: ['paypal.com', 'paypalobjects.com'] },
  ],
};

/**
 * Detect tech stack from HTML content
 */
export function detectFromHtml(html: string): TechStackResult {
  const htmlLower = html.toLowerCase();

  const result: TechStackResult = {
    cms: null,
    framework: null,
    analytics: [],
    marketing: [],
    cdn: null,
    hosting: null,
    ecommerce: null,
    other: [],
  };

  // Detect CMS
  for (const tech of TECH_PATTERNS.cms) {
    if (tech.patterns.some((p) => htmlLower.includes(p.toLowerCase()))) {
      result.cms = tech.name;
      break;
    }
  }

  // Detect Framework
  for (const tech of TECH_PATTERNS.framework) {
    if (tech.patterns.some((p) => htmlLower.includes(p.toLowerCase()))) {
      result.framework = tech.name;
      break;
    }
  }

  // Detect Analytics (can have multiple)
  for (const tech of TECH_PATTERNS.analytics) {
    if (tech.patterns.some((p) => htmlLower.includes(p.toLowerCase()))) {
      if (!result.analytics.includes(tech.name)) {
        result.analytics.push(tech.name);
      }
    }
  }

  // Detect Marketing (can have multiple)
  for (const tech of TECH_PATTERNS.marketing) {
    if (tech.patterns.some((p) => htmlLower.includes(p.toLowerCase()))) {
      if (!result.marketing.includes(tech.name)) {
        result.marketing.push(tech.name);
      }
    }
  }

  // Detect CDN
  for (const tech of TECH_PATTERNS.cdn) {
    if (tech.patterns.some((p) => htmlLower.includes(p.toLowerCase()))) {
      result.cdn = tech.name;
      break;
    }
  }

  // Detect E-commerce
  for (const tech of TECH_PATTERNS.ecommerce) {
    if (tech.patterns.some((p) => htmlLower.includes(p.toLowerCase()))) {
      result.ecommerce = tech.name;
      break;
    }
  }

  return result;
}

/**
 * Detect tech from HTTP headers
 */
export function detectFromHeaders(headers: Headers): Partial<TechStackResult> {
  const result: Partial<TechStackResult> = {
    cdn: null,
    hosting: null,
  };

  // Server header
  const server = headers.get('server')?.toLowerCase() || '';
  const poweredBy = headers.get('x-powered-by')?.toLowerCase() || '';

  // Detect CDN from headers
  if (headers.get('cf-ray') || server.includes('cloudflare')) {
    result.cdn = 'Cloudflare';
  } else if (headers.get('x-vercel-id') || server.includes('vercel')) {
    result.cdn = 'Vercel';
    result.hosting = 'Vercel';
  } else if (server.includes('netlify')) {
    result.cdn = 'Netlify';
    result.hosting = 'Netlify';
  } else if (server.includes('cloudfront')) {
    result.cdn = 'AWS CloudFront';
  }

  // Detect hosting from headers
  if (!result.hosting) {
    if (server.includes('nginx')) result.hosting = 'Nginx';
    else if (server.includes('apache')) result.hosting = 'Apache';
    else if (poweredBy.includes('express')) result.hosting = 'Express/Node.js';
    else if (poweredBy.includes('php')) result.hosting = 'PHP';
  }

  return result;
}

/**
 * Analyze HTTP headers for security and performance
 */
export function analyzeHeaders(headers: Headers): HeadersResult {
  return {
    server: headers.get('server'),
    poweredBy: headers.get('x-powered-by'),
    cacheControl: headers.get('cache-control'),
    contentType: headers.get('content-type'),
    security: {
      hsts: !!headers.get('strict-transport-security'),
      xFrameOptions: headers.get('x-frame-options'),
      xContentTypeOptions: headers.get('x-content-type-options') === 'nosniff',
      csp: !!headers.get('content-security-policy'),
    },
    performance: {
      compression: headers.get('content-encoding'),
      http2: false, // Can't detect from headers alone
    },
  };
}

/**
 * Full tech stack analysis for a URL
 */
export async function analyzeTechStack(url: string): Promise<ProviderResult<TechStackResult>> {
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch URL: ${response.status}`,
      };
    }

    const html = await response.text();

    // Detect from HTML
    const htmlResult = detectFromHtml(html);

    // Detect from headers
    const headerResult = detectFromHeaders(response.headers);

    // Merge results (headers take precedence for CDN/hosting)
    return {
      success: true,
      data: {
        ...htmlResult,
        cdn: headerResult.cdn || htmlResult.cdn,
        hosting: headerResult.hosting || htmlResult.hosting,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Tech stack analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Build tech intelligence
 */
export async function buildTechIntelligence(url: string): Promise<ProviderResult<TechIntelligence>> {
  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  try {
    const response = await fetch(fullUrl, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(15000),
    });

    const html = await response.text();

    // Detect tech
    const techResult = detectFromHtml(html);
    const headerResult = detectFromHeaders(response.headers);
    const headersAnalysis = analyzeHeaders(response.headers);

    // Check SSL
    const isHttps = fullUrl.startsWith('https://');

    // Count security headers
    let securityHeaders = 0;
    if (headersAnalysis.security.hsts) securityHeaders++;
    if (headersAnalysis.security.xFrameOptions) securityHeaders++;
    if (headersAnalysis.security.xContentTypeOptions) securityHeaders++;
    if (headersAnalysis.security.csp) securityHeaders++;

    return {
      success: true,
      data: {
        cms: techResult.cms,
        framework: techResult.framework,
        analytics: techResult.analytics,
        marketing: techResult.marketing,
        cdn: headerResult.cdn || techResult.cdn,
        hosting: headerResult.hosting || techResult.hosting,
        ecommerce: techResult.ecommerce,
        security: {
          ssl: isHttps,
          hsts: headersAnalysis.security.hsts,
          securityHeaders,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Tech intelligence failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

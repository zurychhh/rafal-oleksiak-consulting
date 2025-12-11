/**
 * Test script to generate a sample LAMA PRO PDF report
 * Run with: npx tsx app/lib/lama/pro/test-pdf-generation.ts
 */

import { renderToBuffer } from '@react-pdf/renderer';
import { LAMAProReport } from './pdf/LAMAProReport';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';

// Mock data for testing
const mockReportData = {
  websiteUrl: 'https://example-company.com',
  companyName: 'Example Company Inc.',
  overallScore: 67,
  generatedDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  estimatedRevenueLoss: 85000,
  recoverable: 63750, // 75% of loss
  keyFindings: [
    'Missing critical SEO meta tags reducing organic visibility by ~30%',
    'Page load time exceeds 5 seconds on mobile devices (85th percentile)',
    'Unclear value proposition above the fold - visitors leave within 8 seconds',
    'No visible trust signals (testimonials, certifications) on landing pages',
    'Contact forms lack GDPR-compliant consent mechanisms',
    'No email marketing automation detected - missing nurture opportunities',
  ],
  categories: [
    {
      category: 'Find' as const,
      score: 55,
      description: 'SEO optimization and organic discoverability',
      issues: [
        {
          description: 'Missing Meta Title on 3 key landing pages',
          severity: 'high' as const,
        },
        {
          description: 'Meta Description missing on homepage',
          severity: 'high' as const,
        },
        {
          description: 'No H1 heading detected on /services page',
          severity: 'high' as const,
        },
        {
          description: 'Sitemap.xml returns 404 error',
          severity: 'medium' as const,
        },
        {
          description: 'Robots.txt not configured optimally',
          severity: 'low' as const,
        },
      ],
      solutions: [
        {
          title: 'Add Optimized Meta Tags to All Pages',
          description:
            'Meta tags are critical for search engine rankings and click-through rates. Each page needs unique, keyword-optimized titles and descriptions.',
          priority: 'high' as const,
          implementation:
            '1. Research target keywords for each page\n2. Write compelling 50-60 character titles\n3. Create 150-160 character descriptions\n4. Add to <head> section of each page\n5. Test in Google Search Console',
          codeExample: `<!-- Homepage Example -->
<head>
  <title>Professional CRM Consulting | Boost Revenue by 40%</title>
  <meta name="description" content="Expert CRM strategy and marketing automation. Proven ROI with Fortune 500 clients. Free audit available." />
</head>`,
          estimatedImpact:
            'Improved rankings can increase organic traffic by 25-40% within 3 months. At €50/lead, this translates to ~€15,000-20,000/year additional revenue.',
        },
        {
          title: 'Create and Submit XML Sitemap',
          description:
            'An XML sitemap helps search engines discover and index your content efficiently. Essential for technical SEO.',
          priority: 'high' as const,
          implementation:
            '1. Generate sitemap using Next.js sitemap generator\n2. Include all important pages (exclude admin/test pages)\n3. Submit to Google Search Console and Bing Webmaster Tools\n4. Add sitemap URL to robots.txt',
          codeExample: `// app/sitemap.ts (Next.js 13+)
export default function sitemap() {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://example.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}`,
          estimatedImpact:
            'Faster indexing of new content and improved crawl efficiency. Can reduce time-to-rank from 4-6 weeks to 1-2 weeks.',
        },
      ],
    },
    {
      category: 'Stay' as const,
      score: 48,
      description: 'Website performance and loading speed',
      issues: [
        {
          description: 'Largest Contentful Paint (LCP) is 5.2s (target: <2.5s)',
          severity: 'high' as const,
        },
        {
          description: 'First Input Delay (FID) is 180ms (target: <100ms)',
          severity: 'medium' as const,
        },
        {
          description: 'Cumulative Layout Shift (CLS) is 0.18 (target: <0.1)',
          severity: 'medium' as const,
        },
        {
          description: 'Unoptimized images total 4.2MB on homepage',
          severity: 'high' as const,
        },
      ],
      solutions: [
        {
          title: 'Optimize Images with Next.js Image Component',
          description:
            'Large unoptimized images are the #1 cause of slow page loads. Next.js Image automatically optimizes and serves WebP format.',
          priority: 'high' as const,
          implementation:
            '1. Replace all <img> tags with Next.js <Image>\n2. Specify width and height to prevent layout shift\n3. Use priority prop for above-the-fold images\n4. Enable automatic WebP conversion',
          codeExample: `import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1200}
  height={600}
  priority // Load immediately
  quality={85} // Balanced quality/size
/>`,
          estimatedImpact:
            'Reducing LCP from 5.2s to <2.5s can improve conversion rates by 20-30%. Google data shows 53% of mobile users abandon sites that take >3s to load.',
        },
        {
          title: 'Implement Code Splitting and Lazy Loading',
          description:
            'Load only critical JavaScript initially, defer non-essential code. This reduces Time to Interactive (TTI) significantly.',
          priority: 'medium' as const,
          implementation:
            '1. Use dynamic imports for heavy components\n2. Lazy load below-the-fold content\n3. Defer third-party scripts (analytics, chat widgets)\n4. Split vendor bundles',
          codeExample: `// Lazy load heavy components
const CaseStudies = dynamic(() => import('./CaseStudies'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Defer analytics
<Script
  src="https://analytics.example.com"
  strategy="lazyOnload"
/>`,
          estimatedImpact:
            'Improved FID and TTI lead to better user experience and lower bounce rates. Can reduce bounce rate by 10-15%.',
        },
      ],
    },
    {
      category: 'Understand' as const,
      score: 72,
      description: 'Message clarity and value proposition',
      issues: [
        {
          description: 'Value proposition not immediately clear above the fold',
          severity: 'high' as const,
        },
        {
          description: 'Industry jargon may confuse non-technical visitors',
          severity: 'medium' as const,
        },
      ],
      solutions: [
        {
          title: 'Refine Above-the-Fold Value Proposition',
          description:
            'The first 3 seconds determine if visitors stay or leave. Your value proposition must answer: "What do you do?" and "Why should I care?"',
          priority: 'high' as const,
          implementation:
            '1. Create a clear 6-10 word headline\n2. Add supporting subheadline (benefits, not features)\n3. Include social proof nearby (client logos, testimonials)\n4. Make CTA button highly visible',
          estimatedImpact:
            'Clear messaging can reduce bounce rate by 25-40% and increase time-on-page by 60%. HubSpot study: 64% of visitors decide within 8 seconds.',
        },
      ],
    },
    {
      category: 'Trust' as const,
      score: 81,
      description: 'Credibility signals and trust elements',
      issues: [
        {
          description: 'No client testimonials visible on homepage',
          severity: 'medium' as const,
        },
      ],
      solutions: [
        {
          title: 'Add Strategic Trust Signals',
          description:
            'Trust signals reassure first-time visitors and validate your expertise. Critical for B2B conversions.',
          priority: 'medium' as const,
          implementation:
            '1. Add client testimonials with photos/logos\n2. Display industry certifications\n3. Show case study results with metrics\n4. Add security badges near forms',
          estimatedImpact:
            'Trust signals can increase conversion rates by 15-30%. Unbounce data: testimonials increase conversions by 34% on average.',
        },
      ],
    },
    {
      category: 'Convert' as const,
      score: 64,
      description: 'Lead capture effectiveness',
      issues: [
        {
          description: 'Contact form has 8 fields (optimal: 3-5)',
          severity: 'high' as const,
        },
        {
          description: 'No exit-intent popup to capture leaving visitors',
          severity: 'medium' as const,
        },
      ],
      solutions: [
        {
          title: 'Simplify Contact Form (Progressive Profiling)',
          description:
            'Long forms reduce conversion rates dramatically. Start with minimal fields, gather more data in follow-up emails.',
          priority: 'high' as const,
          implementation:
            '1. Reduce initial form to Name, Email, Company\n2. Add optional "Message" field\n3. Use progressive profiling in email sequences\n4. A/B test different field combinations',
          codeExample: `<!-- Optimized Form -->
<form>
  <input type="text" name="name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <input type="text" name="company" placeholder="Company" />
  <textarea name="message" placeholder="How can we help?" />
  <button>Get Free Audit</button>
</form>`,
          estimatedImpact:
            'Reducing form fields from 8 to 4 can increase conversion rates by 50-120%. Fewer fields = lower friction = more leads.',
        },
      ],
    },
    {
      category: 'Engage' as const,
      score: 59,
      description: 'CRM and marketing automation maturity',
      issues: [
        {
          description: 'No email marketing platform detected',
          severity: 'high' as const,
        },
        {
          description: 'Missing GDPR consent checkboxes on forms',
          severity: 'high' as const,
        },
      ],
      solutions: [
        {
          title: 'Implement Email Marketing Automation',
          description:
            'Automated email nurture sequences are essential for converting leads. Most B2B buyers need 5-7 touchpoints before purchasing.',
          priority: 'high' as const,
          implementation:
            '1. Choose platform (Klaviyo, Mailchimp, ActiveCampaign)\n2. Set up welcome email sequence (5 emails over 14 days)\n3. Create segmentation based on behavior\n4. Add lead scoring',
          estimatedImpact:
            'Marketing automation can increase qualified leads by 451% (source: The Annuitas Group). Average ROI of email marketing: 4200% (€42 return per €1 spent).',
        },
        {
          title: 'Add GDPR-Compliant Consent Mechanisms',
          description:
            'GDPR compliance is mandatory for EU visitors. Non-compliance risks fines up to €20M or 4% of revenue.',
          priority: 'high' as const,
          implementation:
            '1. Add explicit consent checkbox to all forms\n2. Create clear privacy policy\n3. Implement cookie consent banner\n4. Store consent records in CRM',
          codeExample: `<label>
  <input type="checkbox" name="gdpr_consent" required />
  I agree to receive marketing emails and accept the
  <a href="/privacy">Privacy Policy</a>
</label>`,
          estimatedImpact:
            'Protects against legal risks and builds trust. Transparent data handling increases form completion rates by 10-15%.',
        },
      ],
    },
  ],
};

async function generateTestPDF() {
  console.log('🚀 Starting PDF generation test...\n');

  try {
    // Generate PDF buffer
    console.log('📄 Rendering PDF document...');
    const pdfBuffer = await renderToBuffer(
      React.createElement(LAMAProReport, mockReportData)
    );

    // Save to file
    const outputPath = path.join(process.cwd(), 'lama-pro-test-report.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('✅ PDF generated successfully!');
    console.log(`📁 File saved to: ${outputPath}`);
    console.log(`📊 File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`📖 Pages: ~${mockReportData.categories.length + 2} (Cover + Summary + ${mockReportData.categories.length} categories)`);
    console.log('\n✨ Open the PDF to verify design and content!');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Run test
generateTestPDF();

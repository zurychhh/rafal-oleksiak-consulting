/**
 * Test script V2 - Generate comprehensive LAMA PRO PDF with Pyramid Principle structure
 * Run with: npx tsx app/lib/lama/pro/test-pdf-v2.ts
 */

import { renderToBuffer } from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { Cover } from './pdf/components/Cover';
import { ExecutiveSummary } from './pdf/components/ExecutiveSummary';
import { MethodologyPage } from './pdf/components/MethodologyPage';
import { CategorySectionV2 } from './pdf/components/CategorySectionV2';
import { DecisionMatrix } from './pdf/components/DecisionMatrix';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';

// Comprehensive mock data with full Pyramid Principle structure
const mockData = {
  websiteUrl: 'https://example-company.com',
  companyName: 'Example Company Inc.',
  overallScore: 67,
  generatedDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  estimatedRevenueLoss: 85000,
  recoverable: 63750,

  // Executive Summary data
  keyFindings: [
    'Missing critical SEO meta tags reducing organic visibility by ~30% (Source: Ahrefs 2024 Study)',
    'Page load time exceeds 5 seconds on mobile - losing 53% of potential visitors (Source: Google)',
    'Unclear value proposition above fold - average time to bounce: 8 seconds (Source: Nielsen Norman)',
    'No GDPR-compliant consent mechanisms detected - regulatory risk + trust issues',
    'Contact forms have 8 fields vs industry optimal 3-5 - reducing conversions by ~50% (Source: Formstack)',
    'No email marketing automation - missing 451% more qualified leads opportunity (Source: Annuitas)',
  ],

  categoryScores: [
    {
      category: 'Find',
      score: 55,
      description: 'SEO optimization and organic discoverability',
      borderColor: '#7B2CBF',
    },
    {
      category: 'Stay',
      score: 48,
      description: 'Website performance and loading speed',
      borderColor: '#00BFFF',
    },
    {
      category: 'Understand',
      score: 72,
      description: 'Message clarity and value proposition',
      borderColor: '#9D4EDD',
    },
    {
      category: 'Trust',
      score: 81,
      description: 'Credibility signals and trust elements',
      borderColor: '#10B981',
    },
    {
      category: 'Convert',
      score: 64,
      description: 'Lead capture effectiveness',
      borderColor: '#F59E0B',
    },
    {
      category: 'Engage',
      score: 59,
      description: 'CRM and marketing automation maturity',
      borderColor: '#EC4899',
    },
  ],
};

// FIND Category - Full implementation
const findCategoryData = {
  categoryName: 'FIND',
  categoryDescription: 'Organic discoverability through search engines. Your ability to be found by potential customers actively searching for your solutions.',
  score: 55,
  industryBenchmark: 78,
  categoryColor: '#7B2CBF',
  issues: [
    {
      description: 'Missing Meta Title tags on 3 key landing pages (homepage, /services, /about)',
      impact: '-€15,000/yr',
      severity: 'critical' as const,
    },
    {
      description: 'Meta Description missing on homepage - reducing click-through rate by 20-30%',
      impact: '-€8,000/yr',
      severity: 'high' as const,
    },
    {
      description: 'No H1 heading detected on /services page - confusing search engines',
      impact: '-€3,000/yr',
      severity: 'high' as const,
    },
    {
      description: 'Sitemap.xml returns 404 error - search engines cannot efficiently index your content',
      impact: '-€5,000/yr',
      severity: 'medium' as const,
    },
  ],
  solution: {
    title: 'Solution 1: Implement Complete SEO Meta Tag Strategy',
    description: 'Meta tags are the foundation of SEO. They tell search engines what your pages are about and influence both rankings and click-through rates from search results.',
    businessCase: 'Google uses meta titles as a primary ranking signal. Pages without optimized meta tags rank 40-60% lower than those with proper optimization (Source: Ahrefs Study of 150,000 websites). At €50/lead average, this translates to €15k-20k/year in lost revenue.',
    implementationPaths: [
      {
        name: 'DIY' as const,
        cost: '€200',
        time: '4 hours',
        complexity: 'Low' as const,
        steps: [
          'Research target keywords using Google Keyword Planner or Ahrefs (free alternatives: Ubersuggest)',
          'Write unique 50-60 character titles for each key page (homepage, services, about, contact)',
          'Create compelling 150-160 character meta descriptions highlighting benefits',
          'Implement meta tags in your website <head> section using provided code template',
          'Submit updated sitemap to Google Search Console and Bing Webmaster Tools',
          'Monitor rankings weekly using Google Search Console (free)',
        ],
        roiTimeline: 'Break-even in 2 weeks',
        roiDetail: 'Cost: €200 (4h × €50/hr) | Expected lift: €15k/yr | Monthly gain: €1,250 | ROI: 7,400%',
      },
      {
        name: 'Agency' as const,
        cost: '€2,000',
        time: '2 days',
        complexity: 'None' as const,
        steps: [
          'Brief agency on your business goals, target audience, and key services',
          'Provide access to website CMS or development environment',
          'Agency conducts keyword research (typically includes competitor analysis)',
          'Review and approve proposed meta tags before implementation',
          'Agency implements tags, creates/fixes sitemap, submits to search engines',
          'Receive monthly ranking reports and optimization recommendations',
        ],
        roiTimeline: 'Break-even in 8 weeks',
        roiDetail: 'Cost: €2,000 | Expected lift: €15k/yr | Monthly gain: €1,250 | ROI: 650%',
      },
      {
        name: 'Hybrid' as const,
        cost: '€500',
        time: '2 hours + consultant',
        complexity: 'Medium' as const,
        steps: [
          'Schedule 1-hour consultation with SEO specialist (€250)',
          'Receive customized keyword research report and meta tag templates for your industry',
          'You implement meta tags using provided templates (saves €1,500 vs agency)',
          'Consultant reviews implementation and provides feedback (30-min follow-up call)',
          'You submit sitemap to search engines following provided checklist',
          'Access to 30-day email support for questions',
        ],
        roiTimeline: 'Break-even in 4 weeks',
        roiDetail: 'Cost: €500 | Expected lift: €15k/yr | Monthly gain: €1,250 | ROI: 2,900%',
      },
    ],
    expectedImpact: {
      conservative: '€15,000/year revenue recovery (75% confidence). Assumes 25% increase in organic traffic and 2.9% conversion rate.',
      aggressive: '€25,000/year if fully optimized across all pages + blog content. Requires ongoing content creation (not included).',
      calculation: 'Current organic traffic: 2,000/mo | Lost due to poor SEO: 750/mo (30% gap vs benchmark) | Conversion rate: 2.9% | Lost conversions: 22/mo | Avg deal value: €800 | Lost revenue: €17,600/yr | Conservative (75% recovery): €15,000/yr',
    },
    marketEvidence: {
      dataPoints: [
        'Ahrefs study (150k websites): Sites with optimized meta tags rank avg 23% higher in SERPs',
        'Backlinko analysis: Meta titles are among top 5 ranking factors in 2024',
        'HubSpot: 64% of B2B marketers say SEO generates more leads than any other initiative',
        'Your industry median score: 78/100 | Your current score: 55/100 | 23-point gap = ~€15k/yr opportunity',
      ],
      sources: [
        'Ahrefs 2024 SEO Study',
        'Backlinko Ranking Factors Analysis',
        'HubSpot State of Marketing 2024',
        'Google Search Quality Rater Guidelines',
      ],
    },
  },
};

// Decision Matrix data
const decisionMatrixData = {
  actions: [
    {
      action: 'Add SEO Meta Tags',
      category: 'FIND',
      roiImpact: '€15,000/yr',
      effort: '4 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'Optimize Images (WebP + Lazy Load)',
      category: 'STAY',
      roiImpact: '€12,000/yr',
      effort: '8 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'Simplify Contact Form (8→4 fields)',
      category: 'CONVERT',
      roiImpact: '€10,000/yr',
      effort: '2 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'Add GDPR Consent Checkboxes',
      category: 'ENGAGE',
      roiImpact: '€0/yr (Compliance)',
      effort: '3 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'Implement Email Marketing Automation',
      category: 'ENGAGE',
      roiImpact: '€18,000/yr',
      effort: '3 days',
      priority: 'HIGH' as const,
      quickWin: false,
    },
    {
      action: 'Refine Value Proposition Copy',
      category: 'UNDERSTAND',
      roiImpact: '€8,000/yr',
      effort: '1 day',
      priority: 'MEDIUM' as const,
      quickWin: true,
    },
    {
      action: 'Add Client Testimonials Section',
      category: 'TRUST',
      roiImpact: '€6,000/yr',
      effort: '4 hours',
      priority: 'MEDIUM' as const,
      quickWin: true,
    },
    {
      action: 'Implement Exit-Intent Popup',
      category: 'CONVERT',
      roiImpact: '€5,000/yr',
      effort: '2 hours',
      priority: 'MEDIUM' as const,
      quickWin: true,
    },
    {
      action: 'Add Live Chat Widget',
      category: 'CONVERT',
      roiImpact: '€7,000/yr',
      effort: '4 hours',
      priority: 'LOW' as const,
      quickWin: true,
    },
    {
      action: 'Create XML Sitemap',
      category: 'FIND',
      roiImpact: '€5,000/yr',
      effort: '1 hour',
      priority: 'MEDIUM' as const,
      quickWin: true,
    },
  ],
};

async function generateTestPDFV2() {
  console.log('🚀 Starting LAMA PRO V2 PDF generation (Pyramid Principle structure)...\n');

  try {
    console.log('📄 Rendering comprehensive PDF document...');

    // Build document with all components
    const doc = React.createElement(
      Document,
      {
        title: `LAMA PRO Report - ${mockData.websiteUrl}`,
        author: 'Oleksiak Consulting',
        subject: 'Lead Acquisition Maturity Assessment - Professional Edition',
        creator: 'LAMA PRO System',
        producer: 'Oleksiak Consulting',
      },
      [
        // Cover
        React.createElement(Cover, {
          key: 'cover',
          websiteUrl: mockData.websiteUrl,
          companyName: mockData.companyName,
          overallScore: mockData.overallScore,
          generatedDate: mockData.generatedDate,
        }),

        // Executive Summary
        React.createElement(ExecutiveSummary, {
          key: 'exec-summary',
          overallScore: mockData.overallScore,
          categories: mockData.categoryScores,
          keyFindings: mockData.keyFindings,
          estimatedRevenueLoss: mockData.estimatedRevenueLoss,
          recoverable: mockData.recoverable,
        }),

        // Methodology & Benchmarks
        React.createElement(MethodologyPage, {
          key: 'methodology',
        }),

        // FIND Category (detailed example)
        React.createElement(CategorySectionV2, {
          key: 'find-1',
          ...findCategoryData,
          pageNumber: 1,
        }),

        // Decision Matrix
        React.createElement(DecisionMatrix, {
          key: 'decision-matrix',
          ...decisionMatrixData,
        }),
      ]
    );

    const pdfBuffer = await renderToBuffer(doc);

    // Save to file
    const outputPath = path.join(process.cwd(), 'lama-pro-v2-test-report.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('✅ PDF V2 generated successfully!');
    console.log(`📁 File saved to: ${outputPath}`);
    console.log(`📊 File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`📖 Pages: 6 (Cover + Exec Summary + Methodology + FIND Category + Decision Matrix)`);
    console.log('\n📋 V2 Improvements:');
    console.log('  ✅ Pyramid Principle structure');
    console.log('  ✅ Market-based benchmarks with sources');
    console.log('  ✅ 3 implementation paths (DIY, Agency, Hybrid)');
    console.log('  ✅ Detailed ROI calculations with formulas');
    console.log('  ✅ Decision Matrix for prioritization');
    console.log('  ✅ wrap={false} on key sections (no ugly mid-sentence cuts)');
    console.log('\n✨ Open the PDF to verify business-oriented, action-oriented design!');
  } catch (error) {
    console.error('❌ Error generating PDF V2:', error);
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run test
generateTestPDFV2();

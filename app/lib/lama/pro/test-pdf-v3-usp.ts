/**
 * Test script V3 - "The Copy-Paste Startup Playbook"
 * USP elements: 90-Day Roadmap + Code Snippets + Founder's Cheat Sheet + Neon Accents
 * Run with: npx tsx app/lib/lama/pro/test-pdf-v3-usp.ts
 */

import { renderToBuffer } from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { Cover } from './pdf/components/Cover';
import { ExecutiveSummary } from './pdf/components/ExecutiveSummary';
import { NinetyDayRoadmap } from './pdf/components/NinetyDayRoadmap';
import { MethodologyPage } from './pdf/components/MethodologyPage';
import { CategorySectionV3 } from './pdf/components/CategorySectionV3';
import { DecisionMatrix } from './pdf/components/DecisionMatrix';
import { FoundersCheatSheet } from './pdf/components/FoundersCheatSheet';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';

// Mock data for V3 test
const mockData = {
  websiteUrl: 'https://example-startup.com',
  companyName: 'Example Startup Inc.',
  overallScore: 67,
  generatedDate: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  estimatedRevenueLoss: 85000,
  recoverable: 63750,

  keyFindings: [
    '⚡ Missing SEO meta tags = -30% organic visibility (Ahrefs, 150k sites study)',
    '🐌 5s mobile load time = losing 53% of visitors (Google CWVR 2024)',
    '💬 Unclear value prop = 8 second avg bounce time (Nielsen Norman Group)',
    '⚠️ No GDPR consent = regulatory risk + trust issues',
    '📝 8-field contact form = 50% lower conversions vs 3-5 fields (Formstack)',
    '📧 Zero email automation = missing 451% more leads (Annuitas Group)',
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

// 90-Day Roadmap data
const roadmapData = {
  totalRecoverable: 63750,
  quickWinsCount: 5,
  totalTimeInvestment: '32 hours',
  timeline: [
    {
      phase: 'Week 1-2' as const,
      focus: 'Quick Wins - Ship This Weekend!',
      totalTime: '18 hours',
      expectedROI: '€42k/year',
      actions: [
        {
          title: 'Add SEO Meta Tags',
          category: 'FIND',
          timeEstimate: '4 hours',
          roi: '+€15k/yr',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: false,
          pageReference: 'See page 6 for code',
        },
        {
          title: 'Optimize Images (WebP)',
          category: 'STAY',
          timeEstimate: '8 hours',
          roi: '+€12k/yr',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: false,
          pageReference: 'See page 8',
        },
        {
          title: 'Simplify Contact Form',
          category: 'CONVERT',
          timeEstimate: '2 hours',
          roi: '+€10k/yr',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: false,
          pageReference: 'See page 10',
        },
        {
          title: 'Add GDPR Consent',
          category: 'ENGAGE',
          timeEstimate: '2 hours',
          roi: 'Compliance',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: true,
          pageReference: 'See page 12',
        },
        {
          title: 'Exit-Intent Popup',
          category: 'CONVERT',
          timeEstimate: '2 hours',
          roi: '+€5k/yr',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: false,
          pageReference: 'See page 11',
        },
      ],
    },
    {
      phase: 'Week 3-6' as const,
      focus: 'Medium Wins - Build Momentum',
      totalTime: '10 hours',
      expectedROI: '€18k/year',
      actions: [
        {
          title: 'Email Marketing Setup',
          category: 'ENGAGE',
          timeEstimate: '3 days',
          roi: '+€18k/yr',
          difficulty: 'Medium' as const,
          isQuickWin: false,
          isUrgent: false,
          pageReference: 'See page 13',
        },
        {
          title: 'Refine Value Proposition',
          category: 'UNDERSTAND',
          timeEstimate: '1 day',
          roi: '+€8k/yr',
          difficulty: 'Medium' as const,
          isQuickWin: false,
          isUrgent: false,
          pageReference: 'See page 9',
        },
        {
          title: 'Add Client Testimonials',
          category: 'TRUST',
          timeEstimate: '4 hours',
          roi: '+€6k/yr',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: false,
          pageReference: 'See page 10',
        },
      ],
    },
    {
      phase: 'Week 7-12' as const,
      focus: 'Long-term - Compound Growth',
      totalTime: '4 hours',
      expectedROI: '€5k/year',
      actions: [
        {
          title: 'Live Chat Widget',
          category: 'CONVERT',
          timeEstimate: '2 hours',
          roi: '+€7k/yr',
          difficulty: 'Low' as const,
          isQuickWin: false,
          isUrgent: false,
          pageReference: 'See page 14',
        },
        {
          title: 'Create XML Sitemap',
          category: 'FIND',
          timeEstimate: '1 hour',
          roi: '+€5k/yr',
          difficulty: 'Low' as const,
          isQuickWin: true,
          isUrgent: false,
          pageReference: 'See page 7',
        },
      ],
    },
  ],
};

// FIND Category with COPY-PASTE CODE
const findCategoryData = {
  categoryName: 'FIND',
  categoryDescription: 'Organic discoverability through search engines',
  score: 55,
  industryBenchmark: 78,
  categoryColor: '#7B2CBF',
  issues: [
    {
      description: 'Missing Meta Title on homepage, /services, /about pages',
      impact: '-€15k/yr',
      severity: 'critical' as const,
    },
    {
      description: 'No Meta Description on homepage - 20-30% lower CTR',
      impact: '-€8k/yr',
      severity: 'high' as const,
    },
    {
      description: 'Sitemap.xml returns 404 - search engines cannot index efficiently',
      impact: '-€5k/yr',
      severity: 'medium' as const,
    },
  ],
  solution: {
    title: 'Solution #1: Add Optimized SEO Meta Tags',
    description: 'Meta tags are the foundation of SEO. They tell Google what your page is about and directly influence rankings + click-through rates.',
    businessCase: 'Pages without optimized meta tags rank 40-60% lower (Ahrefs study, 150k sites). At €50/lead average, this = €15k-20k/year lost revenue.',
    implementationPaths: [
      {
        name: 'DIY' as const,
        cost: '€200',
        time: '4 hours',
        complexity: 'Low' as const,
        steps: [
          'Research keywords using Google Keyword Planner (free)',
          'Write unique 50-60 char titles for each page',
          'Create 150-160 char meta descriptions highlighting benefits',
          'Implement using the code below in your <head> section',
          'Submit sitemap to Google Search Console',
          'Monitor rankings weekly in Search Console',
        ],
        codeSnippet: {
          language: 'html',
          code: `<!-- 📋 COPY THIS → Paste in your <head> section -->

<!-- Homepage Example -->
<title>Your Startup Name | What You Do in 5 Words</title>
<meta name="description" content="Benefit 1. Benefit 2. Social proof. Call to action.">

<!-- Open Graph for Social Sharing -->
<meta property="og:title" content="Your Startup Name - Tagline">
<meta property="og:description" content="Your value proposition in 1 sentence">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<meta property="og:url" content="https://yoursite.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Startup Name">
<meta name="twitter:description" content="Value proposition">
<meta name="twitter:image" content="https://yoursite.com/twitter-image.jpg">`,
          explanation: 'Google uses title tags as primary ranking signal. 60 char limit ensures full display in SERPs. Meta descriptions improve CTR by 20-30% when compelling. OG tags boost social sharing (50% more clicks). ROI: This alone recovers €15k/year from improved rankings.',
        },
        roiTimeline: 'Break-even in 2 weeks',
        roiDetail: 'Cost: €200 (4h × €50/hr) | Monthly gain: €1,250 | ROI: 7,400%',
      },
      {
        name: 'Agency' as const,
        cost: '€2,000',
        time: '2 days',
        complexity: 'None' as const,
        steps: [
          'Brief agency on business goals + target audience',
          'Provide CMS access',
          'Agency conducts keyword research + competitor analysis',
          'Review proposed meta tags before implementation',
          'Agency implements tags + submits sitemap',
          'Receive monthly ranking reports',
        ],
        roiTimeline: 'Break-even in 8 weeks',
        roiDetail: 'Cost: €2,000 | Monthly gain: €1,250 | ROI: 650%',
      },
      {
        name: 'Hybrid' as const,
        cost: '€500',
        time: '2 hours + consultant',
        complexity: 'Medium' as const,
        steps: [
          '1-hour consultation with SEO specialist (€250)',
          'Receive customized keyword report + templates',
          'You implement using provided templates (saves €1,500)',
          'Consultant reviews in 30-min follow-up call',
          'You submit sitemap following checklist',
          '30-day email support for questions',
        ],
        roiTimeline: 'Break-even in 4 weeks',
        roiDetail: 'Cost: €500 | Monthly gain: €1,250 | ROI: 2,900%',
      },
    ],
    expectedImpact: {
      conservative: '€15,000/year revenue recovery (75% confidence). Assumes 25% traffic increase + 2.9% conversion rate.',
      aggressive: '€25,000/year if fully optimized across all pages + blog.',
      calculation: 'Traffic: 2,000/mo | Lost: 750/mo (30% gap) | Conv: 2.9% | Lost conversions: 22/mo | Deal value: €800 | Lost revenue: €17,600/yr | Conservative (75%): €15,000/yr',
    },
    marketEvidence: {
      dataPoints: [
        'Ahrefs (150k sites): Optimized meta tags = 23% higher SERP rankings',
        'Backlinko: Meta titles are top 5 ranking factor in 2024',
        'HubSpot: 64% of B2B marketers say SEO generates most leads',
      ],
      sources: ['Ahrefs 2024 SEO Study', 'Backlinko Analysis', 'HubSpot State of Marketing 2024'],
    },
  },
};

// Decision Matrix
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
      action: 'Optimize Images',
      category: 'STAY',
      roiImpact: '€12,000/yr',
      effort: '8 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'Simplify Form',
      category: 'CONVERT',
      roiImpact: '€10,000/yr',
      effort: '2 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'GDPR Consent',
      category: 'ENGAGE',
      roiImpact: 'Compliance',
      effort: '2 hours',
      priority: 'HIGH' as const,
      quickWin: true,
    },
    {
      action: 'Email Automation',
      category: 'ENGAGE',
      roiImpact: '€18,000/yr',
      effort: '3 days',
      priority: 'HIGH' as const,
      quickWin: false,
    },
    {
      action: 'Value Proposition',
      category: 'UNDERSTAND',
      roiImpact: '€8,000/yr',
      effort: '1 day',
      priority: 'MEDIUM' as const,
      quickWin: true,
    },
  ],
};

// Founder's Cheat Sheet
const cheatSheetData = {
  companyName: 'Example Startup',
  overallScore: 67,
  targetScore: 90,
  totalRecoverable: 63750,
  quickWins: [
    {
      number: 1,
      title: 'SEO Meta Tags',
      category: 'FIND',
      time: '4h',
      roi: '€15k/yr',
      page: 'p.6',
      color: '#00FF00',
    },
    {
      number: 2,
      title: 'Optimize Images',
      category: 'STAY',
      time: '8h',
      roi: '€12k/yr',
      page: 'p.8',
      color: '#00FF00',
    },
    {
      number: 3,
      title: 'Simplify Form',
      category: 'CONVERT',
      time: '2h',
      roi: '€10k/yr',
      page: 'p.10',
      color: '#00FF00',
    },
    {
      number: 4,
      title: 'GDPR Consent',
      category: 'ENGAGE',
      time: '2h',
      roi: 'Required',
      page: 'p.12',
      color: '#FF006E',
    },
  ],
  mediumWins: [
    {
      number: 5,
      title: 'Email Setup',
      category: 'ENGAGE',
      time: '3 days',
      roi: '€18k/yr',
      page: 'p.13',
      color: '#FF8C00',
    },
    {
      number: 6,
      title: 'Value Prop',
      category: 'UNDERSTAND',
      time: '1 day',
      roi: '€8k/yr',
      page: 'p.9',
      color: '#FF8C00',
    },
    {
      number: 7,
      title: 'Testimonials',
      category: 'TRUST',
      time: '4h',
      roi: '€6k/yr',
      page: 'p.10',
      color: '#FF8C00',
    },
  ],
  longTerm: [
    {
      number: 8,
      title: 'Live Chat',
      category: 'CONVERT',
      time: '2h',
      roi: '€7k/yr',
      page: 'p.14',
      color: '#00BFFF',
    },
    {
      number: 9,
      title: 'XML Sitemap',
      category: 'FIND',
      time: '1h',
      roi: '€5k/yr',
      page: 'p.7',
      color: '#00BFFF',
    },
  ],
};

async function generateTestPDFV3() {
  console.log('🚀 Starting LAMA PRO V3 - "The Copy-Paste Startup Playbook"...\n');

  try {
    console.log('📄 Rendering PDF with USP elements...');

    const doc = React.createElement(
      Document,
      {
        title: `LAMA PRO Report - ${mockData.websiteUrl}`,
        author: 'Oleksiak Consulting',
        subject: 'The Copy-Paste Startup Playbook - LAMA PRO',
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

        // 🔥 NEW: 90-Day Roadmap (Page 2 - Most Important!)
        React.createElement(NinetyDayRoadmap, {
          key: 'roadmap',
          ...roadmapData,
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

        // Methodology
        React.createElement(MethodologyPage, {
          key: 'methodology',
        }),

        // 🔥 FIND Category with COPY-PASTE CODE
        React.createElement(CategorySectionV3, {
          key: 'find',
          ...findCategoryData,
          pageNumber: 1,
        }),

        // Decision Matrix
        React.createElement(DecisionMatrix, {
          key: 'decision-matrix',
          ...decisionMatrixData,
        }),

        // 🔥 NEW: Founder's Cheat Sheet (Last Page - Printable!)
        React.createElement(FoundersCheatSheet, {
          key: 'cheat-sheet',
          ...cheatSheetData,
        }),
      ]
    );

    const pdfBuffer = await renderToBuffer(doc);

    const outputPath = path.join(process.cwd(), 'lama-pro-v3-startup-playbook.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('✅ PDF V3 generated successfully!');
    console.log(`📁 File: ${outputPath}`);
    console.log(`📊 Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`📖 Pages: 7\n`);

    console.log('🔥 NEW USP ELEMENTS:');
    console.log('  ✅ Page 2: 90-Day Roadmap (checkboxes, neon colors, visual timeline)');
    console.log('  ✅ Page 6: Copy-Paste Code Snippets (production-ready HTML)');
    console.log('  ✅ Page 7: Founder\'s Cheat Sheet (printable, tape to wall!)');
    console.log('  ✅ Neon accents: Lime green (quick wins), Hot pink (urgent)');
    console.log('  ✅ Startup language: "Ship this weekend", "Tape to wall", etc.\n');

    console.log('💡 FOUNDER EXPERIENCE:');
    console.log('  1. Opens PDF → Page 1: "I\'m losing €80k/year. Show me how to fix."');
    console.log('  2. Page 2 (Roadmap): "5 things Week 1-2? I can do that this weekend!"');
    console.log('  3. Page 6 (Code): "Wait, they give me the actual HTML? 🤯 Copy-paste!"');
    console.log('  4. Page 7 (Cheat Sheet): Screenshots → Team Slack → "We ship this"');
    console.log('  5. Founder: "Most actionable €297 I\'ve ever spent."\n');

    console.log('✨ Open PDF to verify "Copy-Paste Startup Playbook" vibe!');
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

generateTestPDFV3();

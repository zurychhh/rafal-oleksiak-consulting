/**
 * LAMA PRO V6 IMPROVED - Test PDF Generator
 * Demonstrates V5 USP with improved structure:
 * - Cover (from V5)
 * - 90-Day Action Plan (NEW - from V5 pattern)
 * - Executive Summary (NEW - from V5 pattern)
 * - Methodology (NEW - from V5 pattern)
 * - FIND Section Enhanced (2 pages with 3-path implementation + code)
 * - CRM Section (from V6 POC - will be enhanced later)
 */

import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { CoverWithCalculation } from './pdf/components/CoverWithCalculation';
import {
  ActionPlanPage,
  ExecutiveSummaryPage,
  MethodologyPage,
} from './pdf/components/intro-pages';
import { FINDSectionEnhanced } from './pdf/components/find-section/FINDSectionEnhanced';
import path from 'path';

// Test data for intro pages
const actionPlanData = {
  targetRecovery: '€42,000/rok',
  quickWinsCount: 5,
  totalTime: '24h',
  weekOneActions: [
    {
      title: 'Fix missing meta descriptions (87 stron)',
      category: 'SEO Technical',
      time: '2h',
      roi: '€3,500/rok',
      difficulty: 'Łatwe',
      details: 'Zobacz str. 6',
      badge: 'QUICK WIN' as const,
    },
    {
      title: 'Implement Schema.org markup',
      category: 'SEO Technical',
      time: '3h',
      roi: '€5,000/rok',
      difficulty: 'Średnie',
      details: 'Zobacz str. 6',
      badge: 'QUICK WIN' as const,
    },
    {
      title: 'Setup lead response automation (1h SLA)',
      category: 'CRM',
      time: '4h',
      roi: '€8,000/rok',
      difficulty: 'Średnie',
      details: 'Zobacz str. 12',
      badge: 'URGENT' as const,
    },
  ],
};

const executiveSummaryData = {
  overallAssessment:
    'Twoja firma traci €42,000/rok przez 3 krytyczne luki: 87% odwiedzających nie znajduje kluczowych stron (SEO), 70% leadów odpowiada po 24h+ (CRM), brak automatyzacji follow-up (Engage). Good news: wszystkie są fixable w 90 dni z ROI 1,200%+. Ten raport zawiera production-ready kod + 3 ścieżki wdrożenia dla każdego fix.',
  categoryScores: [
    { name: 'Find', score: 55, maxScore: 100, color: 'purple' as const },
    { name: 'Stay', score: 72, maxScore: 100, color: 'blue' as const },
    { name: 'Understand', score: 68, maxScore: 100, color: 'purple' as const },
    { name: 'Trust', score: 61, maxScore: 100, color: 'green' as const },
    { name: 'Convert', score: 70, maxScore: 100, color: 'orange' as const },
    { name: 'Engage', score: 74, maxScore: 100, color: 'red' as const },
  ],
  keyFindings: [
    {
      emoji: '🚫',
      text: 'Missing meta descriptions on 87 pages - losing 3,500 monthly searches',
      highlight: 'Critical SEO gap:',
    },
    {
      emoji: '💰',
      text: 'Estimated revenue loss from poor SEO visibility',
      value: '€15,000/year',
    },
    {
      emoji: '🛠️',
      text: 'Full implementation in 4-6 hours',
      highlight: 'DIY estimate:',
      value: '€200 cost',
    },
    {
      emoji: '⚡',
      text: 'production-ready HTML code snippets for all fixes',
      highlight: 'This report includes',
    },
  ],
  whatsNextText:
    'Follow the **90-Day Action Plan** (str. 2). Start with **Quick Wins** (Week 1-2) - they require minimal time but deliver 60% of total ROI. Each section includes **3 implementation paths** (DIY/Agency/Hybrid) with exact costs, time estimates, and **copy-paste code**. No guessing, just ship.',
};

const methodologyData = {
  introText:
    'This audit uses the LAMA framework (Lead Acquisition & Marketing Automation) to measure revenue impact across 6 categories. All calculations are based on industry benchmarks (Google, HubSpot, Backlinko) + your current metrics. Conservative estimates use 75% confidence intervals.',
  calculationExample: {
    title: 'Przykład wyliczenia: Missing Meta Descriptions',
    steps: [
      {
        label: 'Krok 1',
        description: 'Liczba stron bez meta descriptions: 87',
      },
      {
        label: 'Krok 2',
        description:
          'Avg miesięczne wyszukiwania dla tych stron (GSC data): 3,500',
      },
      {
        label: 'Krok 3',
        description:
          'Wzrost CTR po dodaniu meta (Backlinko 2024): +5.8% = +203 clicks/mc',
        formula: '3,500 × 5.8% = 203 clicks',
      },
      {
        label: 'Krok 4',
        description: 'Conversion rate (z Analytics): 2.5%',
        formula: '203 × 2.5% = 5 konwersji/mc',
      },
      {
        label: 'Krok 5',
        description: 'Avg order value: €250',
        formula: '5 × €250 × 12 = €15,000/rok',
      },
    ],
  },
  codeExample: {
    title: 'Production-Ready Implementation Example',
    code: `<!-- Copy-paste to <head> -->
<meta name="description" content="...">
<meta property="og:title" content="...">`,
  },
  methodologyItems: [
    {
      highlight: 'Data-driven',
      text: 'All metrics pulled from Google Search Console, Analytics, CRM data. No assumptions.',
    },
    {
      highlight: 'Conservative ROI',
      text: 'We use 75% confidence intervals. Real results typically 20-30% higher.',
    },
    {
      highlight: 'Pyramid Principle',
      text: 'Each section follows SYTUACJA → WPŁYW → ROZWIĄZANIE structure for clarity.',
    },
    {
      highlight: 'Production-ready code',
      text: 'Every recommendation includes copy-paste snippets. No vague suggestions.',
    },
    {
      highlight: '3 implementation paths',
      text: 'Choose DIY (low cost), Agency (hands-off), or Hybrid (best value).',
    },
  ],
  dataSources: [
    {
      name: 'Google Search Console',
      description: 'Search performance, indexing issues, Core Web Vitals',
    },
    {
      name: 'Google Analytics',
      description:
        'Traffic sources, conversion rates, user behavior patterns',
    },
    {
      name: 'Screaming Frog',
      description: 'Technical SEO audit, broken links, duplicate content',
    },
    {
      name: 'Backlinko 2024',
      description: 'Industry benchmarks for CTR, meta tags, Schema.org impact',
    },
    {
      name: 'HubSpot Research',
      description: 'CRM best practices, lead response times, automation ROI',
    },
    {
      name: 'Your CRM Data',
      description: 'Lead response times, pipeline conversion rates, deal size',
    },
  ],
  confidenceNote:
    'All revenue estimates use 75% confidence intervals based on industry data. For example, if we estimate €15,000/year impact, there\'s a 75% probability the actual impact will be between €11,250-€18,750. We deliberately underestimate to set realistic expectations.',
};

const findSectionData = {
  score: 55,
  benchmark: 100,
  // Page 1: Pyramid Principle
  situation:
    'Twoja strona ma 87 stron bez meta descriptions i 0 structured data (Schema.org). Google Search Console pokazuje, że te strony generują 3,500 wyszukiwań/mc, ale CTR wynosi tylko 1.2% (branża: 3.5%). Główne problemy:',
  situationBullets: [
    'Missing meta descriptions (87/200 stron = 43.5%)',
    'Brak Schema.org markup dla produktów/usług (0 stron)',
    'Duplicate content na 12 stronach (kanonikalizacja)',
    '15 broken internal links (404 errors)',
    'Sitemap.xml nieaktualny (ostatnia aktualizacja: 2 lata temu)',
  ],
  impact:
    'Google wprost karze strony bez meta descriptions niższym rankingiem. Twoje strony tracą ~203 clicks/mc (5.8% CTR uplift × 3,500 searches). Przy conversion rate 2.5% i avg order value €250, to €15,000/rok utraconego revenue. Dodatkowo: brak Schema.org = 36% niższe CTR vs konkurencja (Backlinko 2024).',
  impactMetrics: [
    {
      label: 'Obecny CTR',
      value: '1.2% (3,500 searches × 1.2% = 42 clicks/mc)',
    },
    {
      label: 'Docelowy CTR po fix',
      value: '7.0% (3,500 × 7.0% = 245 clicks/mc)',
    },
    {
      label: 'Wzrost clicks',
      value: '+203 clicks/mc (+483%)',
    },
    {
      label: 'Konwersje',
      value: '203 × 2.5% = 5 nowych klientów/mc',
    },
    {
      label: 'Revenue impact',
      value: '5 × €250 × 12 = €15,000/rok',
    },
  ],
  solution:
    'Fix w 3 krokach: (1) Dodaj unique meta descriptions do wszystkich 87 stron (użyj AI + manual review), (2) Implement Schema.org dla top 20 produktów/usług (Google structured data generator), (3) Fix broken links + update sitemap. Time: 4-6h DIY | €200 cost. Agency: €2.5-4k | 2-3 weeks. Hybrid: €800-1.2k | 1-2 weeks (best value).',
  // Page 2: Technical SEO Implementation
  technicalSEOTitle: 'Technical SEO: Meta Descriptions + Schema.org',
  technicalSEOSubtitle:
    'Najbardziej opłacalny quick win. 4-6h pracy = €15,000/rok revenue uplift. Poniżej 3 ścieżki wdrożenia + production-ready kod.',
};

// Test data for cover
const coverData = {
  websiteUrl: 'https://acme-corp.com',
  companyName: 'ACME Corp',
  overallScore: 66,
  estimatedRevenueLoss: 42000,
  generatedDate: new Date().toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  calculationSummary: {
    avgMonthlyVisitors: 5000,
    conversionRate: 0.025,
    avgDealSize: 250,
    closeRate: 0.15,
    lostVisitorsPerMonth: 2000,
    source:
      'Google Search Console, Google Analytics, Backlinko 2024, HubSpot Research',
  },
};

// Generate PDF
const doc = (
  <Document>
    {/* Cover - 1 page */}
    <CoverWithCalculation {...coverData} />

    {/* 90-Day Action Plan - 1 page */}
    <ActionPlanPage {...actionPlanData} />

    {/* Executive Summary - 1 page */}
    <ExecutiveSummaryPage {...executiveSummaryData} />

    {/* Methodology - 1 page */}
    <MethodologyPage {...methodologyData} />

    {/* FIND Section Enhanced - 2 pages */}
    <FINDSectionEnhanced {...findSectionData} />

    {/* TODO: Add CRM Section Enhanced (12 pages) */}
    {/* For now, just demonstrating improved structure */}
  </Document>
);

// Save to file
const outputPath = path.join(
  process.cwd(),
  'lama-pro-v6-improved.pdf',
);

ReactPDF.render(doc, outputPath)
  .then(() => {
    console.log(`✅ PDF generated successfully: ${outputPath}`);
    console.log(`
📊 LAMA PRO V6 IMPROVED - Structure Preview

Pages generated:
- [1] Cover with 5-step calculation
- [2] 90-Day Action Plan (Quick Wins + checkboxes)
- [3] Executive Summary (Category scores + Key Findings)
- [4] Methodology & Data Sources
- [5-6] FIND Section Enhanced (Pyramid Principle + 3-path implementation + code)

✅ NEW V5 USP Features Demonstrated:
✓ Production-ready copy-paste code snippets
✓ 3 implementation paths (DIY/Agency/Hybrid) with costs
✓ "Dlaczego to działa" explanations with research
✓ Intro pages from V5 (Action Plan, Executive Summary, Methodology)
✓ SYTUACJA → WPŁYW → ROZWIĄZANIE structure

📐 Total: 6 pages (proof of concept)
🎯 Next: Add CRM Section Enhanced (12 pages) for full 18-page report
    `);
  })
  .catch((error) => {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  });

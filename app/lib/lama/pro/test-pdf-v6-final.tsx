import './pdf/fonts';
/**
 * LAMA PRO V6 FINAL - Test PDF Generator
 * Full structure with MEGA business depth:
 * - Cover (1 page)
 * - 90-Day Action Plan (1 page)
 * - Executive Summary (1 page)
 * - Methodology (1 page)
 * - FIND Section (7 PAGES - MEGA BUSINESS VERSION with separate summary page)
 * - CRM ENGAGE Section (12 PAGES COMPLETE - full implementation roadmap)
 * = Total: 23 pages COMPLETE
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
import { FINDSection7Pages } from './pdf/components/find-section/FINDSection7Pages';
import { CRMSection12Pages } from './pdf/components/crm-section/CRMSection12Pages';
import { LISTENSection8Pages } from './pdf/components/listen-section/LISTENSection8Pages';
import ACQUIRESection8Pages from './pdf/components/acquire-section/ACQUIRESection8Pages';
import MONETIZESection8Pages from './pdf/components/monetize-section/MONETIZESection8Pages';
import AUTOMATESection8Pages from './pdf/components/automate-section/AUTOMATESection8Pages';
import SUMMARYSection4Pages from './pdf/components/summary-section/SUMMARYSection4Pages';
import path from 'path';

// ===================== INTRO PAGES DATA =====================

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
    'Your company is losing €42,000/year through 3 critical gaps: 87% of visitors cannot find key pages (SEO), 70% of leads get responses after 24h+ (CRM), lack of follow-up automation (Engage). Good news: all are fixable in 90 days with 1,200%+ ROI. This report contains production-ready code + 3 implementation paths for each fix.',
  categoryScores: [
    { name: 'Find', score: 55, maxScore: 100, color: 'purple' as const },
    { name: 'Listen', score: 72, maxScore: 100, color: 'blue' as const },
    { name: 'Acquire', score: 68, maxScore: 100, color: 'purple' as const },
    { name: 'Monetize', score: 70, maxScore: 100, color: 'orange' as const },
    { name: 'Automate', score: 61, maxScore: 100, color: 'green' as const },
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
    title: 'Calculation Example: Missing Meta Descriptions',
    steps: [
      {
        label: 'Step 1',
        description: 'Pages without meta descriptions: 87',
      },
      {
        label: 'Step 2',
        description:
          'Avg monthly searches for these pages (GSC data): 3,500',
      },
      {
        label: 'Step 3',
        description:
          'CTR increase after adding meta (Backlinko 2024): +5.8% = +203 clicks/mo',
        formula: '3,500 × 5.8% = 203 clicks',
      },
      {
        label: 'Step 4',
        description: 'Conversion rate (from Analytics): 2.5%',
        formula: '203 × 2.5% = 5 conversions/mo',
      },
      {
        label: 'Step 5',
        description: 'Avg order value: €250',
        formula: '5 × €250 × 12 = €15,000/year',
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
      text: 'Each section follows SITUATION → IMPACT → SOLUTION structure for clarity.',
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

// ===================== FIND SECTION DATA (6 PAGES) =====================

const findSectionData = {
  score: 55,
  benchmark: 100,

  // Page 1: Overview
  situationText:
    'Twoja strona ma 87 stron bez meta descriptions i 0 structured data (Schema.org). Google Search Console pokazuje, że te strony generują 3,500 wyszukiwań/mc, ale CTR wynosi tylko 1.2% (branża: 3.5%).',
  situationBullets: [
    'Missing meta descriptions: 87/200 stron (43.5%)',
    'Brak Schema.org markup dla produktów/usług (0 stron)',
    'Duplicate content na 12 stronach (problemy z kanonikalizacją)',
    '15 broken internal links (404 errors) - Google crawl errors',
    'Sitemap.xml nieaktualny (ostatnia aktualizacja: 2 lata temu)',
  ],
  impactText:
    'Google wprost karze strony bez meta descriptions niższym rankingiem. Twoje strony tracą ~203 clicks/mc (5.8% CTR uplift × 3,500 searches). Przy conversion rate 2.5% i avg order value €250, to €15,000/rok utraconego revenue. Dodatkowo: brak Schema.org = 36% niższe CTR vs konkurencja (Backlinko 2024).',
  impactCalculation: [
    {
      label: 'Obecny CTR',
      value: '1.2% → 3,500 searches × 1.2% = 42 clicks/mc',
    },
    {
      label: 'Docelowy CTR po fix',
      value: '7.0% → 3,500 × 7.0% = 245 clicks/mc',
    },
    {
      label: 'Wzrost clicks',
      value: '+203 clicks/mc (+483% improvement)',
    },
    {
      label: 'Konwersje',
      value: '203 × 2.5% conversion rate = 5 nowych klientów/mc',
    },
    {
      label: 'Revenue impact',
      value: '5 × €250 avg order × 12 months = €15,000/rok',
    },
  ],
  solutionText:
    'Fix w 3 etapach: (1) Technical SEO fixes (meta tags, Schema.org, sitemap) - 4-6h DIY | €200. (2) On-page optimization (headers, content, internal links) - 8-10h | €300. (3) Content creation + link building - 30-40h over 90 days | €1,000. Total: €1,500 DIY path → €5,000-7,000/mc revenue after 90 days.',

  // Page 2: Technical SEO stats
  technicalStats: {
    missingMeta: 87,
    duplicateContent: 12,
    brokenLinks: 15,
    sitemapAge: '2 lata',
  },

  // Page 3: On-Page issues
  onPageIssues: {
    h1Missing: 34,
    thinContent: 28,
    noAltText: 142,
  },

  // Page 4: Keyword gaps
  keywordGaps: [
    {
      keyword: 'crm dla małych firm',
      volume: 1200,
      difficulty: 35,
      priority: 'HIGH' as const,
    },
    {
      keyword: 'automatyzacja sprzedaży',
      volume: 890,
      difficulty: 42,
      priority: 'HIGH' as const,
    },
    {
      keyword: 'marketing automation narzędzia',
      volume: 720,
      difficulty: 38,
      priority: 'HIGH' as const,
    },
    {
      keyword: 'lead nurturing strategie',
      volume: 560,
      difficulty: 45,
      priority: 'MEDIUM' as const,
    },
    {
      keyword: 'email marketing automation',
      volume: 1400,
      difficulty: 52,
      priority: 'HIGH' as const,
    },
  ],

  // Page 5: Backlink data
  backlinks: {
    current: 89,
    competitor1: 1247,
    competitor2: 892,
    competitor3: 1106,
  },

  // Page 6: Local SEO
  localPresence: {
    gmb: true,
    citations: 23,
    reviews: 12,
  },
};

// ===================== CRM SECTION DATA (2 PAGES POC) =====================

const crmSectionData = {
  score: 74,
  benchmark: 100,

  // Page 1: Overview
  situationText:
    'Twoja firma ma 70% lead response time powyżej 24h. Brak automatycznej odpowiedzi, brak lead scoring, brak email sequences. CRM (jeśli istnieje) używany tylko jako baza kontaktów, nie automation engine.',
  situationBullets: [
    'Avg lead response time: 28h (benchmark: <1h)',
    'Brak auto-response po form submission (100% manual)',
    'Brak email nurture sequences (single-touch sale attempt)',
    'Brak lead scoring (wszystkie leady traktowane równo)',
    'Manual follow-up reminders (80% missed, brak accountability)',
    'Zero CRM automation workflows (Zapier, Make.com, native)',
  ],
  impactText:
    'MIT study: response po 5 min = 21x wyższe szanse na konwersję vs 30 min. Po 24h szanse spadają o 98%. Twój 28h response time = tracisz 40 leadów/mc × €250 avg deal = €10,000/mc = €120,000/rok. Dodatkowo: brak nurture sequences = 73% leadów nigdy nie wraca (HubSpot data).',
  impactMetrics: [
    {
      label: 'Monthly inbound leads',
      value: '50 leads (z contact form, chat, telefon)',
    },
    {
      label: 'Current conversion rate',
      value: '4% (2 deals/mc) - benchmark: 15-20%',
    },
    {
      label: 'Lost deals/month',
      value: '50 × (15% target - 4% current) = ~6 deals/mc lost',
    },
    {
      label: 'Avg deal size',
      value: '€250',
    },
    {
      label: 'Monthly revenue loss',
      value: '6 × €250 = €1,500/mc (€18,000/rok)',
    },
    {
      label: 'Plus: poor follow-up',
      value: '+€2,000/mc (missed opportunities) = €24,000/rok total',
    },
  ],
  solutionText:
    'Fix w 3 etapach: (1) Lead response automation (Zapier auto-email + Slack notify) - 2-3h | €0-50/mc. (2) Email sequences (welcome, nurture, re-engage) - 6-8h | €0-200 setup. (3) Lead scoring + CRM workflows - 10-12h | €500-1,500 (Hybrid path). Total DIY: €0-250 → €8,000/rok recovery. Agency: €3-5k → €24,000/rok full recovery.',

  // Page 2: Lead Response Time
  leadResponseStats: {
    currentResponseTime: '28h',
    benchmarkResponseTime: '<1h',
    lostDealsPerMonth: 15,
    lostRevenuePerMonth: 3750,
  },
};

// ===================== GENERATE PDF =====================

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

    {/* FIND Section - 7 PAGES (MEGA BUSINESS VERSION with separate summary) */}
    <FINDSection7Pages {...findSectionData} />

    {/* LISTEN Section - 8 PAGES (Analytics & Data) */}
    <LISTENSection8Pages />

    {/* ACQUIRE Section - 8 PAGES (Paid Advertising) */}
    <ACQUIRESection8Pages />

    {/* MONETIZE Section - 8 PAGES (Conversion & Retention) */}
    <MONETIZESection8Pages />

    {/* AUTOMATE Section - 8 PAGES (Marketing Automation) */}
    <AUTOMATESection8Pages />

    {/* CRM ENGAGE Section - 12 PAGES COMPLETE (6th category as intended) */}
    <CRMSection12Pages {...crmSectionData} />

    {/* SUMMARY Section - 4 PAGES (180-Day Roadmap & Investment Summary) */}
    <SUMMARYSection4Pages />
  </Document>
);

const outputPath = path.join(
  process.cwd(),
  'lama-pro-v6-final.pdf',
);

ReactPDF.render(doc, outputPath)
  .then(() => {
    console.log(`✅ PDF generated successfully: ${outputPath}`);
    console.log(`
📊 LAMA PRO V6 FINAL - MEGA BUSINESS VERSION WITH CRM

Pages generated:
- [1] Cover with calculation summary
- [2] 90-Day Action Plan (Quick Wins + checkboxes + ROI)
- [3] Executive Summary (6 category scores + key findings)
- [4] Methodology & Data Sources (transparent calculation)

CATEGORY 1: FIND (Pages 5-11)
- [5] FIND Page 1: Overview (Pyramid Principle - SITUATION → IMPACT → SOLUTION)
- [6] FIND Page 2: Technical SEO Deep Dive (stats + 3-path implementation + code)
- [7] FIND Page 3: On-Page SEO (content optimization + header structure)
- [8] FIND Page 4: Content Strategy (keyword gaps + 90-day plan + ROI calc)
- [9] FIND Page 5: Link Building (backlink gap analysis + 4 tactics + outreach template)
- [10] FIND Page 6: Local SEO (full page with GMB optimization + citations + reviews)
- [11] FIND Page 7: Complete Implementation Summary (business value + ROI summary)

CATEGORY 2: LISTEN (Pages 12-19)
- [12-19] LISTEN Section: Analytics & Data (8 pages)

CATEGORY 3: ACQUIRE (Pages 20-27)
- [20-27] ACQUIRE Section: Paid Advertising (8 pages)

CATEGORY 4: MONETIZE (Pages 28-35)
- [28-35] MONETIZE Section: Conversion & Retention (8 pages)

CATEGORY 5: AUTOMATE (Pages 36-43)
- [36-43] AUTOMATE Section: Marketing Automation (8 pages)

CATEGORY 6: ENGAGE - CRM (Pages 44-55)
- [44] CRM Page 1: Overview (Pyramid Principle - lead response time problem)
- [45] CRM Page 2: Lead Response Automation (3-path implementation + Zapier code)
- [46] CRM Page 3: Email Automation Setup (welcome sequence + 3-path + templates)
- [47] CRM Page 4: Lead Nurturing (drip campaigns + behavioral triggers + Zapier workflow)
- [48] CRM Page 5: Lead Scoring (points system + SQL query + prioritization)
- [49] CRM Page 6: CRM Integration (HubSpot/Pipedrive comparison + API code)
- [50] CRM Page 7: Sales Pipeline Optimization (conversion analysis + SQL dashboard + bottleneck identification)
- [51] CRM Page 8: Follow-up Automation (task creation + multi-touch sequences + Zapier workflows)
- [52] CRM Page 9: Reporting & Analytics (6 must-track KPIs + lead source ROI + SQL queries)
- [53] CRM Page 10: Sales Team Enablement (playbooks + objection handling + training templates)
- [54] CRM Page 11: Advanced Workflows (multi-channel automation + Make.com + conditional branching)
- [55] CRM Page 12: Complete Roadmap (90-day plan + 3-path investment summary + expected results)

SUMMARY (Pages 56-59)
- [56-59] SUMMARY Section: 180-Day Roadmap & Investment Summary (4 pages)

✅ MEGA BUSINESS FEATURES:
✓ 6 complete category sections (Find, Listen, Acquire, Monetize, Automate, Engage/CRM)
✓ 7 full pages FIND section (no duplicate pages, clean structure)
✓ 12 COMPLETE pages CRM/ENGAGE section (full implementation roadmap from quick wins to advanced automation)
✓ Deep business explanations (why, what, how) on every page
✓ Concrete numbers and ROI calculations on every page (total recovery: €50-150k/year)
✓ 3-path implementation (DIY/Agency/Hybrid) with costs, time and break-even
✓ Production-ready copy-paste code snippets (HTML, Zapier, SQL, API, Make.com, HubSpot)
✓ Research citations (Backlinko 2024, Google, MIT, Harvard, HubSpot, Salesforce, McKinsey, Forrester, Gong.io)
✓ Competitor analysis (backlink gap, keyword gap, pipeline benchmarks)
✓ 90-day phased rollout timeline (all tactics combined with weekly breakdown)
✓ Investment summary cards (DIY €500-1k, Hybrid €3-5k, Agency €8-15k with ROI 667-12,000%)
✓ Expected business results (6-month projection with concrete metrics: response time 28h→<1h, conversion 4%→18%)
✓ Recommended next steps with priorities (5-step action plan)

📐 Total: 59 pages COMPLETE | File size: ~400KB (estimated)
🎯 Status: PRODUCTION READY - Full LAMA PRO report with 6 categories + comprehensive CRM implementation guide
🔄 Section Order: Find → Listen → Acquire → Monetize → Automate → Engage (CRM at position 6 as intended)
    `);
  })
  .catch((error) => {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  });

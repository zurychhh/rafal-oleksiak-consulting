/**
 * LAMA PRO V4 Test Script - Enhanced with Detailed Explanations
 *
 * This version combines:
 * - V2: Detailed written explanations, Pyramid Principle structure
 * - V3: Visual elements (code snippets, neon colors, checkboxes)
 *
 * User feedback addressed:
 * - MORE written word explaining what and why
 * - Better explanation of all numbers with step-by-step calculations
 * - Maintained Pyramid Principle throughout
 * - Kept user-friendly visual elements from V3
 */

import { renderToBuffer } from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { Cover } from './pdf/components/Cover';
import { NinetyDayRoadmap } from './pdf/components/NinetyDayRoadmap';
import { ExecutiveSummary } from './pdf/components/ExecutiveSummary';
import { MethodologyPage } from './pdf/components/MethodologyPage';
import { CategorySectionV4 } from './pdf/components/CategorySectionV4';
import { DecisionMatrix } from './pdf/components/DecisionMatrix';
import { FoundersCheatSheet } from './pdf/components/FoundersCheatSheet';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  neonGreen: '#00FF00',
  hotPink: '#FF006E',
  orange: '#FF8C00',
  electricBlue: '#00BFFF',
};

// Sample data for FIND category with DETAILED explanations
const findCategoryData = {
  categoryName: 'SEO & Visibility (FIND)',
  categoryDescription: 'Your website\'s discoverability in search engines and ability to attract organic traffic through technical SEO, content optimization, and search engine compliance.',
  score: 55,
  industryBenchmark: 78,
  categoryColor: COLORS.electricBlue,

  // PYRAMID PRINCIPLE: SITUATION
  situation: {
    currentState: `Your website currently scores 55/100 in SEO & Visibility. Our audit identified missing or poorly optimized meta tags across 12 key pages,
    no XML sitemap submitted to Google Search Console, and 8 pages with duplicate title tags. Additionally, your homepage lacks proper Open Graph tags for social
    media sharing, and 5 product pages have no meta descriptions at all. The site structure shows weak internal linking, with orphan pages (pages with no inbound links)
    accounting for 15% of your content. Page load times average 4.2 seconds on mobile, significantly above Google's recommended 2.5 seconds for Core Web Vitals compliance.`,

    benchmark: `The industry benchmark of 78/100 comes from Ahrefs' analysis of 150,000 websites across B2B SaaS, e-commerce, and professional services sectors.
    Sites scoring 75-85 typically rank in positions 3-7 for their target keywords, while sites below 60 rarely break into the first page of search results.
    This benchmark matters because Google's algorithm updates in 2024 (particularly the March 2024 Core Update and August 2024 Helpful Content Update) now heavily
    penalize sites with poor technical SEO foundations. The benchmark represents the minimum viable SEO standard to remain competitive in organic search.`,

    gap: `Your 23-point gap below the industry median translates to specific competitive disadvantages: Based on Backlinko's analysis of 11.8 million search results,
    sites in your scoring range (50-60) receive approximately 40-60% less organic traffic than sites scoring 75-85, even when targeting identical keywords.
    For a B2B service business with average client lifetime value in the €5,000-€15,000 range, this traffic gap directly impacts lead generation.
    Our analysis shows you're losing an estimated 35-50 qualified organic visitors per month due to these technical gaps—visitors who are actively searching for
    solutions you provide but never find your website.`,
  },

  // PYRAMID PRINCIPLE: COMPLICATION
  complication: {
    businessImpact: `Let's translate these technical gaps into business impact. Organic search typically represents 40-60% of B2B lead sources (HubSpot State of Marketing 2024).
    Your current organic traffic is approximately 180 visitors/month (from Google Analytics baseline data for similar businesses). If you were performing at the industry benchmark,
    you would likely see 270-315 monthly organic visitors—a gap of 90-135 visitors. Not all visitors convert to leads; industry conversion rates for B2B services range from 2-5%
    (Unbounce Conversion Benchmark Report 2024). Using a conservative 2.5% conversion rate, you're missing 2-3 qualified leads per month. At a 20% close rate (typical for B2B services
    according to Salesforce), and average deal size of €8,000, this gap costs you approximately €3,840-€5,760 in monthly revenue, or €46,080-€69,120 annually.
    Our conservative estimate of €42,000/year accounts for seasonal variation and assumes not all improvements will be perfectly implemented.`,

    calculationSteps: [
      {
        step: 1,
        description: 'Industry median SEO score for your sector',
        value: '78/100',
        formula: 'Ahrefs Industry Study 2024',
      },
      {
        step: 2,
        description: 'Your current SEO score',
        value: '55/100',
      },
      {
        step: 3,
        description: 'Gap below benchmark',
        value: '23 points',
        formula: '78 - 55',
      },
      {
        step: 4,
        description: 'Traffic impact per 10-point gap',
        value: '~15% traffic loss',
        formula: 'Backlinko study, 11.8M search results',
      },
      {
        step: 5,
        description: 'Your total traffic impact',
        value: '~35% traffic loss',
        formula: '(23 ÷ 10) × 15%',
      },
      {
        step: 6,
        description: 'Current monthly organic visitors (estimated)',
        value: '180 visitors',
        formula: 'Google Analytics baseline for similar businesses',
      },
      {
        step: 7,
        description: 'Potential visitors at benchmark performance',
        value: '277 visitors',
        formula: '180 ÷ (1 - 0.35)',
      },
      {
        step: 8,
        description: 'Monthly visitor gap',
        value: '97 visitors',
        formula: '277 - 180',
      },
      {
        step: 9,
        description: 'Lead conversion rate (conservative)',
        value: '2.5%',
        formula: 'Unbounce B2B benchmark 2024',
      },
      {
        step: 10,
        description: 'Monthly leads lost',
        value: '2.4 leads',
        formula: '97 × 0.025',
      },
      {
        step: 11,
        description: 'Sales close rate (conservative)',
        value: '20%',
        formula: 'Salesforce B2B services benchmark',
      },
      {
        step: 12,
        description: 'Monthly deals lost',
        value: '0.48 deals',
        formula: '2.4 × 0.20',
      },
      {
        step: 13,
        description: 'Average deal size (your business)',
        value: '€8,000',
      },
      {
        step: 14,
        description: 'Monthly revenue loss',
        value: '€3,840',
        formula: '0.48 × €8,000',
      },
      {
        step: 15,
        description: 'Annual revenue loss (conservative)',
        value: '€42,000',
        formula: '€3,840 × 11 months (accounts for seasonality)',
      },
    ],

    assumptions: `We assume: (1) Your average deal size is €8,000 (you can adjust this in the ROI calculator); (2) Traffic conversion and close rates remain constant
    (in reality, higher-quality organic traffic often converts better); (3) You capture 75% of the theoretical improvement (conservative); (4) Implementation takes
    2-4 weeks to show results in search rankings; (5) Full SEO impact compounds over 6-12 months as domain authority builds. These assumptions intentionally
    underestimate benefits to provide a conservative, achievable baseline.`,
  },

  issues: [
    {
      description: 'Missing or poorly optimized meta tags on 12 key pages (homepage, services, contact)',
      impact: '~€15,000/yr',
      severity: 'high' as const,
    },
    {
      description: 'No XML sitemap submitted to Google Search Console (8 pages not indexed)',
      impact: '~€8,000/yr',
      severity: 'critical' as const,
    },
    {
      description: '5 product pages have duplicate or missing meta descriptions',
      impact: '~€7,000/yr',
      severity: 'medium' as const,
    },
    {
      description: 'Homepage lacks Open Graph tags (50% lower social sharing CTR)',
      impact: '~€5,000/yr',
      severity: 'medium' as const,
    },
    {
      description: 'Weak internal linking structure with 15% orphan pages',
      impact: '~€7,000/yr',
      severity: 'high' as const,
    },
  ],

  solution: {
    title: 'Comprehensive Meta Tag & Technical SEO Optimization',
    description: `Implement production-ready meta tags, submit XML sitemap, fix duplicate content, add Open Graph/Twitter Card tags,
    and strengthen internal linking architecture.`,

    rationale: `This solution works because it addresses the foundational elements that search engines use to understand and rank your content.
    Google's algorithm (as confirmed in the 2024 Search Quality Rater Guidelines) relies heavily on title tags, meta descriptions, and structured data
    to determine page relevance and quality. Meta tags serve three critical functions: (1) They tell search engines what your page is about (relevance signals);
    (2) They appear in search results and directly influence click-through rates (CTR); (3) They control how your content appears when shared on social media (social signals).
    Studies by Backlinko and Moz consistently show that pages with optimized meta tags rank 20-40% higher for target keywords compared to pages with poor or missing tags.
    Furthermore, Ahrefs' analysis of 5 million search queries found that meta descriptions directly impact CTR—pages with compelling descriptions see 15-30% higher clicks
    even when ranking in the same position. For B2B businesses, this compounds: more visibility → more traffic → more leads → more revenue. The technical fix is straightforward
    (primarily HTML updates), but the strategic impact is substantial because you're addressing core ranking factors that Google uses to evaluate page quality.`,

    businessCase: `You're currently invisible to potential customers actively searching for your services. Every month, approximately 500-800 people in your target market
    search for keywords directly related to your offerings (Google Keyword Planner data). With proper SEO, you should capture 15-25% of this search volume (based on your
    domain authority and competitive landscape analysis). Instead, you're capturing less than 5% due to technical SEO gaps. This solution recovers that lost visibility.
    Unlike paid advertising (where you pay per click indefinitely), SEO improvements have a compounding effect: once implemented, they continue driving organic traffic
    month after month with minimal ongoing cost. The €42,000 annual recovery we project is conservative and assumes only 75% implementation success. Aggressive scenarios
    (full implementation + ongoing content optimization) could recover €60,000-€85,000 annually.`,

    implementationPaths: [
      {
        name: 'DIY' as const,
        cost: '€200',
        time: '4-6 hours',
        complexity: 'Low' as const,
        explanation: `The DIY path is ideal if you have basic HTML knowledge or a developer on your team. This approach gives you full control over implementation
        and allows you to learn your site's SEO foundations. The primary investment is time (4-6 hours spread over 1-2 weeks) rather than money. You'll use free tools
        (Google Keyword Planner, Search Console, ChatGPT for copywriting assistance) and implement changes directly in your website's HTML. This path works best for
        tech-savvy founders who want to understand exactly what's being changed and why. The main trade-off is time: you'll need to research best practices, write compelling
        copy, and test implementation. However, the knowledge you gain is valuable for future SEO efforts, and you save €2,000+ in agency fees.`,
        steps: [
          'Audit existing meta tags using free Screaming Frog (500 URLs free) or manually check key pages in browser dev tools (Ctrl+U to view source)',
          'Research target keywords using Google Keyword Planner (free with Google Ads account) - focus on 3-5 primary keywords with 500-2,000 monthly searches',
          'Write unique, compelling title tags (50-60 characters) for each page using this formula: [Primary Keyword] | [Benefit] | [Brand Name]',
          'Create meta descriptions (150-160 characters) that answer "What will I get?" and include a call-to-action',
          'Generate XML sitemap using xml-sitemaps.com (free for up to 500 pages) and submit to Google Search Console',
          'Implement Open Graph and Twitter Card tags using the production-ready code provided below',
          'Fix duplicate content by ensuring each page has unique title/description (use spreadsheet to track)',
          'Test implementation using Google Rich Results Test and META SEO Inspector Chrome extension',
          'Monitor rankings weekly in Google Search Console → Performance tab for first 30 days',
        ],
        codeSnippet: {
          language: 'html',
          code: `<!-- 📋 COPY THIS → Paste in your <head> section of each page -->

<!-- Example for Homepage -->
<title>Your Company Name | [Main Service] for [Target Audience]</title>
<meta name="description" content="[Main benefit in 1 sentence]. [Social proof]. [Call to action]. Trusted by [number] companies.">

<!-- Example for Service Page -->
<title>[Service Name] | Proven Results for [Industry] | Your Brand</title>
<meta name="description" content="Our [service] helps [audience] achieve [specific outcome]. [Key differentiator]. Get a free consultation today.">

<!-- Open Graph Tags (for Facebook, LinkedIn sharing) -->
<meta property="og:type" content="website">
<meta property="og:title" content="Your Company Name - [Compelling Tagline]">
<meta property="og:description" content="[Value proposition in 1-2 sentences]">
<meta property="og:image" content="https://yoursite.com/images/og-image.jpg">
<meta property="og:url" content="https://yoursite.com/">

<!-- Twitter Card Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Company Name - [Tagline]">
<meta name="twitter:description" content="[Value proposition]">
<meta name="twitter:image" content="https://yoursite.com/images/twitter-card.jpg">

<!-- Canonical URL (prevents duplicate content issues) -->
<link rel="canonical" href="https://yoursite.com/">

<!-- NOTES:
1. Title tag: 50-60 chars (Google truncates at ~60)
2. Meta description: 150-160 chars (optimal for mobile + desktop)
3. OG image: 1200x630px (Facebook/LinkedIn optimal size)
4. Twitter image: 1200x628px (can reuse OG image)
5. Always use https:// (not http://)
6. Replace bracketed placeholders with your actual content
-->`,
          explanation: `This code works because it addresses Google's three primary ranking factors for on-page SEO: relevance (title tag tells Google your topic),
          user experience (meta description improves CTR when people see your listing), and authority (structured data helps Google understand your content).
          Title tags are Google's #1 on-page ranking signal (confirmed in 2024 Search Quality Rater Guidelines). Meta descriptions don't directly impact rankings,
          but they improve CTR by 20-30% when compelling, which sends positive user signals to Google. Open Graph tags boost social sharing by 50%+ (showing proper
          images/titles when shared on LinkedIn/Facebook), creating additional traffic sources and backlink opportunities. This single implementation recovers approximately
          €15,000/year by improving search visibility and CTR. The 60-character title limit ensures full display in mobile SERPs (where 65% of searches now happen).
          The canonical tag prevents duplicate content penalties if your site has multiple URLs for the same page (e.g., www vs non-www, http vs https).`,
        },
        roiTimeline: 'Break-even in 2 weeks',
        roiDetail: `Investment: €200 (4-6 hours × €40/hour opportunity cost for your time + €40 for tools if needed).
        Expected monthly gain: €3,500 (conservative estimate of recovered traffic value). Monthly ROI: 1,650%.
        Full annual recovery: €42,000 (assumes 75% success rate and 11 months of impact accounting for seasonality).
        Break-even occurs in week 2-3 after Google re-indexes your pages (typically 7-14 days for established sites).`,
      },
      {
        name: 'Agency' as const,
        cost: '€2,500-€4,000',
        time: '2-3 weeks',
        complexity: 'Low' as const,
        explanation: `The Agency path is best when you need guaranteed results without time investment. You're paying for expertise, speed, and ongoing support.
        A specialized SEO agency will conduct a comprehensive audit (not just meta tags), implement all technical fixes, provide strategic keyword research,
        write professionally optimized copy, and monitor results for 30-60 days. The premium cost (€2,500-€4,000) includes account management, reporting,
        and fixes if issues arise post-launch. This path makes sense if: (1) You have budget but no time; (2) You want strategic SEO recommendations beyond basic fixes;
        (3) You need professional copywriting for meta tags; (4) You want ongoing support and reporting. The trade-off is cost—you'll pay 10-15× more than DIY.
        However, agencies often achieve 85-95% success rates (vs 70-80% for DIY) due to experience and tooling, potentially recovering €50,000-€60,000 annually instead of €42,000.`,
        steps: [
          'Request proposals from 2-3 specialized SEO agencies (look for case studies in your industry)',
          'Choose agency based on: case studies, communication quality, pricing transparency (avoid "black box" SEO)',
          'Agency conducts comprehensive SEO audit (technical, on-page, competitive analysis)',
          'Receive detailed implementation plan with keyword research and meta tag recommendations',
          'Provide agency with CMS access or implement their HTML recommendations',
          'Agency implements: meta tags, XML sitemap, Open Graph tags, schema markup, and fixes technical issues',
          'Receive weekly ranking reports and Google Search Console analysis for first 30 days',
          'Agency monitors performance, makes adjustments based on data, provides ongoing recommendations',
        ],
        roiTimeline: 'Break-even in 6-8 weeks',
        roiDetail: `Investment: €3,250 average (range: €2,500-€4,000 depending on site size and scope).
        Expected monthly gain: €4,000-€5,000 (agencies often achieve higher success due to experience).
        Monthly ROI after break-even: 23-54%. Full annual recovery: €48,000-€60,000 (assumes 85-95% success rate).
        Break-even occurs in weeks 6-8. Premium pricing buys you: faster implementation, professional copywriting,
        comprehensive technical fixes (beyond meta tags), ongoing monitoring, and guaranteed results with SLAs.`,
      },
      {
        name: 'Hybrid' as const,
        cost: '€800-€1,200',
        time: '1-2 weeks',
        complexity: 'Medium' as const,
        explanation: `The Hybrid path balances cost and quality by splitting work strategically. You hire an SEO consultant or freelancer for strategy and guidance (€500-€800 for 4-6 hours),
        then implement their recommendations yourself or through your in-house developer. This approach gives you professional keyword research, competitive analysis,
        and meta tag templates, but you handle the actual HTML implementation. Best for: teams with technical skills but lacking SEO expertise,
        founders who want to learn while getting expert direction, or businesses with existing developers who can implement recommendations.
        The consultant provides the "what" and "why," you execute the "how." This often achieves 80-90% of agency results at 25-35% of the cost.`,
        steps: [
          'Hire SEO consultant/freelancer on Upwork or Fiverr (€50-€100/hour, 4-6 hour project)',
          'Consultant conducts audit, provides keyword research, and creates meta tag templates for your key pages',
          'Receive implementation guide: specific title/description for each page + technical recommendations',
          'Your team implements HTML changes using consultant\'s templates (or hire developer for €200-€400)',
          'Use consultant\'s recommended tools (e.g., Screaming Frog, Google Search Console) to verify implementation',
          'Consultant reviews implementation via Zoom call, provides feedback and fixes',
          'Submit XML sitemap to Google Search Console (consultant guides process)',
          'Consultant monitors initial rankings for 2-3 weeks, recommends adjustments',
        ],
        roiTimeline: 'Break-even in 3-4 weeks',
        roiDetail: `Investment: €1,000 average (€600 consultant + €400 implementation).
        Expected monthly gain: €3,500-€4,000 (professional strategy + competent execution typically achieves 80-85% success).
        Monthly ROI after break-even: 250-300%. Full annual recovery: €42,000-€48,000.
        Break-even occurs in weeks 3-4. This path gives you professional-grade strategy at 30% of agency cost,
        while building internal SEO knowledge for future optimization efforts.`,
      },
    ],

    expectedImpact: {
      conservative: `€42,000/year (assumes 75% successful implementation, 2.5% conversion rate, conservative traffic recovery).
      This estimate accounts for seasonal variation, implementation delays, and assumes not all meta tags will be perfectly optimized.
      Even if only 60% of projected traffic materializes, you still recover €25,000-€30,000 annually.`,

      aggressive: `€68,000/year (assumes 90% implementation success, 3.5% conversion rate, full traffic recovery + social sharing boost).
      This scenario assumes: optimal keyword targeting, compelling meta descriptions that achieve 25%+ higher CTR, successful Open Graph implementation
      driving 40% more social traffic, and improved internal linking that boosts overall site authority. Achievable with agency or experienced in-house team.`,

      calculation: `Conservative baseline uses industry-standard conversion rates and assumes only 75% of theoretical traffic improvement materializes.
      All numbers are derived from published studies (Ahrefs, Backlinko, HubSpot, Unbounce) with sources cited. Calculations account for your specific
      business metrics: average deal size, sales cycle length, and current traffic levels. We intentionally underestimate to provide achievable targets.`,
    },

    marketEvidence: {
      dataPoints: [
        'Backlinko study (11.8M search results): Optimized meta tags correlate with 20-40% higher rankings for target keywords',
        'Ahrefs analysis (5M queries): Meta descriptions improve CTR by 15-30% even at same ranking position',
        'HubSpot State of Marketing 2024: 40-60% of B2B leads come from organic search for service businesses',
        'Unbounce Conversion Benchmark 2024: B2B service websites convert organic traffic at 2.0-5.5% (median: 2.5%)',
        'Google Search Quality Rater Guidelines 2024: Title tags identified as #1 on-page ranking factor',
        'Moz Local Search Ranking Factors 2024: Meta tags account for 15-20% of total ranking algorithm weight',
        'Salesforce B2B Benchmark Report: Professional services close rates average 18-25% from qualified organic leads',
      ],
      sources: [
        'Backlinko (Brian Dean, 2024)',
        'Ahrefs (Tim Soulo, 2024)',
        'HubSpot Research',
        'Unbounce',
        'Google SQRG 2024',
        'Moz',
        'Salesforce',
      ],
      context: `These benchmarks come from large-scale studies analyzing hundreds of thousands of websites across industries.
      Backlinko's data is particularly relevant because it analyzes real search results (not surveys), tracking how technical SEO factors correlate with rankings.
      Ahrefs' CTR study is based on their database of 5 million search queries and clickstream data from real users, making it highly credible for predicting
      traffic impact. HubSpot's data comes from their annual survey of 1,200+ marketing professionals, providing reliable conversion benchmarks.
      We cite multiple sources to triangulate estimates: if all sources show similar patterns (meta tags improve performance by 15-30%),
      we can confidently use those ranges for projections. The conservative vs aggressive estimates account for variance in implementation quality—
      a basic meta tag implementation achieves lower-end results (15-20% improvement), while expert implementation with compelling copy and strategic keyword targeting
      achieves upper-end results (25-40% improvement). Your specific outcomes will depend on your industry's search volume, competitive landscape, and execution quality,
      but these benchmarks provide a statistically sound baseline for B2B service businesses.`,
    },
  },
};

// Generate test PDF
async function generateTestPDF() {
  try {
    const coverData = {
      websiteUrl: 'https://startup-xyz.com',
      companyName: 'Startup XYZ',
      overallScore: 67,
      generatedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      estimatedRevenueLoss: 124500,
      categoryScores: [
        { category: 'FIND', score: 55, maxScore: 100 },
        { category: 'STAY', score: 72, maxScore: 100 },
        { category: 'UNDERSTAND', score: 68, maxScore: 100 },
        { category: 'TRUST', score: 61, maxScore: 100 },
        { category: 'CONVERT', score: 70, maxScore: 100 },
        { category: 'ENGAGE', score: 74, maxScore: 100 },
      ],
    };

    const roadmapData = {
      totalRecoverable: 124500,
      quickWinsCount: 5,
      totalTimeInvestment: '32 hours',
      timeline: [
        {
          phase: 'Week 1-2' as const,
          focus: 'Quick Wins - Ship This Weekend!',
          totalTime: '8 hours',
          expectedROI: '€15,000/yr',
          actions: [
            {
              title: 'Implement meta tags on 12 key pages',
              category: 'FIND',
              timeEstimate: '4 hours',
              roi: '€15,000/yr',
              difficulty: 'Low' as const,
              isQuickWin: true,
              isUrgent: false,
              pageReference: 'See detailed guide on pages 5-6',
            },
            {
              title: 'Submit XML sitemap to Google Search Console',
              category: 'FIND',
              timeEstimate: '1 hour',
              roi: '€8,000/yr',
              difficulty: 'Low' as const,
              isQuickWin: true,
              isUrgent: true,
              pageReference: 'Step-by-step instructions on page 6',
            },
          ],
        },
      ],
    };

    const executiveSummaryData = {
      overallScore: 67,
      categories: [
        {
          category: 'Find',
          score: 55,
          description: 'SEO optimization and organic discoverability',
          borderColor: '#7B2CBF',
        },
        {
          category: 'Stay',
          score: 72,
          description: 'Website performance and loading speed',
          borderColor: '#00BFFF',
        },
        {
          category: 'Understand',
          score: 68,
          description: 'Message clarity and value proposition',
          borderColor: '#9D4EDD',
        },
        {
          category: 'Trust',
          score: 61,
          description: 'Credibility signals and trust elements',
          borderColor: '#10B981',
        },
        {
          category: 'Convert',
          score: 70,
          description: 'Lead capture mechanisms and conversion optimization',
          borderColor: '#F59E0B',
        },
        {
          category: 'Engage',
          score: 74,
          description: 'Email automation and nurture sequences',
          borderColor: '#EF4444',
        },
      ],
      keyFindings: [
        '⚡ Missing SEO meta tags = -30% organic visibility (Ahrefs, 150k sites study)',
        '📊 23-point gap below industry benchmark = €42,000/year in lost revenue',
        '🎯 DIY implementation: 4-6 hours, €200 investment, 2-week break-even',
        '💡 Copy-paste ready code included for immediate implementation',
        '📈 Conservative estimate: €42,000/year recovery (75% confidence)',
      ],
      estimatedRevenueLoss: 124500,
      recoverable: 93375,
    };

    const decisionMatrixData = {
      actions: [
        {
          action: 'Meta tags optimization (FIND)',
          category: 'SEO & Visibility',
          roiImpact: '€42,000/yr',
          effort: '4-6 hours',
          priority: 'HIGH' as const,
          quickWin: true,
        },
      ],
    };

    const cheatSheetData = {
      companyName: 'Startup XYZ',
      overallScore: 67,
      targetScore: 85,
      totalRecoverable: 124500,
      quickWins: [
        {
          number: 1,
          title: 'Meta Tags',
          category: 'FIND',
          time: '4h',
          roi: '€15k/yr',
          page: 'p.5-6',
          color: COLORS.neonGreen,
        },
        {
          number: 2,
          title: 'XML Sitemap',
          category: 'FIND',
          time: '1h',
          roi: '€8k/yr',
          page: 'p.6',
          color: COLORS.hotPink,
        },
      ],
      mediumWins: [],
      longTerm: [],
    };

    const doc = React.createElement(
      Document,
      {},
      [
        // Cover
        React.createElement(Cover, {
          key: 'cover',
          ...coverData,
        }),

        // 90-Day Roadmap (V3 element - KEEP!)
        React.createElement(NinetyDayRoadmap, {
          key: 'roadmap',
          ...roadmapData,
        }),

        // Executive Summary
        React.createElement(ExecutiveSummary, {
          key: 'summary',
          ...executiveSummaryData,
        }),

        // Methodology
        React.createElement(MethodologyPage, {
          key: 'methodology',
        }),

        // 🔥 Category Section V4 - FIND (Enhanced with detailed explanations)
        React.createElement(CategorySectionV4, {
          key: 'find',
          ...findCategoryData,
          pageNumber: 1,
        }),

        // Decision Matrix
        React.createElement(DecisionMatrix, {
          key: 'decision-matrix',
          ...decisionMatrixData,
        }),

        // Founder's Cheat Sheet (V3 element - KEEP!)
        React.createElement(FoundersCheatSheet, {
          key: 'cheat-sheet',
          ...cheatSheetData,
        }),
      ]
    );

    const pdfBuffer = await renderToBuffer(doc);

    const outputPath = path.join(process.cwd(), 'lama-pro-v4-enhanced-explanations.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log('✅ V4 Enhanced PDF generated successfully!');
    console.log(`📁 File: ${outputPath}`);
    console.log(`📊 Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB\n`);

    console.log('📋 V4 IMPROVEMENTS:');
    console.log('  ✅ Detailed SITUATION section (what we found + why benchmark matters)');
    console.log('  ✅ Detailed COMPLICATION section (business impact explanation)');
    console.log('  ✅ Step-by-step calculation breakdown (15 steps with formulas)');
    console.log('  ✅ Detailed assumptions and sensitivity analysis');
    console.log('  ✅ Enhanced solution rationale (why this solution works)');
    console.log('  ✅ Path-specific explanations (why each implementation path makes sense)');
    console.log('  ✅ Market evidence context (why sources are credible)');
    console.log('  ✅ Kept V3 visual elements (code snippets, neon colors, checkboxes)');
    console.log('  ✅ Maintained Pyramid Principle structure throughout\n');

    console.log('🎯 USER FEEDBACK ADDRESSED:');
    console.log('  ✅ "więcej słowa pisanego" → Added extensive written explanations');
    console.log('  ✅ "wyjaśniaj bardziej wszystkie liczby" → 15-step calculation breakdown');
    console.log('  ✅ "nie zapominaj o pyramid principles" → Clear SITUATION→COMPLICATION→ANSWER');
    console.log('  ✅ "user friendly oriented" → Combined detailed text with visual quick-scan\n');

    console.log('📄 STRUCTURE:');
    console.log('  Page 1: Cover (score overview)');
    console.log('  Page 2: 90-Day Roadmap (visual timeline, checkboxes)');
    console.log('  Page 3: Executive Summary');
    console.log('  Page 4: Methodology (calculation transparency)');
    console.log('  Pages 5-6: FIND Category with V4 enhancements');
    console.log('    → SITUATION (detailed current state + benchmark context)');
    console.log('    → COMPLICATION (business impact + 15-step calculation)');
    console.log('    → ANSWER (solution + 3 paths + code snippets)');
    console.log('  Page 7: Decision Matrix');
    console.log('  Page 8: Founder\'s Cheat Sheet (printable)\n');

    console.log('✨ Open PDF to verify V4 enhancements!');
  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Run test
generateTestPDF().catch(console.error);

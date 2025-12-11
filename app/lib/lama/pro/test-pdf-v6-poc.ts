/**
 * LAMA PRO V6 - POC Test Data
 * Generates ~17 page PDF:
 * - Cover page (1)
 * - FIND section (4 pages)
 * - CRM section (12 pages)
 */

import fs from 'fs';
import path from 'path';
import { renderToStream } from '@react-pdf/renderer';
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { CoverWithCalculation } from './pdf/components/CoverWithCalculation';
import { FINDSection4Pages } from './pdf/components/find-section/FINDSection4Pages';
import { CRMSection12Pages } from './pdf/components/crm-extended/CRMSection12Pages';

// ===================== COVER DATA =====================
const coverData = {
  websiteUrl: 'https://example-saas-company.com',
  companyName: 'Example SaaS Company',
  overallScore: 52,
  estimatedRevenueLoss: 1800000,
  generatedDate: new Date().toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  calculationSummary: {
    avgMonthlyVisitors: 15000,
    conversionRate: 0.03,
    avgDealSize: 12000,
    closeRate: 0.25,
    lostVisitorsPerMonth: 4000,
    source:
      'HubSpot 2024 Marketing Statistics, Salesforce State of Marketing Report 2024, Gartner B2B SaaS Benchmarks',
  },
};

// ===================== FIND SECTION DATA =====================
const findData = {
  categoryName: 'FIND (SEO)',
  score: 48,
  industryBenchmark: 75,
  overview: {
    currentSituation:
      'Obecna widoczność w Google jest znacząco poniżej potencjału. Strona rankuje dla jedynie 140 słów kluczowych (vs 800+ u konkurencji), z czego tylko 12 w top 10. Brak strukturalnej strategii SEO, większość traffic pochodzi z branded searches.',
    mainProblems: [
      'Technical SEO: Strona ma 47 błędów krytycznych blokujących crawling (broken links, duplicate content, slow load)',
      'Content gaps: Brakuje contentu dla 80% high-intent keywords w Twojej branży',
      'Backlink deficit: 89 backlinków vs 1200+ u top 3 konkurentów',
      'No local optimization: Pomimo 60% klientów z Warszawy, brak local SEO strategy',
    ],
    opportunitySize: {
      additionalTrafficPerMonth: 9000,
      additionalRevenuePerYear: 108000,
      calculationSteps: [
        {
          step: 1,
          description: 'Identified 45 high-value keywords gdzie jesteś na pozycji 11-30',
          value: '45 keywords × avg 200 searches/mo = 9,000 potential monthly visitors',
        },
        {
          step: 2,
          description:
            'Industry average CTR increase when moving from page 2 to top 3: 15% → 35%',
          value: '+20% CTR gain',
        },
        {
          step: 3,
          description: 'Conversion rate for organic traffic (industry avg B2B SaaS)',
          value: '3% become leads',
        },
        {
          step: 4,
          description: 'Sales conversion',
          value: '25% close rate × €12,000 avg deal = €3,000 per lead',
        },
        {
          step: 5,
          description: 'Annual calculation',
          value: '9,000 visitors/mo × 3% conv × 25% close × €12,000 × 12mo = €108,000/year',
        },
      ],
      source: 'Ahrefs 2024 CTR Study, HubSpot B2B Conversion Benchmarks, Gartner SaaS Metrics',
    },
  },
  technicalSEO: {
    criticalIssues: [
      {
        issue: 'Page speed: 4.8s LCP (Largest Contentful Paint)',
        impact: 'Google penalizes slow pages. Estimated 15-20% traffic loss',
        priority: 'CRITICAL' as const,
        effort: 'Medium' as const,
      },
      {
        issue: '23 broken internal links + 14 broken external links',
        impact: 'Wastes crawl budget, poor UX, PageRank leakage',
        priority: 'HIGH' as const,
        effort: 'Low' as const,
      },
      {
        issue: 'Duplicate content: 18 pages with identical/near-identical content',
        impact: 'Confuses Google, cannibalization, ranking dilution',
        priority: 'CRITICAL' as const,
        effort: 'Medium' as const,
      },
      {
        issue: 'Missing XML sitemap + robots.txt errors',
        impact: '40% of pages not indexed by Google',
        priority: 'CRITICAL' as const,
        effort: 'Low' as const,
      },
    ],
    onPageIssues: [
      {
        issue: 'Title tags: 67% pages have non-optimized titles',
        impact: 'Lower CTR from search results (-10-15% clicks)',
        priority: 'HIGH' as const,
        effort: 'Low' as const,
      },
      {
        issue: 'Meta descriptions: 52% missing or too short',
        impact: 'Google generates random snippets, lower CTR',
        priority: 'MEDIUM' as const,
        effort: 'Low' as const,
      },
      {
        issue: 'Header structure: Improper H1-H6 hierarchy on 80% pages',
        impact: 'Harder for Google to understand page structure',
        priority: 'MEDIUM' as const,
        effort: 'Medium' as const,
      },
      {
        issue: 'Image optimization: 90% images missing alt tags',
        impact: 'Lost image search traffic, accessibility issues',
        priority: 'MEDIUM' as const,
        effort: 'Low' as const,
      },
    ],
    quickWins: [
      'Fix broken links (1-2h) → immediate crawl budget improvement',
      'Create XML sitemap (30min) → get all pages indexed',
      'Optimize title tags for top 10 pages (2h) → +10-15% CTR',
      'Add alt tags to images (1h) → accessibility + image search traffic',
      'Fix robots.txt (15min) → unblock Google crawlers',
    ],
    roi: '€18,000/year from quick wins alone (20% of total SEO opportunity)',
  },
  contentStrategy: {
    currentState:
      'Content strategy jest reactive (blog posty sporadycznie) zamiast strategic. Brakuje contentu dla buyer journey stages: awareness (brak educational content), consideration (brak comparison guides), decision (brak case studies SEO-optimized).',
    keywordOpportunities: [
      {
        keyword: 'crm automation for saas',
        currentPosition: 'Not ranking',
        targetPosition: 3,
        monthlySearches: 1200,
        difficulty: 'Medium' as const,
        estimatedTraffic: '~420 visitors/mo at position #3',
      },
      {
        keyword: 'marketing automation best practices',
        currentPosition: 34,
        targetPosition: 5,
        monthlySearches: 2400,
        difficulty: 'High' as const,
        estimatedTraffic: '~720 visitors/mo at position #5',
      },
      {
        keyword: 'lead scoring model template',
        currentPosition: 18,
        targetPosition: 3,
        monthlySearches: 890,
        difficulty: 'Low' as const,
        estimatedTraffic: '~310 visitors/mo at position #3',
      },
      {
        keyword: 'email nurture sequence examples',
        currentPosition: 'Not ranking',
        targetPosition: 5,
        monthlySearches: 1600,
        difficulty: 'Medium' as const,
        estimatedTraffic: '~480 visitors/mo at position #5',
      },
      {
        keyword: 'b2b sales funnel optimization',
        currentPosition: 28,
        targetPosition: 7,
        monthlySearches: 1100,
        difficulty: 'Medium' as const,
        estimatedTraffic: '~275 visitors/mo at position #7',
      },
    ],
    contentGaps: [
      {
        topic: 'Ultimate Guide to CRM Setup for SaaS Startups',
        searchIntent: 'Informational (early awareness)',
        competition: 'Medium - top 5 results are 2500+ word guides',
        opportunity:
          'None of competitors cover Zapier/Make.com integrations. Your expertise = competitive advantage',
        priority: 'HIGH' as const,
      },
      {
        topic: 'Marketing Automation ROI Calculator (Interactive Tool)',
        searchIntent: 'Commercial investigation',
        competition: 'Low - only 2 interactive calculators exist',
        opportunity:
          'High shareability, natural backlink magnet, lead capture opportunity',
        priority: 'CRITICAL' as const,
      },
      {
        topic: 'Case Study: How [Client] Increased Conversions 180% with CRM Automation',
        searchIntent: 'Transactional (late stage)',
        competition: 'Low - most competitors have generic case studies',
        opportunity: 'Detailed, data-rich case study ranks well + builds trust',
        priority: 'HIGH' as const,
      },
      {
        topic: 'Email Sequence Templates Library (50+ Templates)',
        searchIntent: 'Commercial',
        competition: 'Medium - downloadable resources rank well',
        opportunity: 'Lead magnet + SEO traffic + social shares',
        priority: 'MEDIUM' as const,
      },
    ],
    contentPlan: [
      'Week 1-2: Publish "Ultimate CRM Setup Guide" (3000 words, target: crm automation for saas)',
      'Week 3: Launch ROI Calculator tool (interactive, JS-based)',
      'Week 4: Publish detailed case study with real numbers',
      'Week 5-6: Create 50+ email template library (gated download)',
      'Week 7-8: Publish comparison guide "Zapier vs Make.com vs Integromat"',
    ],
    roi: '€45,000/year from content strategy (5 pillar pieces driving 3,750 monthly visitors)',
  },
  linkBuilding: {
    currentBacklinks: 89,
    targetBacklinks: 350,
    linkOpportunities: [
      {
        type: 'Guest posts on industry blogs',
        source: 'MarketingProfs, HubSpot Blog, CRM.org',
        effort: 'Medium' as const,
        impact: 'High' as const,
        notes:
          'Pitch case study-based articles. Target: 1 guest post/month × DR 70+ sites',
      },
      {
        type: 'Resource page link insertions',
        source: 'Universities teaching marketing automation, industry associations',
        effort: 'Low' as const,
        impact: 'Medium' as const,
        notes: 'Identify 50 resource pages, email outreach with ROI calculator offer',
      },
      {
        type: 'Broken link building',
        source: 'Competitors with broken backlinks (identified 34 opportunities)',
        effort: 'Low' as const,
        impact: 'Medium' as const,
        notes: 'Reach out to sites linking to broken pages, suggest your content',
      },
      {
        type: 'Digital PR / Newsjacking',
        source: 'HARO, industry publications',
        effort: 'High' as const,
        impact: 'High' as const,
        notes: 'Respond to journalist queries on marketing automation topics',
      },
      {
        type: 'Partner/integration listings',
        source: 'Zapier, Make.com, HubSpot partner directories',
        effort: 'Low' as const,
        impact: 'Medium' as const,
        notes: 'Free high-authority backlinks from tool ecosystems',
      },
    ],
    localSEO: {
      gmb: 'Google My Business not claimed. Setup + optimize → appears in "marketing consultant Warsaw" searches',
      citations: 'Only 3/50 major directories. Target: Complete NAP (Name, Address, Phone) across 50 directories',
      reviews: '2 Google reviews (avg 4.5★). Target: 25+ reviews in 90 days (review generation campaign)',
    },
    roi: '€45,000/year from backlink strategy (Domain Authority boost → higher rankings across board)',
  },
};

// ===================== CRM SECTION DATA =====================
const crmData = {
  categoryName: 'ENGAGE (CRM)',
  score: 35,
  industryBenchmark: 78,
  crmOverview: {
    currentState:
      'System zarządzania leadami jest w 90% manualny. Leady z formularza trafiają do Excela, follow-up zależy od manualnych reminderów, brak lead scoring (sales goni każdego leada równo), email sequences nie istnieją. Rezultat: 60% leadów nigdy nie otrzymuje follow-up, średni czas reakcji to 4.5 dnia.',
    revenueLossBreakdown: {
      fromSlowResponse: 180000,
      fromPoorFollowUp: 240000,
      fromNoNurture: 320000,
      fromManualErrors: 110000,
      total: 850000,
    },
    calculationSteps: [
      {
        step: 1,
        description: 'Slow response time (4.5 days vs 5 min benchmark)',
        value: 'Lost 30% of inbound leads → €180k/year',
      },
      {
        step: 2,
        description: 'Poor follow-up (60% leads never contacted)',
        value: 'Lost deals from no-contact → €240k/year',
      },
      {
        step: 3,
        description: 'No nurture sequences (85% leads not ready to buy immediately)',
        value: 'Lost long-term pipeline → €320k/year',
      },
      {
        step: 4,
        description: 'Manual errors (duplicate entries, lost data, wrong assignments)',
        value: 'Operational inefficiency → €110k/year',
      },
      {
        step: 5,
        description: 'Total annual revenue loss',
        value: '€850,000/year',
      },
    ],
    calculationSource:
      'Harvard Business Review Lead Response Study, Salesforce Sales Velocity Report 2024, InsideSales.com Response Time Research',
  },
  leadResponse: {
    currentResponseTime: '4.5 days average',
    benchmarkResponseTime: '< 5 minutes',
    impactOfDelay:
      'HBR study: Leads contacted within 5 minutes are 21x more likely to qualify than leads contacted after 30 minutes. Your 4.5-day response time means you\'re losing 78% of potential deals before first contact.',
    lostDealsPerMonth: 18,
    lostRevenuePerMonth: 54000,
    calculationSteps: [
      {
        step: 1,
        description: 'Current inbound leads per month',
        value: '60 leads',
      },
      {
        step: 2,
        description: 'Expected qualification rate with instant response (< 5min)',
        value: '50% = 30 qualified leads',
      },
      {
        step: 3,
        description: 'Actual qualification rate with 4.5-day delay',
        value: '20% = 12 qualified leads',
      },
      {
        step: 4,
        description: 'Lost qualified leads per month',
        value: '30 - 12 = 18 lost opportunities',
      },
      {
        step: 5,
        description: 'Lost revenue (18 leads × 25% close rate × €12k avg deal)',
        value: '€54,000/month = €648,000/year',
      },
    ],
  },
  implementation: {
    zapierSetup: {
      steps: [
        {
          stepNumber: 1,
          description:
            'Create Zapier account (free tier sufficient for < 100 leads/mo)',
          timing: '5 minutes',
        },
        {
          stepNumber: 2,
          description:
            'Connect form submission trigger (Webflow/Typeform/Google Forms → Zapier webhook)',
          timing: '10 minutes',
          tool: 'Zapier Webhooks',
        },
        {
          stepNumber: 3,
          description:
            'Add email action: Send instant confirmation email to lead (use template from Page 4)',
          timing: '15 minutes',
          tool: 'Gmail / Resend / SendGrid',
        },
        {
          stepNumber: 4,
          description:
            'Add Slack notification: Alert sales team in #leads channel with lead details',
          timing: '10 minutes',
          tool: 'Slack',
        },
        {
          stepNumber: 5,
          description:
            'Add CRM entry: Create new contact in your CRM/spreadsheet with lead source tracking',
          timing: '15 minutes',
          tool: 'Google Sheets / Airtable / HubSpot',
        },
        {
          stepNumber: 6,
          description:
            'Test workflow: Submit test form, verify all steps execute within 5 minutes',
          timing: '10 minutes',
        },
        {
          stepNumber: 7,
          description:
            'Add calendar booking link to confirmation email (optional but recommended)',
          timing: '10 minutes',
          tool: 'Calendly',
          conditional: 'if lead is high-intent',
        },
      ],
      estimatedTime: '1.5 - 2 hours total setup',
      cost: '€0-29/month (Zapier free tier or Starter plan)',
    },
    quickWins: [
      'Day 1: Setup instant email response (cuts response time from 4.5 days to < 5min)',
      'Day 2: Add Slack notifications (ensures sales team sees leads immediately)',
      'Day 3: Create simple lead score in spreadsheet (prioritize by company size + intent)',
      'Week 1: Launch 7-day welcome sequence (emails auto-send, no manual work)',
    ],
    commonMistakes: [
      'Generic email templates - Personalize with {first_name}, {company}, {problem_mentioned}',
      'No A/B testing - Test subject lines, CTAs, sending times',
      'Forgetting mobile optimization - 60% leads check email on mobile',
      'No unsubscribe link - Legal requirement + damages reputation',
      'Overloading with info - Keep emails short (< 150 words)',
    ],
  },
  emailSequences: {
    welcome: {
      emails: [
        {
          day: 1,
          subject: 'Thanks for reaching out, {first_name}',
          preview:
            'We received your request about {problem}. Here\'s what happens next...',
          goal: 'Confirm receipt, set expectations',
          cta: 'Book intro call',
        },
        {
          day: 2,
          subject: 'Quick question about {company}',
          preview:
            'Before our call, I wanted to understand your current setup better...',
          goal: 'Qualify lead, gather info',
          cta: 'Reply with 2-sentence answer',
        },
        {
          day: 4,
          subject: 'Case study: How {similar_company} solved {problem}',
          preview:
            'Thought you\'d find this relevant given your situation with {company}...',
          goal: 'Build credibility, show proof',
          cta: 'Read 3-min case study',
        },
        {
          day: 6,
          subject: 'Free resource: {problem} checklist',
          preview: '23-point checklist to audit your current {system}...',
          goal: 'Provide value, stay top of mind',
          cta: 'Download checklist',
        },
        {
          day: 7,
          subject: 'Still interested in solving {problem}?',
          preview:
            'Haven\'t heard back - if timing isn\'t right, no worries. Just let me know...',
          goal: 'Re-engage, qualify out if not interested',
          cta: 'Yes, let\'s talk / Not right now',
        },
      ],
      roi: '€195,000/year',
      calculationSteps: [
        {
          step: 1,
          description: 'Leads entering welcome sequence per month',
          value: '60 leads',
        },
        {
          step: 2,
          description: 'Conversion rate (no sequence vs with sequence)',
          value: '8% → 25% (+17% improvement)',
        },
        {
          step: 3,
          description: 'Additional closed deals per month',
          value: '60 × 17% = 10.2 extra deals',
        },
        {
          step: 4,
          description: 'Revenue per deal',
          value: '€12,000 average',
        },
        {
          step: 5,
          description: 'Annual revenue from welcome sequence',
          value: '10.2 deals/mo × €12k × 12mo = €1,468,800 → attributed 13% to emails = €195k',
        },
      ],
    },
    nurture: {
      emails: [
        {
          day: 1,
          subject: 'Not ready yet? Let\'s stay in touch',
          preview: 'I\'ll send you valuable insights every 2 weeks - no selling, just value',
          goal: 'Set expectations for long-term nurture',
        },
        {
          day: 14,
          subject: 'Industry insight: {trend} affecting {industry}',
          preview: 'Data from latest {industry} report...',
          goal: 'Establish thought leadership',
        },
        {
          day: 28,
          subject: 'Tool recommendation: {free_tool} for {use_case}',
          preview: 'Even if we never work together, this tool will help you...',
          goal: 'Provide value, build goodwill',
        },
        {
          day: 42,
          subject: 'Webinar: {topic} masterclass (free)',
          preview: 'Live session next week - recording sent to all registrants...',
          goal: 'Re-engage, qualify readiness',
        },
        {
          day: 56,
          subject: 'Case study update: {client} results after 6 months',
          preview: 'Remember the case study I sent? Here\'s the long-term impact...',
          goal: 'Show ongoing value, proof',
        },
        {
          day: 70,
          subject: 'Quick check-in: How\'s {problem} going?',
          preview: 'Circling back - has your situation with {problem} changed?',
          goal: 'Qualify if timing is better',
        },
        {
          day: 84,
          subject: 'End of quarter: Special offer for {company}',
          preview: 'Limited spots available for Q2 onboarding...',
          goal: 'Create urgency, convert',
        },
      ],
      roi: '€120,000/year',
      calculationSteps: [
        {
          step: 1,
          description: 'Leads entering long-term nurture per month',
          value: '40 leads (those not immediately ready)',
        },
        {
          step: 2,
          description: 'Conversion rate over 90 days (with nurture vs without)',
          value: '2% → 12% (+10% improvement)',
        },
        {
          step: 3,
          description: 'Deals closed from nurture per month',
          value: '40 × 10% = 4 deals',
        },
        {
          step: 4,
          description: 'Revenue',
          value: '4 deals × €12k × 12mo = €576k → 21% attributed to nurture = €120k',
        },
      ],
    },
    reengagement: {
      emails: [
        {
          day: 1,
          subject: 'We miss you, {first_name}',
          preview: 'Haven\'t heard from you in a while - everything okay?',
          goal: 'Friendly check-in',
          cta: 'Quick update?',
        },
        {
          day: 4,
          subject: 'Should I remove you from the list?',
          preview: 'If you\'re not interested anymore, no hard feelings...',
          goal: 'Create urgency via potential loss',
          cta: 'Keep me subscribed / Unsubscribe',
        },
        {
          day: 7,
          subject: 'One last thing before you go...',
          preview: 'Our best resource: {ultimate_guide} (completely free)',
          goal: 'Final value offer',
          cta: 'Download guide',
        },
        {
          day: 10,
          subject: '{mutual_connection} suggested I reach out',
          preview: 'Saw you know {name} - they mentioned you might be interested in...',
          goal: 'Social proof, personal touch',
          cta: 'Let\'s chat',
        },
        {
          day: 14,
          subject: 'New: {product_feature} now available',
          preview: 'Launching something that directly solves {their_problem}...',
          goal: 'Re-engage with product news',
          cta: 'See demo',
        },
      ],
      roi: '€72,000/year',
      calculationSteps: [
        {
          step: 1,
          description: 'Cold/inactive leads re-engaged per month',
          value: '50 leads',
        },
        {
          step: 2,
          description: 'Recovery rate (with re-engagement sequence)',
          value: '10% = 5 re-activated leads',
        },
        {
          step: 3,
          description: 'Conversion of re-activated leads',
          value: '20% × 5 = 1 deal/month',
        },
        {
          step: 4,
          description: 'Annual revenue',
          value: '1 deal/mo × €12k × 12mo × 50% attribution = €72k',
        },
      ],
    },
  },
  leadScoring: {
    behavioral: {
      signals: [
        {
          signal: 'Visited pricing page 3+ times',
          description: 'High purchase intent - actively evaluating cost',
          points: 25,
          priority: 'CRITICAL' as const,
        },
        {
          signal: 'Downloaded case study or whitepaper',
          description: 'Researching solutions, mid-funnel',
          points: 15,
          priority: 'HIGH' as const,
        },
        {
          signal: 'Opened 5+ emails in last 30 days',
          description: 'Engaged with content, warm lead',
          points: 10,
          priority: 'MEDIUM' as const,
        },
        {
          signal: 'Attended webinar or demo',
          description: 'Very high intent, ready for sales conversation',
          points: 30,
          priority: 'CRITICAL' as const,
        },
        {
          signal: 'Visited competitors pages (tracked via retargeting pixel)',
          description: 'Actively comparing options, decision phase',
          points: 20,
          priority: 'HIGH' as const,
        },
        {
          signal: 'Requested quote or calendar booking',
          description: 'Hot lead, immediate sales handoff',
          points: 40,
          priority: 'CRITICAL' as const,
        },
        {
          signal: 'Spent 10+ minutes on site in single session',
          description: 'Deep engagement, exploring thoroughly',
          points: 12,
          priority: 'MEDIUM' as const,
        },
        {
          signal: 'Shared content on social media',
          description: 'Advocate potential, engaged',
          points: 8,
          priority: 'LOW' as const,
        },
      ],
      exampleScenario:
        'Lead "John" visits your site, downloads case study (+15 pts), visits pricing 4 times (+25 pts), attends webinar (+30 pts), and books call (+40 pts). Total: 110 points = HOT lead, immediate sales handoff.',
    },
    demographic: {
      signals: [
        {
          signal: 'Company size: 50-500 employees (your ICP)',
          description: 'Perfect fit - budget + need for your solution',
          points: 20,
          priority: 'HIGH' as const,
        },
        {
          signal: 'Job title: VP Marketing, CMO, Head of Growth',
          description: 'Decision maker or strong influencer',
          points: 25,
          priority: 'CRITICAL' as const,
        },
        {
          signal: 'Industry: SaaS, E-commerce, Consulting',
          description: 'Your top 3 performing verticals',
          points: 15,
          priority: 'HIGH' as const,
        },
        {
          signal: 'Location: Warsaw, Krakow, Berlin, London',
          description: 'Serviceable regions, no timezone issues',
          points: 10,
          priority: 'MEDIUM' as const,
        },
        {
          signal: 'Revenue: €1M-€50M ARR',
          description: 'Budget sweet spot for your services',
          points: 15,
          priority: 'HIGH' as const,
        },
        {
          signal: 'Tech stack: Uses Zapier, HubSpot, or Salesforce',
          description: 'Already automation-aware, easier to sell',
          points: 12,
          priority: 'MEDIUM' as const,
        },
      ],
      exampleScenario:
        'Lead "Sarah" is CMO (+25 pts) at 200-person SaaS company (+20 pts), based in Warsaw (+10 pts), €10M ARR (+15 pts), using HubSpot (+12 pts). Total: 82 points = Qualified lead, sales should prioritize.',
    },
    implementation: {
      steps: [
        {
          stepNumber: 1,
          description:
            'Setup tracking: Add event tracking to key pages (pricing, case studies, webinar)',
          timing: '2-3 hours',
          tool: 'Google Tag Manager',
        },
        {
          stepNumber: 2,
          description:
            'Create scoring sheet: Spreadsheet with behavioral + demographic signals',
          timing: '1 hour',
          tool: 'Google Sheets / Airtable',
        },
        {
          stepNumber: 3,
          description:
            'Zapier automation: New lead → calculate score → assign tier (Hot/Warm/Cold)',
          timing: '2 hours',
          tool: 'Zapier',
        },
        {
          stepNumber: 4,
          description:
            'Route leads: Hot (80+ pts) → sales, Warm (50-79) → nurture, Cold (< 50) → long-term',
          timing: '1 hour',
        },
        {
          stepNumber: 5,
          description: 'Test & refine: Monitor for 2 weeks, adjust point values',
          timing: 'Ongoing',
        },
      ],
      metrics: [
        {
          metric: 'Lead qualification time',
          current: '4 days (manual)',
          target: 'Instant (automated)',
        },
        {
          metric: 'Sales time spent on unqualified leads',
          current: '40% of time wasted',
          target: '< 10%',
        },
        {
          metric: 'Conversion rate (MQL → SQL)',
          current: '15%',
          target: '35%',
        },
        {
          metric: 'Sales cycle length',
          current: '45 days',
          target: '28 days',
        },
      ],
      roi: '€240,000/year (40% time saved × redirected to high-quality leads)',
    },
  },
  fitToMarketScenarios: [
    // Scenario 1: E-commerce Abandoned Cart
    {
      detectedProblem: {
        category: 'cart' as const,
        metric: 'Cart abandonment rate',
        currentValue: '78%',
        benchmarkValue: '55-60%',
        gap: '18-23% above benchmark',
      },
      scenario: {
        title: 'Abandoned Cart Recovery Automation',
        description:
          'Automated email + SMS sequence triggered when user adds to cart but doesn\'t complete purchase. Includes personalized product reminders, urgency tactics (limited stock, expiring discount), and friction reduction (1-click checkout).',
        applicableTo: ['E-commerce', 'SaaS free trial', 'High-ticket B2C'],
        complexity: 'Medium' as const,
      },
      workflow: {
        trigger: 'User adds product to cart, leaves site without purchasing',
        steps: [
          {
            stepNumber: 1,
            description: 'Wait 1 hour (give user time to return organically)',
            timing: '1 hour delay',
            tool: 'Klaviyo / Zapier delay',
          },
          {
            stepNumber: 2,
            description:
              'Send Email #1: "You left something behind!" with product image + CTA',
            timing: 'Immediately after 1h',
            tool: 'Klaviyo / Mailchimp',
          },
          {
            stepNumber: 3,
            description: 'If no purchase, wait 23 hours',
            timing: '23 hour delay',
            conditional: 'if cart still abandoned',
          },
          {
            stepNumber: 4,
            description:
              'Send Email #2: "10% discount if you complete order in next 24h" + urgency',
            timing: '24h after cart abandonment',
            tool: 'Klaviyo',
          },
          {
            stepNumber: 5,
            description:
              'If cart value > €100, send SMS: "Your cart expires in 6h - use code SAVE10"',
            timing: '42h after abandonment',
            tool: 'Twilio / Klaviyo SMS',
            conditional: 'if cart value > €100',
          },
          {
            stepNumber: 6,
            description:
              'Final email: "Last chance - your cart expires tonight" + social proof',
            timing: '48h after abandonment',
            tool: 'Klaviyo',
          },
          {
            stepNumber: 7,
            description: 'If still no purchase, move to general nurture sequence',
            timing: '72h after abandonment',
          },
        ],
        tools: ['Klaviyo', 'Zapier', 'Twilio (for SMS)', 'Shopify/WooCommerce'],
        totalDuration: '48-72 hours',
      },
      impact: {
        recoveryRate: '15-25% of abandoned carts recovered',
        calculationSteps: [
          {
            step: 1,
            description: 'Monthly cart abandonments',
            value: '500 carts × €240 avg cart value = €120,000 abandoned',
          },
          {
            step: 2,
            description: 'Recovery rate with automation (industry benchmark)',
            value: '20% recovery = 100 carts recovered',
          },
          {
            step: 3,
            description: 'Monthly recovered revenue',
            value: '100 carts × €240 = €24,000/month',
          },
          {
            step: 4,
            description: 'Annual recovered revenue',
            value: '€24,000 × 12 = €288,000/year',
          },
          {
            step: 5,
            description: 'Net revenue (after discount costs)',
            value: '€288k - €28,800 (10% discounts) = €259,200/year',
          },
        ],
        roi: '€259,200/year',
        timeToImplement: '8-12 hours (setup + testing)',
        cost: '€50-150/month (Klaviyo + SMS costs)',
      },
      templates: {
        emails: [
          {
            day: 0,
            subject: '{first_name}, you left something in your cart!',
            preview: 'Your {product_name} is waiting for you...',
            goal: 'Remind about abandoned items',
            cta: 'Complete your order',
          },
          {
            day: 1,
            subject: 'EXCLUSIVE: 10% off if you complete order today',
            preview: 'Just for you - save on your {product_name}',
            goal: 'Incentivize with discount',
            cta: 'Claim 10% discount',
          },
          {
            day: 2,
            subject: 'Your cart expires in 6 hours ⏰',
            preview: 'Last chance to get {product_name} before it sells out',
            goal: 'Create urgency',
            cta: 'Checkout now',
          },
        ],
      },
    },
    // Scenario 2: SaaS Trial Activation
    {
      detectedProblem: {
        category: 'trial' as const,
        metric: 'Trial activation rate',
        currentValue: '22%',
        benchmarkValue: '40-50%',
        gap: '18-28% below benchmark',
      },
      scenario: {
        title: 'SaaS Trial Activation Sequence',
        description:
          '7-day onboarding email series guiding users through key product features, reducing time-to-value, and driving activation (defined as user completing 3+ key actions). Combines educational content, in-app notifications, and personal check-ins.',
        applicableTo: ['SaaS', 'Software trials', 'Digital products'],
        complexity: 'High' as const,
      },
      workflow: {
        trigger: 'User signs up for free trial',
        steps: [
          {
            stepNumber: 1,
            description:
              'Send welcome email immediately: "Welcome to {product}! Start here 👇"',
            timing: 'Instant',
            tool: 'Customer.io / Intercom',
          },
          {
            stepNumber: 2,
            description:
              'In-app tutorial popup: Guide to first action (e.g., create project)',
            timing: 'On first login',
            tool: 'Appcues / Pendo',
          },
          {
            stepNumber: 3,
            description:
              'Day 1: Email with video tutorial "How to {core_feature} in 5 minutes"',
            timing: '24h after signup',
            tool: 'Customer.io',
          },
          {
            stepNumber: 4,
            description:
              'Day 2: If user hasn\'t completed key action → automated Slack message from "founder"',
            timing: '48h after signup',
            tool: 'Zapier → Slack',
            conditional: 'if activation criteria not met',
          },
          {
            stepNumber: 5,
            description:
              'Day 3: Email case study "How {similar_company} uses {product}"',
            timing: '72h after signup',
            tool: 'Customer.io',
          },
          {
            stepNumber: 6,
            description:
              'Day 5: Personal email from customer success: "Need help? Book a call"',
            timing: '120h after signup',
            tool: 'Manual or automated with calendly link',
          },
          {
            stepNumber: 7,
            description:
              'Day 7: "Trial ending soon - upgrade now and save 20%"',
            timing: '168h after signup',
            tool: 'Customer.io',
          },
        ],
        tools: ['Customer.io', 'Appcues', 'Zapier', 'Calendly'],
        totalDuration: '7 days (trial period)',
      },
      impact: {
        recoveryRate: '22% → 45% activation (2x improvement)',
        calculationSteps: [
          {
            step: 1,
            description: 'Monthly trial signups',
            value: '300 users',
          },
          {
            step: 2,
            description: 'Current activation rate',
            value: '22% = 66 activated users',
          },
          {
            step: 3,
            description: 'Target activation rate (with onboarding sequence)',
            value: '45% = 135 activated users',
          },
          {
            step: 4,
            description: 'Additional activated users per month',
            value: '135 - 66 = 69 users',
          },
          {
            step: 5,
            description:
              'Conversion to paid (activated users convert at 35% vs 8% for non-activated)',
            value: '69 × 35% = 24 new paying customers/month',
          },
          {
            step: 6,
            description: 'Annual revenue (€99/mo avg subscription)',
            value: '24 customers/mo × €99 × 12mo × LTV multiplier 1.5 = €427,680/year',
          },
        ],
        roi: '€427,680/year',
        timeToImplement: '20-30 hours (email writing, video creation, tool setup)',
        cost: '€200-500/month (Customer.io + Appcues)',
      },
      templates: {
        emails: [
          {
            day: 0,
            subject: 'Welcome to {product}, {first_name}! 🎉',
            preview: 'Here\'s how to get started in the next 5 minutes...',
            goal: 'Set clear expectations, reduce overwhelm',
            cta: 'Watch 2-min setup video',
          },
          {
            day: 1,
            subject: 'Quick win: Set up your first {feature} in 5 minutes',
            preview: 'Most users complete this in under 5 minutes...',
            goal: 'Drive first activation event',
            cta: 'Create your first {feature}',
          },
          {
            day: 3,
            subject: 'How {company_name} uses {product} to {outcome}',
            preview: 'Case study: 3x faster {process} in 30 days',
            goal: 'Show real-world value, reduce churn',
            cta: 'Read 3-min case study',
          },
          {
            day: 5,
            subject: 'Need help with {product}? I\'m here',
            preview: 'Personal message from our Customer Success team...',
            goal: 'Human touchpoint, reduce friction',
            cta: 'Book 15-min call',
          },
          {
            day: 7,
            subject: 'Your trial ends tomorrow - save 20% if you upgrade now',
            preview: 'Don\'t lose your work - upgrade and keep everything',
            goal: 'Convert to paid',
            cta: 'Upgrade now (20% off)',
          },
        ],
      },
    },
    // Scenario 3: Webinar No-Show Recovery
    {
      detectedProblem: {
        category: 'webinar' as const,
        metric: 'Webinar attendance rate',
        currentValue: '35%',
        benchmarkValue: '50-65%',
        gap: '15-30% below benchmark',
      },
      scenario: {
        title: 'Webinar No-Show Recovery + Replay Nurture',
        description:
          'Multi-channel reminder sequence (email + SMS) before webinar, then automated replay delivery + nurture sequence for no-shows. Turns 65% no-shows into engaged leads via replay + follow-up.',
        applicableTo: ['Consulting', 'Coaching', 'B2B SaaS', 'Education'],
        complexity: 'Low' as const,
      },
      workflow: {
        trigger: 'User registers for webinar',
        steps: [
          {
            stepNumber: 1,
            description:
              'Send confirmation email immediately with calendar invite (.ics file)',
            timing: 'Instant',
            tool: 'Zoom / Demio webhooks → Zapier',
          },
          {
            stepNumber: 2,
            description:
              'Send reminder email 24h before: "Tomorrow at {time} - add to calendar"',
            timing: '24h before webinar',
            tool: 'Zapier delay + email',
          },
          {
            stepNumber: 3,
            description:
              'Send SMS reminder 1h before: "Starting in 60 min - {webinar_link}"',
            timing: '1h before webinar',
            tool: 'Twilio',
          },
          {
            stepNumber: 4,
            description:
              'If user doesn\'t attend, wait 2h after webinar ends',
            timing: '2h after webinar',
            conditional: 'if user did not attend',
          },
          {
            stepNumber: 5,
            description:
              'Send replay email: "Sorry we missed you! Watch replay + get slides"',
            timing: '2h post-webinar',
            tool: 'Email with replay link',
          },
          {
            stepNumber: 6,
            description:
              'If replay not watched in 48h, send: "Replay expires in 24h"',
            timing: '48h after replay sent',
            tool: 'Email',
            conditional: 'if replay not watched',
          },
          {
            stepNumber: 7,
            description:
              'After replay watched, send: "Book consultation to discuss your situation"',
            timing: '1h after replay watched',
            tool: 'Email with Calendly',
          },
        ],
        tools: ['Zoom/Demio', 'Zapier', 'Twilio', 'Calendly', 'Vimeo (for replay hosting)'],
        totalDuration: '4 days',
      },
      impact: {
        recoveryRate: '40% of no-shows watch replay, 15% book consultation',
        calculationSteps: [
          {
            step: 1,
            description: 'Webinar registrations per month',
            value: '200 registrants',
          },
          {
            step: 2,
            description: 'Current attendance rate',
            value: '35% = 70 attendees, 130 no-shows',
          },
          {
            step: 3,
            description: 'No-shows who watch replay (with automation)',
            value: '130 × 40% = 52 replay viewers',
          },
          {
            step: 4,
            description: 'Replay viewers who book consultation',
            value: '52 × 15% = 8 consultations booked',
          },
          {
            step: 5,
            description: 'Consultation → client conversion rate',
            value: '8 × 40% = 3.2 new clients/month',
          },
          {
            step: 6,
            description: 'Annual revenue (€15k avg consulting project)',
            value: '3.2 clients/mo × €15k × 12mo = €576,000/year',
          },
        ],
        roi: '€576,000/year from recovered no-shows',
        timeToImplement: '4-6 hours',
        cost: '€20-50/month (Twilio SMS + Vimeo hosting)',
      },
      templates: {
        emails: [
          {
            day: -1,
            subject: 'Tomorrow: {webinar_title} at {time}',
            preview: 'Just a reminder - we start in 24 hours',
            goal: 'Reduce no-shows',
            cta: 'Add to calendar',
          },
          {
            day: 0,
            subject: 'We missed you at today\'s webinar!',
            preview: 'No worries - watch the replay here (available for 72h)',
            goal: 'Recover no-show',
            cta: 'Watch replay',
          },
          {
            day: 2,
            subject: 'Replay expires tomorrow ⏰',
            preview: 'Last chance to watch {webinar_title} replay',
            goal: 'Create urgency',
            cta: 'Watch now',
          },
        ],
      },
    },
  ],
};

// ===================== PDF DOCUMENT =====================
const LAMAProV6Document = () =>
  React.createElement(
    Document,
    null,
    // Cover
    React.createElement(CoverWithCalculation, coverData),
    // FIND Section (4 pages)
    React.createElement(FINDSection4Pages, findData),
    // CRM Section (12 pages)
    React.createElement(CRMSection12Pages, crmData)
  );

// ===================== GENERATE PDF =====================
async function generatePDF() {
  try {
    console.log('🚀 Starting LAMA PRO V6 POC PDF generation...');

    const outputPath = path.join(process.cwd(), 'lama-pro-v6-poc.pdf');
    const stream = await renderToStream(React.createElement(LAMAProV6Document));

    const writeStream = fs.createWriteStream(outputPath);
    stream.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => {
        const stats = fs.statSync(outputPath);
        const fileSizeKB = (stats.size / 1024).toFixed(2);

        console.log('✅ PDF generated successfully!');
        console.log(`📄 Location: ${outputPath}`);
        console.log(`📊 File size: ${fileSizeKB} KB`);
        console.log(`📖 Total pages: ~17 (1 cover + 4 FIND + 12 CRM)`);
        console.log('\n🎯 Next steps:');
        console.log('1. Open the PDF and review');
        console.log('2. Check if FIT-TO-MARKET scenarios look good');
        console.log('3. Verify calculations are clear');
        console.log('4. Test on mobile (should be readable)');
        console.log('\n💡 If POC looks good:');
        console.log('   - Expand CRM to 18 pages');
        console.log('   - Expand FIND to 6 pages');
        console.log('   - Add other sections (STAY, UNDERSTAND, TRUST, CONVERT)');

        resolve();
      });

      writeStream.on('error', reject);
      stream.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    throw error;
  }
}

// Run generation
generatePDF();

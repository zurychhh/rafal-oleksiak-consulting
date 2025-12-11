/**
 * LAMA PRO V6 Test Script - CRM as Core Audit
 *
 * Changes from V5:
 * - Extended CRM/Engage section: 8 pages (was 1 page)
 * - CRM is now the CORE of the audit
 * - Other categories shortened to 1-2 pages each
 * - Total: ~18-22 pages (vs ~12 in V5)
 */

import { renderToBuffer } from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
import { CoverWithCalculation } from './pdf/components/CoverWithCalculation';
import { EngageCRMSectionExtended } from './pdf/components/EngageCRMSectionExtended';
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
  red: '#EF4444',
};

// Extended CRM/Engage data - CORE AUDYTU! 🔥
const engageCRMData = {
  categoryName: 'CRM & Marketing Automation (ENGAGE)',
  score: 35,
  industryBenchmark: 78,

  // Page 1: CRM Overview
  crmOverview: {
    currentCRMStatus: 'none' as const,
    currentTools: ['Excel spreadsheet', 'Gmail', 'Google Calendar'],
    automationLevel: 10, // tylko 10% automated
    leadResponseTime: '24-48 hours',
    followUpRate: 45, // tylko 45% leadów dostaje follow-up

    revenueLossBreakdown: {
      fromSlowResponse: 624000, // €624k/rok z powodu slow response
      fromNoFollowUp: 288000, // €288k/rok z braku nurture sequences
      fromPoorSegmentation: 604800, // €604k/rok z braku lead scoring
      total: 1516800, // €1.5M/rok TOTAL! 🚨
    },
  },

  // Page 2: Lead Response Time Analysis
  leadResponseAnalysis: {
    currentAverageResponseTime: '24-48 hours',
    benchmarkResponseTime: '<5 minutes',

    conversionImpact: {
      current: 2, // 2% conversion przy 24h response
      atBenchmark: 15, // 15% przy <5min (HBR study)
      lostConversions: 13, // 13% gap!
    },

    calculationSteps: [
      {
        step: 1,
        description: 'Leads/miesiąc',
        value: '50 leads',
      },
      {
        step: 2,
        description: 'Obecna konwersja (24h response): 2%',
        value: '1 deal/mc',
      },
      {
        step: 3,
        description: 'Konwersja przy <5min response: 15% (Harvard Business Review)',
        value: '7.5 deals/mc',
      },
      {
        step: 4,
        description: 'Stracone deale: 7.5 - 1 = 6.5/mc',
        value: '6.5 deals/mc',
      },
      {
        step: 5,
        description: 'Revenue impact: 6.5 × €8,000 × 12',
        value: '€624,000/rok strat',
      },
    ],

    solution: {
      title: 'Instant Lead Alert System',
      components: [
        'Zapier/Make.com webhook z formularza → Slack/Email w <30 sekund',
        'Auto-response email (personalizowany, scheduling link Calendly)',
        'CRM auto-create lead record (HubSpot/Pipedrive)',
        'SMS alert dla hot leads (opcjonalnie)',
      ],
      timeToImplement: '2-4 hours',
      cost: '€15-30/mc (Zapier Pro)',
      roi: '€624,000/rok',
      breakEven: '< 1 dzień',
    },
  },

  // Page 3: Email Automation Sequences
  emailAutomationAnalysis: {
    currentTouchpoints: 1, // tylko 1 email po zgłoszeniu
    benchmarkTouchpoints: 7, // industry standard 4-7

    impactAnalysis: {
      currentEngagementRate: 15, // 15% przy 1 touchpoint
      benchmarkEngagementRate: 45, // 45% przy 7 touchpoints
      lostEngagement: 30, // 30% gap

      calculationSteps: [
        {
          step: 1,
          description: 'Leads/miesiąc',
          value: '50 leads',
        },
        {
          step: 2,
          description: 'Obecny engagement (1 touchpoint): 15%',
          value: '7.5 engaged leads',
        },
        {
          step: 3,
          description: 'Engagement przy 7 touchpoints: 45% (Salesforce)',
          value: '22.5 engaged leads',
        },
        {
          step: 4,
          description: 'Straceni engaged leads: 22.5 - 7.5 = 15/mc',
          value: '15 leads/mc',
        },
        {
          step: 5,
          description: 'Close rate 20% × €8,000 deal × 12',
          value: '€288,000/rok strat',
        },
      ],
    },

    solution: {
      title: '3 Core Email Sequences',
      sequences: [
        {
          name: 'Welcome Sequence (5 emails, 7 dni)',
          emails: [
            { day: 0, subject: 'Dziękujemy za zgłoszenie - co dalej?', goal: 'Set expectations' },
            { day: 1, subject: '[Case Study] Jak zwiększyliśmy leads o 250%', goal: 'Build credibility' },
            { day: 3, subject: 'Free Resource: LAMA Checklist', goal: 'Provide value' },
            { day: 5, subject: 'Pytania? Zarezerwuj 15-min call', goal: 'Drive action' },
            { day: 7, subject: 'Last chance: Book discovery call', goal: 'Create urgency' },
          ],
          expectedImpact: '€150,000/rok',
        },
        {
          name: 'Nurture Sequence (7 emails, 30 dni)',
          emails: [
            { day: 10, subject: 'Content #1: How to optimize CRM', goal: 'Educate' },
            { day: 14, subject: 'Content #2: 5 common CRM mistakes', goal: 'Build trust' },
            { day: 18, subject: 'Testimonial: Client success story', goal: 'Social proof' },
            { day: 22, subject: 'Free tool: ROI calculator', goal: 'Interactive value' },
            { day: 26, subject: 'Webinar invitation', goal: 'Engagement' },
            { day: 30, subject: 'Ready to talk? Book call', goal: 'Conversion' },
            { day: 35, subject: 'Final offer: Limited slots', goal: 'Scarcity' },
          ],
          expectedImpact: '€90,000/rok',
        },
        {
          name: 'Re-engagement (3 emails, 60 dni)',
          emails: [
            { day: 60, subject: 'Still interested in CRM automation?', goal: 'Re-activate' },
            { day: 75, subject: 'New resource you might like', goal: 'Provide value' },
            { day: 90, subject: 'Stay in touch? [Archive option]', goal: 'Clean list' },
          ],
          expectedImpact: '€48,000/rok',
        },
      ],
      totalExpectedImpact: '€288,000/rok',
      timeToImplement: '8-12 hours (setup + copywriting)',
    },
  },

  // Page 4: Lead Scoring & Segmentation
  leadScoringAnalysis: {
    problemStatement: {
      allLeadsEqual: true,
      timeWastedOnColdLeads: '40% czasu na leady z 3% conversion',
      hotLeadsIgnored: '20% hot leads (score >70) nie dostaje follow-up w 24h',
    },

    proposedScoringModel: {
      scoringTiers: [
        {
          tier: 'HOT',
          minScore: 70,
          action: 'Immediate call within 1h, personalized email',
          expectedConversion: 40,
        },
        {
          tier: 'WARM',
          minScore: 40,
          action: 'Personalized email + call within 24h',
          expectedConversion: 15,
        },
        {
          tier: 'COLD',
          minScore: 0,
          action: 'Nurture sequence only (automated)',
          expectedConversion: 3,
        },
      ],
    },

    impactCalculation: {
      calculationSteps: [
        {
          step: 1,
          description: 'Leads/miesiąc: 50 (20 HOT, 20 WARM, 10 COLD po scoring)',
          value: '50 leads',
        },
        {
          step: 2,
          description: 'Obecna konwersja (bez scoring): 10% × 50 = 5 deals',
          value: '5 deals/mc',
        },
        {
          step: 3,
          description: 'Z scoring: (20×40%) + (20×15%) + (10×3%) = 11.3 deals',
          value: '11.3 deals/mc',
        },
        {
          step: 4,
          description: 'Wzrost: 11.3 - 5 = 6.3 dodatkowych deals/mc',
          value: '+6.3 deals/mc',
        },
        {
          step: 5,
          description: 'Revenue impact: 6.3 × €8,000 × 12',
          value: '€604,800/rok dodatkowego revenue',
        },
      ],
    },

    solution: {
      title: 'Automated Lead Scoring System',
      timeToImplement: '4-6 hours',
      cost: '€0 (większość CRM ma built-in)',
      roi: '€604,800/rok',
    },
  },

  // Page 5: Pipeline Management
  pipelineManagementAnalysis: {
    currentSystem: 'spreadsheet' as const,

    currentPainPoints: [
      { pain: 'No visibility into deal status', impact: '15-20% deals lost to inaction' },
      { pain: 'Deals stuck in pipeline (no follow-up)', impact: '€120k/yr in stalled deals' },
      { pain: 'No automatic reminders for follow-up', impact: '30% of leads never contacted' },
      { pain: 'Manual data entry (error-prone)', impact: '5-10 hours/week wasted' },
    ],

    proposedPipeline: {
      stages: [
        {
          stage: 'New Lead',
          goalDuration: '< 1 hour',
          automation: [
            'Auto-create CRM record from form submission',
            'Auto-assign to sales rep (round-robin)',
            'Slack notification to assigned rep',
            'Auto-response email to lead',
          ],
          kpi: 'Response time < 5 minutes',
        },
        {
          stage: 'Contacted',
          goalDuration: '1-3 days',
          automation: [
            'Auto-send meeting scheduler link (Calendly)',
            'Reminder to rep if no meeting booked in 48h',
            'Auto-tag lead based on conversation notes (AI parsing)',
          ],
          kpi: 'Meeting booked rate > 60%',
        },
        {
          stage: 'Meeting Scheduled',
          goalDuration: '0-7 days',
          automation: [
            'Auto-send calendar invite + prep materials',
            'Reminder 1h before meeting',
            'Auto-update stage to "Meeting Held" after meeting time',
          ],
          kpi: 'Show-up rate > 80%',
        },
        {
          stage: 'Proposal Sent',
          goalDuration: '3-7 days',
          automation: [
            'Auto-send proposal via PandaDoc/DocuSign',
            'Track opens/views (notify rep)',
            'Auto-reminder if not opened in 48h',
          ],
          kpi: 'Response rate > 70% within 7 days',
        },
        {
          stage: 'Negotiation',
          goalDuration: '7-14 days',
          automation: [
            'Auto-create task for sales rep (daily check-in)',
            'Auto-notify manager if deal stalled >14 days',
          ],
          kpi: 'Win rate > 30% from this stage',
        },
        {
          stage: 'Closed Won',
          goalDuration: '-',
          automation: [
            'Auto-send welcome email + onboarding sequence',
            'Auto-create Notion/ClickUp project',
            'Auto-invoice via Stripe/QuickBooks',
          ],
          kpi: 'Onboarding start < 24h',
        },
        {
          stage: 'Closed Lost',
          goalDuration: '-',
          automation: [
            'Auto-ask for feedback (typeform)',
            'Auto-add to re-engagement sequence (6 months)',
          ],
          kpi: 'Re-engagement rate > 15% in 12 months',
        },
      ],
    },

    impactCalculation: {
      calculationSteps: [
        {
          step: 1,
          description: 'Leads/miesiąc',
          value: '50 leads',
        },
        {
          step: 2,
          description: 'Obecna efficiency: 40% reach Proposal → 20 proposals',
          value: '20 proposals/mc',
        },
        {
          step: 3,
          description: 'Z automation: 75% reach Proposal → 37.5 proposals',
          value: '37.5 proposals/mc',
        },
        {
          step: 4,
          description: 'Win rate z Proposal: 30% → +5.25 deals/mc',
          value: '+5.25 deals/mc',
        },
        {
          step: 5,
          description: 'Revenue: 5.25 × €8,000 × 12',
          value: '€504,000/rok dodatkowego revenue',
        },
      ],
    },

    solution: {
      title: 'Fully Automated CRM Pipeline',
      recommendedTools: [
        { tool: 'HubSpot CRM', cost: '€0-800/mc', reason: 'Best automation, free tier OK dla <1000 contacts' },
        { tool: 'Pipedrive', cost: '€15-99/user/mc', reason: 'Prosty UI, dobre mobile app' },
        { tool: 'Close.com', cost: '€29-149/user/mc', reason: 'Built-in calling, best for high-touch sales' },
      ],
      roi: '€504,000/rok',
    },
  },

  // Page 6: Integration & Data Flow
  integrationAnalysis: {
    proposedTechStack: {
      websiteForm: 'Typeform / HubSpot Forms',
      crm: 'HubSpot CRM (Free tier dla start)',
      emailAutomation: 'HubSpot Email (included in CRM)',
      automation: 'Zapier / Make.com',
    },

    keyAutomationWorkflows: [
      {
        name: 'Instant Lead Alert',
        trigger: 'Form submission',
        actions: [
          'Zapier → CRM (create lead)',
          'Zapier → Slack (notify team)',
          'Auto-response email (scheduling link)',
        ],
        roi: '€624,000/rok (from response time)',
      },
      {
        name: 'Meeting No-Show Recovery',
        trigger: 'Meeting time passed, stage still "Meeting Scheduled"',
        actions: [
          'Auto-email: "Missed you! Reschedule?"',
          'Create task for rep follow-up',
        ],
        roi: '€48,000/rok (recover 20% no-shows)',
      },
      {
        name: 'Stale Deal Alert',
        trigger: 'Deal in "Negotiation" >14 days with no activity',
        actions: [
          'Slack alert to sales manager',
          'Auto-email to lead (check-in)',
        ],
        roi: '€120,000/rok (recover stalled deals)',
      },
    ],

    totalExpectedROI: '€792,000/rok',
  },

  // Page 7: Reporting & Analytics
  reportingAnalysis: {
    keyMetricsToTrack: {
      leadGeneration: [
        { metric: 'Leads/miesiąc', target: '50+', current: '30' },
        { metric: 'Cost per lead', target: '< €100', current: '€180' },
        { metric: 'Lead source breakdown', target: 'Diversified', current: '80% referrals' },
      ],
      pipelineHealth: [
        { metric: 'Avg deal velocity', target: '< 30 dni', current: '45 dni' },
        { metric: 'Pipeline value', target: '€200k+', current: '€80k' },
        { metric: 'Win rate', target: '> 25%', current: '15%' },
      ],
    },

    proposedDashboard: {
      tool: 'HubSpot Dashboard (free)',
      sections: [
        {
          section: 'Lead Generation Health',
          widgets: [
            'Leads this month (vs target)',
            'Lead source breakdown (pie chart)',
            'Cost per lead trend (line chart)',
            'Website → Lead conversion rate',
          ],
        },
        {
          section: 'Pipeline Performance',
          widgets: [
            'Pipeline by stage (funnel chart)',
            'Deals closing this month (forecast)',
            'Avg deal velocity (days in pipeline)',
            'Win rate by lead source',
          ],
        },
      ],
    },
  },

  // Page 8: Implementation Roadmap
  crmImplementationRoadmap: {
    totalTimeInvestment: '40-50 hours (spread over 4 weeks)',
    totalCost: '€200-500 (tools + setup)',
    expectedROI: '€1,516,800/rok',
    breakEven: '< 3 dni',

    weeklyPlan: [
      {
        week: 'Week 1',
        focus: 'Foundation - Core CRM Setup',
        hours: '12-16 hours',
        tasks: [
          {
            task: 'Choose & setup CRM (HubSpot/Pipedrive)',
            owner: 'DIY (with tutorial)',
            time: '4 hours',
            priority: 'CRITICAL' as const,
          },
          {
            task: 'Import existing leads (if any)',
            owner: 'DIY',
            time: '2 hours',
            priority: 'HIGH' as const,
          },
          {
            task: 'Setup pipeline stages (7 stages)',
            owner: 'DIY (use template)',
            time: '2 hours',
            priority: 'CRITICAL' as const,
          },
          {
            task: 'Connect form → CRM (Zapier)',
            owner: 'DIY or hire dev (€100-200)',
            time: '3 hours',
            priority: 'CRITICAL' as const,
          },
          {
            task: 'Setup Slack alerts for new leads',
            owner: 'DIY (Zapier template)',
            time: '1 hour',
            priority: 'HIGH' as const,
          },
        ],
        expectedImpact: '€624,000/rok (instant response)',
      },
      {
        week: 'Week 2',
        focus: 'Automation - Sequences & Scoring',
        hours: '14-18 hours',
        tasks: [
          {
            task: 'Write Welcome Sequence (5 emails)',
            owner: 'DIY or hire copywriter (€200-400)',
            time: '6 hours',
            priority: 'HIGH' as const,
          },
          {
            task: 'Setup Welcome Sequence in CRM',
            owner: 'DIY',
            time: '2 hours',
            priority: 'HIGH' as const,
          },
          {
            task: 'Configure lead scoring model',
            owner: 'DIY (use template)',
            time: '3 hours',
            priority: 'MEDIUM' as const,
          },
          {
            task: 'Setup HOT lead alerts (score >70)',
            owner: 'DIY (Zapier)',
            time: '1 hour',
            priority: 'HIGH' as const,
          },
          {
            task: 'Test all automations end-to-end',
            owner: 'DIY',
            time: '2 hours',
            priority: 'CRITICAL' as const,
          },
        ],
        expectedImpact: '€888,000/rok (sequences + scoring)',
      },
      {
        week: 'Week 3',
        focus: 'Advanced Sequences & Pipeline',
        hours: '8-12 hours',
        tasks: [
          {
            task: 'Write Nurture Sequence (7 emails)',
            owner: 'DIY or hire copywriter',
            time: '4 hours',
            priority: 'MEDIUM' as const,
          },
          {
            task: 'Setup pipeline automation (stage transitions)',
            owner: 'DIY',
            time: '3 hours',
            priority: 'MEDIUM' as const,
          },
          {
            task: 'Create content assets (case study PDF)',
            owner: 'DIY or designer (€200-400)',
            time: '4 hours',
            priority: 'MEDIUM' as const,
          },
        ],
        expectedImpact: '€504,000/rok (pipeline efficiency)',
      },
      {
        week: 'Week 4',
        focus: 'Analytics & Optimization',
        hours: '6-8 hours',
        tasks: [
          {
            task: 'Build CRM dashboard (HubSpot)',
            owner: 'DIY (use template)',
            time: '4 hours',
            priority: 'MEDIUM' as const,
          },
          {
            task: 'Setup weekly review meeting',
            owner: 'Team',
            time: '1 hour',
            priority: 'HIGH' as const,
          },
          {
            task: 'Document processes (SOP)',
            owner: 'DIY',
            time: '2 hours',
            priority: 'LOW' as const,
          },
          {
            task: 'Train team on CRM usage',
            owner: 'Team lead',
            time: '2 hours',
            priority: 'HIGH' as const,
          },
        ],
        expectedImpact: '15-25% uplift on all metrics',
      },
    ],
  },
};

// Generate test PDF
async function generateV6TestPDF() {
  try {
    console.log('🚀 Generating LAMA PRO V6 - CRM as Core...\n');

    const coverData = {
      websiteUrl: 'https://startup-xyz.com',
      companyName: 'Startup XYZ',
      overallScore: 52, // lower score because CRM is terrible (35/100)
      estimatedRevenueLoss: 1516800, // €1.5M total (mostly from CRM!)
      generatedDate: new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      calculationSummary: {
        avgMonthlyVisitors: 180,
        conversionRate: 0.025,
        avgDealSize: 8000,
        closeRate: 0.20,
        lostVisitorsPerMonth: 97,
        source: 'Ahrefs (traffic), Unbounce (conversion), Salesforce (close rate)',
      },
    };

    const doc = React.createElement(
      Document,
      {},
      [
        // Cover
        React.createElement(CoverWithCalculation, {
          key: 'cover',
          ...coverData,
        }),

        // 🔥 CORE AUDYTU: 8-page CRM Section
        React.createElement(EngageCRMSectionExtended, {
          key: 'engage-crm-extended',
          ...engageCRMData,
        }),

        // NOTE: W produkcji dodamy tutaj skrócone wersje innych kategorii:
        // - FIND (SEO) - 1-2 strony
        // - STAY (Performance) - 1 strona
        // - UNDERSTAND (Messaging) - 1 strona
        // - TRUST (Credibility) - 1 strona
        // - CONVERT (Lead Capture) - 1 strona
        // + Executive Summary, Roadmap, Decision Matrix, Cheat Sheet
      ]
    );

    const pdfBuffer = await renderToBuffer(doc);
    const outputPath = path.join(process.cwd(), 'lama-pro-v6-crm-core.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);

    const stats = fs.statSync(outputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log('✅ V6 CRM Core PDF generated successfully!');
    console.log(`📁 File: ${outputPath}`);
    console.log(`📊 Size: ${fileSizeKB} KB`);
    console.log('');
    console.log('📋 V6 STRUCTURE:');
    console.log('  ✅ Cover Page (1 strona)');
    console.log('  ✅ CRM Section (8 stron) - CORE AUDYTU! 🔥');
    console.log('    1. CRM Strategy Overview');
    console.log('    2. Lead Response Time Analysis (€624k/yr loss)');
    console.log('    3. Email Automation Sequences (€288k/yr loss)');
    console.log('    4. Lead Scoring & Segmentation (€604k/yr loss)');
    console.log('    5. Pipeline Management (€504k/yr loss)');
    console.log('    6. Integration & Data Flow');
    console.log('    7. Reporting & Analytics');
    console.log('    8. Implementation Roadmap (4 weeks)');
    console.log('');
    console.log('💰 TOTAL CRM ROI: €1,516,800/rok');
    console.log('⏱️  Setup Time: 40-50 hours (spread over 4 weeks)');
    console.log('💸 Cost: €200-500');
    console.log('📈 Break-even: <3 dni');
    console.log('');
    console.log('🎯 Next: Add shortened versions of other categories (FIND, STAY, etc.)');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

generateV6TestPDF();

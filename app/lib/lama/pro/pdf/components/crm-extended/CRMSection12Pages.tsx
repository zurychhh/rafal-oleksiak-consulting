/**
 * CRM Section - 12 Pages (POC Version)
 * Full version will be 18 pages
 *
 * Structure:
 * - Pages 1-3: Overview, Lead Response, Implementation
 * - Pages 4-6: Email Sequences (Welcome, Nurture, Re-engagement)
 * - Pages 7-9: Lead Scoring (Behavioral, Demographic, Implementation)
 * - Pages 10-12: FIT-TO-MARKET Scenarios (imported from FitToMarketPages)
 */

import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { crmStyles as styles, COLORS } from './styles';
import {
  PageHeader,
  PageFooter,
  SectionTitle,
  ProblemBox,
  SolutionBox,
  InfoBox,
  CalculationBox,
  BulletList,
  NumberedList,
  EmailTemplateCard,
  AutomationWorkflow,
  MetricRow,
  CodeBlock,
  ROIBadge,
  PriorityBadge,
  BodyText,
  Bold,
  Highlight,
  Success,
  ErrorText,
  Divider,
} from './helpers';
import { FitToMarketPages } from './FitToMarketPages';
import type {
  EngageCRMExtendedV2Props,
  EmailTemplate,
  AutomationStep,
  CalculationStep,
  Metric,
  LeadScoringSignal,
  FitToMarketScenario,
} from './types';

interface CRMSection12PagesProps {
  categoryName: string;
  score: number;
  industryBenchmark: number;
  crmOverview: {
    currentState: string;
    revenueLossBreakdown: {
      fromSlowResponse: number;
      fromPoorFollowUp: number;
      fromNoNurture: number;
      fromManualErrors: number;
      total: number;
    };
    calculationSteps: CalculationStep[];
    calculationSource: string;
  };
  leadResponse: {
    currentResponseTime: string;
    benchmarkResponseTime: string;
    impactOfDelay: string;
    lostDealsPerMonth: number;
    lostRevenuePerMonth: number;
    calculationSteps: CalculationStep[];
  };
  implementation: {
    zapierSetup: {
      steps: AutomationStep[];
      estimatedTime: string;
      cost: string;
    };
    quickWins: string[];
    commonMistakes: string[];
  };
  emailSequences: {
    welcome: {
      emails: EmailTemplate[];
      roi: string;
      calculationSteps: CalculationStep[];
    };
    nurture: {
      emails: EmailTemplate[];
      roi: string;
      calculationSteps: CalculationStep[];
    };
    reengagement: {
      emails: EmailTemplate[];
      roi: string;
      calculationSteps: CalculationStep[];
    };
  };
  leadScoring: {
    behavioral: {
      signals: LeadScoringSignal[];
      exampleScenario: string;
    };
    demographic: {
      signals: LeadScoringSignal[];
      exampleScenario: string;
    };
    implementation: {
      steps: AutomationStep[];
      metrics: Metric[];
      roi: string;
    };
  };
  fitToMarketScenarios: FitToMarketScenario[];
}

export const CRMSection12Pages: React.FC<CRMSection12PagesProps> = (props) => {
  const {
    categoryName,
    score,
    industryBenchmark,
    crmOverview,
    leadResponse,
    implementation,
    emailSequences,
    leadScoring,
    fitToMarketScenarios,
  } = props;

  return (
    <>
      {/* ===================== PAGE 1: CRM OVERVIEW ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          score={score}
          benchmark={industryBenchmark}
          title="CRM Strategy Overview"
          subtitle="Analysis of current lead management system state and revenue impact"
          pageNumber="1"
        />

        {/* Current State */}
        <View style={styles.section}>
          <SectionTitle emoji="▉" title="CURRENT SITUATION" />
          <ProblemBox>
            <BodyText>{crmOverview.currentState}</BodyText>
          </ProblemBox>
        </View>

        {/* Revenue Loss Breakdown */}
        <View style={styles.section}>
          <SectionTitle emoji="💸" title="REVENUE LOSS ANALYSIS" />
          <View style={styles.problemBox}>
            <BodyText>
              <Bold>Total annual loss: </Bold>
              <ErrorText>€{crmOverview.revenueLossBreakdown.total.toLocaleString()}</ErrorText>
            </BodyText>
            <Divider />
            <BodyText small>
              • Slow response time: €{crmOverview.revenueLossBreakdown.fromSlowResponse.toLocaleString()}/rok
            </BodyText>
            <BodyText small>
              • No follow-up: €{crmOverview.revenueLossBreakdown.fromPoorFollowUp.toLocaleString()}/rok
            </BodyText>
            <BodyText small>
              • No nurture campaigns: €{crmOverview.revenueLossBreakdown.fromNoNurture.toLocaleString()}/rok
            </BodyText>
            <BodyText small>
              • Manual errors: €{crmOverview.revenueLossBreakdown.fromManualErrors.toLocaleString()}/rok
            </BodyText>
          </View>
        </View>

        {/* Calculation Details */}
        <View style={styles.section}>
          <SectionTitle emoji="🧮" title="CALCULATION METHODOLOGY" />
          <CalculationBox
            steps={crmOverview.calculationSteps}
            source={crmOverview.calculationSource}
          />
        </View>

        {/* Quick Impact Preview */}
        <View style={styles.section}>
          <SectionTitle emoji="⚡" title="WHAT YOU GAIN BY IMPLEMENTING CRM AUTOMATION" />
          <SolutionBox>
            <BulletList
              items={[
                'Instant lead response (< 5 min) instead of hours/days',
                'Automated nurture sequences increasing conversion by 15-25%',
                'Lead scoring eliminating 40% time waste on weak leads',
                'Pipeline visibility showing where you lose deals',
                'ROI tracking for each campaign and channel',
              ]}
            />
          </SolutionBox>
          <ROIBadge roi="€1.5M+ yearly (at current traffic)" />
        </View>

        <PageFooter pageNum="1" />
      </Page>

      {/* ===================== PAGE 2: LEAD RESPONSE TIME ANALYSIS ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Lead Response Time Analysis"
          subtitle="Impact of time response time na conversion i konkretne acceleration strategies"
          pageNumber="2"
        />

        {/* Current vs Benchmark */}
        <View style={styles.section}>
          <SectionTitle emoji="⏱️" title="CURRENT RESPONSE TIME" />
          <View style={[styles.row, styles.spaceBetween, { gap: 10 }]}>
            <View style={[styles.problemBox, styles.flex1]}>
              <BodyText>
                <Bold>Your time: </Bold>
                <ErrorText>{leadResponse.currentResponseTime}</ErrorText>
              </BodyText>
            </View>
            <View style={[styles.solutionBox, styles.flex1]}>
              <BodyText>
                <Bold>Benchmark: </Bold>
                <Success>{leadResponse.benchmarkResponseTime}</Success>
              </BodyText>
            </View>
          </View>
        </View>

        {/* Impact of Delay */}
        <View style={styles.section}>
          <SectionTitle emoji="📉" title="IMPACT OF DELAY" />
          <InfoBox>
            <BodyText>{leadResponse.impactOfDelay}</BodyText>
            <Divider />
            <BodyText>
              <Bold>Lost deals monthly: </Bold>
              <ErrorText>{leadResponse.lostDealsPerMonth}</ErrorText>
            </BodyText>
            <BodyText>
              <Bold>Lost revenue monthly: </Bold>
              <ErrorText>€{leadResponse.lostRevenuePerMonth.toLocaleString()}</ErrorText>
            </BodyText>
          </InfoBox>
        </View>

        {/* Calculation */}
        <View style={styles.section}>
          <SectionTitle emoji="🧮" title="CALCULATION" />
          <CalculationBox steps={leadResponse.calculationSteps} />
        </View>

        {/* Solution Preview */}
        <View style={styles.section}>
          <SectionTitle emoji="✓" title="SOLUTION" />
          <SolutionBox>
            <BodyText>
              <Bold>Instant Lead Response Automation</Bold>
            </BodyText>
            <BodyText small>
              Zapier/Make.com automatically sends personalized response in {'<'} 5 minut from form submission:
            </BodyText>
            <Divider />
            <BulletList
              items={[
                'Confirmation email with personalization (name, industry, problem)',
                'SMS/WhatsApp notification (if number provided)',
                'Slack notification to sales team with lead details',
                'CRM entry creation with lead source tracking',
                'Calendar booking link (if applicable)',
              ]}
            />
          </SolutionBox>
          <ROIBadge roi="€180k/year from response time acceleration alone" />
        </View>

        <PageFooter pageNum="2" />
      </Page>

      {/* ===================== PAGE 3: IMPLEMENTATION GUIDE ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Implementation Guide: Zapier Setup"
          subtitle="Step by step: How to implement instant lead response in < 2h"
          pageNumber="3"
        />

        {/* Zapier Setup Steps */}
        <View style={styles.section}>
          <SectionTitle emoji="🔧" title="ZAPIER/MAKE.COM SETUP" />
          <AutomationWorkflow steps={implementation.zapierSetup.steps} showTools />
          <InfoBox>
            <BodyText small>
              <Bold>Estimated time: </Bold>
              {implementation.zapierSetup.estimatedTime}
            </BodyText>
            <BodyText small>
              <Bold>Cost: </Bold>
              {implementation.zapierSetup.cost}
            </BodyText>
          </InfoBox>
        </View>

        {/* Quick Wins */}
        <View style={styles.section}>
          <SectionTitle emoji="⚡" title="QUICK WINS (Week 1)" />
          <SolutionBox>
            <NumberedList items={implementation.quickWins} />
          </SolutionBox>
        </View>

        {/* Common Mistakes */}
        <View style={styles.section}>
          <SectionTitle emoji="⚠️" title="COMMON MISTAKES TO AVOID" />
          <View style={styles.warningBox}>
            <BulletList items={implementation.commonMistakes} />
          </View>
        </View>

        {/* Example Zapier Code */}
        <View style={styles.section}>
          <SectionTitle emoji="▥" title="EXAMPLE: EMAIL TEMPLATE CODE" />
          <CodeBlock
            code={`Subject: {{first_name}}, we received your inquiry

Hi {{first_name}},

Thank you for your interest in our {{service_type}} services.

Your inquiry concerns: {{problem_description}}

Within 24h, {{assigned_consultant}} will contact you
to discuss details and propose a solution.

In the meantime you can:
→ Schedule a call: {{calendly_link}}
→ Check our case study: {{relevant_case_study}}

Best regards,
{{company_name}}`}
          />
        </View>

        <PageFooter pageNum="3" />
      </Page>

      {/* ===================== PAGE 4: WELCOME EMAIL SEQUENCE ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Welcome Email Sequence"
          subtitle="7-day onboarding sequence for new leads (conversion rate: 25-35%)"
          pageNumber="4"
        />

        {/* Sequence Overview */}
        <View style={styles.section}>
          <SectionTitle emoji="✉" title="SEKWENCJA (7 EMAILI)" />
          {emailSequences.welcome.emails.map((email, idx) => (
            <EmailTemplateCard key={idx} email={email} showCTA />
          ))}
        </View>

        {/* ROI Calculation */}
        <View style={styles.section}>
          <SectionTitle emoji="€" title="ROI CALCULATION" />
          <CalculationBox steps={emailSequences.welcome.calculationSteps} />
          <ROIBadge roi={emailSequences.welcome.roi} />
        </View>

        <PageFooter pageNum="4" />
      </Page>

      {/* ===================== PAGE 5: NURTURE EMAIL SEQUENCE ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Nurture Email Sequence"
          subtitle="Long-term nurture for leads not-ready-to-buy (conversion: 10-15% in 90 days)"
          pageNumber="5"
        />

        {/* Sequence Overview */}
        <View style={styles.section}>
          <SectionTitle emoji="🌱" title="SEKWENCJA (10 EMAILI / 90 DNI)" />
          {emailSequences.nurture.emails.slice(0, 5).map((email, idx) => (
            <EmailTemplateCard key={idx} email={email} />
          ))}
          {emailSequences.nurture.emails.length > 5 && (
              ...+ {emailSequences.nurture.emails.length - 5} more emails (full sequence available in implementation guide)
            </BodyText>
          )}
        </View>

        {/* ROI Calculation */}
        <View style={styles.section}>
          <SectionTitle emoji="€" title="ROI CALCULATION" />
          <CalculationBox steps={emailSequences.nurture.calculationSteps} />
          <ROIBadge roi={emailSequences.nurture.roi} />
        </View>

        <PageFooter pageNum="5" />
      </Page>

      {/* ===================== PAGE 6: RE-ENGAGEMENT SEQUENCE ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Re-engagement Email Sequence"
          subtitle="Reactivation of cold/inactive leads (recovery rate: 8-12%)"
          pageNumber="6"
        />

        {/* Sequence Overview */}
        <View style={styles.section}>
          <SectionTitle emoji="↻" title="SEKWENCJA (5 EMAILI / 14 DNI)" />
          {emailSequences.reengagement.emails.map((email, idx) => (
            <EmailTemplateCard key={idx} email={email} showCTA />
          ))}
        </View>

        {/* ROI Calculation */}
        <View style={styles.section}>
          <SectionTitle emoji="€" title="ROI CALCULATION" />
          <CalculationBox steps={emailSequences.reengagement.calculationSteps} />
          <ROIBadge roi={emailSequences.reengagement.roi} />
        </View>

        <PageFooter pageNum="6" />
      </Page>

      {/* ===================== PAGE 7: BEHAVIORAL SCORING SIGNALS ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Lead Scoring: Behavioral Signals"
          subtitle="Automatic behavior-based scoring (eliminates 40% time waste)"
          pageNumber="7"
        />

        {/* Signals Table */}
        <View style={styles.section}>
          <SectionTitle emoji="◉" title="SCORING SIGNALS" />
          {leadScoring.behavioral.signals.map((signal, idx) => (
            <View key={idx} style={styles.metricRow}>
              <View style={styles.flex1}>
                <Text style={styles.metricLabel}>{signal.signal}</Text>
                <Text style={[styles.bodyTextSmall, { marginTop: 2 }]}>{signal.description}</Text>
              </View>
              <View style={[styles.row, { gap: 6, alignItems: 'center' }]}>
                <Text style={styles.metricValue}>+{signal.points} pts</Text>
                <PriorityBadge priority={signal.priority} />
              </View>
            </View>
          ))}
        </View>

        {/* Example Scenario */}
        <View style={styles.section}>
          <SectionTitle emoji="📖" title="EXAMPLE SCENARIO" />
          <SolutionBox>
            <BodyText>{leadScoring.behavioral.exampleScenario}</BodyText>
          </SolutionBox>
        </View>

        <PageFooter pageNum="7" />
      </Page>

      {/* ===================== PAGE 8: DEMOGRAPHIC SCORING SIGNALS ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Lead Scoring: Demographic Signals"
          subtitle="Punktacja firmograficzna i ICP fit"
          pageNumber="8"
        />

        {/* Signals Table */}
        <View style={styles.section}>
          <SectionTitle emoji="🏢" title="SCORING SIGNALS" />
          {leadScoring.demographic.signals.map((signal, idx) => (
            <View key={idx} style={styles.metricRow}>
              <View style={styles.flex1}>
                <Text style={styles.metricLabel}>{signal.signal}</Text>
                <Text style={[styles.bodyTextSmall, { marginTop: 2 }]}>{signal.description}</Text>
              </View>
              <View style={[styles.row, { gap: 6, alignItems: 'center' }]}>
                <Text style={styles.metricValue}>+{signal.points} pts</Text>
                <PriorityBadge priority={signal.priority} />
              </View>
            </View>
          ))}
        </View>

        {/* Example Scenario */}
        <View style={styles.section}>
          <SectionTitle emoji="📖" title="EXAMPLE SCENARIO" />
          <SolutionBox>
            <BodyText>{leadScoring.demographic.exampleScenario}</BodyText>
          </SolutionBox>
        </View>

        <PageFooter pageNum="8" />
      </Page>

      {/* ===================== PAGE 9: SCORING IMPLEMENTATION ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          title="Lead Scoring Implementation"
          subtitle="How to implement scoring in Zapier/Make.com + CRM"
          pageNumber="9"
        />

        {/* Implementation Steps */}
        <View style={styles.section}>
          <SectionTitle emoji="⚙️" title="IMPLEMENTATION WORKFLOW" />
          <AutomationWorkflow steps={leadScoring.implementation.steps} showTools />
        </View>

        {/* Success Metrics */}
        <View style={styles.section}>
          <SectionTitle emoji="▉" title="SUCCESS METRICS" />
          {leadScoring.implementation.metrics.map((metric, idx) => (
            <MetricRow key={idx} metric={metric} />
          ))}
        </View>

        {/* ROI */}
        <View style={styles.section}>
          <SectionTitle emoji="€" title="EXPECTED IMPACT" />
          <SolutionBox>
            <BulletList
              items={[
                'Sales team focuses on top 20% of leads (80 pts+)',
                'Middle tier (50-79 pts) goes to automated nurture',
                'Low tier (< 50 pts) = disqualified or long-term nurture',
                '40% time saved on lead qualification',
                '25% increase in close rate (focus on quality)',
              ]}
            />
          </SolutionBox>
          <ROIBadge roi={leadScoring.implementation.roi} />
        </View>

        <PageFooter pageNum="9" />
      </Page>

      {/* ===================== PAGES 10-12: FIT-TO-MARKET SCENARIOS ===================== */}
      <FitToMarketPages categoryName={categoryName} scenarios={fitToMarketScenarios} />
    </>
  );
};

/**
 * LAMA PRO V6 - Extended CRM/Engage Section
 *
 * This is the CORE of the audit - 8 pages dedicated to CRM/Marketing Automation
 *
 * Pages:
 * 1. CRM Strategy Overview
 * 2. Lead Response Time Analysis
 * 3. Email Automation Sequences
 * 4. Lead Scoring & Segmentation
 * 5. Pipeline Management
 * 6. Integration & Data Flow
 * 7. Reporting & Analytics
 * 8. Implementation Roadmap
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../font-constants';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
  red: '#EF4444',
  yellow: '#F59E0B',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
  },

  // Header
  pageHeader: {
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.red,
    marginRight: 12,
  },
  scoreBadge: {
    backgroundColor: COLORS.darkGrey,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.red,
  },
  scoreText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pageTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
  },

  // Content sections
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // Boxes
  problemBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
    marginBottom: 12,
  },
  calculationBox: {
    backgroundColor: '#1E1E2E',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.electricBlue,
    marginBottom: 12,
  },
  solutionBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.neonGreen,
    marginBottom: 12,
  },

  // Typography
  bodyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  highlightText: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
  },

  // Lists
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.electricBlue,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    flex: 1,
  },

  // Calculation steps
  calcStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 3,
  },
  calcValue: {
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // ROI badge
  roiBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  // Footer
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  footerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
  },

  // Timeline (for roadmap page)
  timelineWeek: {
    marginBottom: 14,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  weekTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  weekImpact: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.neonGreen,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    paddingLeft: 12,
    marginBottom: 4,
  },
  taskCheckbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: COLORS.electricBlue,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 2,
  },
  taskText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    flex: 1,
  },
  taskTime: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.orange,
    marginLeft: 4,
  },
});

// TypeScript interfaces
interface CalculationStep {
  step: number;
  description: string;
  value?: string;
}

interface Solution {
  title: string;
  components?: string[];
  timeToImplement: string;
  cost: string;
  roi: string;
  breakEven?: string;
}

interface EmailSequence {
  name: string;
  emails: { day: number; subject: string; goal: string }[];
  expectedImpact: string;
}

interface PipelineStage {
  stage: string;
  goalDuration: string;
  automation: string[];
  kpi: string;
}

interface WeekTask {
  task: string;
  owner: string;
  time: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface WeeklyPlan {
  week: string;
  focus: string;
  hours: string;
  tasks: WeekTask[];
  expectedImpact: string;
}

interface EngageCRMExtendedProps {
  // Basic info
  categoryName: string;
  score: number;
  industryBenchmark: number;

  // Page 1: Overview
  crmOverview: {
    currentCRMStatus: 'none' | 'spreadsheet' | 'basic-crm' | 'advanced-crm';
    currentTools: string[];
    automationLevel: number;
    leadResponseTime: string;
    followUpRate: number;
    revenueLossBreakdown: {
      fromSlowResponse: number;
      fromNoFollowUp: number;
      fromPoorSegmentation: number;
      total: number;
    };
  };

  // Page 2: Lead Response
  leadResponseAnalysis: {
    currentAverageResponseTime: string;
    benchmarkResponseTime: string;
    conversionImpact: {
      current: number;
      atBenchmark: number;
      lostConversions: number;
    };
    calculationSteps: CalculationStep[];
    solution: Solution;
  };

  // Page 3: Email Automation
  emailAutomationAnalysis: {
    currentTouchpoints: number;
    benchmarkTouchpoints: number;
    impactAnalysis: {
      currentEngagementRate: number;
      benchmarkEngagementRate: number;
      calculationSteps: CalculationStep[];
    };
    solution: {
      title: string;
      sequences: EmailSequence[];
      totalExpectedImpact: string;
      timeToImplement: string;
    };
  };

  // Page 4: Lead Scoring
  leadScoringAnalysis: {
    problemStatement: {
      allLeadsEqual: boolean;
      timeWastedOnColdLeads: string;
      hotLeadsIgnored: string;
    };
    proposedScoringModel: {
      scoringTiers: { tier: string; minScore: number; action: string; expectedConversion: number }[];
    };
    impactCalculation: {
      calculationSteps: CalculationStep[];
    };
    solution: Solution;
  };

  // Page 5: Pipeline Management
  pipelineManagementAnalysis: {
    currentSystem: 'none' | 'spreadsheet' | 'basic-crm' | 'advanced-crm';
    currentPainPoints: { pain: string; impact: string }[];
    proposedPipeline: {
      stages: PipelineStage[];
    };
    impactCalculation: {
      calculationSteps: CalculationStep[];
    };
    solution: {
      title: string;
      recommendedTools: { tool: string; cost: string; reason: string }[];
      roi: string;
    };
  };

  // Page 6: Integration
  integrationAnalysis: {
    proposedTechStack: {
      websiteForm: string;
      crm: string;
      emailAutomation: string;
      automation: string;
    };
    keyAutomationWorkflows: {
      name: string;
      trigger: string;
      actions: string[];
      roi: string;
    }[];
    totalExpectedROI: string;
  };

  // Page 7: Reporting
  reportingAnalysis: {
    keyMetricsToTrack: {
      leadGeneration: { metric: string; target: string; current: string }[];
      pipelineHealth: { metric: string; target: string; current: string }[];
    };
    proposedDashboard: {
      tool: string;
      sections: { section: string; widgets: string[] }[];
    };
  };

  // Page 8: Implementation Roadmap
  crmImplementationRoadmap: {
    totalTimeInvestment: string;
    totalCost: string;
    expectedROI: string;
    weeklyPlan: WeeklyPlan[];
  };
}

export const EngageCRMSectionExtended: React.FC<EngageCRMExtendedProps> = (props) => {
  const {
    categoryName,
    score,
    industryBenchmark,
    crmOverview,
    leadResponseAnalysis,
    emailAutomationAnalysis,
    leadScoringAnalysis,
    pipelineManagementAnalysis,
    integrationAnalysis,
    reportingAnalysis,
    crmImplementationRoadmap,
  } = props;

  // Page 1: CRM Strategy Overview
  const Page1_Overview = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{industryBenchmark}
            </Text>
          </View>
        </View>
        <Text style={styles.pageTitle}>CRM Strategy Overview</Text>
        <Text style={styles.pageSubtitle}>
          Analysis of current CRM state and impact on revenue. To jest CORE tego audytu - 60-80% wartości lead acquisition jest w follow-up.
        </Text>
      </View>

      {/* SYTUACJA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 SITUATION: Current CRM State</Text>
        <View style={styles.problemBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Status: </Text>
            {crmOverview.currentCRMStatus === 'none' && 'No CRM - everything manual (Excel, email)'}
            {crmOverview.currentCRMStatus === 'spreadsheet' && 'Spreadsheet-based tracking'}
            {crmOverview.currentCRMStatus === 'basic-crm' && 'Podstawowy CRM bez automation'}
            {crmOverview.currentCRMStatus === 'advanced-crm' && 'Zaawansowany CRM z automation'}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Current tools: </Text>
            {crmOverview.currentTools.join(', ')}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Poziom automatyzacji: </Text>
            {crmOverview.automationLevel}% (benchmark: 75-85%)
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Response time: </Text>
            {crmOverview.leadResponseTime} (benchmark: &lt;5 minut)
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Follow-up rate: </Text>
            {crmOverview.followUpRate}% of leads receive follow-up (benchmark: 95%+)
          </Text>
        </View>
      </View>

      {/* WPŁYW */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>€ WPŁYW: Revenue Loss Breakdown</Text>
        <View style={styles.calculationBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Slow Response Time: </Text>
            €{crmOverview.revenueLossBreakdown.fromSlowResponse.toLocaleString()}/year
          </Text>
          <Text style={styles.calcStep}>
            HBR study: &lt;5 min response = 21x more conversions vs 30+ min
          </Text>

          <Text style={[styles.bodyText, { marginTop: 8 }]}>
            <Text style={styles.boldText}>No Follow-Up: </Text>
            €{crmOverview.revenueLossBreakdown.fromNoFollowUp.toLocaleString()}/year
          </Text>
          <Text style={styles.calcStep}>
            Salesforce: 35-50% of B2B leads never receive follow-up
          </Text>

          <Text style={[styles.bodyText, { marginTop: 8 }]}>
            <Text style={styles.boldText}>No Segmentation: </Text>
            €{crmOverview.revenueLossBreakdown.fromPoorSegmentation.toLocaleString()}/year
          </Text>
          <Text style={styles.calcStep}>
            McKinsey: Lead scoring = 10-15x ROI in the first year
          </Text>

          <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#3D3D5A' }}>
            <Text style={[styles.bodyText, { fontSize: 11 }]}>
              <Text style={styles.boldText}>TOTAL REVENUE LOSS: </Text>
              <Text style={{ color: COLORS.red, fontWeight: 'bold' }}>
                €{crmOverview.revenueLossBreakdown.total.toLocaleString()}/year
              </Text>
            </Text>
          </View>
        </View>
      </View>

      {/* ROZWIĄZANIE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ ROZWIĄZANIE: 3-Level CRM Strategy</Text>
        <View style={styles.solutionBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Level 1 (Week 1-2): </Text>
            Instant lead alerts + auto-response → €{crmOverview.revenueLossBreakdown.fromSlowResponse.toLocaleString()}/year recovery
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Level 2 (Week 2-3): </Text>
            Email sequences + lead scoring → €{crmOverview.revenueLossBreakdown.fromNoFollowUp.toLocaleString()}/year recovery
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Level 3 (Week 3-4): </Text>
            Full pipeline automation + reporting → €{crmOverview.revenueLossBreakdown.fromPoorSegmentation.toLocaleString()}/year recovery
          </Text>
        </View>
        <Text style={[styles.bodyText, { marginTop: 8 }]}>
          <Text style={styles.boldText}>Next pages: </Text>
          Detailed analysis of each level + step-by-step implementation plan
        </Text>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 1 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 2: Lead Response Time Analysis
  const Page2_LeadResponse = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>Lead Response Time Analysis</Text>
        <Text style={styles.pageSubtitle}>
          Every minute of delay = lost conversion. Harvard Business Review: &lt;5 min response = 21x more deals.
        </Text>
      </View>

      {/* Problem */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ PROBLEM</Text>
        <View style={styles.problemBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Current response time: </Text>
            {leadResponseAnalysis.currentAverageResponseTime}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Benchmark B2B: </Text>
            {leadResponseAnalysis.benchmarkResponseTime}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Impact on conversion: </Text>
            {leadResponseAnalysis.conversionImpact.current}% obecnie vs {leadResponseAnalysis.conversionImpact.atBenchmark}% przy benchmark
            = {leadResponseAnalysis.conversionImpact.lostConversions}% lost conversions
          </Text>
        </View>
      </View>

      {/* Calculation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>▉ CALCULATION</Text>
        <View style={styles.calculationBox}>
          {leadResponseAnalysis.calculationSteps.map((step, idx) => (
            <Text key={idx} style={styles.calcStep}>
              <Text style={styles.calcValue}>{step.step}. </Text>
              {step.description}
              {step.value && (
                <Text style={styles.calcValue}> → {step.value}</Text>
              )}
            </Text>
          ))}

          <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#3D3D5A' }}>
            <Text style={[styles.calcStep, { fontSize: 9 }]}>
              <Text style={styles.boldText}>Source: </Text>
              Harvard Business Review (2011): "The Short Life of Online Sales Leads" - analysis of 1.25M leads
            </Text>
          </View>
        </View>
      </View>

      {/* Solution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ ROZWIĄZANIE</Text>
        <View style={styles.solutionBox}>
          <Text style={[styles.bodyText, { fontSize: 10, marginBottom: 8 }]}>
            <Text style={styles.boldText}>{leadResponseAnalysis.solution.title}</Text>
          </Text>

          <View style={styles.bulletList}>
            {leadResponseAnalysis.solution.components?.map((component, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{component}</Text>
              </View>
            ))}
          </View>

          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Setup time: </Text>{leadResponseAnalysis.solution.timeToImplement}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Koszt: </Text>{leadResponseAnalysis.solution.cost}
            </Text>
          </View>

          <Text style={styles.roiBadge}>
            ROI: {leadResponseAnalysis.solution.roi}
          </Text>

          {leadResponseAnalysis.solution.breakEven && (
            <Text style={[styles.bodyText, { marginTop: 8, fontSize: 8 }]}>
              Break-even: {leadResponseAnalysis.solution.breakEven}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 2 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 3: Email Automation Sequences
  const Page3_EmailAutomation = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>Email Automation Sequences</Text>
        <Text style={styles.pageSubtitle}>
          Salesforce: 4-7 touchpoints = 80% success rate. Obecnie masz {emailAutomationAnalysis.currentTouchpoints} touchpoints vs benchmark {emailAutomationAnalysis.benchmarkTouchpoints}.
        </Text>
      </View>

      {/* Current State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📉 CURRENT STATE</Text>
        <View style={styles.problemBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Touchpoints: </Text>
            {emailAutomationAnalysis.currentTouchpoints} (benchmark: {emailAutomationAnalysis.benchmarkTouchpoints})
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Engagement rate: </Text>
            {emailAutomationAnalysis.impactAnalysis.currentEngagementRate}% obecnie vs {emailAutomationAnalysis.impactAnalysis.benchmarkEngagementRate}% przy benchmark
          </Text>
        </View>
      </View>

      {/* Calculation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>▉ REVENUE IMPACT</Text>
        <View style={styles.calculationBox}>
          {emailAutomationAnalysis.impactAnalysis.calculationSteps.slice(0, 5).map((step, idx) => (
            <Text key={idx} style={styles.calcStep}>
              <Text style={styles.calcValue}>{step.step}. </Text>
              {step.description}
              {step.value && <Text style={styles.calcValue}> → {step.value}</Text>}
            </Text>
          ))}
        </View>
      </View>

      {/* Solution: 3 Sequences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ 3 CORE SEQUENCES</Text>
        {emailAutomationAnalysis.solution.sequences.slice(0, 2).map((seq, idx) => (
          <View key={idx} style={[styles.solutionBox, { marginBottom: 8 }]}>
            <Text style={[styles.bodyText, { fontSize: 10, marginBottom: 4 }]}>
              <Text style={styles.boldText}>{seq.name}</Text>
            </Text>
            <Text style={[styles.bodyText, { fontSize: 8, marginBottom: 6 }]}>
              {seq.emails.length} emails, ROI: {seq.expectedImpact}
            </Text>
            {seq.emails.slice(0, 3).map((email, emailIdx) => (
              <Text key={emailIdx} style={[styles.bodyText, { fontSize: 8, marginLeft: 8 }]}>
                Day {email.day}: {email.subject} ({email.goal})
              </Text>
            ))}
            {seq.emails.length > 3 && (
              <Text style={[styles.bodyText, { fontSize: 8, marginLeft: 8, color: '#888' }]}>
                ...+ {seq.emails.length - 3} more emails
              </Text>
            )}
          </View>
        ))}

        <Text style={styles.roiBadge}>
          Total ROI: {emailAutomationAnalysis.solution.totalExpectedImpact}
        </Text>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 3 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 4: Lead Scoring & Segmentation
  const Page4_LeadScoring = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>Lead Scoring & Segmentation</Text>
        <Text style={styles.pageSubtitle}>
          Not all leads are equal. McKinsey: Lead scoring = 10-15x ROI in the first year.
        </Text>
      </View>

      {/* Problem */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ PROBLEM</Text>
        <View style={styles.problemBox}>
          {leadScoringAnalysis.problemStatement.allLeadsEqual && (
            <Text style={styles.bodyText}>
              • <Text style={styles.boldText}>All leads treated the same</Text> - you waste time on cold leads
            </Text>
          )}
          <Text style={styles.bodyText}>
            • <Text style={styles.boldText}>Wasted time: </Text>
            {leadScoringAnalysis.problemStatement.timeWastedOnColdLeads}
          </Text>
          <Text style={styles.bodyText}>
            • <Text style={styles.boldText}>Hot leads ignorowane: </Text>
            {leadScoringAnalysis.problemStatement.hotLeadsIgnored}
          </Text>
        </View>
      </View>

      {/* Scoring Model */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>◉ PROPOSED SCORING MODEL</Text>
        <View style={styles.solutionBox}>
          {leadScoringAnalysis.proposedScoringModel.scoringTiers.map((tier, idx) => (
            <View key={idx} style={{ marginBottom: 8 }}>
              <Text style={[styles.bodyText, { fontSize: 10 }]}>
                <Text style={styles.boldText}>{tier.tier} (score ≥{tier.minScore}): </Text>
                {tier.action}
              </Text>
              <Text style={[styles.bodyText, { fontSize: 8, marginLeft: 8 }]}>
                Expected conversion: {tier.expectedConversion}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Impact Calculation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>▉ REVENUE IMPACT</Text>
        <View style={styles.calculationBox}>
          {leadScoringAnalysis.impactCalculation.calculationSteps.map((step, idx) => (
            <Text key={idx} style={styles.calcStep}>
              <Text style={styles.calcValue}>{step.step}. </Text>
              {step.description}
              {step.value && <Text style={styles.calcValue}> → {step.value}</Text>}
            </Text>
          ))}
        </View>

        <Text style={[styles.roiBadge, { marginTop: 12 }]}>
          ROI: {leadScoringAnalysis.solution.roi}
        </Text>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 4 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 5: Pipeline Management
  const Page5_Pipeline = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>Pipeline Management & Automation</Text>
        <Text style={styles.pageSubtitle}>
          Obecny system: {pipelineManagementAnalysis.currentSystem}. Salesforce: Automated pipeline = 30-50% more closed deals.
        </Text>
      </View>

      {/* Current Pain Points */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>😫 OBECNE PROBLEMY</Text>
        <View style={styles.problemBox}>
          {pipelineManagementAnalysis.currentPainPoints.slice(0, 4).map((pain, idx) => (
            <Text key={idx} style={styles.bodyText}>
              • <Text style={styles.boldText}>{pain.pain}</Text>
              {'\n  '}<Text style={{ fontSize: 8 }}>Impact: {pain.impact}</Text>
            </Text>
          ))}
        </View>
      </View>

      {/* Proposed Pipeline (first 4 stages) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>↻ PROPOSED PIPELINE (7 stages)</Text>
        {pipelineManagementAnalysis.proposedPipeline.stages.slice(0, 3).map((stage, idx) => (
          <View key={idx} style={[styles.solutionBox, { marginBottom: 8, padding: 8 }]}>
            <Text style={[styles.bodyText, { fontSize: 9, marginBottom: 3 }]}>
              <Text style={styles.boldText}>{stage.stage}</Text> ({stage.goalDuration})
            </Text>
            <Text style={[styles.bodyText, { fontSize: 8, marginBottom: 3 }]}>
              KPI: {stage.kpi}
            </Text>
            <Text style={[styles.bodyText, { fontSize: 8 }]}>
              Automation: {stage.automation.slice(0, 2).join(', ')}
              {stage.automation.length > 2 && ` ...+${stage.automation.length - 2} more`}
            </Text>
          </View>
        ))}
        <Text style={[styles.bodyText, { fontSize: 8, color: '#888', marginTop: 4 }]}>
          ...+ 4 more stages (Proposal Sent, Negotiation, Closed Won, Closed Lost)
        </Text>
      </View>

      {/* ROI */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>€ REVENUE IMPACT</Text>
        <View style={styles.calculationBox}>
          {pipelineManagementAnalysis.impactCalculation.calculationSteps.slice(0, 5).map((step, idx) => (
            <Text key={idx} style={styles.calcStep}>
              <Text style={styles.calcValue}>{step.step}. </Text>
              {step.description}
              {step.value && <Text style={styles.calcValue}> → {step.value}</Text>}
            </Text>
          ))}
        </View>

        <Text style={styles.roiBadge}>
          ROI: {pipelineManagementAnalysis.solution.roi}
        </Text>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 5 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 6: Integration & Data Flow
  const Page6_Integration = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>Integration & Data Flow</Text>
        <Text style={styles.pageSubtitle}>
          How to connect everything: Website → CRM → Email → Analytics. Zero manual work.
        </Text>
      </View>

      {/* Proposed Tech Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ TECH STACK</Text>
        <View style={styles.solutionBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Form: </Text>{integrationAnalysis.proposedTechStack.websiteForm}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>CRM: </Text>{integrationAnalysis.proposedTechStack.crm}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Email: </Text>{integrationAnalysis.proposedTechStack.emailAutomation}
          </Text>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Automation: </Text>{integrationAnalysis.proposedTechStack.automation}
          </Text>
        </View>
      </View>

      {/* Key Automation Workflows */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ KEY AUTOMATION WORKFLOWS</Text>
        {integrationAnalysis.keyAutomationWorkflows.map((workflow, idx) => (
          <View key={idx} style={[styles.solutionBox, { marginBottom: 8, padding: 8 }]}>
            <Text style={[styles.bodyText, { fontSize: 9, marginBottom: 3 }]}>
              <Text style={styles.boldText}>{workflow.name}</Text>
            </Text>
            <Text style={[styles.bodyText, { fontSize: 8, marginBottom: 3 }]}>
              <Text style={styles.boldText}>Trigger: </Text>{workflow.trigger}
            </Text>
            <Text style={[styles.bodyText, { fontSize: 8, marginBottom: 3 }]}>
              <Text style={styles.boldText}>Actions:</Text>
            </Text>
            {workflow.actions.slice(0, 3).map((action, actionIdx) => (
              <Text key={actionIdx} style={[styles.bodyText, { fontSize: 7, marginLeft: 8 }]}>
                • {action}
              </Text>
            ))}
            <Text style={[styles.bodyText, { fontSize: 8, marginTop: 3, color: COLORS.neonGreen }]}>
              ROI: {workflow.roi}
            </Text>
          </View>
        ))}
      </View>

      {/* Total ROI */}
      <View style={styles.section}>
        <Text style={styles.roiBadge}>
          Total Integration ROI: {integrationAnalysis.totalExpectedROI}
        </Text>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 6 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 7: Reporting & Analytics
  const Page7_Reporting = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>Reporting & Analytics</Text>
        <Text style={styles.pageSubtitle}>
          Data-driven decisions = 15-25% revenue uplift (McKinsey). Track, measure, optimize.
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>▉ KEY METRICS TO TRACK</Text>

        <Text style={[styles.bodyText, { fontSize: 9, fontWeight: 'bold', marginBottom: 4 }]}>
          Lead Generation:
        </Text>
        <View style={styles.problemBox}>
          {reportingAnalysis.keyMetricsToTrack.leadGeneration.map((metric, idx) => (
            <Text key={idx} style={styles.bodyText}>
              • {metric.metric}: {metric.current} → Target: {metric.target}
            </Text>
          ))}
        </View>

        <Text style={[styles.bodyText, { fontSize: 9, fontWeight: 'bold', marginTop: 8, marginBottom: 4 }]}>
          Pipeline Health:
        </Text>
        <View style={styles.problemBox}>
          {reportingAnalysis.keyMetricsToTrack.pipelineHealth.map((metric, idx) => (
            <Text key={idx} style={styles.bodyText}>
              • {metric.metric}: {metric.current} → Target: {metric.target}
            </Text>
          ))}
        </View>
      </View>

      {/* Dashboard Setup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>↗ PROPOSED DASHBOARD</Text>
        <View style={styles.solutionBox}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Tool: </Text>{reportingAnalysis.proposedDashboard.tool}
          </Text>
          <Text style={[styles.bodyText, { marginTop: 8, marginBottom: 4 }]}>
            <Text style={styles.boldText}>Sections:</Text>
          </Text>
          {reportingAnalysis.proposedDashboard.sections.map((section, idx) => (
            <View key={idx} style={{ marginBottom: 6 }}>
              <Text style={[styles.bodyText, { fontSize: 9 }]}>
                {idx + 1}. {section.section}
              </Text>
              <Text style={[styles.bodyText, { fontSize: 7, marginLeft: 8 }]}>
                {section.widgets.slice(0, 2).join(', ')}
                {section.widgets.length > 2 && ` ...+${section.widgets.length - 2} more`}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 7 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  // Page 8: Implementation Roadmap
  const Page8_Roadmap = (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.pageTitle}>4-Week Implementation Roadmap</Text>
        <Text style={styles.pageSubtitle}>
          {crmImplementationRoadmap.totalTimeInvestment} total | {crmImplementationRoadmap.totalCost} cost | {crmImplementationRoadmap.expectedROI} ROI
        </Text>
      </View>

      {/* Weekly Plan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 WEEK-BY-WEEK PLAN</Text>
        {crmImplementationRoadmap.weeklyPlan.map((week, idx) => (
          <View key={idx} style={styles.timelineWeek}>
            <View style={styles.weekHeader}>
              <View>
                <Text style={styles.weekTitle}>{week.week}: {week.focus}</Text>
                <Text style={[styles.bodyText, { fontSize: 7, marginTop: 2 }]}>
                  Time: {week.hours}
                </Text>
              </View>
              <Text style={styles.weekImpact}>{week.expectedImpact}</Text>
            </View>

            {week.tasks.slice(0, 3).map((task, taskIdx) => (
              <View key={taskIdx} style={styles.taskItem}>
                <View style={styles.taskCheckbox} />
                <Text style={styles.taskText}>
                  {task.task} ({task.owner})
                  <Text style={styles.taskTime}> - {task.time}</Text>
                </Text>
              </View>
            ))}
            {week.tasks.length > 3 && (
              <Text style={[styles.taskText, { color: '#888' }]}>
                ...+ {week.tasks.length - 3} more tasks
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* Break-even */}
      <View style={styles.section}>
        <View style={styles.solutionBox}>
          <Text style={[styles.bodyText, { fontSize: 10, textAlign: 'center' }]}>
            <Text style={styles.boldText}>Break-even: </Text>
            <Text style={{ color: COLORS.neonGreen }}>{crmImplementationRoadmap.breakEven}</Text>
          </Text>
          <Text style={[styles.bodyText, { fontSize: 8, textAlign: 'center', marginTop: 4 }]}>
            Start this weekend. See results by Week 2.
          </Text>
        </View>
      </View>

      <View style={styles.pageFooter}>
        <Text style={styles.footerText}>LAMA PRO - CRM Core Audit</Text>
        <Text style={styles.footerText}>Strona 8 z 8 (CRM Section)</Text>
      </View>
    </Page>
  );

  return (
    <>
      {Page1_Overview}
      {Page2_LeadResponse}
      {Page3_EmailAutomation}
      {Page4_LeadScoring}
      {Page5_Pipeline}
      {Page6_Integration}
      {Page7_Reporting}
      {Page8_Roadmap}
    </>
  );
};

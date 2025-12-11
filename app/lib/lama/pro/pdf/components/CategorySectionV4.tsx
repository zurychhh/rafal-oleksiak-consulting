import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY } from '../font-constants';

// Neon accents for startup energy + professional readability
const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  orange: '#F97316',
  neonGreen: '#00FF00',  // Quick wins!
  hotPink: '#FF006E',    // Urgent!
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  // Header
  header: {
    marginBottom: 20,
  },
  categoryBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  score: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 40,
    fontWeight: 'bold',
    marginRight: 6,
  },
  maxScore: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    color: COLORS.lightGrey,
  },
  accentLine: {
    width: 60,
    height: 2,
    marginTop: 10,
    marginBottom: 14,
  },
  categoryDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginTop: 6,
  },

  // PYRAMID PRINCIPLE SECTIONS
  pyramidSection: {
    marginBottom: 16,
  },
  pyramidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
  },
  pyramidLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginRight: 8,
  },
  pyramidTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pyramidContent: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.8,
    marginBottom: 8,
  },
  pyramidContentBold: {
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // Issue styles
  issuesList: {
    marginTop: 10,
    marginBottom: 10,
  },
  issueItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  issueBullet: {
    fontFamily: DEFAULT_FONT_FAMILY,
    width: 16,
    fontSize: 11,
    color: COLORS.red,
    marginRight: 6,
  },
  issueText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    flex: 1,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
  },
  issueImpact: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.orange,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Calculation breakdown box
  calculationBox: {
    backgroundColor: '#1E1E2E',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  calculationTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calculationStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 4,
  },
  calculationStepNumber: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  calculationStepValue: {
    fontWeight: 'bold',
    color: COLORS.neonGreen,
  },
  calculationAssumptions: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2D2D4A',
  },

  // Solution header
  solutionHeader: {
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
  },
  solutionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  solutionDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 8,
  },
  solutionRationale: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.8,
    marginTop: 6,
  },

  // Implementation paths
  pathsIntro: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 12,
  },
  pathCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pathName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pathBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pathMetrics: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pathExplanation: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 8,
  },
  pathSteps: {
    marginTop: 8,
  },
  stepItem: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 3,
  },

  // Code snippet (from V3)
  codeBlockContainer: {
    backgroundColor: '#1E1E2E',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonGreen,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D4A',
  },
  codeTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  copyBadge: {
    backgroundColor: COLORS.neonGreen,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  copyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.moonlitGrey,
    textTransform: 'uppercase',
  },
  codeContent: {
    fontSize: 8,
    fontFamily: CODE_FONT_FAMILY,
    color: '#A0A0B0',
    lineHeight: 1.6,
  },
  codeWhy: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2D2D4A',
  },

  // ROI box
  roiBox: {
    backgroundColor: '#1E1E2E',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.neonGreen,
  },
  roiLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.neonGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roiValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 3,
  },
  roiDetail: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
  },

  // Evidence box
  evidenceBox: {
    backgroundColor: '#2D2D4A',
    padding: 12,
    borderRadius: 4,
    marginTop: 12,
  },
  evidenceTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  evidenceIntro: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 8,
  },
  evidenceText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 5,
  },
  evidenceSource: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.electricBlue,
    marginTop: 8,
  },
  evidenceContext: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: '#9CA3AF',
    lineHeight: 1.6,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#3D3D5A',
  },
});

interface Issue {
  description: string;
  impact: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface CodeSnippet {
  language: string;
  code: string;
  explanation: string;
}

interface CalculationStep {
  step: number;
  description: string;
  value?: string;
  formula?: string;
}

interface ImplementationPath {
  name: 'DIY' | 'Agency' | 'Hybrid';
  cost: string;
  time: string;
  complexity: 'Low' | 'Medium' | 'High';
  explanation: string; // NEW: Why this path works
  steps: string[];
  codeSnippet?: CodeSnippet;
  roiTimeline: string;
  roiDetail: string;
}

interface Solution {
  title: string;
  description: string;
  rationale: string; // NEW: Detailed explanation of why this solution works
  businessCase: string;
  implementationPaths: ImplementationPath[];
  expectedImpact: {
    conservative: string;
    aggressive: string;
    calculation: string;
  };
  marketEvidence: {
    dataPoints: string[];
    sources: string[];
    context: string; // NEW: Why these sources are credible and how they apply
  };
}

interface CategorySectionV4Props {
  categoryName: string;
  categoryDescription: string;
  score: number;
  industryBenchmark: number;
  categoryColor: string;

  // PYRAMID PRINCIPLE STRUCTURE
  situation: {
    currentState: string; // Detailed explanation of what we found
    benchmark: string; // Why industry benchmark matters
    gap: string; // Specific gap identified
  };

  complication: {
    businessImpact: string; // Detailed business impact explanation
    calculationSteps: CalculationStep[]; // Step-by-step ROI calculation
    assumptions: string; // Assumptions behind calculations
  };

  issues: Issue[];
  solution: Solution;
  pageNumber?: number;
}

export const CategorySectionV4: React.FC<CategorySectionV4Props> = ({
  categoryName,
  categoryDescription,
  score,
  industryBenchmark,
  categoryColor,
  situation,
  complication,
  issues,
  solution,
  pageNumber,
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return COLORS.green;
    if (score >= 60) return COLORS.yellow;
    return COLORS.red;
  };

  const getPathColor = (name: string): string => {
    switch (name) {
      case 'DIY':
        return COLORS.neonGreen;
      case 'Agency':
        return COLORS.orange;
      case 'Hybrid':
        return COLORS.electricBlue;
      default:
        return COLORS.lightGrey;
    }
  };

  return (
    <>
      {/* PAGE 1: SITUATION & COMPLICATION */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} wrap={false}>
          <Text style={styles.categoryBadge}>Category {pageNumber || ''}</Text>
          <Text style={styles.title}>{categoryName}</Text>
          <View style={{ ...styles.accentLine, backgroundColor: categoryColor }} />

          <View style={styles.scoreRow}>
            <Text style={{ ...styles.score, color: getScoreColor(score) }}>{score}</Text>
            <Text style={styles.maxScore}>/100</Text>
            <View style={{ marginLeft: 14 }}>
              <Text style={{ fontSize: 10, color: COLORS.lightGrey }}>
                Industry: <Text style={{ color: COLORS.electricBlue, fontWeight: 'bold' }}>{industryBenchmark}/100</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.categoryDescription}>{categoryDescription}</Text>
        </View>

        {/* SITUATION (Pyramid Level 1) */}
        <View style={styles.pyramidSection} wrap={false}>
          <View style={styles.pyramidHeader}>
            <View style={{ ...styles.pyramidLabel, backgroundColor: COLORS.vividPurple, color: COLORS.white }}>
              <Text>SITUATION</Text>
            </View>
            <Text style={styles.pyramidTitle}>What We Found</Text>
          </View>

          <Text style={styles.pyramidContent}>
            <Text style={styles.pyramidContentBold}>Current State: </Text>
            {situation.currentState}
          </Text>

          <Text style={styles.pyramidContent}>
            <Text style={styles.pyramidContentBold}>Industry Benchmark Context: </Text>
            {situation.benchmark}
          </Text>

          <Text style={styles.pyramidContent}>
            <Text style={styles.pyramidContentBold}>The Gap: </Text>
            {situation.gap}
          </Text>
        </View>

        {/* Issues List */}
        {issues.length > 0 && (
          <View style={styles.issuesList} wrap={false}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.red, marginBottom: 8 }}>
              Specific Issues Identified:
            </Text>
            {issues.slice(0, 4).map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <Text style={styles.issueBullet}>✗</Text>
                <Text style={styles.issueText}>{issue.description}</Text>
                <Text style={styles.issueImpact}>{issue.impact}</Text>
              </View>
            ))}
          </View>
        )}

        {/* COMPLICATION (Pyramid Level 2) */}
        <View style={styles.pyramidSection} wrap={false}>
          <View style={styles.pyramidHeader}>
            <View style={{ ...styles.pyramidLabel, backgroundColor: COLORS.orange, color: COLORS.white }}>
              <Text>COMPLICATION</Text>
            </View>
            <Text style={styles.pyramidTitle}>Why This Matters to Your Business</Text>
          </View>

          <Text style={styles.pyramidContent}>{complication.businessImpact}</Text>
        </View>

        {/* Detailed Calculation Breakdown */}
        <View style={styles.calculationBox} wrap={false}>
          <Text style={styles.calculationTitle}>€ How We Calculate the Financial Impact</Text>

          {complication.calculationSteps.map((step, index) => (
            <Text key={index} style={styles.calculationStep}>
              <Text style={styles.calculationStepNumber}>{step.step}. </Text>
              {step.description}
              {step.value && (
                <Text style={styles.calculationStepValue}> → {step.value}</Text>
              )}
              {step.formula && (
                <Text style={{ color: '#9CA3AF', fontSize: 8 }}> ({step.formula})</Text>
              )}
            </Text>
          ))}

          <Text style={styles.calculationAssumptions}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Assumptions: </Text>
            {complication.assumptions}
          </Text>
        </View>
      </Page>

      {/* PAGE 2: ANSWER (Solution) */}
      <Page size="A4" style={styles.page}>
        {/* Solution Header */}
        <View style={styles.solutionHeader} wrap={false}>
          <View style={styles.pyramidHeader}>
            <View style={{ ...styles.pyramidLabel, backgroundColor: COLORS.neonGreen, color: COLORS.moonlitGrey }}>
              <Text>ANSWER</Text>
            </View>
            <Text style={styles.pyramidTitle}>Recommended Solution</Text>
          </View>

          <Text style={styles.solutionTitle}>{solution.title}</Text>
          <Text style={styles.solutionDescription}>{solution.description}</Text>

          <Text style={styles.solutionRationale}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Why This Solution Works: </Text>
            {solution.rationale}
          </Text>

          <Text style={styles.solutionRationale}>
            <Text style={{ fontWeight: 'bold', color: COLORS.electricBlue }}>Business Case: </Text>
            {solution.businessCase}
          </Text>
        </View>

        {/* Implementation Paths Introduction */}
        <Text style={styles.pathsIntro}>
          We've identified <Text style={{ fontWeight: 'bold', color: COLORS.white }}>three implementation paths</Text> based on your resources,
          technical capability, and time constraints. Each path leads to the same outcome but with different trade-offs between cost, time, and effort.
        </Text>

        {/* Implementation Paths */}
        {solution.implementationPaths.map((path, index) => (
          <View key={index} wrap={false}>
            <View
              style={{
                ...styles.pathCard,
                borderLeftColor: getPathColor(path.name),
              }}
            >
              {/* Path Header */}
              <View style={styles.pathHeader}>
                <Text style={styles.pathName}>
                  {index + 1}. {path.name} Path
                </Text>
                <View
                  style={{
                    ...styles.pathBadge,
                    backgroundColor:
                      path.complexity === 'Low' ? COLORS.green :
                      path.complexity === 'Medium' ? COLORS.yellow :
                      COLORS.red,
                    color: path.complexity === 'Medium' ? COLORS.moonlitGrey : COLORS.white,
                  }}
                >
                  <Text>{path.complexity} Complexity</Text>
                </View>
              </View>

              {/* Metrics */}
              <View style={styles.pathMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Investment</Text>
                  <Text style={styles.metricValue}>{path.cost}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Time Required</Text>
                  <Text style={styles.metricValue}>{path.time}</Text>
                </View>
              </View>

              {/* Path Explanation */}
              <Text style={styles.pathExplanation}>{path.explanation}</Text>

              {/* Steps */}
              <View style={styles.pathSteps}>
                <Text style={{ fontSize: 9, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
                  Implementation Steps:
                </Text>
                {path.steps.map((step, stepIndex) => (
                  <Text key={stepIndex} style={styles.stepItem}>
                    {stepIndex + 1}. {step}
                  </Text>
                ))}
              </View>

              {/* ROI */}
              <View style={styles.roiBox}>
                <Text style={styles.roiLabel}>⚡ EXPECTED ROI</Text>
                <Text style={styles.roiValue}>{path.roiTimeline}</Text>
                <Text style={styles.roiDetail}>{path.roiDetail}</Text>
              </View>
            </View>

            {/* Code Snippet - Only for DIY path */}
            {path.name === 'DIY' && path.codeSnippet && (
              <View style={styles.codeBlockContainer} wrap={false}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeTitle}>
                    📋 COPY THIS → Paste in your {path.codeSnippet.language.toUpperCase()}
                  </Text>
                  <View style={styles.copyBadge}>
                    <Text style={styles.copyText}>READY TO SHIP</Text>
                  </View>
                </View>

                <Text style={styles.codeContent}>{path.codeSnippet.code}</Text>

                <Text style={styles.codeWhy}>
                  <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Why this code works: </Text>
                  {path.codeSnippet.explanation}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Market Evidence */}
        <View style={styles.evidenceBox} wrap={false}>
          <Text style={styles.evidenceTitle}>▉ Market Evidence & Data Sources</Text>

          <Text style={styles.evidenceIntro}>{solution.marketEvidence.context}</Text>

          <Text style={{ ...styles.pyramidContent, fontSize: 9, marginTop: 8, marginBottom: 6 }}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Conservative Estimate: </Text>
            {solution.expectedImpact.conservative}
          </Text>

          <Text style={{ fontSize: 9, fontWeight: 'bold', color: COLORS.white, marginBottom: 4 }}>
            Supporting Data Points:
          </Text>

          {solution.marketEvidence.dataPoints.map((point, index) => (
            <Text key={index} style={styles.evidenceText}>
              • {point}
            </Text>
          ))}

          <Text style={styles.evidenceSource}>
            Sources: {solution.marketEvidence.sources.join(' | ')}
          </Text>

          <Text style={styles.evidenceContext}>
            <Text style={{ fontWeight: 'bold' }}>Why these sources matter: </Text>
            These benchmarks come from large-scale studies analyzing thousands of websites across industries.
            While your specific results may vary based on your market, product, and execution quality,
            these data points provide a statistically significant baseline for conservative revenue projections.
          </Text>
        </View>
      </Page>
    </>
  );
};

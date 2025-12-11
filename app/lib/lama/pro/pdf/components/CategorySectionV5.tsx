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
  neonGreen: '#00FF00',
  hotPink: '#FF006E',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  // Header - CZYTELNIEJSZY
  header: {
    marginBottom: 20,
  },
  categoryBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 22,
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
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 6,
  },
  maxScore: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    color: COLORS.lightGrey,
  },
  accentLine: {
    width: 50,
    height: 2,
    marginTop: 8,
    marginBottom: 12,
  },
  categoryDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginTop: 4,
  },

  // PYRAMID SECTIONS - KRÓTSZE, CZYTELNIEJSZE
  pyramidSection: {
    marginBottom: 14,
  },
  pyramidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
  },
  pyramidLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
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
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  // SHORTER PARAGRAPHS - easier to read
  pyramidContent: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 7,
  },
  pyramidContentBold: {
    fontWeight: 'bold',
    color: COLORS.white,
  },

  // Issues - PROSTSZE
  issuesList: {
    marginTop: 8,
    marginBottom: 10,
  },
  issueItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  issueBullet: {
    fontFamily: DEFAULT_FONT_FAMILY,
    width: 14,
    fontSize: 10,
    color: COLORS.red,
    marginRight: 6,
  },
  issueText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    flex: 1,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
  },
  issueImpact: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.orange,
    fontWeight: 'bold',
    marginLeft: 6,
  },

  // Calculation box - WIZUALNIE ODDZIELONE
  calculationBox: {
    backgroundColor: '#1E1E2E',
    padding: 11,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  calculationTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // SHORTENED STEPS - only most important
  calculationStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 3,
  },
  calculationStepNumber: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  calculationStepValue: {
    fontWeight: 'bold',
    color: COLORS.neonGreen,
  },
  calculationNote: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: '#9CA3AF',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#2D2D4A',
  },

  // Solution - CZYTELNIEJSZY
  solutionHeader: {
    marginTop: 14,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
  },
  solutionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  solutionDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  // SHORTENED "WHY" - only essence
  solutionRationale: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginTop: 5,
  },

  // Implementation paths - ZWIĘŹLEJSZE
  pathsIntro: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  pathCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  pathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  pathName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pathBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pathMetrics: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 7,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  // SHORTENED EXPLANATION - only key info
  pathExplanation: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 7,
  },
  pathSteps: {
    marginTop: 6,
  },
  stepItem: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 2,
  },

  // Code snippet - ZACHOWANE Z V4
  codeBlockContainer: {
    backgroundColor: '#1E1E2E',
    padding: 11,
    borderRadius: 6,
    marginTop: 9,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonGreen,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D4A',
  },
  codeTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
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
    fontSize: 7,
    fontFamily: CODE_FONT_FAMILY,
    color: '#A0A0B0',
    lineHeight: 1.5,
  },
  codeWhy: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginTop: 7,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: '#2D2D4A',
  },

  // ROI box
  roiBox: {
    backgroundColor: '#1E1E2E',
    padding: 9,
    borderRadius: 4,
    marginTop: 7,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.neonGreen,
  },
  roiLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.neonGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roiValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 3,
  },
  roiDetail: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
  },

  // Evidence box - SHORTENED
  evidenceBox: {
    backgroundColor: '#2D2D4A',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  evidenceTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  evidenceText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  evidenceSource: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.electricBlue,
    marginTop: 6,
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

// SHORTENED - only top 5 steps, rest in Methodology
interface CalculationStep {
  step: number;
  description: string;
  value?: string;
}

interface ImplementationPath {
  name: 'DIY' | 'Agency' | 'Hybrid';
  cost: string;
  time: string;
  complexity: 'Low' | 'Medium' | 'High';
  whyThisPath: string; // SHORTENED: 1-2 sentences instead of paragraph
  steps: string[];
  codeSnippet?: CodeSnippet;
  roiTimeline: string;
  roiDetail: string;
}

interface Solution {
  title: string;
  description: string;
  whyItWorks: string; // SHORTENED: 2-3 sentences instead of long paragraph
  businessCase: string; // SHORTENED: 2 sentences
  implementationPaths: ImplementationPath[];
  expectedImpact: {
    conservative: string;
    calculation: string;
  };
  marketEvidence: {
    dataPoints: string[]; // Max 3 most important
    sources: string[];
  };
}

interface CategorySectionV5Props {
  categoryName: string;
  categoryDescription: string;
  score: number;
  industryBenchmark: number;
  categoryColor: string;

  // PYRAMID PRINCIPLE - SHORTENED VERSIONS
  situation: {
    currentState: string; // 2-3 zdania max
    gap: string; // 1-2 zdania
  };

  complication: {
    businessImpact: string; // 2-3 zdania max
    topCalculationSteps: CalculationStep[]; // Top 5 kroków zamiast 15
    noteAboutFullCalculation: string; // "Full 15-step breakdown on page X"
  };

  issues: Issue[]; // Max 3
  solution: Solution;
  pageNumber?: number;
}

export const CategorySectionV5: React.FC<CategorySectionV5Props> = ({
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
      {/* PAGE 1: SITUATION SITUATION & COMPLICATION - SKRÓCONE, CZYTELNE COMPLICATION - SHORTENED, READABLE */}
      <Page size="A4" style={styles.page}>
        {/* Header - COMPACT */}
        <View style={styles.header} wrap={false}>
          <Text style={styles.categoryBadge}>Category {pageNumber || ''}</Text>
          <Text style={styles.title}>{categoryName}</Text>
          <View style={{ ...styles.accentLine, backgroundColor: categoryColor }} />

          <View style={styles.scoreRow}>
            <Text style={{ ...styles.score, color: getScoreColor(score) }}>{score}</Text>
            <Text style={styles.maxScore}>/100</Text>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 9, color: COLORS.lightGrey }}>
                Industry: <Text style={{ color: COLORS.electricBlue, fontWeight: 'bold' }}>{industryBenchmark}/100</Text>
              </Text>
            </View>
          </View>

          <Text style={styles.categoryDescription}>{categoryDescription}</Text>
        </View>

        {/* SITUATION - KRÓTKIE, JASNE */}
        <View style={styles.pyramidSection} wrap={false}>
          <View style={styles.pyramidHeader}>
            <View style={{ ...styles.pyramidLabel, backgroundColor: COLORS.vividPurple, color: COLORS.white }}>
              <Text>SITUATION</Text>
            </View>
            <Text style={styles.pyramidTitle}>What We Found</Text>
          </View>

          <Text style={styles.pyramidContent}>{situation.currentState}</Text>

          <Text style={styles.pyramidContent}>
            <Text style={styles.pyramidContentBold}>Gap: </Text>
            {situation.gap}
          </Text>
        </View>

        {/* Issues - MAX 3 */}
        {issues.length > 0 && (
          <View style={styles.issuesList} wrap={false}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.red, marginBottom: 6 }}>
              Key Issues:
            </Text>
            {issues.slice(0, 3).map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <Text style={styles.issueBullet}>✗</Text>
                <Text style={styles.issueText}>{issue.description}</Text>
                <Text style={styles.issueImpact}>{issue.impact}</Text>
              </View>
            ))}
          </View>
        )}

        {/* COMPLICATION - KRÓTKIE */}
        <View style={styles.pyramidSection} wrap={false}>
          <View style={styles.pyramidHeader}>
            <View style={{ ...styles.pyramidLabel, backgroundColor: COLORS.orange, color: COLORS.white }}>
              <Text>IMPACT</Text>
            </View>
            <Text style={styles.pyramidTitle}>Why This Matters for Your Business</Text>
          </View>

          <Text style={styles.pyramidContent}>{complication.businessImpact}</Text>
        </View>

        {/* Calculation - TOP 5 KROKÓW (zamiast 15!) */}
        <View style={styles.calculationBox} wrap={false}>
          <Text style={styles.calculationTitle}>€ How We Calculate Financial Impact (Summary)</Text>

          {complication.topCalculationSteps.map((step, index) => (
            <Text key={index} style={styles.calculationStep}>
              <Text style={styles.calculationStepNumber}>{step.step}. </Text>
              {step.description}
              {step.value && (
                <Text style={styles.calculationStepValue}> → {step.value}</Text>
              )}
            </Text>
          ))}

          <Text style={styles.calculationNote}>
            {complication.noteAboutFullCalculation}
          </Text>
        </View>
      </Page>

      {/* PAGE 2: ANSWER (Solution) - ZWIĘZŁE */}
      <Page size="A4" style={styles.page}>
        {/* Solution Header */}
        <View style={styles.solutionHeader} wrap={false}>
          <View style={styles.pyramidHeader}>
            <View style={{ ...styles.pyramidLabel, backgroundColor: COLORS.neonGreen, color: COLORS.moonlitGrey }}>
              <Text>SOLUTION</Text>
            </View>
            <Text style={styles.pyramidTitle}>Recommendation</Text>
          </View>

          <Text style={styles.solutionTitle}>{solution.title}</Text>
          <Text style={styles.solutionDescription}>{solution.description}</Text>

          <Text style={styles.solutionRationale}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Why This Works: </Text>
            {solution.whyItWorks}
          </Text>

          <Text style={styles.solutionRationale}>
            <Text style={{ fontWeight: 'bold', color: COLORS.electricBlue }}>Business case: </Text>
            {solution.businessCase}
          </Text>
        </View>

        {/* Implementation Paths - KRÓTSZE WYJAŚNIENIA */}
        <Text style={styles.pathsIntro}>
          Choose one of 3 implementation paths (difference: cost vs time vs expertise):
        </Text>

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
                  {index + 1}. {path.name}
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
                  <Text>{path.complexity}</Text>
                </View>
              </View>

              {/* Metrics */}
              <View style={styles.pathMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Cost</Text>
                  <Text style={styles.metricValue}>{path.cost}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Time</Text>
                  <Text style={styles.metricValue}>{path.time}</Text>
                </View>
              </View>

              {/* WHY - SHORTENED (1-2 sentences) */}
              <Text style={styles.pathExplanation}>
                <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Best For: </Text>
                {path.whyThisPath}
              </Text>

              {/* Steps - MAX 4 */}
              <View style={styles.pathSteps}>
                {path.steps.slice(0, 4).map((step, stepIndex) => (
                  <Text key={stepIndex} style={styles.stepItem}>
                    {stepIndex + 1}. {step}
                  </Text>
                ))}
              </View>

              {/* ROI */}
              <View style={styles.roiBox}>
                <Text style={styles.roiLabel}>⚡ ROI</Text>
                <Text style={styles.roiValue}>{path.roiTimeline}</Text>
                <Text style={styles.roiDetail}>{path.roiDetail}</Text>
              </View>
            </View>

            {/* Code Snippet - ONLY DLA DIY */}
            {path.name === 'DIY' && path.codeSnippet && (
              <View style={styles.codeBlockContainer} wrap={false}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeTitle}>
                    📋 COPY-PASTE TO {path.codeSnippet.language.toUpperCase()}
                  </Text>
                  <View style={styles.copyBadge}>
                    <Text style={styles.copyText}>READY</Text>
                  </View>
                </View>

                <Text style={styles.codeContent}>{path.codeSnippet.code}</Text>

                <Text style={styles.codeWhy}>
                  <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Why This Works: </Text>
                  {path.codeSnippet.explanation}
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Market Evidence - SHORTENED (top 3 points) */}
        <View style={styles.evidenceBox} wrap={false}>
          <Text style={styles.evidenceTitle}>▉ Market Data</Text>

          <Text style={{ ...styles.evidenceText, marginBottom: 6 }}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Conservative Estimate: </Text>
            {solution.expectedImpact.conservative}
          </Text>

          {solution.marketEvidence.dataPoints.slice(0, 3).map((point, index) => (
            <Text key={index} style={styles.evidenceText}>
              • {point}
            </Text>
          ))}

          <Text style={styles.evidenceSource}>
            Sources: {solution.marketEvidence.sources.join(' | ')}
          </Text>
        </View>
      </Page>
    </>
  );
};

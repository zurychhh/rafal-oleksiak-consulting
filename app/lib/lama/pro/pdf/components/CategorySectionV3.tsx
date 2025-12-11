import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY } from '../font-constants';

// Neon accents added!
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
  header: {
    marginBottom: 18,
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
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginBottom: 8,
  },
  text: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 6,
  },
  // Issue styles
  issueItem: {
    flexDirection: 'row',
    marginBottom: 7,
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
  // Solution header
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
    marginBottom: 4,
  },
  solutionDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  // 🔥 NEW: Copy-Paste Code Block
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
  codeComment: {
    color: '#6B7280',
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
  // Implementation paths
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
    marginBottom: 7,
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
  pathSteps: {
    marginTop: 7,
  },
  stepItem: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 3,
  },
  roiBox: {
    backgroundColor: '#1E1E2E',
    padding: 8,
    borderRadius: 4,
    marginTop: 7,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.neonGreen,
  },
  roiLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.neonGreen,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  roiValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  roiDetail: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    marginTop: 2,
  },
  // Evidence box
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
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  evidenceText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  evidenceSource: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.electricBlue,
    marginTop: 4,
  },
});

interface Issue {
  description: string;
  impact: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// 🔥 NEW: Code Snippet interface
interface CodeSnippet {
  language: string; // 'html', 'css', 'javascript', 'bash'
  code: string; // The actual code to copy-paste
  explanation: string; // Why this code works + ROI note
}

interface ImplementationPath {
  name: 'DIY' | 'Agency' | 'Hybrid';
  cost: string;
  time: string;
  complexity: 'Low' | 'Medium' | 'High';
  steps: string[];
  codeSnippet?: CodeSnippet; // 🔥 NEW: Copy-paste ready code
  roiTimeline: string;
  roiDetail: string;
}

interface Solution {
  title: string;
  description: string;
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
  };
}

interface CategorySectionV3Props {
  categoryName: string;
  categoryDescription: string;
  score: number;
  industryBenchmark: number;
  categoryColor: string;
  issues: Issue[];
  solution: Solution;
  pageNumber?: number;
}

export const CategorySectionV3: React.FC<CategorySectionV3Props> = ({
  categoryName,
  categoryDescription,
  score,
  industryBenchmark,
  categoryColor,
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
    <Page size="A4" style={styles.page} wrap>
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

        <Text style={{ ...styles.text, marginTop: 6 }}>{categoryDescription}</Text>
      </View>

      {/* Issues */}
      {issues.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Critical Gaps Identified</Text>
          {issues.slice(0, 3).map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Text style={styles.issueBullet}>✗</Text>
              <Text style={styles.issueText}>{issue.description}</Text>
              <Text style={styles.issueImpact}>{issue.impact}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Solution Header */}
      <View style={styles.solutionHeader} wrap={false}>
        <Text style={styles.solutionTitle}>{solution.title}</Text>
        <Text style={styles.solutionDescription}>{solution.description}</Text>
        <Text style={{ ...styles.text, color: COLORS.white, marginTop: 4 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.electricBlue }}>Business Case: </Text>
          {solution.businessCase}
        </Text>
      </View>

      {/* Implementation Paths */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose Your Implementation Path</Text>

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
                  <Text style={styles.metricLabel}>Cost</Text>
                  <Text style={styles.metricValue}>{path.cost}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Time</Text>
                  <Text style={styles.metricValue}>{path.time}</Text>
                </View>
              </View>

              {/* Steps */}
              <View style={styles.pathSteps}>
                {path.steps.slice(0, 4).map((step, stepIndex) => (
                  <Text key={stepIndex} style={styles.stepItem}>
                    {stepIndex + 1}. {step}
                  </Text>
                ))}
              </View>

              {/* ROI */}
              <View style={styles.roiBox}>
                <Text style={styles.roiLabel}>⚡ Expected ROI</Text>
                <Text style={styles.roiValue}>{path.roiTimeline}</Text>
                <Text style={styles.roiDetail}>{path.roiDetail}</Text>
              </View>
            </View>

            {/* 🔥 CODE SNIPPET - Only for DIY path */}
            {path.name === 'DIY' && path.codeSnippet && (
              <View style={styles.codeBlockContainer} wrap={false}>
                <View style={styles.codeHeader}>
                  <Text style={styles.codeTitle}>
                    📋 COPY THIS → Paste in your {path.codeSnippet.language.toUpperCase()}
                  </Text>
                  <View style={styles.copyBadge}>
                    <Text style={styles.copyText}>COPY-PASTE READY</Text>
                  </View>
                </View>

                <Text style={styles.codeContent}>{path.codeSnippet.code}</Text>

                <Text style={styles.codeWhy}>
                  <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Why this works: </Text>
                  {path.codeSnippet.explanation}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Market Evidence */}
      <View style={styles.evidenceBox} wrap={false}>
        <Text style={styles.evidenceTitle}>Market Evidence & Data</Text>
        <Text style={{ ...styles.text, fontSize: 10, marginBottom: 6 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Conservative: </Text>
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
  );
};

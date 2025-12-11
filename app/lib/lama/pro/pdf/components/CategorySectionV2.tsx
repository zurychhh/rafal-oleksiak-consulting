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
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
  orange: '#F97316',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  // Header styles
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
  benchmarkRow: {
    flexDirection: 'row',
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.darkGrey,
    borderRadius: 4,
  },
  benchmarkText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
  },
  benchmarkValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
  },
  accentLine: {
    width: 60,
    height: 2,
    marginTop: 12,
    marginBottom: 16,
  },
  // Section styles
  section: {
    marginBottom: 16,
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
    marginBottom: 8,
  },
  // Implementation paths
  pathsContainer: {
    marginTop: 12,
  },
  pathCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
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
  roiBox: {
    backgroundColor: '#1E1E2E',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.green,
  },
  roiLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.green,
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
    marginTop: 12,
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
  impact: string; // e.g., "-€15k/year"
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface ImplementationPath {
  name: 'DIY' | 'Agency' | 'Hybrid';
  cost: string;
  time: string;
  complexity: 'Low' | 'Medium' | 'High';
  steps: string[];
  roiTimeline: string; // e.g., "Break-even in 2 weeks"
  roiDetail: string; // Calculation explanation
}

interface Solution {
  title: string;
  description: string;
  businessCase: string; // Why this matters
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

interface CategorySectionV2Props {
  categoryName: string;
  categoryDescription: string;
  score: number;
  industryBenchmark: number;
  categoryColor: string;
  issues: Issue[];
  solution: Solution; // Single main solution per page (can have multiple pages per category)
  pageNumber?: number;
}

export const CategorySectionV2: React.FC<CategorySectionV2Props> = ({
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
        return COLORS.green;
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
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontSize: 10, color: COLORS.lightGrey }}>
              Industry benchmark: <Text style={styles.benchmarkValue}>{industryBenchmark}/100</Text>
            </Text>
          </View>
        </View>

        <Text style={{ ...styles.text, marginTop: 8 }}>{categoryDescription}</Text>
      </View>

      {/* Issues - Pyramid Principle: State the problem first */}
      {issues.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Critical Gaps Identified</Text>
          {issues.slice(0, 4).map((issue, index) => (
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
        <Text style={{ ...styles.text, color: COLORS.white, marginTop: 6 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.electricBlue }}>Why this matters: </Text>
          {solution.businessCase}
        </Text>
      </View>

      {/* Implementation Paths - The Answer (Pyramid) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Implementation Options - Choose Your Path</Text>

        <View style={styles.pathsContainer}>
          {solution.implementationPaths.map((path, index) => (
            <View
              key={index}
              style={{
                ...styles.pathCard,
                borderLeftColor: getPathColor(path.name)
              }}
              wrap={false}
            >
              {/* Path Header */}
              <View style={styles.pathHeader}>
                <Text style={styles.pathName}>
                  Option {index + 1}: {path.name}
                </Text>
                <View
                  style={{
                    ...styles.pathBadge,
                    backgroundColor: path.complexity === 'Low' ? COLORS.green :
                                    path.complexity === 'Medium' ? COLORS.yellow :
                                    COLORS.red,
                    color: path.complexity === 'Medium' ? COLORS.moonlitGrey : COLORS.white,
                  }}
                >
                  <Text>{path.complexity} Complexity</Text>
                </View>
              </View>

              {/* Metrics Row */}
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
                {path.steps.map((step, stepIndex) => (
                  <Text key={stepIndex} style={styles.stepItem}>
                    {stepIndex + 1}. {step}
                  </Text>
                ))}
              </View>

              {/* ROI Box */}
              <View style={styles.roiBox}>
                <Text style={styles.roiLabel}>Expected ROI</Text>
                <Text style={styles.roiValue}>{path.roiTimeline}</Text>
                <Text style={styles.roiDetail}>{path.roiDetail}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Market Evidence - The Proof */}
      <View style={styles.evidenceBox} wrap={false}>
        <Text style={styles.evidenceTitle}>Market Evidence & Data</Text>
        <Text style={styles.text} style={{ fontSize: 10, marginBottom: 6 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Conservative Estimate: </Text>
          {solution.expectedImpact.conservative}
        </Text>
        <Text style={styles.text} style={{ fontSize: 10, marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', color: COLORS.lightGrey }}>Aggressive Estimate: </Text>
          {solution.expectedImpact.aggressive}
        </Text>

        {solution.marketEvidence.dataPoints.map((point, index) => (
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

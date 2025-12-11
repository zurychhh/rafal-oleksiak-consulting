import { components } from '../shared-styles';
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
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 60,
  },
  header: {
    marginBottom: 32,
  },
  categoryBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  score: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 48,
    fontWeight: 'bold',
    marginRight: 8,
  },
  maxScore: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    color: COLORS.lightGrey,
  },
  description: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 24,
  },
  accentLine: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginBottom: 12,
  },
  issueItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingLeft: 8,
  },
  issueBullet: {
    fontFamily: DEFAULT_FONT_FAMILY,
    width: 20,
    fontSize: 12,
    color: COLORS.red,
    marginRight: 8,
  },
  issueText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    flex: 1,
    fontSize: 11,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
  },
  solutionCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.electricBlue,
  },
  solutionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  solutionText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    color: COLORS.lightGrey,
    lineHeight: 1.7,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#1E1E2E',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.vividPurple,
  },
    priorityBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  highPriority: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  mediumPriority: {
    backgroundColor: COLORS.yellow,
    color: COLORS.moonlitGrey,
  },
  lowPriority: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },
  impactBox: {
    backgroundColor: '#2D2D4A',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  impactTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  impactText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.white,
    lineHeight: 1.5,
  },
});

interface Issue {
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Solution {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  implementation: string;
  codeExample?: string;
  estimatedImpact?: string;
}

interface CategorySectionProps {
  categoryName: string;
  categoryDescription: string;
  score: number;
  categoryColor: string;
  issues: Issue[];
  solutions: Solution[];
  pageNumber?: number;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryName,
  categoryDescription,
  score,
  categoryColor,
  issues,
  solutions,
  pageNumber,
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return COLORS.green;
    if (score >= 60) return COLORS.yellow;
    return COLORS.red;
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      default:
        return styles.lowPriority;
    }
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.categoryBadge}>Category {pageNumber || ''}</Text>
        <Text style={styles.title}>{categoryName}</Text>
        <View style={{ ...styles.accentLine, backgroundColor: categoryColor }} />

        <View style={styles.scoreRow}>
          <Text style={{ ...styles.score, color: getScoreColor(score) }}>{score}</Text>
          <Text style={styles.maxScore}>/100</Text>
        </View>

        <Text style={styles.description}>{categoryDescription}</Text>
      </View>

      {/* Issues Found */}
      {issues.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issues Identified ({issues.length})</Text>
          {issues.slice(0, 5).map((issue, index) => (
            <View key={index} style={styles.issueItem}>
              <Text style={styles.issueBullet}>✗</Text>
              <Text style={styles.issueText}>{issue.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Solutions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Solutions</Text>
        {solutions.slice(0, 2).map((solution, index) => (
          <View key={index} style={styles.solutionCard}>
            <View style={{ ...styles.priorityBadge, ...getPriorityStyle(solution.priority) }}>
              <Text>{solution.priority} Priority</Text>
            </View>

            <Text style={styles.solutionTitle}>{solution.title}</Text>
            <Text style={styles.solutionText}>{solution.description}</Text>

            <Text style={{ ...styles.solutionText, fontSize: 10, marginTop: 8, fontWeight: 'bold' }}>
              Implementation:
            </Text>
            <Text style={styles.solutionText}>{solution.implementation}</Text>

            {solution.codeExample && (
              <View style={styles.codeBlock}>
                <Text style={components.codeBlockText}>{solution.codeExample}</Text>
              </View>
            )}

            {solution.estimatedImpact && (
              <View style={styles.impactBox}>
                <Text style={styles.impactTitle}>Estimated Impact</Text>
                <Text style={styles.impactText}>{solution.estimatedImpact}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </Page>
  );
};

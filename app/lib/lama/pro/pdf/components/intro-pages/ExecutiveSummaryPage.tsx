/**
 * Executive Summary Page
 * Based on V5 pattern - overall assessment, category breakdown, key findings
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';

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
  pink: '#FF006E',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  accentLine: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    marginTop: 20,
  },
  assessmentText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  categoryPurple: {
    borderLeftColor: COLORS.vividPurple,
  },
  categoryBlue: {
    borderLeftColor: COLORS.electricBlue,
  },
  categoryGreen: {
    borderLeftColor: COLORS.neonGreen,
  },
  categoryOrange: {
    borderLeftColor: COLORS.orange,
  },
  categoryRed: {
    borderLeftColor: COLORS.red,
  },
  categoryName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  categoryScore: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 2,
  },
  categorySubtext: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  findingsContainer: {
    gap: 8,
  },
  findingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  findingEmoji: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    marginRight: 8,
    width: 16,
  },
  findingText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    flex: 1,
    lineHeight: 1.5,
  },
  findingHighlight: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  findingValue: {
    fontWeight: 'bold',
    color: COLORS.neonGreen,
  },
  whatsNextBox: {
    backgroundColor: '#1A2B3D',
    padding: 14,
    borderRadius: 4,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  whatsNextTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  whatsNextText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
  },
  whatsNextHighlight: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}

interface KeyFinding {
  emoji: string;
  text: string;
  highlight?: string;
  value?: string;
}

interface ExecutiveSummaryPageProps {
  overallAssessment: string;
  categoryScores: CategoryScore[];
  keyFindings: KeyFinding[];
  whatsNextText: string;
}

export const ExecutiveSummaryPage: React.FC<ExecutiveSummaryPageProps> = ({
  overallAssessment,
  categoryScores,
  keyFindings,
  whatsNextText,
}) => {
  const getCategoryColorStyle = (color: CategoryScore['color']) => {
    switch (color) {
      case 'purple':
        return styles.categoryPurple;
      case 'blue':
        return styles.categoryBlue;
      case 'green':
        return styles.categoryGreen;
      case 'orange':
        return styles.categoryOrange;
      case 'red':
        return styles.categoryRed;
      default:
        return styles.categoryPurple;
    }
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Executive Summary</Text>
      <View style={styles.accentLine} />

      {/* Overall Assessment */}
      <Text style={styles.sectionTitle}>Overall Assessment</Text>
      <Text style={styles.assessmentText}>{overallAssessment}</Text>

      {/* Category Breakdown */}
      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <View style={styles.categoryGrid}>
        {categoryScores.map((category, idx) => (
          <View
            key={idx}
            style={[styles.categoryCard, getCategoryColorStyle(category.color)]}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryScore}>
              {category.score}/{category.maxScore}
            </Text>
            <Text style={styles.categorySubtext}>
              {category.score >= 70
                ? 'Strong performance'
                : category.score >= 50
                  ? 'Needs improvement'
                  : 'Critical gaps'}
            </Text>
          </View>
        ))}
      </View>

      {/* Key Findings */}
      <Text style={styles.sectionTitle}>Key Findings</Text>
      <View style={styles.findingsContainer}>
        {keyFindings.map((finding, idx) => (
          <View key={idx} style={styles.findingItem}>
            <Text style={styles.findingEmoji}>{finding.emoji}</Text>
            <Text style={styles.findingText}>
              {finding.highlight && (
                <Text style={styles.findingHighlight}>{finding.highlight} </Text>
              )}
              {finding.text}
              {finding.value && (
                <Text style={styles.findingValue}> {finding.value}</Text>
              )}
            </Text>
          </View>
        ))}
      </View>

      {/* What's Next */}
      <View style={styles.whatsNextBox}>
        <Text style={styles.whatsNextTitle}>What's Next?</Text>
        <Text style={styles.whatsNextText}>
          {whatsNextText.split('**').map((part, idx) =>
            idx % 2 === 1 ? (
              <Text key={idx} style={styles.whatsNextHighlight}>
                {part}
              </Text>
            ) : (
              <Text key={idx}>{part}</Text>
            ),
          )}
        </Text>
      </View>
    </Page>
  );
};

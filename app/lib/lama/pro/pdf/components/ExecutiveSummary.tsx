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
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 60,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    color: COLORS.lightGrey,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginBottom: 12,
  },
  text: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.lightGrey,
    lineHeight: 1.8,
    marginBottom: 8,
  },
  categoriesGrid: {
    marginTop: 24,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkGrey,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  categoryDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
  },
  categoryScore: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 8,
  },
  maxScore: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    color: COLORS.lightGrey,
  },
  highlightBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.electricBlue,
    marginTop: 16,
  },
  highlightTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  highlightText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.white,
    lineHeight: 1.6,
  },
  accentLine: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 24,
  },
});

interface CategoryScoreData {
  category: string;
  score: number;
  description: string;
  borderColor: string;
}

interface ExecutiveSummaryProps {
  overallScore: number;
  categories: CategoryScoreData[];
  keyFindings: string[];
  estimatedRevenueLoss: number;
  recoverable: number;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  overallScore,
  categories,
  keyFindings,
  estimatedRevenueLoss,
  recoverable,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Executive Summary</Text>
      <View style={styles.accentLine} />
      <Text style={styles.subtitle}>
        A comprehensive analysis of your website's lead acquisition maturity across 6 critical categories.
      </Text>

      {/* Overall Assessment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Assessment</Text>
        <Text style={styles.text}>
          Your website scored <Text style={{ color: COLORS.electricBlue, fontWeight: 'bold' }}>{overallScore}/100</Text> on the LAMA scale,
          indicating {overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'moderate' : 'significant'} opportunities for improvement in lead acquisition maturity.
        </Text>
        <Text style={styles.text}>
          Based on industry benchmarks and your current score, we estimate you may be losing approximately{' '}
          <Text style={{ color: COLORS.vividPurple, fontWeight: 'bold' }}>€{estimatedRevenueLoss.toLocaleString()}/year</Text> in potential revenue.
          By implementing the recommendations in this report, you could recover{' '}
          <Text style={{ color: COLORS.electricBlue, fontWeight: 'bold' }}>€{recoverable.toLocaleString()}/year</Text> (75% recovery rate).
        </Text>
      </View>

      {/* Category Scores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((cat, index) => (
            <View key={index} style={{ ...styles.categoryRow, borderLeftColor: cat.borderColor }}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{cat.category}</Text>
                <Text style={styles.categoryDescription}>{cat.description}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={styles.categoryScore}>{cat.score}</Text>
                <Text style={styles.maxScore}>/100</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Key Findings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Findings</Text>
        {keyFindings.map((finding, index) => (
          <Text key={index} style={styles.text}>
            • {finding}
          </Text>
        ))}
      </View>

      {/* Next Steps Highlight */}
      <View style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>What's Next?</Text>
        <Text style={styles.highlightText}>
          This report provides detailed, step-by-step implementation guides for each category, including code snippets,
          wireframes, and a 90-day roadmap to reach a target score of 90/100. Follow the recommendations in priority order
          to maximize your ROI and accelerate lead acquisition growth.
        </Text>
      </View>
    </Page>
  );
};

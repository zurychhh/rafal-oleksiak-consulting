import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../font-constants';

// Brand colors from design system
const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 80,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    color: COLORS.vividPurple,
    marginBottom: 60,
    fontWeight: 700,
  },
  websiteContainer: {
    marginBottom: 40,
  },
  websiteLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.lightGrey,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  websiteUrl: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 700,
  },
  scoreSection: {
    alignItems: 'center',
    marginVertical: 60,
  },
  scoreLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    color: COLORS.lightGrey,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scoreValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 120,
    color: COLORS.electricBlue,
    fontWeight: 'bold',
    lineHeight: 1,
  },
  scoreMax: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 48,
    color: COLORS.lightGrey,
    fontWeight: 400,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.vividPurple,
  },
  dateGenerated: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.lightGrey,
    marginBottom: 12,
  },
  copyright: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    opacity: 0.7,
  },
  accentLine: {
    width: 120,
    height: 4,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 24,
  },
});

interface CoverProps {
  websiteUrl: string;
  overallScore: number;
  generatedDate: string;
  companyName?: string;
}

export const Cover: React.FC<CoverProps> = ({
  websiteUrl,
  overallScore,
  generatedDate,
  companyName,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LAMA PRO</Text>
        <Text style={styles.subtitle}>Lead Acquisition Maturity Assessment</Text>
        <View style={styles.accentLine} />
      </View>

      {/* Website Info */}
      <View style={styles.websiteContainer}>
        <Text style={styles.websiteLabel}>Website Analyzed</Text>
        <Text style={styles.websiteUrl}>{websiteUrl}</Text>
        {companyName && (
          <Text style={{ ...styles.websiteUrl, fontSize: 18, marginTop: 8, color: COLORS.lightGrey }}>
            {companyName}
          </Text>
        )}
      </View>

      {/* Overall Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>Overall LAMA Score</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={styles.scoreValue}>{overallScore}</Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateGenerated}>Generated: {generatedDate}</Text>
        <Text style={styles.copyright}>© 2025 Oleksiak Consulting. All rights reserved.</Text>
      </View>
    </Page>
  );
};

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, ICONS } from '../font-constants';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: DEFAULT_FONT_FAMILY,
    backgroundColor: COLORS.moonlitGrey,
    padding: 50,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    color: COLORS.vividPurple,
    marginBottom: 20,
    fontWeight: 700,
  },
  accentLine: {
    width: 80,
    height: 3,
    backgroundColor: COLORS.vividPurple,
    marginBottom: 20,
  },
  // Company info
  companySection: {
    marginBottom: 24,
  },
  companyLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  companyName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Score display
  scoreCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.electricBlue,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    color: COLORS.lightGrey,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 64,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
  },
  scoreMax: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 24,
    color: COLORS.lightGrey,
  },
  // Business impact section (NOWE!)
  impactSection: {
    backgroundColor: '#2D2D4A',
    padding: 16,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.orange,
  },
  impactTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.orange,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  impactValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  impactLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.lightGrey,
    marginBottom: 12,
  },
  // Calculation explanation (NAJWAŻNIEJSZE!)
  calculationBox: {
    backgroundColor: '#1E1E2E',
    padding: 14,
    borderRadius: 4,
    marginTop: 12,
  },
  calculationTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calculationStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 3,
  },
  calculationValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  calculationSource: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#3D3D5A',
  },
  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  dateText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    marginBottom: 6,
  },
  copyright: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    opacity: 0.7,
  },
});

interface CoverWithCalculationProps {
  websiteUrl: string;
  companyName: string;
  overallScore: number;
  estimatedRevenueLoss: number;
  generatedDate: string;
  // Calculation details for transparency
  calculationSummary: {
    avgMonthlyVisitors: number;
    conversionRate: number;
    avgDealSize: number;
    closeRate: number;
    lostVisitorsPerMonth: number;
    source: string;
  };
}

export const CoverWithCalculation: React.FC<CoverWithCalculationProps> = ({
  websiteUrl,
  companyName,
  overallScore,
  estimatedRevenueLoss,
  generatedDate,
  calculationSummary,
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LAMA PRO</Text>
        <Text style={styles.subtitle}>Lead Acquisition Maturity Assessment</Text>
        <View style={styles.accentLine} />
      </View>

      {/* Company Info */}
      <View style={styles.companySection}>
        <Text style={styles.companyLabel}>Company Analyzed</Text>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={{ fontSize: 11, color: COLORS.lightGrey, marginTop: 4 }}>{websiteUrl}</Text>
      </View>

      {/* Overall Score */}
      <View style={{ ...styles.scoreCard, borderLeftColor: getScoreColor(overallScore) }}>
        <Text style={styles.scoreLabel}>Overall LAMA Score</Text>
        <View style={styles.scoreRow}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ ...styles.scoreValue, color: getScoreColor(overallScore) }}>{overallScore}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <Text style={{ fontSize: 10, color: COLORS.lightGrey }}>
            Industry benchmark: <Text style={{ fontWeight: 'bold', color: COLORS.white }}>78/100</Text>
          </Text>
        </View>
      </View>

      {/* Business Impact (NOWE SEKCJA!) */}
      <View style={styles.impactSection}>
        <Text style={styles.impactTitle}>{ICONS.money} Estimated Revenue Impact</Text>

        <Text style={styles.impactValue}>€{estimatedRevenueLoss.toLocaleString()}/year</Text>
        <Text style={styles.impactLabel}>
          Potential revenue loss due to gaps identified in this audit
        </Text>

        {/* CALCULATION BREAKDOWN - TRANSPARENTNOŚĆ! */}
        <View style={styles.calculationBox}>
          <Text style={styles.calculationTitle}>{ICONS.chart_bar} How We Calculate This Number</Text>

          <Text style={styles.calculationStep}>
            <Text style={styles.calculationValue}>1. Current situation: </Text>
            Your score is {overallScore}/100 (vs industry benchmark 78/100)
          </Text>

          <Text style={styles.calculationStep}>
            <Text style={styles.calculationValue}>2. Traffic impact: </Text>
            Sites scoring {overallScore}/100 receive ~{calculationSummary.lostVisitorsPerMonth} fewer qualified visitors/month than benchmark sites
          </Text>

          <Text style={styles.calculationStep}>
            <Text style={styles.calculationValue}>3. Conversion assumption: </Text>
            {(calculationSummary.conversionRate * 100).toFixed(1)}% of visitors become leads (B2B service industry average)
          </Text>

          <Text style={styles.calculationStep}>
            <Text style={styles.calculationValue}>4. Sales assumption: </Text>
            {(calculationSummary.closeRate * 100).toFixed(0)}% close rate × €{calculationSummary.avgDealSize.toLocaleString()} avg deal size
          </Text>

          <Text style={styles.calculationStep}>
            <Text style={styles.calculationValue}>5. Annual calculation: </Text>
            {calculationSummary.lostVisitorsPerMonth} visitors/mo × {(calculationSummary.conversionRate * 100).toFixed(1)}% conversion × {(calculationSummary.closeRate * 100).toFixed(0)}% close × €{calculationSummary.avgDealSize.toLocaleString()} × 12 months = €{estimatedRevenueLoss.toLocaleString()}/year
          </Text>

          <Text style={styles.calculationSource}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Sources: </Text>
            {calculationSummary.source}
          </Text>

          <Text style={{ ...styles.calculationSource, marginTop: 6, paddingTop: 0, borderTopWidth: 0 }}>
            <Text style={{ fontWeight: 'bold', color: COLORS.white }}>Important: </Text>
            This is a conservative estimate assuming industry-average performance. Your actual results may vary based on your market, product, and implementation quality. Detailed calculations with sources are provided in each category section.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.dateText}>Generated: {generatedDate}</Text>
        <Text style={styles.copyright}>
          © 2025 Oleksiak Consulting | This report provides estimates based on industry benchmarks and does not constitute financial advice
        </Text>
      </View>
    </Page>
  );
};

/**
 * Methodology & Data Sources Page
 * Based on V5 pattern - transparent calculation methodology with code examples
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY } from '../../font-constants';

const COLORS = {
  moonlitGrey: '#1A1A2E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  darkGrey: '#2A2A3E',
  codeBackground: '#0D0D1A',
  codeGreen: '#00FF00',
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
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    marginTop: 16,
  },
  calculationBox: {
    backgroundColor: COLORS.vividPurple,
    padding: 16,
    borderRadius: 4,
    marginBottom: 20,
  },
  calculationTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calculationStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.white,
    lineHeight: 1.6,
    marginBottom: 6,
  },
  calculationLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: 'bold',
    fontSize: 9,
  },
  calculationFormula: {
    fontFamily: CODE_FONT_FAMILY,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 2,
    fontSize: 7,
  },
  codeBox: {
    backgroundColor: COLORS.codeBackground,
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  codeTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.codeGreen,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  code: {
    fontFamily: CODE_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.codeGreen,
    lineHeight: 1.4,
  },
  dataSourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  sourceCard: {
    width: '48%',
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.electricBlue,
  },
  sourceName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  sourceDescription: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.4,
  },
  methodologyList: {
    gap: 8,
    marginTop: 8,
  },
  methodologyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  methodologyBullet: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.vividPurple,
    marginRight: 8,
    width: 12,
  },
  methodologyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    flex: 1,
    lineHeight: 1.5,
  },
  methodologyHighlight: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  confidenceBox: {
    backgroundColor: '#1A2B3D',
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  confidenceTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 6,
  },
  confidenceText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
  },
});

interface CalculationExample {
  title: string;
  steps: {
    label: string;
    description: string;
    formula?: string;
  }[];
}

interface DataSource {
  name: string;
  description: string;
}

interface MethodologyItem {
  text: string;
  highlight?: string;
}

interface MethodologyPageProps {
  introText: string;
  calculationExample: CalculationExample;
  codeExample?: {
    title: string;
    code: string;
  };
  methodologyItems: MethodologyItem[];
  dataSources: DataSource[];
  confidenceNote: string;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({
  introText,
  calculationExample,
  codeExample,
  methodologyItems,
  dataSources,
  confidenceNote,
}) => {
  return (
    <Page size="A4" style={styles.page}>
      {/* Title */}
      <Text style={styles.title}>Methodology & Data Sources</Text>
      <View style={styles.accentLine} />

      {/* Introduction */}
      <Text style={styles.subtitle}>{introText}</Text>

      {/* Calculation Example */}
      <View style={styles.calculationBox}>
        <Text style={styles.calculationTitle}>
          {calculationExample.title}
        </Text>
        {calculationExample.steps.map((step, idx) => (
          <View key={idx} style={{ marginBottom: 8 }}>
            <Text style={styles.calculationStep}>
              <Text style={styles.calculationLabel}>{step.label}:</Text>{' '}
              {step.description}
            </Text>
            {step.formula && (
              <Text style={styles.calculationFormula}>{step.formula}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Code Example (Optional) */}
      {codeExample && (
        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>{codeExample.title}</Text>
          <Text style={styles.code}>{codeExample.code}</Text>
        </View>
      )}

      {/* Methodology */}
      <Text style={styles.sectionTitle}>Our Approach</Text>
      <View style={styles.methodologyList}>
        {methodologyItems.map((item, idx) => (
          <View key={idx} style={styles.methodologyItem}>
            <Text style={styles.methodologyBullet}>●</Text>
            <Text style={styles.methodologyText}>
              {item.highlight && (
                <Text style={styles.methodologyHighlight}>
                  {item.highlight}:{' '}
                </Text>
              )}
              {item.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Data Sources */}
      <Text style={styles.sectionTitle}>Data Sources</Text>
      <View style={styles.dataSourcesGrid}>
        {dataSources.map((source, idx) => (
          <View key={idx} style={styles.sourceCard}>
            <Text style={styles.sourceName}>{source.name}</Text>
            <Text style={styles.sourceDescription}>{source.description}</Text>
          </View>
        ))}
      </View>

      {/* Confidence Note */}
      <View style={styles.confidenceBox}>
        <Text style={styles.confidenceTitle}>Confidence Intervals</Text>
        <Text style={styles.confidenceText}>{confidenceNote}</Text>
      </View>
    </Page>
  );
};

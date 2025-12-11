/**
 * FIND Section Enhanced - 2 Pages with V5 USP
 * Demonstrates: SYTUACJA → WPŁYW → ROZWIĄZANIE + 3-path implementation + code
 *
 * Page 1: Overview with Pyramid Principle
 * Page 2: Technical SEO with implementation paths
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { ThreePathImplementation } from '../shared/ThreePathImplementation';

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
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
  },
  // Header
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginRight: 10,
  },
  scoreBadge: {
    backgroundColor: COLORS.darkGrey,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  scoreText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  // Pyramid sections
  pyramidSection: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  situationBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.red,
  },
  impactBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.orange,
  },
  solutionBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonGreen,
  },
  bodyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  highlightText: {
    fontWeight: 'bold',
    color: COLORS.electricBlue,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletDot: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.electricBlue,
    marginRight: 6,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    flex: 1,
  },
  // Calculation box
  calculationBox: {
    backgroundColor: '#1E2B3D',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
  },
  calcTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  calcStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 2,
  },
  calcValue: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  // Page footer
  pageFooter: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  footerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  // Page 2 specific
  pageTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 12,
  },
});

interface FINDSectionEnhancedProps {
  score: number;
  benchmark: number;
  // Page 1 data
  situation: string;
  situationBullets: string[];
  impact: string;
  impactMetrics: {
    label: string;
    value: string;
  }[];
  solution: string;
  // Page 2 data - will use ThreePathImplementation
  technicalSEOTitle: string;
  technicalSEOSubtitle: string;
}

export const FINDSectionEnhanced: React.FC<FINDSectionEnhancedProps> = ({
  score,
  benchmark,
  situation,
  situationBullets,
  impact,
  impactMetrics,
  solution,
  technicalSEOTitle,
  technicalSEOSubtitle,
}) => {
  // Example implementation paths - would come from props in real version
  const implementationPaths = [
    {
      number: 1,
      title: 'DIY',
      difficulty: 'LOW' as const,
      cost: '€200',
      time: '4-6h',
      forWhom:
        'Tech-savvy founders. Full control, save €2k+ agency fees.',
      steps: [
        'Audit with Screaming Frog (€149/year) + Google Search Console',
        'Fix missing meta tags, duplicate content, broken links',
        'Add Schema.org structured data (use Google schema generator)',
        'Submit updated sitemap.xml to GSC',
      ],
      breakEven: 'Break-even w 2 tygodnie',
      roi: '€200 koszt vs €3,500/mc gain = 1,650% ROI',
    },
    {
      number: 2,
      title: 'Agency',
      difficulty: 'LOW' as const,
      cost: '€2,500-4,000',
      time: '2-3 tygodnie',
      forWhom:
        'Busy founders who want guaranteed results. Outsource technical work.',
      steps: [
        'Agency runs full technical audit (50+ checkpoints)',
        'You approve recommendations',
        'Agency implements fixes + creates content brief',
        'Monthly reporting + ongoing optimization',
      ],
      breakEven: 'Break-even in 3 months',
      roi: '€3,500 koszt vs €10,000/mc gain = 186% ROI (recurring)',
    },
    {
      number: 3,
      title: 'Hybrid',
      difficulty: 'MEDIUM' as const,
      cost: '€800-1,200',
      time: '1-2 tygodnie',
      forWhom:
        'Best of both worlds. Consultant provides blueprint, you execute with dev team.',
      steps: [
        'Consultant audits + creates detailed implementation checklist',
        'You brief your dev team (or freelancer)',
        'Consultant reviews changes before launch',
        '30-day post-launch monitoring + tweaks',
      ],
      breakEven: 'Break-even w 4 tygodnie',
      roi: '€1,000 koszt vs €3,500/mc gain = 250% ROI',
    },
  ];

  const codeSnippet = {
    title: '⚡ SKOPIUJ-WKLEJ W HTML',
    code: `<!-- Production-ready meta tags -->
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">

<!-- Schema.org markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yoursite.com"
}
</script>`,
  };

  const whyItWorks = {
    text: 'Google directly states, that **technical SEO is the foundation of ranking**. Badania Backlinko (2024) show that strony with proper Schema.org have **36% higher CTR in SERP**. Fixing technical issues = instant wins, because you are not competing with content, but fixing errors that Google **already penalizes**. Average implementation time: **2-4h per page**. Sources: Google Search Central, Backlinko 2024 SEO Study, Ahrefs.',
  };

  return (
    <>
      {/* PAGE 1: PYRAMID PRINCIPLE OVERVIEW */}
      <Page size="A4" style={styles.page}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{benchmark}
            </Text>
          </View>
        </View>

        {/* SYTUACJA */}
        <View style={styles.pyramidSection}>
          <Text style={styles.sectionLabel}>SYTUACJA</Text>
          <View style={styles.situationBox}>
            <Text style={styles.bodyText}>{situation}</Text>
            <View style={styles.bulletList}>
              {situationBullets.map((bullet, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bulletDot}>●</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* WPŁYW */}
        <View style={styles.pyramidSection}>
          <Text style={styles.sectionLabel}>WPŁYW</Text>
          <View style={styles.impactBox}>
            <Text style={styles.bodyText}>{impact}</Text>

            {/* Calculation */}
            <View style={styles.calculationBox}>
              <Text style={styles.calcTitle}>
                € JAK LICZYMY WPŁYW FINANSOWY
              </Text>
              {impactMetrics.map((metric, idx) => (
                <Text key={idx} style={styles.calcStep}>
                  <Text style={styles.calcValue}>{metric.label}:</Text>{' '}
                  {metric.value}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* ROZWIĄZANIE */}
        <View style={styles.pyramidSection}>
          <Text style={styles.sectionLabel}>ROZWIĄZANIE</Text>
          <View style={styles.solutionBox}>
            <Text style={styles.bodyText}>{solution}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit</Text>
          <Text style={styles.footerText}>Strona 5 z 18</Text>
        </View>
      </Page>

      {/* PAGE 2: TECHNICAL SEO WITH 3-PATH IMPLEMENTATION */}
      <Page size="A4" style={styles.page}>
        {/* Category Header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{benchmark}
            </Text>
          </View>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>{technicalSEOTitle}</Text>
        <Text style={styles.pageSubtitle}>{technicalSEOSubtitle}</Text>

        {/* Three-Path Implementation */}
        <ThreePathImplementation
          paths={implementationPaths}
          codeSnippet={codeSnippet}
          whyItWorks={whyItWorks}
        />

        {/* Footer */}
        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit</Text>
          <Text style={styles.footerText}>Strona 6 z 18</Text>
        </View>
      </Page>
    </>
  );
};

/**
 * FIND Section - 7 Pages MEGA BUSINESS VERSION
 * (Same as 6-page version but split Page 6 into two pages for better readability)
 *
 * Structure:
 * Page 1: Overview (Pyramid Principle)
 * Page 2: Technical SEO Deep Dive
 * Page 3: On-Page SEO
 * Page 4: Content Strategy
 * Page 5: Link Building
 * Page 6: Local SEO (full page)
 * Page 7: Complete Implementation Summary (business-oriented value summary)
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { ThreePathImplementation } from '../shared/ThreePathImplementation';

// Import all styles and types from FINDSection6Pages (same code)
import { FINDSection6Pages } from './FINDSection6Pages';

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
  codeBackground: '#0D0D1A',
  codeGreen: '#00FF00',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
  },
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
  pageTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  box: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  impactBox: {
    borderLeftColor: COLORS.orange,
  },
  solutionBox: {
    borderLeftColor: COLORS.neonGreen,
  },
  infoBox: {
    borderLeftColor: COLORS.electricBlue,
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
    marginLeft: 4,
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
    width: 8,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    width: '31%',
    backgroundColor: COLORS.darkGrey,
    padding: 8,
    borderRadius: 3,
    borderLeftWidth: 2,
  },
  statCardRed: {
    borderLeftColor: COLORS.red,
  },
  statCardOrange: {
    borderLeftColor: COLORS.orange,
  },
  statCardGreen: {
    borderLeftColor: COLORS.neonGreen,
  },
  statLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    marginBottom: 3,
  },
  statValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  calculationBox: {
    backgroundColor: '#1E2B3D',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 10,
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
  timelineBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  timelineTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 6,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neonGreen,
    marginRight: 8,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineWeek: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: 2,
  },
  timelineAction: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.4,
  },
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
  // Summary page specific styles
  summaryCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  summaryCardGreen: {
    borderLeftColor: COLORS.neonGreen,
  },
  summaryCardOrange: {
    borderLeftColor: COLORS.orange,
  },
  summaryCardBlue: {
    borderLeftColor: COLORS.electricBlue,
  },
  summaryTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 6,
  },
  summaryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricBox: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    marginBottom: 2,
  },
  metricValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
  },
  ctaBox: {
    backgroundColor: COLORS.vividPurple,
    padding: 14,
    borderRadius: 4,
    marginTop: 10,
  },
  ctaTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  ctaText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.white,
    lineHeight: 1.5,
  },
});

interface FINDSection7PagesProps {
  score: number;
  benchmark: number;
  // All same props as 6-page version
  situationText: string;
  situationBullets: string[];
  impactText: string;
  impactCalculation: {
    label: string;
    value: string;
  }[];
  solutionText: string;
  technicalStats: {
    missingMeta: number;
    duplicateContent: number;
    brokenLinks: number;
    sitemapAge: string;
  };
  onPageIssues: {
    h1Missing: number;
    thinContent: number;
    noAltText: number;
  };
  keywordGaps: {
    keyword: string;
    volume: number;
    difficulty: number;
    priority: 'HIGH' | 'MEDIUM';
  }[];
  backlinks: {
    current: number;
    competitor1: number;
    competitor2: number;
    competitor3: number;
  };
  localPresence: {
    gmb: boolean;
    citations: number;
    reviews: number;
  };
}

export const FINDSection7Pages: React.FC<FINDSection7PagesProps> = (props) => {
  const {
    score,
    benchmark,
    localPresence,
  } = props;

  return (
    <>
      {/* Pages 1-5: Use existing FINDSection6Pages component */}
      <FINDSection6Pages {...props} />

      {/* ==================== PAGE 6: LOCAL SEO (Full Page - Expanded) ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Local SEO: Dominating "Near Me" Searches</Text>
        <Text style={styles.pageSubtitle}>
          If you serve local customers (60%+ from one city/region), local SEO is the fastest
          way to increase traffic. Google My Business + local citations = appearing in Map Pack
          (top 3 results with map). 76% of local searches result in a visit within 24h. Here's the complete plan.
        </Text>

        {/* Local SEO Current State */}
        <Text style={styles.sectionLabel}>[*] CURRENT STATE LOCAL SEO</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, localPresence.gmb ? styles.statCardGreen : styles.statCardRed]}>
            <Text style={styles.statLabel}>Google My Business</Text>
            <Text style={styles.statValue}>{localPresence.gmb ? 'Setup [OK]' : 'Missing [X]'}</Text>
          </View>
          <View style={[styles.statCard, localPresence.citations > 20 ? styles.statCardGreen : styles.statCardOrange]}>
            <Text style={styles.statLabel}>Local Citations</Text>
            <Text style={styles.statValue}>{localPresence.citations}/50 target</Text>
          </View>
          <View style={[styles.statCard, localPresence.reviews > 15 ? styles.statCardGreen : styles.statCardRed]}>
            <Text style={styles.statLabel}>Google Reviews</Text>
            <Text style={styles.statValue}>{localPresence.reviews} (min 50)</Text>
          </View>
        </View>

        {/* Why Local SEO Matters - Deep Dive */}
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Wzrost "Near me" searches: </Text>
            900% increase (2015-2024). 46% wszystkich Google searches ma local intent.
            <Text style={styles.highlightText}> 76% local searches</Text> kończy się wizytą w sklepie/firmie
            w ciągu 24h, <Text style={styles.highlightText}>28% w ciągu godziny</Text> (Google data 2024).
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Map Pack = 44% all clicks: </Text>
            Local Pack (top 3 wyniki z mapą na Google) dostaje 44% wszystkich clicks w local searches.
            Organic results (#1-10) dzielą pozostałe 56%. Jeśli nie jesteś w Map Pack,
            <Text style={styles.highlightText}> you lose majority potential customers</Text>.
          </Text>
        </View>

        {/* GMB Optimization Deep Dive */}
        <Text style={styles.sectionLabel}>[*] GOOGLE MY BUSINESS OPTIMIZATION</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Complete profile checklist (10 kroków): </Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>NAP consistency:</Text> Name, Address, Phone IDENTYCZNE na wszystkich platformach
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Categories:</Text> Primary (najbardziej specific) + secondary (max 10 total)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Hours:</Text> Aktualne godziny otwarcia + special hours (święta, events)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Photos:</Text> Minimum 10 high-quality (exterior, interior, products). Update co miesiąc.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Posts:</Text> Weekly GMB posts (offers, events, updates) - boosts visibility
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Q&A:</Text> Add 10+ frequently asked questions (with answers). Pre-empt customer questions.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Services:</Text> List wszystkie usługi z pricing (if applicable)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Description:</Text> 750 chars optimized for keywords + value prop
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Reviews:</Text> Target 50+ reviews, 4.0+ star avg. Respond to ALL (positive + negative).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Messaging:</Text> Enable GMB messaging (instant communication z klientami)
              </Text>
            </View>
          </View>
        </View>

        {/* Local Citations Strategy */}
        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Local Citations (target: 50): </Text>
            NAP listings w local directories (Yelp, Facebook, Foursquare, branżowe katalogi).
            Google uses consistency jako ranking signal. Więcej consistent citations = wyższy local ranking.
          </Text>
        </View>

        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Core citations (15):</Text> Yelp, Facebook, Apple Maps, Bing Places, Foursquare
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Industry directories (20):</Text> Branżowe katalogi (np. for SaaS: G2, Capterra, GetApp)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Local directories (15):</Text> Lokalne business directories (np. Warsaw Business Directory)
            </Text>
          </View>
        </View>

        {/* Reviews Strategy */}
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Review acquisition strategy: </Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Email automation:</Text> 7 days po zakupie/service, send review request (template w CRM)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>QR codes:</Text> W sklepie/biurze, QR link bezpośrednio do GMB review
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Incentives (legal):</Text> Nie płać za reviews, ale offer small gift za feedback (np. discount code)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Response strategy:</Text> Respond w 24h (positive: thank you, negative: apologize + resolve)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section</Text>
          <Text style={styles.footerText}>Page 10 of 11</Text>
        </View>
      </Page>

      {/* ==================== PAGE 7: COMPLETE IMPLEMENTATION SUMMARY ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Complete Implementation Summary & Business Value</Text>
        <Text style={styles.pageSubtitle}>
          This page is the executive summary of the entire FIND section - wszystkie taktyki, koszty, timeline i expected ROI
          w jednym miejscu. Use this as decision-making tool for wyboru ścieżki wdrożenia.
        </Text>

        {/* Investment Summary Cards */}
        <Text style={styles.sectionLabel}>[EUR] TOTAL INVESTMENT & ROI (90 Days)</Text>

        <View style={[styles.summaryCard, styles.summaryCardGreen]}>
          <Text style={styles.summaryTitle}>1. DIY Path - Maximum ROI, Lowest Cost</Text>
          <View style={styles.summaryMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Total Cost</Text>
              <Text style={styles.metricValue}>€1,500</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Time Investment</Text>
              <Text style={styles.metricValue}>50-60h</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Break-even</Text>
              <Text style={styles.metricValue}>2-3 months</Text>
            </View>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Revenue after 90 days:</Text> €5,000-7,000/mo (conservative)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Year 1 ROI:</Text> 400%+ (€1,500 → €60k-84k annual revenue)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Best for:</Text> Tech-savvy founders, startups, bootstrapped companies
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.summaryCard, styles.summaryCardBlue]}>
          <Text style={styles.summaryTitle}>2. Hybrid Path - Best Value (Recommended)</Text>
          <View style={styles.summaryMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Total Cost</Text>
              <Text style={styles.metricValue}>€5-7k</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Time Investment</Text>
              <Text style={styles.metricValue}>20-30h</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Break-even</Text>
              <Text style={styles.metricValue}>4-6 months</Text>
            </View>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Revenue after 4 months:</Text> €6,000-9,000/mo
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Year 1 ROI:</Text> 150-200% (€6k → €72k-108k annual revenue)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Best for:</Text> Companies z in-house team, need strategy + quality control
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.summaryCard, styles.summaryCardOrange]}>
          <Text style={styles.summaryTitle}>3. Agency Path - Hands-Off, Guaranteed Results</Text>
          <View style={styles.summaryMetrics}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Total Cost</Text>
              <Text style={styles.metricValue}>€10-15k</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Time Investment</Text>
              <Text style={styles.metricValue}>5-10h</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Break-even</Text>
              <Text style={styles.metricValue}>8-12 months</Text>
            </View>
          </View>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Revenue after 6 months:</Text> €8,000-12,000/mo (recurring)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Year 1 ROI:</Text> 80-120% (€12k → €96k-144k annual revenue)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Best for:</Text> Busy founders, enterprise, companies bez in-house SEO expertise
              </Text>
            </View>
          </View>
        </View>

        {/* 90-Day Phased Rollout Summary */}
        <Text style={styles.sectionLabel}>[ROADMAP] 90-DAY PHASED ROLLOUT (ALL TACTICS)</Text>
        <View style={styles.timelineBox}>
          <Text style={styles.timelineTitle}>Complete Timeline - From Zero to Hero</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 1-2: Technical SEO Foundations</Text>
              <Text style={styles.timelineAction}>
                Fix meta tags (87 stron), canonical tags (12 duplicate), broken links (15), sitemap update.
                Setup/optimize Google My Business. Time: 6-8h DIY | Cost: €200-300
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 3-4: On-Page Optimization</Text>
              <Text style={styles.timelineAction}>
                Fix H1 tags (34 stron), rewrite thin content (28 stron), add ALT text (142 images).
                Create internal linking structure. Time: 8-10h DIY | Cost: €300-500
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 5-8: Content Creation Blitz</Text>
              <Text style={styles.timelineAction}>
                Create 5-8 blog posts targeting keyword gaps (start with quick wins: difficulty &lt;40).
                Build topic clusters with internal links. Time: 20-25h DIY | Cost: €500-800
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 9-12: Link Building & Local SEO</Text>
              <Text style={styles.timelineAction}>
                Guest posting outreach (target 5-8 posts), broken link building, resource pages.
                Build local citations (50 total), review acquisition campaign. Time: 15-20h DIY | Cost: €500-700
              </Text>
            </View>
          </View>
        </View>

        {/* Business Value Summary */}
        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[*] EXPECTED BUSINESS RESULTS (6-Month Projection)</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Organic Traffic:</Text> +200-300% increase (from ~1,200 to ~3,600-4,800 visits/mo)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Keyword Rankings:</Text> 15-25 keywords w top 10 (from 3-5 currently)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Backlinks:</Text> +30-50 high-quality backlinks (DA 40+)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Local Pack:</Text> Pojawienie w Map Pack for 5-10 "near me" keywords
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Lead Generation:</Text> +40-60 qualified leads/mo (from organic)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Revenue Impact:</Text> €6,000-12,000/mo recurring (zależnie od ścieżki)
          </Text>
        </View>

        {/* Final CTA */}
        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>[^] Recommended Next Steps</Text>
          <Text style={styles.ctaText}>
            <Text style={styles.boldText}>1. Week 1 Priority:</Text> Technical SEO fixes (highest impact, lowest effort).
            Start z meta descriptions + Schema.org (4-6h work = €3,500/mo revenue uplift).{'\n\n'}

            <Text style={styles.boldText}>2. Path Selection:</Text> Zalecamy HYBRID path for najlepszego value.
            Outsource link building + content strategy do specjalistów, resztę in-house z content team.{'\n\n'}

            <Text style={styles.boldText}>3. Quick Wins First:</Text> Target keyword gaps z difficulty &lt;40 (Week 5-8).
            Fast rankings = early momentum = stakeholder buy-in for long-term investment.{'\n\n'}

            <Text style={styles.boldText}>Expected Timeline to Results:</Text> First rankings improvements w 4-6 tygodni
            (technical SEO). Significant traffic growth w 3-4 miesiące (content + links). Full ROI w 6-12 miesięcy.
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section | End of Section</Text>
          <Text style={styles.footerText}>Page 11 of 11</Text>
        </View>
      </Page>
    </>
  );
};

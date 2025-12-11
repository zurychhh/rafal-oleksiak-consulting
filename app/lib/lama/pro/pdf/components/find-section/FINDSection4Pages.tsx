/**
 * FIND Section - 4 Pages (POC Version)
 * Full version will be 6 pages
 *
 * Structure:
 * - Page 1: Overview (Pyramid Principle: SYTUACJA → WPŁYW → ROZWIĄZANIE)
 * - Page 2: Technical SEO + On-Page
 * - Page 3: Content Strategy
 * - Page 4: Link Building + Local SEO
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import type { FINDSectionProps, SEOIssue, KeywordOpportunity, ContentGap, LinkOpportunity } from './types';

// Reuse colors from CRM section
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
};

// Simplified styles for FIND section (can be extracted to separate file later)
const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
  },
  pageHeader: {
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    paddingVertical: 3,
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
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  problemBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.red,
    marginBottom: 10,
  },
  solutionBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonGreen,
    marginBottom: 10,
  },
  calculationBox: {
    backgroundColor: '#1E1E2E',
    padding: 10,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.electricBlue,
    marginBottom: 10,
  },
  bodyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  bodyTextSmall: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    marginBottom: 3,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  highlightText: {
    color: COLORS.electricBlue,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.red,
    fontWeight: 'bold',
  },
  successText: {
    color: COLORS.neonGreen,
    fontWeight: 'bold',
  },
  bulletList: {
    marginLeft: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletDot: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.electricBlue,
    marginRight: 5,
    marginTop: 1,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.lightGrey,
    lineHeight: 1.5,
    flex: 1,
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
  calcSource: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 6,
    color: '#9CA3AF',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#3D3D5A',
  },
  roiBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    backgroundColor: COLORS.neonGreen,
    color: COLORS.moonlitGrey,
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  issueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  priorityBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 7,
    fontWeight: 'bold',
  },
  criticalBadge: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  highBadge: {
    backgroundColor: COLORS.orange,
    color: COLORS.white,
  },
  mediumBadge: {
    backgroundColor: COLORS.yellow,
    color: COLORS.moonlitGrey,
  },
  lowBadge: {
    backgroundColor: COLORS.darkGrey,
    color: COLORS.lightGrey,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  footerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.darkGrey,
    marginVertical: 6,
  },
});

// Helper components
const PageHeader: React.FC<{
  categoryName: string;
  score: number;
  benchmark: number;
  title: string;
  subtitle: string;
  pageNumber: string;
}> = ({ categoryName, score, benchmark, title, subtitle, pageNumber }) => (
  <View style={styles.pageHeader}>
    <View style={styles.categoryBadge}>
      <Text style={styles.categoryName}>{categoryName}</Text>
      <View style={styles.scoreBadge}>
        <Text style={styles.scoreText}>
          {score}/{benchmark}
        </Text>
      </View>
    </View>
    <Text style={styles.pageTitle}>{title}</Text>
    <Text style={styles.pageSubtitle}>{subtitle}</Text>
  </View>
);

const PageFooter: React.FC<{ pageNum: string }> = ({ pageNum }) => (
  <View style={styles.pageFooter}>
    <Text style={styles.footerText}>LAMA PRO V6 - SEO Audit</Text>
    <Text style={styles.footerText}>FIND Page {pageNum} z 4</Text>
  </View>
);

const SectionTitle: React.FC<{ emoji?: string; title: string }> = ({ emoji, title }) => (
  <Text style={styles.sectionTitle}>
    {emoji && `${emoji} `}
    {title}
  </Text>
);

const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={styles.bulletList}>
    {items.map((item, idx) => (
      <View key={idx} style={styles.bulletItem}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

const PriorityBadge: React.FC<{ priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }> = ({ priority }) => {
  const badgeStyle = [
    styles.priorityBadge,
    priority === 'CRITICAL' && styles.criticalBadge,
    priority === 'HIGH' && styles.highBadge,
    priority === 'MEDIUM' && styles.mediumBadge,
    priority === 'LOW' && styles.lowBadge,
  ];

  return <Text style={badgeStyle}>{priority}</Text>;
};

export const FINDSection4Pages: React.FC<FINDSectionProps> = (props) => {
  const { categoryName, score, industryBenchmark, overview, technicalSEO, contentStrategy, linkBuilding } = props;

  return (
    <>
      {/* ===================== PAGE 1: SEO OVERVIEW ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          score={score}
          benchmark={industryBenchmark}
          title="SEO Strategy Overview"
          subtitle="Analysis of current Google visibility and plan to increase organic traffic"
          pageNumber="1"
        />

        {/* SYTUACJA */}
        <View style={styles.section}>
          <SectionTitle emoji="▉" title="OBECNA SYTUACJA" />
          <View style={styles.problemBox}>
            <Text style={styles.bodyText}>{overview.currentSituation}</Text>
          </View>
        </View>

        {/* WPŁYW */}
        <View style={styles.section}>
          <SectionTitle emoji="💸" title="MAIN PROBLEMS" />
          <View style={styles.problemBox}>
            <BulletList items={overview.mainProblems} />
          </View>
        </View>

        {/* ROZWIĄZANIE + ROI */}
        <View style={styles.section}>
          <SectionTitle emoji="◉" title="OPPORTUNITY SIZE" />
          <View style={styles.calculationBox}>
            {overview.opportunitySize.calculationSteps.map((step, idx) => (
              <Text key={idx} style={styles.calcStep}>
                <Text style={styles.calcValue}>{step.step}. </Text>
                {step.description}
                {step.value && <Text style={styles.calcValue}> → {step.value}</Text>}
              </Text>
            ))}
            <Text style={styles.calcSource}>
              <Text style={styles.boldText}>Source: </Text>
              {overview.opportunitySize.source}
            </Text>
          </View>

          <View style={styles.solutionBox}>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Additional traffic per month: </Text>
              <Text style={styles.successText}>
                +{overview.opportunitySize.additionalTrafficPerMonth.toLocaleString()} visitors
              </Text>
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Additional revenue per year: </Text>
              <Text style={styles.successText}>€{overview.opportunitySize.additionalRevenuePerYear.toLocaleString()}</Text>
            </Text>
          </View>
        </View>

        <PageFooter pageNum="1" />
      </Page>

      {/* ===================== PAGE 2: TECHNICAL + ON-PAGE SEO ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          score={score}
          benchmark={industryBenchmark}
          title="Technical SEO + On-Page Optimization"
          subtitle="Critical issues blocking Google crawling/indexing + on-page improvements"
          pageNumber="2"
        />

        {/* Critical Technical Issues */}
        <View style={styles.section}>
          <SectionTitle emoji="🔴" title="CRITICAL TECHNICAL ISSUES" />
          {technicalSEO.criticalIssues.map((issue, idx) => (
            <View key={idx} style={styles.issueRow}>
              <View style={styles.flex1}>
                <Text style={[styles.bodyText, { marginBottom: 2 }]}>
                  <Text style={styles.boldText}>{issue.issue}</Text>
                </Text>
                <Text style={styles.bodyTextSmall}>{issue.impact}</Text>
                <Text style={[styles.bodyTextSmall, { marginTop: 2 }]}>Effort: {issue.effort}</Text>
              </View>
              <PriorityBadge priority={issue.priority} />
            </View>
          ))}
        </View>

        {/* On-Page Issues */}
        <View style={styles.section}>
          <SectionTitle emoji="📄" title="ON-PAGE OPTIMIZATION ISSUES" />
          {technicalSEO.onPageIssues.map((issue, idx) => (
            <View key={idx} style={styles.issueRow}>
              <View style={styles.flex1}>
                <Text style={[styles.bodyText, { marginBottom: 2 }]}>
                  <Text style={styles.boldText}>{issue.issue}</Text>
                </Text>
                <Text style={styles.bodyTextSmall}>{issue.impact}</Text>
                <Text style={[styles.bodyTextSmall, { marginTop: 2 }]}>Effort: {issue.effort}</Text>
              </View>
              <PriorityBadge priority={issue.priority} />
            </View>
          ))}
        </View>

        {/* Quick Wins */}
        <View style={styles.section}>
          <SectionTitle emoji="⚡" title="QUICK WINS (WEEK 1)" />
          <View style={styles.solutionBox}>
            <BulletList items={technicalSEO.quickWins} />
          </View>
          <Text style={styles.roiBadge}>ROI: {technicalSEO.roi}</Text>
        </View>

        <PageFooter pageNum="2" />
      </Page>

      {/* ===================== PAGE 3: CONTENT STRATEGY ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          score={score}
          benchmark={industryBenchmark}
          title="Content Strategy & Keyword Opportunities"
          subtitle="High-value keywords to target + content gaps to fill"
          pageNumber="3"
        />

        {/* Current State */}
        <View style={styles.section}>
          <SectionTitle emoji="📝" title="CURRENT CONTENT STATE" />
          <View style={styles.problemBox}>
            <Text style={styles.bodyText}>{contentStrategy.currentState}</Text>
          </View>
        </View>

        {/* Keyword Opportunities */}
        <View style={styles.section}>
          <SectionTitle emoji="◉" title="KEYWORD OPPORTUNITIES (TOP 5)" />
          {contentStrategy.keywordOpportunities.slice(0, 5).map((kw, idx) => (
            <View key={idx} style={[styles.issueRow, { marginBottom: 4 }]}>
              <View style={styles.flex1}>
                <Text style={[styles.bodyText, { marginBottom: 1 }]}>
                  <Text style={styles.boldText}>{kw.keyword}</Text>
                </Text>
                <View style={[styles.row, { gap: 8 }]}>
                  <Text style={styles.bodyTextSmall}>
                    Current: {typeof kw.currentPosition === 'number' ? `#${kw.currentPosition}` : kw.currentPosition}
                  </Text>
                  <Text style={styles.bodyTextSmall}>Target: #{kw.targetPosition}</Text>
                  <Text style={styles.bodyTextSmall}>{kw.monthlySearches.toLocaleString()} searches/mo</Text>
                </View>
                <Text style={[styles.bodyTextSmall, { marginTop: 1, color: COLORS.neonGreen }]}>
                  Est. traffic: {kw.estimatedTraffic}
                </Text>
              </View>
              <Text
                style={[
                  styles.priorityBadge,
                  kw.difficulty === 'Low' && styles.lowBadge,
                  kw.difficulty === 'Medium' && styles.mediumBadge,
                  kw.difficulty === 'High' && styles.highBadge,
                ]}
              >
                {kw.difficulty}
              </Text>
            </View>
          ))}
        </View>

        {/* Content Gaps */}
        <View style={styles.section}>
          <SectionTitle emoji="📋" title="CONTENT GAPS TO FILL" />
          {contentStrategy.contentGaps.slice(0, 4).map((gap, idx) => (
            <View key={idx} style={styles.issueRow}>
              <View style={styles.flex1}>
                <Text style={[styles.bodyText, { marginBottom: 2 }]}>
                  <Text style={styles.boldText}>{gap.topic}</Text>
                </Text>
                <Text style={styles.bodyTextSmall}>Intent: {gap.searchIntent}</Text>
                <Text style={styles.bodyTextSmall}>{gap.opportunity}</Text>
              </View>
              <PriorityBadge priority={gap.priority} />
            </View>
          ))}
        </View>

        {/* ROI */}
        <View style={styles.section}>
          <Text style={styles.roiBadge}>ROI: {contentStrategy.roi}</Text>
        </View>

        <PageFooter pageNum="3" />
      </Page>

      {/* ===================== PAGE 4: LINK BUILDING + LOCAL SEO ===================== */}
      <Page size="A4" style={styles.page}>
        <PageHeader
          categoryName={categoryName}
          score={score}
          benchmark={industryBenchmark}
          title="Link Building & Local SEO"
          subtitle="Backlink strategy + local visibility optimization"
          pageNumber="4"
        />

        {/* Backlink Gap */}
        <View style={styles.section}>
          <SectionTitle emoji="🔗" title="BACKLINK ANALYSIS" />
          <View style={[styles.row, { gap: 10, marginBottom: 10 }]}>
            <View style={[styles.problemBox, styles.flex1]}>
              <Text style={styles.bodyText}>
                <Text style={styles.boldText}>Current backlinks: </Text>
                <Text style={styles.errorText}>{linkBuilding.currentBacklinks}</Text>
              </Text>
            </View>
            <View style={[styles.solutionBox, styles.flex1]}>
              <Text style={styles.bodyText}>
                <Text style={styles.boldText}>Target backlinks: </Text>
                <Text style={styles.successText}>{linkBuilding.targetBacklinks}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Link Opportunities */}
        <View style={styles.section}>
          <SectionTitle emoji="◉" title="LINK BUILDING OPPORTUNITIES" />
          {linkBuilding.linkOpportunities.map((opp, idx) => (
            <View key={idx} style={[styles.issueRow, { marginBottom: 4 }]}>
              <View style={styles.flex1}>
                <Text style={[styles.bodyText, { marginBottom: 2 }]}>
                  <Text style={styles.boldText}>{opp.type}</Text>
                </Text>
                <Text style={styles.bodyTextSmall}>Source: {opp.source}</Text>
                <Text style={styles.bodyTextSmall}>{opp.notes}</Text>
                <View style={[styles.row, { gap: 8, marginTop: 2 }]}>
                  <Text style={styles.bodyTextSmall}>Effort: {opp.effort}</Text>
                  <Text style={styles.bodyTextSmall}>Impact: {opp.impact}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Local SEO (if applicable) */}
        {linkBuilding.localSEO && (
          <View style={styles.section}>
            <SectionTitle emoji="📍" title="LOCAL SEO" />
            <View style={styles.problemBox}>
              <Text style={styles.bodyText}>
                <Text style={styles.boldText}>Google My Business: </Text>
                {linkBuilding.localSEO.gmb}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.bodyText}>
                <Text style={styles.boldText}>Citations: </Text>
                {linkBuilding.localSEO.citations}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.bodyText}>
                <Text style={styles.boldText}>Reviews: </Text>
                {linkBuilding.localSEO.reviews}
              </Text>
            </View>
          </View>
        )}

        {/* ROI */}
        <View style={styles.section}>
          <Text style={styles.roiBadge}>ROI: {linkBuilding.roi}</Text>
        </View>

        <PageFooter pageNum="4" />
      </Page>
    </>
  );
};

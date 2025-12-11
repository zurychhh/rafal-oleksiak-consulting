import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';

// DARK THEME COLORS (consistent with FIND section)
const COLORS = {
  moonlitGrey: '#1A1A2E',
  darkGrey: '#2A2A3E',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  mediumGrey: '#9E9E9E',
  vividPurple: '#7B2CBF',
  lightPurple: '#9D4EDD',
  electricBlue: '#00BFFF',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
  red: '#EF4444',
  codeBackground: '#0D0D1A',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    backgroundColor: COLORS.moonlitGrey,
    color: COLORS.white,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.vividPurple,
  },
  headerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
  },
  headerClient: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.mediumGrey,
  },
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 16,
    color: COLORS.lightGrey,
    marginBottom: 24,
    textAlign: 'center',
  },
  pageTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginTop: 12,
    marginBottom: 8,
  },
  box: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
  },
  situationBox: {
    backgroundColor: COLORS.darkGrey,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.mediumGrey,
  },
  impactBox: {
    backgroundColor: COLORS.darkGrey,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.lightPurple,
  },
  solutionBox: {
    backgroundColor: COLORS.darkGrey,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.electricBlue,
  },
  highlightBox: {
    backgroundColor: COLORS.vividPurple,
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  highlightTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  bodyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    lineHeight: 1.6,
    color: COLORS.lightGrey,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  bulletList: {
    marginTop: 8,
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginRight: 8,
    width: 15,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 11,
    lineHeight: 1.5,
    color: COLORS.lightGrey,
    flex: 1,
  },
  table: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.darkGrey,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.darkGrey,
  },
  tableHeader: {
    backgroundColor: COLORS.vividPurple,
    padding: 8,
  },
  tableHeaderText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  tableCell: {
    padding: 8,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: COLORS.darkGrey,
  },
  tableCellText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
  },
  pageFooter: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGrey,
  },
  footerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.mediumGrey,
  },
});

export default function SUMMARYSection4Pages() {
  return (
    <>
      {/* Page 56: 180-Day Complete Roadmap */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.sectionTitle}>EXECUTIVE SUMMARY</Text>
        <Text style={styles.sectionSubtitle}>180-Day LAMA Transformation Roadmap</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[TIMELINE] COMPLETE 180-DAY IMPLEMENTATION TIMELINE</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>MONTH 1-2: Foundation (Quick Wins)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>LISTEN:</Text> Fix GA4 tracking + Consent Mode v2 + heatmaps (€200, 12h) → €15-25k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>FIND:</Text> Technical SEO fixes + Google Search Console setup (€0-300, 10h) → €20-40k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ENGAGE:</Text> CRM setup + basic lead scoring (€500, 15h) → €30-60k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ACQUIRE:</Text> Fix conversion tracking + Smart Bidding (€200, 10h) → €10-20k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>MONETIZE:</Text> Checkout optimization + cart abandonment emails (€300, 8h) → €30-60k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>AUTOMATE:</Text> Email platform setup + welcome series (€100, 8h) → €15-30k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Month 1-2:</Text> €1,300 investment, 63h setup → €120-235k/year impact
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>MONTH 3-4: Optimization & Scaling</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>LISTEN:</Text> BigQuery data warehouse + Looker dashboards (€800, 18h) → €25-45k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>FIND:</Text> Content strategy + link building campaign (€1,000, 25h) → €40-80k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ENGAGE:</Text> Advanced workflows + pipeline automation (€1,500, 20h) → €50-100k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ACQUIRE:</Text> Dynamic retargeting + budget optimization (€600, 12h) → €30-70k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>MONETIZE:</Text> Upsells + pricing optimization + CLV analysis (€800, 15h) → €60-120k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>AUTOMATE:</Text> Behavioral triggers + customer journeys (€400, 14h) → €30-60k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Month 3-4:</Text> €5,100 investment, 104h → €235-475k/year impact (cumulative)
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>MONTH 5-6: Advanced Tactics & Full Automation</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>LISTEN:</Text> Predictive analytics + attribution modeling (€1,500, 22h) → €40-80k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>FIND:</Text> Programmatic SEO + advanced link building (€2,000, 30h) → €60-120k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ENGAGE:</Text> AI lead scoring + sales enablement (€2,500, 25h) → €80-150k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ACQUIRE:</Text> Multi-channel orchestration + landing page testing (€1,200, 18h) → €50-100k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>MONETIZE:</Text> Churn prevention + loyalty programs (€1,500, 20h) → €80-160k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>AUTOMATE:</Text> Full-stack automation + reporting (€1,000, 18h) → €50-100k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Month 5-6:</Text> €9,700 investment, 133h → €360-710k/year impact (cumulative)
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] KEY DEPENDENCIES & SEQUENCING:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Start with LISTEN:</Text> Fix tracking first (can't optimize what you can't measure)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Parallel tracks:</Text> FIND + ACQUIRE can run simultaneously (different teams/vendors)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>MONETIZE requires LISTEN data:</Text> Need 30 days of clean tracking before optimizing checkout
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>AUTOMATE builds on ENGAGE:</Text> Set up CRM before automating workflows
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - SUMMARY</Text>
          <Text style={styles.footerText}>Page 56 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 57: Total Investment Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Total Investment Summary - 3 Paths Compared</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>€ COMPLETE LAMA IMPLEMENTATION - DIY PATH</Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost (6 months):</Text> €8,000-15,000
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[T]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time Investment:</Text> 250-400 hours (10-15h/week avg)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[$]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact (Year 1):</Text> €360-710k
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 2,400-8,875%
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Break-Even:</Text> 2-4 weeks
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[U]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Best For:</Text> Startups, small businesses (under €500k revenue), tech-savvy teams
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Breakdown by LAMA Step:</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>LISTEN: €2,500 / 52h → €80-150k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>FIND: €3,300 / 65h → €120-240k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>ENGAGE: €4,500 / 60h → €160-310k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>ACQUIRE: €2,000 / 50h → €90-170k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>MONETIZE: €2,600 / 60h → €160-330k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>AUTOMATE: €1,500 / 55h → €120-220k/year (+ 30h/week saved)</Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>€ COMPLETE LAMA IMPLEMENTATION - HYBRID PATH</Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost (6 months):</Text> €25,000-50,000
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[T]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time Investment:</Text> 80-140 hours (management/review only)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[$]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact (Year 1):</Text> €600-1,200k
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 1,200-4,700%
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Break-Even:</Text> 1-2 months
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[U]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Best For:</Text> Mid-size businesses (€500k-3M revenue), growing teams
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>€ COMPLETE LAMA IMPLEMENTATION - AGENCY PATH</Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost (6 months):</Text> €70,000-150,000
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[T]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time Investment:</Text> 50-80 hours (strategy/approvals only)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[$]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact (Year 1):</Text> €1,000-2,000k
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 667-2,757%
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Break-Even:</Text> 2-4 months
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[U]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Best For:</Text> Enterprise (€3M+ revenue), complex multi-channel needs
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>◉ RECOMMENDED HYBRID APPROACH (BEST ROI):</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                Month 1-2: DIY quick wins (€1,300, 63h) → €120-235k/year
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                Month 3-4: Hire freelancers for specialized work (€8-15k) → €235-475k/year cumulative
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                Month 5-6: Agency for advanced tactics if scaling (€20-40k) → €360-710k/year cumulative
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Total Investment:</Text> €29-56k | <Text style={styles.boldText}>Total Impact:</Text> €360-710k/year | <Text style={styles.boldText}>ROI:</Text> 643-2,448%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - SUMMARY</Text>
          <Text style={styles.footerText}>Page 57 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 58: Expected Cumulative Results */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Expected Results - Revenue Projections by Quarter</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[UP] REVENUE IMPACT TIMELINE (HYBRID PATH)</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Q1 (Months 1-3): Foundation Phase</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €60-120k (€20-40k/month by end of Q1)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Key Wins:</Text> Tracking fixed, checkout optimized, cart abandonment emails live, basic SEO improvements
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[C]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Investment:</Text> €6,400 spent | <Text style={styles.boldText}>ROI:</Text> 938-1,875% (break-even in 2-4 weeks)
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Q2 (Months 4-6): Optimization Phase</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €150-300k (€50-100k/month by end of Q2)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Key Wins:</Text> Content ranking, paid ads optimized, upsells live, CRM workflows automated, behavioral emails converting
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[C]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Investment:</Text> €25k cumulative | <Text style={styles.boldText}>ROI:</Text> 600-1,200%
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Q3 (Months 7-9): Scaling Phase</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €300-600k (€100-200k/month by end of Q3)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Key Wins:</Text> SEO compounding, retargeting at scale, CLV segmentation driving retention, full automation stack live
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[C]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Investment:</Text> €35k cumulative | <Text style={styles.boldText}>ROI:</Text> 857-1,714%
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Q4 (Months 10-12): Maturity Phase</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €600-1,200k annualized (€150-300k/month by end of Q4)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Key Wins:</Text> All 6 LAMA steps fully optimized, predictable revenue machine, marketing team 3x more productive
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[C]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Investment:</Text> €50k cumulative | <Text style={styles.boldText}>ROI:</Text> 1,200-2,400%
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] YEAR 2+ PROJECTIONS (COMPOUNDING EFFECTS):</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>SEO Compounding:</Text> Organic traffic grows 20-40%/year (content library compounds)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>CRM Data Richness:</Text> Better segmentation → 30-50% higher email ROI in Year 2
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Customer Retention:</Text> Churn reduced by 30-50% → LTV increases 50-100%
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Brand Authority:</Text> Backlinks + content → trust → 15-25% higher conversion rates
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Predictable Revenue:</Text> 70-80% of revenue from recurring channels (SEO, email, retention) vs paid ads
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>€</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Year 2 Impact:</Text> €900k-1,800k (50% growth from Year 1 baseline) with minimal incremental investment
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[!] RISK FACTORS & ASSUMPTIONS:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Projections assume current traffic/customer base as baseline (if growing, multiply impact)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                SEO results depend on industry competition (lower competition = faster results)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Paid ads ROI depends on product margins (higher margins = can afford higher CAC)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Email automation impact depends on list size (need 1,000+ subscribers for meaningful results)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                All figures are conservative estimates based on industry benchmarks (actual results may vary ±30%)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - SUMMARY</Text>
          <Text style={styles.footerText}>Page 58 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 59: Prioritization Matrix & Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Prioritization Matrix & Recommended Next Steps</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] QUICK WINS (HIGH IMPACT, LOW EFFORT) - START HERE</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>1</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Fix GA4 Conversion Tracking</Text> (LISTEN, Page 25) - 4h, €0 → €15-25k/year | Enable Smart Bidding
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>2</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Reduce Checkout Form Fields</Text> (MONETIZE, Page 41) - 2h, €0 → €30-60k/year | 25% conversion lift
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>3</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Cart Abandonment Emails</Text> (MONETIZE, Page 45) - 3h, €0-20/mo → €40-80k/year | 15-20% recovery
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>4</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Google Search Console Setup</Text> (FIND, Page 9) - 2h, €0 → €10-20k/year | Identify quick SEO wins
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>5</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Heatmap Installation</Text> (LISTEN, Page 28) - 1h, €0 → €10-18k/year | Identify UX friction points
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Quick Wins:</Text> 12h setup, €0-20 cost → €105-203k/year impact (Week 1-2 execution)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[!] HIGH IMPACT (MEDIUM EFFORT) - MONTH 1-2</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>6</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Meta Conversions API</Text> (ACQUIRE, Page 34) - 8h, €0-300 → €10-20k/year | 13% CPA improvement
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>7</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>CRM Basic Setup</Text> (ENGAGE, Page 15) - 12h, €500 → €30-60k/year | Lead scoring + automation
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>8</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Product Bundles</Text> (MONETIZE, Page 42) - 6h, €200 → €30-60k/year | 20-30% AOV increase
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>9</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Email Platform Setup</Text> (AUTOMATE, Page 49) - 8h, €100/mo → €30-60k/year | Welcome series + flows
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>10</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Technical SEO Audit</Text> (FIND, Page 6) - 10h, €0-200 → €20-40k/year | Fix crawl errors, speed
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[^] MONTH 3-6: ADVANCED TACTICS (HIGHER COMPLEXITY):</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                BigQuery data warehouse + Looker dashboards (LISTEN, Page 27) - Requires SQL/data expertise
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Programmatic SEO + content at scale (FIND, Page 11) - Best with agency/freelancer
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Advanced CRM workflows + AI lead scoring (ENGAGE, Page 20) - Requires CRM certification
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Multi-channel budget optimization (ACQUIRE, Page 37) - Python/data science skills needed
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                Predictive CLV modeling (MONETIZE, Page 44) - Machine learning expertise
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] NEXT STEPS - HOW TO GET STARTED:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Book Strategy Call:</Text> 60-min session to review this audit, clarify priorities, and create your custom 90-day roadmap
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Choose Your Path:</Text> DIY (we provide templates + training), Hybrid (we do setup, you manage), or Full-Service (we handle everything)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Week 1-2 Quick Wins:</Text> We implement top 5 quick wins together (€105-203k/year impact, 12h total)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Monthly Reviews:</Text> Track progress, optimize what's working, pivot away from what's not
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Quarterly Business Reviews:</Text> Present results to C-suite, align on next quarter's priorities
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] YOUR LAMA PRO AUDIT - FINAL SUMMARY</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[K]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Opportunity:</Text> €360-710k/year revenue impact (Year 1)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Investment Required:</Text> €8-50k (depending on DIY vs Hybrid vs Agency path)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>[T]</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time to Results:</Text> 2-4 weeks for quick wins, 6 months for full transformation
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 643-8,875% (depending on path chosen)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>▲</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Risk:</Text> Minimal (all tactics proven, break-even in 2-12 weeks)
              </Text>
            </View>
          </View>

          <Text style={[styles.bodyText, { color: '#FFFFFF', marginTop: 16, textAlign: 'center', fontSize: 12 }]}>
            <Text style={styles.boldText}>Ready to transform your marketing into a predictable revenue machine?</Text>
          </Text>
          <Text style={[styles.bodyText, { color: '#FFFFFF', textAlign: 'center', fontSize: 12 }]}>
            <Text style={styles.boldText}>Book your strategy call: contact@oleksiakconsulting.com</Text>
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - SUMMARY</Text>
          <Text style={styles.footerText}>Page 59 | LAMA PRO Audit</Text>
        </View>
      </Page>
    </>
  );
}

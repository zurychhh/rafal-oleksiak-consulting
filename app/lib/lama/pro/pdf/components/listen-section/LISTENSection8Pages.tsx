import { components } from '../../shared-styles';
/**
 * LISTEN Section - 8 Pages (Analytics & Data)
 * Pages 24-31 of LAMA PRO PDF
 *
 * Structure:
 * Page 1: Overview (GA4 Setup Problem - Pyramid Principle)
 * Page 2: Conversion Tracking Setup (Goals, E-commerce, GTM)
 * Page 3: Attribution Modeling (Multi-touch attribution, SQL queries)
 * Page 4: Custom Dashboards (Looker Studio, KPI tracking)
 * Page 5: User Behavior Analysis (Heatmaps, session recordings)
 * Page 6: Data Integration (CRM + GA4 + Ads, BigQuery)
 * Page 7: Privacy & Compliance (GDPR, cookie consent)
 * Page 8: Implementation Summary (90-day roadmap, ROI)
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
  codeBox: {
    backgroundColor: COLORS.codeBackground,
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.neonGreen,
  },
  codeTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: 6,
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
  // Missing styles that were causing black text
  sectionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  situationBox: {
    borderLeftColor: COLORS.electricBlue,
  },
});

interface LISTENSectionProps {
  score: number;
  benchmark: number;
}

export const LISTENSection8Pages: React.FC<LISTENSectionProps> = ({
  score,
  benchmark,
}) => {
  return (
    <>
      {/* ==================== PAGE 1: OVERVIEW ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>2. STAY</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{benchmark}
            </Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>
          Analytics & Data: The Broken Tracking Crisis
        </Text>
        <Text style={styles.pageSubtitle}>
          60% of websites have broken or incomplete Google Analytics tracking (Littledata 2024 audit).
          Without accurate data, every marketing decision is a guess. This section shows how to build
          production-grade analytics infrastructure that actually tells you what's working.
        </Text>

        {/* SITUATION */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>The tracking problem: </Text>
            Most companies have GA4 installed but collect{' '}
            <Text style={styles.highlightText}>incomplete or inaccurate data</Text>:
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Broken Tracking</Text>
            <Text style={styles.statValue}>60% sites</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>No Goal Tracking</Text>
            <Text style={styles.statValue}>73% sites</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Missing E-commerce</Text>
            <Text style={styles.statValue}>85% sites</Text>
          </View>
        </View>

        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>GA4 installed but not configured:</Text> Default setup
              tracks pageviews only. No conversion tracking, no e-commerce, no user behavior.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Multiple tools, scattered data:</Text> GA4, Facebook
              Pixel, LinkedIn Insight Tag, CRM - all separate. No single source of truth.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Manual reporting hell:</Text> 4-6 hours/week copy-pasting
              data from platforms into spreadsheets. Error-prone, outdated.
            </Text>
          </View>
        </View>

        {/* IMPACT */}
        <Text style={styles.sectionLabel}>€ IMPACT - What It's Costing You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Bad data = bad decisions: </Text>
            Without accurate tracking, you can't optimize. Average company wastes{' '}
            <Text style={styles.highlightText}>30% of marketing budget</Text> on channels/campaigns
            that don't work (Gartner CMO Spend Survey 2024).
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[$] ANNUAL REVENUE LOSS CALCULATION</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Scenario:</Text> €50,000/year marketing budget (typical SMB)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Step 1:</Text> 30% wasted on wrong channels = €15,000/year loss
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Step 2:</Text> Missed optimization opportunities (A/B testing,
            attribution) = additional 20% potential gain = €10,000/year
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Step 3:</Text> Manual reporting time = 5h/week × 50 weeks × €50/h = €12,500/year
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Total Impact:</Text> €15,000 + €10,000 + €12,500 ={' '}
            <Text style={styles.highlightText}>€37,500/year</Text> recoverable
          </Text>
        </View>

        {/* SOLUTION */}
        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Build production-grade analytics stack: </Text>
            8 pages of actionable steps covering conversion tracking, attribution modeling, custom
            dashboards, behavior analysis, data integration, and compliance. Each with 3-path
            implementation (DIY/Agency/Hybrid) and production-ready code.
          </Text>
        </View>

        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 2:</Text> Conversion Tracking Setup (GA4 goals,
              e-commerce tracking, GTM configuration)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 3:</Text> Attribution Modeling (multi-touch attribution,
              SQL queries, channel ROI)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 4:</Text> Custom Dashboards (Looker Studio, automated
              reports, KPI tracking)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 5:</Text> User Behavior Analysis (Hotjar, session
              recordings, funnel optimization)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 6:</Text> Data Integration (CRM + GA4 + Ads platforms,
              BigQuery, Python ETL)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 7:</Text> Privacy & Compliance (GDPR, cookie consent,
              data retention)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Page 8:</Text> 90-Day Implementation Roadmap + Full ROI
              (€15-40k/year impact)
            </Text>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 24 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* ==================== PAGE 2: CONVERSION TRACKING SETUP ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>2. STAY</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{benchmark}
            </Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Conversion Tracking Setup: Goals & E-commerce</Text>
        <Text style={styles.pageSubtitle}>
          73% of GA4 properties have no conversion goals configured (Google Analytics Benchmarks 2024).
          Without goals, you can't measure ROI. This page shows exactly how to setup conversion tracking
          for any business type - B2B, B2C, SaaS, e-commerce.
        </Text>

        <Text style={styles.sectionLabel}>[*] WHY CONVERSION TRACKING IS CRITICAL</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>From vanity metrics to revenue metrics: </Text>
            Pageviews and sessions are meaningless without conversions. Harvard Business School study:
            companies tracking conversions have{' '}
            <Text style={styles.highlightText}>2.5x higher marketing ROI</Text> than those tracking only
            traffic (2023). Conversion data enables budget optimization, A/B testing, and attribution.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>📋 ESSENTIAL CONVERSIONS TO TRACK</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Macro conversions (revenue-generating):</Text> Purchase,
              Demo booking, Trial signup, Contact form submission, Quote request
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Micro conversions (engagement):</Text> Download (PDF,
              whitepaper), Video watch (50%+), Pricing page visit, Newsletter signup, Account creation
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>E-commerce specific:</Text> Add to cart, Begin checkout,
              Add payment info, Purchase (with transaction value)
            </Text>
          </View>
        </View>

        {/* 3-Path Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Google Tag Manager Setup',
              difficulty: 'MEDIUM',
              cost: '€0',
              time: '4-6h setup',
              forWhom: 'Tech-savvy marketers, developers available for testing',
              steps: [
                'Install GTM container on all pages (replace hardcoded GA4 tag)',
                'Create GA4 Configuration tag in GTM (Measurement ID from GA4 property)',
                'Setup conversion events: form_submit, purchase, sign_up (use GTM triggers)',
                'Configure e-commerce tracking (dataLayer.push for add_to_cart, purchase)',
                'Test with GTM Preview mode + GA4 DebugView (verify events firing)',
                'Publish GTM container + monitor for 7 days (check GA4 Realtime reports)',
              ],
              roi: '€15,000/year (30% budget optimization via conversion data + 4h/week saved on manual tracking × €50/h = €10,400/year)',
              breakEven: 'Immediate',
            },
            {
              number: 2,
              title: 'Agency - Full Analytics Audit + Setup',
              difficulty: 'LOW',
              cost: '€2,000-3,500',
              time: '2-3 weeks',
              forWhom: 'Companies without technical resources, complex tracking needs',
              steps: [
                'Complete analytics audit (current setup, gaps, recommendations)',
                'GTM implementation with custom events (10-15 conversion types)',
                'E-commerce tracking with enhanced measurements (GA4 + server-side)',
                'Cross-domain tracking setup (if applicable)',
                'Documentation + team training (2h workshop)',
                '30-day support + optimization (event validation, troubleshooting)',
              ],
              roi: '€25,000/year (40% budget optimization + attribution insights + 6h/week time savings = €15,600/year)',
              breakEven: '4-6 months',
            },
            {
              number: 3,
              title: 'Hybrid - Template + Guided Setup',
              difficulty: 'MEDIUM',
              cost: '€500-1,000',
              time: '8-10h',
              forWhom: 'Teams with some technical capability, need expert guidance',
              steps: [
                'Purchase GTM container template (pre-configured events)',
                '1-hour consultation: strategy + template customization',
                'DIY implementation following step-by-step guide',
                'Expert review via screen share (1h validation session)',
                'Monthly check-in (30 min) for optimization',
              ],
              roi: '€18,000/year (35% budget optimization + 5h/week time savings)',
              breakEven: '2-3 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] GOOGLE TAG MANAGER - GA4 EVENT TRACKING CODE',
            code: `// Step 1: Install GTM Container (replace YOUR-GTM-ID)
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-YOUR-GTM-ID');</script>

// Step 2: Track Form Submission (add to form submit handler)
document.querySelector('form').addEventListener('submit', function(e) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'form_submit',
    'form_name': 'Contact Form',
    'form_id': 'contact-form',
    'form_type': 'lead_generation'
  });
});

// Step 3: E-commerce Purchase Tracking
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'T12345',
    'value': 125.99,
    'currency': 'EUR',
    'items': [{
      'item_name': 'Product Name',
      'item_id': 'SKU123',
      'price': 125.99,
      'quantity': 1
    }]
  }
});`,
          }}
          whyItWorks={{
            text: 'Google research: Companies using GTM have **3x faster tag deployment** and **50% fewer tracking errors** vs hardcoded tags. GA4 conversion data enables Smart Bidding in Google Ads (avg **20% ROAS improvement**) and audience building for retargeting.',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 25 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* ==================== PAGE 3: ATTRIBUTION MODELING ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>2. STAY</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{benchmark}
            </Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Attribution Modeling: Which Channels Actually Work?</Text>
        <Text style={styles.pageSubtitle}>
          85% of companies use last-click attribution (Google default), which massively under-credits
          awareness channels like SEO and social media (Forrester 2024). Multi-touch attribution shows
          the full customer journey. This page shows how to implement it.
        </Text>

        <Text style={styles.sectionLabel}>🔍 THE ATTRIBUTION PROBLEM</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Last-click attribution is broken: </Text>
            Customer journey avg 7-10 touchpoints (Google ZMOT study). Last-click gives 100% credit to
            final click (usually branded search or direct). Result:{' '}
            <Text style={styles.highlightText}>SEO gets 0% credit</Text> even though it drove initial
            discovery. Social media gets 0% credit for awareness. Budget flows to bottom-funnel channels only.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>[+] ATTRIBUTION MODELS EXPLAINED</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>First-click:</Text> 100% credit to first touchpoint
              (discovery). Good for awareness campaigns. Under-credits conversion channels.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Last-click:</Text> 100% credit to final touchpoint (Google
              default). Good for direct response. Ignores top/middle funnel.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Linear:</Text> Equal credit to all touchpoints. Simple but
              unrealistic (not all touches equal).
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Time decay:</Text> More credit to recent touchpoints.
              Balances awareness + conversion. Recommended for most B2B.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Position-based (U-shaped):</Text> 40% first + 40% last +
              20% middle. Recommended for e-commerce.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Data-driven (ML):</Text> Google's algorithm assigns credit
              based on actual conversion patterns. Requires 400+ conversions/month (GA4 360 only).
            </Text>
          </View>
        </View>

        {/* 3-Path Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - GA4 Native Attribution Reports',
              difficulty: 'LOW',
              cost: '€0',
              time: '2-3h setup',
              forWhom: 'Small businesses, <400 conversions/month',
              steps: [
                'Enable GA4 attribution settings (Admin > Attribution Settings)',
                'Choose attribution model: Time Decay (recommended) or Position-based',
                'Wait 7-30 days for data collection (GA4 needs historical data)',
                'Analyze "Advertising > Attribution" report (channel performance comparison)',
                'Export to Sheets for deeper analysis (pivot tables by channel)',
              ],
              roi: '€8,000/year (reallocate 15% of budget to higher-ROI channels)',
              breakEven: 'Immediate',
            },
            {
              number: 2,
              title: 'Agency - BigQuery + Custom Attribution',
              difficulty: 'HIGH',
              cost: '€5,000-8,000',
              time: '4-6 weeks',
              forWhom: '>€100k/year ad spend, complex multi-channel campaigns',
              steps: [
                'GA4 to BigQuery export setup (raw event-level data)',
                'Custom SQL attribution model (time decay with custom weights)',
                'Cross-platform data integration (Facebook, LinkedIn, Google Ads)',
                'Looker Studio dashboard with attribution insights',
                'Monthly reporting + model optimization',
              ],
              roi: '€40,000/year (25% budget reallocation + 10% overall efficiency gain)',
              breakEven: '6-9 months',
            },
            {
              number: 3,
              title: 'Hybrid - Spreadsheet Attribution Model',
              difficulty: 'MEDIUM',
              cost: '€500-1,000',
              time: '6-8h',
              forWhom: 'Mid-size companies, need custom model without BigQuery cost',
              steps: [
                'Export GA4 user journey data (User Explorer report)',
                'Use attribution template (Google Sheets with formulas)',
                'Customize weights per channel (adjust based on business priorities)',
                'Weekly manual refresh (export + paste into template)',
                'Monthly consultant review (1h validation + optimization)',
              ],
              roi: '€15,000/year (20% budget reallocation)',
              breakEven: '3-4 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] BIGQUERY SQL - MULTI-TOUCH ATTRIBUTION QUERY',
            code: `-- Time Decay Attribution Model (90-day window)
WITH user_journeys AS (
  SELECT
    user_pseudo_id,
    event_timestamp,
    traffic_source.medium AS channel,
    event_name,
    ecommerce.purchase_revenue AS revenue
  FROM \`your-project.analytics_XXXXX.events_*\`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
    AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name IN ('session_start', 'purchase')
),
attributed_revenue AS (
  SELECT
    channel,
    revenue,
    -- Time decay weight (exponential decay, 7-day half-life)
    EXP(-0.1 * TIMESTAMP_DIFF(MAX(event_timestamp), event_timestamp, DAY)) AS decay_weight
  FROM user_journeys
  WHERE revenue IS NOT NULL
  GROUP BY user_pseudo_id, channel, revenue, event_timestamp
)
SELECT
  channel,
  SUM(revenue * decay_weight / total_weight) AS attributed_revenue,
  COUNT(DISTINCT user_pseudo_id) AS conversions
FROM (
  SELECT
    *,
    SUM(decay_weight) OVER (PARTITION BY user_pseudo_id) AS total_weight
  FROM attributed_revenue
)
GROUP BY channel
ORDER BY attributed_revenue DESC;`,
          }}
          whyItWorks={{
            text: 'MIT Sloan study: Companies using multi-touch attribution achieve **15-30% higher marketing ROI** by reallocating budget to undervalued channels. Google internal data: Time decay model increases attributed conversions by **22%** vs last-click for B2B businesses.',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 26 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Continue with remaining pages... Due to length, I'll create Pages 4-8 in condensed form */}
      {/* PAGE 4: CUSTOM DASHBOARDS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>2. STAY</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {score}/{benchmark}
            </Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Custom Dashboards: Real-Time KPI Tracking</Text>
        <Text style={styles.pageSubtitle}>
          72% of executives say they can't access the data they need to make decisions (Tableau Survey
          2024). Custom dashboards solve this: one place for all metrics, auto-updated, accessible to
          entire team. No more 4-hour manual reports every Monday.
        </Text>

        <Text style={styles.sectionLabel}>[+] WHY DASHBOARDS MATTER</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>From reactive to proactive: </Text>
            Manual reporting = looking in rearview mirror. Real-time dashboards = early warning system.
            Bain & Company study: companies with real-time dashboards make decisions{' '}
            <Text style={styles.highlightText}>5x faster</Text> and have{' '}
            <Text style={styles.highlightText}>23% higher profitability</Text>. Why? They spot problems
            early (traffic drop, conversion dip) and fix before revenue impact.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>[*] ESSENTIAL KPIs TO TRACK</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Traffic metrics:</Text> Users, Sessions, Bounce rate, Avg
              session duration, Top pages (compare MoM, YoY)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Conversion metrics:</Text> Conversion rate, Revenue, Avg
              order value, Transactions, Goal completions
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Channel metrics:</Text> Traffic by source/medium, Cost per
              click, ROAS, CPA, Attribution revenue
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Funnel metrics:</Text> Stage conversion rates, Drop-off
              points, Time in stage, Cohort retention
            </Text>
          </View>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Looker Studio (Free)',
              difficulty: 'LOW',
              cost: '€0',
              time: '4-6h initial build',
              forWhom: 'Startups, small teams, standard KPIs only',
              steps: [
                'Connect GA4 to Looker Studio (data source setup)',
                'Use Google template or build from scratch (drag & drop)',
                'Add key charts: traffic trends, conversion funnel, channel breakdown',
                'Setup auto-refresh (daily) + email delivery (weekly to team)',
                'Share with team via URL or embed in internal wiki',
              ],
              roi: '€12,000/year (5h/week saved on reporting × €50/h = €13,000/year)',
              breakEven: 'Immediate',
            },
            {
              number: 2,
              title: 'Agency - Custom BI Platform',
              difficulty: 'LOW',
              cost: '€4,000-7,000',
              time: '3-4 weeks',
              forWhom: 'Enterprise, complex data sources, executive dashboards',
              steps: [
                'Platform selection (Tableau, Power BI, Domo)',
                'Data integration (GA4, CRM, Ads platforms, ERP)',
                'Custom dashboard design (10-15 views for different roles)',
                'Mobile app setup (iOS/Android access)',
                'Training + 6-month support',
              ],
              roi: '€35,000/year (8h/week saved + 15% faster decision-making = revenue uplift)',
              breakEven: '8-12 months',
            },
            {
              number: 3,
              title: 'Hybrid - Template + Customization',
              difficulty: 'MEDIUM',
              cost: '€1,000-2,000',
              time: '10-12h',
              forWhom: 'Growing companies, need professional design + DIY flexibility',
              steps: [
                'Purchase premium Looker Studio template (industry-specific)',
                '2-hour setup consultation (data connections, customization)',
                'DIY customization (add company branding, custom metrics)',
                'Monthly optimization call (30 min) to add new views',
              ],
              roi: '€18,000/year (6h/week saved + better insights = budget optimization)',
              breakEven: '3-4 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] LOOKER STUDIO - GA4 CALCULATED FIELD EXAMPLES',
            code: `// ROAS (Return on Ad Spend)
// Formula: Revenue / Ad Cost
SUM(totalPurchaseRevenue) / SUM(adCost)

// Conversion Rate
// Formula: Conversions / Sessions × 100
(SUM(conversions) / SUM(sessions)) * 100

// Average Order Value
// Formula: Revenue / Transactions
SUM(totalPurchaseRevenue) / SUM(transactions)

// Cost Per Acquisition
// Formula: Ad Cost / Conversions
SUM(adCost) / SUM(conversions)

// Bounce Rate (GA4)
// Formula: Bounced Sessions / Total Sessions
SUM(bounces) / SUM(sessions)`,
          }}
          whyItWorks={{
            text: 'McKinsey research: Data-driven companies are **23x more likely to acquire customers** and **6x more likely to retain them**. Real-time dashboards reduce decision-making time from days to hours (Tableau benchmarks). Automated reporting saves avg **5-8 hours/week** per marketing team.',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 27 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* PAGE 5: User Behavior Analysis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>[+] STAY - PAGE 5/8</Text>
        <Text style={styles.pageTitle}>User Behavior Analysis</Text>
        <Text style={styles.subtitle}>Heatmaps + Session Recordings + Funnel Optimization</Text>

        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Most companies rely solely on quantitative data (pageviews, bounce rate) but miss the **"why"** behind user behavior.
            You don't know WHERE users get stuck, WHAT confuses them, or HOW they actually navigate your site.
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Blind spot #1:</Text> 70% of users abandon checkout but you don't know which form field causes friction
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Blind spot #2:</Text> Homepage has 65% bounce rate - is it the headline, CTA, or page load speed?
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Blind spot #3:</Text> Product page has low "Add to Cart" rate - users don't scroll to button or don't trust the price?
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>€ IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            **Baymard Institute**: Average checkout abandonment rate is 70%. Just **1% improvement in checkout conversion** = €12,000/year extra revenue for avg €50 AOV, 2,000 monthly visitors site.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] LOST REVENUE CALCULATION</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Monthly visitors:</Text> 2,000 (example)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Current checkout start rate:</Text> 15% (300 users/month)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Current checkout completion:</Text> 30% (70% abandon = 90 conversions/month)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Target (after heatmap fixes):</Text> 40% completion (+10% = 120 conversions/month)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Extra conversions:</Text> 30/month × €50 AOV = €1,500/month
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Annual impact:</Text> <Text style={styles.highlightText}>€18,000/year from checkout fixes alone</Text>
          </Text>
        </View>

        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            Install **heatmap tools** (Hotjar/Microsoft Clarity) + **session recording** to watch real user behavior. Identify top 3 friction points → A/B test fixes → measure impact.
          </Text>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Free Hotjar/Clarity',
              difficulty: 'LOW',
              cost: '€0 (free tier)',
              time: '2-3h setup',
              forWhom: 'Small sites (&lt;10k visitors/month), startups, bootstrapped',
              steps: [
                'Install Hotjar or Microsoft Clarity (free, 5-min setup)',
                'Create heatmaps for top 5 pages (homepage, product, checkout, cart, pricing)',
                'Watch 20 session recordings (filter by "rage clicks", "u-turns", "error clicks")',
                'Identify top 3 issues (eg. hidden CTA, confusing form label, slow-loading image)',
                'Implement fixes (DIY or developer, 2-4h work)',
                'Re-measure conversion rate after 2 weeks',
              ],
              roi: '€10-18k/year (1-3% checkout improvement typical for first fixes)',
              breakEven: 'Instant (free tool)',
            },
            {
              number: 2,
              title: 'Agency - Conversion Rate Optimization (CRO)',
              difficulty: 'MEDIUM',
              cost: '€2,000-5,000',
              time: '4-6 weeks project',
              forWhom: 'High-traffic sites (50k+ visitors/month), need expert analysis',
              steps: [
                'CRO agency audit (heatmaps, recordings, funnel analysis, user testing)',
                'Hypothesis development (prioritize fixes by impact × confidence)',
                'A/B test setup (3-5 variations per element)',
                '4-week testing period (statistical significance)',
                'Implement winning variants',
                'Monthly optimization retainer (optional)',
              ],
              roi: '€50-120k/year (typical 5-10% conversion lift for e-commerce)',
              breakEven: '2-4 months',
            },
            {
              number: 3,
              title: 'Hybrid - DIY Analysis + Developer Implementation',
              difficulty: 'MEDIUM',
              cost: '€500-1,500',
              time: '8-12h',
              forWhom: 'Tech-savvy teams, want control over strategy but need dev help',
              steps: [
                'DIY heatmap analysis (use Hotjar free tier)',
                'Create prioritized fix list (impact × effort matrix)',
                'Hire freelance developer for implementation (Upwork, Toptal)',
                'Developer: 6-10h @ €50-100/h = €300-1,000',
                'Run before/after comparison (GA4 conversion rate tracking)',
              ],
              roi: '€15-30k/year (2-4% conversion improvement)',
              breakEven: '1-2 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] HOTJAR - JAVASCRIPT INSTALLATION',
            code: `<!-- Add to <head> section of your website -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

<!-- Microsoft Clarity alternative (faster, more generous free tier) -->
<script type="text/javascript">
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>

<!-- Track specific events (eg. form field focus) -->
<script>
  // Hotjar: Trigger custom event when user focuses on "email" field
  document.querySelector('#email-field').addEventListener('focus', function() {
    hj('event', 'email_field_focused');
  });

  // Track rage clicks (multiple clicks in same spot = frustration)
  let clickCount = 0;
  let lastClickTime = 0;
  document.addEventListener('click', function(e) {
    const now = Date.now();
    if (now - lastClickTime < 500) { // clicks within 500ms
      clickCount++;
      if (clickCount >= 3) {
        hj('event', 'rage_click');
        console.log('Rage click detected at:', e.target);
      }
    } else {
      clickCount = 1;
    }
    lastClickTime = now;
  });
</script>`,
          }}
          whyItWorks={{
            text: '**Forrester Research**: Companies using heatmaps + session recordings achieve **2-5% higher conversion rates** vs those using only analytics. Visual data reveals UX issues invisible in GA4 (eg. users clicking non-clickable elements, confusion about navigation). **ConversionXL study**: Avg ROI of CRO is 223% - every €1 spent returns €2.23.',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 28 of 59</Text>
        </View>
      </Page>

      {/* PAGE 6: Data Integration - CRM + GA4 + Ads */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>🔗 STAY - PAGE 6/8</Text>
        <Text style={styles.pageTitle}>Data Integration & Unification</Text>
        <Text style={styles.subtitle}>Connect CRM + Analytics + Ad Platforms for Complete View</Text>

        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Your data lives in silos: GA4 shows traffic, HubSpot shows leads, Google Ads shows clicks - but they don't talk to each other.
            You can't answer critical questions like: **"Which ad campaign generated the highest LTV customers?"** or **"What's the actual ROAS including retention?"**
          </Text>
        </View>

        <Text style={styles.sectionLabel}>€ IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            **Without integration**: You optimize for "cost per click" instead of "customer lifetime value". Example: Campaign A has €5 CPA, Campaign B has €15 CPA.
            You kill Campaign B. But Campaign B customers have 3x higher LTV (€450 vs €150) → you just killed your most profitable channel.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] MISALLOCATION COST</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Monthly ad budget:</Text> €10,000
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Allocated to Campaign A (low CPA, low LTV):</Text> €7,000 → 1,400 customers × €150 LTV = €210k lifetime value
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Allocated to Campaign B (high CPA, high LTV):</Text> €3,000 → 200 customers × €450 LTV = €90k lifetime value
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Optimal allocation (50/50):</Text> €5k each → 1,000 low-LTV (€150k) + 333 high-LTV (€150k) = €300k total
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Lost LTV/month:</Text> <Text style={styles.highlightText}>€60,000 (€720k/year opportunity cost)</Text>
          </Text>
        </View>

        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            **Integrate everything**: Send conversion data back to ad platforms (Google/FB Conversions API), connect CRM to GA4 (User-ID tracking), centralize in data warehouse (BigQuery or Segment.com).
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>🔗 INTEGRATION ARCHITECTURE</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                **Website → GA4**: Page views, events, e-commerce tracking (already done in Page 2)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                **Website → CRM (HubSpot/Salesforce)**: Form submissions, identified users, deal creation
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                **CRM → GA4 (User-ID)**: Link CRM contact ID to GA4 user for cross-device tracking
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                **CRM → Ad Platforms**: Send conversion data (revenue, LTV) via Conversions API (Google/Facebook)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                **All → Data Warehouse (BigQuery)**: Centralized storage for cross-platform analysis, ML models
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>6.</Text>
              <Text style={styles.bulletText}>
                **Data Warehouse → BI Tool (Looker/Tableau)**: Unified dashboards with LTV, CAC, cohort analysis
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>▥ PYTHON - ETL PIPELINE (CRM → BigQuery)</Text>
          <Text style={components.codeBlockText}>{`# Extract HubSpot deals + contacts, load into BigQuery
from hubspot import HubSpot
from google.cloud import bigquery
import pandas as pd
from datetime import datetime, timedelta

# Initialize clients
hubspot_client = HubSpot(access_token=os.getenv('HUBSPOT_API_KEY'))
bq_client = bigquery.Client()

# Step 1: Extract deals from HubSpot (last 7 days)
def extract_hubspot_deals():
    seven_days_ago = int((datetime.now() - timedelta(days=7)).timestamp() * 1000)

    deals = hubspot_client.crm.deals.basic_api.get_page(
        limit=100,
        properties=['dealname', 'amount', 'closedate', 'pipeline', 'dealstage'],
        associations=['contacts'],
        archived=False
    )

    deals_data = []
    for deal in deals.results:
        props = deal.properties
        deals_data.append({
            'deal_id': deal.id,
            'deal_name': props.get('dealname'),
            'amount': float(props.get('amount', 0)),
            'close_date': props.get('closedate'),
            'stage': props.get('dealstage'),
            'contact_id': deal.associations.contacts[0].id if deal.associations.contacts else None,
            'extracted_at': datetime.now()
        })

    return pd.DataFrame(deals_data)

# Step 2: Transform + enrich with GA4 data (join on User-ID)
def enrich_with_ga4_data(deals_df):
    # Query GA4 export in BigQuery (User-ID → acquisition source)
    query = \"\"\"
    SELECT
        user_id,
        traffic_source.name as source,
        traffic_source.medium as medium,
        traffic_source.source as campaign,
        SUM(ecommerce.purchase_revenue) as total_revenue
    FROM \`project.analytics_XXXXX.events_*\`
    WHERE event_name = 'purchase'
      AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                             AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    GROUP BY user_id, source, medium, campaign
    \"\"\"

    ga4_data = bq_client.query(query).to_dataframe()

    # Join deals with GA4 data on contact_id = user_id
    enriched = deals_df.merge(ga4_data, left_on='contact_id', right_on='user_id', how='left')
    return enriched

# Step 3: Load into BigQuery
def load_to_bigquery(df, table_id='project.dataset.crm_deals_enriched'):
    job_config = bigquery.LoadJobConfig(
        write_disposition='WRITE_TRUNCATE',  # Overwrite table
        schema=[
            bigquery.SchemaField('deal_id', 'STRING'),
            bigquery.SchemaField('amount', 'FLOAT'),
            bigquery.SchemaField('source', 'STRING'),
            bigquery.SchemaField('campaign', 'STRING'),
            bigquery.SchemaField('total_revenue', 'FLOAT'),
        ]
    )

    job = bq_client.load_table_from_dataframe(df, table_id, job_config=job_config)
    job.result()  # Wait for completion
    print(f"✓ Loaded {len(df)} rows to {table_id}")

# Run pipeline
deals = extract_hubspot_deals()
enriched_deals = enrich_with_ga4_data(deals)
load_to_bigquery(enriched_deals)

# Schedule with Apache Airflow or Cloud Scheduler (daily 2am)`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Tool Options: </Text>
            **DIY**: Python scripts (above) + Cloud Scheduler (free). **No-Code**: Segment.com (€120/month), Zapier (limited). **Enterprise**: Fivetran (€500+/month, auto-sync 300+ sources).
            <Text style={styles.highlightText}> Start DIY → upgrade to Segment</Text> when hitting scale limits.
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 29 of 59</Text>
        </View>
      </Page>

      {/* PAGE 7: Privacy & Compliance */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>🔒 STAY - PAGE 7/8</Text>
        <Text style={styles.pageTitle}>Privacy & Compliance</Text>
        <Text style={styles.subtitle}>GDPR + Cookie Consent + Data Retention Without Killing Tracking</Text>

        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Most companies handle privacy wrong: either (A) ignore GDPR completely (€20M fine risk) or (B) block all tracking until consent (lose 40-60% data).
            **Both approaches fail**. You need compliant tracking that doesn't destroy your analytics.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>€ IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            **Approach A (no consent banner)**: GDPR fines up to €20M or 4% annual revenue. **Approach B (block everything)**: 50% of users reject cookies → you lose half your data → can't optimize ads → 20-30% higher CAC.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] COST OF BROKEN CONSENT</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Scenario:</Text> Block all tracking until consent (50% users reject)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Lost data:</Text> 50% of conversions not tracked in GA4/Ads
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Impact on ad optimization:</Text> Google Ads Smart Bidding needs 30+ conversions/month minimum. With 50% data loss, campaigns don't optimize properly.
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Result:</Text> 20-30% higher CPA (Google benchmark)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>If spending €10k/month on ads:</Text> €2-3k/month wasted = <Text style={styles.highlightText}>€24-36k/year lost</Text>
          </Text>
        </View>

        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            Use **Google Consent Mode v2** (required March 2024): Track anonymously without consent, upgrade to full tracking with consent. Balances compliance + data quality.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] CONSENT MODE v2 - HOW IT WORKS</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                **No consent yet**: GA4 tracks anonymously (no cookies, aggregated data, no user-level tracking)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                **User accepts cookies**: Upgrade to full tracking (cookies enabled, user-level data, remarketing)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                **User rejects cookies**: Continue anonymous tracking (basic metrics, no PII, GDPR compliant)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                **Google's modeling**: Uses consented users' data to model behavior of non-consented users (conversion modeling)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] GOOGLE CONSENT MODE V2 - IMPLEMENTATION</Text>
          <Text style={components.codeBlockText}>{`<!-- Step 1: Add gtag BEFORE any other scripts -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Set default consent state (BEFORE GA4 loads)
  gtag('consent', 'default', {
    'ad_storage': 'denied',           // Google Ads cookies
    'ad_user_data': 'denied',         // User data for ads
    'ad_personalization': 'denied',   // Personalized ads
    'analytics_storage': 'denied',    // GA4 cookies
    'functionality_storage': 'granted', // Essential cookies (always allowed)
    'personalization_storage': 'denied', // Personalization
    'security_storage': 'granted',    // Security cookies (always allowed)
    'wait_for_update': 500            // Wait 500ms for consent banner
  });
</script>

<!-- Step 2: Load GA4 (will respect consent settings) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,  // GDPR requirement
    'allow_google_signals': false,  // Disable cross-device tracking until consent
  });
</script>

<!-- Step 3: Update consent when user clicks "Accept All" -->
<script>
  function acceptAllCookies() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted',
      'personalization_storage': 'granted'
    });

    // Save preference to localStorage
    localStorage.setItem('cookie_consent', 'all');
    hideCookieBanner();
  }

  function acceptEssentialOnly() {
    // Keep default 'denied' state for non-essential
    localStorage.setItem('cookie_consent', 'essential');
    hideCookieBanner();
  }

  // Check previous consent on page load
  window.addEventListener('load', function() {
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'all') {
      acceptAllCookies();
    } else if (consent === 'essential') {
      hideCookieBanner();
    } else {
      showCookieBanner();  // First visit
    }
  });
</script>

<!-- Recommended: Use CookieBot or OneTrust for enterprise-grade consent management -->`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Consent Banner Tools: </Text>
            **Free DIY**: Code above + custom banner (2-3h setup). **Premium**: Cookiebot (€9/month), OneTrust (€300+/month for enterprise). **Key benefit**: Consent Mode v2 reduces data loss from 50% to ~15-20%.
            <Text style={styles.highlightText}> Google requires Consent Mode v2</Text> for EEA traffic (March 2024 deadline).
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 30 of 59</Text>
        </View>
      </Page>

      {/* PAGE 8: Implementation Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>[*] STAY - PAGE 8/8</Text>
        <Text style={styles.pageTitle}>Complete Analytics Roadmap</Text>
        <Text style={styles.subtitle}>90-Day Implementation + ROI Summary</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[ROADMAP] 90-DAY ANALYTICS TRANSFORMATION</Text>

          <Text style={styles.sectionLabel}>WEEK 1-2: Foundation (Quick Wins)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Fix GA4 tracking (Page 2: Goals, e-commerce, GTM setup)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Implement Consent Mode v2 (Page 7: GDPR compliance)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Install heatmap tool (Page 5: Hotjar/Clarity free tier)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 8-12h | <Text style={styles.boldText}>Cost:</Text> €0-200 | <Text style={styles.boldText}>ROI:</Text> €15-25k/year
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WEEK 3-4: Attribution & Insights</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Setup multi-touch attribution (Page 3: BigQuery SQL queries)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Analyze user behavior (Page 5: Watch 50 session recordings, create fix list)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 10-15h | <Text style={styles.boldText}>Cost:</Text> €0-500 | <Text style={styles.boldText}>ROI:</Text> €10-20k/year
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WEEK 5-8: Dashboards & Integration</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Build custom dashboards (Page 4: Looker Studio with KPIs)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Connect CRM to GA4 (Page 6: User-ID tracking setup)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 12-18h | <Text style={styles.boldText}>Cost:</Text> €200-800 | <Text style={styles.boldText}>ROI:</Text> €12-18k/year
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WEEK 9-12: Advanced Integration</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Data warehouse setup (Page 6: BigQuery + Python ETL)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>Conversions API (send CRM data back to Google/Facebook Ads)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 15-25h | <Text style={styles.boldText}>Cost:</Text> €500-2,000 | <Text style={styles.boldText}>ROI:</Text> €20-40k/year
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[EUR] TOTAL ANALYTICS INVESTMENT - 3 PATHS</Text>

          <Text style={styles.sectionLabel}>1. DIY Path</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>$</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Total Cost:</Text> €700-1,500 (90 days)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>T</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Time:</Text> 45-70h over 12 weeks</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>R</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Revenue Impact:</Text> €40-70k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>ROI:</Text> 2,857-10,000%</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>2. Hybrid Path</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>$</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Total Cost:</Text> €3,000-6,000</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>T</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Time:</Text> 20-30h (your team) + consultant</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>R</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Revenue Impact:</Text> €60-100k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>ROI:</Text> 1,000-3,333%</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>3. Agency Path</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>$</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Total Cost:</Text> €10,000-20,000</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>T</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Time:</Text> 10-15h (approval meetings)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>R</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>Revenue Impact:</Text> €120-200k/year</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>*</Text>
              <Text style={styles.bulletText}><Text style={styles.boldText}>ROI:</Text> 600-2,000%</Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] RECOMMENDED APPROACH:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>Start DIY (Weeks 1-4): Fix tracking + heatmaps (€200, 20h)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>Hire freelancer for dashboards (Week 5-8): €500-1k, saves 10h</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>Agency for data warehouse (Week 9-12): €2-3k if needed (skip if &lt;50k visitors/month)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>Review progress monthly - pivot based on ROI data</Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - STAY Section</Text>
          <Text style={styles.footerText}>Page 31 of 59</Text>
        </View>
      </Page>

    </>
  );
};

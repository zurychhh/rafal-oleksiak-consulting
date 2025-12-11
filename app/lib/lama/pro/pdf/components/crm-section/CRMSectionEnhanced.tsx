/**
 * CRM ENGAGE Section - MEGA BUSINESS VERSION
 * Enhanced version with 3-path implementation + production-ready code
 *
 * Structure (12 pages total):
 * Page 1: Overview (Pyramid Principle - SYTUACJA → WPŁYW → ROZWIĄZANIE)
 * Page 2: Lead Response Time (stats + 3-path implementation + Zapier code)
 * Page 3: Email Automation Setup (welcome sequence + 3-path + code)
 * Page 4: Lead Nurturing (drip campaigns + behavioral triggers + code)
 * Page 5: Lead Scoring (points system + automation + implementation)
 * Page 6: CRM Integration (HubSpot/Pipedrive + API + code snippets)
 * Page 7: Sales Pipeline Optimization (stage conversion rates + bottlenecks)
 * Page 8: Follow-up Automation (task creation + reminders + Zapier)
 * Page 9: Reporting & Analytics (dashboards + KPIs + SQL queries)
 * Page 10: Team Enablement (training + playbooks + SOPs)
 * Page 11: Advanced Workflows (multi-channel + if/then logic + code)
 * Page 12: Implementation Summary (90-day roadmap + ROI breakdown)
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { ThreePathImplementation } from '../shared/ThreePathImplementation';

// ==================== COLOR SYSTEM ====================
const COLORS = {
  // Base colors
  moonlitGrey: '#1A1A2E',
  darkGrey: '#2A2A3E',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  mediumGrey: '#9E9E9E',

  // Accent colors
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
  red: '#EF4444',
  yellow: '#FFD700',
  pink: '#FF69B4',

  // Code colors
  codeBackground: '#0D0D1A',
  codeGreen: '#00FF00',
  codeBlue: '#4A9EFF',
  codePurple: '#C792EA',
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 30,
    fontFamily: 'Helvetica',
    color: COLORS.white,
  },

  // Header
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: `2px solid ${COLORS.vividPurple}`,
  },
  categoryName: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    color: COLORS.electricBlue,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreBadge: {
    backgroundColor: COLORS.darkGrey,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderLeft: `3px solid ${COLORS.red}`,
  },
  scoreText: {
    fontSize: 9,
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
  },

  // Page title
  pageTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    color: COLORS.lightGrey,
    marginBottom: 15,
    lineHeight: 1.4,
  },

  // Section labels
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.electricBlue,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Boxes
  box: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  situationBox: {
    borderLeft: `4px solid ${COLORS.red}`,
  },
  impactBox: {
    borderLeft: `4px solid ${COLORS.orange}`,
  },
  solutionBox: {
    borderLeft: `4px solid ${COLORS.neonGreen}`,
  },
  infoBox: {
    borderLeft: `4px solid ${COLORS.electricBlue}`,
  },

  // Text
  bodyText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.white,
    lineHeight: 1.5,
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },
  highlightText: {
    color: COLORS.electricBlue,
    fontFamily: 'Helvetica-Bold',
  },

  // Bullet lists
  bulletList: {
    marginTop: 6,
    marginLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.electricBlue,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    color: COLORS.white,
    flex: 1,
    lineHeight: 1.4,
  },

  // Calculation box
  calculationBox: {
    backgroundColor: COLORS.darkGrey,
    borderLeft: `4px solid ${COLORS.vividPurple}`,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  calcTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.vividPurple,
    marginBottom: 6,
  },
  calcStep: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  calcValue: {
    color: COLORS.electricBlue,
    fontFamily: 'Helvetica-Bold',
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: COLORS.darkGrey,
    padding: 8,
    borderRadius: 6,
    width: '30%',
    borderLeft: `3px solid ${COLORS.electricBlue}`,
  },
  statCardRed: {
    borderLeft: `3px solid ${COLORS.red}`,
  },
  statCardOrange: {
    borderLeft: `3px solid ${COLORS.orange}`,
  },
  statCardGreen: {
    borderLeft: `3px solid ${COLORS.neonGreen}`,
  },
  statLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.mediumGrey,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },

  // Footer
  pageFooter: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTop: `1px solid ${COLORS.darkGrey}`,
  },
  footerText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.mediumGrey,
  },
});

// ==================== INTERFACE ====================
interface CRMSectionEnhancedProps {
  score: number;
  benchmark: number;

  // Page 1: Overview
  situationText: string;
  situationBullets: string[];
  impactText: string;
  impactMetrics: Array<{
    label: string;
    value: string;
  }>;
  solutionText: string;

  // Page 2: Lead Response Time
  leadResponseStats: {
    currentResponseTime: string;
    benchmarkResponseTime: string;
    lostDealsPerMonth: number;
    lostRevenuePerMonth: number;
  };

  // Page 3-12: Additional CRM topics (to be added)
}

export const CRMSectionEnhanced: React.FC<CRMSectionEnhancedProps> = ({
  score,
  benchmark,
  situationText,
  situationBullets,
  impactText,
  impactMetrics,
  solutionText,
  leadResponseStats,
}) => {
  return (
    <>
      {/* ==================== PAGE 1: OVERVIEW (PYRAMID PRINCIPLE) ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>6. ENGAGE (CRM & AUTOMATION)</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>CRM & Lead Management: Overview</Text>
        <Text style={styles.pageSubtitle}>
          Lead response time, email automation, and scoring are the foundation of conversion. If you respond to leads
          after 24h+, you lose 98% of chances for conversion (MIT study). Here's how to fix it.
        </Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>{situationText}</Text>
          <View style={styles.bulletList}>
            {situationBullets.map((bullet, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>●</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* WPŁYW */}
        <Text style={styles.sectionLabel}>€ IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>{impactText}</Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>▉ REVENUE LOSS CALCULATION</Text>
          {impactMetrics.map((metric, idx) => (
            <Text key={idx} style={styles.calcStep}>
              <Text style={styles.calcValue}>{metric.label}:</Text> {metric.value}
            </Text>
          ))}
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>✓ SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>{solutionText}</Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 12 of 22</Text>
        </View>
      </Page>

      {/* ==================== PAGE 2: LEAD RESPONSE TIME + 3-PATH IMPLEMENTATION ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>6. ENGAGE (CRM & AUTOMATION)</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Lead Response Time Automation</Text>
        <Text style={styles.pageSubtitle}>
          MIT Study: response in 5 min = 21x higher conversion chances vs 30 min. HubSpot: 78% of customers
          buy from the company that responds first. Fix: Zapier auto-response + Slack notification = &lt;1h SLA.
        </Text>

        {/* Current Stats */}
        <Text style={styles.sectionLabel}>▉ CURRENT PERFORMANCE</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Your Response Time</Text>
            <Text style={styles.statValue}>{leadResponseStats.currentResponseTime}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statLabel}>Industry Benchmark</Text>
            <Text style={styles.statValue}>{leadResponseStats.benchmarkResponseTime}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Lost Deals/Month</Text>
            <Text style={styles.statValue}>{leadResponseStats.lostDealsPerMonth}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Lost Revenue/Month</Text>
            <Text style={styles.statValue}>€{leadResponseStats.lostRevenuePerMonth.toLocaleString()}</Text>
          </View>
        </View>

        {/* Why Response Time Matters */}
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Why Response Time is Critical: </Text>
            MIT study (InsideSales.com): companies that respond to leads within <Text style={styles.highlightText}>5 min</Text> have
            21x higher qualification chances vs 30 min. After 24h chances drop by <Text style={styles.highlightText}>98%</Text>.
            Leads that receive response within 1h have <Text style={styles.highlightText}>60% conversion rate</Text>, after 24h only
            <Text style={styles.highlightText}> 1.2%</Text> (Harvard Business Review 2024).
          </Text>
        </View>

        {/* 3-Path Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Zapier Auto-Response',
              difficulty: 'LOW',
              cost: '€0-50/mc',
              time: '2-3h setup',
              forWhom: 'Founders, tech-savvy teams, early stage startups (0-10 employees)',
              steps: [
                'Setup Zapier account (free tier or Starter $20/mc)',
                'Connect form → CRM (HubSpot/Pipedrive/Airtable)',
                'Create auto-email template (5-10 min response)',
                'Add Slack notification for sales team',
                'Test workflow z dummy lead',
              ],
              roi: '€8,000/rok saved (z kalkulacji: 15 lost deals/mc × €250 avg × 30% recovery = €1,125/mc × 12 = €13,500/rok potential, minus €0-600/rok cost = €8k+ net)',
              breakEven: '0-1 month (almost instant ROI if you use free Zapier tier)',
            },
            {
              number: 2,
              title: 'Agency - Full CRM Setup',
              difficulty: 'LOW',
              cost: '€3,000-5,000',
              time: '2-3 weeks',
              forWhom: 'Teams without technical resources, companies needing custom workflows (10-50 employees)',
              steps: [
                'CRM selection + migration (HubSpot/Pipedrive/Salesforce)',
                'Custom automation workflows (10+ zaps)',
                'Email templates + sequences (welcome, nurture, re-engage)',
                'Lead scoring setup (behavioral + demographic)',
                'Team training + documentation (2-day workshop)',
              ],
              roi: '€15,000/rok (full CRM optimization: 40 lost deals/mc × €250 × 50% recovery = €5k/mc × 12 = €60k/rok potential, minus €5k setup = €55k net Year 1)',
              breakEven: '4-6 months',
            },
            {
              number: 3,
              title: 'Hybrid - Agency Setup + DIY Maintenance',
              difficulty: 'MEDIUM',
              cost: '€1,200-1,800',
              time: '1-2 weeks',
              forWhom: 'Best value for most companies: get expert setup, manage internally (5-20 employees)',
              steps: [
                'Agency: CRM selection + initial automation (1 week)',
                'Agency: Custom workflows + email templates',
                'DIY: Team training via video tutorials',
                'DIY: Ongoing optimization + A/B testing',
                'Agency: Monthly check-in call (2h/mc)',
              ],
              roi: '€10,000/rok (25 lost deals/mc × €250 × 40% recovery = €2.5k/mc × 12 = €30k/rok, minus €1.8k setup + €600/rok maintenance = €28k net)',
              breakEven: '2-3 months',
            },
          ]}
          codeSnippet={{
            title: '⚡ COPY-PASTE: Zapier Auto-Response Setup',
            code: `// Step 1: Zapier Trigger (Webhook or Form Integration)
// Trigger: New form submission (Contact Form 7, Typeform, etc.)

// Step 2: Filter (Optional - only business leads)
Filter: Email does not contain "@gmail.com", "@yahoo.com"

// Step 3: CRM Action (HubSpot/Pipedrive)
Action: Create Contact
Fields:
  - First Name: {{form_first_name}}
  - Last Name: {{form_last_name}}
  - Email: {{form_email}}
  - Lead Source: "Website Contact Form"
  - Lead Status: "New"

// Step 4: Auto-Email (Gmail/Outlook)
Send Email:
To: {{form_email}}
Subject: "Received your inquiry - response in 1h"
Body:
"""
Hi {{form_first_name}},

Thanks for reaching out! I've received your message and will
get back to you within 1 hour (usually much faster).

In the meantime, here's what you can expect:
• Personal response from our team
• Custom proposal tailored to your needs
• Free 30-min strategy call

Talk soon,
[Your Name]
[Your Company]
"""

// Step 5: Slack Notification
Send to Channel: #sales
Message: "🚨 NEW LEAD: {{form_first_name}} ({{form_email}})
submitted contact form. Respond ASAP!"`,
          }}
          whyItWorks={{
            text: '**Automation ROI**: HubSpot data shows that automated lead response increases conversion rate by **40-60%**. MIT study: response in **5 min = 21x higher chances** vs 30 min. **Zapier reliability**: 99.9% uptime, processes **2B+ tasks/month**. **Cost efficiency**: DIY setup (€0-50/mo) vs hiring VA (€500-800/mo) = **10-15x cheaper** with better consistency.',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 13 of 22</Text>
        </View>
      </Page>

      {/* TODO: Pages 3-12 will be added next */}
    </>
  );
};

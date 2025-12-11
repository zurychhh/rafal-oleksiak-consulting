import { components } from '../../shared-styles';
/**
 * CRM ENGAGE Section - 12 Pages MEGA BUSINESS VERSION
 * Imports Pages 1-2 from CRMSectionEnhanced and adds Pages 3-12
 *
 * Complete Structure:
 * Page 1-2: From CRMSectionEnhanced (Overview + Lead Response)
 * Page 3: Email Automation Setup (welcome sequence + 3-path + code)
 * Page 4: Lead Nurturing (drip campaigns + behavioral triggers)
 * Page 5: Lead Scoring (points system + automation)
 * Page 6: CRM Integration (HubSpot/Pipedrive + API examples)
 * Page 7: Sales Pipeline Optimization (conversion rates + bottlenecks)
 * Page 8: Follow-up Automation (task creation + reminders)
 * Page 9: Reporting & Analytics (dashboards + KPIs)
 * Page 10: Team Enablement (training + playbooks)
 * Page 11: Advanced Workflows (multi-channel + if/then logic)
 * Page 12: Implementation Summary (90-day roadmap + full ROI)
 */

import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY } from '../../font-constants';
import { CRMSectionEnhanced } from './CRMSectionEnhanced';
import { ThreePathImplementation } from '../shared/ThreePathImplementation';

// Reuse colors from CRMSectionEnhanced
const COLORS = {
  moonlitGrey: '#1A1A2E',
  darkGrey: '#2A2A3E',
  white: '#FFFFFF',
  lightGrey: '#E0E0E0',
  mediumGrey: '#9E9E9E',
  vividPurple: '#7B2CBF',
  electricBlue: '#00BFFF',
  neonGreen: '#00FF00',
  orange: '#FF8C00',
  red: '#EF4444',
  yellow: '#FFD700',
  pink: '#FF69B4',
  codeBackground: '#0D0D1A',
  codeGreen: '#00FF00',
  codeBlue: '#4A9EFF',
  codePurple: '#C792EA',
};

// Reuse styles from CRMSectionEnhanced
const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.moonlitGrey,
    padding: 40,
    fontFamily: 'Helvetica',
    color: COLORS.white,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: `2px solid ${COLORS.vividPurple}`,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
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
    fontSize: 12,
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
  },
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
  sectionLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.electricBlue,
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  box: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
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
  codeBox: {
    backgroundColor: COLORS.codeBackground,
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    borderLeft: `3px solid ${COLORS.neonGreen}`,
  },
  codeTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.neonGreen,
    marginBottom: 6,
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
    borderLeft: `4px solid ${COLORS.electricBlue}`,
  },
  });

// ==================== INTERFACE ====================
interface CRMSection12PagesProps {
  score: number;
  benchmark: number;
  situationText: string;
  situationBullets: string[];
  impactText: string;
  impactMetrics: Array<{
    label: string;
    value: string;
  }>;
  solutionText: string;
  leadResponseStats: {
    currentResponseTime: string;
    benchmarkResponseTime: string;
    lostDealsPerMonth: number;
    lostRevenuePerMonth: number;
  };
}

export const CRMSection12Pages: React.FC<CRMSection12PagesProps> = (props) => {
  const { score, benchmark } = props;

  return (
    <>
      {/* ==================== PAGES 1-2: From CRMSectionEnhanced ==================== */}
      <CRMSectionEnhanced {...props} />

      {/* ==================== PAGE 3: EMAIL AUTOMATION SETUP ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>6. ENGAGE (CRM & AUTOMATION)</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Email Automation: Welcome Sequence</Text>
        <Text style={styles.pageSubtitle}>
          73% of leads never return after first contact (HubSpot). Welcome sequence = automated nurture
          that converts 50-60% more leads vs single-touch. Here's how to setup in 2-3h.
        </Text>

        <Text style={styles.sectionLabel}>✉ WHY WELCOME SEQUENCES MATTER</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Email automation ROI: </Text>
            Campaign Monitor study: automated emails generate <Text style={styles.highlightText}>320% more revenue</Text> than
            broadcast emails. Welcome sequences have <Text style={styles.highlightText}>4x higher open rate</Text> (50-60% vs 15-20%)
            and <Text style={styles.highlightText}>5x higher CTR</Text>. Reason: recency bias - leads are most engaged within
            48h after signup. Every hour of delay = -10% conversion rate (McKinsey data).
          </Text>
        </View>

        <Text style={styles.sectionLabel}>📋 3-EMAIL WELCOME SEQUENCE TEMPLATE</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Email 1 (Instant):</Text> Confirmation + value. "Thank you for contacting us. Here's what you can
              expect..." Include quick win resource (PDF, checklist, video).
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Email 2 (+24h):</Text> Education + social proof. Case study, testimonials, how-to guide.
              Soft CTA: "Want to see how it works? Book 15-min demo."
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Email 3 (+72h):</Text> Strong CTA + urgency. "Last chance to book demo this week"
              or "Limited spots for onboarding call". Include calendar link (Calendly).
            </Text>
          </View>
        </View>

        {/* 3-Path Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Mailchimp/SendGrid',
              difficulty: 'LOW',
              cost: '€0-100/mo',
              time: '3-4h setup',
              forWhom: 'Small teams, early stage, tech-savvy founders',
              steps: [
                'Setup Mailchimp/SendGrid account (free tier up to 2k subscribers)',
                'Create 3 email templates (use AI for draft, manual editing)',
                'Build automation workflow (trigger: new contact → delay 24h → email 2 → delay 48h → email 3)',
                'A/B test subject lines (2 variants per email)',
                'Monitor metrics (open rate, CTR, conversions) in dashboard',
              ],
              roi: '€6,000/year (20% lead → customer conversion uplift × 50 leads/mo × €250 avg = €2.5k/mo × 12 = €30k/year, minus €1.2k/year cost)',
              breakEven: '1-2 months',
            },
            {
              number: 2,
              title: 'Agency - Full Email Marketing Setup',
              difficulty: 'LOW',
              cost: '€2,500-4,000',
              time: '2-3 weeks',
              forWhom: 'Companies without in-house marketing, need professional copywriting',
              steps: [
                'Platform selection + migration (ActiveCampaign/HubSpot)',
                'Copywriting (6-10 email templates) + design',
                'Advanced segmentation setup (behavioral, demographic)',
                'Deliverability optimization (SPF, DKIM, DMARC setup)',
                'Quarterly review + optimization (A/B test reports)',
              ],
              roi: '€12,000/year (35% conversion uplift × 60 leads/mo × €250 = €5.25k/mo × 12 = €63k/year, minus €4k setup)',
              breakEven: '4-6 months',
            },
            {
              number: 3,
              title: 'Hybrid - Agency Templates + DIY Management',
              difficulty: 'MEDIUM',
              cost: '€800-1,200',
              time: '1-2 weeks',
              forWhom: 'Best value: professional setup, internal optimization',
              steps: [
                'Agency: Email templates + copywriting (1 week)',
                'Agency: Initial automation setup + training',
                'DIY: A/B testing + ongoing optimization',
                'DIY: List segmentation + personalization',
                'Agency: Monthly check-in call (1h/mo)',
              ],
              roi: '€8,000/year (25% uplift × 55 leads/mo × €250 = €3.4k/mo × 12 = €41k/year, minus €1.2k setup)',
              breakEven: '2-3 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] COPY-PASTE: Email 1 Template (Instant Confirmation)',
            code: `Subject: [*] Received - Response within 1h

Hi {{first_name}},

Thanks for reaching out to [Company Name]!

I've received your message and will personally respond
within the next hour (usually much faster).

While you wait, here's a free resource that 90% of our
clients find valuable:

[*] [Download: Ultimate CRM Setup Checklist]
(Link to PDF/Google Drive)

What to expect next:
[*] Personal response from me (not a bot!)
[*] Custom proposal tailored to your needs
[*] Free 30-min strategy call (no pressure)

Quick question: What's your #1 challenge with lead
management right now? Hit reply and let me know - I'll
address it specifically in my response.

Talk soon,
[Your Name]
[Your Title]
[Company Name]

P.S. If you want to skip the wait, you can book a call
directly: [Calendly Link]

---
This email was sent because you submitted a contact form
at [website.com]. Questions? Reply to this email.`,
          }}
          whyItWorks={{
            text: '**Welcome email stats**: Campaign Monitor shows that welcome emails have **50-60% open rate** (vs 15-20% for regular emails). **Timing matters**: emails sent within **1h** have 7x higher CTR than those after 24h. **Multi-touch**: 3-email sequence converts **40-60% more** than single email (HubSpot 2024). **Personalization**: using {{first_name}} increases open rate by **26%** (Experian study).',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 14 of 23</Text>
        </View>
      </Page>

      {/* ==================== PAGE 4: LEAD NURTURING ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>6. ENGAGE (CRM & AUTOMATION)</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Lead Nurturing: Drip Campaigns</Text>
        <Text style={styles.pageSubtitle}>
          80% of leads don't buy immediately (Forrester Research). Nurture campaigns = automated content delivery over
          30-90 days that converts "maybe" → "yes". ROI: 50% higher sales-ready leads at 33% lower cost.
        </Text>

        <Text style={styles.sectionLabel}>[*] BEHAVIORAL TRIGGER CAMPAIGNS</Text>
        <View style={styles.box}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Trigger-based nurturing</Text> = emails sent in response to specific actions (e.g. download
            ebook, visit pricing page, abandon cart). <Text style={styles.highlightText}>78% of marketers</Text> say that
            behavioral triggers are the most effective tactic (DemandGen 2024).
          </Text>
        </View>

        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Trigger 1: Downloaded resource</Text> → Send related case study (+24h) → Invite to webinar
              (+48h) → Offer consultation (+7 days)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Trigger 2: Visited pricing page 3x</Text> → Send pricing comparison (+instant) → Customer
              testimonials (+24h) → Limited-time discount (+48h)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Trigger 3: Abandoned form</Text> → Reminder email (+1h) → Offer help via chat (+4h) →
              Simplify form to 3 fields only (+24h)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Trigger 4: Email opened 5x but no click</Text> → Send different CTA format (+next send) →
              A/B test subject line → Segment to "highly engaged" list
            </Text>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>▥ ZAPIER WORKFLOW: Behavioral Trigger Setup</Text>
          <Text style={components.codeBlockText}>{`// Trigger: Page visit tracking (use Google Tag Manager)
Trigger: Specific Page Viewed
Page URL: contains "/pricing"
Frequency: 3 times in 7 days

// Action 1: Add tag to CRM contact
CRM: Add Tag "High Intent - Pricing Page Visitor"

// Action 2: Send targeted email
Email Platform: ActiveCampaign/Mailchimp
Template: "Pricing_Page_Nurture_Email_1"
Delay: Immediate (but check: not sent this email in last 7 days)

// Action 3: Notify sales team (if high-value lead)
IF: Contact has tag "Enterprise" OR Company Size > 50
THEN: Send Slack notification to #sales
Message: "🔥 HIGH INTENT LEAD: {{contact_name}} visited pricing 3x"

// Action 4: Schedule follow-up
Create Task in CRM:
Title: "Follow up with {{contact_name}} re: pricing questions"
Assign to: Account Executive (round-robin)
Due: Tomorrow 10 AM`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Content cadence best practices: </Text>
            Week 1-2: 2 emails (educational content, no sales pitch). Week 3-4: 1 email/week (case studies, ROI calculators).
            Week 5-8: Biweekly (testimonials, product updates). Week 9-12: Monthly (industry insights, invites to events).
            <Text style={styles.highlightText}> Never more than 2 emails/week</Text> - risk of unsubscribes.
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 15 of 23</Text>
        </View>
      </Page>

      {/* ==================== PAGE 5: LEAD SCORING ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>6. ENGAGE (CRM & AUTOMATION)</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Lead Scoring: Prioritization System</Text>
        <Text style={styles.pageSubtitle}>
          80% sales time wasted on unqualified leads (Salesforce). Lead scoring = automated prioritization that
          focuses team on hot leads. Result: 77% higher conversion rate + 50% shorter sales cycle.
        </Text>

        <Text style={styles.sectionLabel}>◉ WHY LEAD SCORING MATTERS</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Lead scoring ROI: </Text>
            HubSpot study: companies with lead scoring have <Text style={styles.highlightText}>77% higher conversion rate</Text>.
            Why? Sales team focuses on <Text style={styles.highlightText}>top 20%</Text> of leads that generate
            80% revenue (Pareto principle). Without scoring = treating all equally = <Text style={styles.highlightText}>
            wasting 60% sales time</Text> on cold leads (Forrester Research).
          </Text>
        </View>

        <Text style={styles.sectionLabel}>[+] SCORING MODEL EXAMPLE</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Behavioral Signals:</Text> Email open +5 pts | Link click +10 | Form submit +20 |
              Pricing page visit +15 | Demo request +30 | Return visitor (5x) +25
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Demographic Signals:</Text> Company size &gt;50 employees +25 | Director+ title +20 |
              Target industry +15 | Budget authority +20 | Buying timeline &lt;3 months +15
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Negative Signals:</Text> Personal email (@gmail) -10 | Competitor -20 | Student -15 |
              Job seeker -10 | Unsubscribed -30
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Score Thresholds:</Text> 0-30 (Cold) → nurture sequence | 31-60 (Warm) → sales outreach
              | 61-100 (Hot) → immediate call | 100+ (Very Hot) → priority handling
            </Text>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>▥ SQL: Lead Scoring Query</Text>
          <Text style={components.codeBlockText}>{`-- Calculate lead score from CRM data
SELECT
  c.contact_id,
  c.email,
  c.company,
  -- Behavioral scoring
  (COALESCE(e.email_opens, 0) * 5) +
  (COALESCE(e.link_clicks, 0) * 10) +
  (COALESCE(f.form_submissions, 0) * 20) +
  (COALESCE(p.pricing_visits, 0) * 15) +
  -- Demographic scoring
  CASE WHEN c.company_size > 50 THEN 25 ELSE 0 END +
  CASE WHEN c.job_title LIKE '%Director%' OR
            c.job_title LIKE '%VP%' OR
            c.job_title LIKE '%C_O%'
       THEN 20 ELSE 0 END +
  -- Negative scoring
  CASE WHEN c.email LIKE '%@gmail.com' THEN -10 ELSE 0 END +
  CASE WHEN c.unsubscribed = 1 THEN -30 ELSE 0 END
  AS lead_score,
  CASE
    WHEN lead_score >= 100 THEN 'Very Hot'
    WHEN lead_score >= 61 THEN 'Hot'
    WHEN lead_score >= 31 THEN 'Warm'
    ELSE 'Cold'
  END as lead_status
FROM contacts c
LEFT JOIN email_engagement e ON c.contact_id = e.contact_id
LEFT JOIN form_data f ON c.contact_id = f.contact_id
LEFT JOIN page_visits p ON c.contact_id = p.contact_id
  AND p.page_url LIKE '%/pricing%'
WHERE c.created_at > DATE_SUB(NOW(), INTERVAL 90 DAY)
ORDER BY lead_score DESC
LIMIT 100;`}</Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Implementation tip: </Text>
            Start simple (5-7 scoring rules), not 50+. Monitor monthly and adjust weights based on actual conversion data.
            <Text style={styles.highlightText}> Hot leads</Text> should represent 10-15% of total leads - if more/less,
            recalibrate thresholds.
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 16 of 23</Text>
        </View>
      </Page>

      {/* ==================== PAGE 6: CRM INTEGRATION ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>6. ENGAGE (CRM & AUTOMATION)</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>CRM Integration: Unified Data Hub</Text>
        <Text style={styles.pageSubtitle}>
          Data scattered = 30% accuracy (Gartner). Unified CRM = single source of truth for entire organization.
          ROI: 34% higher sales productivity + 47% better customer retention (Aberdeen Group).
        </Text>

        <Text style={styles.sectionLabel}>[TOOL] PLATFORM COMPARISON</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>HubSpot:</Text> Best for SMB (0-200 employees). Free tier excellent. Native automation.
              Email marketing included. Steep price jump at scale. €€-€€€€
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Pipedrive:</Text> Best for sales-focused teams. Clean UI, low learning curve. Great
              mobile app. Limited marketing automation. €-€€
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Salesforce:</Text> Enterprise-grade (200+ employees). Highly customizable.
              Complex setup. Requires admin/consultant. €€€€€
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>●</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Airtable:</Text> Best for early-stage startups. Flexible, no-code. Great for
              custom workflows. Not true CRM (lacks native features). €
            </Text>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] HubSpot API: Create Contact + Deal</Text>
          <Text style={components.codeBlockText}>{`const hubspot = require('@hubspot/api-client');
const client = new hubspot.Client({
  accessToken: process.env.HUBSPOT_API_KEY
});

// Step 1: Create or update contact
const contactData = {
  properties: {
    email: "john@acme-corp.com",
    firstname: "John",
    lastname: "Doe",
    phone: "+48123456789",
    company: "Acme Corp",
    jobtitle: "Marketing Director",
    lead_source: "Contact Form",
    lead_status: "New",
    hs_lead_score: 75  // from scoring model
  }
};

const contact = await client.crm.contacts.basicApi
  .create(contactData);

// Step 2: Create deal
const dealData = {
  properties: {
    dealname: "Acme Corp - CRM Setup",
    dealstage: "appointmentscheduled",
    pipeline: "default",
    amount: 5000,
    closedate: "2025-12-31",
    hubspot_owner_id: "12345678"  // assign to rep
  },
  associations: [{
    to: { id: contact.id },
    types: [{ associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 3 }]  // contact-to-deal
  }]
};

const deal = await client.crm.deals.basicApi
  .create(dealData);

console.log(\`[*] Contact \${contact.id} + Deal \${deal.id} created\`);`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Zapier vs Native Integration: </Text>
            Zapier = easy setup (2-3h), limited to trigger-action pairs, costs scale with volume (€30-200/mo).
            Native = more complex (4-8h), full feature access, one-time cost or included in CRM plan.
            <Text style={styles.highlightText}> Recommended: Start Zapier → migrate native</Text> when hitting limits.
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 17 of 23</Text>
        </View>
      </Page>

      {/* PAGE 7: Sales Pipeline Optimization */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>[+] CRM AUTOMATION - PAGE 7/12</Text>
        <Text style={styles.pageTitle}>Sales Pipeline Optimization</Text>
        <Text style={styles.subtitle}>Visibility + Bottleneck Elimination + Conversion Rate Boost</Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Most companies have no visibility into sales pipeline. They don't know:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Where most leads are lost:</Text> Proposal stage? Demo? Pricing?
                No concrete data → no action plan.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Avg time in each stage:</Text> Leads stuck 30+ days in "Qualification" =
                dead lead (Forrester: lead value drops 80% after 30 days).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Conversion rates per stage:</Text> New → Qualified (50%?), Qualified → Demo (20%?),
                Demo → Proposal (60%?), Proposal → Closed Won (30%?). Without dashboard = blind spot.
              </Text>
            </View>
          </View>
        </View>

        {/* WPŁYW */}
        <Text style={styles.sectionLabel}>[EUR] IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            Pipeline leakage = masywne revenue loss. Example: 100 leads/mo → 50 qualified → 10 demos → 6 proposals → 2 closed.
            Overall conversion: 2% (benchmark: 15-20% for B2B).
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] REVENUE LOSS CALCULATION</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Pipeline value:</Text> 100 leads × €250 avg deal = €25,000 potential/mo
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Current conversion:</Text> 2% → €500 actual revenue/mo
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Target conversion (optimized):</Text> 12% (conservative) → €3,000/mo
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Monthly revenue loss:</Text> €2,500/mo → <Text style={styles.highlightText}>€30,000/year</Text>
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Plus: sales team time waste:</Text> Reps spend 40% time na dead leads (Salesforce study)
            = €15k/year salary waste → <Text style={styles.highlightText}>€45,000/year total impact</Text>
          </Text>
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            3-step fix: (1) Setup pipeline stages + tracking, (2) Build conversion funnel dashboard (SQL/Looker/HubSpot),
            (3) Weekly pipeline review meetings (15 min) + action items for bottlenecks.
          </Text>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>▥ SQL: Pipeline Conversion Analysis</Text>
          <Text style={components.codeBlockText}>{`-- Analyze conversion rates between stages
WITH stage_progression AS (
  SELECT
    d.deal_id,
    d.deal_name,
    d.created_at,
    d.close_date,
    ds.stage_name,
    ds.entered_at as stage_entered,
    LEAD(ds.stage_name) OVER (PARTITION BY d.deal_id ORDER BY ds.entered_at) as next_stage,
    LEAD(ds.entered_at) OVER (PARTITION BY d.deal_id ORDER BY ds.entered_at) as next_stage_time,
    DATEDIFF(
      LEAD(ds.entered_at) OVER (PARTITION BY d.deal_id ORDER BY ds.entered_at),
      ds.entered_at
    ) as days_in_stage
  FROM deals d
  LEFT JOIN deal_stages ds ON d.deal_id = ds.deal_id
  WHERE d.created_at &gt;= DATE_SUB(NOW(), INTERVAL 90 DAY)
)
SELECT
  stage_name as current_stage,
  next_stage,
  COUNT(DISTINCT deal_id) as deals_entered,
  COUNT(DISTINCT CASE WHEN next_stage IS NOT NULL THEN deal_id END) as deals_progressed,
  ROUND(
    COUNT(DISTINCT CASE WHEN next_stage IS NOT NULL THEN deal_id END) * 100.0 /
    COUNT(DISTINCT deal_id), 1
  ) as conversion_rate_pct,
  ROUND(AVG(days_in_stage), 1) as avg_days_in_stage,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY days_in_stage), 1) as median_days
FROM stage_progression
WHERE stage_name != 'Closed Won' AND stage_name != 'Closed Lost'
GROUP BY stage_name, next_stage
ORDER BY
  FIELD(stage_name, 'New Lead', 'Qualified', 'Demo Scheduled', 'Demo Complete',
        'Proposal Sent', 'Negotiation', 'Verbal Commit');

-- OUTPUT EXAMPLE:
-- current_stage    | next_stage      | deals | progressed | conv_% | avg_days | median
-- New Lead         | Qualified       | 100   | 52         | 52%    | 3.2      | 2
-- Qualified        | Demo Scheduled  | 52    | 18         | 35%    | 7.5      | 5    ← BOTTLENECK!
-- Demo Scheduled   | Demo Complete   | 18    | 15         | 83%    | 2.1      | 2
-- Demo Complete    | Proposal Sent   | 15    | 12         | 80%    | 4.3      | 3
-- Proposal Sent    | Closed Won      | 12    | 4          | 33%    | 14.2     | 12   ← BOTTLENECK!`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Action z tego SQL: </Text>
            Bottleneck #1 (Qualified → Demo: 35%) = improve qualification criteria (bad fit leads).
            Bottleneck #2 (Proposal → Won: 33%, 14 dni avg) = proposal follow-up automation (Page 8) + pricing objection handling (Page 10).
            <Text style={styles.highlightText}> Weekly dashboard review = 20-30% conversion boost</Text> (Gong.io study).
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 18 of 23</Text>
        </View>
      </Page>

      {/* PAGE 8: Follow-up Automation */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>T CRM AUTOMATION - PAGE 8/12</Text>
        <Text style={styles.pageTitle}>Automated Follow-up System</Text>
        <Text style={styles.subtitle}>Task Creation + Reminders + Multi-touch Sequences</Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            80% of follow-up tasks never get completed (Salesforce study). Problem:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Manual task creation:</Text> Rep must remember "follow up in 3 days after demo" →
                they forget or postpone indefinitely.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>No accountability:</Text> No automatic reminder system → manager doesn't see
                missed follow-ups until weekly review (too late).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Inconsistent timing:</Text> Rep A follows up 2h after demo, Rep B waits 5 days →
                buyer journey disrupted.
              </Text>
            </View>
          </View>
        </View>

        {/* WPŁYW */}
        <Text style={styles.sectionLabel}>[EUR] IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            InsideSales.com study: each additional follow-up attempt increases reply chances by 25%. Most companies
            only make 1-2 attempts (should be 5-8). Missing follow-ups = lost deals.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] REVENUE LOSS CALCULATION</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Demos per month:</Text> 20 demos
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Current follow-up completion:</Text> 20% (4/20 demos get proper follow-up)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Conversion with follow-up:</Text> 40% (8 deals potential if all 20 followed up)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Conversion without follow-up:</Text> 10% (1.6 deals from 16 missed follow-ups)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Lost deals/month:</Text> (16 × 40%) - (16 × 10%) = 4.8 deals/mo
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Monthly revenue loss:</Text> 4.8 × €250 = €1,200/mo → <Text style={styles.highlightText}>€14,400/year</Text>
          </Text>
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            Automated task creation based on deal stage changes. Example: Deal moves to "Demo Complete" →
            auto-create task "Send proposal" (due: +2 days) + "Follow-up call" (due: +4 days) + assign to deal owner.
          </Text>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] Zapier: Auto-Create Follow-up Tasks</Text>
          <Text style={components.codeBlockText}>{`// Trigger: Deal stage changed in HubSpot/Pipedrive
// Example: Stage changed to "Demo Complete"

// Step 1: Delay (2 days)
Delay For: 2 days

// Step 2: Check if deal still in "Demo Complete" (not moved/closed)
Filter: Deal Stage equals "Demo Complete"

// Step 3: Create Task in CRM
Action: Create Task (HubSpot)
Fields:
  - Title: "Send proposal to {{deal_contact_name}}"
  - Due Date: {{current_date + 2 days}}
  - Assigned To: {{deal_owner_id}}
  - Priority: High
  - Notes: "Follow up demo from {{demo_date}}. Key points discussed: {{demo_notes}}"

// Step 4: Send Slack reminder to rep
Send to Channel: @{{deal_owner_slack_handle}}
Message: "🚨 TASK DUE: Send proposal to {{deal_contact_name}} ({{company}}) by {{due_date}}.
Deal value: €{{deal_amount}}. Demo notes: {{demo_notes_url}}"

// Step 5: Create 2nd follow-up task (4 days out)
Action: Create Task (HubSpot)
Fields:
  - Title: "Follow-up call with {{deal_contact_name}}"
  - Due Date: {{current_date + 4 days}}
  - Assigned To: {{deal_owner_id}}
  - Notes: "Check if proposal received, answer questions, schedule next steps"

// VARIANT: Multi-touch sequence (5-8 touchpoints)
// Day 0: Demo
// Day 2: Proposal email (automated)
// Day 4: Follow-up call (task reminder)
// Day 7: Case study email (automated)
// Day 10: Pricing FAQ email (automated)
// Day 14: "Is this still a priority?" email (automated)
// Day 21: Final breakup email ("closing file") - often triggers response!`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Why Multi-touch Works: </Text>
            TOPO research: B2B buyers need avg 8 touchpoints before purchase decision. Woodpecker study: 6-email sequence
            has 2x reply rate vs 1-email. "Breakup email" (last attempt) often gets 30-40% response (urgency trigger).
            <Text style={styles.highlightText}> Automation ensures consistency</Text> (every lead gets same experience).
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 19 of 23</Text>
        </View>
      </Page>

      {/* PAGE 9: Reporting & Analytics Dashboard */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>[UP] CRM AUTOMATION - PAGE 9/12</Text>
        <Text style={styles.pageTitle}>CRM Reporting & Analytics</Text>
        <Text style={styles.subtitle}>Real-time Dashboards + KPIs + Data-Driven Decisions</Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Most companies don't have live CRM dashboards. Monthly reports in Excel (manual data pull) = outdated by the time
            they're ready. No real-time visibility:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Pipeline value:</Text> How much €€ currently in pipeline? Split by stage/rep/source?
                Manager only finds out from monthly spreadsheet.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Rep performance:</Text> Who converts best? Who has most stuck deals?
                No comparative metrics → no coaching opportunities.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Lead source ROI:</Text> Organic vs PPC vs referrals - which source gives best quality
                leads? Without attribution = blind marketing spend.
              </Text>
            </View>
          </View>
        </View>

        {/* WPŁYW */}
        <Text style={styles.sectionLabel}>[EUR] IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            Data-driven companies are 23x more profitable (McKinsey). No dashboards = reactive decisions
            (firefighting) instead of proactive optimization. Example: Marketing spends €5k/mo on PPC with 2% conversion,
            while organic has 18% conversion → misallocated budget.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] COST OF POOR REPORTING</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Manual reporting time:</Text> 8h/mo (manager pulling data) × €50/h = €400/mo wasted
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Delayed insights:</Text> Spot pipeline issues 3-4 weeks late → €2,000/mo lost deals
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Marketing misallocation:</Text> €1,500/mo spent on low-ROI channels (unknown attribution)
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Total monthly cost:</Text> €400 + €2,000 + €1,500 = €3,900/mo → <Text style={styles.highlightText}>€46,800/year</Text>
          </Text>
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            Build live dashboard (Google Data Studio/Looker/HubSpot native) z 6 kluczowych KPIs tracked real-time.
            Weekly 15-min review meeting → spot trends early, action on bottlenecks fast.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[+] 6 MUST-TRACK CRM KPIs</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Pipeline Value by Stage:</Text> Total € in each stage + month-over-month trend.
                Alert if drops &gt;20% week-over-week.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Conversion Rate by Stage:</Text> New → Qualified → Demo → Proposal → Won.
                Benchmark against historical avg.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Avg Deal Cycle Length:</Text> Days from "New Lead" to "Closed Won". Target: &lt;30 days
                (B2B SMB), &lt;90 days (Enterprise).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Lead Source Attribution:</Text> Conversion rate + avg deal size by source (Organic/PPC/Referral/Cold).
                ROI = (Revenue - Cost) / Cost.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Rep Performance:</Text> Deals closed, avg deal size, conversion rate per rep. Identify
                top performers (replicate tactics) + struggling reps (coaching needed).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>6.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Follow-up Compliance:</Text> % of tasks completed on time. Target: &gt;90%. If &lt;70% =
                process breakdown (automation needed).
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>▥ SQL: Lead Source ROI Analysis</Text>
          <Text style={components.codeBlockText}>{`-- Calculate ROI by lead source (last 90 days)
SELECT
  l.lead_source,
  COUNT(DISTINCT l.lead_id) as total_leads,
  COUNT(DISTINCT CASE WHEN d.deal_stage = 'Closed Won' THEN d.deal_id END) as closed_deals,
  ROUND(
    COUNT(DISTINCT CASE WHEN d.deal_stage = 'Closed Won' THEN d.deal_id END) * 100.0 /
    COUNT(DISTINCT l.lead_id), 1
  ) as conversion_rate_pct,
  ROUND(AVG(CASE WHEN d.deal_stage = 'Closed Won' THEN d.deal_amount END), 0) as avg_deal_size,
  ROUND(SUM(CASE WHEN d.deal_stage = 'Closed Won' THEN d.deal_amount ELSE 0 END), 0) as total_revenue,
  -- Assume marketing cost per lead (adjust based on actual spend)
  CASE l.lead_source
    WHEN 'PPC' THEN COUNT(DISTINCT l.lead_id) * 45  -- €45/lead PPC cost
    WHEN 'Organic' THEN COUNT(DISTINCT l.lead_id) * 5  -- €5/lead SEO cost
    WHEN 'Referral' THEN 0  -- free
    WHEN 'Cold Outreach' THEN COUNT(DISTINCT l.lead_id) * 15  -- €15/lead sales time
    ELSE COUNT(DISTINCT l.lead_id) * 20
  END as estimated_cost,
  ROUND(
    (SUM(CASE WHEN d.deal_stage = 'Closed Won' THEN d.deal_amount ELSE 0 END) -
     CASE l.lead_source
       WHEN 'PPC' THEN COUNT(DISTINCT l.lead_id) * 45
       WHEN 'Organic' THEN COUNT(DISTINCT l.lead_id) * 5
       WHEN 'Referral' THEN 0
       WHEN 'Cold Outreach' THEN COUNT(DISTINCT l.lead_id) * 15
       ELSE COUNT(DISTINCT l.lead_id) * 20
     END
    ) * 100.0 /
    NULLIF(CASE l.lead_source
      WHEN 'PPC' THEN COUNT(DISTINCT l.lead_id) * 45
      WHEN 'Organic' THEN COUNT(DISTINCT l.lead_id) * 5
      WHEN 'Referral' THEN 0
      WHEN 'Cold Outreach' THEN COUNT(DISTINCT l.lead_id) * 15
      ELSE COUNT(DISTINCT l.lead_id) * 20
    END, 0), 1
  ) as roi_pct
FROM leads l
LEFT JOIN deals d ON l.lead_id = d.lead_id
WHERE l.created_at &gt;= DATE_SUB(NOW(), INTERVAL 90 DAY)
GROUP BY l.lead_source
ORDER BY roi_pct DESC;

-- OUTPUT EXAMPLE:
-- source      | leads | deals | conv% | avg€  | revenue | cost  | ROI%
-- Referral    | 15    | 6     | 40%   | €320  | €1,920  | €0    | ∞
-- Organic     | 45    | 12    | 27%   | €280  | €3,360  | €225  | 1,393%  ← BEST!
-- Cold        | 30    | 4     | 13%   | €250  | €1,000  | €450  | 122%
-- PPC         | 60    | 3     | 5%    | €200  | €600    | €2,700| -78%    ← KILL!`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Action from this SQL: </Text>
            PPC has negative ROI (-78%) → pause or optimize targeting (narrow audience, high-intent keywords only).
            Organic has 1,393% ROI → double down (more SEO/content investment). Referral program = infinite ROI → incentivize customers.
            <Text style={styles.highlightText}> Data-driven reallocation = instant profit boost</Text> (reallocate €2.7k PPC → Organic).
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 20 of 23</Text>
        </View>
      </Page>

      {/* PAGE 10: Team Enablement & Training */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>👥 CRM AUTOMATION - PAGE 10/12</Text>
        <Text style={styles.pageTitle}>Sales Team Enablement</Text>
        <Text style={styles.subtitle}>Playbooks + Scripts + Objection Handling + Onboarding</Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Even best CRM automation fails if sales team doesn't know how to use it or what to say at each buyer journey stage.
            Common issues:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Brak standardized pitch:</Text> Rep A says X, Rep B says Y → inconsistent messaging,
                confuses buyers.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Objection paralysis:</Text> "It's too expensive" → rep nie ma prepared response →
                deal lost instantly.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>New hire ramp time:</Text> 3-6 months before productive (Salesforce avg). Brak structured
                onboarding = learning by trial & error (expensive).
              </Text>
            </View>
          </View>
        </View>

        {/* WPŁYW */}
        <Text style={styles.sectionLabel}>[EUR] IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            HubSpot study: companies z sales playbooks have 33% higher win rates. Gong.io analysis: top reps use specific
            objection handling frameworks (LAER, Feel-Felt-Found) → 2x success rate vs winging it.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] COST OF POOR ENABLEMENT</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>New hire ramp time:</Text> 4 months avg × €3,000/mo salary = €12,000 cost before ROI positive
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>With playbook (2-month ramp):</Text> 2 × €3,000 = €6,000 → save €6,000 per new hire
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Lost deals (poor objection handling):</Text> 40% of deals lost to price objection
            (could be saved with framework) = 4 deals/mo × €250 = €1,000/mo lost
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Annual impact:</Text> €6,000 (per hire) + €12,000/year (lost deals) = <Text style={styles.highlightText}>€18,000+/year</Text>
          </Text>
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            Create 3 core assets: (1) Sales Playbook (Google Doc/Notion), (2) Objection Handling Cheat Sheet, (3) New Hire
            30-Day Onboarding Plan. Store w CRM (HubSpot Knowledge Base) → accessible during calls.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📖 SALES PLAYBOOK TEMPLATE</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Ideal Customer Profile (ICP):</Text> Company size, industry, pain points, budget range,
                decision makers. Example: "50-200 employees, SaaS/ecommerce, struggling with lead response time, €5-20k marketing budget".
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Value Proposition (1-sentence):</Text> "We help [ICP] achieve [outcome] by [unique method]
                in [timeframe]." Example: "We help SaaS companies boost lead conversion 2-3x via CRM automation in 90 days."
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Discovery Questions (SPIN selling):</Text> Situation (current setup?), Problem (what's not working?),
                Implication (cost of inaction?), Need-Payoff (what would success look like?).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Demo Flow:</Text> Problem → Solution → Proof (case study) → CTA (next steps). Max 20 min,
                feature-light (show outcomes not buttons).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Pricing Presentation:</Text> 3 tiers (Good/Better/Best), anchor high (start with Best tier),
                include ROI calc (payback period).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>6.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Closing Techniques:</Text> Assumptive close ("When should we start?"), Urgency ("Onboarding slots
                filling for Q1"), Trial close ("Does this solve your problem?").
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] TOP 5 OBJECTION HANDLERS</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>"It's too expensive"</Text> → "I understand. Let me ask - what's the cost of NOT fixing
                this? You mentioned losing €2k/month to poor follow-up. Our solution pays for itself in &lt;2 months. After that it's
                pure profit. Does break-even in 60 days work for you?"
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>"We need to think about it"</Text> → "Totally fair. What specific concerns do you need to
                think through? [Listen] Great - let me address those now so you have clarity. [Handle objections]"
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>"We're already using [competitor]"</Text> → "That's great - means you value this problem.
                What made you take this call if you're happy with them? [Uncover pain] Here's where we differ: [unique value prop]."
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>"We don't have budget right now"</Text> → "I get it. When does your next budget cycle start?
                [Q1 2026] Perfect - let's get you on calendar for December to prepare. In meantime, I'll send ROI breakdown to build
                internal case."
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>"Can you send pricing via email?"</Text> → "Absolutely - but pricing depends on your specific
                needs. Let me ask 3 quick questions so I send accurate quote: [qualify]. Also - most clients prefer 15-min walkthrough
                to see ROI calc. Does Tuesday 2pm work?"
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Implementation: </Text>
            Store playbook w CRM knowledge base (HubSpot/Notion). Weekly role-play sessions (30 min) practicing objection handling.
            Record top performer calls (Gong.io/Chorus.ai) → extract winning patterns → add to playbook.
            <Text style={styles.highlightText}> Playbook = living document</Text> (update monthly based on what works).
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 21 of 23</Text>
        </View>
      </Page>

      {/* PAGE 11: Advanced Workflows */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>⚙️ CRM AUTOMATION - PAGE 11/12</Text>
        <Text style={styles.pageTitle}>Advanced Multi-Channel Workflows</Text>
        <Text style={styles.subtitle}>Complex Automation + Multi-step Logic + Integrations</Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔍 SITUATION - Where You Are Now</Text>
        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            Basic automation (Page 2-8) covers 80% use cases. But advanced scenarios require multi-step logic:
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Lead scoring threshold triggers:</Text> When lead score hits 100 → auto-assign to senior rep
                + send Slack alert + create high-priority task.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Multi-channel sequences:</Text> Email → no open after 3 days → send LinkedIn message →
                still no response → auto-dial via VoIP integration (RingCentral/Aircall).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Conditional branching:</Text> Demo attendee → interested in Feature A → send Case Study A
                email. Interested in Feature B → send different case study. Zapier can't handle complex logic → need Make.com/n8n.
              </Text>
            </View>
          </View>
        </View>

        {/* WPŁYW */}
        <Text style={styles.sectionLabel}>[EUR] IMPACT - What It Costs You</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            McKinsey: Advanced automation = 40-50% reduction w manual work (vs 20-30% basic automation). Multi-channel
            outreach has 3x response rate vs email-only (Salesforce study). Hot leads (score &gt;100) convert at 60% vs
            20% cold leads → instant prioritization = huge impact.
          </Text>
        </View>

        <View style={styles.calculationBox}>
          <Text style={styles.calcTitle}>[+] ADVANCED AUTOMATION ROI</Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Manual work saved:</Text> 15h/mo (rep time) × €40/h = €600/mo saved
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Hot lead prioritization:</Text> 10 hot leads/mo (score &gt;100) routed instantly →
            60% close rate vs 20% without = 4 extra deals/mo × €250 = €1,000/mo revenue boost
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Multi-channel response lift:</Text> 20 cold leads/mo → email-only 5% response (1 lead),
            email+LinkedIn 15% response (3 leads) = 2 extra qualified leads/mo × 30% close = 0.6 deals × €250 = €150/mo
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Monthly impact:</Text> €600 + €1,000 + €150 = €1,750/mo → <Text style={styles.highlightText}>€21,000/year</Text>
          </Text>
          <Text style={styles.calcStep}>
            <Text style={styles.calcValue}>Tool cost (Make.com Pro):</Text> €29/mo → ROI: 6,034%
          </Text>
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>[*] SOLUTION - What To Do</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            Use Make.com (visual workflow builder, better than Zapier for complex logic) or n8n (open-source, self-hosted).
            Build 3 advanced workflows: (1) Lead scoring trigger, (2) Multi-channel outreach sequence, (3) Deal stage automation.
          </Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>🔥 WORKFLOW 1: Hot Lead Auto-Assignment</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Trigger:</Text> Lead score updated (HubSpot webhook)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Condition:</Text> IF score &gt;= 100 AND status != "Contacted"
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Action 1:</Text> Update lead owner to "Senior Rep" (round-robin among top 3 closers)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Action 2:</Text> Create task "Call this hot lead NOW" (due: today, priority: Urgent)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Action 3:</Text> Send Slack DM to assigned rep: "🔥 HOT LEAD assigned: [name] ([company]).
                Score: [score]. Last activity: [activity]. Call within 1h!"
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Action 4:</Text> Add to "Hot Leads" email sequence (personalized, CEO name mentioned)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Delay:</Text> Wait 2 hours
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Condition:</Text> IF task still not completed
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Action 5:</Text> Send Slack to sales manager: "[!] Hot lead [name] not contacted after 2h.
                Assigned to: [rep]. Reassign?"
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>✉ WORKFLOW 2: Multi-Channel Cold Outreach</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 0:</Text> Lead added to "Cold Outreach" list → send Email #1 (personalized intro)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 3:</Text> IF email not opened → send LinkedIn connection request (via Phantombuster API)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 5:</Text> IF LinkedIn accepted → send LinkedIn message (casual, ask for 15-min chat)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 7:</Text> IF still no response → send Email #2 (case study focus, social proof)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 10:</Text> IF Email #2 opened but no reply → create task "Manual call" for rep
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 14:</Text> IF still no response → send "Breakup email" ("Should I close your file?")
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>→</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Day 21:</Text> IF no response to breakup → mark as "Unresponsive", remove from sequence
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] Make.com: Conditional Branching Logic</Text>
          <Text style={components.codeBlockText}>{`// Module 1: Trigger (HubSpot - New Deal)
Trigger: New Deal Created

// Module 2: Get Contact Data
Action: HubSpot - Get Contact (deal.contact_id)
Output: contact.company_size, contact.industry, contact.job_title

// Module 3: Router (Conditional Branching)
Router:
  Route 1 (Enterprise):
    Condition: company_size > 200
    → Send Email "Enterprise Case Study" (Salesforce migration story)
    → Assign to Enterprise rep
    → Create task "Custom demo prep" (due: +2 days)

  Route 2 (SMB):
    Condition: company_size 10-200
    → Send Email "SMB Quick Win Story" (setup in 2 weeks)
    → Assign to SMB rep
    → Create task "Standard demo" (due: +1 day)

  Route 3 (Startup):
    Condition: company_size < 10
    → Send Email "DIY Guide + Self-Service Trial"
    → Add to nurture sequence (8 emails over 60 days)
    → No rep assignment (self-serve funnel)

// Module 4: Slack Notification (all routes)
Action: Slack - Send Message
Channel: #sales
Message: "New deal: {{contact.name}} ({{company_size}} employees, {{industry}}).
Route: {{route_name}}. Assigned to: {{assigned_rep}}"`}</Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Tool comparison: </Text>
            Zapier = best for simple trigger-action (2-3 steps), €20-200/mo. Make.com = visual builder, unlimited branching,
            €9-29/mo. n8n = open-source (self-hosted), free but requires dev setup. Power Automate = good if all-Microsoft stack.
            <Text style={styles.highlightText}> Start Make.com → migrate to n8n</Text> if volume grows (cost optimization).
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 22 of 23</Text>
        </View>
      </Page>

      {/* PAGE 12: Complete CRM Implementation Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>[*] CRM AUTOMATION - PAGE 12/12</Text>
        <Text style={styles.pageTitle}>Complete Implementation Roadmap</Text>
        <Text style={styles.subtitle}>90-Day Plan + Investment Summary + Expected Results</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[ROADMAP] 90-DAY CRM TRANSFORMATION ROADMAP</Text>

          <Text style={styles.sectionLabel}>WEEK 1-2: Foundation (Quick Wins)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Setup auto-response automation (lead response &lt;1h) - Page 2
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Create 3-email welcome sequence - Page 3
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Implement basic lead scoring (spreadsheet) - Page 5
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 10-12h DIY | <Text style={styles.boldText}>Cost:</Text> €0-200 |
                <Text style={styles.boldText}> ROI:</Text> €8-10k/year
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WEEK 3-4: Nurture & Engagement</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Build behavioral drip campaigns (abandoned cart, webinar follow-up) - Page 4
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Setup automated follow-up tasks (demo → proposal → close) - Page 8
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 8-10h | <Text style={styles.boldText}>Cost:</Text> €0-150 |
                <Text style={styles.boldText}> ROI:</Text> €6-8k/year
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WEEK 5-8: Pipeline & Reporting</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Migrate lead scoring to CRM (HubSpot/Pipedrive) - Page 5
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Build pipeline conversion dashboard (Google Data Studio) - Page 9
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Setup weekly pipeline review meetings - Page 7
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 15-18h | <Text style={styles.boldText}>Cost:</Text> €200-400 |
                <Text style={styles.boldText}> ROI:</Text> €12-15k/year
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>WEEK 9-12: Advanced Automation & Team</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Full CRM integration (API setup, data sync) - Page 6
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Create sales playbook + objection handling scripts - Page 10
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Build advanced workflows (hot lead routing, multi-channel outreach) - Page 11
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time:</Text> 20-25h | <Text style={styles.boldText}>Cost:</Text> €300-500 |
                <Text style={styles.boldText}> ROI:</Text> €18-25k/year
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[EUR] INVESTMENT SUMMARY - 3 PATHS</Text>

          <Text style={styles.sectionLabel}>1. DIY Path - Maximum ROI, Lowest Cost</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[$]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Total Cost:</Text> €500-1,000 (90 days) - tools only (Zapier/HubSpot Starter/Make.com)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>T</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time Investment:</Text> 60-75h over 12 weeks (5-6h/week avg)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[UP]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Break-even:</Text> 1-2 months
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>R</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Revenue Impact (Year 1):</Text> €50-60k annual recovery (conservative estimate)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>ROI:</Text> 5,000-12,000% (€500 → €50-60k)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>👤</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Best for:</Text> Tech-savvy founders, startups, bootstrapped (0-10 employees)
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>2. Hybrid Path - Guided Setup</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[$]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Total Cost:</Text> €3,000-5,000 (consultant setup + tools for 3 months)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>T</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time Investment:</Text> 15-20h (your team learns while consultant builds)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[UP]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Break-even:</Text> 2-3 months
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>R</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Revenue Impact (Year 1):</Text> €60-80k (faster ramp, fewer mistakes)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>ROI:</Text> 1,200-2,667% (€3-5k → €60-80k)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>👤</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Best for:</Text> Growing companies (10-50 employees), want expert guidance + knowledge transfer
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>3. Full Agency - Done-For-You</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[$]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Total Cost:</Text> €8,000-15,000 (full implementation + 3-month support + premium CRM)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>T</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Time Investment:</Text> 5-8h (approval meetings only)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[UP]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Break-even:</Text> 3-4 months
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>R</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Revenue Impact (Year 1):</Text> €100-150k (enterprise-grade setup, custom workflows)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>ROI:</Text> 667-1,875% (€8-15k → €100-150k)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>👤</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Best for:</Text> Established companies (50+ employees), complex sales processes, need custom integrations
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[+] EXPECTED BUSINESS RESULTS (6 Months Post-Implementation)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Lead response time: 28h → &lt;1h (2,700% improvement)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Lead-to-customer conversion: 4% → 12-18% (3-4.5x boost)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Sales cycle length: 45 days → 28 days (38% faster closes)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Rep productivity: 40% time on admin → 15% (25% more selling time)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Follow-up completion rate: 20% → 90% (4.5x improvement)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[*]</Text>
              <Text style={styles.bulletText}>
                Pipeline visibility: 0% (spreadsheets) → 100% (live dashboard)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>[$]</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Total Revenue Impact:</Text> €50-150k/year (depending on path chosen + current baseline)
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>◉ RECOMMENDED NEXT STEPS:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                Choose your path (DIY/Hybrid/Agency) based on budget, technical capability, urgency
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                Start with Week 1-2 quick wins (auto-response + welcome sequence) - immediate ROI
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                Measure baseline metrics NOW (current conversion rates, response time, follow-up %) - track improvement
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                Block 5-6h/week for DIY implementation (or schedule consultant kickoff meeting for Hybrid/Agency)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                Review progress weekly - adjust roadmap based on what's working (agile approach, not waterfall)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - ENGAGE Section</Text>
          <Text style={styles.footerText}>Page 23 of 23</Text>
        </View>
      </Page>

    </>
  );
};

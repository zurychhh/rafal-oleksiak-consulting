import { components } from '../../shared-styles';
import React from 'react';
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { DEFAULT_FONT_FAMILY, CODE_FONT_FAMILY } from '../../font-constants';
import { ThreePathImplementation } from '../shared/ThreePathImplementation';
import ResearchCitation from '../shared/ResearchCitation';

// DARK THEME COLORS (consistent with FIND section)
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
    color: COLORS.lightGrey,
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
  sectionLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
  },
  box: {
    backgroundColor: COLORS.darkGrey,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  situationBox: {
    borderLeftColor: COLORS.mediumGrey,
  },
  impactBox: {
    borderLeftColor: COLORS.orange,
  },
  solutionBox: {
    borderLeftColor: COLORS.neonGreen,
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
    fontSize: 8,
    lineHeight: 1.6,
    color: COLORS.lightGrey,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: COLORS.white,
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
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.vividPurple,
    marginRight: 8,
    width: 15,
  },
  bulletText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    lineHeight: 1.5,
    color: COLORS.lightGrey,
    flex: 1,
  },
  codeBox: {
    backgroundColor: COLORS.codeBackground,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    fontFamily: CODE_FONT_FAMILY,
  },
  codeTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.electricBlue,
    marginBottom: 8,
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

interface ACQUIRESection8PagesProps {
  score: number;
  benchmark: number;
}

export default function ACQUIRESection8Pages({ score, benchmark }: ACQUIRESection8PagesProps) {
  return (
    <>
      {/* Page 32: Overview - Wasted Ad Spend Problem */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>3. UNDERSTAND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>Paid Advertising Optimization</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> Most companies waste 20-40% of their paid advertising budget on ineffective campaigns, poor targeting, or technical tracking issues. Without proper conversion tracking, multi-touch attribution, and budget optimization, you're flying blind—burning €15-50k/year on ads that don't convert.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] BUSINESS IMPACT:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Wasted Ad Spend:</Text> €15-50k/year on non-converting campaigns (30% avg waste rate)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Attribution Blindness:</Text> 60% of conversions mis-attributed (can't optimize what you can't measure)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Lost Competitive Edge:</Text> Competitors using Smart Bidding + Conversions API get 30-50% better ROAS
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Opportunity Cost:</Text> €50-150k/year in potential revenue from optimized campaigns
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] SOLUTION:</Text> Implement a comprehensive paid ads stack with proper conversion tracking (Google Ads + Meta + LinkedIn), server-side tracking via Conversions API, multi-touch attribution in BigQuery, and automated budget optimization. This 8-page section covers Google Ads scripts, Meta Conversions API, LinkedIn Campaign Manager, retargeting strategies, budget allocation algorithms, and landing page optimization.
          </Text>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'WordStream (2024)',
              stat: 'Average Google Ads account wastes 76% of budget on irrelevant searches',
              year: '2024',
            },
            {
              source: 'Meta for Business (2023)',
              stat: 'Advertisers using Conversions API see 13% improvement in cost per action',
              year: '2023',
            },
            {
              source: 'Think with Google (2024)',
              stat: 'Smart Bidding strategies improve conversion value by 20% vs manual bidding',
              year: '2024',
            },
          ]}
        />

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] ACQUIRE SECTION ROADMAP (PAGES 32-39)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>33</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Google Ads Setup (conversion tracking, Smart Bidding, automation scripts)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>34</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Meta Ads Optimization (audience targeting, Conversions API, creative testing)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>35</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>LinkedIn Ads (B2B targeting, Lead Gen Forms, Campaign Manager API)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>36</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Retargeting Strategy (dynamic remarketing, sequential messaging, cross-platform)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>37</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Budget Optimization (Python budget allocator, ROAS targets, portfolio bidding)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>38</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Landing Page Optimization (A/B testing, form optimization, speed fixes)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>39</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Implementation Summary (90-day roadmap, total investment, €50-150k/year impact)</Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 32 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 33: Google Ads Setup */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Google Ads - Conversion Tracking & Smart Bidding</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> 60% of Google Ads accounts have broken or incomplete conversion tracking. Without proper conversion setup, you can't measure ROAS, optimize for actual business goals, or use Smart Bidding strategies that improve performance by 20-30%.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Broken tracking = optimizing for clicks (vanity) instead of conversions (revenue). Average e-commerce site wastes €8-15k/year on Google Ads that generate traffic but not sales. Fixing tracking + Smart Bidding typically improves ROAS from 2:1 to 3.5:1 (75% improvement).
          </Text>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Google Ads + GTM Setup',
              difficulty: 'MEDIUM',
              cost: '€0-200 (free tools + potential Google Ads consultant 1h)',
              time: '6-10h (setup + learning)',
              forWhom: 'Small businesses (<€5k/month ad spend), tech-savvy marketers, startups',
              steps: [
                'Audit current conversion tracking (Google Ads > Tools > Conversions): Are all key events tracked (purchase, lead, signup)?',
                'Set up enhanced conversions (requires GTM): Capture hashed email/phone for better attribution (GDPR-compliant)',
                'Install Google Ads Conversion Linker tag via GTM (prevents cookie loss due to browser restrictions)',
                'Configure conversion values (dynamic for e-commerce: pass actual order value, not fixed €1)',
                'Switch to Smart Bidding (Target ROAS or Maximize Conversion Value) - requires 30+ conversions/month',
                'Set up offline conversion import if you have phone sales/in-store (CSV upload or API)',
                'Install Google Ads Editor for bulk campaign management (free desktop app)',
              ],
              roi: '€12-25k/year (improving ROAS from 2:1 to 3:1 on €5k/month spend = €5k/month extra revenue)',
              breakEven: 'Instant (free setup)',
            },
            {
              number: 2,
              title: 'Hybrid - Freelance PPC Specialist',
              difficulty: 'LOW',
              cost: '€800-1,500 (setup + 3 months optimization)',
              time: '2-4h/month (review meetings)',
              forWhom: 'Mid-size businesses (€5-20k/month ad spend), companies without in-house PPC expertise',
              steps: [
                'Hire PPC freelancer (Upwork/Toptal, €40-80/h, look for Google Ads certification)',
                'Audit + fix tracking (conversion setup, enhanced conversions, offline imports)',
                'Implement Smart Bidding strategy (Target ROAS or Maximize Conversion Value)',
                'Set up automated rules (pause low-performing ads, increase budgets on high-ROAS campaigns)',
                'Monthly optimization: negative keywords, ad copy testing, audience adjustments',
                'Quarterly account restructuring (campaigns, ad groups, budget reallocation)',
              ],
              roi: '€30-60k/year (10-15% ROAS improvement on €10k/month spend)',
              breakEven: '1-2 months',
            },
            {
              number: 3,
              title: 'Agency - Full-Service PPC Management',
              difficulty: 'LOW',
              cost: '€2,000-5,000/month (10-15% of ad spend)',
              time: '3-5h/month (strategy meetings)',
              forWhom: 'Large businesses (€20k+/month ad spend), complex multi-channel campaigns, enterprise',
              steps: [
                'Onboard with specialized PPC agency (look for Google Premier Partner badge)',
                'Complete tracking overhaul (GA4 + Google Ads + CRM integration + BigQuery attribution)',
                'Multi-channel strategy (Google Search + Shopping + Display + YouTube)',
                'Advanced Smart Bidding with custom seasonality adjustments and conversion lag modeling',
                'Dedicated account manager + monthly performance reviews with C-suite reporting',
                'Continuous testing (ad copy, landing pages, audiences, bidding strategies)',
              ],
              roi: '€100-200k/year (20-30% ROAS improvement on €30k/month spend)',
              breakEven: '2-3 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] GOOGLE ADS SCRIPT - AUTOMATED BID ADJUSTMENTS',
            code: `// Automatically adjust bids based on ROAS performance
// Schedule: Daily at 2am (Google Ads UI > Scripts > New Script)

function main() {
  const TARGET_ROAS = 3.0; // Adjust based on your goals
  const MIN_CONVERSIONS = 10; // Minimum conversions for statistical significance
  const DATE_RANGE = 'LAST_30_DAYS';

  const campaigns = AdsApp.campaigns()
    .withCondition('Status = ENABLED')
    .withCondition('BiddingStrategyType = TARGET_ROAS')
    .forDateRange(DATE_RANGE)
    .get();

  while (campaigns.hasNext()) {
    const campaign = campaigns.next();
    const stats = campaign.getStatsFor(DATE_RANGE);

    const conversions = stats.getConversions();
    const conversionValue = stats.getConversionValue();
    const cost = stats.getCost();
    const currentROAS = cost > 0 ? conversionValue / cost : 0;

    // Only adjust if we have enough data
    if (conversions < MIN_CONVERSIONS) {
      Logger.log(\`\${campaign.getName()}: Skipping (only \${conversions} conversions)\`);
      continue;
    }

    // Calculate ROAS deviation
    const roasDeviation = (currentROAS - TARGET_ROAS) / TARGET_ROAS;

    if (roasDeviation < -0.2) {
      // ROAS is 20%+ below target: decrease budget by 15%
      const currentBudget = campaign.getBudget().getAmount();
      const newBudget = currentBudget * 0.85;
      campaign.getBudget().setAmount(newBudget);
      Logger.log(\`\${campaign.getName()}: Decreased budget to €\${newBudget} (ROAS: \${currentROAS.toFixed(2)})\`);

    } else if (roasDeviation > 0.3) {
      // ROAS is 30%+ above target: increase budget by 20%
      const currentBudget = campaign.getBudget().getAmount();
      const newBudget = currentBudget * 1.20;
      campaign.getBudget().setAmount(newBudget);
      Logger.log(\`\${campaign.getName()}: Increased budget to €\${newBudget} (ROAS: \${currentROAS.toFixed(2)})\`);

    } else {
      Logger.log(\`\${campaign.getName()}: No change (ROAS: \${currentROAS.toFixed(2)} is within target)\`);
    }
  }
}

// Send email report (optional)
function sendEmail() {
  MailApp.sendEmail({
    to: 'marketing@yourcompany.com',
    subject: 'Google Ads Daily Budget Adjustments',
    body: Logger.getLog()
  });
}`
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 33 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 34: Meta Ads Optimization */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Meta Ads - Conversions API & Audience Targeting</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> iOS 14.5+ privacy changes broke pixel tracking for 40-60% of users. Without Conversions API (server-side tracking), you're losing attribution data, ad performance drops 20-30%, and your lookalike audiences become less effective.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Broken Meta tracking = blind optimization. If you're spending €5k/month on Meta Ads without Conversions API, you're likely losing €1-2k/month in wasted spend. Implementing CAPI improves cost per acquisition by 13% (Meta's own data) and increases event match quality from 3.5/10 to 8/10.
          </Text>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Meta Pixel + Basic CAPI',
              difficulty: 'HIGH',
              cost: '€0-300 (developer time if needed)',
              time: '8-15h (technical setup + testing)',
              forWhom: 'Tech-savvy marketers, developers, startups with engineering resources',
              steps: [
                'Install Meta Pixel via GTM (standard setup, not enough alone!)',
                'Set up Conversions API (CAPI) - requires server-side implementation (Node.js, Python, or PHP)',
                'Configure event matching: pass fbp/fbc cookies + hashed email/phone for user deduplication',
                'Test events in Meta Events Manager (check Event Match Quality score - aim for 7+/10)',
                'Enable Advanced Matching (auto-detect email/phone from forms, +10% match rate)',
                'Set up Advantage+ catalog campaigns (dynamic product ads with automatic optimization)',
                'Create lookalike audiences from high-value customers (top 10% LTV)',
              ],
              roi: '€10-20k/year (13% CPA improvement on €5k/month spend)',
              breakEven: 'Instant (free setup, better results immediately)',
            },
            {
              number: 2,
              title: 'Hybrid - CAPI Setup + Freelancer Optimization',
              difficulty: 'MEDIUM',
              cost: '€800-1,800 (CAPI dev + 3 months optimization)',
              time: '3-6h/month (review + approvals)',
              forWhom: 'Mid-size e-commerce (€5-15k/month ad spend), companies without developers',
              steps: [
                'Hire developer for CAPI setup (€300-600 one-time, or use Shopify/WooCommerce plugin if available)',
                'Hire Meta Ads freelancer for ongoing optimization (€500-1,200/month)',
                'Implement Advantage+ Shopping campaigns (Meta fully automated campaign type)',
                'Set up dynamic product ads with catalog feed optimization (fix missing product data)',
                'Launch creative testing framework (5-10 ad variations per campaign)',
                'Implement audience exclusions (recent purchasers, existing customers for acquisition campaigns)',
              ],
              roi: '€25-50k/year (15-20% CPA improvement on €10k/month spend)',
              breakEven: '2-3 months',
            },
            {
              number: 3,
              title: 'Agency - Full Meta Marketing Partner',
              difficulty: 'LOW',
              cost: '€2,500-6,000/month (12-15% of ad spend)',
              time: '4-6h/month (strategy sessions)',
              forWhom: 'Large e-commerce (€20k+/month ad spend), complex multi-product catalogs, enterprise',
              steps: [
                'Onboard with Meta Business Partner agency (certified partner with direct Meta support)',
                'Complete CAPI + Advanced Matching setup with custom event parameters',
                'Multi-product catalog optimization (feed optimization, dynamic creative, collection ads)',
                'Advantage+ Shopping + manual campaigns hybrid strategy',
                'Creative production support (video ads, UGC content, carousel ads)',
                'Monthly performance reviews with executive dashboards (ROAS by product category, LTV cohorts)',
              ],
              roi: '€80-150k/year (25-35% ROAS improvement on €30k/month spend)',
              breakEven: '2-4 months',
            },
          ]}
          codeSnippet={{
            title: '▥ META CONVERSIONS API - NODE.JS IMPLEMENTATION',
            code: `// Server-side tracking for purchase events (send from your backend)
const bizSdk = require('facebook-nodejs-business-sdk');

const access_token = process.env.META_ACCESS_TOKEN;
const pixel_id = process.env.META_PIXEL_ID;
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;

// Trigger this when user completes checkout
async function trackPurchase(orderData) {
  // Hash user data for privacy (GDPR-compliant)
  const crypto = require('crypto');
  const hashSHA256 = (data) => crypto.createHash('sha256').update(data).digest('hex');

  const userData = (new UserData())
    .setEmail(hashSHA256(orderData.email.toLowerCase().trim()))
    .setPhone(hashSHA256(orderData.phone.replace(/[^0-9]/g, '')))
    .setClientIpAddress(orderData.ip)
    .setClientUserAgent(orderData.userAgent)
    .setFbp(orderData.fbp) // From cookie: _fbp
    .setFbc(orderData.fbc); // From URL: fbclid parameter

  const customData = (new CustomData())
    .setCurrency('EUR')
    .setValue(orderData.orderValue)
    .setContentType('product')
    .setContentIds(orderData.productIds) // Array of product IDs purchased
    .setNumItems(orderData.quantity);

  const serverEvent = (new ServerEvent())
    .setEventName('Purchase')
    .setEventTime(Math.floor(Date.now() / 1000))
    .setUserData(userData)
    .setCustomData(customData)
    .setEventSourceUrl(orderData.sourceUrl)
    .setActionSource('website');

  const eventsData = [serverEvent];
  const eventRequest = (new EventRequest(access_token, pixel_id))
    .setEvents(eventsData);

  try {
    const response = await eventRequest.execute();
    console.log('✓ Meta CAPI Event Sent:', response);

    // Check Event Match Quality in Meta Events Manager
    // Aim for 7+/10 score (requires email + phone + fbp)

  } catch (error) {
    console.error('✗ Meta CAPI Error:', error);
  }
}

// Example usage in your checkout route
app.post('/api/checkout', async (req, res) => {
  // ... process payment with Stripe/PayPal ...

  // Track in Meta CAPI
  await trackPurchase({
    email: req.body.email,
    phone: req.body.phone,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    fbp: req.cookies._fbp,
    fbc: req.query.fbclid ? \`fb.1.\${Date.now()}.\${req.query.fbclid}\` : null,
    orderValue: 149.99,
    productIds: ['SKU123', 'SKU456'],
    quantity: 2,
    sourceUrl: \`https://yoursite.com/checkout\`,
  });

  res.json({ success: true });
});`
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 34 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 35: LinkedIn Ads for B2B */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>LinkedIn Ads - B2B Targeting & Lead Generation</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> LinkedIn CPCs are 3-5x higher than Google/Meta (€5-15/click), but for B2B companies, LinkedIn delivers 2-3x higher lead quality. The problem? Most advertisers use basic targeting (job title only) and send traffic to generic landing pages instead of LinkedIn Lead Gen Forms.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>€ REVENUE IMPACT (B2B ONLY):</Text> Poorly targeted LinkedIn campaigns waste 40-60% of budget on irrelevant clicks (€3-8k/month for typical €10k budget). Lead Gen Forms increase conversion rates from 2-3% (landing page) to 10-15% (pre-filled form), cutting cost per lead by 50-70%.
          </Text>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - LinkedIn Campaign Manager',
              difficulty: 'MEDIUM',
              cost: '€0 (platform is free, just ad spend)',
              time: '5-8h/month (setup + optimization)',
              forWhom: 'B2B startups, consultants, agencies with <€5k/month LinkedIn budget',
              steps: [
                'Set up LinkedIn Campaign Manager (free): https://business.linkedin.com/marketing-solutions/ads',
                'Use Matched Audiences (upload email list of target accounts for ABM targeting)',
                'Create Lead Gen Form campaigns (NOT traffic to landing page - form fills 3-5x faster)',
                'Advanced targeting: Job Title + Company Size + Industry + Seniority (avoid too narrow)',
                'Enable LinkedIn Insight Tag for website retargeting (cookie-based, install via GTM)',
                'Set up conversion tracking: Integrate Lead Gen Forms with CRM (native HubSpot/Salesforce sync)',
                'A/B test ad formats: Single Image vs Carousel vs Video (video gets 50% higher engagement)',
              ],
              roi: '€15-30k/year (for B2B SaaS: 1 enterprise client = €20-50k LTV, need 1-2 conversions to break even)',
              breakEven: '3-6 months (depends on sales cycle length)',
            },
            {
              number: 2,
              title: 'Hybrid - Freelance LinkedIn Ads Specialist',
              difficulty: 'LOW',
              cost: '€1,000-2,000/month (freelancer + ad spend)',
              time: '3-5h/month (review meetings)',
              forWhom: 'Mid-size B2B companies (€5-15k/month budget), companies without in-house LinkedIn expertise',
              steps: [
                'Hire LinkedIn Ads specialist (look for LinkedIn Marketing Labs certification)',
                'Account-Based Marketing (ABM) setup: Upload target account list (500-2,000 companies)',
                'Multi-format campaign strategy (Sponsored Content + InMail + Text Ads)',
                'Lead Gen Form optimization (reduce fields from 8 to 3-4, increase conversions by 40%)',
                'Monthly optimization: audience testing, bid adjustments, creative refresh',
                'CRM integration + lead nurturing handoff (auto-assign leads to sales reps)',
              ],
              roi: '€40-80k/year (B2B services: 3-5 enterprise clients, €15-25k LTV each)',
              breakEven: '4-8 months',
            },
            {
              number: 3,
              title: 'Agency - Full ABM + LinkedIn Partner',
              difficulty: 'LOW',
              cost: '€3,000-7,000/month (agency fee + ad spend)',
              time: '5-8h/month (strategy + reporting)',
              forWhom: 'Enterprise B2B (€20k+/month budget), complex multi-stakeholder sales, Fortune 500 targeting',
              steps: [
                'Onboard with LinkedIn Marketing Partner agency (certified, direct LinkedIn support)',
                'Full ABM strategy: LinkedIn + display retargeting + email outreach + sales enablement',
                'Executive-level targeting (C-suite only campaigns with personalized messaging)',
                'Sponsored InMail campaigns (70-90% open rates, 3-5% CTR)',
                'Video production for Thought Leader Ads (CEO/executive content, trust-building)',
                'Pipeline attribution reporting (track LinkedIn influence on closed deals, not just leads)',
              ],
              roi: '€150-300k/year (enterprise B2B: 5-10 deals, €30-60k ACV each)',
              breakEven: '6-12 months (enterprise sales cycles are long)',
            },
          ]}
          codeSnippet={{
            title: '[CODE] LINKEDIN CAMPAIGN MANAGER API - AUTOMATED REPORTING',
            code: `# Python script to pull LinkedIn Ads performance data
# Use for automated dashboards or budget allocation decisions

import requests
import pandas as pd
from datetime import datetime, timedelta

# Get from LinkedIn Developer Portal: https://www.linkedin.com/developers/
ACCESS_TOKEN = 'YOUR_LINKEDIN_ACCESS_TOKEN'
ACCOUNT_ID = 'urn:li:sponsoredAccount:123456789'

# Date range (last 30 days)
end_date = datetime.now()
start_date = end_date - timedelta(days=30)

# API endpoint: Campaign Analytics
url = f'https://api.linkedin.com/v2/adAnalyticsV2'
headers = {
    'Authorization': f'Bearer {ACCESS_TOKEN}',
    'Content-Type': 'application/json'
}

params = {
    'q': 'analytics',
    'pivot': 'CAMPAIGN',
    'dateRange.start.day': start_date.day,
    'dateRange.start.month': start_date.month,
    'dateRange.start.year': start_date.year,
    'dateRange.end.day': end_date.day,
    'dateRange.end.month': end_date.month,
    'dateRange.end.year': end_date.year,
    'accounts': f'List({ACCOUNT_ID})',
    'fields': 'externalWebsiteConversions,costInLocalCurrency,impressions,clicks,dateRange'
}

response = requests.get(url, headers=headers, params=params)
data = response.json()

# Parse data into DataFrame
campaigns = []
for element in data['elements']:
    campaigns.append({
        'campaign_id': element['pivotValue'].split(':')[-1],
        'impressions': element.get('impressions', 0),
        'clicks': element.get('clicks', 0),
        'cost': element.get('costInLocalCurrency', 0),
        'conversions': element.get('externalWebsiteConversions', 0),
        'ctr': element.get('clicks', 0) / element.get('impressions', 1) * 100,
        'cpc': element.get('costInLocalCurrency', 0) / element.get('clicks', 1),
        'cpl': element.get('costInLocalCurrency', 0) / element.get('externalWebsiteConversions', 1)
    })

df = pd.DataFrame(campaigns)

# Identify underperforming campaigns (CPL > €150 or CTR < 0.5%)
underperforming = df[(df['cpl'] > 150) | (df['ctr'] < 0.5)]

print(f"▉ LinkedIn Ads Performance ({start_date.date()} to {end_date.date()})")
print(f"Total Spend: €{df['cost'].sum():.2f}")
print(f"Total Conversions: {df['conversions'].sum():.0f}")
print(f"Avg Cost per Lead: €{df['cost'].sum() / df['conversions'].sum():.2f}")
print(f"\\n⚠️ Underperforming Campaigns ({len(underperforming)}):")
print(underperforming[['campaign_id', 'cpl', 'ctr']])

# Send alert if CPL > €200 (adjust threshold based on your LTV)
if (df['cpl'] > 200).any():
    print("🚨 ALERT: Some campaigns have CPL > €200. Review immediately!")
    # Integration: Send Slack alert or email`
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 35 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 36: Retargeting Strategy */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Retargeting - Dynamic Remarketing & Sequential Messaging</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> 98% of first-time visitors don't convert. Without retargeting, you're leaving €50-200k/year on the table. But generic "Here's 10% off!" retargeting is lazy—dynamic product ads + sequential messaging (awareness → consideration → decision) convert 3-5x better.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Dynamic retargeting (showing exact products viewed) increases conversion rates from 1-2% (generic ads) to 4-8% (personalized). For e-commerce with 50k visitors/month, that's 2,000-4,000 extra conversions/month. At €100 AOV = €200-400k/year in recovered revenue.
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>✓ IMPLEMENTATION:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Segment Audiences by Behavior:</Text> Homepage visitors (cold) vs Product viewers (warm) vs Cart abandoners (hot)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Dynamic Product Ads:</Text> Google Dynamic Remarketing + Meta Dynamic Product Ads (auto-show products they viewed)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Sequential Messaging:</Text> Day 1: "Still interested?" → Day 3: "10% off" → Day 7: "Last chance + free shipping"
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Cross-Platform Retargeting:</Text> Google Display + Meta + YouTube (user sees your ad 3+ times across channels)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Exclude Converters:</Text> Stop showing ads to people who already purchased (wastes 10-20% of retargeting budgets)
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'Criteo (2024)',
              stat: 'Dynamic retargeting ads have 10x higher click-through rates than standard display ads',
              year: '2024',
            },
            {
              source: 'Meta for Business (2023)',
              stat: 'Sequential ad campaigns see 3.2x higher conversion rates vs single-message retargeting',
              year: '2023',
            },
          ]}
        />

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>◉ RETARGETING FUNNEL STRUCTURE</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Tier 1: Cold Visitors (Homepage Only)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Audience Size:</Text> 40-60% of traffic | <Text style={styles.boldText}>Duration:</Text> 7 days | <Text style={styles.boldText}>Budget:</Text> 20% of retargeting
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Message:</Text> Awareness (brand story, bestsellers, social proof)
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Tier 2: Warm Visitors (Product Page Viewers)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Audience Size:</Text> 25-35% of traffic | <Text style={styles.boldText}>Duration:</Text> 14 days | <Text style={styles.boldText}>Budget:</Text> 40% of retargeting
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Message:</Text> Dynamic product ads (show exact products viewed + similar items)
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Tier 3: Hot Visitors (Cart Abandoners)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Audience Size:</Text> 5-10% of traffic | <Text style={styles.boldText}>Duration:</Text> 30 days | <Text style={styles.boldText}>Budget:</Text> 40% of retargeting
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Message:</Text> Aggressive offers (10-20% off, free shipping, urgency: "Cart expires in 24h")
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>⚡ GOOGLE ADS - DYNAMIC REMARKETING SETUP (GTM)</Text>
          <Text style={components.codeBlockText}>{`<!-- Add to product pages via Google Tag Manager -->
<script>
  window.dataLayer = window.dataLayer || [];

  // For product page views
  dataLayer.push({
    'event': 'view_item',
    'ecomm_prodid': 'SKU12345',          // Product ID
    'ecomm_pagetype': 'product',         // Page type
    'ecomm_totalvalue': 99.99            // Product price
  });

  // For cart abandonment (add to cart page)
  dataLayer.push({
    'event': 'add_to_cart',
    'ecomm_prodid': ['SKU12345', 'SKU67890'],
    'ecomm_pagetype': 'cart',
    'ecomm_totalvalue': 249.97
  });

  // For purchase (add to thank-you page)
  dataLayer.push({
    'event': 'purchase',
    'ecomm_prodid': ['SKU12345'],
    'ecomm_pagetype': 'purchase',
    'ecomm_totalvalue': 99.99
  });
</script>

<!-- In Google Ads, create remarketing lists: -->
<!-- 1. "Product Viewers" - view_item event, duration: 30 days -->
<!-- 2. "Cart Abandoners" - add_to_cart but NOT purchase, duration: 45 days -->
<!-- 3. "Past Purchasers" (EXCLUDE from acquisition campaigns!) -->

<!-- Then create Dynamic Remarketing campaigns: -->
<!-- Google Ads > Campaigns > New > Display > Dynamic Ads -->
<!-- Upload product feed (Google Merchant Center or spreadsheet) -->
<!-- Use automated bidding (Target ROAS or Maximize Conversions) -->`}</Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 36 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 37: Budget Optimization */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Budget Optimization - Multi-Channel Allocation & Portfolio Bidding</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> Most companies allocate ad budgets based on "gut feeling" or "we've always spent €X on Google". Without data-driven budget allocation, you're over-investing in saturated channels (diminishing returns) and under-investing in untapped channels (missed growth).
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Optimized budget allocation (based on marginal ROAS) can improve total ROAS by 15-30% without increasing spend. For a company spending €20k/month across Google + Meta + LinkedIn, that's €3-6k/month extra revenue (€36-72k/year) just from smarter allocation.
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>✓ SOLUTION - 3-STEP BUDGET OPTIMIZATION:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Calculate Marginal ROAS by Channel:</Text> Increase each channel's budget by 20% for 1 week, measure ROAS change. The channel with highest marginal ROAS gets more budget.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Portfolio Bidding (Google/Meta):</Text> Instead of optimizing each campaign separately, set a shared budget pool and let AI allocate to best-performing campaigns in real-time.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Automated Budget Reallocation:</Text> Use Python script (below) to shift budgets weekly based on performance. Decrease budget on campaigns with ROAS under 2:1, increase on campaigns with ROAS over 4:1.
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'Nielsen (2023)',
              stat: 'Companies using algorithmic budget allocation see 20-25% higher marketing ROI vs manual allocation',
              year: '2023',
            },
          ]}
        />

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>▥ PYTHON - MULTI-CHANNEL BUDGET OPTIMIZER</Text>
          <Text style={components.codeBlockText}>{`# Automatically reallocate budgets across Google Ads, Meta, LinkedIn
# Based on weekly ROAS performance
# Run weekly via cron job or Cloud Scheduler

import pandas as pd
import numpy as np

# Example performance data (pull from APIs in production)
channels_data = {
    'channel': ['Google Search', 'Google Shopping', 'Meta Feed', 'Meta Stories', 'LinkedIn'],
    'current_budget': [5000, 3000, 4000, 2000, 3000],  # €/week
    'spend': [4800, 2900, 3800, 1900, 2850],
    'revenue': [19200, 8700, 11400, 3800, 8550],  # Last week's results
    'conversions': [192, 87, 95, 19, 28]
}

df = pd.DataFrame(channels_data)

# Calculate current ROAS
df['roas'] = df['revenue'] / df['spend']
df['cpa'] = df['spend'] / df['conversions']

print("▉ Current Performance:")
print(df[['channel', 'spend', 'revenue', 'roas', 'cpa']])

# Define rules for budget reallocation
TOTAL_BUDGET = 17000  # €/week total (fixed)
MIN_BUDGET_PER_CHANNEL = 500  # Don't go below €500/week
TARGET_ROAS = 3.0

# Step 1: Identify over/underperformers
df['performance_tier'] = pd.cut(
    df['roas'],
    bins=[0, 2.0, 3.5, 10],
    labels=['Underperforming', 'Acceptable', 'Excellent']
)

# Step 2: Calculate budget adjustments
def calculate_new_budget(row):
    if row['roas'] < 2.0:
        # Cut budget by 30% for ROAS < 2:1
        return max(row['current_budget'] * 0.70, MIN_BUDGET_PER_CHANNEL)
    elif row['roas'] > 4.0:
        # Increase budget by 40% for ROAS > 4:1
        return row['current_budget'] * 1.40
    else:
        # Keep budget stable for ROAS 2-4:1
        return row['current_budget']

df['proposed_budget'] = df.apply(calculate_new_budget, axis=1)

# Step 3: Normalize to total budget (ensure we don't exceed total)
budget_sum = df['proposed_budget'].sum()
df['final_budget'] = (df['proposed_budget'] / budget_sum * TOTAL_BUDGET).round(0)

print("\\n€ Proposed Budget Reallocation:")
print(df[['channel', 'current_budget', 'final_budget', 'roas', 'performance_tier']])

# Step 4: Calculate expected impact
df['budget_change'] = df['final_budget'] - df['current_budget']
df['expected_revenue_change'] = df['budget_change'] * df['roas']

print(f"\\n↗ Expected Revenue Impact: €{df['expected_revenue_change'].sum():.0f}/week")
print(f"   (€{df['expected_revenue_change'].sum() * 52 / 1000:.0f}k/year)")

# Step 5: Push budget changes to ad platforms (via APIs)
# Google Ads API: Update campaign budgets
# Meta Marketing API: Update campaign budgets
# LinkedIn Campaign Manager API: Update campaign budgets
# (Implementation depends on your ad account setup)`}</Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 37 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 38: Landing Page Optimization */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Landing Page Optimization - A/B Testing & Conversion Rate Fixes</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> You're spending €10k/month on ads, but your landing page converts at 1-2% (industry average is 2.5-5%). Even small improvements (2% → 3.5% conversion rate) = 75% more conversions without increasing ad spend. Most landing pages fail on speed (over 3s load time), unclear value prop, or too many form fields.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Improving landing page conversion rate from 2% to 4% doubles your conversions. For an e-commerce site with 10k ad clicks/month at €100 AOV: 2% CR = €20k revenue, 4% CR = €40k revenue. That's €20k/month (€240k/year) with zero extra ad spend.
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>✓ QUICK WINS (30-DAY OPTIMIZATION):</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Speed Fixes:</Text> Compress images (TinyPNG), enable CDN (Cloudflare free tier), lazy-load below-fold content. Target: under 2s mobile load time (use PageSpeed Insights).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Value Prop Above Fold:</Text> Headline must answer "What's in it for me?" in 5 seconds. Bad: "Welcome to XYZ Corp". Good: "Get 30% More Leads in 60 Days (Guaranteed)".
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Form Optimization:</Text> Reduce fields from 8 to 3-4 (name, email, phone only). Each removed field = +10-15% conversion rate (Unbounce data).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Social Proof:</Text> Add 3-5 customer logos, testimonials, or "Join 10,000+ customers" trust signal. Increases conversions by 15-20%.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Mobile-First Design:</Text> 60-70% of ad traffic is mobile. Test on real iPhone/Android (not just desktop DevTools).
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>6.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>A/B Testing:</Text> Test headline variations (value-focused vs feature-focused), CTA button color (orange vs green), form length (3 vs 5 fields).
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'Unbounce (2024)',
              stat: 'Landing pages with 3 or fewer form fields convert 25% better than pages with 4+ fields',
              year: '2024',
            },
            {
              source: 'Google/SOASTA Research (2023)',
              stat: 'If page load time increases from 1s to 3s, bounce rate increases by 32%',
              year: '2023',
            },
          ]}
        />

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>◉ LANDING PAGE OPTIMIZATION CHECKLIST</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Above the Fold (Critical - 5 Second Test)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Clear headline answering "What's in it for me?"</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Subheadline explaining how it works (1 sentence)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Hero image/video showing product in action</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Primary CTA button (contrasting color, action-oriented text)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Trust signal (customer logos, "As seen in Forbes", security badge)</Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Below the Fold (Supporting Content)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>3 key benefits (not features) with icons</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Social proof: 3-5 testimonials with photos + names</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Objection handling: FAQ section (3-5 questions)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Secondary CTA (repeat primary CTA at bottom)</Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Technical (Performance & Tracking)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Page load time under 2s on mobile (Google PageSpeed over 90)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Mobile-responsive (test on iPhone + Android)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Form conversion tracking in GA4 + Google Ads</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Heatmap installed (Hotjar/Clarity) to identify scroll depth + rage clicks</Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 38 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 39: Implementation Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>UNDERSTAND - Implementation Summary</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>📅 90-DAY PAID ADS TRANSFORMATION</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>WEEK 1-2: Foundation (Technical Setup)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Fix Google Ads conversion tracking (Page 33: Enhanced Conversions + GTM)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Implement Meta Conversions API (Page 34: Server-side tracking)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Landing page speed fixes (Page 38: under 2s load time)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 10-16h | <Text style={styles.boldText}>Cost:</Text> €0-400 | <Text style={styles.boldText}>ROI:</Text> €10-20k/year (immediate ROAS lift from better tracking)
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>WEEK 3-4: Campaign Optimization</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Switch to Smart Bidding (Google: Target ROAS, Meta: Cost Cap)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Set up dynamic retargeting (Page 36: Product-specific ads)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>LinkedIn Lead Gen Forms for B2B (Page 35: 3x faster than landing pages)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 8-12h | <Text style={styles.boldText}>Cost:</Text> €200-600 | <Text style={styles.boldText}>ROI:</Text> €15-35k/year
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>WEEK 5-8: Testing & Refinement</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Landing page A/B testing (Page 38: Headline, CTA, form fields)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Creative testing (5-10 ad variations per campaign)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Budget reallocation based on ROAS (Page 37: Python budget optimizer)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 12-18h | <Text style={styles.boldText}>Cost:</Text> €300-1,000 | <Text style={styles.boldText}>ROI:</Text> €20-50k/year
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>WEEK 9-12: Scale & Automation</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Automated bid adjustments (Page 33: Google Ads scripts)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Cross-platform retargeting (Google + Meta + YouTube)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Portfolio bidding (shared budget across top campaigns)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 10-15h | <Text style={styles.boldText}>Cost:</Text> €500-1,500 | <Text style={styles.boldText}>ROI:</Text> €30-70k/year (compounding gains)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>€ TOTAL ACQUIRE INVESTMENT - 3 PATHS</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>1. DIY Path</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost:</Text> €1,200-2,500 (90 days, mostly tools/testing)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>⏰</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 40-60h over 12 weeks
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>💵</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €50-80k/year (15-20% ROAS improvement on €15k/month spend)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 2,000-6,667%
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>2. Hybrid Path (Freelancer Support)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost:</Text> €5,000-10,000 (setup + 3 months optimization)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>⏰</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 10-18h (review meetings only)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>💵</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €100-150k/year (20-30% ROAS improvement on €25k/month spend)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 1,000-3,000%
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>3. Agency Path (Full-Service PPC)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost:</Text> €18,000-35,000 (3 months at €6-12k/month)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>⏰</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 10-15h (strategy meetings + approvals)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>💵</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €200-350k/year (30-40% ROAS improvement on €50k/month spend)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 571-1,944%
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>◉ RECOMMENDED APPROACH:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                Start DIY (Weeks 1-4): Fix tracking + Smart Bidding + retargeting (€500, 20h)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                Hire freelancer for optimization (Weeks 5-12): Campaign management + A/B testing (€2-4k)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                Agency for scale (Month 4+): Only if spending €20k+/month and need multi-channel expertise
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                Review ROAS weekly - pivot budgets to top-performing channels (use Page 37 Python script)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - UNDERSTAND Section</Text>
          <Text style={styles.footerText}>Page 39 | LAMA PRO Audit</Text>
        </View>
      </Page>
    </>
  );
}

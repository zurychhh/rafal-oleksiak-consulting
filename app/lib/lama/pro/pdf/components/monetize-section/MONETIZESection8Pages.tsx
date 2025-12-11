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

interface MONETIZESection8PagesProps {
  score: number;
  benchmark: number;
}

export default function MONETIZESection8Pages({ score, benchmark }: MONETIZESection8PagesProps) {
  return (
    <>
      {/* Page 40: Overview - Checkout Abandonment & Retention Problem */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>4. TRUST</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>
        <Text style={styles.sectionSubtitle}>Conversion & Retention Optimization</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> Average e-commerce cart abandonment is 70%. For B2B SaaS, 95% of trial users don't convert to paid. Most companies focus on acquiring new customers (expensive) instead of optimizing conversion funnels and retaining existing customers (5-10x cheaper). Result: €100-300k/year left on the table from preventable abandonment and churn.
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
                <Text style={styles.boldText}>Cart Abandonment:</Text> 70% abandonment × 10k carts/month × €150 AOV = €12.6M/year lost (recovering 10% = €1.26M)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Suboptimal Pricing:</Text> Not testing price points = missing 15-30% potential revenue
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>No Upsells:</Text> Missing 20-40% of order value from post-purchase upsells and cross-sells
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Customer Churn:</Text> 5% monthly churn = losing 46% of customers annually (acquiring new ones costs 5-10x more)
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] SOLUTION:</Text> Implement a comprehensive conversion & retention stack: checkout optimization (reduce form friction), dynamic upsells (product recommendations), strategic pricing (A/B price testing), CLV modeling (predict high-value customers), email recovery flows (cart abandonment + winback), and churn prevention (early warning system). This section covers practical implementations that typically improve revenue by 25-50% without increasing traffic.
          </Text>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'Baymard Institute (2024)',
              stat: 'Average documented online shopping cart abandonment rate is 70.19%',
              year: '2024',
            },
            {
              source: 'Bain & Company (2023)',
              stat: 'Increasing customer retention by 5% increases profits by 25% to 95%',
              year: '2023',
            },
            {
              source: 'Harvard Business Review (2023)',
              stat: 'Acquiring a new customer costs 5 to 25 times more than retaining an existing one',
              year: '2023',
            },
          ]}
        />

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] MONETIZE SECTION ROADMAP (PAGES 40-47)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>41</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Checkout Optimization (form field reduction, trust signals, payment options)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>42</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Upsell & Cross-sell (product recommendations, bundles, post-purchase offers)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>43</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Pricing Strategy (A/B price testing, psychological pricing, tiered pricing)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>44</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>CLV Calculation (cohort analysis, predictive models, segment-based targeting)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>45</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Email Recovery Flows (cart abandonment, browse abandonment, winback campaigns)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>46</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Churn Prevention (early warning signals, retention campaigns, loyalty programs)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>47</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Implementation Summary (90-day roadmap, total investment, €80-250k/year impact)</Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 40 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 41: Checkout Optimization */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Checkout Optimization - Reduce Cart Abandonment by 30-50%</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> Baymard Institute found that 17% of US shoppers abandoned carts due to "too long/complicated checkout process." On average, e-commerce checkouts have 14.88 form elements—every extra field costs you 5-10% conversion rate.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Simplifying checkout from 8 fields to 4 fields typically improves conversion by 25-40%. For a site with 5,000 checkouts/month at 50% completion (2,500 lost) × €120 AOV = €300k/month lost. Recovering just 20% of lost checkouts = €60k/month (€720k/year).
          </Text>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Checkout Flow Audit + Quick Fixes',
              difficulty: 'LOW',
              cost: '€0-300 (if dev help needed for implementation)',
              time: '4-8h (analysis + implementation)',
              forWhom: 'Small e-commerce (<1,000 orders/month), Shopify/WooCommerce users, startups',
              steps: [
                'Audit current checkout: Count form fields (aim for ≤6), test on mobile (60% of traffic)',
                'Remove optional fields: Reduce from 12 fields to 4 core fields (email, name, address, payment)',
                'Enable guest checkout (don\'t force account creation—60% of users prefer guest checkout)',
                'Add trust signals: SSL badge, money-back guarantee, customer reviews near CTA',
                'Optimize payment options: Add PayPal/Apple Pay/Google Pay (one-click checkout, 30% faster)',
                'Show progress indicator (Step 1 of 3) - reduces anxiety, increases completion by 10-15%',
                'Use Stripe Payment Links or Shopify accelerated checkout (no coding required)',
              ],
              roi: '€30-60k/year (improving checkout completion from 50% to 65% on 2k carts/month)',
              breakEven: 'Instant (free or minimal dev cost)',
            },
            {
              number: 2,
              title: 'Hybrid - Developer + UX Optimization',
              difficulty: 'MEDIUM',
              cost: '€1,500-3,500 (developer + testing tools)',
              time: '2-4h/week (review + testing)',
              forWhom: 'Mid-size e-commerce (1-5k orders/month), custom checkouts, growing brands',
              steps: [
                'Hire e-commerce developer for checkout optimization (€800-1,500 one-time)',
                'Implement single-page checkout (vs multi-step: 10-15% better conversion)',
                'Add auto-fill address validation (Google Places API, reduces typos by 80%)',
                'Set up exit-intent popups with discount (10% off if abandoning cart, recovers 5-10%)',
                'Install session recording (Hotjar/FullStory) to identify friction points',
                'A/B test: long-form vs short-form checkout (measure with Google Optimize)',
              ],
              roi: '€80-150k/year (improving completion from 50% to 70% on 5k carts/month)',
              breakEven: '1-2 months',
            },
            {
              number: 3,
              title: 'Agency - Full CRO + Checkout Redesign',
              difficulty: 'LOW',
              cost: '€5,000-12,000 (CRO agency, 3-month engagement)',
              time: '5-8h/month (strategy + review)',
              forWhom: 'Large e-commerce (5k+ orders/month), complex checkouts, enterprise',
              steps: [
                'Onboard with CRO (Conversion Rate Optimization) agency',
                'Full funnel analysis: User testing, heatmaps, session recordings, friction logs',
                'Custom checkout redesign (mobile-first, progressive disclosure, inline validation)',
                'Advanced payment optimization (dynamic currency, installment plans, wallet integrations)',
                'Multivariate testing (test 5-10 variations simultaneously)',
                'Post-purchase upsell integration (recover 15-20% extra revenue per order)',
              ],
              roi: '€200-400k/year (improving completion from 50% to 75% on 10k carts/month)',
              breakEven: '2-3 months',
            },
          ]}
          codeSnippet={{
            title: '[CODE] STRIPE CHECKOUT - OPTIMIZED IMPLEMENTATION',
            code: `// Single-page checkout with Stripe Payment Element (supports cards, wallets, BNPL)
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_live_YOUR_PUBLISHABLE_KEY');

function CheckoutForm({ clientSecret, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://yoursite.com/order-confirmation',
        // Auto-capture billing details from form
        payment_method_data: {
          billing_details: {
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
          },
        },
      },
    });

    if (error) {
      alert(error.message);
      setIsProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      // Track conversion in GA4 + Meta + Google Ads
      window.gtag('event', 'purchase', {
        transaction_id: paymentIntent.id,
        value: amount,
        currency: 'EUR',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Minimal form fields (only 4!) */}
      <input id="email" type="email" placeholder="Email" required />
      <input id="name" type="text" placeholder="Full Name" required />

      {/* Stripe Payment Element - handles cards, Apple/Google Pay, iDEAL, etc */}
      <PaymentElement options={{ layout: 'tabs' }} />

      {/* Trust signals */}
      <div className="trust-signals">
        <img src="/ssl-badge.png" alt="Secure Checkout" />
        <span>30-day money-back guarantee</span>
      </div>

      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : \`Pay €\${amount}\`}
      </button>
    </form>
  );
}

// Wrap in Elements provider
export default function Checkout({ clientSecret, amount }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} amount={amount} />
    </Elements>
  );
}

// Backend: Create Payment Intent
// POST /api/create-payment-intent
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe uses cents
    currency: currency || 'eur',
    automatic_payment_methods: { enabled: true }, // Enable all payment methods
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});`
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 41 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 42: Upsell & Cross-sell */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Upsells & Cross-sells - Increase AOV by 20-40%</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> Amazon generates 35% of revenue from product recommendations ("Customers who bought this also bought..."). Most e-commerce stores show no upsells or generic "Related Products" (conversion rate: 1-2%). Dynamic, personalized upsells convert at 10-15%.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Implementing strategic upsells increases average order value (AOV) by 20-40%. For a store with €100 AOV and 1,000 orders/month: 30% AOV increase = €30k/month extra revenue (€360k/year) from existing traffic.
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] UPSELL STRATEGY - 3 CRITICAL MOMENTS:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Pre-Purchase (Product Page):</Text> "Frequently bought together" bundles (discount for buying 2-3 items together)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>During Checkout (Cart Page):</Text> "Add this for only €X more" (low-friction, one-click add)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Post-Purchase (Thank You Page):</Text> "Complete your order" upsells (30% acceptance rate, pure profit)
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'McKinsey (2023)',
              stat: 'Amazon generates 35% of revenue from its recommendation engine',
              year: '2023',
            },
            {
              source: 'SaleCycle (2024)',
              stat: 'Post-purchase upsells have 30-40% conversion rates vs 2-3% for cold traffic',
              year: '2024',
            },
          ]}
        />

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] PYTHON - COLLABORATIVE FILTERING (PRODUCT RECOMMENDATIONS)</Text>
          <Text style={components.codeBlockText}>{`# Simple collaborative filtering for "Customers who bought X also bought Y"
# Use historical order data to find frequently co-purchased products

import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

# Load order data (order_id, product_id)
orders = pd.read_csv('orders.csv')  # Columns: order_id, product_id

# Create transaction matrix (rows = orders, columns = products)
basket = orders.groupby(['order_id', 'product_id'])['product_id'].count().unstack().fillna(0)

# Convert to binary (1 if product in order, 0 if not)
basket_binary = basket.applymap(lambda x: 1 if x > 0 else 0)

# Find frequent itemsets (products bought together)
frequent_itemsets = apriori(basket_binary, min_support=0.02, use_colnames=True)

# Generate association rules (if A then B)
rules = association_rules(frequent_itemsets, metric='lift', min_threshold=1.5)

# Sort by confidence (probability that B is bought when A is bought)
rules = rules.sort_values('confidence', ascending=False)

# Example: What to recommend if customer buys Product A?
product_a = 'SKU12345'
recommendations = rules[rules['antecedents'] == {product_a}][['consequents', 'confidence', 'lift']]

print(f"Top 5 recommendations for {product_a}:")
print(recommendations.head(5))

# Interpretation:
# - confidence: 0.8 = 80% of people who bought A also bought B
# - lift: 2.5 = B is 2.5x more likely to be bought when A is in cart (vs random)

# Deploy as API endpoint:
# GET /api/recommendations?product_id=SKU12345
# Response: [{"product_id": "SKU67890", "confidence": 0.82, "reason": "Frequently bought together"}]

# Integration points:
# - Product page: "Customers who bought this also bought..."
# - Cart page: "Add these popular combos for 10% off"
# - Email: "You might also like..." (post-purchase)`}</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] UPSELL TYPES & CONVERSION RATES</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>1. Bundles (Best ROI)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Conversion:</Text> 15-25% | <Text style={styles.boldText}>AOV Increase:</Text> +€30-50 | <Text style={styles.boldText}>Example:</Text> "Buy shampoo + conditioner, save 15%"
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>2. Subscription Upsells (Recurring Revenue)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Conversion:</Text> 8-15% | <Text style={styles.boldText}>LTV Increase:</Text> +€500-2,000 | <Text style={styles.boldText}>Example:</Text> "Subscribe and save 20%"
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>3. Post-Purchase Upsells (Pure Profit)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Conversion:</Text> 25-40% | <Text style={styles.boldText}>AOV Increase:</Text> +€15-30 | <Text style={styles.boldText}>Example:</Text> "Add extended warranty for €19?"
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>4. Tiered Pricing (Premium Upgrade)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Conversion:</Text> 10-18% | <Text style={styles.boldText}>AOV Increase:</Text> +€50-150 | <Text style={styles.boldText}>Example:</Text> "Upgrade to Pro for €X/month"
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 42 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 43: Pricing Strategy */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Pricing Strategy - A/B Testing & Psychological Pricing</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> Most companies set prices based on "gut feeling" or competitor benchmarking, never testing alternatives. MIT research shows that even 1% price optimization can increase operating profit by 11.1% (with constant volume). Yet 80% of e-commerce sites never A/B test pricing.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Pricing optimization (testing €99 vs €129 for same product) can improve revenue by 15-30% with acceptable volume decrease. For a SaaS company with 1,000 customers at €99/month: testing €129/month might lose 20% of customers but gain 30% revenue = €25k/month extra (€300k/year).
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] PRICING OPTIMIZATION STRATEGIES:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Charm Pricing (€99 vs €100):</Text> Prices ending in 9 increase conversions by 8-12% (psychological threshold)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Anchoring (Show "Was €199, Now €149"):</Text> Discount framing increases perceived value by 20-30%
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Tiered Pricing (Good/Better/Best):</Text> 60% of buyers choose middle tier (intentionally price it for profit)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Decoy Pricing:</Text> Add expensive option to make middle option look like a deal (increases middle tier sales by 40%)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>A/B Price Testing:</Text> Test 10-20% price increases on 20% of traffic (measure revenue, not just conversion rate)
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'MIT Sloan Management Review (2023)',
              stat: 'A 1% improvement in price yields 11.1% increase in operating profit',
              year: '2023',
            },
            {
              source: 'Journal of Consumer Research (2024)',
              stat: 'Prices ending in 9 increase demand by 8-12% vs round numbers',
              year: '2024',
            },
          ]}
        />

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] JAVASCRIPT - A/B PRICE TESTING IMPLEMENTATION</Text>
          <Text style={components.codeBlockText}>{`// Dynamic A/B price testing (server-side or client-side)
// Test 10-20% price increases without annoying users

function assignPriceVariant(userId) {
  // Deterministic hash (same user always sees same price)
  const hash = simpleHash(userId);
  const variant = hash % 100; // 0-99

  if (variant < 80) {
    // 80% see control price
    return { variant: 'control', price: 99, label: '€99/month' };
  } else {
    // 20% see test price (+20%)
    return { variant: 'test', price: 119, label: '€119/month' };
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Usage in your pricing page
const user = getCurrentUser(); // or anonymous ID from cookie
const { variant, price, label } = assignPriceVariant(user.id);

// Display price
document.getElementById('price').textContent = label;

// Track in analytics (segment by variant)
gtag('event', 'view_pricing', {
  price_variant: variant,
  price_shown: price
});

// On purchase, track conversion by variant
gtag('event', 'purchase', {
  price_variant: variant,
  price_paid: price,
  value: price
});

// After 2-4 weeks, analyze in GA4:
// - Control: 1,000 views, 50 conversions (5% CR), €4,950 revenue
// - Test: 200 views, 8 conversions (4% CR), €952 revenue
// - Winner: Control (higher revenue despite slightly lower CR acceptable at +20% price)

// IMPORTANT: Only test prices on NEW users (don't change price for returning users)
// IMPORTANT: Track revenue AND conversion rate (optimize for $$, not just CR)`}</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] PRICING PAGE BEST PRACTICES</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Psychological Pricing Tactics</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Use €99 instead of €100 (charm pricing, 8-12% lift)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Remove currency symbols on premium tiers (€1,499 → 1,499, reduces pain of paying)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Show monthly price even for annual plans (€99/mo vs €1,188/year sounds cheaper)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Highlight middle tier with "Most Popular" badge (60% choose this)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Add decoy tier (expensive option makes middle tier look like a bargain)</Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>What to A/B Test (Priority Order)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>1.</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Price points (€99 vs €119 vs €129)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>2.</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Billing frequency (monthly vs annual, show savings: "Save 20%")</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>3.</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Feature presentation (list 5 features vs 10 features)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>4.</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>CTA button text ("Start Free Trial" vs "Get Started" vs "Buy Now")</Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 43 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 44: CLV Calculation */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Customer Lifetime Value (CLV) - Predictive Modeling & Segmentation</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> 70% of companies don't calculate CLV. Without knowing which customers are worth €500 vs €5,000, you can't optimize acquisition spend (CAC), retention campaigns, or upsell targeting. Result: treating all customers equally (wasteful) instead of focusing on high-value segments.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] BUSINESS IMPACT:</Text> CLV segmentation allows you to spend more on acquiring high-value customers (if CLV = €2,000, you can afford €500 CAC vs €50 for low-value customers). This typically improves marketing ROI by 30-50% and retention spend efficiency by 2-3x.
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] CLV CALCULATION METHODS:</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Historic CLV (Backward-Looking):</Text> Sum of all purchases by cohort (simple, requires 6-12 months of data)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Predictive CLV (Forward-Looking):</Text> Machine learning model predicting future purchases (requires ML expertise)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Formula-Based CLV:</Text> (Avg Order Value × Purchase Frequency × Customer Lifespan) - CAC
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'Bain & Company (2023)',
              stat: 'Companies using CLV-based segmentation see 30-50% higher marketing ROI',
              year: '2023',
            },
          ]}
        />

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] PYTHON - CLV COHORT ANALYSIS</Text>
          <Text style={components.codeBlockText}>{`# Calculate historic CLV by monthly cohorts
# Requires: orders table with user_id, order_date, order_value

import pandas as pd
import numpy as np

# Load order data
orders = pd.read_csv('orders.csv')  # Columns: user_id, order_date, order_value
orders['order_date'] = pd.to_datetime(orders['order_date'])

# Step 1: Identify first purchase month (cohort)
orders['cohort_month'] = orders.groupby('user_id')['order_date'].transform('min').dt.to_period('M')
orders['order_month'] = orders['order_date'].dt.to_period('M')

# Step 2: Calculate months since first purchase
orders['cohort_age'] = (orders['order_month'] - orders['cohort_month']).apply(lambda x: x.n)

# Step 3: Aggregate revenue by cohort and age
cohort_data = orders.groupby(['cohort_month', 'cohort_age'])['order_value'].sum().reset_index()

# Pivot to cohort table
cohort_pivot = cohort_data.pivot_table(
    index='cohort_month',
    columns='cohort_age',
    values='order_value',
    fill_value=0
)

# Calculate cumulative revenue per cohort
cohort_cumulative = cohort_pivot.cumsum(axis=1)

print("[+] CLV by Cohort (Cumulative Revenue):")
print(cohort_cumulative)

# Example output:
# cohort_age       0        1        2        3        4        5        6
# cohort_month
# 2024-01      €12,450  €18,920  €23,100  €26,800  €29,500  €31,200  €32,400
# 2024-02      €15,200  €22,500  €27,800  €32,100  €35,600  €38,200
# 2024-03      €18,700  €25,900  €31,400  €36,200  €40,100

# Interpretation:
# - 2024-01 cohort: After 6 months, avg CLV = €32,400 / num_customers
# - If cohort had 500 customers → CLV = €32,400 / 500 = €64.80

# Step 4: Segment customers by predicted CLV
orders_with_clv = orders.merge(
    cohort_cumulative.iloc[:, -1].reset_index().rename(columns={cohort_cumulative.columns[-1]: 'clv'}),
    on='cohort_month'
)

# Create CLV segments
orders_with_clv['clv_segment'] = pd.cut(
    orders_with_clv['clv'],
    bins=[0, 50, 150, 500, 10000],
    labels=['Low', 'Medium', 'High', 'VIP']
)

print("\\n[EUR] Customer Segmentation:")
print(orders_with_clv.groupby('clv_segment').agg({
    'user_id': 'nunique',
    'order_value': 'sum'
}))

# Use segments for targeting:
# - Low CLV: Minimal retention spend, focus on upsells
# - Medium CLV: Standard email campaigns
# - High CLV: Personalized offers, priority support
# - VIP CLV: White-glove service, dedicated account manager`}</Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 44 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 45: Email Recovery Flows */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Email Recovery Flows - Cart Abandonment & Winback Campaigns</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> 70% cart abandonment means 7 out of 10 people add items to cart but don't buy. Automated email recovery flows recover 10-30% of abandoned carts. Yet 40% of e-commerce sites send NO abandoned cart emails (leaving €50-200k/year on the table).
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> 3-email abandoned cart sequence recovers 15-25% of lost carts. For 5,000 abandons/month × €120 AOV × 20% recovery = €120k/month (€1.44M/year). Winback campaigns (re-engage churned customers) add another €30-80k/year.
          </Text>
        </View>

        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY - Shopify/WooCommerce Built-in Emails',
              difficulty: 'LOW',
              cost: '€0-20/month (Shopify plan or free plugin)',
              time: '2-4h (setup + testing)',
              forWhom: 'Small e-commerce (<500 orders/month), Shopify/WooCommerce users, startups',
              steps: [
                'Enable abandoned cart emails in Shopify Settings > Notifications (built-in for Shopify plans)',
                'For WooCommerce: Install free plugin (YITH WooCommerce Recover Abandoned Cart)',
                'Set up 3-email sequence: 1h delay, 24h delay, 72h delay (higher frequency = better recovery)',
                'Customize email copy: Subject "You left something behind!" → "Still interested? 10% off" → "Last chance!"',
                'Add product images + CTA button (direct link to checkout, pre-filled)',
                'Test with your own email (add to cart, abandon, verify email arrives)',
              ],
              roi: '€40-80k/year (recovering 15% of 3k abandons/month at €100 AOV)',
              breakEven: 'Instant (free or <€20/month)',
            },
            {
              number: 2,
              title: 'Hybrid - Klaviyo/Mailchimp Automation',
              difficulty: 'MEDIUM',
              cost: '€100-300/month (email platform + setup)',
              time: '6-10h (flows + segmentation)',
              forWhom: 'Mid-size e-commerce (500-3k orders/month), growing brands, need advanced segmentation',
              steps: [
                'Set up Klaviyo or Mailchimp (integrate with Shopify/WooCommerce)',
                'Create 3-email abandoned cart flow (1h, 24h, 72h delays)',
                'Add browse abandonment flow (user viewed products but did not add to cart, 12h delay)',
                'Set up winback flow (customers who have not purchased in 60 days, 3-email sequence)',
                'Segment by cart value (high-value carts get bigger discounts: €200+ cart = 15% off)',
                'A/B test subject lines and discount amounts (test 10% vs 15% vs 20% off)',
              ],
              roi: '€100-180k/year (20-25% recovery rate on 5k abandons/month)',
              breakEven: '1-2 weeks',
            },
            {
              number: 3,
              title: 'Agency - Full Email Marketing Overhaul',
              difficulty: 'LOW',
              cost: '€1,500-4,000 (agency setup + 3 months management)',
              time: '4-6h/month (review meetings)',
              forWhom: 'Large e-commerce (3k+ orders/month), complex product catalogs, enterprise',
              steps: [
                'Onboard with email marketing agency (Klaviyo/Mailchimp certified partner)',
                'Full flow setup: Abandoned cart, browse abandonment, post-purchase, winback, VIP campaigns',
                'Dynamic product recommendations in emails (show exact products viewed/abandoned)',
                'Predictive send time optimization (AI determines best time to send for each user)',
                'Advanced segmentation (RFM: Recency, Frequency, Monetary analysis)',
                'Monthly creative optimization (test email templates, subject lines, CTAs)',
              ],
              roi: '€250-450k/year (25-30% recovery rate on 8k abandons/month)',
              breakEven: '2-4 weeks',
            },
          ]}
          codeSnippet={{
            title: '[CODE] KLAVIYO API - TRACK ABANDONED CART EVENT',
            code: `// Send cart abandonment event to Klaviyo when user adds to cart
// Klaviyo will automatically trigger email flow

const KLAVIYO_PUBLIC_KEY = 'YOUR_PUBLIC_API_KEY';

async function trackCartAbandonment(cart) {
  const event = {
    token: KLAVIYO_PUBLIC_KEY,
    event: 'Abandoned Cart',
    customer_properties: {
      $email: cart.email,
      $first_name: cart.firstName,
    },
    properties: {
      $value: cart.totalValue,
      ItemNames: cart.items.map(item => item.name),
      Items: cart.items.map(item => ({
        ProductID: item.id,
        SKU: item.sku,
        ProductName: item.name,
        Quantity: item.quantity,
        ItemPrice: item.price,
        RowTotal: item.quantity * item.price,
        ProductURL: \`https://yoursite.com/products/\${item.slug}\`,
        ImageURL: item.imageUrl,
      })),
      CheckoutURL: \`https://yoursite.com/checkout?cart_id=\${cart.id}\`,
    },
    time: Math.floor(Date.now() / 1000),
  };

  await fetch('https://a.klaviyo.com/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ data: btoa(JSON.stringify(event)) }),
  });
}

// Trigger on cart update (when user adds items but doesn't checkout within 1h)
let abandonmentTimer;

function onCartUpdate(cart) {
  clearTimeout(abandonmentTimer);

  // Wait 1 hour before marking as abandoned
  abandonmentTimer = setTimeout(() => {
    if (!cart.isCheckedOut) {
      trackCartAbandonment(cart);
      console.log('✓ Abandoned cart tracked in Klaviyo');
    }
  }, 60 * 60 * 1000); // 1 hour
}

// In Klaviyo UI, create Flow:
// Trigger: Someone added to cart
// Filter: NOT completed checkout in last 1h
// Email 1 (1h delay): "You left something behind!"
// Email 2 (24h delay): "Still interested? Here's 10% off" + discount code
// Email 3 (72h delay): "Last chance! Cart expires soon" + urgency`
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 45 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 46: Churn Prevention */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>Churn Prevention - Early Warning System & Retention Campaigns</Text>

        <View style={[styles.box, styles.situationBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[+] CURRENT SITUATION:</Text> 5% monthly churn = losing 46% of customers annually. For SaaS with 1,000 customers at €100/month: 5% churn = €5k/month lost revenue (€60k/year). Most companies only notice churn AFTER cancellation (too late). Early detection allows proactive retention (50-70% save rate).
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[EUR] REVENUE IMPACT:</Text> Reducing monthly churn from 5% to 3% doubles customer lifespan (from 20 months to 33 months). For SaaS at €100/month: 13 extra months × 1,000 customers = €1.3M additional LTV. Retention campaigns cost €5-20 per save (ROI: 500-2,000%).
          </Text>
        </View>

        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>[*] CHURN PREDICTION SIGNALS (EARLY WARNING):</Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Usage Decline:</Text> 50%+ drop in logins/activity in last 30 days (predict churn 60 days out)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Feature Abandonment:</Text> Stopped using key features (e.g., SaaS user hasn't created report in 21 days)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Support Tickets:</Text> 3+ support tickets in 30 days = 70% churn risk (frustrated users)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Billing Failures:</Text> Payment declined 2+ times = 60% churn (passive churn, recoverable)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>5.</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Email Disengagement:</Text> Hasn't opened emails in 45+ days (lost interest)
              </Text>
            </View>
          </View>
        </View>

        <ResearchCitation
          citations={[
            {
              source: 'ProfitWell (2023)',
              stat: 'Proactive retention outreach saves 50-70% of at-risk customers vs <10% reactive saves',
              year: '2023',
            },
          ]}
        />

        <View style={styles.codeBox}>
          <Text style={styles.codeTitle}>[CODE] SQL - CHURN RISK SCORING QUERY</Text>
          <Text style={components.codeBlockText}>{`-- Identify at-risk customers (churn score 0-100, 80+ = high risk)
-- Run weekly, export to CRM for retention campaigns

WITH user_activity AS (
  SELECT
    user_id,
    COUNT(*) AS logins_last_30d,
    MAX(login_date) AS last_login,
    DATE_DIFF(CURRENT_DATE(), MAX(login_date), DAY) AS days_since_login
  FROM user_logins
  WHERE login_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  GROUP BY user_id
),

support_tickets AS (
  SELECT
    user_id,
    COUNT(*) AS tickets_last_30d
  FROM tickets
  WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  GROUP BY user_id
),

billing_failures AS (
  SELECT
    user_id,
    COUNT(*) AS failed_payments
  FROM payment_attempts
  WHERE status = 'failed'
    AND attempted_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 60 DAY)
  GROUP BY user_id
)

SELECT
  u.user_id,
  u.email,
  u.plan_name,
  u.mrr,
  COALESCE(a.logins_last_30d, 0) AS logins_last_30d,
  COALESCE(a.days_since_login, 999) AS days_since_login,
  COALESCE(s.tickets_last_30d, 0) AS tickets_last_30d,
  COALESCE(b.failed_payments, 0) AS failed_payments,

  -- Churn risk score (0-100, higher = more likely to churn)
  LEAST(100,
    (CASE WHEN a.logins_last_30d = 0 THEN 40 ELSE 0 END) +
    (CASE WHEN a.days_since_login > 30 THEN 30 ELSE 0 END) +
    (CASE WHEN s.tickets_last_30d >= 3 THEN 20 ELSE 0 END) +
    (CASE WHEN b.failed_payments >= 2 THEN 10 ELSE 0 END)
  ) AS churn_risk_score,

  -- Segment
  CASE
    WHEN churn_risk_score >= 80 THEN 'High Risk'
    WHEN churn_risk_score >= 50 THEN 'Medium Risk'
    ELSE 'Low Risk'
  END AS risk_segment

FROM users u
LEFT JOIN user_activity a ON u.user_id = a.user_id
LEFT JOIN support_tickets s ON u.user_id = s.user_id
LEFT JOIN billing_failures b ON u.user_id = b.user_id

WHERE u.status = 'active' -- Only active customers (haven't churned yet)
  AND churn_risk_score >= 50 -- Only at-risk customers

ORDER BY churn_risk_score DESC;

-- Export results to CRM:
-- - High Risk (80+): Personal phone call from CSM, offer 25% discount or free month
-- - Medium Risk (50-79): Email campaign with re-engagement offer (10% off upgrade)
-- - Track save rate: Did customer stay 90 days after intervention?`}</Text>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[*] RETENTION CAMPAIGN PLAYBOOK</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>High Risk (Churn Score 80+)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Action:</Text> Personal outreach (phone call or video meeting with CSM/founder)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Offer:</Text> 1 free month OR 25% off next 3 months OR custom solution
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Save Rate:</Text> 60-70% (expensive but worth it for high-value customers)
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>Medium Risk (Churn Score 50-79)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Action:</Text> Automated email sequence (3 emails over 2 weeks)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Offer:</Text> "We noticed you haven't logged in. Here's 10% off upgrade" + feature highlight
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>•</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Save Rate:</Text> 30-40% (scalable, lower cost per save)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 46 | LAMA PRO Audit</Text>
        </View>
      </Page>

      {/* Page 47: Implementation Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.headerText}>LAMA PRO AUDIT</Text>
          <Text style={styles.headerClient}>ABC Company</Text>
        </View>

        <Text style={styles.pageTitle}>TRUST - Implementation Summary</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[ROADMAP] 90-DAY CONVERSION & RETENTION TRANSFORMATION</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>WEEK 1-2: Quick Wins (Checkout & Email)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Reduce checkout form fields (Page 41: 12 fields → 4 fields, 25% conversion lift)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Set up abandoned cart emails (Page 45: 3-email sequence, recover 15-20%)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Add trust signals to checkout (SSL badge, money-back guarantee)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 6-10h | <Text style={styles.boldText}>Cost:</Text> €0-500 | <Text style={styles.boldText}>ROI:</Text> €30-80k/year
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>WEEK 3-4: Upsells & Pricing Optimization</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Implement product bundles (Page 42: "Frequently bought together", 15-25% take rate)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Add post-purchase upsells (Thank you page offers, 30-40% conversion)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Test charm pricing (Page 43: €99 vs €100, 8-12% lift)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 8-14h | <Text style={styles.boldText}>Cost:</Text> €200-800 | <Text style={styles.boldText}>ROI:</Text> €40-100k/year
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>WEEK 5-8: Advanced Retention (CLV & Churn Prevention)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Calculate CLV by cohort (Page 44: Segment customers by value)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Build churn prediction model (Page 46: SQL churn scoring)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Launch winback email campaigns (Re-engage customers who haven't purchased in 60+ days)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 12-18h | <Text style={styles.boldText}>Cost:</Text> €300-1,500 | <Text style={styles.boldText}>ROI:</Text> €50-120k/year
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>WEEK 9-12: Scale & Automation</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Deploy ML product recommendations (Page 42: Collaborative filtering)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>A/B test price points (Page 43: Test 10-20% price increases)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>Implement loyalty program (VIP tier for top 10% CLV customers)</Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 15-25h | <Text style={styles.boldText}>Cost:</Text> €500-2,000 | <Text style={styles.boldText}>ROI:</Text> €60-150k/year
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>[EUR] TOTAL MONETIZE INVESTMENT - 3 PATHS</Text>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>1. DIY Path</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost:</Text> €1,000-3,000 (90 days, tools + dev time)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>T</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 40-65h over 12 weeks
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>R</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €80-180k/year (25-35% conversion/retention improvement)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 2,667-18,000%
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>2. Hybrid Path (CRO Consultant + Email Specialist)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost:</Text> €4,000-9,000 (freelancers + tools, 3 months)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>T</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 12-20h (review meetings)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>R</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €150-300k/year (35-50% improvement)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 1,667-7,500%
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: '#FFFFFF', marginTop: 12 }]}>3. Agency Path (Full CRO + Retention Agency)</Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>€</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Total Cost:</Text> €12,000-25,000 (3 months, full-service)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>T</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Time:</Text> 10-15h (strategy + approvals)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>R</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>Revenue Impact:</Text> €300-600k/year (50-70% improvement)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={[styles.bulletDot, { color: '#FFFFFF' }]}>✓</Text>
              <Text style={[styles.bulletText, { color: '#FFFFFF' }]}>
                <Text style={styles.boldText}>ROI:</Text> 1,200-5,000%
              </Text>
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
              <Text style={styles.bulletText}>
                Start DIY (Weeks 1-4): Checkout optimization + cart abandonment emails (€500, 15h)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletText}>
                Hire email specialist (Weeks 5-8): Advanced flows + winback campaigns (€1-2k)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletText}>
                CRO consultant for A/B testing (Weeks 9-12): Price optimization + upsell testing (€2-4k)
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>4.</Text>
              <Text style={styles.bulletText}>
                Agency for scale (Month 4+): Only if over €500k/year revenue and need full redesign
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - TRUST Section</Text>
          <Text style={styles.footerText}>Page 47 | LAMA PRO Audit</Text>
        </View>
      </Page>
    </>
  );
}

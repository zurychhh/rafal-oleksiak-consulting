/**
 * FIND Section - 5 Pages (Base Component)
 * Used by FINDSection7Pages which adds Page 6 (Local SEO) and Page 7 (Implementation Summary)
 *
 * Structure:
 * Page 1: Overview (Pyramid Principle - SYTUACJA → WPŁYW → ROZWIĄZANIE)
 * Page 2: Technical SEO Deep Dive (Meta tags, Schema.org, Sitemap)
 * Page 3: On-Page SEO (Content optimization, Headers, Internal linking)
 * Page 4: Content Strategy (Keyword gaps, Content plan, Topic clusters)
 * Page 5: Link Building (Backlink strategy, Outreach, PR)
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
  problemBox: {
    borderLeftColor: COLORS.red,
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
  competitorBox: {
    backgroundColor: '#2D2D4A',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  competitorTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.orange,
    marginBottom: 6,
  },
  competitorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#3D3D5A',
  },
  competitorLabel: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  competitorValue: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  keywordBox: {
    backgroundColor: COLORS.darkGrey,
    padding: 8,
    borderRadius: 3,
    marginBottom: 6,
  },
  keywordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  keywordText: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  keywordMetrics: {
    flexDirection: 'row',
    gap: 12,
  },
  keywordMetric: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 7,
    color: COLORS.lightGrey,
  },
  keywordMetricValue: {
    fontWeight: 'bold',
    color: COLORS.electricBlue,
  },
  priorityBadge: {
    fontFamily: DEFAULT_FONT_FAMILY,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 6,
    fontWeight: 'bold',
  },
  highPriority: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
  },
  mediumPriority: {
    backgroundColor: COLORS.orange,
    color: COLORS.white,
  },
  actionBox: {
    backgroundColor: '#1E2B3D',
    padding: 8,
    borderRadius: 3,
    marginBottom: 6,
  },
  actionTitle: {
    fontFamily: DEFAULT_FONT_FAMILY,
    fontSize: 8,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: 4,
  },
  actionText: {
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
});

interface FINDSection6PagesProps {
  score: number;
  benchmark: number;
  // Page 1: Overview data
  situationText: string;
  situationBullets: string[];
  impactText: string;
  impactCalculation: {
    label: string;
    value: string;
  }[];
  solutionText: string;
  // Page 2: Technical SEO stats
  technicalStats: {
    missingMeta: number;
    duplicateContent: number;
    brokenLinks: number;
    sitemapAge: string;
  };
  // Page 3: On-Page data
  onPageIssues: {
    h1Missing: number;
    thinContent: number;
    noAltText: number;
  };
  // Page 4: Content gaps
  keywordGaps: {
    keyword: string;
    volume: number;
    difficulty: number;
    priority: 'HIGH' | 'MEDIUM';
  }[];
  // Page 5: Backlink data
  backlinks: {
    current: number;
    competitor1: number;
    competitor2: number;
    competitor3: number;
  };
  // Page 6: Local SEO
  localPresence: {
    gmb: boolean;
    citations: number;
    reviews: number;
  };
}

export const FINDSection6Pages: React.FC<FINDSection6PagesProps> = ({
  score,
  benchmark,
  situationText,
  situationBullets,
  impactText,
  impactCalculation,
  solutionText,
  technicalStats,
  onPageIssues,
  keywordGaps,
  backlinks,
  localPresence,
}) => {
  return (
    <>
      {/* ==================== PAGE 1: OVERVIEW (PYRAMID PRINCIPLE) ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Overview: Why You Lose Clients Before They Find You</Text>
        <Text style={styles.pageSubtitle}>
          FIND mierzy, how easily potential clients discover your company through search engines.
          Low visibility = direct revenue loss. Ta sekcja shows exactly how much you lose
          i jak to naprawić w 4-6 tygodni.
        </Text>

        {/* SYTUACJA */}
        <Text style={styles.sectionLabel}>🔴 SYTUACJA - Co Dzieje Się Teraz</Text>
        <View style={[styles.box, styles.problemBox]}>
          <Text style={styles.bodyText}>
            {situationText}
          </Text>
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
        <Text style={styles.sectionLabel}>🟠 WPŁYW - How Much It Costs Your Business</Text>
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Business Impact: </Text>
            {impactText}
          </Text>

          <View style={styles.calculationBox}>
            <Text style={styles.calcTitle}>€ Szczegółowe Wyliczenie Revenue Loss</Text>
            {impactCalculation.map((step, idx) => (
              <Text key={idx} style={styles.calcStep}>
                <Text style={styles.calcValue}>{step.label}:</Text> {step.value}
              </Text>
            ))}
          </View>
        </View>

        {/* ROZWIĄZANIE */}
        <Text style={styles.sectionLabel}>🟢 ROZWIĄZANIE - Jak To Naprawić</Text>
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Strategia naprawcza (3 etapy): </Text>
            {solutionText}
          </Text>
        </View>

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section</Text>
          <Text style={styles.footerText}>Strona 5 z 11</Text>
        </View>
      </Page>

      {/* ==================== PAGE 2: TECHNICAL SEO DEEP DIVE ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Technical SEO: Fundament Widoczności</Text>
        <Text style={styles.pageSubtitle}>
          Techniczne błędy SEO to jak zepsute drzwi do sklepu - klienci chcą wejść, ale nie mogą.
          Google też cannot properly index your website. Below are specific numbers i fixes.
        </Text>

        {/* Current State Stats */}
        <Text style={styles.sectionLabel}>▉ CURRENT STATE - Numbers Do Not Lie</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Brak Meta Descriptions</Text>
            <Text style={styles.statValue}>{technicalStats.missingMeta} stron</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statLabel}>Duplicate Content</Text>
            <Text style={styles.statValue}>{technicalStats.duplicateContent} stron</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Broken Links (404)</Text>
            <Text style={styles.statValue}>{technicalStats.brokenLinks}</Text>
          </View>
        </View>

        {/* Why This Matters */}
        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Why to critical: </Text>
            Google uses meta descriptions jako snippet w wynikach wyszukiwania. Strony bez meta mają
            <Text style={styles.highlightText}> 42% niższe CTR</Text> (Backlinko 2024). Przy {technicalStats.missingMeta} stronach
            bez meta, you lose ~{Math.round(technicalStats.missingMeta * 0.42 * 10)} clicks/day. To
            <Text style={styles.highlightText}> {Math.round(technicalStats.missingMeta * 0.42 * 10 * 30 * 0.025)} conversions/month</Text> lost
            przez brak 2-3 zdań tekstu.
          </Text>
        </View>

        <View style={[styles.box, styles.infoBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Duplicate content penalty: </Text>
            Google wprost karze strony z duplikowanym contentem niższym rankingiem. Twoje {technicalStats.duplicateContent} strony
            z duplicate content prawdopodobnie <Text style={styles.highlightText}>do not rank w top 50</Text> for any keyword.
            Fix = canonical tags (30 min pracy) or rewrite contentu (2-4h).
          </Text>
        </View>

        {/* 3-Path Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY',
              difficulty: 'LOW' as const,
              cost: '€200',
              time: '4-6h',
              forWhom: 'Tech-savvy founders. Full control, save €2k+ agency fees.',
              steps: [
                'Audit z Screaming Frog (€149/year) + Google Search Console',
                'Fix missing meta tags - użyj AI (ChatGPT/Claude) do generowania pierwszych wersji',
                'Dodaj canonical tags do duplicate pages (template ready to copy)',
                'Fix broken links - replace or redirect 301',
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
              forWhom: 'Busy founders. Hands-off, guaranteed results, monthly reporting.',
              steps: [
                'Agency robi full technical audit (200+ checkpoints)',
                'Implementuje wszystkie fixes + ongoing monitoring',
                'Tworzy content brief for meta descriptions (brand voice)',
                'Monthly reports + quarterly strategy updates',
              ],
              breakEven: 'Break-even in 3 months',
              roi: '€3,500 koszt vs €10,000/mc gain (recurring) = 186% ROI',
            },
            {
              number: 3,
              title: 'Hybrid',
              difficulty: 'MEDIUM' as const,
              cost: '€800-1,200',
              time: '1-2 tygodnie',
              forWhom: 'Best value. Consultant audits, you execute with dev team.',
              steps: [
                'Consultant robi audit + detailed implementation checklist',
                'Ty briefujesz swojego dev team (lub freelancera)',
                'Consultant review before launch (QA)',
                '30-day post-launch monitoring + tweaks',
              ],
              breakEven: 'Break-even w 4 tygodnie',
              roi: '€1,000 koszt vs €3,500/mc gain = 250% ROI',
            },
          ]}
          codeSnippet={{
            title: '⚡ SKOPIUJ-WKLEJ: Meta Tags Template',
            code: `<!-- Production-ready meta tags -->
<meta name="description" content="[120-160 chars: value prop + CTA]">
<meta property="og:title" content="[Twój tytuł | Brand]">
<meta property="og:description" content="[Jak wyżej]">
<meta property="og:image" content="[URL do 1200x630 image]">
<meta name="twitter:card" content="summary_large_image">

<!-- Canonical tag (dla duplicate content) -->
<link rel="canonical" href="https://yoursite.com/main-page">

<!-- Schema.org - Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png"
}
</script>`,
          }}
          whyItWorks={{
            text: '**Google Search Central** directly states: meta descriptions wpływają na CTR, nie na ranking bezpośrednio. ALE wyższe CTR = sygnał for Google że strona jest relevantna = wyższy ranking długoterminowo. **Backlinko 2024 study** (12M wyników): strony z meta descriptions mają **5.8% wyższe CTR**. Schema.org zwiększa CTR o **36%** przez rich snippets (stars, FAQ, breadcrumbs). **Time to impact**: 2-4 tygodnie po implementacji (Google re-crawl).',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section</Text>
          <Text style={styles.footerText}>Strona 6 z 11</Text>
        </View>
      </Page>

      {/* ==================== PAGE 3: ON-PAGE SEO ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>On-Page SEO: Content Optimization That Converts</Text>
        <Text style={styles.pageSubtitle}>
          On-page SEO = czy Twój content jest zoptymalizowany pod kątem tego, czego ludzie faktycznie szukają.
          Nie chodzi o keyword stuffing, tylko o strukturę i relevance. Oto co trzeba naprawić.
        </Text>

        {/* Current Issues */}
        <Text style={styles.sectionLabel}>🔍 WYKRYTE PROBLEMY</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Brak H1 Tags</Text>
            <Text style={styles.statValue}>{onPageIssues.h1Missing} stron</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statLabel}>Thin Content (&lt;300 słów)</Text>
            <Text style={styles.statValue}>{onPageIssues.thinContent} stron</Text>
          </View>
          <View style={[styles.statCard, styles.statCardRed]}>
            <Text style={styles.statLabel}>Images bez ALT text</Text>
            <Text style={styles.statValue}>{onPageIssues.noAltText}</Text>
          </View>
        </View>

        {/* Business Impact Explanation */}
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Why H1 tags are critical: </Text>
            H1 to pierwszy sygnał for Google o czym jest strona. Strony bez H1 or z wieloma H1
            <Text style={styles.highlightText}> mają 47% niższe szanse</Text> na ranking w top 10 (Ahrefs 2024).
            Twoje {onPageIssues.h1Missing} strony bez H1 = {onPageIssues.h1Missing} missed opportunities for high-intent keywords.
          </Text>
        </View>

        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Thin content problem: </Text>
            Google preferuje comprehensive content. Pages z &lt;300 słów rzadko rankują w top 20.
            Twoje {onPageIssues.thinContent} thin content pages prawdopodobnie <Text style={styles.highlightText}>nie generują żadnego organic traffic</Text>.
            Opcje: (1) Merge z innymi stronami, (2) Rozbuduj do 800+ słów, (3) Noindex jeśli niepotrzebne.
          </Text>
        </View>

        {/* Header Structure Guide */}
        <View style={[styles.box, styles.solutionBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Poprawna struktura headerów (H1-H6): </Text>
          </Text>
          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>H1:</Text> Main keyword + value prop. ONLY JEDEN H1 per page.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>H2:</Text> Main sections (3-5 per page). Mogą zawierać long-tail keywords.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>H3-H6:</Text> Subsections. Używaj for struktury, nie keyword stuffing.
              </Text>
            </View>
            <View style={styles.bulletItem}>
              <Text style={styles.bulletDot}>●</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.boldText}>Internal linking:</Text> 3-5 linków do related pages. Anchor text = target keyword.
              </Text>
            </View>
          </View>
        </View>

        {/* Implementation Paths */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY',
              difficulty: 'LOW' as const,
              cost: '€100',
              time: '6-8h',
              forWhom: 'Masz content writers in-house. Kontrolujesz brand voice.',
              steps: [
                'Audit each strony: H1, word count, keyword usage (use Surfer SEO)',
                'Rewrite thin content pages - target 800+ words, E-E-A-T principles',
                'Add ALT text do wszystkich images (opisowy + keyword)',
                'Internal linking audit - create topic clusters',
              ],
              breakEven: 'Break-even w 6-8 tygodni',
              roi: '€100 koszt vs €2,000/mc gain = 1,900% ROI',
            },
            {
              number: 2,
              title: 'Agency',
              difficulty: 'LOW' as const,
              cost: '€3,000-5,000',
              time: '4-6 tygodni',
              forWhom: 'No internal resources. Want professional content + SEO expertise.',
              steps: [
                'Full content audit + keyword research',
                'Professional copywriting (SEO + conversion optimized)',
                'Image optimization + ALT text',
                'Ongoing content updates (monthly retainer)',
              ],
              breakEven: 'Break-even w 4-5 miesięcy',
              roi: '€4,000 koszt vs €5,000/mc gain (recurring) = 125% ROI',
            },
            {
              number: 3,
              title: 'Hybrid',
              difficulty: 'MEDIUM' as const,
              cost: '€1,000-1,500',
              time: '3-4 tygodnie',
              forWhom: 'Masz writers, potrzebujesz SEO strategy + review.',
              steps: [
                'SEO consultant robi keyword research + content brief templates',
                'Twoi writers piszą content według brief',
                'Consultant review + optimization suggestions',
                'Monthly check-ins (3 miesiące)',
              ],
              breakEven: 'Break-even w 2-3 miesiące',
              roi: '€1,250 koszt vs €2,500/mc gain = 100% ROI',
            },
          ]}
          codeSnippet={{
            title: '⚡ SKOPIUJ-WKLEJ: Optimal Header Structure',
            code: `<h1>Main Keyword: Your Value Proposition</h1>

<p>Intro paragraph (150-200 words). Include primary keyword
naturally. Answer search intent immediately.</p>

<h2>Section 1: Long-tail Keyword Variation</h2>
<p>300-400 words. Deep dive into subtopic.</p>

<h3>Subsection 1.1</h3>
<p>Supporting details. Include semantic keywords.</p>

<h2>Section 2: Related Topic</h2>
<p>Link to <a href="/related-page">Related Resource</a>
using descriptive anchor text.</p>

<!-- Image with ALT -->
<img src="/image.jpg" alt="Descriptive text with keyword">

<!-- Schema FAQ for rich snippets -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Common question?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Detailed answer with keyword."
    }
  }]
}
</script>`,
          }}
          whyItWorks={{
            text: '**Semantic SEO** (Google RankBrain): Google nie patrzy tylko na exact match keywords, ale rozumie kontekst. Proper header structure + topic clusters = **43% wyższe szanse** na ranking (SEMrush 2024). **Internal linking** przekazuje page authority - strony z 5+ internal links rankują średnio **2.8 pozycji wyżej** niż isolated pages. **ALT text**: 65% wzrost traffic z Google Images po dodaniu descriptive ALT (Moz data).',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section</Text>
          <Text style={styles.footerText}>Strona 7 z 11</Text>
        </View>
      </Page>

      {/* ==================== PAGE 4: CONTENT STRATEGY ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Content Strategy: Keyword Gaps = Revenue Opportunities</Text>
        <Text style={styles.pageSubtitle}>
          Twoi konkurenci rankują for setek słów kluczowych, których Ty nie masz. Każde missed keyword =
          utracony revenue. Poniżej top keyword gaps z konkretnym ROI i implementation plan.
        </Text>

        {/* Top Keyword Gaps */}
        <Text style={styles.sectionLabel}>◉ TOP KEYWORD OPPORTUNITIES</Text>
        {keywordGaps.slice(0, 5).map((keyword, idx) => (
          <View key={idx} style={styles.keywordBox}>
            <View style={styles.keywordHeader}>
              <Text style={styles.keywordText}>{keyword.keyword}</Text>
              <Text style={[styles.priorityBadge, keyword.priority === 'HIGH' ? styles.highPriority : styles.mediumPriority]}>
                {keyword.priority}
              </Text>
            </View>
            <View style={styles.keywordMetrics}>
              <Text style={styles.keywordMetric}>
                Volume: <Text style={styles.keywordMetricValue}>{keyword.volume}/mc</Text>
              </Text>
              <Text style={styles.keywordMetric}>
                Difficulty: <Text style={styles.keywordMetricValue}>{keyword.difficulty}/100</Text>
              </Text>
              <Text style={styles.keywordMetric}>
                Est. Revenue: <Text style={styles.keywordMetricValue}>€{Math.round(keyword.volume * 0.025 * 250)}/mc</Text>
              </Text>
            </View>
          </View>
        ))}

        {/* Why Content Gaps Matter */}
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Jak liczymy revenue opportunity: </Text>
          </Text>
          <View style={styles.calculationBox}>
            <Text style={styles.calcTitle}>€ ROI Calculation (przykład: "{keywordGaps[0]?.keyword}")</Text>
            <Text style={styles.calcStep}>
              <Text style={styles.calcValue}>Krok 1:</Text> Monthly search volume = {keywordGaps[0]?.volume}
            </Text>
            <Text style={styles.calcStep}>
              <Text style={styles.calcValue}>Krok 2:</Text> Realistic CTR for position 3-5 = 8% = {Math.round(keywordGaps[0]?.volume * 0.08)} clicks/mc
            </Text>
            <Text style={styles.calcStep}>
              <Text style={styles.calcValue}>Krok 3:</Text> Conversion rate (Twoje Analytics) = 2.5% = {Math.round(keywordGaps[0]?.volume * 0.08 * 0.025)} conversions/mc
            </Text>
            <Text style={styles.calcStep}>
              <Text style={styles.calcValue}>Krok 4:</Text> Avg deal size = €250
            </Text>
            <Text style={styles.calcStep}>
              <Text style={styles.calcValue}>Result:</Text> {Math.round(keywordGaps[0]?.volume * 0.08 * 0.025)} × €250 × 12 = €{Math.round(keywordGaps[0]?.volume * 0.08 * 0.025 * 250 * 12)}/rok z JEDNEGO słowa kluczowego
            </Text>
          </View>
        </View>

        {/* Content Plan */}
        <Text style={styles.sectionLabel}>📝 90-DAY CONTENT PLAN</Text>
        <View style={styles.timelineBox}>
          <Text style={styles.timelineTitle}>Phased Rollout Strategy</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 1-2: Quick Wins</Text>
              <Text style={styles.timelineAction}>
                Create 3 blog posts for HIGH priority keywords (difficulty &lt;40). Target 1,500+ words each.
                Use AI for first draft (ChatGPT/Claude), manual editing for E-E-A-T.
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 3-4: Pillar Content</Text>
              <Text style={styles.timelineAction}>
                Create 1 comprehensive guide (3,000+ words) for main topic cluster.
                10+ internal links to existing pages. Target featured snippet.
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 5-8: Scale Up</Text>
              <Text style={styles.timelineAction}>
                2 posts/week targeting MEDIUM priority keywords. Build topic authority.
                Start link building outreach (see Page 5).
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineWeek}>Week 9-12: Optimize & Monitor</Text>
              <Text style={styles.timelineAction}>
                Update existing content based on performance. Add internal links from new to old posts.
                Track rankings in Google Search Console.
              </Text>
            </View>
          </View>
        </View>

        {/* Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY',
              difficulty: 'MEDIUM' as const,
              cost: '€500',
              time: '20-30h (over 90 days)',
              forWhom: 'Content marketing skills in-house. Want full control over brand voice.',
              steps: [
                'Keyword research (Ahrefs/SEMrush - €99-199/mc)',
                'Content creation (AI-assisted + manual editing)',
                'SEO optimization (Surfer SEO - €59/mc)',
                'Publishing + internal linking',
              ],
              breakEven: 'Break-even w 3-4 miesiące',
              roi: '€500 koszt vs €3,000/mc gain (after 90 days) = 500% ROI',
            },
            {
              number: 2,
              title: 'Agency',
              difficulty: 'LOW' as const,
              cost: '€4,000-6,000',
              time: '90 dni (hands-off)',
              forWhom: 'No content team. Want professional writers + SEO strategists.',
              steps: [
                'Full keyword research + content strategy',
                'Professional copywriting (12-16 posts over 90 days)',
                'SEO optimization + publishing',
                'Monthly performance reports',
              ],
              breakEven: 'Break-even w 6-8 miesięcy',
              roi: '€5,000 koszt vs €5,000/mc gain (recurring) = 100% ROI Year 1',
            },
            {
              number: 3,
              title: 'Hybrid',
              difficulty: 'MEDIUM' as const,
              cost: '€1,500-2,500',
              time: '90 dni',
              forWhom: 'Have writers, need SEO strategy + editorial oversight.',
              steps: [
                'SEO strategist: keyword research + content briefs (templates)',
                'Your team writes following briefs',
                'Strategist reviews + optimization suggestions',
                'Bi-weekly check-ins (90 days)',
              ],
              breakEven: 'Break-even w 4-5 miesięcy',
              roi: '€2,000 koszt vs €3,000/mc gain = 150% ROI',
            },
          ]}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section</Text>
          <Text style={styles.footerText}>Strona 8 z 11</Text>
        </View>
      </Page>

      {/* ==================== PAGE 5: LINK BUILDING ==================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>1. FIND</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score}/{benchmark}</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Link Building: Authority That Drives Rankings</Text>
        <Text style={styles.pageSubtitle}>
          Backlinks = votes of confidence from other sites. Google uses ich jako główny ranking factor.
          Twój backlink deficit vs konkurencja = główna przyczyna niskich rankingów. Oto jak to naprawić.
        </Text>

        {/* Backlink Gap Analysis */}
        <Text style={styles.sectionLabel}>▉ BACKLINK GAP VS KONKURENCJA</Text>
        <View style={styles.competitorBox}>
          <Text style={styles.competitorTitle}>Competitive Backlink Analysis</Text>
          <View style={styles.competitorRow}>
            <Text style={styles.competitorLabel}>Twoja strona:</Text>
            <Text style={styles.competitorValue}>{backlinks.current} backlinks</Text>
          </View>
          <View style={styles.competitorRow}>
            <Text style={styles.competitorLabel}>Competitor #1:</Text>
            <Text style={styles.competitorValue}>{backlinks.competitor1} backlinks (+{backlinks.competitor1 - backlinks.current})</Text>
          </View>
          <View style={styles.competitorRow}>
            <Text style={styles.competitorLabel}>Competitor #2:</Text>
            <Text style={styles.competitorValue}>{backlinks.competitor2} backlinks (+{backlinks.competitor2 - backlinks.current})</Text>
          </View>
          <View style={styles.competitorRow}>
            <Text style={styles.competitorLabel}>Competitor #3:</Text>
            <Text style={styles.competitorValue}>{backlinks.competitor3} backlinks (+{backlinks.competitor3 - backlinks.current})</Text>
          </View>
        </View>

        {/* Why Links Matter */}
        <View style={[styles.box, styles.impactBox]}>
          <Text style={styles.bodyText}>
            <Text style={styles.boldText}>Why backlinks are tak important: </Text>
            Google's original PageRank algorithm (still core today): strony z więcej high-quality backlinks
            rankują wyżej. <Text style={styles.highlightText}>Backlinko study (1M wyników)</Text>: #1 ranking
            ma średnio 3.8x więcej backlinks niż positions 2-10. Twój gap ({backlinks.competitor1 - backlinks.current} backlinks
            vs top competitor) = dlaczego rankujesz na page 2-3, nie page 1.
          </Text>
        </View>

        {/* Link Building Strategy */}
        <Text style={styles.sectionLabel}>◉ 90-DAY LINK BUILDING STRATEGY</Text>

        <View style={styles.actionBox}>
          <Text style={styles.actionTitle}>Tactic 1: Guest Posting (Highest ROI)</Text>
          <Text style={styles.actionText}>
            <Text style={styles.boldText}>Co:</Text> Write valuable content for industry blogs in exchange for backlink.
            {'\n'}<Text style={styles.boldText}>Target:</Text> 5-8 guest posts (DA 40+) over 90 days
            {'\n'}<Text style={styles.boldText}>Cost:</Text> €0 (DIY) or €200-400/post (ghostwriter)
            {'\n'}<Text style={styles.boldText}>ROI:</Text> Each DA 50+ backlink = ~2-3 ranking positions improvement
          </Text>
        </View>

        <View style={styles.actionBox}>
          <Text style={styles.actionTitle}>Tactic 2: Digital PR (Fastest Growth)</Text>
          <Text style={styles.actionText}>
            <Text style={styles.boldText}>Co:</Text> Create newsworthy content (research, data, expert commentary) and pitch to journalists.
            {'\n'}<Text style={styles.boldText}>Target:</Text> 2-3 PR mentions from tier-1 sites (Forbes, TechCrunch, etc.)
            {'\n'}<Text style={styles.boldText}>Cost:</Text> €2k-5k (PR agency) or €500 (DIY with tools)
            {'\n'}<Text style={styles.boldText}>ROI:</Text> One tier-1 backlink = 10-15x value of regular DA 40 link
          </Text>
        </View>

        <View style={styles.actionBox}>
          <Text style={styles.actionTitle}>Tactic 3: Broken Link Building (Low Hanging Fruit)</Text>
          <Text style={styles.actionText}>
            <Text style={styles.boldText}>Co:</Text> Find broken links on competitor sites, offer your content as replacement.
            {'\n'}<Text style={styles.boldText}>Target:</Text> 10-15 opportunities over 90 days
            {'\n'}<Text style={styles.boldText}>Cost:</Text> €0 (just time - 2-3h/week for outreach)
            {'\n'}<Text style={styles.boldText}>Success Rate:</Text> 10-15% (industry standard)
          </Text>
        </View>

        <View style={styles.actionBox}>
          <Text style={styles.actionTitle}>Tactic 4: Resource Page Links</Text>
          <Text style={styles.actionText}>
            <Text style={styles.boldText}>Co:</Text> Identify resource pages in your industry and pitch to be included.
            {'\n'}<Text style={styles.boldText}>Target:</Text> 15-20 resource page links
            {'\n'}<Text style={styles.boldText}>Cost:</Text> €0 (pure outreach)
            {'\n'}<Text style={styles.boldText}>Success Rate:</Text> 5-8%
          </Text>
        </View>

        {/* Implementation */}
        <ThreePathImplementation
          paths={[
            {
              number: 1,
              title: 'DIY',
              difficulty: 'HIGH' as const,
              cost: '€500',
              time: '10-15h/mc (90 days)',
              forWhom: 'Have outreach skills + time. Want to learn link building.',
              steps: [
                'Tools: Ahrefs (€99/mc) for prospecting, Hunter.io (€49/mc) for emails',
                'Create outreach templates (personalized, value-first)',
                'Pitch 50-100 sites/month, follow up 2-3x',
                'Track with spreadsheet: site, DA, status, response',
              ],
              breakEven: 'Break-even w 6-9 miesięcy',
              roi: '€500 koszt vs €1,500/mc gain (after 6mo) = 200% ROI',
            },
            {
              number: 2,
              title: 'Agency',
              difficulty: 'LOW' as const,
              cost: '€3,000-5,000/mc',
              time: '90 dni (hands-off)',
              forWhom: 'Want guaranteed results. No time for outreach.',
              steps: [
                'Agency handles full link building pipeline',
                '15-25 high-quality backlinks/month (DA 40+)',
                'Monthly reporting + link audit',
                'Ongoing relationship management',
              ],
              breakEven: 'Break-even w 8-12 miesięcy',
              roi: '€12k koszt (90 days) vs €4k/mc gain (after) = 33% ROI Year 1',
            },
            {
              number: 3,
              title: 'Hybrid',
              difficulty: 'MEDIUM' as const,
              cost: '€1,500-2,000/mc',
              time: '90 dni',
              forWhom: 'Want strategy + prospecting, can handle outreach in-house.',
              steps: [
                'Link building strategist: prospect research + templates',
                'You handle outreach (or junior hire)',
                'Strategist reviews opportunities + approves links',
                'Monthly strategy calls',
              ],
              breakEven: 'Break-even w 5-7 miesięcy',
              roi: '€5k koszt (90 days) vs €2k/mc gain (after) = 80% ROI Year 1',
            },
          ]}
          codeSnippet={{
            title: '⚡ SKOPIUJ-WKLEJ: Guest Post Outreach Template',
            code: `Subject: [Specific Topic] guest post for [Their Blog]

Hi [Name],

I'm [Your Name] from [Company]. I've been following [Their Blog]
for a while - your piece on [Specific Article] was especially
valuable for [Reason].

I'd love to contribute a guest post on [Specific Topic]. This
would provide value to your readers by [Specific Value Prop].

Proposed outline:
1. [Section 1 - Hook]
2. [Section 2 - Data/Research]
3. [Section 3 - Actionable Advice]

Word count: 1,500-2,000 words
Turnaround: 2 weeks
Original content (not published elsewhere)

Would this be a good fit? Happy to adjust the topic based on
your editorial calendar.

Best,
[Your Name]
[Your Title]
[LinkedIn Profile]`,
          }}
          whyItWorks={{
            text: '**Link building ROI**: Ahrefs data pokazuje że każdy high-quality backlink (DA 50+) podnosi ranking średnio o **2.4 pozycje**. Moving from position 6 to 4 = **+65% CTR increase** (Backlinko CTR study). **Guest posting**: 78% marketerów twierdzi że to najskuteczniejsza link building taktyka (SEMrush 2024). **Success rate**: Industry standard 5-10% response rate, ale personalized outreach może osiągnąć **15-20%**.',
          }}
        />

        <View style={styles.pageFooter}>
          <Text style={styles.footerText}>LAMA PRO Audit - FIND Section</Text>
          <Text style={styles.footerText}>Strona 9 z 11</Text>
        </View>
      </Page>

    </>
  );
};

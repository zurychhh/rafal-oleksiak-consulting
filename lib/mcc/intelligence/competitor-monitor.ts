// =============================================================================
// Competitor Intelligence - Monitor and analyze competitor ad activity
// =============================================================================

import Anthropic from '@anthropic-ai/sdk';
import * as cheerio from 'cheerio';
import type {
  Competitor,
  CompetitorInsight,
  CompetitorAd,
  CompetitorAlert,
  Platform,
} from '../types';

// In production, use a database
const competitors: Map<string, Competitor> = new Map();
const insights: Map<string, CompetitorInsight[]> = new Map();
const alerts: CompetitorAlert[] = [];

export class CompetitorMonitor {
  private claude: Anthropic;

  constructor() {
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  // ---------------------------------------------------------------------------
  // Competitor Management
  // ---------------------------------------------------------------------------

  addCompetitor(competitor: Omit<Competitor, 'id'>): Competitor {
    const id = `comp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newCompetitor: Competitor = { ...competitor, id };
    competitors.set(id, newCompetitor);
    return newCompetitor;
  }

  removeCompetitor(id: string): void {
    competitors.delete(id);
    insights.delete(id);
  }

  getCompetitor(id: string): Competitor | undefined {
    return competitors.get(id);
  }

  listCompetitors(): Competitor[] {
    return Array.from(competitors.values());
  }

  // ---------------------------------------------------------------------------
  // Analysis
  // ---------------------------------------------------------------------------

  async analyzeCompetitor(competitorId: string): Promise<CompetitorInsight[]> {
    const competitor = competitors.get(competitorId);
    if (!competitor) throw new Error(`Competitor ${competitorId} not found`);

    const platformInsights: CompetitorInsight[] = [];

    for (const platform of competitor.platforms) {
      try {
        const insight = await this.analyzeCompetitorOnPlatform(competitor, platform);
        platformInsights.push(insight);
      } catch (error) {
        console.error(
          `Failed to analyze ${competitor.name} on ${platform}:`,
          error,
        );
      }
    }

    // Store insights
    const existing = insights.get(competitorId) || [];
    insights.set(competitorId, [...platformInsights, ...existing].slice(0, 50));

    // Update last analyzed
    competitor.lastAnalyzed = new Date().toISOString();
    competitors.set(competitorId, competitor);

    // Generate alerts from changes
    await this.detectChanges(competitorId, platformInsights);

    return platformInsights;
  }

  async analyzeAllCompetitors(): Promise<CompetitorInsight[]> {
    const allInsights: CompetitorInsight[] = [];

    for (const competitor of competitors.values()) {
      if (!competitor.trackingEnabled) continue;

      try {
        const competitorInsights = await this.analyzeCompetitor(competitor.id);
        allInsights.push(...competitorInsights);
      } catch (error) {
        console.error(`Failed to analyze ${competitor.name}:`, error);
      }
    }

    return allInsights;
  }

  // ---------------------------------------------------------------------------
  // Website Scraping & Analysis
  // ---------------------------------------------------------------------------

  private async analyzeCompetitorOnPlatform(
    competitor: Competitor,
    platform: Platform,
  ): Promise<CompetitorInsight> {
    // Step 1: Scrape competitor website for messaging/positioning
    const websiteData = await this.scrapeWebsite(competitor.domain);

    // Step 2: Search for competitor's ad presence
    const adData = await this.searchCompetitorAds(competitor.name, competitor.domain, platform);

    // Step 3: Use Claude to analyze the competitive landscape
    const analysis = await this.aiAnalysis(competitor, platform, websiteData, adData);

    return {
      competitorId: competitor.id,
      competitorName: competitor.name,
      platform,
      analyzedAt: new Date().toISOString(),
      adCopy: adData,
      topKeywords: analysis.topKeywords,
      landingPages: analysis.landingPages,
      positioning: analysis.positioning,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      opportunities: analysis.opportunities,
    };
  }

  private async scrapeWebsite(domain: string): Promise<{
    title: string;
    description: string;
    headings: string[];
    ctas: string[];
    bodyText: string;
  }> {
    try {
      const response = await fetch(`https://${domain}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MCCBot/1.0)',
        },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        return { title: '', description: '', headings: [], ctas: [], bodyText: '' };
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract key elements
      const title = $('title').text().trim();
      const description = $('meta[name="description"]').attr('content') || '';

      const headings: string[] = [];
      $('h1, h2, h3').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 200) headings.push(text);
      });

      const ctas: string[] = [];
      $('a.cta, a.btn, button, [class*="cta"], [class*="button"]').each((_, el) => {
        const text = $(el).text().trim();
        if (text && text.length < 100 && text.length > 2) ctas.push(text);
      });

      // Get body text (first 5000 chars)
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);

      return {
        title,
        description,
        headings: headings.slice(0, 20),
        ctas: [...new Set(ctas)].slice(0, 10),
        bodyText,
      };
    } catch {
      return { title: '', description: '', headings: [], ctas: [], bodyText: '' };
    }
  }

  private async searchCompetitorAds(
    name: string,
    domain: string,
    _platform: Platform,
  ): Promise<CompetitorAd[]> {
    // In production, this would use:
    // - Google Ads Transparency Center API
    // - Meta Ad Library API
    // - LinkedIn Ad Library
    // - Third-party tools (SEMrush, SpyFu, etc.)

    // For now, we use the Meta Ad Library API (publicly accessible)
    try {
      const ads = await this.searchMetaAdLibrary(name, domain);
      return ads;
    } catch {
      return [];
    }
  }

  private async searchMetaAdLibrary(
    name: string,
    domain: string,
  ): Promise<CompetitorAd[]> {
    // Meta Ad Library is accessible without authentication for transparency
    const searchUrl = `https://www.facebook.com/ads/library/api/?` +
      new URLSearchParams({
        search_terms: `${name} ${domain}`,
        ad_type: 'ALL',
        country: 'PL',
        media_type: 'ALL',
      });

    try {
      const response = await fetch(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MCCBot/1.0)' },
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) return [];

      const data = await response.json();

      return (data.results || []).slice(0, 20).map((ad: Record<string, unknown>) => ({
        headline: String(ad.ad_creative_link_title || ''),
        description: String(ad.ad_creative_body || ''),
        displayUrl: String(ad.ad_creative_link_caption || domain),
        landingUrl: String(ad.ad_creative_link_url || ''),
        type: 'image' as const,
        firstSeen: String(ad.ad_delivery_start_time || new Date().toISOString()),
        lastSeen: String(ad.ad_delivery_stop_time || new Date().toISOString()),
      }));
    } catch {
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // AI Analysis
  // ---------------------------------------------------------------------------

  private async aiAnalysis(
    competitor: Competitor,
    platform: Platform,
    websiteData: { title: string; description: string; headings: string[]; ctas: string[]; bodyText: string },
    adData: CompetitorAd[],
  ): Promise<{
    topKeywords: string[];
    landingPages: string[];
    positioning: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  }> {
    const prompt = `Przeanalizuj konkurenta w branży marketingu/konsultingu cyfrowego.

KONKURENT: ${competitor.name} (${competitor.domain})
PLATFORMA: ${platform}

DANE ZE STRONY:
- Tytuł: ${websiteData.title}
- Meta opis: ${websiteData.description}
- Nagłówki: ${websiteData.headings.join(' | ')}
- CTA: ${websiteData.ctas.join(' | ')}
- Fragment treści: ${websiteData.bodyText.slice(0, 2000)}

${adData.length > 0 ? `ZNALEZIONE REKLAMY (${adData.length}):\n${adData.slice(0, 5).map((ad) => `- "${ad.headline}" | "${ad.description}"`).join('\n')}` : 'BRAK ZNALEZIONYCH REKLAM'}

Przeanalizuj i odpowiedz w formacie JSON:
{
  "topKeywords": ["keyword1", "keyword2", ...],
  "landingPages": ["url1", "url2", ...],
  "positioning": "Jak się pozycjonują na rynku (1-2 zdania)",
  "strengths": ["mocna strona 1", "mocna strona 2", ...],
  "weaknesses": ["słaba strona 1", "słaba strona 2", ...],
  "opportunities": ["szansa 1 - jak możemy to wykorzystać", "szansa 2", ...]
}

WAŻNE: Skup się na actionable insights - co MY (Oleksiak Consulting) możemy zrobić lepiej.`;

    const response = await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      system: 'Jesteś ekspertem od analizy konkurencji w marketingu cyfrowym. Odpowiadaj WYŁĄCZNIE poprawnym JSONem.',
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        topKeywords: [],
        landingPages: [`https://${competitor.domain}`],
        positioning: 'Brak danych do analizy',
        strengths: [],
        weaknesses: [],
        opportunities: [],
      };
    }

    return JSON.parse(jsonMatch[0]);
  }

  // ---------------------------------------------------------------------------
  // Change Detection & Alerts
  // ---------------------------------------------------------------------------

  private async detectChanges(
    competitorId: string,
    newInsights: CompetitorInsight[],
  ): Promise<void> {
    const previousInsights = insights.get(competitorId) || [];
    if (previousInsights.length === 0) return; // First analysis, no comparison

    for (const newInsight of newInsights) {
      const previous = previousInsights.find(
        (p) =>
          p.competitorId === newInsight.competitorId &&
          p.platform === newInsight.platform,
      );
      if (!previous) continue;

      // Detect new ads
      const previousAdTexts = new Set(previous.adCopy.map((a) => a.headline));
      const newAds = newInsight.adCopy.filter((a) => !previousAdTexts.has(a.headline));

      if (newAds.length > 0) {
        this.createAlert({
          competitorId,
          type: 'new_campaign',
          severity: 'warning',
          title: `${newInsight.competitorName}: ${newAds.length} nowych reklam na ${newInsight.platform}`,
          description: `Wykryto nowe reklamy: ${newAds.map((a) => `"${a.headline}"`).join(', ')}`,
          data: { newAds },
        });
      }

      // Detect new keywords
      const previousKeywords = new Set(previous.topKeywords);
      const newKeywords = newInsight.topKeywords.filter((k) => !previousKeywords.has(k));

      if (newKeywords.length > 0) {
        this.createAlert({
          competitorId,
          type: 'new_keyword',
          severity: 'info',
          title: `${newInsight.competitorName}: nowe słowa kluczowe`,
          description: `Wykryto nowe keywords: ${newKeywords.join(', ')}`,
          data: { newKeywords },
        });
      }

      // Detect positioning changes
      if (
        previous.positioning &&
        newInsight.positioning &&
        previous.positioning !== newInsight.positioning
      ) {
        this.createAlert({
          competitorId,
          type: 'positioning_shift',
          severity: 'warning',
          title: `${newInsight.competitorName}: zmiana pozycjonowania`,
          description: `Poprzednie: "${previous.positioning}" → Nowe: "${newInsight.positioning}"`,
          data: {
            previous: previous.positioning,
            current: newInsight.positioning,
          },
        });
      }
    }
  }

  private createAlert(params: Omit<CompetitorAlert, 'id' | 'createdAt' | 'acknowledged'>): void {
    alerts.push({
      ...params,
      id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    });
  }

  // ---------------------------------------------------------------------------
  // Alert Management
  // ---------------------------------------------------------------------------

  getAlerts(filters?: {
    competitorId?: string;
    severity?: CompetitorAlert['severity'];
    acknowledged?: boolean;
  }): CompetitorAlert[] {
    let result = [...alerts];

    if (filters?.competitorId) {
      result = result.filter((a) => a.competitorId === filters.competitorId);
    }
    if (filters?.severity) {
      result = result.filter((a) => a.severity === filters.severity);
    }
    if (filters?.acknowledged !== undefined) {
      result = result.filter((a) => a.acknowledged === filters.acknowledged);
    }

    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  acknowledgeAlert(alertId: string): void {
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) alert.acknowledged = true;
  }

  getInsights(competitorId: string): CompetitorInsight[] {
    return insights.get(competitorId) || [];
  }

  // ---------------------------------------------------------------------------
  // Strategic Recommendations
  // ---------------------------------------------------------------------------

  async getStrategicRecommendations(): Promise<{
    summary: string;
    recommendations: { priority: string; action: string; reasoning: string }[];
    marketTrends: string[];
  }> {
    const allCompetitors = this.listCompetitors();
    const allInsights: CompetitorInsight[] = [];

    for (const comp of allCompetitors) {
      const compInsights = insights.get(comp.id) || [];
      allInsights.push(...compInsights.slice(0, 3)); // Latest 3 per competitor
    }

    if (allInsights.length === 0) {
      return {
        summary: 'Brak danych - dodaj konkurentów i uruchom analizę.',
        recommendations: [],
        marketTrends: [],
      };
    }

    const prompt = `Na podstawie danych o konkurencji, przygotuj strategiczne rekomendacje.

KONKURENCI I ICH PROFILE:
${allInsights.map((i) => `
[${i.competitorName}] - ${i.platform}
Pozycjonowanie: ${i.positioning}
Mocne strony: ${i.strengths.join(', ')}
Słabe strony: ${i.weaknesses.join(', ')}
Keywords: ${i.topKeywords.join(', ')}
`).join('\n')}

NIEZAAKCEPTOWANE ALERTY: ${alerts.filter((a) => !a.acknowledged).length}
${alerts.filter((a) => !a.acknowledged).slice(0, 5).map((a) => `- [${a.severity}] ${a.title}`).join('\n')}

Przygotuj rekomendacje dla Oleksiak Consulting. Odpowiedz w JSON:
{
  "summary": "Podsumowanie sytuacji rynkowej (2-3 zdania)",
  "recommendations": [
    {
      "priority": "high/medium/low",
      "action": "Konkretna akcja do podjęcia",
      "reasoning": "Dlaczego to ważne"
    }
  ],
  "marketTrends": ["trend 1", "trend 2", ...]
}`;

    const response = await this.claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      system: 'Jesteś strategiem marketingowym. Odpowiadaj WYŁĄCZNIE poprawnym JSONem.',
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { summary: 'Analiza w toku.', recommendations: [], marketTrends: [] };
    }

    return JSON.parse(jsonMatch[0]);
  }
}

export const competitorMonitor = new CompetitorMonitor();

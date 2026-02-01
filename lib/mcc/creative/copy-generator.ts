// =============================================================================
// AI Copy Generator - Uses Claude to generate ad copy
// =============================================================================

import Anthropic from '@anthropic-ai/sdk';
import type {
  CopyGenerationRequest,
  CopyGenerationResult,
  Platform,
  CampaignObjective,
} from '../types';

const PLATFORM_CONSTRAINTS: Record<Platform, {
  maxHeadlineLength: number;
  maxDescriptionLength: number;
  maxHeadlines: number;
  maxDescriptions: number;
}> = {
  google_ads: {
    maxHeadlineLength: 30,
    maxDescriptionLength: 90,
    maxHeadlines: 15,
    maxDescriptions: 4,
  },
  meta_ads: {
    maxHeadlineLength: 40,
    maxDescriptionLength: 125,
    maxHeadlines: 5,
    maxDescriptions: 5,
  },
  linkedin_ads: {
    maxHeadlineLength: 70,
    maxDescriptionLength: 600,
    maxHeadlines: 1,
    maxDescriptions: 1,
  },
};

export class CopyGenerator {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateCopy(request: CopyGenerationRequest): Promise<CopyGenerationResult> {
    const constraints = request.constraints || PLATFORM_CONSTRAINTS[request.platform];
    const prompt = this.buildPrompt(request, constraints);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: this.getSystemPrompt(request.language),
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    return this.parseResponse(content.text);
  }

  async generateVariants(
    baseCopy: { headlines: string[]; descriptions: string[] },
    platform: Platform,
    count: number = 3,
  ): Promise<CopyGenerationResult> {
    const constraints = PLATFORM_CONSTRAINTS[platform];

    const prompt = `Na podstawie istniejącej reklamy wygeneruj ${count} wariantów do testów A/B.

ORYGINALNA REKLAMA:
Nagłówki: ${baseCopy.headlines.join(' | ')}
Opisy: ${baseCopy.descriptions.join(' | ')}

OGRANICZENIA:
- Nagłówek max ${constraints.maxHeadlineLength} znaków
- Opis max ${constraints.maxDescriptionLength} znaków
- Platforma: ${this.platformName(platform)}

Wygeneruj ${count} wariantów, każdy z innym kątem/podejściem:
1. Wariant emocjonalny (odwołanie do emocji)
2. Wariant racjonalny (fakty, liczby, dowody)
3. Wariant pilny (urgency, FOMO)

Odpowiedz w formacie JSON:
{
  "variants": [
    {
      "headlines": ["nagłówek1", "nagłówek2"],
      "descriptions": ["opis1"],
      "callToAction": "CTA",
      "reasoning": "dlaczego ten wariant",
      "estimatedQualityScore": 7
    }
  ],
  "competitorDifferentiation": "jak się wyróżniamy",
  "abTestSuggestion": "co testować najpierw"
}`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: this.getSystemPrompt('pl'),
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format');
    }

    return this.parseResponse(content.text);
  }

  async optimizeCopy(
    currentCopy: { headlines: string[]; descriptions: string[] },
    metrics: { ctr: number; conversionRate: number; qualityScore?: number },
    platform: Platform,
  ): Promise<CopyGenerationResult> {
    const constraints = PLATFORM_CONSTRAINTS[platform];

    const prompt = `Zoptymalizuj istniejącą reklamę na podstawie wyników:

AKTUALNA REKLAMA:
Nagłówki: ${currentCopy.headlines.join(' | ')}
Opisy: ${currentCopy.descriptions.join(' | ')}

WYNIKI:
- CTR: ${(metrics.ctr * 100).toFixed(2)}%
- Konwersje: ${(metrics.conversionRate * 100).toFixed(2)}%
${metrics.qualityScore ? `- Quality Score: ${metrics.qualityScore}/10` : ''}

PROBLEMY DO ROZWIĄZANIA:
${metrics.ctr < 0.02 ? '- Niski CTR - nagłówki nie przyciągają uwagi' : ''}
${metrics.conversionRate < 0.03 ? '- Niska konwersja - opisy nie przekonują do działania' : ''}
${metrics.qualityScore && metrics.qualityScore < 7 ? '- Niski Quality Score - popraw relevance' : ''}

OGRANICZENIA:
- Nagłówek max ${constraints.maxHeadlineLength} znaków
- Opis max ${constraints.maxDescriptionLength} znaków
- Platforma: ${this.platformName(platform)}

Wygeneruj zoptymalizowane warianty. Odpowiedz w formacie JSON:
{
  "variants": [...],
  "competitorDifferentiation": "...",
  "abTestSuggestion": "..."
}`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      system: this.getSystemPrompt('pl'),
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response format');

    return this.parseResponse(content.text);
  }

  // ---------------------------------------------------------------------------
  // Prompt Construction
  // ---------------------------------------------------------------------------

  private buildPrompt(
    request: CopyGenerationRequest,
    constraints: CopyGenerationRequest['constraints'],
  ): string {
    return `Stwórz copy reklamowe dla kampanii ${this.platformName(request.platform)}.

PRODUKT/USŁUGA: ${request.product}
CEL KAMPANII: ${this.objectiveName(request.objective)}
GRUPA DOCELOWA: ${request.targetAudience}
TON KOMUNIKACJI: ${this.toneName(request.tone)}
JĘZYK: ${request.language === 'pl' ? 'Polski' : 'Angielski'}

${request.keywords?.length ? `SŁOWA KLUCZOWE DO UWZGLĘDNIENIA: ${request.keywords.join(', ')}` : ''}
${request.competitorContext ? `KONTEKST KONKURENCJI:\n${request.competitorContext}` : ''}
${request.brandGuidelines ? `WYTYCZNE MARKI:\n${request.brandGuidelines}` : ''}
${request.existingCopy?.length ? `ISTNIEJĄCE COPY (do unikania powtórzeń):\n${request.existingCopy.join('\n')}` : ''}

OGRANICZENIA PLATFORMY:
- Max długość nagłówka: ${constraints.maxHeadlineLength} znaków
- Max długość opisu: ${constraints.maxDescriptionLength} znaków
- Liczba nagłówków: ${constraints.maxHeadlines}
- Liczba opisów: ${constraints.maxDescriptions}

WYMAGANIA:
1. Wygeneruj 3 warianty reklamy (do testów A/B)
2. Każdy wariant musi mieć unikalne podejście
3. Uwzględnij USP i CTA
4. Każdy tekst MUSI mieścić się w limitach znaków
5. Oceń estimated quality score (1-10) dla każdego wariantu

Odpowiedz WYŁĄCZNIE w formacie JSON:
{
  "variants": [
    {
      "headlines": ["nagłówek1", "nagłówek2", ...],
      "descriptions": ["opis1", "opis2"],
      "callToAction": "Tekst CTA",
      "reasoning": "Dlaczego ten wariant zadziała",
      "estimatedQualityScore": 8
    }
  ],
  "competitorDifferentiation": "Jak wyróżniamy się na tle konkurencji",
  "abTestSuggestion": "Rekomendacja co testować najpierw i dlaczego"
}`;
  }

  private getSystemPrompt(language: string): string {
    return `Jesteś ekspertem od reklamy cyfrowej z 15-letnim doświadczeniem w kampaniach Google Ads, Meta Ads i LinkedIn Ads na rynku ${language === 'pl' ? 'polskim' : 'międzynarodowym'}.

Twoje zasady:
1. Piszesz copy, które KONWERTUJE - nie ładne, ale skuteczne
2. Każdy nagłówek musi przyciągać uwagę w 2 sekundy
3. Każdy opis musi mieć jasne CTA i value proposition
4. Używasz sprawdzonych technik: social proof, urgency, FOMO, benefit-driven headlines
5. ZAWSZE przestrzegasz limitów znaków platformy
6. Odpowiadasz WYŁĄCZNIE poprawnym JSONem - bez dodatkowego tekstu
7. Unikasz frazesów i ogólników - piszesz konkretnie

Znasz specyfikę każdej platformy:
- Google Ads: krótkie, keyword-driven, search intent
- Meta Ads: emocjonalne, wizualne, scroll-stopping
- LinkedIn Ads: profesjonalne, B2B, thought leadership`;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private parseResponse(text: string): CopyGenerationResult {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse copy generation response - no JSON found');
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]);

      // Validate structure
      if (!parsed.variants || !Array.isArray(parsed.variants)) {
        throw new Error('Invalid response structure: missing variants array');
      }

      return {
        variants: parsed.variants.map((v: Record<string, unknown>) => ({
          headlines: (v.headlines as string[]) || [],
          descriptions: (v.descriptions as string[]) || [],
          callToAction: String(v.callToAction || 'Dowiedz się więcej'),
          reasoning: String(v.reasoning || ''),
          estimatedQualityScore: Number(v.estimatedQualityScore || 5),
        })),
        competitorDifferentiation: String(parsed.competitorDifferentiation || ''),
        abTestSuggestion: String(parsed.abTestSuggestion || ''),
      };
    } catch (error) {
      throw new Error(
        `Failed to parse copy generation response: ${error instanceof Error ? error.message : 'Invalid JSON'}`,
      );
    }
  }

  private platformName(platform: Platform): string {
    const names: Record<Platform, string> = {
      google_ads: 'Google Ads',
      meta_ads: 'Meta Ads (Facebook/Instagram)',
      linkedin_ads: 'LinkedIn Ads',
    };
    return names[platform];
  }

  private objectiveName(objective: CampaignObjective): string {
    const names: Record<CampaignObjective, string> = {
      awareness: 'Budowanie świadomości marki',
      traffic: 'Generowanie ruchu na stronie',
      engagement: 'Zaangażowanie użytkowników',
      leads: 'Pozyskiwanie leadów',
      conversions: 'Konwersje',
      sales: 'Sprzedaż bezpośrednia',
    };
    return names[objective];
  }

  private toneName(tone: CopyGenerationRequest['tone']): string {
    const names: Record<CopyGenerationRequest['tone'], string> = {
      professional: 'Profesjonalny i ekspercki',
      casual: 'Luźny i przystępny',
      urgent: 'Pilny, z elementem FOMO',
      inspirational: 'Inspirujący i motywujący',
      educational: 'Edukacyjny i wartościowy',
    };
    return names[tone];
  }
}

export const copyGenerator = new CopyGenerator();

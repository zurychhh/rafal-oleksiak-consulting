// =============================================================================
// MCC Creative API - AI-powered copy generation
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { copyGenerator } from '@/lib/mcc/creative/copy-generator';
import type { Platform, CampaignObjective, CopyGenerationRequest } from '@/lib/mcc/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/mcc/creative - Generate or optimize ad copy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'generate': {
        const copyRequest: CopyGenerationRequest = {
          objective: body.objective as CampaignObjective,
          platform: body.platform as Platform,
          product: body.product,
          targetAudience: body.targetAudience,
          tone: body.tone || 'professional',
          language: body.language || 'pl',
          constraints: body.constraints,
          competitorContext: body.competitorContext,
          brandGuidelines: body.brandGuidelines,
          existingCopy: body.existingCopy,
          keywords: body.keywords,
        };

        const result = await copyGenerator.generateCopy(copyRequest);
        return NextResponse.json({ result });
      }

      case 'variants': {
        const result = await copyGenerator.generateVariants(
          {
            headlines: body.headlines,
            descriptions: body.descriptions,
          },
          body.platform as Platform,
          body.count || 3,
        );
        return NextResponse.json({ result });
      }

      case 'optimize': {
        const result = await copyGenerator.optimizeCopy(
          {
            headlines: body.headlines,
            descriptions: body.descriptions,
          },
          {
            ctr: body.metrics.ctr,
            conversionRate: body.metrics.conversionRate,
            qualityScore: body.metrics.qualityScore,
          },
          body.platform as Platform,
        );
        return NextResponse.json({ result });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('MCC creative error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Creative generation failed' },
      { status: 500 },
    );
  }
}

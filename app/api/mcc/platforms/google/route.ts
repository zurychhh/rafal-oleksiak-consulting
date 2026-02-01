// =============================================================================
// MCC Google Ads Platform API - Connection & direct operations
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/mcc/platforms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/mcc/platforms/google - Connect or operate on Google Ads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const connector = platformRegistry.getConnector('google_ads');

    switch (action) {
      case 'connect': {
        const connection = await connector.connect({
          platform: 'google_ads',
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
          accountId: body.accountId,
          metadata: {
            customerId: body.customerId,
            developerToken: body.developerToken,
            clientId: body.clientId,
            clientSecret: body.clientSecret,
            refreshToken: body.refreshToken,
          },
        });
        return NextResponse.json({ connection });
      }

      case 'disconnect': {
        await connector.disconnect();
        return NextResponse.json({ success: true });
      }

      case 'status': {
        const status = await connector.getStatus();
        return NextResponse.json({ status });
      }

      case 'keyword_suggestions': {
        if (!connector.getKeywordSuggestions) {
          return NextResponse.json({ error: 'Not supported' }, { status: 400 });
        }
        const suggestions = await connector.getKeywordSuggestions(
          body.seed,
          body.language || 'pl',
        );
        return NextResponse.json({ suggestions });
      }

      case 'keyword_metrics': {
        if (!connector.getKeywordMetrics) {
          return NextResponse.json({ error: 'Not supported' }, { status: 400 });
        }
        const metrics = await connector.getKeywordMetrics(body.keywords);
        return NextResponse.json({ metrics });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('Google Ads API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Google Ads operation failed' },
      { status: 500 },
    );
  }
}

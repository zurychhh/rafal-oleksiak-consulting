// =============================================================================
// MCC LinkedIn Ads Platform API - Connection & direct operations
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { platformRegistry } from '@/lib/mcc/platforms';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /api/mcc/platforms/linkedin - Connect or operate on LinkedIn Ads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const connector = platformRegistry.getConnector('linkedin_ads');

    switch (action) {
      case 'connect': {
        const connection = await connector.connect({
          platform: 'linkedin_ads',
          accessToken: body.accessToken,
          accountId: body.adAccountId,
          metadata: {
            accessToken: body.accessToken,
            adAccountId: body.adAccountId,
            organizationId: body.organizationId,
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

      case 'audiences': {
        const audiences = await connector.getAudiences();
        return NextResponse.json({ audiences });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('LinkedIn Ads API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'LinkedIn Ads operation failed' },
      { status: 500 },
    );
  }
}

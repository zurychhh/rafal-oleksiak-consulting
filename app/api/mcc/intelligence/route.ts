// =============================================================================
// MCC Intelligence API - Competitor monitoring & analysis
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { competitorMonitor } from '@/lib/mcc/intelligence/competitor-monitor';
import type { Platform } from '@/lib/mcc/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/mcc/intelligence - Get competitors, insights, alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'competitors': {
        const competitors = competitorMonitor.listCompetitors();
        return NextResponse.json({ competitors });
      }

      case 'insights': {
        const competitorId = searchParams.get('competitorId');
        if (!competitorId) {
          return NextResponse.json({ error: 'competitorId required' }, { status: 400 });
        }
        const insights = competitorMonitor.getInsights(competitorId);
        return NextResponse.json({ insights });
      }

      case 'alerts': {
        const severity = searchParams.get('severity') as 'info' | 'warning' | 'critical' | null;
        const acknowledged = searchParams.get('acknowledged');
        const alerts = competitorMonitor.getAlerts({
          severity: severity || undefined,
          acknowledged: acknowledged !== null ? acknowledged === 'true' : undefined,
        });
        return NextResponse.json({ alerts });
      }

      case 'recommendations': {
        const recommendations = await competitorMonitor.getStrategicRecommendations();
        return NextResponse.json(recommendations);
      }

      case 'overview':
      default: {
        const competitors = competitorMonitor.listCompetitors();
        const alerts = competitorMonitor.getAlerts({ acknowledged: false });
        return NextResponse.json({
          competitors,
          unacknowledgedAlerts: alerts.length,
          recentAlerts: alerts.slice(0, 5),
        });
      }
    }
  } catch (error) {
    console.error('MCC intelligence GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Intelligence query failed' },
      { status: 500 },
    );
  }
}

// POST /api/mcc/intelligence - Manage competitors and run analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'add_competitor': {
        const competitor = competitorMonitor.addCompetitor({
          name: body.name,
          domain: body.domain,
          platforms: (body.platforms || ['google_ads', 'meta_ads']) as Platform[],
          trackingEnabled: body.trackingEnabled !== false,
        });
        return NextResponse.json({ competitor }, { status: 201 });
      }

      case 'remove_competitor': {
        competitorMonitor.removeCompetitor(body.competitorId);
        return NextResponse.json({ success: true });
      }

      case 'analyze': {
        if (body.competitorId) {
          const insights = await competitorMonitor.analyzeCompetitor(body.competitorId);
          return NextResponse.json({ insights });
        } else {
          const insights = await competitorMonitor.analyzeAllCompetitors();
          return NextResponse.json({ insights });
        }
      }

      case 'acknowledge_alert': {
        competitorMonitor.acknowledgeAlert(body.alertId);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('MCC intelligence POST error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Intelligence action failed' },
      { status: 500 },
    );
  }
}

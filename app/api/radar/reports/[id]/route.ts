// RADAR - Single Report API
// Authenticated endpoint for fetching a single report with competitors

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRadarSession } from '@/lib/radar/auth/session';
import { db, schema } from '@/lib/radar/db';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth check
    const session = await getRadarSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Fetch report (only if owned by current user)
    const reports = await db
      .select()
      .from(schema.radarReports)
      .where(
        and(
          eq(schema.radarReports.id, id),
          eq(schema.radarReports.userId, session.id)
        )
      )
      .limit(1);

    if (reports.length === 0) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    const report = reports[0];

    // Fetch related competitors
    const competitors = await db
      .select()
      .from(schema.radarCompetitors)
      .where(eq(schema.radarCompetitors.reportId, id));

    // Build response
    const response = {
      id: report.id,
      userId: report.userId,
      yourUrl: report.yourUrl,
      reportJson: report.reportJson,
      overallPosition: report.overallPosition,
      competitorCount: report.competitorCount,
      highThreatCount: report.highThreatCount,
      criticalActionCount: report.criticalActionCount,
      executionTime: report.executionTime,
      createdAt: report.createdAt.toISOString(),
      competitors: competitors.map(c => ({
        id: c.id,
        reportId: c.reportId,
        url: c.url,
        snapshotJson: c.snapshotJson,
        aiInsightsJson: c.aiInsightsJson,
        threatLevel: c.threatLevel,
        createdAt: c.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({ report: response });

  } catch (error) {
    console.error('[RADAR] Failed to fetch report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

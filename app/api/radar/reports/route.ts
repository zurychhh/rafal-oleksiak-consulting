// RADAR - Reports List API
// Authenticated endpoint for fetching user's reports

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRadarSession } from '@/lib/radar/auth/session';
import { db, schema } from '@/lib/radar/db';
import { eq, desc, and, gte, lte, count } from 'drizzle-orm';
import type { RadarReportSummary } from '@/lib/radar/types';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const session = await getRadarSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 100);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Build where conditions
    const conditions = [eq(schema.radarReports.userId, session.id)];

    if (from) {
      conditions.push(gte(schema.radarReports.createdAt, new Date(from)));
    }

    if (to) {
      conditions.push(lte(schema.radarReports.createdAt, new Date(to)));
    }

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    // Get total count
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(schema.radarReports)
      .where(whereClause);

    // Get paginated reports
    const offset = (page - 1) * limit;
    const reports = await db
      .select({
        id: schema.radarReports.id,
        yourUrl: schema.radarReports.yourUrl,
        overallPosition: schema.radarReports.overallPosition,
        competitorCount: schema.radarReports.competitorCount,
        highThreatCount: schema.radarReports.highThreatCount,
        criticalActionCount: schema.radarReports.criticalActionCount,
        executionTime: schema.radarReports.executionTime,
        createdAt: schema.radarReports.createdAt,
      })
      .from(schema.radarReports)
      .where(whereClause)
      .orderBy(desc(schema.radarReports.createdAt))
      .limit(limit)
      .offset(offset);

    // Format response
    const summaries: RadarReportSummary[] = reports.map(r => ({
      id: r.id,
      yourUrl: r.yourUrl,
      overallPosition: r.overallPosition,
      competitorCount: r.competitorCount,
      highThreatCount: r.highThreatCount,
      criticalActionCount: r.criticalActionCount,
      executionTime: r.executionTime,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      reports: summaries,
      total,
      page,
      limit,
    });

  } catch (error) {
    console.error('[RADAR] Failed to fetch reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

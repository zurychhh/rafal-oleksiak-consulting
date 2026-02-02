// RADAR - Trends API
// Authenticated endpoint for aggregate analytics across user's reports

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getRadarSession } from '@/lib/radar/auth/session';
import { db, schema } from '@/lib/radar/db';
import { eq, desc, sql, count } from 'drizzle-orm';
import type { TrendData } from '@/lib/radar/types';

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

    // 1. Position history (all reports ordered by date)
    const positionHistoryData = await db
      .select({
        date: schema.radarReports.createdAt,
        position: schema.radarReports.overallPosition,
      })
      .from(schema.radarReports)
      .where(eq(schema.radarReports.userId, session.id))
      .orderBy(schema.radarReports.createdAt);

    const positionHistory = positionHistoryData.map(r => ({
      date: r.date.toISOString(),
      position: r.position,
    }));

    // 2. Threat distribution (count of all competitors by threat level)
    const threatDistributionData = await db
      .select({
        threatLevel: schema.radarCompetitors.threatLevel,
        count: count(),
      })
      .from(schema.radarCompetitors)
      .innerJoin(
        schema.radarReports,
        eq(schema.radarCompetitors.reportId, schema.radarReports.id)
      )
      .where(eq(schema.radarReports.userId, session.id))
      .groupBy(schema.radarCompetitors.threatLevel);

    const threatDistribution = {
      high: 0,
      medium: 0,
      low: 0,
    };

    threatDistributionData.forEach(row => {
      if (row.threatLevel === 'high') threatDistribution.high = row.count;
      if (row.threatLevel === 'medium') threatDistribution.medium = row.count;
      if (row.threatLevel === 'low') threatDistribution.low = row.count;
    });

    // 3. Top competitor URLs (most frequently scanned)
    const topCompetitorsData = await db
      .select({
        url: schema.radarCompetitors.url,
        scanCount: count(),
      })
      .from(schema.radarCompetitors)
      .innerJoin(
        schema.radarReports,
        eq(schema.radarCompetitors.reportId, schema.radarReports.id)
      )
      .where(eq(schema.radarReports.userId, session.id))
      .groupBy(schema.radarCompetitors.url)
      .orderBy(desc(count()))
      .limit(10);

    // For each top competitor, get their latest threat level
    const topCompetitors = await Promise.all(
      topCompetitorsData.map(async (comp) => {
        const latest = await db
          .select({
            threatLevel: schema.radarCompetitors.threatLevel,
          })
          .from(schema.radarCompetitors)
          .innerJoin(
            schema.radarReports,
            eq(schema.radarCompetitors.reportId, schema.radarReports.id)
          )
          .where(
            sql`${schema.radarReports.userId} = ${session.id} AND ${schema.radarCompetitors.url} = ${comp.url}`
          )
          .orderBy(desc(schema.radarCompetitors.createdAt))
          .limit(1);

        return {
          url: comp.url,
          scanCount: comp.scanCount,
          latestThreatLevel: latest[0]?.threatLevel || 'medium',
        };
      })
    );

    // 4. Metrics over time
    const metricsHistoryData = await db
      .select({
        date: schema.radarReports.createdAt,
        competitorCount: schema.radarReports.competitorCount,
        highThreats: schema.radarReports.highThreatCount,
        criticalActions: schema.radarReports.criticalActionCount,
      })
      .from(schema.radarReports)
      .where(eq(schema.radarReports.userId, session.id))
      .orderBy(schema.radarReports.createdAt);

    const metricsHistory = metricsHistoryData.map(r => ({
      date: r.date.toISOString(),
      competitorCount: r.competitorCount,
      highThreats: r.highThreats,
      criticalActions: r.criticalActions,
    }));

    // Build response
    const trends: TrendData = {
      positionHistory,
      threatHistory: [], // We'll use threatDistribution as a snapshot
      competitorFrequency: topCompetitors,
      metricsHistory,
    };

    return NextResponse.json(trends);

  } catch (error) {
    console.error('[RADAR] Failed to fetch trends:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}

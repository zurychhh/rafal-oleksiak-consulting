// RADAR - Scan API Endpoint
// Authenticated endpoint for creating new RADAR reports

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

import { NextRequest, NextResponse } from 'next/server';
import { getRadarSession } from '@/lib/radar/auth/session';
import { runRadarAnalysis } from '@/lib/radar/analyzer';
import { db, schema } from '@/lib/radar/db';
import type { ScanRequest, RadarReport } from '@/lib/radar/types';

function normalizeUrl(url: string): string {
  const u = url.trim();
  return u.startsWith('http') ? u : `https://${u}`;
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getRadarSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      );
    }

    // Parse request
    const body: ScanRequest = await request.json();
    const { yourUrl, competitorUrls, sendEmail } = body;

    // Validation
    if (!yourUrl || !competitorUrls?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: yourUrl and at least one competitor URL' },
        { status: 400 }
      );
    }

    if (competitorUrls.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 competitor URLs allowed' },
        { status: 400 }
      );
    }

    // Normalize URLs
    const normalizedYourUrl = normalizeUrl(yourUrl);
    const normalizedCompetitorUrls = competitorUrls
      .map(u => u.trim())
      .filter(u => u.length > 0)
      .map(normalizeUrl);

    console.log(`[RADAR] Scan requested by ${session.email} for ${normalizedYourUrl} vs ${normalizedCompetitorUrls.length} competitors`);

    // Run analysis
    const report: RadarReport = await runRadarAnalysis(normalizedYourUrl, normalizedCompetitorUrls);

    // Compute derived metrics
    const overallPosition = report.strategicInsights.overallCompetitivePosition;
    const competitorCount = report.competitors.length;
    const highThreatCount = report.competitors.filter(c => c.aiInsights.threatLevel === 'high').length;
    const criticalActionCount = report.strategicInsights.actionItems.filter(a => a.priority === 'critical').length;
    const executionTime = report.executionTime;

    // Store report in DB
    const [savedReport] = await db.insert(schema.radarReports).values({
      userId: session.id,
      yourUrl: normalizedYourUrl,
      reportJson: report as any, // Cast to unknown/any for jsonb
      overallPosition,
      competitorCount,
      highThreatCount,
      criticalActionCount,
      executionTime,
    }).returning();

    // Store competitors
    const competitorRecords = report.competitors.map(c => ({
      reportId: savedReport.id,
      url: c.url,
      snapshotJson: c.snapshot as any,
      aiInsightsJson: c.aiInsights as any,
      threatLevel: c.aiInsights.threatLevel,
    }));

    await db.insert(schema.radarCompetitors).values(competitorRecords);

    console.log(`[RADAR] Scan completed for ${session.email} - reportId: ${savedReport.id}`);

    return NextResponse.json({
      success: true,
      reportId: savedReport.id,
      report,
    });

  } catch (error) {
    console.error('[RADAR] Scan failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

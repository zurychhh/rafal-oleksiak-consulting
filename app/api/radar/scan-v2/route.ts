// RADAR 2.0 - Scan API Endpoint
// Authenticated endpoint for creating new RADAR reports with V2 analyzer

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 180; // 3 minutes for full analysis

import { NextRequest, NextResponse } from 'next/server';
import { getRadarSession } from '@/lib/radar/auth/session';
import { fullScan, quickScan } from '@/lib/radar/analyzer-v2';
import { enrichReportWithAi } from '@/lib/radar/opportunity-finder';
import { db, schema } from '@/lib/radar/db';

interface ScanRequestV2 {
  yourUrl: string;
  competitorUrls: string[];
  keywords?: string[];
  quickScan?: boolean; // Skip Serper and PageSpeed for faster results
  includeAiAnalysis?: boolean; // Default true
}

function normalizeUrl(url: string): string {
  const u = url.trim().toLowerCase();
  // Remove protocol and trailing slashes
  return u.replace(/^https?:\/\//, '').replace(/\/+$/, '');
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
    const body: ScanRequestV2 = await request.json();
    const {
      yourUrl,
      competitorUrls,
      keywords,
      quickScan: isQuickScan = false,
      includeAiAnalysis = true,
    } = body;

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
      .map((u) => u.trim())
      .filter((u) => u.length > 0)
      .map(normalizeUrl);

    console.log(
      `[RADAR V2] Scan requested by ${session.email} for ${normalizedYourUrl} vs ${normalizedCompetitorUrls.length} competitors (quick=${isQuickScan})`
    );

    const startTime = Date.now();

    // Run analysis
    let report;
    let totalSerperQueries = 0;

    if (isQuickScan) {
      const quickResult = await quickScan(normalizedYourUrl, normalizedCompetitorUrls);
      report = quickResult.report;
    } else {
      const fullResult = await fullScan(normalizedYourUrl, normalizedCompetitorUrls, keywords);
      report = fullResult.report;
      totalSerperQueries = fullResult.totalSerperQueries;
    }

    // Add AI analysis if requested
    if (includeAiAnalysis) {
      console.log(`[RADAR V2] Running AI opportunity analysis...`);
      report = await enrichReportWithAi(report);
    }

    const totalDuration = Date.now() - startTime;

    // Compute derived metrics for DB storage
    const overallPosition = report.overallPosition;
    const competitorCount = report.competitors.length;

    // Count high threats based on AI insights
    let highThreatCount = 0;
    if (report.aiInsights?.threatLevel === 'high') {
      highThreatCount = report.competitors.length; // All competitors are a threat
    } else if (report.aiInsights?.threatLevel === 'medium') {
      highThreatCount = Math.ceil(report.competitors.length / 2);
    }

    // Count critical actions
    const criticalActionCount = report.aiInsights?.actionItems.filter(
      (a) => a.priority <= 2
    ).length || 0;

    // Store report in DB
    const [savedReport] = await db
      .insert(schema.radarReports)
      .values({
        userId: session.id,
        yourUrl: normalizedYourUrl,
        reportJson: report as unknown,
        overallPosition,
        competitorCount,
        highThreatCount,
        criticalActionCount,
        executionTime: totalDuration,
      })
      .returning();

    // Store competitors
    const competitorRecords = report.competitors.map((c) => ({
      reportId: savedReport.id,
      url: c.url,
      snapshotJson: {
        seo: c.seo,
        performance: c.performance,
        structure: c.structure,
        business: c.business,
        tech: c.tech,
        content: c.content,
      } as unknown,
      aiInsightsJson: report.aiInsights as unknown, // Same insights for all in V2
      threatLevel: report.aiInsights?.threatLevel || 'medium',
    }));

    await db.insert(schema.radarCompetitors).values(competitorRecords);

    console.log(
      `[RADAR V2] Scan completed for ${session.email} - reportId: ${savedReport.id}, duration: ${totalDuration}ms, serperQueries: ${totalSerperQueries}`
    );

    return NextResponse.json({
      success: true,
      reportId: savedReport.id,
      report,
      meta: {
        duration: totalDuration,
        serperQueriesUsed: totalSerperQueries,
        providersUsed: Object.keys(report.providerSummary),
      },
    });
  } catch (error) {
    console.error('[RADAR V2] Scan failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

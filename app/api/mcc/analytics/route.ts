// =============================================================================
// MCC Analytics API - Cross-platform performance data
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { analyticsAggregator } from '@/lib/mcc/analytics/aggregator';
import { platformRegistry } from '@/lib/mcc/platforms';
import type { MetricsPeriod } from '@/lib/mcc/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parsePeriod(searchParams: URLSearchParams): MetricsPeriod {
  const start = searchParams.get('start') || new Date(Date.now() - 30 * 86400_000).toISOString().split('T')[0];
  const end = searchParams.get('end') || new Date().toISOString().split('T')[0];
  const granularity = (searchParams.get('granularity') || 'daily') as MetricsPeriod['granularity'];

  return { start, end, granularity };
}

// GET /api/mcc/analytics - Get performance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const period = parsePeriod(searchParams);

    switch (type) {
      case 'overview': {
        const metrics = await analyticsAggregator.getCrossPlatformMetrics(period);
        return NextResponse.json(metrics);
      }

      case 'trend': {
        const metricsParam = searchParams.get('metrics') || 'cost,conversions,roas';
        const metricNames = metricsParam.split(',');
        const trend = await analyticsAggregator.getPerformanceTrend(metricNames, period);
        return NextResponse.json({ trend });
      }

      case 'comparison': {
        const comparison = await analyticsAggregator.comparePlatforms(period);
        return NextResponse.json(comparison);
      }

      case 'budget': {
        const budgetInsights = await analyticsAggregator.getBudgetInsights(period);
        return NextResponse.json(budgetInsights);
      }

      case 'connections': {
        const connections = await platformRegistry.getAllStatuses();
        return NextResponse.json({ connections });
      }

      default:
        return NextResponse.json(
          { error: `Unknown analytics type: ${type}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error('MCC analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analytics query failed' },
      { status: 500 },
    );
  }
}

// =============================================================================
// Cross-Platform Analytics Aggregator
// Unified view of marketing performance across all connected platforms
// =============================================================================

import type {
  Platform,
  CampaignMetrics,
  MetricsPeriod,
  MetricsTimeSeries,
  CrossPlatformMetrics,
} from '../types';
import { platformRegistry } from '../platforms';
import { campaignManager } from '../campaign/manager';

export class AnalyticsAggregator {
  // ---------------------------------------------------------------------------
  // Cross-Platform Overview
  // ---------------------------------------------------------------------------

  async getCrossPlatformMetrics(period: MetricsPeriod): Promise<CrossPlatformMetrics> {
    const platforms: Platform[] = ['google_ads', 'meta_ads', 'linkedin_ads'];
    const platformMetrics: { platform: Platform; metrics: CampaignMetrics }[] = [];

    // Fetch metrics from all connected platforms
    const results = await Promise.allSettled(
      platforms.map(async (platform) => {
        const connector = platformRegistry.getConnector(platform);
        const status = await connector.getStatus();
        if (status.status !== 'connected') return null;

        const metrics = await connector.getAccountMetrics(period);
        return { platform, metrics };
      }),
    );

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        platformMetrics.push(result.value);
      }
    }

    // Aggregate
    let totalSpend = 0;
    let totalConversions = 0;
    let totalRevenue = 0;

    const breakdown = platformMetrics.map((pm) => {
      totalSpend += pm.metrics.cost;
      totalConversions += pm.metrics.conversions;
      totalRevenue += pm.metrics.revenue;

      return {
        platform: pm.platform,
        metrics: pm.metrics,
        share: 0, // calculated below
      };
    });

    // Calculate shares
    for (const entry of breakdown) {
      entry.share = totalSpend > 0 ? (entry.metrics.cost / totalSpend) * 100 : 0;
    }

    // Get top campaigns
    const activeCampaigns = await campaignManager.listCampaigns({ status: ['active'] });
    const topCampaigns = activeCampaigns
      .filter((c) => c.metrics.roas > 0)
      .sort((a, b) => b.metrics.roas - a.metrics.roas)
      .slice(0, 5)
      .map((c) => ({
        campaign: c.name,
        platform: c.platforms[0]?.platform || ('google_ads' as Platform),
        roas: c.metrics.roas,
        conversions: c.metrics.conversions,
      }));

    return {
      totalSpend,
      totalConversions,
      totalRevenue,
      blendedCpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
      blendedRoas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
      platformBreakdown: breakdown,
      topCampaigns,
      period,
    };
  }

  // ---------------------------------------------------------------------------
  // Time Series Data
  // ---------------------------------------------------------------------------

  async getPerformanceTrend(
    metricNames: string[],
    period: MetricsPeriod,
  ): Promise<MetricsTimeSeries[]> {
    const campaigns = await campaignManager.listCampaigns({ status: ['active'] });
    const series: MetricsTimeSeries[] = [];

    // Generate daily data points for the period
    const startDate = new Date(period.start);
    const endDate = new Date(period.end);
    const days: string[] = [];

    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    for (const metricName of metricNames) {
      const dataPoints: { date: string; value: number }[] = [];

      for (const day of days) {
        const dayPeriod: MetricsPeriod = {
          start: day,
          end: day,
          granularity: 'daily',
        };

        let totalValue = 0;

        // Sync each campaign for this day
        for (const campaign of campaigns) {
          try {
            const metrics = await campaignManager.syncCampaignMetrics(campaign.id, dayPeriod);
            const value = metrics[metricName as keyof CampaignMetrics];
            if (typeof value === 'number') {
              totalValue += value;
            }
          } catch {
            // Skip campaigns that fail
          }
        }

        dataPoints.push({ date: day, value: totalValue });
      }

      series.push({ metric: metricName, dataPoints });
    }

    return series;
  }

  // ---------------------------------------------------------------------------
  // Platform Comparison
  // ---------------------------------------------------------------------------

  async comparePlatforms(period: MetricsPeriod): Promise<{
    comparison: {
      platform: Platform;
      metrics: CampaignMetrics;
      efficiency: {
        costPerMille: number;
        costPerClick: number;
        costPerConversion: number;
        returnOnAdSpend: number;
      };
      verdict: string;
    }[];
    recommendation: string;
  }> {
    const platforms: Platform[] = ['google_ads', 'meta_ads', 'linkedin_ads'];
    const comparison: {
      platform: Platform;
      metrics: CampaignMetrics;
      efficiency: {
        costPerMille: number;
        costPerClick: number;
        costPerConversion: number;
        returnOnAdSpend: number;
      };
      verdict: string;
    }[] = [];

    for (const platform of platforms) {
      try {
        const connector = platformRegistry.getConnector(platform);
        const status = await connector.getStatus();
        if (status.status !== 'connected') continue;

        const metrics = await connector.getAccountMetrics(period);

        comparison.push({
          platform,
          metrics,
          efficiency: {
            costPerMille: metrics.impressions > 0
              ? (metrics.cost / metrics.impressions) * 1000
              : 0,
            costPerClick: metrics.cpc,
            costPerConversion: metrics.cpa,
            returnOnAdSpend: metrics.roas,
          },
          verdict: this.getVerdict(metrics),
        });
      } catch {
        // Platform not connected or error
      }
    }

    // Sort by ROAS
    comparison.sort((a, b) => b.efficiency.returnOnAdSpend - a.efficiency.returnOnAdSpend);

    const recommendation = this.generateRecommendation(comparison);

    return { comparison, recommendation };
  }

  // ---------------------------------------------------------------------------
  // Budget Intelligence
  // ---------------------------------------------------------------------------

  async getBudgetInsights(period: MetricsPeriod): Promise<{
    totalBudgetAllocated: number;
    totalSpent: number;
    utilization: number;
    platformUtilization: { platform: Platform; allocated: number; spent: number; efficiency: number }[];
    recommendation: string;
  }> {
    const campaigns = await campaignManager.listCampaigns({ status: ['active'] });

    let totalAllocated = 0;
    let totalSpent = 0;
    const platformData: Map<Platform, { allocated: number; spent: number }> = new Map();

    for (const campaign of campaigns) {
      for (const alloc of campaign.budget.allocation) {
        const existing = platformData.get(alloc.platform) || { allocated: 0, spent: 0 };
        existing.allocated += alloc.dailyLimit;
        platformData.set(alloc.platform, existing);
        totalAllocated += alloc.dailyLimit;
      }

      // Get actual spend
      try {
        const metrics = await campaignManager.syncCampaignMetrics(campaign.id, period);
        totalSpent += metrics.cost;

        for (const pc of campaign.platforms) {
          if (platformData.has(pc.platform)) {
            const pd = platformData.get(pc.platform)!;
            pd.spent += metrics.cost / campaign.platforms.length; // rough split
          }
        }
      } catch {
        // Skip
      }
    }

    const platformUtilization = Array.from(platformData.entries()).map(([platform, data]) => ({
      platform,
      allocated: data.allocated,
      spent: data.spent,
      efficiency: data.allocated > 0 ? data.spent / data.allocated : 0,
    }));

    const utilization = totalAllocated > 0 ? totalSpent / totalAllocated : 0;

    let recommendation = '';
    if (utilization < 0.5) {
      recommendation = 'Budżet jest niedostatecznie wykorzystywany. Rozważ zwiększenie stawek lub poszerzenie targetowania.';
    } else if (utilization > 0.95) {
      recommendation = 'Budżet jest prawie wyczerpany. Rozważ zwiększenie budżetu dla najlepiej działających kampanii.';
    } else {
      recommendation = 'Wykorzystanie budżetu jest optymalne.';
    }

    return {
      totalBudgetAllocated: totalAllocated,
      totalSpent: totalSpent,
      utilization,
      platformUtilization,
      recommendation,
    };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private getVerdict(metrics: CampaignMetrics): string {
    if (metrics.roas > 3) return 'Doskonały zwrot z inwestycji';
    if (metrics.roas > 1.5) return 'Dobry performance';
    if (metrics.roas > 1) return 'Marginalnie rentowny';
    if (metrics.roas > 0) return 'Poniżej progu rentowności';
    return 'Brak danych o konwersjach';
  }

  private generateRecommendation(
    comparison: { platform: Platform; efficiency: { returnOnAdSpend: number } }[],
  ): string {
    if (comparison.length === 0) return 'Połącz platformy reklamowe, aby zobaczyć porównanie.';
    if (comparison.length === 1) return `Jedyna aktywna platforma: ${comparison[0].platform}. Rozważ dodanie kolejnych kanałów.`;

    const best = comparison[0];
    const worst = comparison[comparison.length - 1];

    if (best.efficiency.returnOnAdSpend > worst.efficiency.returnOnAdSpend * 2) {
      return `${this.platformLabel(best.platform)} znacząco przewyższa ${this.platformLabel(worst.platform)} (ROAS ${best.efficiency.returnOnAdSpend.toFixed(1)}x vs ${worst.efficiency.returnOnAdSpend.toFixed(1)}x). Rozważ przesunięcie budżetu.`;
    }

    return 'Performance platform jest wyrównany. Kontynuuj testy na wszystkich kanałach.';
  }

  private platformLabel(platform: Platform): string {
    const labels: Record<Platform, string> = {
      google_ads: 'Google Ads',
      meta_ads: 'Meta Ads',
      linkedin_ads: 'LinkedIn Ads',
    };
    return labels[platform];
  }
}

export const analyticsAggregator = new AnalyticsAggregator();

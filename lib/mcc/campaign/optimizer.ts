// =============================================================================
// Campaign Optimizer - AI-driven optimization engine
// Evaluates campaigns and generates actionable recommendations
// =============================================================================

import type {
  Campaign,
  CampaignMetrics,
  MetricsPeriod,
  OptimizationRule,
  OptimizationRecommendation,
  OptimizationAction,
  Platform,
} from '../types';
import { campaignManager } from './manager';

// Thresholds for automated optimization decisions
const OPTIMIZATION_THRESHOLDS = {
  // If CTR drops below this, flag the creative
  lowCtr: 0.005, // 0.5%
  // If CPA exceeds target by this multiplier, reduce budget
  cpaExceedsTargetMultiplier: 1.5,
  // If ROAS falls below this, pause campaign
  criticalRoas: 0.5,
  // If a creative has >2x the conversions of others, scale it
  topCreativeMultiplier: 2,
  // Minimum impressions before making optimization decisions
  minImpressions: 1000,
  // Minimum spend before making budget decisions
  minSpend: 50, // PLN
  // Budget increase cap per optimization cycle
  maxBudgetIncrease: 1.3, // 30%
  // Budget decrease floor per optimization cycle
  maxBudgetDecrease: 0.7, // -30%
};

export class CampaignOptimizer {
  // ---------------------------------------------------------------------------
  // Analyze & Recommend
  // ---------------------------------------------------------------------------

  async analyzeCampaign(
    campaignId: string,
    period: MetricsPeriod,
  ): Promise<OptimizationRecommendation[]> {
    const campaign = await campaignManager.getCampaign(campaignId);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    const metrics = await campaignManager.syncCampaignMetrics(campaignId, period);
    const recommendations: OptimizationRecommendation[] = [];

    // Run all optimization checks
    recommendations.push(
      ...this.checkBudgetEfficiency(campaign, metrics),
      ...this.checkCreativePerformance(campaign, metrics),
      ...this.checkTargetingOpportunities(campaign, metrics),
      ...this.checkBidStrategy(campaign, metrics),
      ...this.checkScheduleOptimization(campaign, metrics),
    );

    // Also check rule-based optimizations
    for (const rule of campaign.optimizationRules.filter((r) => r.enabled)) {
      const ruleRec = this.evaluateRule(campaign, metrics, rule);
      if (ruleRec) recommendations.push(ruleRec);
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  async analyzeAllCampaigns(period: MetricsPeriod): Promise<OptimizationRecommendation[]> {
    const campaigns = await campaignManager.listCampaigns({ status: ['active'] });
    const allRecommendations: OptimizationRecommendation[] = [];

    for (const campaign of campaigns) {
      try {
        const recs = await this.analyzeCampaign(campaign.id, period);
        allRecommendations.push(...recs);
      } catch (error) {
        console.error(`Optimization analysis failed for ${campaign.id}:`, error);
      }
    }

    return allRecommendations;
  }

  // ---------------------------------------------------------------------------
  // Apply Recommendations
  // ---------------------------------------------------------------------------

  async applyRecommendation(recommendation: OptimizationRecommendation): Promise<void> {
    const campaign = await campaignManager.getCampaign(recommendation.campaignId);
    if (!campaign) throw new Error(`Campaign ${recommendation.campaignId} not found`);

    switch (recommendation.type) {
      case 'increase_budget':
        await this.applyBudgetIncrease(campaign, recommendation);
        break;
      case 'decrease_budget':
        await this.applyBudgetDecrease(campaign, recommendation);
        break;
      case 'pause_campaign':
        await campaignManager.pauseCampaign(campaign.id);
        break;
      case 'resume_campaign':
        await campaignManager.resumeCampaign(campaign.id);
        break;
      case 'pause_underperforming_creative':
        await this.pauseCreative(campaign, recommendation);
        break;
      case 'scale_top_creative':
        // Would duplicate/boost the top creative
        break;
      case 'reallocate_budget':
        await this.applyBudgetReallocation(campaign, recommendation);
        break;
      case 'change_bid_strategy':
        await this.applyBidStrategyChange(campaign, recommendation);
        break;
      default:
        console.warn(`Unhandled recommendation type: ${recommendation.type}`);
    }

    recommendation.appliedAt = new Date().toISOString();
  }

  // ---------------------------------------------------------------------------
  // Optimization Checks
  // ---------------------------------------------------------------------------

  private checkBudgetEfficiency(
    campaign: Campaign,
    metrics: CampaignMetrics,
  ): OptimizationRecommendation[] {
    const recs: OptimizationRecommendation[] = [];

    if (metrics.impressions < OPTIMIZATION_THRESHOLDS.minImpressions) return recs;

    // High ROAS → increase budget
    if (metrics.roas > 3 && metrics.cost > OPTIMIZATION_THRESHOLDS.minSpend) {
      recs.push({
        id: `opt_${Date.now()}_budget_up`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'increase_budget',
        priority: 'high',
        title: 'Zwiększ budżet - wysoki ROAS',
        description: `ROAS wynosi ${metrics.roas.toFixed(1)}x. Kampania generuje zwrot ${metrics.roas.toFixed(1)} PLN na każdy wydany 1 PLN. Zalecamy zwiększenie budżetu dziennego o 20-30%.`,
        expectedImpact: `+${Math.round(metrics.conversions * 0.25)} konwersji/dzień przy utrzymaniu ROAS`,
        confidence: Math.min(0.9, metrics.roas / 5),
        autoApplicable: true,
        createdAt: new Date().toISOString(),
      });
    }

    // Critical ROAS → pause or reduce
    if (metrics.roas < OPTIMIZATION_THRESHOLDS.criticalRoas && metrics.cost > OPTIMIZATION_THRESHOLDS.minSpend) {
      recs.push({
        id: `opt_${Date.now()}_roas_critical`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'pause_campaign',
        priority: 'critical',
        title: 'Krytyczny ROAS - rozważ pauzę',
        description: `ROAS spadł do ${metrics.roas.toFixed(2)}x przy wydatkach ${metrics.cost.toFixed(0)} PLN. Kampania traci pieniądze. Zalecamy pauzę i przegląd strategii.`,
        expectedImpact: `Oszczędność ~${campaign.budget.dailyBudget.toFixed(0)} PLN/dzień`,
        confidence: 0.85,
        autoApplicable: false,
        createdAt: new Date().toISOString(),
      });
    }

    // CPA too high
    if (
      campaign.budget.targetCpa &&
      metrics.cpa > campaign.budget.targetCpa * OPTIMIZATION_THRESHOLDS.cpaExceedsTargetMultiplier
    ) {
      recs.push({
        id: `opt_${Date.now()}_cpa_high`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'decrease_budget',
        priority: 'high',
        title: 'CPA przekracza cel',
        description: `CPA wynosi ${metrics.cpa.toFixed(2)} PLN vs cel ${campaign.budget.targetCpa} PLN (${((metrics.cpa / campaign.budget.targetCpa) * 100).toFixed(0)}% celu). Zmniejsz budżet lub zmień strategię bidowania.`,
        expectedImpact: `Redukcja CPA do ~${campaign.budget.targetCpa} PLN`,
        confidence: 0.75,
        autoApplicable: true,
        createdAt: new Date().toISOString(),
      });
    }

    return recs;
  }

  private checkCreativePerformance(
    campaign: Campaign,
    metrics: CampaignMetrics,
  ): OptimizationRecommendation[] {
    const recs: OptimizationRecommendation[] = [];

    // Low CTR across campaign
    if (
      metrics.ctr < OPTIMIZATION_THRESHOLDS.lowCtr &&
      metrics.impressions > OPTIMIZATION_THRESHOLDS.minImpressions
    ) {
      recs.push({
        id: `opt_${Date.now()}_low_ctr`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'pause_underperforming_creative',
        priority: 'medium',
        title: 'Niski CTR - odśwież kreacje',
        description: `CTR wynosi ${(metrics.ctr * 100).toFixed(2)}% (próg: ${(OPTIMIZATION_THRESHOLDS.lowCtr * 100).toFixed(1)}%). Treści reklam nie przyciągają uwagi. Rozważ nowe nagłówki i opisy.`,
        expectedImpact: 'Poprawa CTR o 50-100% po odświeżeniu kreacji',
        confidence: 0.7,
        autoApplicable: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Check individual creative performance variance
    if (campaign.creatives.length >= 2) {
      const creativeWithMetrics = campaign.creatives.filter(
        (c) => c.metrics && c.metrics.impressions > 100,
      );

      if (creativeWithMetrics.length >= 2) {
        const sorted = creativeWithMetrics.sort(
          (a, b) => (b.metrics?.conversions || 0) - (a.metrics?.conversions || 0),
        );
        const best = sorted[0];
        const worst = sorted[sorted.length - 1];

        if (
          best.metrics &&
          worst.metrics &&
          best.metrics.conversions > worst.metrics.conversions * OPTIMIZATION_THRESHOLDS.topCreativeMultiplier
        ) {
          recs.push({
            id: `opt_${Date.now()}_scale_creative`,
            campaignId: campaign.id,
            platform: best.platform,
            type: 'scale_top_creative',
            priority: 'medium',
            title: `Skaluj najlepszą kreację: "${best.name}"`,
            description: `Kreacja "${best.name}" ma ${best.metrics.conversions} konwersji vs "${worst.name}" z ${worst.metrics.conversions}. Wstrzymaj słabszą i zwiększ ekspozycję najlepszej.`,
            expectedImpact: `+${Math.round(best.metrics.conversions * 0.3)} konwersji`,
            confidence: 0.65,
            autoApplicable: true,
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return recs;
  }

  private checkTargetingOpportunities(
    campaign: Campaign,
    metrics: CampaignMetrics,
  ): OptimizationRecommendation[] {
    const recs: OptimizationRecommendation[] = [];

    // High conversion rate but low reach → expand audience
    if (metrics.conversionRate > 0.05 && metrics.impressions < 5000) {
      recs.push({
        id: `opt_${Date.now()}_expand_audience`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'expand_audience',
        priority: 'medium',
        title: 'Rozszerz grupę docelową',
        description: `Wysoki współczynnik konwersji (${(metrics.conversionRate * 100).toFixed(1)}%) przy niskim zasięgu. Potencjał do skalowania przez poszerzenie audience.`,
        expectedImpact: 'Wzrost konwersji przy utrzymaniu jakości ruchu',
        confidence: 0.6,
        autoApplicable: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Low conversion rate with high spend → narrow audience
    if (metrics.conversionRate < 0.01 && metrics.cost > 200) {
      recs.push({
        id: `opt_${Date.now()}_narrow_audience`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'narrow_audience',
        priority: 'high',
        title: 'Zawęź grupę docelową',
        description: `Niski współczynnik konwersji (${(metrics.conversionRate * 100).toFixed(2)}%) przy wydatkach ${metrics.cost.toFixed(0)} PLN. Targetowanie jest zbyt szerokie.`,
        expectedImpact: 'Redukcja CPA o 30-50%',
        confidence: 0.7,
        autoApplicable: false,
        createdAt: new Date().toISOString(),
      });
    }

    return recs;
  }

  private checkBidStrategy(
    campaign: Campaign,
    metrics: CampaignMetrics,
  ): OptimizationRecommendation[] {
    const recs: OptimizationRecommendation[] = [];

    // Enough data to switch from manual to automated bidding
    if (
      campaign.budget.bidStrategy === 'manual_cpc' &&
      metrics.conversions > 30 &&
      metrics.cost > 500
    ) {
      recs.push({
        id: `opt_${Date.now()}_bid_strategy`,
        campaignId: campaign.id,
        platform: campaign.platforms[0]?.platform || 'google_ads',
        type: 'change_bid_strategy',
        priority: 'medium',
        title: 'Przejdź na automatyczne bidowanie',
        description: `Masz wystarczająco danych (${metrics.conversions} konwersji) by przejść na Target CPA lub Maximize Conversions. Algorytm platform lepiej zoptymalizuje stawki.`,
        expectedImpact: 'Spadek CPA o 10-20% w ciągu 2 tygodni',
        confidence: 0.75,
        autoApplicable: false,
        createdAt: new Date().toISOString(),
      });
    }

    return recs;
  }

  private checkScheduleOptimization(
    campaign: Campaign,
    _metrics: CampaignMetrics,
  ): OptimizationRecommendation[] {
    // Schedule optimization would require hourly/daily metrics breakdown
    // Placeholder for future implementation
    return [];
  }

  // ---------------------------------------------------------------------------
  // Rule Engine
  // ---------------------------------------------------------------------------

  private evaluateRule(
    campaign: Campaign,
    metrics: CampaignMetrics,
    rule: OptimizationRule,
  ): OptimizationRecommendation | null {
    // Check cooldown
    if (rule.lastTriggered) {
      const cooldownEnd = new Date(rule.lastTriggered).getTime() + rule.cooldownHours * 3600_000;
      if (Date.now() < cooldownEnd) return null;
    }

    const metricValue = metrics[rule.condition.metric];
    if (typeof metricValue !== 'number') return null;

    let triggered = false;

    switch (rule.condition.operator) {
      case 'gt': triggered = metricValue > rule.condition.value; break;
      case 'lt': triggered = metricValue < rule.condition.value; break;
      case 'gte': triggered = metricValue >= rule.condition.value; break;
      case 'lte': triggered = metricValue <= rule.condition.value; break;
      case 'eq': triggered = metricValue === rule.condition.value; break;
      case 'between':
        triggered = metricValue >= rule.condition.value && metricValue <= (rule.condition.valueEnd || Infinity);
        break;
    }

    if (!triggered) return null;

    return {
      id: `rule_${rule.id}_${Date.now()}`,
      campaignId: campaign.id,
      platform: campaign.platforms[0]?.platform || 'google_ads',
      type: rule.action,
      priority: 'high',
      title: `Reguła: ${rule.name}`,
      description: `Warunek spełniony: ${rule.condition.metric} ${rule.condition.operator} ${rule.condition.value}. Aktualna wartość: ${metricValue.toFixed(2)}.`,
      expectedImpact: `Automatyczna akcja: ${rule.action}`,
      confidence: 0.9,
      autoApplicable: true,
      createdAt: new Date().toISOString(),
    };
  }

  // ---------------------------------------------------------------------------
  // Apply Actions
  // ---------------------------------------------------------------------------

  private async applyBudgetIncrease(
    campaign: Campaign,
    _recommendation: OptimizationRecommendation,
  ): Promise<void> {
    const newBudget = Math.min(
      campaign.budget.dailyBudget * OPTIMIZATION_THRESHOLDS.maxBudgetIncrease,
      campaign.budget.totalBudget || Infinity,
    );
    await campaignManager.adjustBudget(campaign.id, newBudget);
  }

  private async applyBudgetDecrease(
    campaign: Campaign,
    _recommendation: OptimizationRecommendation,
  ): Promise<void> {
    const newBudget = campaign.budget.dailyBudget * OPTIMIZATION_THRESHOLDS.maxBudgetDecrease;
    await campaignManager.adjustBudget(campaign.id, newBudget);
  }

  private async applyBudgetReallocation(
    campaign: Campaign,
    _recommendation: OptimizationRecommendation,
  ): Promise<void> {
    // Reallocate based on platform ROAS
    // Platforms with higher ROAS get more budget
    const platformPerformance: { platform: Platform; roas: number }[] = [];

    for (const pc of campaign.platforms) {
      if (!pc.externalId) continue;
      // Use campaign-level metrics as proxy
      platformPerformance.push({
        platform: pc.platform,
        roas: campaign.metrics.roas, // In production, per-platform metrics
      });
    }

    if (platformPerformance.length === 0) return;

    const totalRoas = platformPerformance.reduce((sum, p) => sum + Math.max(p.roas, 0.1), 0);
    const allocation = platformPerformance.map((p) => ({
      platform: p.platform,
      percentage: (Math.max(p.roas, 0.1) / totalRoas) * 100,
    }));

    await campaignManager.adjustBudget(campaign.id, campaign.budget.dailyBudget, allocation);
  }

  private async applyBidStrategyChange(
    campaign: Campaign,
    _recommendation: OptimizationRecommendation,
  ): Promise<void> {
    await campaignManager.updateCampaign(campaign.id, {
      budget: {
        ...campaign.budget,
        bidStrategy: 'maximize_conversions',
      },
    });
  }

  private async pauseCreative(
    campaign: Campaign,
    _recommendation: OptimizationRecommendation,
  ): Promise<void> {
    // Find worst-performing creative and remove it
    const withMetrics = campaign.creatives.filter((c) => c.metrics);
    if (withMetrics.length < 2) return;

    const worst = withMetrics.sort(
      (a, b) => (a.metrics?.conversions || 0) - (b.metrics?.conversions || 0),
    )[0];

    await campaignManager.removeCreative(campaign.id, worst.id);
  }
}

export const campaignOptimizer = new CampaignOptimizer();

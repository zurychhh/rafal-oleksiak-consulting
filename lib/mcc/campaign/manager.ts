// =============================================================================
// Campaign Manager - Cross-platform campaign lifecycle management
// =============================================================================

import type {
  Campaign,
  CampaignStatus,
  Platform,
  PlatformCampaign,
  BudgetConfig,
  CampaignSchedule,
  TargetingConfig,
  Creative,
  CreativeVariant,
  CampaignMetrics,
  MetricsPeriod,
} from '../types';
import { platformRegistry } from '../platforms';
import type { CreateCampaignInput } from '../platforms/types';

// In production, this would be a database. For now, in-memory store.
const campaigns: Map<string, Campaign> = new Map();

export class CampaignManager {
  // ---------------------------------------------------------------------------
  // Campaign CRUD
  // ---------------------------------------------------------------------------

  async createCampaign(params: {
    name: string;
    description: string;
    objective: Campaign['objective'];
    platforms: Platform[];
    budget: BudgetConfig;
    schedule: CampaignSchedule;
    targeting: TargetingConfig;
    creatives: CreativeVariant[];
    createdBy: string;
  }): Promise<Campaign> {
    const id = `mcc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const campaign: Campaign = {
      id,
      name: params.name,
      description: params.description,
      status: 'draft',
      objective: params.objective,
      platforms: params.platforms.map((platform) => ({
        platform,
        status: 'draft' as CampaignStatus,
        platformSpecific: {},
      })),
      budget: params.budget,
      schedule: params.schedule,
      targeting: params.targeting,
      creatives: params.creatives.map((variant, i) => ({
        id: `creative_${id}_${i}`,
        name: variant.headlines[0] || `Creative ${i + 1}`,
        type: 'responsive' as const,
        status: 'draft' as const,
        platform: params.platforms[0],
        variants: [variant],
      })),
      metrics: this.emptyMetrics(),
      optimizationRules: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: params.createdBy,
    };

    campaigns.set(id, campaign);
    return campaign;
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    return campaigns.get(id) || null;
  }

  async listCampaigns(filters?: {
    status?: CampaignStatus[];
    platform?: Platform;
    search?: string;
  }): Promise<Campaign[]> {
    let result = Array.from(campaigns.values());

    if (filters?.status?.length) {
      result = result.filter((c) => filters.status!.includes(c.status));
    }
    if (filters?.platform) {
      result = result.filter((c) =>
        c.platforms.some((p) => p.platform === filters.platform),
      );
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search),
      );
    }

    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateCampaign(
    id: string,
    updates: Partial<Pick<Campaign, 'name' | 'description' | 'budget' | 'targeting' | 'schedule'>>,
  ): Promise<Campaign> {
    const campaign = campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);

    Object.assign(campaign, updates, { updatedAt: new Date().toISOString() });
    campaigns.set(id, campaign);
    return campaign;
  }

  async deleteCampaign(id: string): Promise<void> {
    const campaign = campaigns.get(id);
    if (!campaign) return;

    // Stop on all platforms first
    if (campaign.status === 'active') {
      await this.pauseCampaign(id);
    }

    campaigns.delete(id);
  }

  // ---------------------------------------------------------------------------
  // Campaign Lifecycle
  // ---------------------------------------------------------------------------

  async launchCampaign(id: string): Promise<Campaign> {
    const campaign = campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);
    if (campaign.status === 'active') throw new Error('Campaign is already active');

    const errors: string[] = [];

    // Launch on each target platform
    for (const platformCampaign of campaign.platforms) {
      try {
        const connector = platformRegistry.getConnector(platformCampaign.platform);
        const allocation = campaign.budget.allocation.find(
          (a) => a.platform === platformCampaign.platform,
        );

        const input: CreateCampaignInput = {
          name: campaign.name,
          objective: campaign.objective,
          budget: {
            daily: allocation?.dailyLimit || campaign.budget.dailyBudget,
            total: campaign.budget.totalBudget,
            currency: campaign.budget.currency,
          },
          bidStrategy: campaign.budget.bidStrategy,
          targeting: campaign.targeting,
          schedule: campaign.schedule,
          creatives: campaign.creatives
            .filter((c) => c.platform === platformCampaign.platform)
            .flatMap((c) => c.variants),
        };

        const externalId = await connector.createCampaign(input);
        platformCampaign.externalId = externalId;

        // Activate the campaign
        await connector.setCampaignStatus(externalId, 'active');
        platformCampaign.status = 'active';
      } catch (error) {
        platformCampaign.status = 'failed';
        platformCampaign.platformSpecific.error =
          error instanceof Error ? error.message : 'Launch failed';
        errors.push(
          `${platformCampaign.platform}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    // Update overall status
    const activePlatforms = campaign.platforms.filter((p) => p.status === 'active');
    if (activePlatforms.length === 0) {
      campaign.status = 'failed';
      throw new Error(`Campaign launch failed on all platforms: ${errors.join('; ')}`);
    }

    campaign.status = activePlatforms.length === campaign.platforms.length
      ? 'active'
      : 'active'; // partial launch still counts as active

    campaign.updatedAt = new Date().toISOString();
    campaigns.set(id, campaign);

    return campaign;
  }

  async pauseCampaign(id: string): Promise<Campaign> {
    return this.setCampaignStatus(id, 'paused');
  }

  async resumeCampaign(id: string): Promise<Campaign> {
    return this.setCampaignStatus(id, 'active');
  }

  async completeCampaign(id: string): Promise<Campaign> {
    return this.setCampaignStatus(id, 'completed');
  }

  private async setCampaignStatus(id: string, status: CampaignStatus): Promise<Campaign> {
    const campaign = campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);

    for (const platformCampaign of campaign.platforms) {
      if (!platformCampaign.externalId) continue;

      try {
        const connector = platformRegistry.getConnector(platformCampaign.platform);
        await connector.setCampaignStatus(platformCampaign.externalId, status);
        platformCampaign.status = status;
      } catch (error) {
        console.error(
          `Failed to set ${status} on ${platformCampaign.platform}:`,
          error,
        );
      }
    }

    campaign.status = status;
    campaign.updatedAt = new Date().toISOString();
    campaigns.set(id, campaign);

    return campaign;
  }

  // ---------------------------------------------------------------------------
  // Metrics Sync
  // ---------------------------------------------------------------------------

  async syncCampaignMetrics(id: string, period: MetricsPeriod): Promise<CampaignMetrics> {
    const campaign = campaigns.get(id);
    if (!campaign) throw new Error(`Campaign ${id} not found`);

    const platformMetrics = await Promise.allSettled(
      campaign.platforms
        .filter((p) => p.externalId)
        .map(async (p) => {
          const connector = platformRegistry.getConnector(p.platform);
          return {
            platform: p.platform,
            metrics: await connector.getCampaignMetrics(p.externalId!, period),
          };
        }),
    );

    // Aggregate metrics across platforms
    const aggregated = this.emptyMetrics(period);

    for (const result of platformMetrics) {
      if (result.status !== 'fulfilled') continue;
      const m = result.value.metrics;

      aggregated.impressions += m.impressions;
      aggregated.clicks += m.clicks;
      aggregated.conversions += m.conversions;
      aggregated.cost += m.cost;
      aggregated.revenue += m.revenue;
      aggregated.reach = (aggregated.reach || 0) + (m.reach || 0);
    }

    // Calculate derived metrics
    aggregated.ctr = aggregated.impressions > 0
      ? aggregated.clicks / aggregated.impressions
      : 0;
    aggregated.conversionRate = aggregated.clicks > 0
      ? aggregated.conversions / aggregated.clicks
      : 0;
    aggregated.cpc = aggregated.clicks > 0
      ? aggregated.cost / aggregated.clicks
      : 0;
    aggregated.cpa = aggregated.conversions > 0
      ? aggregated.cost / aggregated.conversions
      : 0;
    aggregated.roas = aggregated.cost > 0
      ? aggregated.revenue / aggregated.cost
      : 0;

    campaign.metrics = aggregated;
    campaigns.set(id, campaign);

    return aggregated;
  }

  // ---------------------------------------------------------------------------
  // Creative Management
  // ---------------------------------------------------------------------------

  async addCreative(campaignId: string, creative: Creative): Promise<Campaign> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    campaign.creatives.push(creative);
    campaign.updatedAt = new Date().toISOString();

    // If campaign is active, push creative to platform
    for (const platformCampaign of campaign.platforms) {
      if (!platformCampaign.externalId || platformCampaign.status !== 'active') continue;
      if (creative.platform !== platformCampaign.platform) continue;

      try {
        const connector = platformRegistry.getConnector(platformCampaign.platform);
        for (const variant of creative.variants) {
          await connector.createCreative(platformCampaign.externalId, variant);
        }
      } catch (error) {
        console.error(`Failed to push creative to ${platformCampaign.platform}:`, error);
      }
    }

    campaigns.set(campaignId, campaign);
    return campaign;
  }

  async removeCreative(campaignId: string, creativeId: string): Promise<Campaign> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    campaign.creatives = campaign.creatives.filter((c) => c.id !== creativeId);
    campaign.updatedAt = new Date().toISOString();
    campaigns.set(campaignId, campaign);

    return campaign;
  }

  // ---------------------------------------------------------------------------
  // Budget Operations
  // ---------------------------------------------------------------------------

  async adjustBudget(
    campaignId: string,
    newDailyBudget: number,
    allocation?: { platform: Platform; percentage: number }[],
  ): Promise<Campaign> {
    const campaign = campaigns.get(campaignId);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    campaign.budget.dailyBudget = newDailyBudget;

    if (allocation) {
      campaign.budget.allocation = allocation.map((a) => ({
        platform: a.platform,
        percentage: a.percentage,
        dailyLimit: newDailyBudget * (a.percentage / 100),
      }));
    } else {
      // Redistribute evenly
      const perPlatform = newDailyBudget / campaign.platforms.length;
      campaign.budget.allocation = campaign.platforms.map((p) => ({
        platform: p.platform,
        percentage: 100 / campaign.platforms.length,
        dailyLimit: perPlatform,
      }));
    }

    // Push budget changes to active platforms
    for (const platformCampaign of campaign.platforms) {
      if (!platformCampaign.externalId || platformCampaign.status !== 'active') continue;

      const alloc = campaign.budget.allocation.find(
        (a) => a.platform === platformCampaign.platform,
      );
      if (!alloc) continue;

      try {
        const connector = platformRegistry.getConnector(platformCampaign.platform);
        await connector.updateCampaign(platformCampaign.externalId, {
          budget: { daily: alloc.dailyLimit },
        });
      } catch (error) {
        console.error(`Failed to update budget on ${platformCampaign.platform}:`, error);
      }
    }

    campaign.updatedAt = new Date().toISOString();
    campaigns.set(campaignId, campaign);

    return campaign;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private emptyMetrics(period?: MetricsPeriod): CampaignMetrics {
    return {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0,
      cost: 0,
      cpc: 0,
      cpa: 0,
      roas: 0,
      revenue: 0,
      period: period || {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        granularity: 'daily',
      },
    };
  }
}

// Singleton
export const campaignManager = new CampaignManager();

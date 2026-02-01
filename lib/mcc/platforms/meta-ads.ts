// =============================================================================
// Meta Ads Platform Connector
// Uses Meta Marketing API v21.0
// =============================================================================

import type {
  Platform,
  PlatformConnection,
  PlatformCredentials,
  Campaign,
  CampaignStatus,
  CampaignMetrics,
  MetricsPeriod,
  Creative,
  CreativeVariant,
  AudienceTarget,
} from '../types';

import type {
  PlatformConnector,
  CreateCampaignInput,
  UpdateCampaignInput,
  CampaignFilters,
  CreateAudienceInput,
  MetaAdsConfig,
} from './types';

const META_API_VERSION = 'v21.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaAdsConnector implements PlatformConnector {
  readonly platform: Platform = 'meta_ads';
  private config: MetaAdsConfig | null = null;

  // ---------------------------------------------------------------------------
  // Connection
  // ---------------------------------------------------------------------------

  async connect(credentials: PlatformCredentials): Promise<PlatformConnection> {
    this.config = credentials.metadata as unknown as MetaAdsConfig;

    const account = await this.apiRequest(`act_${this.config.adAccountId}`, {
      fields: 'name,account_status,currency,timezone_name',
    });

    return {
      platform: 'meta_ads',
      status: 'connected',
      accountId: credentials.accountId,
      accountName: account.name || credentials.accountId,
      lastSync: new Date().toISOString(),
    };
  }

  async disconnect(): Promise<void> {
    this.config = null;
  }

  async getStatus(): Promise<PlatformConnection> {
    if (!this.config) {
      return {
        platform: 'meta_ads',
        status: 'disconnected',
        accountId: '',
        accountName: '',
        lastSync: new Date().toISOString(),
      };
    }

    try {
      const account = await this.apiRequest(`act_${this.config.adAccountId}`, {
        fields: 'name,account_status',
      });
      return {
        platform: 'meta_ads',
        status: account.account_status === 1 ? 'connected' : 'error',
        accountId: this.config.adAccountId,
        accountName: account.name || '',
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      return {
        platform: 'meta_ads',
        status: 'error',
        accountId: this.config.adAccountId,
        accountName: '',
        lastSync: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refreshToken(): Promise<PlatformCredentials> {
    const config = this.requireConfig();

    const response = await fetch(
      `${META_BASE_URL}/oauth/access_token?` +
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: config.appId,
        client_secret: config.appSecret,
        fb_exchange_token: config.accessToken,
      }),
    );

    if (!response.ok) throw new Error(`Meta token refresh failed: ${response.status}`);

    const data = await response.json();
    this.config = { ...config, accessToken: data.access_token };

    return {
      platform: 'meta_ads',
      accessToken: data.access_token,
      expiresAt: data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : undefined,
      accountId: config.adAccountId,
    };
  }

  // ---------------------------------------------------------------------------
  // Campaigns
  // ---------------------------------------------------------------------------

  async createCampaign(input: CreateCampaignInput): Promise<string> {
    const config = this.requireConfig();

    // Step 1: Create Campaign
    const campaign = await this.apiRequest(
      `act_${config.adAccountId}/campaigns`,
      {},
      'POST',
      {
        name: input.name,
        objective: this.mapObjective(input.objective),
        status: 'PAUSED',
        special_ad_categories: '[]',
        buying_type: 'AUCTION',
        daily_budget: Math.round(input.budget.daily * 100), // cents
      },
    );

    const campaignId = campaign.id;

    // Step 2: Create Ad Set
    const adSet = await this.apiRequest(
      `act_${config.adAccountId}/adsets`,
      {},
      'POST',
      {
        name: `${input.name} - Ad Set`,
        campaign_id: campaignId,
        daily_budget: Math.round(input.budget.daily * 100),
        billing_event: 'IMPRESSIONS',
        optimization_goal: this.mapOptimizationGoal(input.objective),
        bid_strategy: this.mapBidStrategy(input.bidStrategy),
        start_time: input.schedule.startDate,
        end_time: input.schedule.endDate,
        targeting: this.buildMetaTargeting(input.targeting),
        status: 'PAUSED',
      },
    );

    // Step 3: Create Ads from creatives
    for (const creative of input.creatives) {
      await this.createCreative(adSet.id, creative);
    }

    return campaignId;
  }

  async updateCampaign(externalId: string, updates: UpdateCampaignInput): Promise<void> {
    const payload: Record<string, unknown> = {};

    if (updates.name) payload.name = updates.name;
    if (updates.budget?.daily) payload.daily_budget = Math.round(updates.budget.daily * 100);
    if (updates.bidStrategy) payload.bid_strategy = this.mapBidStrategy(updates.bidStrategy);

    if (Object.keys(payload).length === 0) return;

    await this.apiRequest(externalId, {}, 'POST', payload);
  }

  async setCampaignStatus(externalId: string, status: CampaignStatus): Promise<void> {
    await this.apiRequest(externalId, {}, 'POST', {
      status: this.mapStatus(status),
    });
  }

  async getCampaign(externalId: string): Promise<Campaign> {
    const data = await this.apiRequest(externalId, {
      fields: 'name,status,objective,daily_budget,start_time,stop_time,created_time,updated_time',
    });

    return this.mapMetaCampaignToInternal(data);
  }

  async listCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    const config = this.requireConfig();
    const params: Record<string, string> = {
      fields: 'name,status,objective,daily_budget,start_time,stop_time,created_time,updated_time',
      limit: '100',
    };

    if (filters?.status?.length) {
      const statuses = filters.status.map((s) => this.mapStatus(s));
      params.filtering = JSON.stringify([{
        field: 'effective_status',
        operator: 'IN',
        value: statuses,
      }]);
    }

    const result = await this.apiRequest(
      `act_${config.adAccountId}/campaigns`,
      params,
    );

    return (result.data || []).map((c: Record<string, unknown>) =>
      this.mapMetaCampaignToInternal(c),
    );
  }

  async deleteCampaign(externalId: string): Promise<void> {
    await this.apiRequest(externalId, {}, 'DELETE');
  }

  // ---------------------------------------------------------------------------
  // Creatives
  // ---------------------------------------------------------------------------

  async createCreative(adSetId: string, creative: CreativeVariant): Promise<string> {
    const config = this.requireConfig();

    // Create ad creative
    const adCreative = await this.apiRequest(
      `act_${config.adAccountId}/adcreatives`,
      {},
      'POST',
      {
        name: creative.headlines[0] || 'MCC Creative',
        object_story_spec: {
          page_id: config.pageId,
          link_data: {
            message: creative.descriptions[0] || '',
            link: creative.landingUrl,
            name: creative.headlines[0] || '',
            description: creative.descriptions[1] || '',
            call_to_action: {
              type: this.mapCallToAction(creative.callToAction),
              value: { link: creative.landingUrl },
            },
            ...(creative.imageUrl ? { image_url: creative.imageUrl } : {}),
          },
        },
      },
    );

    // Create ad
    const ad = await this.apiRequest(
      `act_${config.adAccountId}/ads`,
      {},
      'POST',
      {
        name: creative.headlines[0] || 'MCC Ad',
        adset_id: adSetId,
        creative: { creative_id: adCreative.id },
        status: 'PAUSED',
      },
    );

    return ad.id;
  }

  async updateCreative(creativeId: string, creative: Partial<CreativeVariant>): Promise<void> {
    const payload: Record<string, unknown> = {};

    if (creative.headlines || creative.descriptions) {
      payload.object_story_spec = {
        link_data: {
          ...(creative.headlines?.[0] ? { name: creative.headlines[0] } : {}),
          ...(creative.descriptions?.[0] ? { message: creative.descriptions[0] } : {}),
          ...(creative.landingUrl ? { link: creative.landingUrl } : {}),
        },
      };
    }

    if (Object.keys(payload).length === 0) return;
    await this.apiRequest(creativeId, {}, 'POST', payload);
  }

  async getCreativePerformance(creativeId: string, period: MetricsPeriod): Promise<Creative> {
    const data = await this.apiRequest(`${creativeId}/insights`, {
      fields: 'impressions,clicks,ctr,spend,actions,action_values',
      time_range: JSON.stringify({
        since: period.start,
        until: period.end,
      }),
    });

    const insights = data.data?.[0] || {};
    const conversions = this.extractMetaConversions(insights.actions);

    return {
      id: creativeId,
      name: '',
      type: 'image',
      status: 'active',
      platform: 'meta_ads',
      variants: [],
      metrics: {
        impressions: Number(insights.impressions || 0),
        clicks: Number(insights.clicks || 0),
        ctr: Number(insights.ctr || 0),
        conversions,
        conversionRate: Number(insights.clicks) > 0 ? conversions / Number(insights.clicks) : 0,
        cost: Number(insights.spend || 0),
        cpc: Number(insights.clicks) > 0 ? Number(insights.spend || 0) / Number(insights.clicks) : 0,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Metrics
  // ---------------------------------------------------------------------------

  async getCampaignMetrics(campaignId: string, period: MetricsPeriod): Promise<CampaignMetrics> {
    const data = await this.apiRequest(`${campaignId}/insights`, {
      fields: 'impressions,clicks,ctr,spend,actions,action_values,reach,frequency,cpc,cpp',
      time_range: JSON.stringify({
        since: period.start,
        until: period.end,
      }),
      time_increment: period.granularity === 'daily' ? '1' : period.granularity === 'monthly' ? 'monthly' : '1',
    });

    return this.aggregateMetaMetrics(data.data || [], period);
  }

  async getAccountMetrics(period: MetricsPeriod): Promise<CampaignMetrics> {
    const config = this.requireConfig();

    const data = await this.apiRequest(
      `act_${config.adAccountId}/insights`,
      {
        fields: 'impressions,clicks,ctr,spend,actions,action_values,reach,frequency,cpc',
        time_range: JSON.stringify({
          since: period.start,
          until: period.end,
        }),
      },
    );

    return this.aggregateMetaMetrics(data.data || [], period);
  }

  // ---------------------------------------------------------------------------
  // Audiences
  // ---------------------------------------------------------------------------

  async getAudiences(): Promise<AudienceTarget[]> {
    const config = this.requireConfig();

    const data = await this.apiRequest(
      `act_${config.adAccountId}/customaudiences`,
      { fields: 'name,subtype,approximate_count_lower_bound,approximate_count_upper_bound' },
    );

    return (data.data || []).map((a: Record<string, unknown>) => ({
      id: String(a.id),
      name: String(a.name),
      type: this.mapMetaAudienceType(String(a.subtype)),
      platform: 'meta_ads' as const,
      size: Number(a.approximate_count_upper_bound || 0),
    }));
  }

  async createAudience(audience: CreateAudienceInput): Promise<string> {
    const config = this.requireConfig();

    const payload: Record<string, unknown> = {
      name: audience.name,
      subtype: audience.type === 'lookalike' ? 'LOOKALIKE' : 'CUSTOM',
      description: `MCC-created: ${audience.name}`,
    };

    if (audience.type === 'lookalike' && audience.sourceData?.seedAudienceId) {
      payload.origin_audience_id = audience.sourceData.seedAudienceId;
      payload.lookalike_spec = JSON.stringify({
        ratio: (audience.sourceData.lookalikePercentage || 1) / 100,
        country: 'PL',
      });
    }

    const result = await this.apiRequest(
      `act_${config.adAccountId}/customaudiences`,
      {},
      'POST',
      payload,
    );

    return result.id;
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private requireConfig(): MetaAdsConfig {
    if (!this.config) throw new Error('Meta Ads connector not configured. Call connect() first.');
    return this.config;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async apiRequest(
    endpoint: string,
    params: Record<string, string> = {},
    method: string = 'GET',
    body?: Record<string, unknown>,
  ): Promise<any> {
    const config = this.requireConfig();
    const url = new URL(`${META_BASE_URL}/${endpoint}`);

    url.searchParams.set('access_token', config.accessToken);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const options: RequestInit = { method };
    if (body && (method === 'POST' || method === 'PUT')) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Meta API error ${response.status}: ${JSON.stringify(error?.error || error)}`,
      );
    }

    return response.json();
  }

  private mapObjective(objective: string): string {
    const map: Record<string, string> = {
      awareness: 'OUTCOME_AWARENESS',
      traffic: 'OUTCOME_TRAFFIC',
      engagement: 'OUTCOME_ENGAGEMENT',
      leads: 'OUTCOME_LEADS',
      conversions: 'OUTCOME_SALES',
      sales: 'OUTCOME_SALES',
    };
    return map[objective] || 'OUTCOME_TRAFFIC';
  }

  private mapOptimizationGoal(objective: string): string {
    const map: Record<string, string> = {
      awareness: 'REACH',
      traffic: 'LINK_CLICKS',
      engagement: 'POST_ENGAGEMENT',
      leads: 'LEAD_GENERATION',
      conversions: 'OFFSITE_CONVERSIONS',
      sales: 'OFFSITE_CONVERSIONS',
    };
    return map[objective] || 'LINK_CLICKS';
  }

  private mapBidStrategy(strategy: string): string {
    const map: Record<string, string> = {
      manual_cpc: 'LOWEST_COST_WITHOUT_CAP',
      target_cpa: 'COST_CAP',
      target_roas: 'MINIMUM_ROAS',
      maximize_clicks: 'LOWEST_COST_WITHOUT_CAP',
      maximize_conversions: 'LOWEST_COST_WITHOUT_CAP',
    };
    return map[strategy] || 'LOWEST_COST_WITHOUT_CAP';
  }

  private mapStatus(status: CampaignStatus): string {
    const map: Record<CampaignStatus, string> = {
      draft: 'PAUSED',
      pending_review: 'PAUSED',
      active: 'ACTIVE',
      paused: 'PAUSED',
      completed: 'ARCHIVED',
      failed: 'PAUSED',
    };
    return map[status];
  }

  private mapCallToAction(cta?: string): string {
    if (!cta) return 'LEARN_MORE';
    const map: Record<string, string> = {
      'Learn More': 'LEARN_MORE',
      'Sign Up': 'SIGN_UP',
      'Contact Us': 'CONTACT_US',
      'Get Quote': 'GET_QUOTE',
      'Book Now': 'BOOK_TRAVEL',
      'Download': 'DOWNLOAD',
      'Shop Now': 'SHOP_NOW',
    };
    return map[cta] || 'LEARN_MORE';
  }

  private buildMetaTargeting(targeting: Campaign['targeting']): Record<string, unknown> {
    const metaTargeting: Record<string, unknown> = {};

    // Geo targeting
    if (targeting.locations.length > 0) {
      metaTargeting.geo_locations = {
        countries: targeting.locations
          .filter((l) => l.type === 'country')
          .map((l) => l.value),
        cities: targeting.locations
          .filter((l) => l.type === 'city')
          .map((l) => ({ key: l.value })),
      };
    }

    // Demographics
    if (targeting.demographics.ageRanges.length > 0) {
      const ages = targeting.demographics.ageRanges[0].split('-');
      metaTargeting.age_min = parseInt(ages[0]) || 18;
      metaTargeting.age_max = parseInt(ages[1]) || 65;
    }

    if (targeting.demographics.genders.some((g) => g !== 'all')) {
      metaTargeting.genders = targeting.demographics.genders.map((g) =>
        g === 'male' ? 1 : g === 'female' ? 2 : 0,
      );
    }

    // Interests
    if (targeting.interests.length > 0) {
      metaTargeting.interests = targeting.interests.map((i) => ({ name: i }));
    }

    // Devices
    if (!targeting.devices.desktop || !targeting.devices.mobile || !targeting.devices.tablet) {
      const devicePlatforms: string[] = [];
      if (targeting.devices.mobile) devicePlatforms.push('mobile');
      if (targeting.devices.desktop) devicePlatforms.push('desktop');
      metaTargeting.device_platforms = devicePlatforms;
    }

    return metaTargeting;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapMetaCampaignToInternal(data: any): Campaign {
    return {
      id: String(data.id),
      name: String(data.name),
      description: '',
      status: this.reverseMapStatus(String(data.status || data.effective_status)),
      objective: this.reverseMapObjective(String(data.objective)),
      platforms: [{
        platform: 'meta_ads',
        externalId: String(data.id),
        status: this.reverseMapStatus(String(data.status)),
        platformSpecific: { objective: data.objective },
      }],
      budget: {
        totalBudget: Number(data.lifetime_budget || 0) / 100,
        dailyBudget: Number(data.daily_budget || 0) / 100,
        currency: 'PLN',
        allocation: [{ platform: 'meta_ads', percentage: 100, dailyLimit: Number(data.daily_budget || 0) / 100 }],
        bidStrategy: 'maximize_clicks',
      },
      schedule: {
        startDate: String(data.start_time || ''),
        endDate: data.stop_time ? String(data.stop_time) : undefined,
        timezone: 'Europe/Warsaw',
      },
      targeting: {
        locations: [],
        languages: ['pl'],
        demographics: { ageRanges: [], genders: ['all'] },
        interests: [],
        keywords: [],
        audiences: [],
        exclusions: { keywords: [], audiences: [], placements: [], locations: [] },
        devices: { desktop: true, mobile: true, tablet: true },
      },
      creatives: [],
      metrics: {
        impressions: 0, clicks: 0, ctr: 0, conversions: 0,
        conversionRate: 0, cost: 0, cpc: 0, cpa: 0, roas: 0, revenue: 0,
        period: { start: '', end: '', granularity: 'daily' },
      },
      optimizationRules: [],
      createdAt: String(data.created_time || new Date().toISOString()),
      updatedAt: String(data.updated_time || new Date().toISOString()),
      createdBy: 'mcc',
    };
  }

  private reverseMapStatus(metaStatus: string): CampaignStatus {
    const map: Record<string, CampaignStatus> = {
      ACTIVE: 'active',
      PAUSED: 'paused',
      ARCHIVED: 'completed',
      DELETED: 'completed',
    };
    return map[metaStatus] || 'draft';
  }

  private reverseMapObjective(objective: string): Campaign['objective'] {
    const map: Record<string, Campaign['objective']> = {
      OUTCOME_AWARENESS: 'awareness',
      OUTCOME_TRAFFIC: 'traffic',
      OUTCOME_ENGAGEMENT: 'engagement',
      OUTCOME_LEADS: 'leads',
      OUTCOME_SALES: 'conversions',
    };
    return map[objective] || 'traffic';
  }

  private mapMetaAudienceType(subtype: string): AudienceTarget['type'] {
    const map: Record<string, AudienceTarget['type']> = {
      CUSTOM: 'custom',
      LOOKALIKE: 'lookalike',
      WEBSITE: 'remarketing',
    };
    return map[subtype] || 'custom';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractMetaConversions(actions?: any[]): number {
    if (!actions) return 0;
    const conversionTypes = ['offsite_conversion', 'lead', 'complete_registration', 'purchase'];
    return actions
      .filter((a) => conversionTypes.some((t) => a.action_type.includes(t)))
      .reduce((sum, a) => sum + Number(a.value || 0), 0);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private aggregateMetaMetrics(data: any[], period: MetricsPeriod): CampaignMetrics {
    let impressions = 0, clicks = 0, spend = 0, conversions = 0, revenue = 0, reach = 0;

    for (const row of data) {
      impressions += Number(row.impressions || 0);
      clicks += Number(row.clicks || 0);
      spend += Number(row.spend || 0);
      reach += Number(row.reach || 0);
      conversions += this.extractMetaConversions(
        row.actions as { action_type: string; value: string }[],
      );
      const actionValues = row.action_values as { action_type: string; value: string }[] | undefined;
      if (actionValues) {
        revenue += actionValues
          .filter((a) => a.action_type.includes('purchase'))
          .reduce((sum, a) => sum + Number(a.value || 0), 0);
      }
    }

    return {
      impressions,
      clicks,
      ctr: impressions > 0 ? clicks / impressions : 0,
      conversions,
      conversionRate: clicks > 0 ? conversions / clicks : 0,
      cost: spend,
      cpc: clicks > 0 ? spend / clicks : 0,
      cpa: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? revenue / spend : 0,
      revenue,
      reach,
      period,
    };
  }
}

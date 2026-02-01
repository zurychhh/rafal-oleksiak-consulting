// =============================================================================
// LinkedIn Ads Platform Connector
// Uses LinkedIn Marketing API v2
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
  LinkedInAdsConfig,
} from './types';

const LINKEDIN_BASE_URL = 'https://api.linkedin.com/rest';
const LINKEDIN_API_VERSION = '202401';

export class LinkedInAdsConnector implements PlatformConnector {
  readonly platform: Platform = 'linkedin_ads';
  private config: LinkedInAdsConfig | null = null;

  // ---------------------------------------------------------------------------
  // Connection
  // ---------------------------------------------------------------------------

  async connect(credentials: PlatformCredentials): Promise<PlatformConnection> {
    this.config = credentials.metadata as unknown as LinkedInAdsConfig;

    const account = await this.apiRequest(
      `/adAccounts/${this.config.adAccountId}`,
      { fields: 'name,status,currency,type' },
    );

    return {
      platform: 'linkedin_ads',
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
        platform: 'linkedin_ads',
        status: 'disconnected',
        accountId: '',
        accountName: '',
        lastSync: new Date().toISOString(),
      };
    }

    try {
      const account = await this.apiRequest(
        `/adAccounts/${this.config.adAccountId}`,
        { fields: 'name,status' },
      );
      return {
        platform: 'linkedin_ads',
        status: account.status === 'ACTIVE' ? 'connected' : 'error',
        accountId: this.config.adAccountId,
        accountName: account.name || '',
        lastSync: new Date().toISOString(),
      };
    } catch (error) {
      return {
        platform: 'linkedin_ads',
        status: 'error',
        accountId: this.config.adAccountId,
        accountName: '',
        lastSync: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async refreshToken(): Promise<PlatformCredentials> {
    // LinkedIn tokens are refreshed via OAuth 2.0 flow
    // This requires user interaction, so we throw an error
    throw new Error(
      'LinkedIn token refresh requires re-authorization via OAuth flow. ' +
      'Navigate to the admin panel to reconnect.',
    );
  }

  // ---------------------------------------------------------------------------
  // Campaigns
  // ---------------------------------------------------------------------------

  async createCampaign(input: CreateCampaignInput): Promise<string> {
    const config = this.requireConfig();

    // Step 1: Create Campaign Group
    const group = await this.apiRequest('/adCampaignGroups', {}, 'POST', {
      account: `urn:li:sponsoredAccount:${config.adAccountId}`,
      name: input.name,
      status: 'DRAFT',
      runSchedule: {
        start: new Date(input.schedule.startDate).getTime(),
        ...(input.schedule.endDate
          ? { end: new Date(input.schedule.endDate).getTime() }
          : {}),
      },
      totalBudget: input.budget.total
        ? { amount: String(input.budget.total), currencyCode: input.budget.currency }
        : undefined,
    });

    const groupId = group.id || this.extractIdFromHeader(group);

    // Step 2: Create Campaign
    const campaign = await this.apiRequest('/adCampaigns', {}, 'POST', {
      account: `urn:li:sponsoredAccount:${config.adAccountId}`,
      campaignGroup: `urn:li:sponsoredCampaignGroup:${groupId}`,
      name: `${input.name} - Campaign`,
      type: this.mapCampaignType(input.objective),
      costType: this.mapCostType(input.bidStrategy),
      dailyBudget: {
        amount: String(input.budget.daily),
        currencyCode: input.budget.currency,
      },
      objectiveType: this.mapObjective(input.objective),
      status: 'PAUSED',
      locale: { country: 'PL', language: 'pl' },
      targetingCriteria: this.buildLinkedInTargeting(input.targeting),
      creativeSelection: 'OPTIMIZED',
    });

    const campaignId = campaign.id || this.extractIdFromHeader(campaign);

    // Step 3: Create Creatives
    for (const creative of input.creatives) {
      await this.createCreative(campaignId, creative);
    }

    return String(campaignId);
  }

  async updateCampaign(externalId: string, updates: UpdateCampaignInput): Promise<void> {
    const payload: Record<string, unknown> = {};

    if (updates.name) payload.name = updates.name;
    if (updates.budget?.daily) {
      payload.dailyBudget = {
        amount: String(updates.budget.daily),
        currencyCode: 'PLN',
      };
    }
    if (updates.bidStrategy) {
      payload.costType = this.mapCostType(updates.bidStrategy);
    }

    if (Object.keys(payload).length === 0) return;

    await this.apiRequest(`/adCampaigns/${externalId}`, {}, 'PATCH', payload);
  }

  async setCampaignStatus(externalId: string, status: CampaignStatus): Promise<void> {
    await this.apiRequest(`/adCampaigns/${externalId}`, {}, 'PATCH', {
      status: this.mapStatus(status),
    });
  }

  async getCampaign(externalId: string): Promise<Campaign> {
    const data = await this.apiRequest(`/adCampaigns/${externalId}`, {
      fields: 'name,status,type,objectiveType,dailyBudget,runSchedule,createdAt',
    });

    return this.mapLinkedInCampaignToInternal(data);
  }

  async listCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    const config = this.requireConfig();
    const params: Record<string, string> = {
      'q': 'search',
      'search.account.values[0]': `urn:li:sponsoredAccount:${config.adAccountId}`,
      'count': '100',
    };

    if (filters?.status?.length) {
      filters.status.forEach((s, i) => {
        params[`search.status.values[${i}]`] = this.mapStatus(s);
      });
    }

    const result = await this.apiRequest('/adCampaigns', params);
    return (result.elements || []).map((c: Record<string, unknown>) =>
      this.mapLinkedInCampaignToInternal(c),
    );
  }

  async deleteCampaign(externalId: string): Promise<void> {
    await this.setCampaignStatus(externalId, 'completed');
  }

  // ---------------------------------------------------------------------------
  // Creatives
  // ---------------------------------------------------------------------------

  async createCreative(campaignId: string, creative: CreativeVariant): Promise<string> {
    const config = this.requireConfig();

    // Create ad creative (Sponsored Content)
    const result = await this.apiRequest('/adCreatives', {}, 'POST', {
      campaign: `urn:li:sponsoredCampaign:${campaignId}`,
      reference: undefined, // Will be set after creating the share
      status: 'PAUSED',
      type: 'SPONSORED_STATUS_UPDATE',
      variables: {
        data: {
          'com.linkedin.ads.SponsoredUpdateCreativeVariables': {
            activity: await this.createShare(config.organizationId, creative),
          },
        },
      },
    });

    return result.id || this.extractIdFromHeader(result);
  }

  async updateCreative(creativeId: string, _creative: Partial<CreativeVariant>): Promise<void> {
    // LinkedIn doesn't allow updating creative content, only status
    await this.apiRequest(`/adCreatives/${creativeId}`, {}, 'PATCH', {
      status: 'ACTIVE',
    });
  }

  async getCreativePerformance(creativeId: string, period: MetricsPeriod): Promise<Creative> {
    const data = await this.apiRequest('/adAnalytics', {
      'q': 'analytics',
      'pivot': 'CREATIVE',
      'dateRange.start.day': new Date(period.start).getDate().toString(),
      'dateRange.start.month': (new Date(period.start).getMonth() + 1).toString(),
      'dateRange.start.year': new Date(period.start).getFullYear().toString(),
      'dateRange.end.day': new Date(period.end).getDate().toString(),
      'dateRange.end.month': (new Date(period.end).getMonth() + 1).toString(),
      'dateRange.end.year': new Date(period.end).getFullYear().toString(),
      'timeGranularity': 'ALL',
      'creatives[0]': `urn:li:sponsoredCreative:${creativeId}`,
      'fields': 'impressions,clicks,costInLocalCurrency,externalWebsiteConversions,externalWebsitePostClickConversions',
    });

    const row = data.elements?.[0] || {};
    return {
      id: creativeId,
      name: '',
      type: 'text',
      status: 'active',
      platform: 'linkedin_ads',
      variants: [],
      metrics: {
        impressions: Number(row.impressions || 0),
        clicks: Number(row.clicks || 0),
        ctr: Number(row.impressions) > 0 ? Number(row.clicks) / Number(row.impressions) : 0,
        conversions: Number(row.externalWebsiteConversions || 0),
        conversionRate: Number(row.clicks) > 0 ? Number(row.externalWebsiteConversions || 0) / Number(row.clicks) : 0,
        cost: Number(row.costInLocalCurrency || 0),
        cpc: Number(row.clicks) > 0 ? Number(row.costInLocalCurrency || 0) / Number(row.clicks) : 0,
      },
    };
  }

  // ---------------------------------------------------------------------------
  // Metrics
  // ---------------------------------------------------------------------------

  async getCampaignMetrics(campaignId: string, period: MetricsPeriod): Promise<CampaignMetrics> {
    const data = await this.apiRequest('/adAnalytics', {
      'q': 'analytics',
      'pivot': 'CAMPAIGN',
      'dateRange.start.day': new Date(period.start).getDate().toString(),
      'dateRange.start.month': (new Date(period.start).getMonth() + 1).toString(),
      'dateRange.start.year': new Date(period.start).getFullYear().toString(),
      'dateRange.end.day': new Date(period.end).getDate().toString(),
      'dateRange.end.month': (new Date(period.end).getMonth() + 1).toString(),
      'dateRange.end.year': new Date(period.end).getFullYear().toString(),
      'timeGranularity': period.granularity === 'daily' ? 'DAILY' : 'MONTHLY',
      'campaigns[0]': `urn:li:sponsoredCampaign:${campaignId}`,
      'fields': 'impressions,clicks,costInLocalCurrency,externalWebsiteConversions,externalWebsitePostClickConversions,conversionValueInLocalCurrency',
    });

    return this.aggregateLinkedInMetrics(data.elements || [], period);
  }

  async getAccountMetrics(period: MetricsPeriod): Promise<CampaignMetrics> {
    const config = this.requireConfig();

    const data = await this.apiRequest('/adAnalytics', {
      'q': 'analytics',
      'pivot': 'ACCOUNT',
      'dateRange.start.day': new Date(period.start).getDate().toString(),
      'dateRange.start.month': (new Date(period.start).getMonth() + 1).toString(),
      'dateRange.start.year': new Date(period.start).getFullYear().toString(),
      'dateRange.end.day': new Date(period.end).getDate().toString(),
      'dateRange.end.month': (new Date(period.end).getMonth() + 1).toString(),
      'dateRange.end.year': new Date(period.end).getFullYear().toString(),
      'timeGranularity': 'ALL',
      'accounts[0]': `urn:li:sponsoredAccount:${config.adAccountId}`,
      'fields': 'impressions,clicks,costInLocalCurrency,externalWebsiteConversions,conversionValueInLocalCurrency',
    });

    return this.aggregateLinkedInMetrics(data.elements || [], period);
  }

  // ---------------------------------------------------------------------------
  // Audiences
  // ---------------------------------------------------------------------------

  async getAudiences(): Promise<AudienceTarget[]> {
    const config = this.requireConfig();

    const data = await this.apiRequest('/dmpSegments', {
      'q': 'account',
      'account': `urn:li:sponsoredAccount:${config.adAccountId}`,
    });

    return (data.elements || []).map((seg: Record<string, unknown>) => ({
      id: String(seg.id),
      name: String(seg.name),
      type: 'custom' as const,
      platform: 'linkedin_ads' as const,
      size: Number(seg.approximateSize || 0),
    }));
  }

  async createAudience(audience: CreateAudienceInput): Promise<string> {
    const config = this.requireConfig();

    const result = await this.apiRequest('/dmpSegments', {}, 'POST', {
      name: audience.name,
      account: `urn:li:sponsoredAccount:${config.adAccountId}`,
      type: audience.type === 'lookalike' ? 'LOOKALIKE' : 'USER_UPLOADED',
      ...(audience.type === 'lookalike' && audience.sourceData?.seedAudienceId
        ? {
          lookalikeSegmentOrigin: `urn:li:dmpSegment:${audience.sourceData.seedAudienceId}`,
          lookalikeCountries: ['PL'],
        }
        : {}),
    });

    return result.id || this.extractIdFromHeader(result);
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private requireConfig(): LinkedInAdsConfig {
    if (!this.config) throw new Error('LinkedIn Ads connector not configured. Call connect() first.');
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
    const url = new URL(`${LINKEDIN_BASE_URL}${endpoint}`);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'LinkedIn-Version': LINKEDIN_API_VERSION,
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `LinkedIn API error ${response.status}: ${JSON.stringify(error)}`,
      );
    }

    // POST responses may return empty body with Location header
    if (response.status === 201) {
      const location = response.headers.get('x-restli-id') || response.headers.get('location');
      return { id: location, _headers: { location } };
    }

    return response.json();
  }

  private async createShare(organizationId: string, creative: CreativeVariant): Promise<string> {
    const result = await this.apiRequest('/posts', {}, 'POST', {
      author: `urn:li:organization:${organizationId}`,
      commentary: creative.descriptions[0] || '',
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'NONE',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      content: {
        article: {
          source: creative.landingUrl,
          title: creative.headlines[0] || '',
          description: creative.descriptions[1] || creative.descriptions[0] || '',
          ...(creative.imageUrl ? { thumbnail: creative.imageUrl } : {}),
        },
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    });

    return result.id as string || '';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractIdFromHeader(result: any): string {
    const location = result?._headers?.location || '';
    const parts = location.split('/');
    return parts[parts.length - 1] || String(result.id || '');
  }

  private mapCampaignType(objective: string): string {
    const map: Record<string, string> = {
      awareness: 'SPONSORED_UPDATES',
      traffic: 'SPONSORED_UPDATES',
      engagement: 'SPONSORED_UPDATES',
      leads: 'SPONSORED_UPDATES',
      conversions: 'SPONSORED_UPDATES',
      sales: 'SPONSORED_UPDATES',
    };
    return map[objective] || 'SPONSORED_UPDATES';
  }

  private mapObjective(objective: string): string {
    const map: Record<string, string> = {
      awareness: 'BRAND_AWARENESS',
      traffic: 'WEBSITE_VISITS',
      engagement: 'ENGAGEMENT',
      leads: 'LEAD_GENERATION',
      conversions: 'WEBSITE_CONVERSIONS',
      sales: 'WEBSITE_CONVERSIONS',
    };
    return map[objective] || 'WEBSITE_VISITS';
  }

  private mapCostType(strategy: string): string {
    const map: Record<string, string> = {
      manual_cpc: 'CPC',
      target_cpa: 'CPC',
      target_roas: 'CPC',
      maximize_clicks: 'CPC',
      maximize_conversions: 'CPC',
    };
    return map[strategy] || 'CPC';
  }

  private mapStatus(status: CampaignStatus): string {
    const map: Record<CampaignStatus, string> = {
      draft: 'DRAFT',
      pending_review: 'PENDING_REVIEW',
      active: 'ACTIVE',
      paused: 'PAUSED',
      completed: 'ARCHIVED',
      failed: 'CANCELED',
    };
    return map[status];
  }

  private buildLinkedInTargeting(targeting: Campaign['targeting']): Record<string, unknown> {
    const include: Record<string, unknown> = { and: [] };
    const andConditions = include.and as Record<string, unknown>[];

    // Locations
    if (targeting.locations.length > 0) {
      andConditions.push({
        or: {
          'urn:li:adTargetingFacet:locations': targeting.locations.map((l) =>
            `urn:li:geo:${l.value}`,
          ),
        },
      });
    }

    // Languages
    if (targeting.languages.length > 0) {
      andConditions.push({
        or: {
          'urn:li:adTargetingFacet:interfaceLocales': targeting.languages.map((l) =>
            `urn:li:locale:${l}_${l.toUpperCase()}`,
          ),
        },
      });
    }

    // Interests / Industries
    if (targeting.interests.length > 0) {
      andConditions.push({
        or: {
          'urn:li:adTargetingFacet:industries': targeting.interests.map((i) =>
            `urn:li:industry:${i}`,
          ),
        },
      });
    }

    return { include, exclude: { or: {} } };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapLinkedInCampaignToInternal(data: any): Campaign {
    const dailyBudget = data.dailyBudget as { amount: string; currencyCode: string } | undefined;
    const schedule = data.runSchedule as { start: number; end?: number } | undefined;

    return {
      id: String(data.id),
      name: String(data.name),
      description: '',
      status: this.reverseMapStatus(String(data.status)),
      objective: this.reverseMapObjective(String(data.objectiveType)),
      platforms: [{
        platform: 'linkedin_ads',
        externalId: String(data.id),
        status: this.reverseMapStatus(String(data.status)),
        platformSpecific: { type: data.type, objectiveType: data.objectiveType },
      }],
      budget: {
        totalBudget: 0,
        dailyBudget: Number(dailyBudget?.amount || 0),
        currency: dailyBudget?.currencyCode || 'PLN',
        allocation: [{ platform: 'linkedin_ads', percentage: 100, dailyLimit: Number(dailyBudget?.amount || 0) }],
        bidStrategy: 'maximize_clicks',
      },
      schedule: {
        startDate: schedule?.start ? new Date(schedule.start).toISOString() : '',
        endDate: schedule?.end ? new Date(schedule.end).toISOString() : undefined,
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
      createdAt: String(data.createdAt || new Date().toISOString()),
      updatedAt: new Date().toISOString(),
      createdBy: 'mcc',
    };
  }

  private reverseMapStatus(status: string): CampaignStatus {
    const map: Record<string, CampaignStatus> = {
      ACTIVE: 'active',
      PAUSED: 'paused',
      ARCHIVED: 'completed',
      DRAFT: 'draft',
      PENDING_REVIEW: 'pending_review',
      CANCELED: 'failed',
    };
    return map[status] || 'draft';
  }

  private reverseMapObjective(objective: string): Campaign['objective'] {
    const map: Record<string, Campaign['objective']> = {
      BRAND_AWARENESS: 'awareness',
      WEBSITE_VISITS: 'traffic',
      ENGAGEMENT: 'engagement',
      LEAD_GENERATION: 'leads',
      WEBSITE_CONVERSIONS: 'conversions',
    };
    return map[objective] || 'traffic';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private aggregateLinkedInMetrics(elements: any[], period: MetricsPeriod): CampaignMetrics {
    let impressions = 0, clicks = 0, cost = 0, conversions = 0, revenue = 0;

    for (const row of elements) {
      impressions += Number(row.impressions || 0);
      clicks += Number(row.clicks || 0);
      cost += Number(row.costInLocalCurrency || 0);
      conversions += Number(row.externalWebsiteConversions || 0);
      revenue += Number(row.conversionValueInLocalCurrency || 0);
    }

    return {
      impressions,
      clicks,
      ctr: impressions > 0 ? clicks / impressions : 0,
      conversions,
      conversionRate: clicks > 0 ? conversions / clicks : 0,
      cost,
      cpc: clicks > 0 ? cost / clicks : 0,
      cpa: conversions > 0 ? cost / conversions : 0,
      roas: cost > 0 ? revenue / cost : 0,
      revenue,
      period,
    };
  }
}

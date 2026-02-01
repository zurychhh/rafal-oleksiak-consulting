// =============================================================================
// Platform Connector Interface
// Every ad platform connector must implement this interface
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
  KeywordTarget,
} from '../types';

export interface PlatformConnector {
  readonly platform: Platform;

  // Connection
  connect(credentials: PlatformCredentials): Promise<PlatformConnection>;
  disconnect(): Promise<void>;
  getStatus(): Promise<PlatformConnection>;
  refreshToken(): Promise<PlatformCredentials>;

  // Campaigns
  createCampaign(campaign: CreateCampaignInput): Promise<string>; // returns external ID
  updateCampaign(externalId: string, updates: UpdateCampaignInput): Promise<void>;
  setCampaignStatus(externalId: string, status: CampaignStatus): Promise<void>;
  getCampaign(externalId: string): Promise<Campaign>;
  listCampaigns(filters?: CampaignFilters): Promise<Campaign[]>;
  deleteCampaign(externalId: string): Promise<void>;

  // Creatives
  createCreative(campaignId: string, creative: CreativeVariant): Promise<string>;
  updateCreative(creativeId: string, creative: Partial<CreativeVariant>): Promise<void>;
  getCreativePerformance(creativeId: string, period: MetricsPeriod): Promise<Creative>;

  // Metrics
  getCampaignMetrics(campaignId: string, period: MetricsPeriod): Promise<CampaignMetrics>;
  getAccountMetrics(period: MetricsPeriod): Promise<CampaignMetrics>;

  // Audiences
  getAudiences(): Promise<AudienceTarget[]>;
  createAudience(audience: CreateAudienceInput): Promise<string>;

  // Keywords (search platforms only)
  getKeywordSuggestions?(seed: string, language: string): Promise<KeywordTarget[]>;
  getKeywordMetrics?(keywords: string[]): Promise<KeywordMetricsResult[]>;
}

// -----------------------------------------------------------------------------
// Input Types
// -----------------------------------------------------------------------------

export interface CreateCampaignInput {
  name: string;
  objective: Campaign['objective'];
  budget: {
    daily: number;
    total?: number;
    currency: string;
  };
  bidStrategy: Campaign['budget']['bidStrategy'];
  targeting: Campaign['targeting'];
  schedule: Campaign['schedule'];
  creatives: CreativeVariant[];
  platformSpecific?: Record<string, unknown>;
}

export interface UpdateCampaignInput {
  name?: string;
  budget?: {
    daily?: number;
    total?: number;
  };
  bidStrategy?: Campaign['budget']['bidStrategy'];
  targeting?: Partial<Campaign['targeting']>;
  schedule?: Partial<Campaign['schedule']>;
  platformSpecific?: Record<string, unknown>;
}

export interface CampaignFilters {
  status?: CampaignStatus[];
  objective?: Campaign['objective'][];
  dateRange?: { start: string; end: string };
  search?: string;
}

export interface CreateAudienceInput {
  name: string;
  type: AudienceTarget['type'];
  sourceData?: {
    emails?: string[];
    websiteUrl?: string;
    seedAudienceId?: string;
    lookalikePercentage?: number;
  };
}

export interface KeywordMetricsResult {
  keyword: string;
  avgMonthlySearches: number;
  competition: 'low' | 'medium' | 'high';
  suggestedBid: number;
  cpc: { min: number; max: number };
}

// -----------------------------------------------------------------------------
// Platform-Specific Config Types
// -----------------------------------------------------------------------------

export interface GoogleAdsConfig {
  customerId: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  loginCustomerId?: string; // for MCC accounts
}

export interface MetaAdsConfig {
  accessToken: string;
  adAccountId: string;
  appId: string;
  appSecret: string;
  pageId?: string;
  pixelId?: string;
}

export interface LinkedInAdsConfig {
  accessToken: string;
  adAccountId: string;
  organizationId: string;
}

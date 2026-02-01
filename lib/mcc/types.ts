// =============================================================================
// Marketing Command Center (MCC) - Core Types
// =============================================================================

// -----------------------------------------------------------------------------
// Platform & Authentication
// -----------------------------------------------------------------------------

export type Platform = 'google_ads' | 'meta_ads' | 'linkedin_ads';

export type PlatformStatus = 'connected' | 'disconnected' | 'error' | 'rate_limited';

export interface PlatformCredentials {
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  accountId: string;
  metadata?: Record<string, string>;
}

export interface PlatformConnection {
  platform: Platform;
  status: PlatformStatus;
  accountId: string;
  accountName: string;
  lastSync: string;
  error?: string;
}

// -----------------------------------------------------------------------------
// Campaign Management
// -----------------------------------------------------------------------------

export type CampaignStatus = 'draft' | 'pending_review' | 'active' | 'paused' | 'completed' | 'failed';
export type CampaignObjective = 'awareness' | 'traffic' | 'engagement' | 'leads' | 'conversions' | 'sales';
export type BidStrategy = 'manual_cpc' | 'target_cpa' | 'target_roas' | 'maximize_clicks' | 'maximize_conversions';

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  platforms: PlatformCampaign[];
  budget: BudgetConfig;
  schedule: CampaignSchedule;
  targeting: TargetingConfig;
  creatives: Creative[];
  metrics: CampaignMetrics;
  optimizationRules: OptimizationRule[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PlatformCampaign {
  platform: Platform;
  externalId?: string;
  status: CampaignStatus;
  platformSpecific: Record<string, unknown>;
}

export interface BudgetConfig {
  totalBudget: number;
  dailyBudget: number;
  currency: string;
  allocation: PlatformBudgetAllocation[];
  bidStrategy: BidStrategy;
  targetCpa?: number;
  targetRoas?: number;
}

export interface PlatformBudgetAllocation {
  platform: Platform;
  percentage: number;
  dailyLimit: number;
}

export interface CampaignSchedule {
  startDate: string;
  endDate?: string;
  dayParting?: DayPartingRule[];
  timezone: string;
}

export interface DayPartingRule {
  days: number[]; // 0=Sunday, 6=Saturday
  startHour: number;
  endHour: number;
  bidModifier: number; // 1.0 = no change, 1.5 = +50%
}

// -----------------------------------------------------------------------------
// Targeting
// -----------------------------------------------------------------------------

export interface TargetingConfig {
  locations: GeoTarget[];
  languages: string[];
  demographics: DemographicTarget;
  interests: string[];
  keywords: KeywordTarget[];
  audiences: AudienceTarget[];
  exclusions: ExclusionTarget;
  devices: DeviceTarget;
}

export interface GeoTarget {
  type: 'country' | 'region' | 'city' | 'radius';
  value: string;
  radius?: number;
  radiusUnit?: 'km' | 'miles';
  bidModifier?: number;
}

export interface DemographicTarget {
  ageRanges: string[];
  genders: ('male' | 'female' | 'all')[];
  incomeRanges?: string[];
  parentalStatus?: string[];
}

export interface KeywordTarget {
  keyword: string;
  matchType: 'exact' | 'phrase' | 'broad';
  bidModifier?: number;
  isNegative?: boolean;
}

export interface AudienceTarget {
  id: string;
  name: string;
  type: 'custom' | 'lookalike' | 'remarketing' | 'interest' | 'in_market';
  platform: Platform;
  size?: number;
}

export interface ExclusionTarget {
  keywords: KeywordTarget[];
  audiences: string[];
  placements: string[];
  locations: string[];
}

export interface DeviceTarget {
  desktop: boolean;
  mobile: boolean;
  tablet: boolean;
  bidModifiers?: {
    desktop?: number;
    mobile?: number;
    tablet?: number;
  };
}

// -----------------------------------------------------------------------------
// Creatives & Ad Copy
// -----------------------------------------------------------------------------

export type CreativeType = 'text' | 'image' | 'video' | 'carousel' | 'responsive';
export type CreativeStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'active';

export interface Creative {
  id: string;
  name: string;
  type: CreativeType;
  status: CreativeStatus;
  variants: CreativeVariant[];
  platform: Platform;
  metrics?: CreativeMetrics;
  generatedBy?: 'human' | 'ai';
  aiPrompt?: string;
}

export interface CreativeVariant {
  id: string;
  headlines: string[];
  descriptions: string[];
  callToAction?: string;
  imageUrl?: string;
  videoUrl?: string;
  landingUrl: string;
  displayUrl?: string;
  sitelinks?: Sitelink[];
}

export interface Sitelink {
  title: string;
  url: string;
  description1?: string;
  description2?: string;
}

export interface CreativeMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  qualityScore?: number;
}

// -----------------------------------------------------------------------------
// Metrics & Analytics
// -----------------------------------------------------------------------------

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  cpa: number;
  roas: number;
  revenue: number;
  reach?: number;
  frequency?: number;
  qualityScore?: number;
  period: MetricsPeriod;
}

export interface MetricsPeriod {
  start: string;
  end: string;
  granularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface MetricsTimeSeries {
  metric: string;
  dataPoints: { date: string; value: number }[];
}

export interface CrossPlatformMetrics {
  totalSpend: number;
  totalConversions: number;
  totalRevenue: number;
  blendedCpa: number;
  blendedRoas: number;
  platformBreakdown: {
    platform: Platform;
    metrics: CampaignMetrics;
    share: number; // percentage of total spend
  }[];
  topCampaigns: {
    campaign: string;
    platform: Platform;
    roas: number;
    conversions: number;
  }[];
  period: MetricsPeriod;
}

// -----------------------------------------------------------------------------
// Optimization
// -----------------------------------------------------------------------------

export type OptimizationAction =
  | 'increase_budget'
  | 'decrease_budget'
  | 'pause_campaign'
  | 'resume_campaign'
  | 'adjust_bids'
  | 'reallocate_budget'
  | 'pause_underperforming_creative'
  | 'scale_top_creative'
  | 'expand_audience'
  | 'narrow_audience'
  | 'add_negative_keywords'
  | 'change_bid_strategy';

export interface OptimizationRule {
  id: string;
  name: string;
  enabled: boolean;
  condition: OptimizationCondition;
  action: OptimizationAction;
  actionParams: Record<string, unknown>;
  cooldownHours: number;
  lastTriggered?: string;
}

export interface OptimizationCondition {
  metric: keyof CampaignMetrics;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'between';
  value: number;
  valueEnd?: number; // for 'between'
  period: 'last_24h' | 'last_7d' | 'last_30d';
}

export interface OptimizationRecommendation {
  id: string;
  campaignId: string;
  platform: Platform;
  type: OptimizationAction;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: string;
  confidence: number; // 0-1
  autoApplicable: boolean;
  createdAt: string;
  appliedAt?: string;
}

// -----------------------------------------------------------------------------
// Competitor Intelligence
// -----------------------------------------------------------------------------

export interface Competitor {
  id: string;
  name: string;
  domain: string;
  platforms: Platform[];
  trackingEnabled: boolean;
  lastAnalyzed?: string;
}

export interface CompetitorInsight {
  competitorId: string;
  competitorName: string;
  platform: Platform;
  analyzedAt: string;
  adCopy: CompetitorAd[];
  estimatedSpend?: { min: number; max: number; currency: string };
  topKeywords: string[];
  landingPages: string[];
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export interface CompetitorAd {
  headline: string;
  description: string;
  displayUrl: string;
  landingUrl?: string;
  type: CreativeType;
  firstSeen: string;
  lastSeen: string;
  estimatedImpressions?: number;
}

export interface CompetitorAlert {
  id: string;
  competitorId: string;
  type: 'new_campaign' | 'budget_change' | 'new_creative' | 'positioning_shift' | 'new_keyword';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  data: Record<string, unknown>;
  createdAt: string;
  acknowledged: boolean;
}

// -----------------------------------------------------------------------------
// AI Agent Actions
// -----------------------------------------------------------------------------

export interface AgentAction {
  id: string;
  type: 'campaign_create' | 'campaign_optimize' | 'creative_generate' | 'competitor_analyze' | 'report_generate' | 'alert_respond';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'requires_approval';
  description: string;
  reasoning: string;
  params: Record<string, unknown>;
  result?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
  approvedBy?: string;
}

export interface AgentDecision {
  id: string;
  context: string;
  options: {
    label: string;
    description: string;
    expectedOutcome: string;
    risk: 'low' | 'medium' | 'high';
  }[];
  recommendation: number; // index of recommended option
  reasoning: string;
  requiresApproval: boolean;
  approvedAt?: string;
}

// -----------------------------------------------------------------------------
// Copy Generation
// -----------------------------------------------------------------------------

export interface CopyGenerationRequest {
  objective: CampaignObjective;
  platform: Platform;
  product: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'urgent' | 'inspirational' | 'educational';
  language: string;
  constraints: {
    maxHeadlineLength: number;
    maxDescriptionLength: number;
    maxHeadlines: number;
    maxDescriptions: number;
  };
  competitorContext?: string;
  brandGuidelines?: string;
  existingCopy?: string[];
  keywords?: string[];
}

export interface CopyGenerationResult {
  variants: {
    headlines: string[];
    descriptions: string[];
    callToAction: string;
    reasoning: string;
    estimatedQualityScore: number;
  }[];
  competitorDifferentiation: string;
  abTestSuggestion: string;
}

// -----------------------------------------------------------------------------
// Dashboard & UI
// -----------------------------------------------------------------------------

export interface MCCDashboardData {
  connections: PlatformConnection[];
  activeCampaigns: number;
  totalSpendToday: number;
  totalConversionsToday: number;
  alerts: CompetitorAlert[];
  recommendations: OptimizationRecommendation[];
  recentActions: AgentAction[];
  performanceTrend: MetricsTimeSeries[];
  topPerformers: {
    campaign: string;
    platform: Platform;
    metric: string;
    value: number;
  }[];
}

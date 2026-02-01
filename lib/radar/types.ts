// RADAR - AI Competitor Intelligence
// Type definitions

export interface RadarRequest {
  yourUrl: string;
  competitorUrls: string[]; // 1-5 competitor URLs
  email: string;
  fullName?: string;
  company?: string;
}

export interface CompetitorSnapshot {
  url: string;
  scrapedAt: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  navigation: string[];
  valueProposition: string;
  keyPhrases: string[];
  productCount: number;
  hasPricing: boolean;
  hasBlog: boolean;
  hasSocialProof: boolean;
  techStack: string[];
  contentLength: number;
}

export interface CompetitorAnalysis {
  url: string;
  snapshot: CompetitorSnapshot;
  aiInsights: {
    positioning: string;
    strengths: string[];
    weaknesses: string[];
    uniqueAngles: string[];
    threatLevel: 'low' | 'medium' | 'high';
    threatReason: string;
  };
}

export interface RadarReport {
  yourUrl: string;
  yourSnapshot: CompetitorSnapshot;
  competitors: CompetitorAnalysis[];
  strategicInsights: {
    marketGaps: string[];
    yourAdvantages: string[];
    yourVulnerabilities: string[];
    actionItems: ActionItem[];
    overallCompetitivePosition: 'leading' | 'competitive' | 'catching_up' | 'behind';
    positionReason: string;
  };
  executionTime: number;
  analyzedAt: string;
}

export interface ActionItem {
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedImpact: string;
}

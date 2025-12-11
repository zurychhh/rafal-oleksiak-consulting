/**
 * TypeScript types for FIND (SEO) Section
 */

export interface CalculationStep {
  step: number;
  description: string;
  value?: string;
}

export interface SEOIssue {
  issue: string;
  impact: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  effort: 'Low' | 'Medium' | 'High';
}

export interface SEOOpportunity {
  opportunity: string;
  estimatedTraffic: string;
  estimatedRevenue: string;
  timeframe: string;
}

export interface KeywordOpportunity {
  keyword: string;
  currentPosition: number | string;
  targetPosition: number;
  monthlySearches: number;
  difficulty: 'Low' | 'Medium' | 'High';
  estimatedTraffic: string;
}

export interface ContentGap {
  topic: string;
  searchIntent: string;
  competition: string;
  opportunity: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LinkOpportunity {
  type: string;
  source: string;
  effort: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface FINDSectionProps {
  categoryName: string;
  score: number;
  industryBenchmark: number;

  // Page 1: Overview
  overview: {
    currentSituation: string;
    mainProblems: string[];
    opportunitySize: {
      additionalTrafficPerMonth: number;
      additionalRevenuePerYear: number;
      calculationSteps: CalculationStep[];
      source: string;
    };
  };

  // Page 2: Technical + On-Page SEO
  technicalSEO: {
    criticalIssues: SEOIssue[];
    onPageIssues: SEOIssue[];
    quickWins: string[];
    roi: string;
  };

  // Page 3: Content Strategy
  contentStrategy: {
    currentState: string;
    keywordOpportunities: KeywordOpportunity[];
    contentGaps: ContentGap[];
    contentPlan: string[];
    roi: string;
  };

  // Page 4: Link Building + Local SEO
  linkBuilding: {
    currentBacklinks: number;
    targetBacklinks: number;
    linkOpportunities: LinkOpportunity[];
    localSEO?: {
      gmb: string;
      citations: string;
      reviews: string;
    };
    roi: string;
  };
}

/**
 * TypeScript types for Extended CRM Section (18 pages)
 */

export interface CalculationStep {
  step: number;
  description: string;
  value?: string;
}

export interface Solution {
  title: string;
  components?: string[];
  implementation?: string[];
  timeToImplement: string;
  cost: string;
  roi: string;
  breakEven?: string;
}

export interface EmailTemplate {
  day: number;
  subject: string;
  preview?: string;
  goal: string;
  cta?: string;
}

export interface EmailSequence {
  name: string;
  description: string;
  emails: EmailTemplate[];
  expectedImpact: string;
  avgOpenRate?: string;
  avgClickRate?: string;
}

export interface ScoringSignal {
  signal: string;
  points: number;
  rationale?: string;
  example?: string;
}

export interface ScoringTier {
  tier: string;
  minScore: number;
  action: string;
  expectedConversion: number;
  slaTarget?: string;
}

export interface PipelineStage {
  stage: string;
  goalDuration: string;
  automation: string[];
  kpi: string;
  commonBottlenecks?: string[];
}

export interface CRMTool {
  tool: string;
  cost: string;
  reason: string;
  pros?: string[];
  cons?: string[];
}

export interface AutomationStep {
  stepNumber: number;
  description: string;
  timing?: string;
  conditional?: string;
  action: string;
  tool?: string;
}

export interface FitToMarketScenario {
  // Detected problem from audit
  detectedProblem: {
    category: 'conversion' | 'cart' | 'trial' | 'webinar' | 'content' | 'lead-quality';
    metric: string;
    currentValue: string;
    benchmarkValue: string;
    gap: string;
  };

  // Proposed automation scenario
  scenario: {
    title: string;
    description: string;
    applicableTo: string[];
    complexity: 'Low' | 'Medium' | 'High';
  };

  // Automation workflow
  workflow: {
    trigger: string;
    steps: AutomationStep[];
    tools: string[];
    totalDuration?: string;
  };

  // Expected impact
  impact: {
    recoveryRate: string;
    calculationSteps: CalculationStep[];
    roi: string;
    timeToImplement: string;
    cost: string;
  };

  // Implementation templates
  templates?: {
    emails?: EmailTemplate[];
    sms?: string[];
    webhooks?: string[];
  };
}

export interface DataFlowStep {
  trigger: string;
  actions: string[];
  time: string;
  errorHandling?: string;
}

export interface AutomationWorkflow {
  name: string;
  trigger: string;
  actions: string[];
  timeToImplement: string;
  roi: string;
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Metric {
  metric: string;
  target: string;
  current: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface DashboardSection {
  section: string;
  widgets: string[];
  updateFrequency?: string;
}

export interface WeekTask {
  task: string;
  owner: string;
  time: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dependencies?: string[];
}

export interface WeeklyPlan {
  week: string;
  focus: string;
  hours: string;
  tasks: WeekTask[];
  expectedImpact: string;
  quickWins?: string[];
}

export interface IntegrationGuide {
  tool: string;
  setupSteps: string[];
  apiKeys?: string[];
  webhookUrls?: string[];
  testingChecklist: string[];
}

// Main props interface for 18-page CRM section
export interface EngageCRMExtendedV2Props {
  categoryName: string;
  score: number;
  industryBenchmark: number;

  // Pages 1-2: Overview & Response Time
  crmOverview: {
    currentCRMStatus: 'none' | 'spreadsheet' | 'basic-crm' | 'advanced-crm';
    currentTools: string[];
    automationLevel: number;
    leadResponseTime: string;
    followUpRate: number;
    revenueLossBreakdown: {
      fromSlowResponse: number;
      fromNoFollowUp: number;
      fromPoorSegmentation: number;
      fromPipelineLeaks: number;
      total: number;
    };
  };

  leadResponseAnalysis: {
    currentAverageResponseTime: string;
    benchmarkResponseTime: string;
    conversionImpact: {
      current: number;
      atBenchmark: number;
      lostConversions: number;
    };
    calculationSteps: CalculationStep[];
    solution: Solution;
  };

  // Page 3: Response Implementation Guide
  responseImplementation: {
    zapierSetup: {
      steps: string[];
      webhookPayload: string;
      testingChecklist: string[];
    };
    alternativeTools: CRMTool[];
    slackIntegration: string[];
  };

  // Pages 4-6: Email Sequences (detailed)
  emailSequences: {
    welcome: EmailSequence;
    nurture: EmailSequence;
    reengagement: EmailSequence;
    abTestingStrategies: string[];
    deliverabilityTips: string[];
  };

  // Pages 7-9: Lead Scoring (deep dive)
  leadScoring: {
    behavioralSignals: ScoringSignal[];
    demographicSignals: ScoringSignal[];
    scoringTiers: ScoringTier[];
    implementationGuides: {
      hubspot: IntegrationGuide;
      pipedrive: IntegrationGuide;
    };
    testingFramework: string[];
  };

  // Pages 10-12: Pipeline Stages (detailed)
  pipelineStages: {
    stages: PipelineStage[];
    automationByStage: {
      [key: string]: {
        automation: string[];
        templates: string[];
        successMetrics: string[];
      };
    };
  };

  // Pages 13-15: FIT-TO-MARKET Scenarios (KEY!)
  fitToMarketScenarios: FitToMarketScenario[];

  // Pages 16-17: Integration Deep Dive
  integrationDeepDive: {
    techStack: {
      websiteForm: string;
      crm: string;
      emailAutomation: string;
      automation: string;
      analytics: string;
      communication: string;
    };
    dataFlowDiagrams: DataFlowStep[];
    keyWorkflows: AutomationWorkflow[];
    errorHandling: string[];
    gdprCompliance: string[];
  };

  // Page 18: Reporting & Roadmap
  reportingAndRoadmap: {
    dashboardSections: DashboardSection[];
    keyMetrics: {
      leadGeneration: Metric[];
      leadResponse: Metric[];
      pipelineHealth: Metric[];
      emailPerformance: Metric[];
    };
    weeklyPlan: WeeklyPlan[];
    totalInvestment: {
      time: string;
      cost: string;
      roi: string;
      breakEven: string;
    };
  };
}

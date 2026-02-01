// =============================================================================
// Marketing Command Center (MCC) - Main Entry Point
// =============================================================================

// Core types
export type * from './types';

// Platform connectors
export { platformRegistry } from './platforms';
export type { PlatformConnector } from './platforms';

// Campaign management
export { campaignManager } from './campaign/manager';
export { campaignOptimizer } from './campaign/optimizer';

// Creative engine
export { copyGenerator } from './creative/copy-generator';

// Competitive intelligence
export { competitorMonitor } from './intelligence/competitor-monitor';

// Analytics
export { analyticsAggregator } from './analytics/aggregator';

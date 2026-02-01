// =============================================================================
// Platform Registry - Central connector management
// =============================================================================

import type { Platform, PlatformConnection, PlatformCredentials } from '../types';
import type { PlatformConnector } from './types';
import { GoogleAdsConnector } from './google-ads';
import { MetaAdsConnector } from './meta-ads';
import { LinkedInAdsConnector } from './linkedin-ads';

class PlatformRegistry {
  private connectors: Map<Platform, PlatformConnector> = new Map();

  constructor() {
    this.connectors.set('google_ads', new GoogleAdsConnector());
    this.connectors.set('meta_ads', new MetaAdsConnector());
    this.connectors.set('linkedin_ads', new LinkedInAdsConnector());
  }

  getConnector(platform: Platform): PlatformConnector {
    const connector = this.connectors.get(platform);
    if (!connector) throw new Error(`Unknown platform: ${platform}`);
    return connector;
  }

  getAllConnectors(): PlatformConnector[] {
    return Array.from(this.connectors.values());
  }

  async connectPlatform(credentials: PlatformCredentials): Promise<PlatformConnection> {
    const connector = this.getConnector(credentials.platform);
    return connector.connect(credentials);
  }

  async disconnectPlatform(platform: Platform): Promise<void> {
    const connector = this.getConnector(platform);
    await connector.disconnect();
  }

  async getAllStatuses(): Promise<PlatformConnection[]> {
    const results = await Promise.allSettled(
      this.getAllConnectors().map((c) => c.getStatus()),
    );

    return results.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      const platforms: Platform[] = ['google_ads', 'meta_ads', 'linkedin_ads'];
      return {
        platform: platforms[i],
        status: 'error' as const,
        accountId: '',
        accountName: '',
        lastSync: new Date().toISOString(),
        error: r.reason?.message || 'Connection check failed',
      };
    });
  }
}

// Singleton instance
export const platformRegistry = new PlatformRegistry();

export { GoogleAdsConnector } from './google-ads';
export { MetaAdsConnector } from './meta-ads';
export { LinkedInAdsConnector } from './linkedin-ads';
export type { PlatformConnector } from './types';

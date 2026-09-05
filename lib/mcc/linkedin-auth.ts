// LinkedIn OAuth2 - Token Management Helper
// Handles token reading, refreshing, and provides helpers for API calls

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
  scope: string;
  token_type: string;
}

interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope: string;
}

const TOKEN_FILE_PATH = join(process.cwd(), '.linkedin-token.json');

// In-memory cache to avoid reading file on every request
let tokenCache: TokenData | null = null;
let lastReadTime = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Reads token data from file with caching
 */
async function readTokenData(): Promise<TokenData> {
  const now = Date.now();

  // Return cached data if available and fresh
  if (tokenCache && (now - lastReadTime) < CACHE_TTL) {
    return tokenCache;
  }

  try {
    const fileContent = await readFile(TOKEN_FILE_PATH, 'utf-8');
    const data: TokenData = JSON.parse(fileContent);

    // Update cache
    tokenCache = data;
    lastReadTime = now;

    return data;
  } catch {
    throw new Error('LinkedIn token file not found. Please authenticate at /api/mcc/linkedin/auth');
  }
}

/**
 * Saves token data to file and updates cache
 */
async function saveTokenData(data: TokenData): Promise<void> {
  await writeFile(TOKEN_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

  // Update cache
  tokenCache = data;
  lastReadTime = Date.now();
}

/**
 * Checks if the access token is expired or about to expire (within 5 minutes)
 */
function isTokenExpired(expiresAt: string): boolean {
  const expiryTime = new Date(expiresAt).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  return expiryTime <= (now + fiveMinutes);
}

/**
 * Refreshes the access token using the refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<TokenData> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing LinkedIn OAuth credentials in environment variables');
  }

  console.log('[LinkedIn Auth] Refreshing access token...');

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('[LinkedIn Auth] Token refresh failed:', errorData);
    throw new Error('Failed to refresh LinkedIn access token. Please re-authenticate at /api/mcc/linkedin/auth');
  }

  const tokenResponse: TokenRefreshResponse = await response.json();

  // Calculate new expiration time
  const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString();

  // Create updated token data
  const newTokenData: TokenData = {
    access_token: tokenResponse.access_token,
    refresh_token: tokenResponse.refresh_token || refreshToken,
    expires_at: expiresAt,
    scope: tokenResponse.scope,
    token_type: 'Bearer',
  };

  // Save updated tokens
  await saveTokenData(newTokenData);

  console.log('[LinkedIn Auth] Access token refreshed successfully');
  console.log('[LinkedIn Auth] New expiration:', expiresAt);

  return newTokenData;
}

/**
 * Gets a valid access token, refreshing if necessary
 */
export async function getAccessToken(): Promise<string> {
  const tokenData = await readTokenData();

  if (isTokenExpired(tokenData.expires_at)) {
    if (!tokenData.refresh_token) {
      throw new Error('LinkedIn access token expired and no refresh token available. Please re-authenticate.');
    }

    const newTokenData = await refreshAccessToken(tokenData.refresh_token);
    return newTokenData.access_token;
  }

  return tokenData.access_token;
}

/**
 * Gets authentication headers for LinkedIn Marketing API requests
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const accessToken = await getAccessToken();

  return {
    'Authorization': `Bearer ${accessToken}`,
    'LinkedIn-Version': '202401',
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json',
  };
}

/**
 * Gets the ad account ID from environment
 */
export function getAdAccountId(): string {
  const adAccountId = process.env.LINKEDIN_AD_ACCOUNT_ID;

  if (!adAccountId) {
    throw new Error('Missing LINKEDIN_AD_ACCOUNT_ID environment variable');
  }

  return adAccountId;
}

/**
 * Gets the organization ID from environment
 */
export function getOrganizationId(): string {
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!orgId) {
    throw new Error('Missing LINKEDIN_ORGANIZATION_ID environment variable');
  }

  return orgId;
}

/**
 * Clears the token cache
 */
export function clearTokenCache(): void {
  tokenCache = null;
  lastReadTime = 0;
}

/**
 * Saves initial token data after OAuth callback
 */
export async function saveInitialTokens(data: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}): Promise<void> {
  const tokenData: TokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    scope: data.scope,
    token_type: 'Bearer',
  };

  await saveTokenData(tokenData);
}

/**
 * Checks if we have valid tokens stored
 */
export async function hasValidTokens(): Promise<boolean> {
  try {
    const tokenData = await readTokenData();
    return !!tokenData.access_token;
  } catch {
    return false;
  }
}

/**
 * Gets token info for status check
 */
export async function getTokenInfo(): Promise<{
  hasRefreshToken: boolean;
  expiresAt: string;
  isExpired: boolean;
  scope: string;
} | null> {
  try {
    const tokenData = await readTokenData();
    return {
      hasRefreshToken: !!tokenData.refresh_token,
      expiresAt: tokenData.expires_at,
      isExpired: isTokenExpired(tokenData.expires_at),
      scope: tokenData.scope,
    };
  } catch {
    return null;
  }
}

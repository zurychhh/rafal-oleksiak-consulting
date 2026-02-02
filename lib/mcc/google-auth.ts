// Google Ads OAuth2 - Token Management Helper
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
  scope: string;
  token_type: string;
}

const TOKEN_FILE_PATH = join(process.cwd(), '.google-ads-token.json');

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
  } catch (error) {
    throw new Error('Token file not found. Please authenticate at /api/mcc/auth');
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
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing OAuth credentials in environment variables');
  }

  console.log('[Google Auth] Refreshing access token...');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('[Google Auth] Token refresh failed:', errorData);
    throw new Error('Failed to refresh access token. Please re-authenticate at /api/mcc/auth');
  }

  const tokenResponse: TokenRefreshResponse = await response.json();

  // Calculate new expiration time
  const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString();

  // Read existing token data to preserve refresh_token
  const existingData = await readTokenData();

  // Create updated token data
  const newTokenData: TokenData = {
    access_token: tokenResponse.access_token,
    refresh_token: existingData.refresh_token || refreshToken,
    expires_at: expiresAt,
    scope: tokenResponse.scope,
    token_type: tokenResponse.token_type,
  };

  // Save updated tokens
  await saveTokenData(newTokenData);

  console.log('[Google Auth] Access token refreshed successfully');
  console.log('[Google Auth] New expiration:', expiresAt);

  return newTokenData;
}

/**
 * Gets a valid access token, refreshing if necessary
 * This is the main function you should use to get tokens for API calls
 *
 * @returns A valid access token
 * @throws Error if authentication is not set up or refresh fails
 */
export async function getAccessToken(): Promise<string> {
  // Read current token data
  const tokenData = await readTokenData();

  // Check if token is expired
  if (isTokenExpired(tokenData.expires_at)) {
    if (!tokenData.refresh_token) {
      throw new Error('Access token expired and no refresh token available. Please re-authenticate at /api/mcc/auth');
    }

    // Refresh the token
    const newTokenData = await refreshAccessToken(tokenData.refresh_token);
    return newTokenData.access_token;
  }

  // Token is still valid
  return tokenData.access_token;
}

/**
 * Gets authentication headers for Google Ads API requests
 * Includes access token, developer token, and customer IDs
 *
 * @param customerIdOverride Optional customer ID to use instead of default
 * @returns Headers object ready for fetch requests
 */
export async function getAuthHeaders(customerIdOverride?: string): Promise<Record<string, string>> {
  const accessToken = await getAccessToken();

  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const managerCustomerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID;
  const defaultCustomerId = process.env.GOOGLE_ADS_CUSTOMER_ID;

  if (!developerToken) {
    throw new Error('Missing GOOGLE_ADS_DEVELOPER_TOKEN environment variable');
  }

  if (!managerCustomerId) {
    throw new Error('Missing GOOGLE_ADS_MANAGER_CUSTOMER_ID environment variable');
  }

  // Use provided customer ID, or fall back to default
  const customerId = customerIdOverride || defaultCustomerId;

  if (!customerId) {
    throw new Error('No customer ID provided and GOOGLE_ADS_CUSTOMER_ID environment variable is not set');
  }

  // Google Ads API headers
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': developerToken,
    'login-customer-id': managerCustomerId.replace(/-/g, ''), // Remove dashes
    'Content-Type': 'application/json',
  };

  return headers;
}

/**
 * Gets the customer ID for API requests
 * Removes dashes and returns the numeric ID
 *
 * @param customerIdOverride Optional customer ID to use instead of default
 * @returns Customer ID without dashes
 */
export function getCustomerId(customerIdOverride?: string): string {
  const customerId = customerIdOverride || process.env.GOOGLE_ADS_CUSTOMER_ID;

  if (!customerId) {
    throw new Error('No customer ID provided and GOOGLE_ADS_CUSTOMER_ID environment variable is not set');
  }

  return customerId.replace(/-/g, '');
}

/**
 * Gets the manager customer ID (MCC)
 * Removes dashes and returns the numeric ID
 */
export function getManagerCustomerId(): string {
  const managerCustomerId = process.env.GOOGLE_ADS_MANAGER_CUSTOMER_ID;

  if (!managerCustomerId) {
    throw new Error('Missing GOOGLE_ADS_MANAGER_CUSTOMER_ID environment variable');
  }

  return managerCustomerId.replace(/-/g, '');
}

/**
 * Clears the token cache (useful for testing or forcing a token refresh)
 */
export function clearTokenCache(): void {
  tokenCache = null;
  lastReadTime = 0;
}

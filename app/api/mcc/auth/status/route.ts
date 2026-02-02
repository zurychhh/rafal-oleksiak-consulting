// Google Ads OAuth2 - Status Check Endpoint
// Returns authentication status and token information

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
  scope: string;
  token_type: string;
}

interface StatusResponse {
  authenticated: boolean;
  hasRefreshToken: boolean;
  expiresAt: string | null;
  isExpired: boolean;
  scope?: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const tokenFilePath = join(process.cwd(), '.google-ads-token.json');

    // Try to read token file
    let tokenData: TokenData;
    try {
      const fileContent = await readFile(tokenFilePath, 'utf-8');
      tokenData = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is invalid
      return NextResponse.json({
        authenticated: false,
        hasRefreshToken: false,
        expiresAt: null,
        isExpired: true,
        error: 'No token file found. Please authenticate at /api/mcc/auth',
      } as StatusResponse);
    }

    // Check if we have required fields
    if (!tokenData.access_token || !tokenData.expires_at) {
      return NextResponse.json({
        authenticated: false,
        hasRefreshToken: !!tokenData.refresh_token,
        expiresAt: null,
        isExpired: true,
        error: 'Invalid token data',
      } as StatusResponse);
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    const now = new Date();
    const isExpired = expiresAt <= now;

    // If we have a refresh token, we can always get a new access token
    const authenticated = !!tokenData.refresh_token || !isExpired;

    return NextResponse.json({
      authenticated,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresAt: tokenData.expires_at,
      isExpired,
      scope: tokenData.scope,
    } as StatusResponse);
  } catch (error) {
    console.error('[Google OAuth] Error checking status:', error);
    return NextResponse.json(
      {
        authenticated: false,
        hasRefreshToken: false,
        expiresAt: null,
        isExpired: true,
        error: 'Failed to check authentication status',
      } as StatusResponse,
      { status: 500 }
    );
  }
}

// LinkedIn OAuth2 - Status check endpoint
// Returns current authentication status

import { NextResponse } from 'next/server';
import { hasValidTokens, getTokenInfo } from '@/lib/mcc/linkedin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authenticated = await hasValidTokens();
    const tokenInfo = await getTokenInfo();

    return NextResponse.json({
      authenticated,
      platform: 'linkedin_ads',
      ...(tokenInfo && {
        hasRefreshToken: tokenInfo.hasRefreshToken,
        expiresAt: tokenInfo.expiresAt,
        isExpired: tokenInfo.isExpired,
        scope: tokenInfo.scope,
      }),
      authUrl: '/api/mcc/linkedin/auth',
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      platform: 'linkedin_ads',
      error: error instanceof Error ? error.message : 'Failed to check authentication status',
      authUrl: '/api/mcc/linkedin/auth',
    });
  }
}

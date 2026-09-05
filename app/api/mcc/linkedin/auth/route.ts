// LinkedIn OAuth2 - Initiate authentication flow
// Redirects to LinkedIn consent screen

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// LinkedIn Marketing API scopes
const LINKEDIN_SCOPES = [
  'r_ads',              // Read ad accounts, campaigns
  'r_ads_reporting',    // Read analytics/reporting
  'w_ads',              // Create/manage campaigns
  'w_organization_social', // Post as organization
  'r_organization_social', // Read organization posts
  'r_basicprofile',     // Basic profile info
].join(' ');

export async function GET(request: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing LINKEDIN_CLIENT_ID environment variable' },
      { status: 500 }
    );
  }

  // Build callback URL
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/mcc/linkedin/auth/callback`;

  // Generate state for CSRF protection
  const state = randomBytes(32).toString('hex');

  // Build LinkedIn authorization URL
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', LINKEDIN_SCOPES);

  // Store state in cookie for verification
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('linkedin_oauth_state', state, {
    httpOnly: true,
    secure: !host.includes('localhost'),
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  return response;
}

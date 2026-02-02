// Google Ads OAuth2 - Initial Authorization Endpoint
// Redirects user to Google OAuth2 consent screen

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/api/mcc/auth/callback';

    if (!clientId) {
      return NextResponse.json(
        { error: 'Missing GOOGLE_OAUTH_CLIENT_ID environment variable' },
        { status: 500 }
      );
    }

    // Generate state parameter for CSRF protection
    const state = randomBytes(32).toString('hex');

    // Build Google OAuth2 authorization URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/adwords');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);

    console.log('[Google OAuth] Redirecting to consent screen');
    console.log('[Google OAuth] Redirect URI:', redirectUri);

    // Redirect to Google's consent screen
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('[Google OAuth] Error initiating auth:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}

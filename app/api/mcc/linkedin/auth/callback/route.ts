// LinkedIn OAuth2 - Callback handler
// Exchanges authorization code for access tokens

import { NextRequest, NextResponse } from 'next/server';
import { saveInitialTokens } from '@/lib/mcc/linkedin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface LinkedInTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle errors from LinkedIn
  if (error) {
    console.error('[LinkedIn OAuth] Authorization error:', error, errorDescription);
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head><title>LinkedIn Authentication Failed</title></head>
        <body style="font-family: system-ui; padding: 40px; background: #1a1a2e; color: white;">
          <h1 style="color: #ef4444;">❌ Authentication Failed</h1>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${errorDescription || 'Unknown error'}</p>
          <p style="margin-top: 20px;">
            <a href="/api/mcc/linkedin/auth" style="color: #0077b5;">Try again</a>
          </p>
        </body>
      </html>
      `,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Validate code
  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  // Verify state (CSRF protection)
  const storedState = request.cookies.get('linkedin_oauth_state')?.value;
  if (!storedState || storedState !== state) {
    console.error('[LinkedIn OAuth] State mismatch:', { stored: storedState, received: state });
    return NextResponse.json(
      { error: 'Invalid state parameter. Possible CSRF attack.' },
      { status: 400 }
    );
  }

  // Get credentials
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Missing LinkedIn OAuth credentials in environment' },
      { status: 500 }
    );
  }

  // Build redirect URI (must match exactly what was used in authorization)
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/mcc/linkedin/auth/callback`;

  try {
    // Exchange code for tokens
    console.log('[LinkedIn OAuth] Exchanging code for tokens...');

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[LinkedIn OAuth] Token exchange failed:', errorText);
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokens: LinkedInTokenResponse = await tokenResponse.json();

    console.log('[LinkedIn OAuth] Tokens received successfully');
    console.log('[LinkedIn OAuth] Scopes:', tokens.scope);
    console.log('[LinkedIn OAuth] Expires in:', tokens.expires_in, 'seconds');
    console.log('[LinkedIn OAuth] Has refresh token:', !!tokens.refresh_token);

    // Save tokens
    await saveInitialTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      scope: tokens.scope,
    });

    console.log('[LinkedIn OAuth] Tokens saved to .linkedin-token.json');

    // Clear state cookie and show success
    const response = new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>LinkedIn Authentication Successful</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              color: white;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0;
            }
            .card {
              background: rgba(255,255,255,0.05);
              border-radius: 16px;
              padding: 48px;
              max-width: 500px;
              text-align: center;
              border: 1px solid rgba(255,255,255,0.1);
            }
            h1 { color: #0077b5; margin-bottom: 16px; }
            .check { font-size: 64px; margin-bottom: 16px; }
            .info { background: rgba(0,119,181,0.2); padding: 16px; border-radius: 8px; margin: 24px 0; text-align: left; }
            .info p { margin: 8px 0; font-size: 14px; }
            code { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="check">✅</div>
            <h1>Authentication Successful!</h1>
            <p>LinkedIn Marketing API access has been granted.</p>

            <div class="info">
              <p><strong>Scopes:</strong> ${tokens.scope}</p>
              <p><strong>Token expires:</strong> ${new Date(Date.now() + tokens.expires_in * 1000).toLocaleString()}</p>
              <p><strong>Refresh token:</strong> ${tokens.refresh_token ? 'Yes (60 days)' : 'No'}</p>
            </div>

            <p style="color: #888; font-size: 14px;">
              Tokens saved to <code>.linkedin-token.json</code><br>
              You can now use the LinkedIn Marketing API.
            </p>
          </div>
        </body>
      </html>
      `,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );

    // Clear state cookie
    response.cookies.delete('linkedin_oauth_state');

    return response;

  } catch (error) {
    console.error('[LinkedIn OAuth] Error:', error);
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head><title>LinkedIn Authentication Error</title></head>
        <body style="font-family: system-ui; padding: 40px; background: #1a1a2e; color: white;">
          <h1 style="color: #ef4444;">❌ Authentication Error</h1>
          <p>${error instanceof Error ? error.message : 'Unknown error occurred'}</p>
          <p style="margin-top: 20px;">
            <a href="/api/mcc/linkedin/auth" style="color: #0077b5;">Try again</a>
          </p>
        </body>
      </html>
      `,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

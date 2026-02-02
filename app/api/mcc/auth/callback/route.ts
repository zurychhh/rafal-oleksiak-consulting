// Google Ads OAuth2 - Callback Endpoint
// Handles OAuth2 callback, exchanges code for tokens, and saves to local file

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  scope: string;
  token_type: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // Check for OAuth errors
    if (error) {
      console.error('[Google OAuth] Error from Google:', error);
      return NextResponse.json(
        { error: `Google OAuth error: ${error}` },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/api/mcc/auth/callback';

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Missing OAuth credentials in environment variables' },
        { status: 500 }
      );
    }

    console.log('[Google OAuth] Exchanging authorization code for tokens');

    // Exchange authorization code for access token and refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('[Google OAuth] Token exchange failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code for tokens' },
        { status: 500 }
      );
    }

    const tokens: TokenResponse = await tokenResponse.json();

    if (!tokens.refresh_token) {
      console.error('[Google OAuth] No refresh token received. User may need to revoke access and re-authenticate.');
      return NextResponse.json(
        { error: 'No refresh token received. Please revoke access at https://myaccount.google.com/permissions and try again.' },
        { status: 400 }
      );
    }

    // Calculate expiration timestamp
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

    // Prepare token data to save
    const tokenData: TokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      scope: tokens.scope,
      token_type: tokens.token_type,
    };

    // Save tokens to local file in project root
    const tokenFilePath = join(process.cwd(), '.google-ads-token.json');
    await writeFile(tokenFilePath, JSON.stringify(tokenData, null, 2), 'utf-8');

    console.log('[Google OAuth] Tokens saved successfully to .google-ads-token.json');
    console.log('[Google OAuth] Access token expires at:', expiresAt);

    // Return success page
    const successHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Google Ads OAuth - Success</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2e7d32;
      margin-top: 0;
    }
    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    .info {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 15px;
      margin: 20px 0;
    }
    .warning {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    .details {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">✅</div>
    <h1>Authentication Successful!</h1>

    <div class="info">
      <strong>Tokens saved successfully</strong>
      <p>Your Google Ads API tokens have been saved to <code>.google-ads-token.json</code></p>
    </div>

    <div class="warning">
      <strong>Important:</strong>
      <p>The <code>.google-ads-token.json</code> file contains sensitive credentials. Make sure it's included in <code>.gitignore</code> and never commit it to version control.</p>
    </div>

    <div class="details">
      <h3>Token Details:</h3>
      <ul>
        <li><strong>Expires at:</strong> ${expiresAt}</li>
        <li><strong>Scope:</strong> ${tokens.scope}</li>
        <li><strong>Has refresh token:</strong> Yes</li>
      </ul>

      <p>You can now close this window and use the Google Ads API in your application.</p>
      <p>Check authentication status at: <a href="/api/mcc/auth/status">/api/mcc/auth/status</a></p>
    </div>
  </div>
</body>
</html>
    `;

    return new NextResponse(successHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('[Google OAuth] Error in callback:', error);
    return NextResponse.json(
      { error: 'Failed to process OAuth callback' },
      { status: 500 }
    );
  }
}

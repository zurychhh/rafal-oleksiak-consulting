# Google Ads API OAuth2 Setup Guide

This guide explains how to set up and use the Google Ads API OAuth2 flow in this Next.js project.

## Overview

The OAuth2 flow consists of 4 main components:

1. **`/app/api/mcc/auth/route.ts`** - Initiates OAuth flow and redirects to Google consent screen
2. **`/app/api/mcc/auth/callback/route.ts`** - Handles callback, exchanges code for tokens, saves to file
3. **`/app/api/mcc/auth/status/route.ts`** - Checks authentication status
4. **`/lib/mcc/google-auth.ts`** - Helper module for token management and API requests

## Prerequisites

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Ads API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Ads API"
   - Click "Enable"

4. Create OAuth2 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "Google Ads API Client"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/mcc/auth/callback` (for local development)
     - `https://your-domain.com/api/mcc/auth/callback` (for production)
   - Click "Create"
   - Save the **Client ID** and **Client Secret**

### 2. Google Ads API Setup

1. Go to [Google Ads API Center](https://ads.google.com/aw/apicenter)
2. Apply for API access (this can take a few days to be approved)
3. Once approved, get your **Developer Token** from the API Center
4. Note your **Manager Account ID** (MCC) - format: `123-456-7890`
5. Note your **Customer Account ID** - format: `987-654-3210`

### 3. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Google OAuth2 Credentials
GOOGLE_OAUTH_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/mcc/auth/callback

# Google Ads API Credentials
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
GOOGLE_ADS_MANAGER_CUSTOMER_ID=123-456-7890
GOOGLE_ADS_CUSTOMER_ID=987-654-3210
```

**Important:** For production, update `GOOGLE_OAUTH_REDIRECT_URI` to your production domain.

## Authentication Flow

### Step 1: Initiate OAuth Flow

Visit: `http://localhost:3000/api/mcc/auth`

This will:
- Generate a CSRF state token
- Redirect you to Google's consent screen
- Request the `https://www.googleapis.com/auth/adwords` scope
- Use `access_type=offline` and `prompt=consent` to ensure you get a refresh token

### Step 2: Grant Consent

On Google's consent screen:
1. Select the Google account that has access to your Google Ads account
2. Review the permissions
3. Click "Allow"

### Step 3: Handle Callback

Google will redirect back to `/api/mcc/auth/callback` which will:
- Exchange the authorization code for an access token and refresh token
- Save the tokens to `.google-ads-token.json` in the project root
- Display a success page with token information

### Step 4: Verify Authentication

Check authentication status at: `http://localhost:3000/api/mcc/auth/status`

Response example:
```json
{
  "authenticated": true,
  "hasRefreshToken": true,
  "expiresAt": "2026-02-02T15:30:00.000Z",
  "isExpired": false,
  "scope": "https://www.googleapis.com/auth/adwords"
}
```

## Using the Auth Helper

### Basic Usage

```typescript
import { getAccessToken, getAuthHeaders, getCustomerId } from '@/lib/mcc/google-auth';

// Get a valid access token (auto-refreshes if expired)
const accessToken = await getAccessToken();

// Get ready-to-use headers for Google Ads API requests
const headers = await getAuthHeaders();

// Get the customer ID (without dashes)
const customerId = getCustomerId();
```

### Example: Fetching Campaigns

```typescript
import { getAuthHeaders, getCustomerId } from '@/lib/mcc/google-auth';

export async function getCampaigns() {
  const headers = await getAuthHeaders();
  const customerId = getCustomerId();

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
    LIMIT 10
  `;

  const response = await fetch(
    `https://googleads.googleapis.com/v18/customers/${customerId}/googleAds:searchStream`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    }
  );

  return await response.json();
}
```

### Example: Next.js API Route

```typescript
// app/api/mcc/campaigns/route.ts
import { NextResponse } from 'next/server';
import { getAuthHeaders, getCustomerId } from '@/lib/mcc/google-auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const headers = await getAuthHeaders();
    const customerId = getCustomerId();

    // Your GAQL query
    const query = `SELECT campaign.id, campaign.name FROM campaign LIMIT 10`;

    const response = await fetch(
      `https://googleads.googleapis.com/v18/customers/${customerId}/googleAds:searchStream`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### Working with Multiple Customer Accounts (MCC)

If you're managing multiple customer accounts:

```typescript
import { getAuthHeaders } from '@/lib/mcc/google-auth';

// Use a specific customer ID instead of the default
const customerId = '9876543210'; // Without dashes
const headers = await getAuthHeaders(customerId);

const response = await fetch(
  `https://googleads.googleapis.com/v18/customers/${customerId}/googleAds:searchStream`,
  {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  }
);
```

## Token Management

### Token File Structure

The `.google-ads-token.json` file contains:

```json
{
  "access_token": "ya29.a0...",
  "refresh_token": "1//0e...",
  "expires_at": "2026-02-02T15:30:00.000Z",
  "scope": "https://www.googleapis.com/auth/adwords",
  "token_type": "Bearer"
}
```

### Automatic Token Refresh

The `getAccessToken()` function automatically:
- Checks if the current access token is expired (or about to expire in 5 minutes)
- If expired, uses the refresh token to get a new access token
- Updates the `.google-ads-token.json` file with the new token
- Returns the valid access token

You never need to manually refresh tokens!

### Token Caching

Tokens are cached in memory for 5 seconds to avoid excessive file reads. The cache is automatically managed by the helper module.

## Troubleshooting

### "No refresh token received"

This can happen if:
1. You've already authorized the app before
2. Solution: Revoke access at https://myaccount.google.com/permissions and re-authenticate

### "Token file not found"

You need to complete the OAuth flow first:
1. Visit `/api/mcc/auth`
2. Complete the consent flow

### "Access token expired and no refresh token available"

Your refresh token is missing or invalid:
1. Delete `.google-ads-token.json`
2. Re-authenticate at `/api/mcc/auth`

### "Missing OAuth credentials in environment variables"

Make sure all required environment variables are set in `.env.local`:
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_MANAGER_CUSTOMER_ID`
- `GOOGLE_ADS_CUSTOMER_ID`

### API Request Errors

Common issues:
1. **Invalid customer ID format**: Customer IDs should be without dashes (e.g., `1234567890` not `123-456-7890`)
2. **Wrong customer ID**: Make sure you're using a customer ID your MCC has access to
3. **Invalid developer token**: Check that your developer token is approved and correct
4. **GAQL syntax errors**: Verify your Google Ads Query Language syntax

## Security Notes

1. **Never commit `.google-ads-token.json`**: It's already in `.gitignore`
2. **Keep credentials secure**: Never commit `.env.local` files
3. **Production setup**: Use environment variables in your hosting platform (Vercel, AWS, etc.)
4. **Token rotation**: Refresh tokens don't expire, but access tokens expire every hour (automatically handled)

## Google Ads API Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [GAQL (Google Ads Query Language) Reference](https://developers.google.com/google-ads/api/docs/query/overview)
- [API Fields and Metrics](https://developers.google.com/google-ads/api/fields/v18/overview)
- [OAuth2 for Google APIs](https://developers.google.com/identity/protocols/oauth2)

## Example Queries

### Get Campaign Performance

```sql
SELECT
  campaign.id,
  campaign.name,
  campaign.status,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions,
  metrics.ctr
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
ORDER BY metrics.impressions DESC
```

### Get Ad Group Performance

```sql
SELECT
  ad_group.id,
  ad_group.name,
  campaign.name,
  metrics.impressions,
  metrics.clicks,
  metrics.average_cpc
FROM ad_group
WHERE segments.date DURING LAST_7_DAYS
  AND ad_group.status = 'ENABLED'
```

### Get Keyword Performance

```sql
SELECT
  ad_group_criterion.keyword.text,
  ad_group_criterion.keyword.match_type,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM keyword_view
WHERE segments.date DURING LAST_30_DAYS
ORDER BY metrics.clicks DESC
LIMIT 50
```

## Files Reference

- `/app/api/mcc/auth/route.ts` - OAuth initiation endpoint
- `/app/api/mcc/auth/callback/route.ts` - OAuth callback handler
- `/app/api/mcc/auth/status/route.ts` - Authentication status checker
- `/lib/mcc/google-auth.ts` - Token management helper
- `/lib/mcc/google-auth-example.ts` - Usage examples
- `/.google-ads-token.json` - Token storage (git-ignored)

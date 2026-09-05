# LinkedIn Marketing API OAuth2 Setup Guide

This guide explains how to set up and use the LinkedIn Marketing API OAuth2 flow in this Next.js project.

## Overview

The OAuth2 flow consists of 4 main components:

1. **`/app/api/mcc/linkedin/auth/route.ts`** - Initiates OAuth flow and redirects to LinkedIn consent screen
2. **`/app/api/mcc/linkedin/auth/callback/route.ts`** - Handles callback, exchanges code for tokens, saves to file
3. **`/app/api/mcc/linkedin/auth/status/route.ts`** - Checks authentication status
4. **`/lib/mcc/linkedin-auth.ts`** - Helper module for token management and API requests

## Prerequisites

### 1. LinkedIn Developer Portal Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Click "Create app"
3. Fill in app details:
   - **App name**: "Oleksiak Consulting MCC" (or similar)
   - **LinkedIn Page**: Select your Company Page
   - **App logo**: Upload your logo
   - **Legal agreement**: Check the box
4. Click "Create app"

### 2. Configure OAuth2 Settings

After creating the app:

1. Go to the "Auth" tab
2. Under "OAuth 2.0 settings":
   - Add Authorized redirect URLs:
     - `http://localhost:3000/api/mcc/linkedin/auth/callback` (development)
     - `https://oleksiakconsulting.com/api/mcc/linkedin/auth/callback` (production)
3. Copy your **Client ID** and **Client Secret**

### 3. Request Marketing API Access

1. Go to the "Products" tab
2. Request access to these products:
   - **Marketing API** - Required for ad account management
   - **Advertising API** - Required for campaign creation/management
3. Wait for approval (usually 1-3 business days)

**Note**: Marketing API access requires:
- A Company Page associated with the app
- Valid use case description
- Compliance with LinkedIn's Marketing Developer Platform Terms

### 4. Get Account IDs

1. **Ad Account ID**:
   - Go to [Campaign Manager](https://www.linkedin.com/campaignmanager)
   - Click on your account
   - The ID is in the URL: `campaignmanager/accounts/[ID]`

2. **Organization ID**:
   - Go to your Company Page admin
   - The ID is in the URL: `company/[ID]/admin`

### 5. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# LinkedIn OAuth2 Credentials
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret

# LinkedIn Account IDs
LINKEDIN_AD_ACCOUNT_ID=123456789
LINKEDIN_ORGANIZATION_ID=987654321
```

## Authentication Flow

### Step 1: Initiate OAuth Flow

Visit: `http://localhost:3000/api/mcc/linkedin/auth`

This will:
- Generate a CSRF state token (stored in HTTP-only cookie)
- Redirect you to LinkedIn's consent screen
- Request these scopes:
  - `r_ads` - Read ad accounts and campaigns
  - `r_ads_reporting` - Read analytics/reporting
  - `w_ads` - Create/manage campaigns
  - `w_organization_social` - Post as organization
  - `r_organization_social` - Read organization posts
  - `r_basicprofile` - Basic profile info

### Step 2: Grant Consent

On LinkedIn's consent screen:
1. Review the permissions
2. Click "Allow"

### Step 3: Handle Callback

LinkedIn will redirect back to `/api/mcc/linkedin/auth/callback` which will:
- Verify the state parameter (CSRF protection)
- Exchange the authorization code for access and refresh tokens
- Save the tokens to `.linkedin-token.json` in the project root
- Display a success page with token information

### Step 4: Verify Authentication

Check authentication status at: `http://localhost:3000/api/mcc/linkedin/auth/status`

Response example:
```json
{
  "authenticated": true,
  "platform": "linkedin_ads",
  "hasRefreshToken": true,
  "expiresAt": "2026-02-04T15:30:00.000Z",
  "isExpired": false,
  "scope": "r_ads r_ads_reporting w_ads w_organization_social r_organization_social r_basicprofile",
  "authUrl": "/api/mcc/linkedin/auth"
}
```

## Using the Auth Helper

### Basic Usage

```typescript
import {
  getAccessToken,
  getAuthHeaders,
  getAdAccountId,
  getOrganizationId
} from '@/lib/mcc/linkedin-auth';

// Get a valid access token (auto-refreshes if expired)
const accessToken = await getAccessToken();

// Get ready-to-use headers for LinkedIn API requests
const headers = await getAuthHeaders();

// Get the ad account ID
const adAccountId = getAdAccountId();

// Get the organization ID
const orgId = getOrganizationId();
```

### Example: Fetching Campaigns

```typescript
import { getAuthHeaders, getAdAccountId } from '@/lib/mcc/linkedin-auth';

export async function getCampaigns() {
  const headers = await getAuthHeaders();
  const adAccountId = getAdAccountId();

  const response = await fetch(
    `https://api.linkedin.com/rest/adAccounts/${adAccountId}/adCampaigns?q=search`,
    { headers }
  );

  return await response.json();
}
```

### Example: Next.js API Route

```typescript
// app/api/mcc/linkedin/campaigns/route.ts
import { NextResponse } from 'next/server';
import { getAuthHeaders, getAdAccountId } from '@/lib/mcc/linkedin-auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const headers = await getAuthHeaders();
    const adAccountId = getAdAccountId();

    const response = await fetch(
      `https://api.linkedin.com/rest/adAccounts/${adAccountId}/adCampaigns?q=search`,
      { headers }
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

## Token Management

### Token File Structure

The `.linkedin-token.json` file contains:

```json
{
  "access_token": "AQXX...",
  "refresh_token": "AQXX...",
  "expires_at": "2026-02-04T15:30:00.000Z",
  "scope": "r_ads r_ads_reporting w_ads w_organization_social r_organization_social r_basicprofile",
  "token_type": "Bearer"
}
```

### Automatic Token Refresh

The `getAccessToken()` function automatically:
- Checks if the current access token is expired (or about to expire in 5 minutes)
- If expired, uses the refresh token to get a new access token
- Updates the `.linkedin-token.json` file with the new token
- Returns the valid access token

You never need to manually refresh tokens!

### Token Lifetimes

- **Access Token**: 60 minutes (auto-refreshed)
- **Refresh Token**: 60 days (need to re-authenticate when expired)

### Token Caching

Tokens are cached in memory for 5 seconds to avoid excessive file reads.

## LinkedIn Marketing API Headers

All requests to LinkedIn Marketing API require these headers (handled by `getAuthHeaders()`):

```typescript
{
  'Authorization': 'Bearer {access_token}',
  'LinkedIn-Version': '202401',           // API version
  'X-Restli-Protocol-Version': '2.0.0',   // Protocol version
  'Content-Type': 'application/json'
}
```

## Troubleshooting

### "Invalid state parameter"

This error indicates a CSRF mismatch:
1. State cookie may have expired (10 minute limit)
2. Try again from `/api/mcc/linkedin/auth`

### "Token file not found"

You need to complete the OAuth flow first:
1. Visit `/api/mcc/linkedin/auth`
2. Complete the consent flow

### "Access token expired and no refresh token available"

Your refresh token is missing or expired (>60 days):
1. Delete `.linkedin-token.json`
2. Re-authenticate at `/api/mcc/linkedin/auth`

### "Refresh token expired"

LinkedIn refresh tokens expire after 60 days:
1. Delete `.linkedin-token.json`
2. Re-authenticate at `/api/mcc/linkedin/auth`

### "Missing OAuth credentials in environment variables"

Make sure all required environment variables are set in `.env.local`:
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_AD_ACCOUNT_ID`
- `LINKEDIN_ORGANIZATION_ID`

### "Marketing API access not approved"

Your app hasn't been approved for Marketing API:
1. Go to LinkedIn Developer Portal > Your App > Products
2. Check the status of Marketing API request
3. If rejected, review the requirements and resubmit

## Security Notes

1. **Never commit `.linkedin-token.json`**: It's already in `.gitignore`
2. **Keep credentials secure**: Never commit `.env.local` files
3. **Production setup**: Use environment variables in Vercel
4. **Token rotation**: Refresh tokens expire after 60 days

## LinkedIn Marketing API Resources

- [LinkedIn Marketing API Documentation](https://learn.microsoft.com/en-us/linkedin/marketing/)
- [Campaign Management API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-campaigns)
- [Reporting & Analytics API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting)
- [OAuth2 Authentication](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)

## Files Reference

- `/app/api/mcc/linkedin/auth/route.ts` - OAuth initiation endpoint
- `/app/api/mcc/linkedin/auth/callback/route.ts` - OAuth callback handler
- `/app/api/mcc/linkedin/auth/status/route.ts` - Authentication status checker
- `/lib/mcc/linkedin-auth.ts` - Token management helper
- `/lib/mcc/platforms/linkedin-ads.ts` - Full LinkedIn Ads connector
- `/.linkedin-token.json` - Token storage (git-ignored)

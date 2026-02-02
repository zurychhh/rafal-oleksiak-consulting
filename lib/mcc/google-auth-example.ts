// Example: How to use the Google Ads OAuth2 helper
// This file demonstrates the usage of google-auth.ts

import { getAccessToken, getAuthHeaders, getCustomerId } from './google-auth';

/**
 * Example 1: Making a Google Ads API request to get campaign data
 */
export async function exampleGetCampaigns() {
  try {
    // Get auth headers (automatically handles token refresh if needed)
    const headers = await getAuthHeaders();
    const customerId = getCustomerId();

    // Example GAQL query to get campaigns
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
      ORDER BY metrics.impressions DESC
      LIMIT 10
    `;

    // Make request to Google Ads API
    const response = await fetch(
      `https://googleads.googleapis.com/v18/customers/${customerId}/googleAds:searchStream`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google Ads API error: ${errorData}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

/**
 * Example 2: Using a different customer ID (for MCC accounts managing multiple customers)
 */
export async function exampleGetCampaignsForCustomer(customerId: string) {
  try {
    const headers = await getAuthHeaders(customerId);

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status
      FROM campaign
      LIMIT 5
    `;

    const response = await fetch(
      `https://googleads.googleapis.com/v18/customers/${customerId.replace(/-/g, '')}/googleAds:searchStream`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

/**
 * Example 3: Just getting an access token (if you need it for custom requests)
 */
export async function exampleGetToken() {
  try {
    const accessToken = await getAccessToken();
    console.log('Got access token:', accessToken.substring(0, 20) + '...');
    return accessToken;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

/**
 * Example 4: Using the auth helper in a Next.js API route
 */
// File: app/api/mcc/campaigns/route.ts
/*
import { NextResponse } from 'next/server';
import { getAuthHeaders, getCustomerId } from '@/lib/mcc/google-auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const headers = await getAuthHeaders();
    const customerId = getCustomerId();

    const query = `
      SELECT campaign.id, campaign.name, campaign.status
      FROM campaign
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
*/

// Google Ads API Test Endpoint
// Tests authentication and basic API call

import { NextResponse } from 'next/server';
import { getAuthHeaders, getCustomerId } from '@/lib/mcc/google-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Step 1: Get auth headers (will auto-refresh token if expired)
    console.log('[Test] Getting auth headers...');
    const headers = await getAuthHeaders();
    console.log('[Test] Auth headers obtained');

    // Step 2: Get customer ID
    const customerId = getCustomerId();
    console.log('[Test] Customer ID:', customerId);

    // Step 3: Make a simple API call - list campaigns
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status
      FROM campaign
      LIMIT 10
    `;

    // Use v23 API (current as of Jan 2026)
    console.log('[Test] Making API call to Google Ads v23...');
    const apiUrl = `https://googleads.googleapis.com/v23/customers/${customerId}/googleAds:search`;
    console.log('[Test] URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });

    const responseText = await response.text();
    console.log('[Test] Response status:', response.status);
    console.log('[Test] Response:', responseText);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'API call failed',
        status: response.status,
        details: responseText,
      }, { status: response.status });
    }

    // Parse response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    return NextResponse.json({
      success: true,
      message: 'Google Ads API is working!',
      customerId,
      campaigns: data,
    });

  } catch (error) {
    console.error('[Test] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

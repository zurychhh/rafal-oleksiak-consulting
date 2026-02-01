// RADAR - Competitor Intelligence API Endpoint
// Scrapes competitor websites, generates AI analysis, emails report

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { runRadarAnalysis } from '@/lib/radar/analyzer';
import { generateRadarEmail } from '@/lib/radar/email-template';
import { createHubSpotContact } from '@/app/lib/hubspot';
import type { RadarRequest } from '@/lib/radar/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: RadarRequest = await request.json();
    const { yourUrl, competitorUrls, email, fullName, company } = body;

    // Validation
    if (!yourUrl || !email || !competitorUrls?.length) {
      return NextResponse.json(
        { error: 'Missing required fields: yourUrl, email, and at least one competitor URL' },
        { status: 400 }
      );
    }

    if (competitorUrls.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 competitor URLs allowed' },
        { status: 400 }
      );
    }

    // Normalize URLs
    const normalizeUrl = (url: string) => {
      const u = url.trim();
      return u.startsWith('http') ? u : `https://${u}`;
    };

    const normalizedYourUrl = normalizeUrl(yourUrl);
    const normalizedCompetitorUrls = competitorUrls
      .map(u => u.trim())
      .filter(u => u.length > 0)
      .map(normalizeUrl);

    console.log(`[RADAR] Analysis requested by ${email} for ${normalizedYourUrl} vs ${normalizedCompetitorUrls.length} competitors`);

    // Run the analysis
    const report = await runRadarAnalysis(normalizedYourUrl, normalizedCompetitorUrls);

    // HubSpot - track contact
    try {
      await createHubSpotContact({
        email,
        fullName: fullName || '',
        website: normalizedYourUrl,
        challenge: `RADAR Analysis: ${normalizedCompetitorUrls.length} competitors analyzed for ${normalizedYourUrl}`,
        marketingConsent: false,
      });
    } catch (hubspotError) {
      console.warn('[RADAR] HubSpot update failed:', hubspotError);
    }

    // Generate and send email report
    const emailHtml = generateRadarEmail(report, fullName || 'there');

    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'RADAR <radar@oleksiakconsulting.com>',
        to: email,
        subject: `RADAR Report: ${normalizedCompetitorUrls.length} Competitors Analyzed for ${new URL(normalizedYourUrl).hostname}`,
        html: emailHtml,
      });
      console.log(`[RADAR] Report sent to ${email}`);
    } catch (emailError) {
      console.error('[RADAR] Email send failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      report,
      executionTime: Date.now() - startTime,
    });

  } catch (error) {
    console.error('[RADAR] Analysis failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

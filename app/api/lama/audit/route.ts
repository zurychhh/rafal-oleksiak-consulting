// LAMA - Main Audit API Endpoint
// Orchestrates website audit, HubSpot integration, and email delivery

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { analyzeVisibility } from '@/lib/lama/analyzers/visibility';
import { analyzePerformance } from '@/lib/lama/analyzers/performance';
import { analyzeClarity } from '@/lib/lama/analyzers/clarity';
import { analyzeTrust } from '@/lib/lama/analyzers/trust';
import { analyzeConversion } from '@/lib/lama/analyzers/conversion';
import { analyzeEngagement } from '@/lib/lama/analyzers/engagement';
import { createOrUpdateLAMAContact } from '@/lib/lama/hubspot';
import { generateAuditEmail } from '@/lib/lama/email-template';
import type { AuditRequest, AuditResult, CategoryScore } from '@/lib/lama/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse request body
    const body: AuditRequest = await request.json();
    const { url, email, fullName, company } = body;

    // Validation
    if (!url || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: url and email' },
        { status: 400 }
      );
    }

    // Validate URL format
    let validUrl: string;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      validUrl = urlObj.toString();
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    console.log(`[LAMA] Starting audit for ${validUrl} (${email})`);

    // 2. Run all 6 analyses in parallel (Stage 2: Full audit)
    const [
      visibilityResult,
      performanceResult,
      clarityResult,
      trustResult,
      engagementResult,
      conversionResult,
    ] = await Promise.allSettled([
      analyzeVisibility(validUrl),
      analyzePerformance(validUrl),
      analyzeClarity(validUrl),
      analyzeTrust(validUrl),
      analyzeEngagement(validUrl),
      analyzeConversion(validUrl),
    ]);

    // Extract results (handle failures gracefully)
    const categories: CategoryScore[] = [];

    if (visibilityResult.status === 'fulfilled') {
      categories.push(visibilityResult.value);
    } else {
      console.error('[LAMA] Find analysis failed:', visibilityResult.reason);
      categories.push({
        category: 'Find',
        score: 0,
        issues: [{
          severity: 'critical',
          title: 'Analysis failed',
          description: 'Unable to analyze if people can find your website',
        }],
        recommendations: ['Check if website is publicly accessible'],
      });
    }

    if (performanceResult.status === 'fulfilled') {
      categories.push(performanceResult.value);
    } else {
      console.error('[LAMA] Stay analysis failed:', performanceResult.reason);
      categories.push({
        category: 'Stay',
        score: 0,
        issues: [{
          severity: 'critical',
          title: 'Analysis failed',
          description: 'Unable to analyze if people will stay on your website',
        }],
        recommendations: ['Ensure website is accessible to Google PageSpeed API'],
      });
    }

    if (clarityResult.status === 'fulfilled') {
      categories.push(clarityResult.value);
    } else {
      console.error('[LAMA] Understand analysis failed:', clarityResult.reason);
      categories.push({
        category: 'Understand',
        score: 0,
        issues: [{
          severity: 'critical',
          title: 'Analysis failed',
          description: 'Unable to analyze if people will understand what you offer',
        }],
        recommendations: ['Check if Claude API key is configured correctly'],
      });
    }

    if (trustResult.status === 'fulfilled') {
      categories.push(trustResult.value);
    } else {
      console.error('[LAMA] Trust analysis failed:', trustResult.reason);
      categories.push({
        category: 'Trust',
        score: 0,
        issues: [{
          severity: 'critical',
          title: 'Analysis failed',
          description: 'Unable to analyze trust signals',
        }],
        recommendations: ['Check if website is publicly accessible'],
      });
    }

    if (engagementResult.status === 'fulfilled') {
      categories.push(engagementResult.value);
    } else {
      console.error('[LAMA] Engage analysis failed:', engagementResult.reason);
      categories.push({
        category: 'Engage',
        score: 0,
        issues: [{
          severity: 'critical',
          title: 'Analysis failed',
          description: 'Unable to analyze CRM & marketing automation maturity',
        }],
        recommendations: ['Check if website is publicly accessible'],
      });
    }

    if (conversionResult.status === 'fulfilled') {
      categories.push(conversionResult.value);
    } else {
      console.error('[LAMA] Convert analysis failed:', conversionResult.reason);
      categories.push({
        category: 'Convert',
        score: 0,
        issues: [{
          severity: 'critical',
          title: 'Analysis failed',
          description: 'Unable to analyze if people will convert into customers',
        }],
        recommendations: ['Check if website is publicly accessible'],
      });
    }

    // 3. Calculate overall score
    const overallScore = Math.round(
      categories.reduce((sum, cat) => sum + cat.score, 0) / categories.length
    );

    const executionTime = Date.now() - startTime;

    // 4. Build audit result
    const auditResult: AuditResult = {
      url: validUrl,
      timestamp: new Date().toISOString(),
      overallScore,
      categories,
      executionTime,
    };

    console.log(`[LAMA] Audit completed in ${(executionTime / 1000).toFixed(1)}s - Score: ${overallScore}/100`);

    // 5. Create/update HubSpot contact + log activity
    const hubspotResult = await createOrUpdateLAMAContact(
      {
        email,
        fullName: fullName || email.split('@')[0],
        website: validUrl,
        auditScore: overallScore,
        auditTimestamp: auditResult.timestamp,
      },
      auditResult
    );

    if (hubspotResult.success) {
      console.log(`[LAMA] HubSpot contact created/updated: ${hubspotResult.contactId}`);
    } else {
      console.error('[LAMA] HubSpot integration failed:', hubspotResult.error);
    }

    // 6. Generate email HTML
    const emailHtml = generateAuditEmail({
      recipientName: fullName || email.split('@')[0],
      auditResult,
      ctaLink: 'https://calendly.com/rafal-oleksiak/consultation', // TODO: Replace with actual Calendly link
    });

    // 7. Send email via Resend
    const emailResult = await resend.emails.send({
      from: `Rafał Oleksiak <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: `Your Website Audit Results (Score: ${overallScore}/100) 🚀`,
      html: emailHtml,
    });

    if (emailResult.error) {
      console.error('[LAMA] Email sending failed:', emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error: 'Audit completed but email delivery failed',
          auditResult,
        },
        { status: 500 }
      );
    }

    console.log(`[LAMA] Audit email sent to ${email} (${emailResult.data?.id})`);

    // 8. Return success response
    return NextResponse.json({
      success: true,
      message: 'Audit completed and email sent successfully',
      auditResult: {
        overallScore,
        executionTime,
        emailSent: true,
        hubspotLogged: hubspotResult.success,
      },
    });

  } catch (error) {
    console.error('[LAMA] Fatal error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Audit failed due to server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    service: 'LAMA Audit API',
    version: '2.0.0',
    stage: 'Stage 2 (Full 5-category audit)',
    status: 'operational',
    features: {
      visibility: 'enabled',
      performance: 'enabled',
      clarity: 'enabled (Claude AI)',
      trust: 'enabled',
      conversion: 'enabled',
    },
  });
}

// LAMA - Main Audit API Endpoint
// Orchestrates website audit, HubSpot integration, and email delivery

// Use Node.js runtime to bypass Turbopack for PDF generation
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
import { generateLAMAProPDF } from '@/app/lib/lama/pro/pdf-generator-core';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';
import type { AuditRequest, AuditResult, CategoryScore } from '@/lib/lama/types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse request body
    const body: AuditRequest = await request.json();
    const { url, email, fullName, company, paid = false, paymentId } = body;

    // Log audit type
    const auditType = paid ? 'PAID' : 'FREE';
    console.log(`[LAMA] ${auditType} audit requested for ${email}`);

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
      conversionResult,
      engagementResult,
    ] = await Promise.allSettled([
      analyzeVisibility(validUrl),
      analyzePerformance(validUrl),
      analyzeClarity(validUrl),
      analyzeTrust(validUrl),
      analyzeConversion(validUrl),
      analyzeEngagement(validUrl),
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

    // 6. Generate LAMA PRO PDF directly (ONLY for PAID audits)
    let pdfBuffer: Buffer | null = null;

    if (paid) {
      try {
        console.log('[LAMA] PAID audit - Generating PDF directly...');
        const pdfStartTime = Date.now();

        pdfBuffer = await generateLAMAProPDF({
          auditResult,
          fullName,
          company,
        });

        const pdfDuration = Date.now() - pdfStartTime;
        console.log(`[LAMA] PDF generated: ${(pdfBuffer.length / 1024).toFixed(0)}KB in ${(pdfDuration / 1000).toFixed(1)}s`);

      } catch (pdfError) {
        console.error('[LAMA] PDF generation failed (continuing without PDF):', pdfError);
        // Continue without PDF - don't fail the entire audit
      }
    } else {
      console.log('[LAMA] FREE audit - Skipping PDF generation');
    }

    // 6b. Create Stripe checkout session for FREE audits (upsell link in email)
    let stripeCheckoutUrl: string | null = null;

    if (!paid && STRIPE_CONFIG.priceId) {
      try {
        console.log('[LAMA] Creating Stripe checkout session for upsell...');
        const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://oleksiakconsulting.com';

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price: STRIPE_CONFIG.priceId,
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${origin}${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}${STRIPE_CONFIG.cancelUrl}`,
          customer_email: email,
          metadata: {
            audit_url: validUrl,
            full_name: fullName || '',
            company: company || '',
            source: 'free_audit_upsell',
          },
          billing_address_collection: 'auto',
          allow_promotion_codes: true,
          // Session expires in 24 hours (default)
        });

        stripeCheckoutUrl = session.url;
        console.log(`[LAMA] Stripe checkout session created: ${session.id}`);
      } catch (stripeError) {
        console.error('[LAMA] Stripe checkout creation failed (continuing without upsell link):', stripeError);
        // Continue without Stripe link - use fallback in email template
      }
    }

    // 7. Generate email HTML (different for paid vs free)
    const emailHtml = generateAuditEmail({
      recipientName: fullName || email.split('@')[0],
      auditResult,
      ctaLink: 'https://calendly.com/rafal-oleksiak/consultation',
      paid,
      paymentId,
      stripeCheckoutUrl, // Pass checkout URL for FREE audit upsell
    });

    // Different subject line for paid vs free
    const emailSubject = paid
      ? `Your Premium Audit Report is Ready (Score: ${overallScore}/100)`
      : `Your FREE Website Audit Results (Score: ${overallScore}/100)`;

    // 8. Send email via Resend with PDF attachment (only for paid)
    const emailResult = await resend.emails.send({
      from: `Rafał Oleksiak <${process.env.FROM_EMAIL}>`,
      to: [email],
      subject: emailSubject,
      html: emailHtml,
      ...(pdfBuffer && {
        attachments: [
          {
            filename: `LAMA-PRO-Audit-${new URL(validUrl).hostname}.pdf`,
            content: pdfBuffer,
          },
        ],
      }),
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

    console.log(`[LAMA] ${auditType} audit email sent to ${email} (${emailResult.data?.id})`);

    // 9. Return success response
    return NextResponse.json({
      success: true,
      message: `${auditType} audit completed and email sent successfully`,
      auditResult: {
        overallScore,
        executionTime,
        auditType,
        emailSent: true,
        hubspotLogged: hubspotResult.success,
        pdfGenerated: pdfBuffer !== null,
        pdfSize: pdfBuffer ? `${(pdfBuffer.length / 1024).toFixed(0)}KB` : null,
        paymentId: paid ? paymentId : undefined,
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
    version: '3.0.0',
    stage: 'Stage 3 (Full audit + LAMA PRO PDF)',
    status: 'operational',
    features: {
      visibility: 'enabled',
      performance: 'enabled',
      clarity: 'enabled (Claude AI)',
      trust: 'enabled',
      conversion: 'enabled',
      engagement: 'enabled',
      pdf: 'enabled (104-page LAMA PRO report)',
    },
  });
}

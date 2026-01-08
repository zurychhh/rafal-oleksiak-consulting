// Stripe Checkout Session Creator
// Creates a Stripe Checkout session for paid website audits

import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_CONFIG } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email, fullName, company } = body;

    // Validation
    if (!url || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: url and email' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get origin for redirect URLs
    const origin = request.headers.get('origin') || 'https://oleksiakconsulting.com';

    // Create Stripe Checkout Session
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
        audit_url: url,
        full_name: fullName || '',
        company: company || '',
        source: 'website_paid_audit',
      },
      billing_address_collection: 'auto',
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    console.log(`[Stripe] Checkout session created: ${session.id} for ${email}`);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error);

    // Handle specific Stripe errors
    if (error instanceof Error) {
      if (error.message.includes('price')) {
        return NextResponse.json(
          { error: 'Payment configuration error. Please contact support.' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}

// Stripe Webhook Handler
// Handles payment events and triggers LAMA audit after successful payment

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', errorMessage);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
      // Could send failure notification email here
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata) {
    console.error('[Stripe Webhook] No metadata in session');
    return;
  }

  const { audit_url, full_name, company } = metadata;
  const email = session.customer_email;
  const paymentId = session.payment_intent as string;

  if (!email || !audit_url) {
    console.error('[Stripe Webhook] Missing email or audit_url in session');
    return;
  }

  console.log(`[Stripe Webhook] Processing paid audit:`);
  console.log(`  - Email: ${email}`);
  console.log(`  - URL: ${audit_url}`);
  console.log(`  - Payment ID: ${paymentId}`);

  // Determine base URL for API call
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/api/lama/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: audit_url,
        email,
        fullName: full_name || undefined,
        company: company || undefined,
        paid: true,
        paymentId,
        consent: true, // Paid = implied consent
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Audit API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`[Stripe Webhook] Paid audit triggered successfully:`, result);
  } catch (error) {
    console.error('[Stripe Webhook] Failed to trigger audit:', error);

    // TODO: Implement retry logic or alert system
    // For now, log the error - manual intervention may be needed
    console.error('[Stripe Webhook] CRITICAL: Payment received but audit failed!');
    console.error(`[Stripe Webhook] Manual audit needed for: ${email}, URL: ${audit_url}`);
  }
}

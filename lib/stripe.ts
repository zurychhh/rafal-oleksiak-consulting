// Stripe Client Library
// Server-side Stripe instance for checkout sessions and webhooks

import Stripe from 'stripe';

// Lazy initialization - only throw when actually used, not during build
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// Legacy export for backwards compatibility (lazy getter)
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

// Configuration constants
export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID || '',
  currency: 'eur',
  productName: 'Full Website Audit Report',
  productDescription: 'Comprehensive 100+ page website audit with actionable recommendations',
  successUrl: '/audit-success',
  cancelUrl: '/#contact',
};

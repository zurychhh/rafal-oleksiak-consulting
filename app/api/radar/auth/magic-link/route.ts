export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createMagicLink } from '@/lib/radar/auth/session';
import { generateMagicLinkEmail } from '@/lib/radar/magic-link-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const { token } = await createMagicLink(normalizedEmail);

    const baseUrl = process.env.RADAR_BASE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const verifyUrl = `${baseUrl}/api/radar/auth/verify?token=${token}`;

    const emailHtml = generateMagicLinkEmail(verifyUrl, normalizedEmail);

    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'RADAR <radar@oleksiakconsulting.com>',
      to: normalizedEmail,
      subject: 'Sign in to RADAR Dashboard',
      html: emailHtml,
    });

    console.log(`[RADAR Auth] Magic link sent to ${normalizedEmail}`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[RADAR Auth] Magic link error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send magic link';
    return NextResponse.json({ error: message }, { status: 429 });
  }
}

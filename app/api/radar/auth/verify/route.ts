export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicLink, createSession, COOKIE_NAME } from '@/lib/radar/auth/session';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/radar/login?error=missing_token', request.url));
  }

  try {
    const user = await verifyMagicLink(token);

    if (!user) {
      return NextResponse.redirect(new URL('/radar/login?error=invalid_or_expired', request.url));
    }

    const sessionToken = await createSession(user.id);

    const response = NextResponse.redirect(new URL('/radar/dashboard', request.url));
    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'lax' allows cookie on top-level navigation (email link clicks)
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log(`[RADAR Auth] Session created for ${user.email}`);
    return response;

  } catch (error) {
    console.error('[RADAR Auth] Verify error:', error);
    return NextResponse.redirect(new URL('/radar/login?error=verification_failed', request.url));
  }
}

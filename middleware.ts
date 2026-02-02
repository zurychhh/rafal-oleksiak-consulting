import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- ADMIN AUTH ---
  const adminToken = request.cookies.get('admin_token')?.value;

  // /admin (login page) — redirect to dashboard if already logged in
  if (pathname === '/admin') {
    if (adminToken) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    return NextResponse.next();
  }

  // /admin/* — require auth
  if (pathname.startsWith('/admin/')) {
    if (!adminToken) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.next();
  }

  // --- RADAR DASHBOARD AUTH ---
  const radarSession = request.cookies.get('radar_session')?.value;

  // /radar/dashboard/* — require radar session
  if (pathname.startsWith('/radar/dashboard')) {
    if (!radarSession) return NextResponse.redirect(new URL('/radar/login', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/radar/dashboard/:path*'],
};

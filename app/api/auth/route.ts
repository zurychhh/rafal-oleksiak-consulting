import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BLOG_API_URL || process.env.NEXT_PUBLIC_BLOG_API_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json(
      { error: 'Login failed' },
      { status: res.status },
    );
  }

  const data = await res.json();

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}

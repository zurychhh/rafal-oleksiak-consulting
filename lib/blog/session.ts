import { cookies } from 'next/headers';
import type { JWTPayload } from './types';

const COOKIE_NAME = 'admin_token';

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = await getToken();
  if (!token) return null;

  const payload = decodeJWT(token);
  if (!payload) return null;

  // Check expiration
  if (payload.exp * 1000 < Date.now()) return null;

  return payload;
}

export function isSuperadmin(session: JWTPayload): boolean {
  return session.role === 'superadmin';
}

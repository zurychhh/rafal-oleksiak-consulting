import { randomBytes } from 'crypto';
import { db } from '@/lib/radar/db';
import { schema } from '@/lib/radar/db';
import { eq, and, gt, lt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import type { RadarUser } from '@/lib/radar/types';

const MAGIC_LINK_EXPIRY_MINUTES = 15;
const SESSION_EXPIRY_DAYS = 7;
const COOKIE_NAME = 'radar_session';

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

export async function createMagicLink(email: string): Promise<{ token: string; isNewUser: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Find or create user
  let users = await db.select().from(schema.radarUsers).where(eq(schema.radarUsers.email, normalizedEmail));
  let isNewUser = false;

  if (users.length === 0) {
    users = await db.insert(schema.radarUsers).values({ email: normalizedEmail }).returning();
    isNewUser = true;
  }

  const user = users[0];

  // Rate limit: count active (unexpired, unused) magic links
  const activeLinkCount = await db.select().from(schema.radarMagicLinks)
    .where(and(
      eq(schema.radarMagicLinks.userId, user.id),
      eq(schema.radarMagicLinks.used, false),
      gt(schema.radarMagicLinks.expiresAt, new Date()),
    ));

  if (activeLinkCount.length >= 3) {
    throw new Error('Too many login attempts. Please wait before trying again.');
  }

  // Create magic link
  const token = generateToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000);

  await db.insert(schema.radarMagicLinks).values({
    userId: user.id,
    token,
    expiresAt,
  });

  return { token, isNewUser };
}

export async function verifyMagicLink(token: string): Promise<RadarUser | null> {
  const links = await db.select()
    .from(schema.radarMagicLinks)
    .where(and(
      eq(schema.radarMagicLinks.token, token),
      eq(schema.radarMagicLinks.used, false),
      gt(schema.radarMagicLinks.expiresAt, new Date()),
    ));

  if (links.length === 0) return null;

  const link = links[0];

  // Mark as used
  await db.update(schema.radarMagicLinks)
    .set({ used: true })
    .where(eq(schema.radarMagicLinks.id, link.id));

  // Update user last login
  await db.update(schema.radarUsers)
    .set({ lastLogin: new Date() })
    .where(eq(schema.radarUsers.id, link.userId));

  // Get updated user
  const users = await db.select().from(schema.radarUsers).where(eq(schema.radarUsers.id, link.userId));
  if (users.length === 0) return null;

  const u = users[0];
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    company: u.company,
    yourUrl: u.yourUrl,
    createdAt: u.createdAt.toISOString(),
    lastLogin: u.lastLogin?.toISOString() || null,
  };
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(schema.radarSessions).values({
    userId,
    token,
    expiresAt,
  });

  return token;
}

export async function validateSession(token: string): Promise<RadarUser | null> {
  const sessions = await db.select()
    .from(schema.radarSessions)
    .where(and(
      eq(schema.radarSessions.token, token),
      gt(schema.radarSessions.expiresAt, new Date()),
    ));

  if (sessions.length === 0) return null;

  const session = sessions[0];
  const users = await db.select().from(schema.radarUsers).where(eq(schema.radarUsers.id, session.userId));
  if (users.length === 0) return null;

  const u = users[0];
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    company: u.company,
    yourUrl: u.yourUrl,
    createdAt: u.createdAt.toISOString(),
    lastLogin: u.lastLogin?.toISOString() || null,
  };
}

export async function destroySession(token: string): Promise<void> {
  await db.delete(schema.radarSessions).where(eq(schema.radarSessions.token, token));
}

export async function getRadarSession(): Promise<RadarUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}

export { COOKIE_NAME };

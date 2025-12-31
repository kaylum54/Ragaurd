import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import type { User, UserRole } from '@/lib/auth';

// Session configuration
// IMPORTANT: Must match SESSION_COOKIE_NAME in middleware.ts
const SESSION_COOKIE_NAME = 'ragaurd_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Get the secret key - MUST be set in production
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production');
    }
    // Only allow fallback in development
    console.warn('WARNING: Using insecure default SESSION_SECRET. Set SESSION_SECRET in production!');
    return new TextEncoder().encode('dev-only-insecure-secret-change-in-production');
  }

  if (secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters long');
  }

  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  user: User;
  orgId: string;
}

/**
 * Create a signed JWT session token
 */
export async function createSessionToken(user: User, orgId: string): Promise<string> {
  const secret = getSecretKey();

  const token = await new SignJWT({ user, orgId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + SESSION_DURATION) / 1000))
    .setJti(crypto.randomUUID()) // Unique token ID for revocation support
    .sign(secret);

  return token;
}

/**
 * Verify and decode a session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);

    // Validate required fields
    if (!payload.user || !payload.orgId) {
      return null;
    }

    return payload as SessionPayload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    return await verifySessionToken(sessionCookie.value);
  } catch {
    return null;
  }
}

/**
 * Require a valid session, throw if not authenticated
 */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * Require admin role
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.user.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }
  return session;
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const session = await getSession();
  return session?.user.role === role;
}

/**
 * Get session cookie options
 */
export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    maxAge: SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  };
}

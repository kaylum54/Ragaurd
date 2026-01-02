import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/services/db/users';
import { createOrganization } from '@/lib/services/db/organizations';
import { createSessionToken, getSessionCookieOptions } from '@/lib/session';
import { isDemoModeEnabled } from '@/lib/auth';
import { hashPassword } from '@/lib/password';
import { logError } from '@/lib/utils/safe-error';
import { randomUUID } from 'crypto';

// Rate limiting map (use Redis in production)
const signupAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = signupAttempts.get(identifier);

  if (!record || now > record.resetAt) {
    signupAttempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, company } = body;

    // Get client identifier for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': '3600' }, // 1 hour
        }
      );
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required' },
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

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // In demo mode, create a mock user and session
    if (isDemoModeEnabled()) {
      // Check if email is already used by demo accounts
      if (email === 'demo@ragaurd.com' || email === 'admin@ragaurd.com') {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 409 }
        );
      }

      // Create mock user for demo
      const mockUser = {
        id: randomUUID(),
        email,
        name: `${firstName} ${lastName}`,
        role: 'user' as const,
      };

      const mockOrgId = 'demo-org-new-user';

      // Create signed JWT session token
      const sessionToken = await createSessionToken(mockUser, mockOrgId);

      // Create response with cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        redirectTo: '/dashboard',
      });

      // Set secure session cookie
      const cookieOptions = getSessionCookieOptions();
      response.cookies.set(cookieOptions.name, sessionToken, {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        maxAge: cookieOptions.maxAge,
        path: cookieOptions.path,
      });

      return response;
    }

    // Production: Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Create user in database
    // Generate a pseudo auth0_id for email/password signups
    const auth0Id = `email|${randomUUID()}`;
    const passwordHash = await hashPassword(password);
    const newUser = await createUser({
      auth0_id: auth0Id,
      email,
      name: `${firstName} ${lastName}`,
      password_hash: passwordHash,
    });

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Create organization for new user with free plan
    const orgSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`.replace(/[^a-z0-9-]/g, '');
    const organization = await createOrganization(
      {
        name: company || `${firstName}'s Organization`,
        slug: orgSlug,
        owner_id: newUser.id,
        plan: 'free',
      },
      newUser.id
    );

    if (!organization) {
      // Cleanup: delete user if org creation fails
      logError('Failed to create organization for new user', { userId: newUser.id });
      return NextResponse.json(
        { error: 'Failed to create account. Please try again.' },
        { status: 500 }
      );
    }

    // Create session for new user
    const user = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || `${firstName} ${lastName}`,
      role: 'user' as const,
    };

    const sessionToken = await createSessionToken(user, organization.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      redirectTo: '/dashboard',
    });

    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(cookieOptions.name, sessionToken, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path,
    });

    return response;
  } catch (error) {
    logError('Signup error', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { validateDemoCredentials, isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { createSessionToken, getSessionCookieOptions } from '@/lib/session';
import { logError } from '@/lib/utils/safe-error';

// Rate limiting map (use Redis in production)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record || now > record.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
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
    const { email, password } = body;

    // Get client identifier for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `${ip}:${email || 'unknown'}`;

    // Check rate limit
    const { allowed, remaining } = checkRateLimit(rateLimitKey);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': '900' }, // 15 minutes
        }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    let user = null;
    let orgId = '';

    // Check if demo mode is enabled (development only)
    if (isDemoModeEnabled()) {
      user = validateDemoCredentials(email, password);
      if (user) {
        orgId = getDemoOrgId();
      }
    }

    // TODO: In production, validate against Auth0 or database here
    // if (!user) {
    //   user = await validateWithAuth0(email, password);
    //   orgId = await getOrgIdForUser(user.id);
    // }

    if (!user) {
      // Use generic error message to prevent account enumeration
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create signed JWT session token
    const sessionToken = await createSessionToken(user, orgId);

    // Create response with cookie
    // Note: Don't expose role in response to prevent admin account enumeration
    // The client can determine role from protected route access or a separate /me endpoint
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      redirectTo: '/dashboard', // Always redirect to dashboard; admin features accessible from there
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
  } catch (error) {
    logError('Login error', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

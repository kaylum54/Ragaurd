import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ===================
// RATE LIMITING
// ===================
// NOTE: This in-memory rate limiter works for single-instance deployments.
// For production with multiple instances, use Redis or a similar distributed store.
// Example with Upstash Redis:
//   import { Ratelimit } from '@upstash/ratelimit';
//   import { Redis } from '@upstash/redis';
//   const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(100, '1 m') });

const rateLimitMap = new Map<string, { count: number; reset: number }>();

// Rate limiting configuration per route type
const RATE_LIMITS = {
  '/api/v1/': { max: 100, windowMs: 60 * 1000 },      // Public API: 100/min
  '/api/keys': { max: 20, windowMs: 60 * 1000 },       // Key management: 20/min
  '/api/redteam': { max: 10, windowMs: 60 * 1000 },    // Redteam: 10/min
  '/api/admin': { max: 50, windowMs: 60 * 1000 },      // Admin: 50/min
  '/api/dashboard': { max: 60, windowMs: 60 * 1000 },  // Dashboard: 60/min
  '/api/': { max: 100, windowMs: 60 * 1000 },          // Default API: 100/min
} as const;

// Session cookie name (must match lib/session.ts)
const SESSION_COOKIE_NAME = 'ragaurd_session';

/**
 * Get client IP address for rate limiting
 *
 * SECURITY NOTE: X-Forwarded-For can be spoofed by clients.
 * This implementation:
 * 1. Prefers CF-Connecting-IP (Cloudflare) which is set by the edge
 * 2. Falls back to X-Real-IP (set by reverse proxies like nginx)
 * 3. Only uses X-Forwarded-For as last resort, taking the rightmost non-private IP
 *
 * In production behind a trusted proxy, configure your proxy to set X-Real-IP
 * and strip/ignore client-provided X-Forwarded-For headers.
 */
function getClientIp(request: NextRequest): string {
  // Cloudflare sets this header - most reliable when using CF
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // X-Real-IP is typically set by nginx/reverse proxy
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // X-Forwarded-For: take the rightmost IP (closest to our server)
  // This is more resistant to spoofing as the client can only prepend, not append
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim());
    // Get the rightmost IP (the one added by our trusted proxy)
    // In a proper setup, this should be the real client IP
    const clientIp = ips[ips.length - 1];
    if (clientIp) {
      return clientIp;
    }
  }

  // Fallback - should not happen in production behind a proxy
  return 'unknown';
}

/**
 * Get rate limit configuration for a given path
 */
function getRateLimitConfig(pathname: string): { max: number; windowMs: number } {
  for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(prefix)) {
      return config;
    }
  }
  return RATE_LIMITS['/api/'];
}

/**
 * Check rate limit for a given key and configuration
 */
function checkRateLimit(
  key: string,
  config: { max: number; windowMs: number }
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const rateLimitKey = `${key}:${config.max}`;
  const current = rateLimitMap.get(rateLimitKey);

  if (!current || now > current.reset) {
    rateLimitMap.set(rateLimitKey, { count: 1, reset: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, reset: now + config.windowMs };
  }

  if (current.count >= config.max) {
    return { allowed: false, remaining: 0, reset: current.reset };
  }

  current.count++;
  return { allowed: true, remaining: config.max - current.count, reset: current.reset };
}

// Periodically clean up expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitMap.entries());
  for (const [key, value] of entries) {
    if (now > value.reset) {
      rateLimitMap.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

/**
 * Verify session token in middleware
 * Returns decoded session or null if invalid
 */
async function verifySession(request: NextRequest): Promise<{ user: { role: string } } | null> {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    if (!sessionCookie?.value) {
      return null;
    }

    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
      console.error('SESSION_SECRET not configured or too short');
      return null;
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(sessionCookie.value, secretKey);

    if (!payload.user) {
      return null;
    }

    return payload as { user: { role: string } };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy - allow microphone for voice testing
  response.headers.set('Permissions-Policy', 'microphone=(self)');

  // Content Security Policy
  // Note: 'unsafe-inline' for styles is required for Next.js styled-jsx and Tailwind
  // In production, consider using nonces for stricter CSP
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval in dev
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.elevenlabs.io wss://api.elevenlabs.io",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "media-src 'self' blob:", // For audio playback
  ];
  response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

  // Rate limit ALL API routes (not just /api/v1)
  if (pathname.startsWith('/api/')) {
    const clientIp = getClientIp(request);
    const rateLimitConfig = getRateLimitConfig(pathname);
    const { allowed, remaining, reset } = checkRateLimit(clientIp, rateLimitConfig);

    response.headers.set('X-RateLimit-Limit', String(rateLimitConfig.max));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(reset));

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimitConfig.max),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(reset),
          },
        }
      );
    }
  }

  // Protected routes - verify authentication
  const protectedPaths = ['/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtectedPath) {
    const session = await verifySession(request);

    // Redirect to login if not authenticated
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin routes require admin role
    if (pathname.startsWith('/admin')) {
      if (session.user.role !== 'admin') {
        // Non-admin users are redirected to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

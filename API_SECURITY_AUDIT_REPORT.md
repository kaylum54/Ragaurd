# API Security Audit Report

**Date:** 2024-12-31
**Scope:** All routes in `/app/api/` directory
**Auditor:** Claude Code Security Review

---

## Executive Summary

This audit identified **12 security issues** across the API layer:
- **2 HIGH** - Should be fixed before production
- **6 MEDIUM** - Should be addressed
- **4 LOW** - Best practice improvements

---

## Vulnerability Details

### API-001: SQL Injection via Search Parameter (HIGH)

**Files:**
- `lib/services/db/admin.ts:114-115`
- `lib/services/db/admin.ts:173-174`

**Severity:** HIGH
**CVSS Score:** 7.5

**Issue:**
```typescript
// Line 114-115
if (search) {
  query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
}

// Line 173-174
if (search) {
  query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
}
```

The `search` parameter is directly interpolated into the Supabase `.or()` query string. While Supabase generally uses parameterized queries, this pattern with string interpolation in `.or()` could be vulnerable.

**Attack Vector:**
```
GET /api/admin/users?search=test%'); DROP TABLE users; --
```

**Remediation:**
Use Supabase's `ilike` filter properly:
```typescript
if (search) {
  query = query.or(`email.ilike.%${search.replace(/[%_]/g, '\\$&')}%,name.ilike.%${search.replace(/[%_]/g, '\\$&')}%`);
}
// Or better: split into separate .ilike() calls with proper escaping
```

---

### API-002: Missing Request Body Size Limits (HIGH)

**Files:**
- `app/api/v1/defend/audio/route.ts`
- All other POST endpoints

**Severity:** HIGH
**CVSS Score:** 7.3

**Issue:**
The audio endpoint accepts base64-encoded audio data with no size limit:
```typescript
const audioDefendRequestSchema = z.object({
  audio: z.object({
    data: z.string().min(1, 'Audio data is required'),  // No .max()!
    format: z.enum(['wav', 'mp3', 'ogg', 'webm']).default('wav'),
  }),
  // ...
});
```

**Impact:**
- Denial of Service via memory exhaustion
- Large payloads could crash the server
- No protection against zip bombs in base64

**Remediation:**
1. Add max length to Zod schema:
```typescript
data: z.string().min(1).max(10 * 1024 * 1024), // 10MB base64 max
```

2. Add body size limit in Next.js config:
```typescript
// next.config.js
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',
  },
},
```

3. Or use middleware to check Content-Length header:
```typescript
const contentLength = parseInt(request.headers.get('content-length') || '0');
if (contentLength > 10 * 1024 * 1024) {
  return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
}
```

---

### API-003: Rate Limiting Bypass via X-Forwarded-For (MEDIUM)

**File:** `middleware.ts:11-14`

**Severity:** MEDIUM
**CVSS Score:** 5.3

**Issue:**
```typescript
function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}
```

Attackers can bypass rate limiting by sending fake `X-Forwarded-For` headers:
```bash
curl -H "X-Forwarded-For: 1.2.3.4" https://api.ragaurd.com/api/v1/defend
curl -H "X-Forwarded-For: 1.2.3.5" https://api.ragaurd.com/api/v1/defend
# Each request appears from different IP
```

**Remediation:**
Configure trusted proxies and only accept X-Forwarded-For from them:
```typescript
const TRUSTED_PROXIES = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

function getRateLimitKey(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip');
  // Only trust X-Forwarded-For if request comes from trusted proxy
  // In production, use CF-Connecting-IP for Cloudflare, etc.
  return realIp || 'unknown';
}
```

---

### API-004: In-Memory Rate Limiting Doesn't Scale (MEDIUM)

**Files:**
- `middleware.ts:5`
- `app/api/auth/login/route.ts:6`

**Severity:** MEDIUM
**CVSS Score:** 5.0

**Issue:**
```typescript
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
```

In-memory rate limiting doesn't work across multiple server instances (horizontal scaling). Each server has its own rate limit counter.

**Impact:**
- Rate limits multiply by number of servers
- Attackers can rotate between servers to bypass limits

**Remediation:**
Use Redis or similar distributed store:
```typescript
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

async function checkRateLimit(key: string): Promise<{ allowed: boolean }> {
  const count = await redis.incr(`ratelimit:${key}`);
  if (count === 1) {
    await redis.expire(`ratelimit:${key}`, 60);
  }
  return { allowed: count <= 100 };
}
```

---

### API-005: Incomplete Rate Limiting Coverage (MEDIUM)

**Severity:** MEDIUM
**CVSS Score:** 5.0

**Issue:**
Rate limiting is only applied to:
- `/api/v1/*` routes (100 req/min)
- `/api/auth/login` (5 attempts/15 min)

**Unprotected routes:**
- `/api/keys/*` - API key creation/deletion
- `/api/redteam/*` - Scan creation
- `/api/dashboard/*` - Stats queries
- `/api/admin/*` - Admin operations

**Remediation:**
Add rate limiting to all routes in middleware:
```typescript
if (pathname.startsWith('/api/')) {
  // Apply rate limits to all API routes
  const limits = {
    '/api/v1/': { max: 100, window: 60 },
    '/api/keys': { max: 20, window: 60 },
    '/api/redteam': { max: 10, window: 60 },
    '/api/admin': { max: 50, window: 60 },
    '/api/dashboard': { max: 60, window: 60 },
  };
  // ... apply appropriate limit
}
```

---

### API-006: Missing CORS Configuration (MEDIUM)

**File:** `next.config.js`

**Severity:** MEDIUM
**CVSS Score:** 4.3

**Issue:**
No explicit CORS configuration. API routes may be callable from any origin.

**Remediation:**
Add CORS headers in next.config.js or middleware:
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || 'https://ragaurd.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PATCH, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        { key: 'Access-Control-Max-Age', value: '86400' },
      ],
    },
    // ... existing headers
  ];
}
```

---

### API-007: API Key Scopes Not Enforced (MEDIUM)

**Files:**
- `app/api/v1/defend/route.ts`
- `app/api/v1/defend/audio/route.ts`

**Severity:** MEDIUM
**CVSS Score:** 5.5

**Issue:**
API keys have scopes defined (`scopes: ['defend:text']`) but they're never validated:
```typescript
// Current code - scope check is missing
const keyValidation = await validateApiKey(apiKey);
if (!keyValidation.valid) {
  return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
}
// ❌ No check: if (!keyValidation.apiKey.scopes.includes('defend:text'))
```

**Impact:**
- An API key created with `defend:text` scope can access `defend:audio` endpoint
- No principle of least privilege

**Remediation:**
```typescript
// In each endpoint, check required scope
const requiredScope = 'defend:text'; // or 'defend:audio'
if (!keyValidation.apiKey?.scopes?.includes(requiredScope)) {
  return NextResponse.json({ error: 'API key lacks required scope' }, { status: 403 });
}
```

---

### API-008: Arbitrary Scope Values Allowed (MEDIUM)

**File:** `app/api/keys/route.ts:9`

**Severity:** MEDIUM
**CVSS Score:** 4.0

**Issue:**
```typescript
const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.string()).optional(),  // Any string allowed!
  expiresInDays: z.number().min(1).max(365).optional(),
});
```

Users can create API keys with arbitrary scope strings, including fake scopes or injection attempts.

**Remediation:**
```typescript
const VALID_SCOPES = ['defend:text', 'defend:audio', 'redteam:run', 'keys:read'] as const;

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(VALID_SCOPES)).optional().default(['defend:text']),
  expiresInDays: z.number().min(1).max(365).optional(),
});
```

---

### API-009: Missing Content-Type Validation (LOW)

**All POST routes**

**Severity:** LOW
**CVSS Score:** 3.1

**Issue:**
Routes call `request.json()` without validating Content-Type header:
```typescript
const body = await request.json();  // May throw on non-JSON
```

If non-JSON content is sent, this throws an unhandled exception.

**Remediation:**
```typescript
const contentType = request.headers.get('content-type');
if (!contentType?.includes('application/json')) {
  return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
}

let body;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
}
```

---

### API-010: Potential Information Disclosure in Error Logs (LOW)

**Multiple files**

**Severity:** LOW
**CVSS Score:** 2.5

**Issue:**
```typescript
console.error('Create API key error:', error);
console.error('Admin stats error:', error);
```

Full error objects (potentially including stack traces, database info) are logged. While not exposed to clients, this could leak sensitive info in logs.

**Remediation:**
Log structured errors without full stack traces in production:
```typescript
console.error('Create API key error:', {
  message: error instanceof Error ? error.message : 'Unknown error',
  code: (error as any)?.code,
  // Don't log: stack, sql query, etc.
});
```

---

### API-011: Login Reveals Admin Status (LOW)

**File:** `app/api/auth/login/route.ts:96-103`

**Severity:** LOW
**CVSS Score:** 2.3

**Issue:**
```typescript
return NextResponse.json({
  success: true,
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,  // Reveals 'admin' status
  },
  redirectTo: user.role === 'admin' ? '/admin' : '/dashboard',  // Also reveals
});
```

**Impact:**
Attackers can identify admin accounts by checking the response.

**Remediation:**
Consider not exposing role in login response; instead fetch it separately if needed for UI.

---

### API-012: Redteam Config Accepts Arbitrary Data (LOW)

**File:** `app/api/redteam/route.ts:17`

**Severity:** LOW
**CVSS Score:** 2.0

**Issue:**
```typescript
const createScanSchema = z.object({
  // ...
  config: z.record(z.unknown()).optional(),  // Any object allowed
});
```

Arbitrary data can be stored in the config field. While stored in JSONB and not executed, it could be used for:
- Storage abuse (large objects)
- XSS if config is rendered unsanitized

**Remediation:**
Define expected config structure or limit size:
```typescript
config: z.object({
  timeout: z.number().max(3600).optional(),
  retries: z.number().max(5).optional(),
}).optional(),
```

---

## Summary Table

| ID | Severity | Component | Issue | Status |
|----|----------|-----------|-------|--------|
| API-001 | HIGH | admin.ts | SQL injection in search | **FIXED** |
| API-002 | HIGH | audio/route.ts | No body size limit | **FIXED** |
| API-003 | MEDIUM | middleware.ts | X-Forwarded-For bypass | **FIXED** |
| API-004 | MEDIUM | middleware.ts | In-memory rate limiting | OPEN (requires Redis) |
| API-005 | MEDIUM | middleware.ts | Incomplete rate limit coverage | **FIXED** |
| API-006 | MEDIUM | next.config.js | No CORS configuration | **FIXED** |
| API-007 | MEDIUM | defend routes | Scopes not enforced | **FIXED** |
| API-008 | MEDIUM | keys/route.ts | Arbitrary scopes allowed | **FIXED** |
| API-009 | LOW | All POST routes | No Content-Type validation | **FIXED** (defend routes) |
| API-010 | LOW | Multiple | Info in error logs | **FIXED** |
| API-011 | LOW | login/route.ts | Admin status exposed | **FIXED** |
| API-012 | LOW | redteam/route.ts | Arbitrary config object | **FIXED** |

---

## Checklist Results

- [x] Missing authentication on protected endpoints - **PASS** (all routes check auth)
- [x] Input validation (using Zod or similar) - **PASS** (Zod used throughout)
- [x] SQL injection (Supabase query construction) - **FOUND** (API-001)
- [x] NoSQL injection - **N/A** (using PostgreSQL via Supabase)
- [x] Request body size limits - **MISSING** (API-002)
- [x] Rate limiting effectiveness and bypass potential - **FOUND** (API-003, API-004, API-005)
- [x] API key validation and scoping - **FOUND** (API-007, API-008)
- [x] CORS configuration - **MISSING** (API-006)
- [x] Error message information disclosure - **MINOR** (API-010)
- [x] Sensitive data in responses - **MINOR** (API-011)
- [x] HTTP method restrictions - **PASS** (Next.js handles)
- [x] Content-Type validation - **MISSING** (API-009)

---

## Positive Security Findings

1. **Authentication**: All protected routes properly check session/API key
2. **Zod Validation**: Comprehensive input validation on all endpoints
3. **API Key Hashing**: Keys are properly hashed before storage
4. **Secret Key Exposure**: API key secret returned only once at creation
5. **Timing-Safe Comparison**: Demo key uses constant-time comparison
6. **Password Enumeration**: Login uses generic error message
7. **IDOR Protection**: Ownership checks (org_id) on all data access
8. **Security Headers**: Good set of headers in next.config.js

---

## Priority Remediation Order

1. **API-001** - SQL injection in admin search (HIGH)
2. **API-002** - Request body size limits (HIGH)
3. **API-007** - Enforce API key scopes (MEDIUM)
4. **API-003** - Fix X-Forwarded-For handling (MEDIUM)
5. **API-006** - Add CORS configuration (MEDIUM)
6. **API-004/005** - Improve rate limiting (MEDIUM)
7. **API-008** - Validate scope values (MEDIUM)
8. Remaining LOW items as time permits

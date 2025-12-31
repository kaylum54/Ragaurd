# API Response & Data Exposure Security Audit Report

**Date:** 2024-12-31
**Scope:** API responses, client-side data handling, logging, and secrets management
**Auditor:** Claude Code Security Review

---

## Executive Summary

This audit reviewed API responses, logging practices, and client-side data handling for potential data exposure issues. **3 issues were identified and fixed**, with several existing security measures validated as properly implemented.

### Issues by Severity:
- **0 CRITICAL**
- **2 MEDIUM** - Fixed
- **1 LOW** - Fixed

---

## Vulnerability Details

### DATA-001: Hardcoded Internal IP Addresses (MEDIUM) - FIXED

**Files:**
- `lib/services/defense/text.ts:3`
- `app/(admin)/admin/page.tsx:17-22`
- `app/(admin)/admin/system/page.tsx:25-76`

**Severity:** MEDIUM
**CVSS Score:** 4.3

**Issue:**
Internal service IP addresses (AWS EC2 instances) were hardcoded in source code and displayed in the admin dashboard.

```typescript
// Before:
const DEFENSE_SERVICE_URL = process.env.RAGAURD_DEFENSE_URL || 'http://3.18.141.124:9000';

// Admin page displayed IPs:
{ name: 'Text Defense (3.18.141.124)', status: 'healthy' }
```

**Impact:**
- Infrastructure enumeration by attackers
- Potential direct attacks on internal services
- Information disclosure about deployment architecture

**Remediation Applied:**
```typescript
// After:
const DEFENSE_SERVICE_URL = process.env.RAGAURD_DEFENSE_URL || 'http://localhost:9000';

// Admin page now shows:
{ name: 'Text Defense', status: 'healthy' }
{ endpoint: 'AWS us-east-2' }  // Generic region only
```

---

### DATA-002: PII in Production Logs (MEDIUM) - FIXED

**Files:**
- `lib/services/db/users.ts`
- `lib/services/db/api-keys.ts`
- `lib/services/db/organizations.ts`
- `lib/services/db/redteam.ts`
- `lib/services/db/request-log.ts`
- `lib/services/db/usage.ts`
- `lib/services/db/admin.ts`

**Severity:** MEDIUM
**CVSS Score:** 4.0

**Issue:**
Database services used `console.error(error)` which logs full error objects including potentially sensitive query details and user data.

```typescript
// Before:
console.error('Error fetching user by email:', error);
```

**Impact:**
- PII (email addresses, user IDs) could appear in logs
- Database query parameters exposed
- Error stack traces with sensitive context

**Remediation Applied:**
All files updated to use the `logError()` utility from `lib/utils/safe-error.ts`:

```typescript
// After:
import { logError } from '@/lib/utils/safe-error';
logError('Error fetching user by email', error);
```

The `logError` function:
- Strips stack traces in production
- Only logs message, name, and code
- Full error details available in development only

---

### DATA-003: Sensitive Fields in Admin API Responses (LOW) - FIXED

**Files:**
- `lib/services/db/admin.ts`

**Severity:** LOW
**CVSS Score:** 3.1

**Issue:**
Admin endpoints returned full database records including internal fields:
- `auth0_id` - External identity provider ID
- `stripe_customer_id` - Payment provider ID
- `stripe_subscription_id` - Payment subscription ID
- `billing_email` - Customer billing email

**Impact:**
- Unnecessary exposure of third-party service identifiers
- Cross-reference attacks if logs are compromised
- Minimal practical risk (admin-only access)

**Remediation Applied:**
Created sanitized return types that explicitly exclude sensitive fields:

```typescript
// New safe types
export interface SafeUserWithOrg {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  // auth0_id intentionally excluded
  organizations?: { name: string; plan: string }[];
}

export interface SafeOrgWithStats {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: string;
  created_at: string;
  updated_at: string;
  // stripe_customer_id, stripe_subscription_id, billing_email intentionally excluded
  memberCount?: number;
  totalRequests?: number;
}
```

---

## Checklist Results

### Sensitive Data in API Responses
- [x] Passwords - **PASS** (never stored or returned)
- [x] Session tokens - **PASS** (httpOnly cookie, not in response body)
- [x] Internal IDs - **FIXED** (auth0_id, stripe IDs now excluded)
- [x] API key hashes - **PASS** (only prefix returned: `rg_live_xxx...`)

### PII Exposure in Logs
- [x] User data - **FIXED** (using `logError()` utility)
- [x] Email addresses - **FIXED** (sanitized error logging)
- [x] IP addresses - **PASS** (only for rate limiting, not logged permanently)

### API Key Exposure
- [x] Full keys vs prefixes - **PASS**
  - `secretKey` only returned once at creation
  - List endpoint returns only `key_prefix`
  - Hash stored in database, never exposed

### User Data Leakage Between Organizations
- [x] Dashboard endpoints - **PASS** (all queries filter by `org_id`)
- [x] Request logs - **PASS** (scoped to session orgId)
- [x] Usage data - **PASS** (scoped to session orgId)
- [x] API keys - **PASS** (scoped to session orgId)
- [x] Red team scans - **PASS** (scoped to session orgId)

### Debug Information in Production
- [x] Error messages - **PASS** (generic messages to clients)
- [x] Stack traces - **PASS** (stripped via `logError()`)
- [x] Development warnings - **PASS** (NODE_ENV checked)

### Source Maps
- [x] Production source maps - **PASS** (not configured)
- [x] `productionBrowserSourceMaps` - **PASS** (not enabled)

### Environment Variables in Client Bundles
- [x] `NEXT_PUBLIC_*` variables - **PASS** (only safe values)
  - `NEXT_PUBLIC_SUPABASE_URL` - Public API endpoint
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key (RLS protected)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public Stripe key
  - `NEXT_PUBLIC_APP_URL` - Application URL
  - `NEXT_PUBLIC_SENTRY_DSN` - Sentry endpoint
- [x] Secret keys - **PASS** (all use non-NEXT_PUBLIC_ names)

### Hardcoded Secrets or Credentials
- [x] API keys - **PASS** (all from env vars)
- [x] Passwords - **PASS** (demo credentials from env vars)
- [x] Service URLs - **FIXED** (fallback changed to localhost)

---

## Positive Security Findings

1. **API Key Security**
   - Keys use secure `rg_live_` / `rg_test_` prefixes
   - Full key only shown once at creation
   - Keys are hashed with SHA-256 before storage
   - Timing-safe comparison for demo key validation

2. **Session Security**
   - JWT tokens stored in httpOnly, secure cookies
   - Session data not exposed in API responses
   - Role not exposed in login response (prevents admin enumeration)

3. **Organization Isolation**
   - All data endpoints filter by `orgId` from session
   - No cross-organization data leakage possible
   - Consistent pattern across all routes

4. **Safe Error Handling**
   - `lib/utils/safe-error.ts` strips sensitive info
   - Production logs sanitized automatically
   - Generic error messages to clients

5. **Environment Variable Hygiene**
   - All secrets use non-NEXT_PUBLIC_ names
   - Demo credentials require explicit env var configuration
   - Clear .env.example documentation

---

## Summary Table

| ID | Severity | Component | Issue | Status |
|----|----------|-----------|-------|--------|
| DATA-001 | MEDIUM | Services/Admin UI | Hardcoded IP addresses | **FIXED** |
| DATA-002 | MEDIUM | DB Services | PII in production logs | **FIXED** |
| DATA-003 | LOW | Admin API | Sensitive fields exposed | **FIXED** |

---

## Files Modified

| File | Change |
|------|--------|
| `lib/services/defense/text.ts` | Removed hardcoded IP fallback |
| `app/(admin)/admin/page.tsx` | Removed IPs from system status |
| `app/(admin)/admin/system/page.tsx` | Replaced IPs with region labels |
| `lib/services/db/users.ts` | Use logError instead of console.error |
| `lib/services/db/api-keys.ts` | Use logError instead of console.error |
| `lib/services/db/organizations.ts` | Use logError instead of console.error |
| `lib/services/db/redteam.ts` | Use logError instead of console.error |
| `lib/services/db/request-log.ts` | Use logError instead of console.error |
| `lib/services/db/usage.ts` | Use logError instead of console.error |
| `lib/services/db/admin.ts` | Use logError + sanitized response types |

---

## Recommendation

All identified issues have been fixed. The codebase demonstrates good security practices for data exposure prevention. Ongoing recommendations:

1. **Monitoring**: Consider adding audit logging for admin data access
2. **Review**: Periodically review new endpoints for data exposure
3. **Testing**: Add security tests for response payload validation

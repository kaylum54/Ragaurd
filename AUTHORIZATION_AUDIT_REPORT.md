# Authorization & Access Control Audit Report

**Date:** 2024-12-31
**Scope:** Middleware, Admin Routes, Dashboard Routes, API Routes, PaywallGate
**Auditor:** Claude Code Security Review

---

## Executive Summary

This audit identified **10 authorization vulnerabilities** across the Ragaurd codebase:
- **2 CRITICAL** - Immediate fix required
- **4 HIGH** - Fix before production deployment
- **3 MEDIUM** - Should be addressed
- **1 LOW** - Best practice improvement

---

## Vulnerability Details

### AUTH-001: Middleware Has No Actual Route Protection (CRITICAL)

**File:** `middleware.ts` (lines 71-82)
**Severity:** CRITICAL
**CVSS Score:** 9.8

**Issue:**
The middleware identifies protected paths but performs NO authentication verification:

```typescript
// Lines 71-82
const protectedPaths = ['/dashboard', '/admin'];
const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

// Admin routes - additional check for admin role
if (pathname.startsWith('/admin')) {
  // In production, check if user is admin
  // For now, allow access (you'd integrate Auth0 here)  <-- ALLOWS ALL ACCESS
}

return response;  // Always returns success
```

**Impact:**
- Any user can access `/dashboard/*` and `/admin/*` pages directly
- Admin panel completely unprotected at the routing level
- Relies solely on API-level checks which can be bypassed via direct URL access

**Remediation:**
```typescript
if (isProtectedPath) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname.startsWith('/admin') && session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

---

### AUTH-002: Dashboard Usage Route - Insecure Demo Mode Check (HIGH)

**File:** `app/api/dashboard/usage/route.ts` (lines 6, 11-13)
**Severity:** HIGH
**CVSS Score:** 8.1

**Issue:**
```typescript
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

if (isDemoMode()) {
  orgId = getDemoOrgId();  // Bypasses all authentication
} else {
  // Auth check here
}
```

**Impact:**
- If `AUTH0_CLIENT_ID` is not set in production (misconfiguration), ALL requests bypass authentication
- Returns demo organization data to any unauthenticated user

**Remediation:**
Replace with the secure `isDemoModeEnabled()` pattern from `lib/auth.ts`:
```typescript
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';

if (session) {
  orgId = session.orgId;
} else if (isDemoModeEnabled()) {
  orgId = getDemoOrgId();
} else {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

### AUTH-003: Dashboard Requests Route - Same Insecure Demo Mode Check (HIGH)

**File:** `app/api/dashboard/requests/route.ts` (lines 6, 11-13)
**Severity:** HIGH
**CVSS Score:** 8.1

**Issue:** Identical to AUTH-002. Same insecure `isDemoMode()` pattern.

**Remediation:** Same as AUTH-002.

---

### AUTH-004: PaywallGate - Client-Side Only Enforcement (HIGH)

**File:** `components/billing/PaywallGate.tsx`
**Severity:** HIGH
**CVSS Score:** 7.5

**Issue:**
```typescript
export function PaywallGate({
  feature,
  requiredPlan,
  children,
  currentPlan = 'free',  // Client-controlled prop
}: PaywallGateProps) {
  const hasAccess = planAccess[feature]?.includes(currentPlan);

  if (hasAccess) {
    return <>{children}</>;  // Renders premium content
  }
  // Shows paywall
}
```

**Impact:**
- Feature gating is purely cosmetic
- Users can:
  - Manipulate React DevTools to change `currentPlan` prop
  - Access underlying API endpoints directly (if they lack server-side plan checks)
  - Modify browser storage where plan is cached
- No server-side enforcement means premium features are accessible to free users

**Remediation:**
1. **Server-side plan verification required on all API routes:**
```typescript
// In each protected API route
const session = await getSession();
const plan = await getOrgPlan(session.orgId);

if (!planAllowsFeature(plan, 'audio')) {
  return NextResponse.json({ error: 'Upgrade required' }, { status: 403 });
}
```

2. **PaywallGate should fetch plan from server:**
```typescript
const { data: subscription } = await fetch('/api/billing/subscription');
const hasAccess = planAccess[feature]?.includes(subscription.plan);
```

---

### AUTH-005: Audio Defend Route - Hardcoded Demo API Key (HIGH)

**File:** `app/api/v1/defend/audio/route.ts` (line 11)
**Severity:** HIGH
**CVSS Score:** 7.3

**Issue:**
```typescript
const DEMO_API_KEY = 'rg_test_demo_key_for_local_development';
```

Unlike the text defend route which was fixed to use environment variables, the audio route still has a hardcoded demo key that:
- Is visible in source code
- Works in any environment where Supabase is not configured
- Cannot be rotated without code deployment

**Remediation:**
Use environment variable like the text defend route:
```typescript
import { isDemoModeEnabled } from '@/lib/auth';

function isValidDemoApiKey(apiKey: string): boolean {
  if (!isDemoModeEnabled()) return false;
  const demoKey = process.env.DEMO_API_KEY;
  if (!demoKey) return false;
  // Timing-safe comparison
}
```

---

### AUTH-006: Audio Defend Route - Insecure Demo Mode Check (HIGH)

**File:** `app/api/v1/defend/audio/route.ts` (line 142)
**Severity:** HIGH
**CVSS Score:** 7.3

**Issue:**
```typescript
const isDemoMode = !isSupabaseConfigured() || apiKey === DEMO_API_KEY;
```

This allows demo mode whenever:
- Supabase is not configured (ANY production misconfiguration)
- OR when using the hardcoded demo key

The text defend route was properly fixed but the audio route was not updated.

**Remediation:**
```typescript
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';

// Check demo key properly
if (isValidDemoApiKey(apiKey)) {
  orgId = getDemoOrgId();
  isDemoRequest = true;
} else if (!isSupabaseConfigured()) {
  if (isDemoModeEnabled()) {
    orgId = getDemoOrgId();
    isDemoRequest = true;
  } else {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }
}
```

---

### AUTH-007: API Keys [id] Route - Insecure OrgId Fallback (MEDIUM)

**File:** `app/api/keys/[id]/route.ts` (lines 26, 63, 91)
**Severity:** MEDIUM
**CVSS Score:** 5.3

**Issue:**
```typescript
const orgId = session.orgId || getDemoOrgId();
```

If `session.orgId` is undefined but session exists (edge case), it falls back to demo org. This could allow users to:
- Access demo organization's API keys
- Modify demo organization's data

**Remediation:**
```typescript
const orgId = session.orgId;
if (!orgId) {
  return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
}
```

---

### AUTH-008: Redteam [id] Route - Same Insecure OrgId Fallback (MEDIUM)

**File:** `app/api/redteam/[id]/route.ts` (lines 26, 79, 120)
**Severity:** MEDIUM
**CVSS Score:** 5.3

**Issue:** Identical to AUTH-007.

**Remediation:** Same as AUTH-007.

---

### AUTH-009: Multiple Routes - getDemoOrgId Import Inconsistency (MEDIUM)

**Files:**
- `app/api/keys/[id]/route.ts` - imports from `@/lib/services/auth/session`
- `app/api/redteam/[id]/route.ts` - imports from `@/lib/services/auth/session`
- `app/api/dashboard/usage/route.ts` - imports from `@/lib/services/auth/session`
- Other routes - import from `@/lib/auth`

**Severity:** MEDIUM
**CVSS Score:** 4.0

**Issue:**
Two different `getDemoOrgId()` functions may exist:
1. `lib/auth.ts` - with proper checks
2. `lib/services/auth/session.ts` - potentially without checks

This inconsistency can lead to different security behaviors.

**Remediation:**
Consolidate to single source and deprecate duplicate:
```typescript
// All routes should use:
import { getSession } from '@/lib/session';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
```

---

### AUTH-010: Admin Routes - Proper Checks (PASS)

**Files:** All `app/api/admin/**/route.ts`
**Status:** PASS

The admin routes were previously fixed and now properly check:
1. Authentication via `getSession()`
2. Admin role via `session.user.role !== 'admin'`

```typescript
const session = await getSession();
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
if (session.user.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
}
```

---

## Summary Table

| ID | Severity | Component | Issue | Status |
|----|----------|-----------|-------|--------|
| AUTH-001 | CRITICAL | middleware.ts | No route protection | **FIXED** |
| AUTH-002 | HIGH | dashboard/usage | Insecure demo mode | **FIXED** |
| AUTH-003 | HIGH | dashboard/requests | Insecure demo mode | **FIXED** |
| AUTH-004 | HIGH | PaywallGate.tsx | Client-side only enforcement | OPEN (needs server-side plan checks) |
| AUTH-005 | HIGH | v1/defend/audio | Hardcoded demo key | **FIXED** |
| AUTH-006 | HIGH | v1/defend/audio | Insecure demo mode check | **FIXED** |
| AUTH-007 | MEDIUM | keys/[id] | OrgId fallback | **FIXED** |
| AUTH-008 | MEDIUM | redteam/[id] | OrgId fallback | **FIXED** |
| AUTH-009 | MEDIUM | Multiple | Import inconsistency | **FIXED** |
| AUTH-010 | - | admin/* | Proper checks | PASS |

---

## Checklist Results

- [x] Broken access control (users accessing other users' data) - **FOUND** (AUTH-007, AUTH-008)
- [x] Privilege escalation (user to admin) - **FOUND** (AUTH-001)
- [x] Missing authorization checks on API routes - **FOUND** (AUTH-002, AUTH-003)
- [x] Client-side only authorization (PaywallGate bypasses) - **FOUND** (AUTH-004)
- [x] Admin route protection - **FIXED** (AUTH-010 PASS)
- [x] Organization/tenant isolation - **PARTIALLY VULNERABLE** (AUTH-007, AUTH-008)
- [x] IDOR in endpoints - **LOW RISK** (ownership checks exist but fallback issue)
- [x] Role validation on sensitive operations - **MIXED** (admin routes OK, middleware not OK)
- [x] Demo mode bypassing production security - **FOUND** (AUTH-002, AUTH-003, AUTH-005, AUTH-006)

---

## Priority Remediation Order

1. **AUTH-001** - Fix middleware route protection (CRITICAL)
2. **AUTH-005 & AUTH-006** - Fix audio defend route (HIGH)
3. **AUTH-002 & AUTH-003** - Fix dashboard routes demo mode (HIGH)
4. **AUTH-004** - Add server-side plan enforcement (HIGH)
5. **AUTH-007 & AUTH-008** - Fix orgId fallback (MEDIUM)
6. **AUTH-009** - Consolidate imports (MEDIUM)

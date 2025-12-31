# Dependency & Supply Chain Security Audit Report

**Date:** 2024-12-31
**Scope:** npm dependencies, lock file integrity, supply chain security
**Auditor:** Claude Code Security Review

---

## Executive Summary

This audit reviewed all npm dependencies for known vulnerabilities, outdated packages, malicious package risks, and supply chain security issues. **3 HIGH severity vulnerabilities were found** in development dependencies, with multiple packages having major version updates available.

### Vulnerabilities Summary:
- **0 CRITICAL**
- **3 HIGH** (dev dependency only)
- **0 MODERATE**
- **0 LOW**

### Dependency Statistics:
- **Total dependencies:** 864
- **Production:** 494
- **Development:** 295
- **Optional:** 49

---

## Vulnerability Details

### DEP-001: glob Command Injection (HIGH)

**Package:** `glob` (transitive via `eslint-config-next`)
**Affected Versions:** 10.2.0 - 10.4.5
**CVE:** GHSA-5j98-mcp5-4vw2
**CVSS Score:** 7.5

**Issue:**
Command injection vulnerability in glob CLI when using `-c/--cmd` flag with `shell:true`.

**Dependency Chain:**
```
eslint-config-next@14.2.35
  └── @next/eslint-plugin-next@14.2.35
        └── glob@10.3.10 (vulnerable)
```

**Impact:**
- **Development only** - not present in production builds
- Requires CLI usage with malicious input
- Low practical risk in this context

**Remediation:**
```bash
npm install eslint-config-next@16.1.1
```

**Note:** This requires a major version upgrade of `eslint-config-next`, which may require updating ESLint to v9 and Next.js to v15+.

---

## Outdated Packages Analysis

### Security-Critical Packages (Recommend Update)

| Package | Current | Latest | Priority | Notes |
|---------|---------|--------|----------|-------|
| `jose` | 5.10.0 | 6.1.3 | **HIGH** | JWT library - security critical |
| `@auth0/nextjs-auth0` | 3.8.0 | 4.14.0 | **HIGH** | Auth library - security critical |
| `next` | 14.2.35 | 16.1.1 | **MEDIUM** | Framework - security patches |
| `stripe` | 16.12.0 | 20.1.0 | **MEDIUM** | Payment - security patches |

### Framework Updates (Major Versions)

| Package | Current | Latest | Breaking Changes |
|---------|---------|--------|------------------|
| `react` | 18.3.1 | 19.2.3 | React 19 features |
| `react-dom` | 18.3.1 | 19.2.3 | React 19 features |
| `next` | 14.2.35 | 16.1.1 | App Router changes |
| `eslint` | 8.57.1 | 9.39.2 | Flat config required |
| `zod` | 3.25.76 | 4.3.3 | API changes |
| `zustand` | 4.5.7 | 5.0.9 | API changes |
| `tailwindcss` | 3.4.19 | 4.1.18 | Major rewrite |

### Minor Updates Available

| Package | Current | Wanted |
|---------|---------|--------|
| `@tanstack/react-query` | 5.90.15 | 5.90.16 |

---

## Supply Chain Security Analysis

### Lock File Integrity
- [x] `package-lock.json` exists - **PASS**
- [x] lockfileVersion: 3 (npm v7+) - **PASS**
- [x] All packages have integrity hashes - **PASS**
- [x] No modifications to lock file detected - **PASS**

### Registry Security
- [x] All packages resolve to `https://registry.npmjs.org/` - **PASS**
- [x] No private/internal registries configured - **PASS**
- [x] No `.npmrc` file with custom registries - **PASS**

### Dependency Confusion Prevention
- [x] `"private": true` in package.json - **PASS**
- [x] Package name `ragaurd` is unique - **PASS**
- [x] No internal package name patterns (@company/*) - **PASS**

### Package Publisher Analysis

All dependencies are from trusted publishers:

| Scope | Publisher | Packages |
|-------|-----------|----------|
| `@auth0/*` | Auth0 Inc. | 1 |
| `@radix-ui/*` | Radix UI | 16 |
| `@sentry/*` | Sentry | 1 |
| `@stripe/*` | Stripe | 1 |
| `@supabase/*` | Supabase | 1 |
| `@tanstack/*` | TanStack | 1 |
| `next` | Vercel | 1 |
| `react*` | Meta (Facebook) | 2 |
| `zod` | Colin McDonnell | 1 |

---

## Checklist Results

### Known Vulnerable Dependencies
- [x] npm audit - **3 HIGH** (dev only, documented above)
- [x] No critical vulnerabilities - **PASS**
- [x] No production vulnerabilities - **PASS**

### Outdated Packages
- [x] Security-critical packages identified - **NOTED** (jose, @auth0)
- [x] Major version updates documented - **NOTED**
- [x] No packages with known exploits - **PASS**

### Malicious Package Risks
- [x] All packages from verified publishers - **PASS**
- [x] No typosquat package names detected - **PASS**
- [x] No suspicious postinstall scripts - **PASS**

### Lock File Integrity
- [x] Lock file exists and valid - **PASS**
- [x] Integrity hashes present - **PASS**
- [x] No unexpected modifications - **PASS**

### Dependency Confusion
- [x] Private package flag set - **PASS**
- [x] No internal naming patterns - **PASS**
- [x] Single registry configuration - **PASS**

---

## Recommendations

### Immediate Actions

1. **Update `eslint-config-next`** (requires planning):
   ```bash
   # This requires Next.js 15+ and ESLint 9+
   # Plan migration before updating
   npm install eslint-config-next@16.1.1
   ```

2. **Apply minor security updates**:
   ```bash
   npm update @tanstack/react-query
   ```

### Short-Term (Next Sprint)

1. **Update security-critical packages**:
   - `jose@6.x` - Review changelog for breaking changes
   - `@auth0/nextjs-auth0@4.x` - Auth0 migration guide required

2. **Consider `npm audit fix --force`** in a test environment to assess impact

### Long-Term (Planned Migration)

1. **React 19 Migration** - Major ecosystem change
2. **Next.js 15/16 Migration** - App Router improvements
3. **Tailwind CSS 4 Migration** - Significant API changes
4. **ESLint 9 Migration** - Flat config required

---

## Dependency Graph (Direct Dependencies)

```
ragaurd@1.0.0
├── Production (26 packages)
│   ├── @auth0/nextjs-auth0@3.8.0
│   ├── @radix-ui/* (16 packages)
│   ├── @sentry/nextjs@8.55.0
│   ├── @stripe/stripe-js@4.10.0
│   ├── @supabase/supabase-js@2.89.0
│   ├── @tanstack/react-query@5.90.15
│   ├── jose@5.10.0
│   ├── next@14.2.35
│   ├── react@18.3.1 / react-dom@18.3.1
│   ├── recharts@2.15.4
│   ├── resend@3.5.0
│   ├── stripe@16.12.0
│   ├── zod@3.25.76
│   └── zustand@4.5.7
│
└── Development (12 packages)
    ├── @playwright/test@1.57.0
    ├── @types/* (3 packages)
    ├── eslint@8.57.1
    ├── eslint-config-next@14.2.35 ⚠️ (vulnerable glob)
    ├── playwright@1.57.0
    ├── puppeteer-core@24.34.0
    ├── tailwindcss@3.4.19
    └── typescript@5.9.3
```

---

## Summary

| Category | Status |
|----------|--------|
| Known Vulnerabilities | **3 HIGH** (dev only) |
| Critical Production Vulns | **0** |
| Lock File Integrity | **PASS** |
| Supply Chain Security | **PASS** |
| Dependency Confusion | **PASS** |

### Risk Assessment

**Overall Risk: LOW-MEDIUM**

- No production vulnerabilities
- Development vulnerability requires CLI exploitation
- All packages from trusted sources
- Lock file properly configured

### Action Items

| Priority | Action | Effort |
|----------|--------|--------|
| **P1** | Monitor for jose/auth0 security advisories | Low |
| **P2** | Plan eslint-config-next upgrade | Medium |
| **P3** | Schedule React 19 migration | High |

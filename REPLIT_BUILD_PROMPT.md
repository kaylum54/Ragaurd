# Ragaurd Frontend SaaS Build Prompt

## Project Overview

Build **Ragaurd** - a Voice AI Security Infrastructure SaaS platform. This is a B2B security product that protects voice AI agents from prompt injection, jailbreaking, deepfake audio, and other attacks through a real-time API.

**Core Value Proposition:** One API call that sits between user input and your voice AI agent, blocking attacks before they reach your LLM.

---

## Tech Stack Requirements

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Radix UI (headless) + shadcn/ui patterns
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** Zustand (client state) + TanStack React Query (server state)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Auth0 (with demo fallback for development)
- **Payments:** Stripe
- **Email:** Resend

---

## Design System

### Color Palette

```css
/* Primary Colors */
--primary: #2563EB;           /* CTAs, links, accents */
--primary-hover: #1D4ED8;     /* CTA hover state */

/* Backgrounds */
--bg-dark: #0B1220;           /* Hero, dark sections */
--bg-light: #F9FAFB;          /* Content sections */
--bg-card: #FFFFFF;           /* Cards on light bg */
--bg-card-dark: #111827;      /* Cards on dark bg */
--bg-footer: #020617;         /* Footer */

/* Text Colors */
--text-dark-bg: #E5E7EB;      /* Body text on dark */
--text-dark-muted: #9CA3AF;   /* Muted text on dark */
--text-light-bg: #020617;     /* Body text on light */
--text-light-muted: #64748B;  /* Muted text on light */

/* Status Colors */
--status-blocked: #DC2626;    /* Red - threat blocked */
--status-passed: #16A34A;     /* Green - passed */
--status-warning: #D97706;    /* Amber - warning */

/* Dashboard Palette (Midnight Blue + Steel Gray) */
--midnight-50 to --midnight-950 (slate scale)
```

### Typography

```css
font-family: 'Inter', -apple-system, sans-serif;
font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Sizes */
--text-hero: 3.5rem (56px);
--text-h1: 2.5rem (40px);
--text-h2: 1.5rem (24px);
--text-body: 1.125rem (18px);
--text-small: 0.875rem (14px);
```

### Design Principles

- **Enterprise-grade aesthetic** - Dense, operational, SOC console feel for dashboard
- **Clean marketing pages** - Professional, trust-building, no gimmicks
- **Minimal shadows** - Prefer borders over shadows
- **Sharp corners** - Max border-radius of 6-8px
- **No animations except:** subtle fade-ins (200ms) and hover transitions (150ms)

---

## Complete Page Structure

### 1. Marketing Pages (Public)

#### Homepage `/`
- **Hero Section** (dark bg #0B1220)
  - Headline: "Your Voice Agents Are Unprotected"
  - Subheadline explaining the product
  - Two CTAs: "Start Free" (primary) + "View Documentation" (outline)
  - Stats bar: 99.53% attack block rate, 0.00% false positives, <200ms latency, 6 defense layers

- **Problem Section** (light bg #F9FAFB)
  - Header: "Voice AI Has a Security Gap"
  - 6 threat cards: Prompt Injection, Jailbreaking, Data Exfiltration, Deepfake Audio, Identity Manipulation, Compliance Failure

- **Why Now Section** (dark bg)
  - Two-column: Copy explaining timing + Risk timeline graphic (2024-2026)

- **Solution Section** (light bg)
  - Header: "One API. Six Layers of Defense."
  - Architecture diagram: User Input → Ragaurd API → Your Agent
  - 6 defense layer cards with descriptions
  - Code integration example

- **Red Team Section** (dark bg)
  - Stats: 4,900+ attack probes, 13 threat categories, Continuous monitoring
  - Two-column test coverage list
  - Tools badge: "Built on NVIDIA Garak + Microsoft PyRIT"

- **Trust Section** (light bg)
  - Metrics table with performance data
  - Methodology note
  - Honest disclaimer about not claiming 100% protection

- **Pricing Section** (dark bg)
  - 5 pricing cards: Free, Starter ($79), Pro ($249 - recommended), Business ($649), Enterprise (custom)
  - Feature lists with checkmarks

- **FAQ Section** (light bg)
  - Accordion-style questions

- **Final CTA Section** (dark bg)
  - "Your Agents Are Live. Your Security Should Be Too."

- **Footer** (darker bg #020617)
  - Logo + tagline
  - Product links, Company links, Legal links
  - Copyright

#### Pricing Page `/pricing`
- Detailed pricing comparison table
- Feature breakdown by plan
- FAQ specific to pricing
- Enterprise contact form

#### Documentation Hub `/docs`
- Sidebar navigation
- Quick start guide
- API reference
- Integration guides

#### Sub-documentation Pages:
- `/docs/quickstart` - Getting started in 5 minutes
- `/docs/api` - Full API reference with code examples
- `/docs/text-defense` - Text defense documentation
- `/docs/audio-defense` - Audio/deepfake detection docs
- `/docs/red-team` - Red team testing documentation

---

### 2. Authentication Pages

#### Login `/login`
- Email + password form
- "Remember me" checkbox
- "Forgot password" link
- Social login options (future)
- Link to signup

#### Signup `/signup`
- Email, password, confirm password
- Terms acceptance checkbox
- Plan selection (optional pre-selection via query param)
- Link to login

---

### 3. User Dashboard Pages (Protected - requires auth)

#### Main Dashboard `/dashboard`
**Layout:** Sidebar + Header + Main content area

**Sidebar Navigation:**
- Dashboard (home icon)
- Defense
  - Text Defense
  - Audio Defense
- Red Team
- API Keys
- Usage
- Billing
- Team
- Settings

**Dashboard Home Content:**
- Welcome message with user name
- Quick stats cards:
  - Total Requests (with trend)
  - Blocked Threats (with trend)
  - Block Rate %
  - Avg Latency (ms)
  - Active API Keys
  - Team Members
- Usage progress bar (requests used / plan limit)
- Usage chart (daily requests over last 7-30 days)
- Recent requests table (last 10-20 requests)
- Quick actions: Create API Key, Run Red Team Scan, View Docs

#### Defense Overview `/dashboard/defense`
- Defense status overview
- Links to Text and Audio defense testers
- Recent defense activity

#### Text Defense Tester `/dashboard/defense/text`
- Input textarea for testing text
- Profile selector: Strict, Balanced, Permissive
- "Analyze" button
- Results panel showing:
  - Status: BLOCKED or PASSED
  - Threat category (if blocked)
  - Confidence score
  - Latency
  - Layer-by-layer breakdown (6 layers)
- Recent test history

#### Audio Defense Tester `/dashboard/defense/audio`
- Audio file upload (WAV, MP3, OGG, WebM)
- OR Audio recording interface
- "Analyze" button
- Results panel showing:
  - Authenticity score
  - Deepfake probability
  - Model scores (AASIST, LCNN)
  - Transcription (if available)
  - Text analysis of transcription (if enabled)
- Recent analysis history

#### Red Team Scans `/dashboard/redteam`
- List of all scans with status badges
- Stats summary: Total scans, Average block rate
- "New Scan" button
- Table columns: Name, Status, Target, Attacks, Block Rate, Created, Actions

#### New Red Team Scan `/dashboard/redteam/new`
- Form fields:
  - Scan name
  - Target endpoint URL
  - Attack suite: Basic (50 attacks), Standard (200), Comprehensive (500), Custom
  - Custom attack categories (if Custom selected)
- "Start Scan" button
- Estimated duration display

#### Red Team Scan Details `/dashboard/redteam/[id]`
- Scan header: Name, Status, Target
- Progress bar (if running)
- Results summary:
  - Total attacks run
  - Blocked / Passed / Errors
  - Block rate percentage
  - Average latency
- Category breakdown chart/table
- Vulnerabilities found list
- Recommendations
- Export report button (JSON/PDF)
- Re-run scan button

#### API Keys `/dashboard/api-keys`
- List of API keys with:
  - Name
  - Key prefix (rg_live_xxxx... or rg_test_xxxx...)
  - Scopes
  - Rate limit
  - Last used
  - Status (Active/Revoked)
  - Actions (Revoke, Delete)
- "Create New Key" button → Modal:
  - Key name
  - Key type (Live/Test)
  - Scopes checkboxes
  - Rate limit input
  - Expiration date (optional)
  - **IMPORTANT:** Show full key ONCE on creation with copy button

#### Usage Analytics `/dashboard/usage`
- Date range selector
- Usage chart (line/bar) showing:
  - Text requests
  - Audio requests
  - Red team attacks
  - Blocked count
- Plan limits comparison
- Usage by day table
- Export data button

#### Billing `/dashboard/billing`
- Current plan card with:
  - Plan name and price
  - Next billing date
  - Payment method
- Plan comparison/upgrade section
- Invoice history table
- "Manage Subscription" → Stripe Customer Portal
- "Update Payment Method" → Stripe

#### Team Management `/dashboard/team`
- Team members list:
  - Name, Email, Role, Joined date
  - Role badges: Owner, Admin, Member, Viewer
- "Invite Member" button → Modal:
  - Email input
  - Role selector
- Role permissions matrix display
- Remove member action (with confirmation)

#### Settings `/dashboard/settings`
- **Organization Settings:**
  - Organization name
  - Slug
  - Billing email
- **Security Settings:**
  - Change password
  - Two-factor authentication (future)
  - Session management
- **Notification Preferences:**
  - Email notifications toggles
  - Webhook URL for alerts
- **Danger Zone:**
  - Delete organization (with confirmation)

---

### 4. Admin Dashboard Pages (Protected - requires admin role)

**Admin credentials for testing:**
- Email: `admin@ragaurd.com`
- Password: `Ragaurd2024!`

#### Admin Overview `/admin`
- Platform stats cards:
  - Total Users
  - Total Organizations
  - Active Subscriptions
  - Monthly Recurring Revenue (MRR)
  - Total Requests (all time)
  - Blocked Threats (all time)
- Quick links to admin sections
- Recent activity feed

#### User Management `/admin/users`
- Search bar (by email or name)
- Paginated users table:
  - Name, Email, Organization, Role, Created, Last Active
- User actions: View details, Impersonate (future), Suspend, Delete
- Export users button

#### Organization Management `/admin/organizations`
- Search bar
- Paginated organizations table:
  - Name, Slug, Owner, Plan, Members, Total Requests, Created
- Organization actions: View details, Change plan, Suspend, Delete
- Export organizations button

#### Revenue Dashboard `/admin/revenue`
- Key metrics cards:
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - Average Revenue Per User (ARPU)
  - Churn Rate
- MRR chart (12 months history)
- Revenue by plan breakdown (pie chart)
- Recent transactions table
- Export revenue data

#### Platform Usage `/admin/usage`
- Platform-wide usage chart
- Top organizations by usage table
- Usage growth metrics
- Resource utilization
- Error rates and system health indicators

#### System Health `/admin/system`
- Service status indicators (API, Database, External services)
- Recent errors/incidents
- Configuration overview
- Environment variables (masked)
- Cache/queue status
- Manual actions: Clear cache, Restart services (future)

---

## API Endpoints Reference

The frontend will connect to these API endpoints:

### Authentication
```
POST /api/auth/login        - Login with email/password
POST /api/auth/logout       - Logout and clear session
GET  /api/auth/me           - Get current user session
```

### Defense APIs
```
POST /api/v1/defend         - Text defense analysis
  Body: { input: string, profile: "strict"|"balanced"|"permissive" }
  Headers: { Authorization: "Bearer <api_key>" }

POST /api/v1/defend/audio   - Audio deepfake detection
  Body: { audio_data: base64, format: "wav"|"mp3"|"ogg"|"webm" }
  Headers: { Authorization: "Bearer <api_key>" }
```

### Red Team
```
GET    /api/redteam         - List scans for org
POST   /api/redteam         - Create new scan
GET    /api/redteam/[id]    - Get scan details
PATCH  /api/redteam/[id]    - Update scan (start/stop)
DELETE /api/redteam/[id]    - Delete scan
```

### API Keys
```
GET    /api/keys            - List API keys
POST   /api/keys            - Create new key (returns secret once)
GET    /api/keys/[id]       - Get key details
PATCH  /api/keys/[id]       - Revoke key
DELETE /api/keys/[id]       - Delete key
```

### Dashboard Data
```
GET /api/dashboard/stats    - Overview statistics
GET /api/dashboard/usage    - Usage analytics
GET /api/dashboard/requests - Recent requests log
```

### Admin (requires admin role)
```
GET /api/admin/stats        - Platform statistics
GET /api/admin/users        - List all users
GET /api/admin/organizations- List all organizations
GET /api/admin/usage        - Platform usage data
GET /api/admin/revenue      - Revenue analytics
```

---

## Database Schema

### Core Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth0_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations (multi-tenant)
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id),
  plan TEXT DEFAULT 'free', -- free, starter, pro, business, enterprise
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization Members
CREATE TABLE org_members (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'member', -- owner, admin, member, viewer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL, -- rg_live_xxxx or rg_test_xxxx
  scopes TEXT[] DEFAULT ARRAY['text:defend'],
  rate_limit_per_min INTEGER DEFAULT 60,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Usage Aggregates
CREATE TABLE usage_daily (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  date DATE NOT NULL,
  text_requests INTEGER DEFAULT 0,
  audio_requests INTEGER DEFAULT 0,
  redteam_attacks INTEGER DEFAULT 0,
  blocked_count INTEGER DEFAULT 0,
  avg_latency_ms NUMERIC(10,2),
  UNIQUE(org_id, date)
);

-- Request Log
CREATE TABLE request_log (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  api_key_id UUID REFERENCES api_keys(id),
  request_type TEXT NOT NULL, -- text, audio, redteam
  status TEXT NOT NULL, -- blocked, passed, error
  blocked_by TEXT,
  threat_category TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Red Team Scans
CREATE TABLE redteam_scans (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, queued, running, completed, failed, cancelled
  target_endpoint TEXT,
  attack_suite TEXT DEFAULT 'basic', -- basic, standard, comprehensive, custom
  total_attacks INTEGER DEFAULT 0,
  blocked_attacks INTEGER DEFAULT 0,
  passed_attacks INTEGER DEFAULT 0,
  error_attacks INTEGER DEFAULT 0,
  block_rate NUMERIC(5,2),
  avg_latency_ms NUMERIC(10,2),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  report_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan Limits (configuration)
CREATE TABLE plan_limits (
  plan TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  text_requests_monthly INTEGER NOT NULL,
  audio_requests_monthly INTEGER,
  redteam_attacks_monthly INTEGER,
  max_api_keys INTEGER NOT NULL,
  max_team_members INTEGER NOT NULL,
  latency_sla_ms INTEGER,
  audio_enabled BOOLEAN DEFAULT FALSE,
  redteam_enabled BOOLEAN DEFAULT FALSE,
  support_level TEXT DEFAULT 'community'
);
```

### Plan Limits Data

| Plan | Price | Text Requests | Audio | Red Team | API Keys | Team | Latency SLA |
|------|-------|---------------|-------|----------|----------|------|-------------|
| Free | $0 | 500/mo | - | - | 1 | 1 | - |
| Starter | $79 | 25,000/mo | - | - | 3 | 5 | <500ms |
| Pro | $249 | 150,000/mo | 50,000/mo | 1,000/mo | 10 | 20 | <200ms |
| Business | $649 | 500,000/mo | 200,000/mo | 10,000/mo | 25 | 50 | <100ms |
| Enterprise | Custom | Unlimited | Unlimited | Unlimited | Unlimited | Unlimited | <50ms |

---

## Component Library

### Shared UI Components (Build with Radix UI + Tailwind)

```
components/ui/
├── alert.tsx
├── alert-dialog.tsx
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── popover.tsx
├── progress.tsx
├── select.tsx
├── separator.tsx
├── skeleton.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── tooltip.tsx
```

### Dashboard Components

```
components/dashboard/
├── Header.tsx          - Top bar with logo, search, user menu
├── Sidebar.tsx         - Navigation sidebar
├── StatsCard.tsx       - Metric card with value, label, trend
├── UsageChart.tsx      - Line/bar chart for usage data
├── AttackChart.tsx     - Threat/attack visualization
├── RecentRequests.tsx  - Table of recent API requests
├── QuickActions.tsx    - Action buttons grid
├── PaywallGate.tsx     - Feature gating by plan
├── DefenseResults.tsx  - Defense analysis results display
├── LayerBreakdown.tsx  - 6-layer analysis visualization
```

### Marketing Components

```
components/marketing/
├── Navbar.tsx          - Marketing navigation (transparent → dark on scroll)
├── Footer.tsx          - Site footer
├── Hero.tsx            - Homepage hero section
├── Problem.tsx         - Threat cards section
├── WhyNow.tsx          - Risk timeline section
├── Solution.tsx        - Defense layers section
├── RedTeam.tsx         - Red team stats section
├── Trust.tsx           - Metrics and trust section
├── Pricing.tsx         - Pricing cards
├── FAQ.tsx             - Accordion FAQ
├── CTA.tsx             - Call to action section
```

---

## State Management

### Zustand Stores

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  organization: Organization | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// stores/dashboardStore.ts
interface DashboardState {
  stats: DashboardStats | null;
  usage: UsageData | null;
  recentRequests: Request[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchUsage: (days: number) => Promise<void>;
}
```

### TanStack Query Patterns

```typescript
// hooks/useDashboard.ts
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(r => r.json()),
    refetchInterval: 30000, // 30 seconds
  });
}

// hooks/useApiKeys.ts
export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: () => fetch('/api/keys').then(r => r.json()),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKeyInput) =>
      fetch('/api/keys', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries(['api-keys']),
  });
}
```

---

## Authentication Flow

### Demo Mode (Development)

```typescript
// Demo credentials
const DEMO_USERS = {
  admin: {
    email: 'admin@ragaurd.com',
    password: 'Ragaurd2024!',
    isAdmin: true,
  },
  user: {
    email: 'demo@ragaurd.com',
    password: 'demo123',
    isAdmin: false,
  },
};

// Session stored in cookie (24-hour expiry)
// Format: base64(JSON({ userId, email, orgId, isAdmin, expiresAt }))
```

### Production Mode (Auth0)

- Configure Auth0 tenant
- Use `@auth0/nextjs-auth0` package
- Routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/callback`
- Middleware protects `/dashboard/*` and `/admin/*` routes

---

## Middleware & Security

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Rate limiting: 100 requests per 60 seconds per IP
  // Security headers
  // Protected route checks
  // Admin route checks
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/:path*'],
};
```

### Security Headers

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Error Handling

### API Error Format

```typescript
interface ApiError {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// HTTP Status Codes
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (no/invalid auth)
// 403 - Forbidden (insufficient permissions)
// 404 - Not Found
// 429 - Too Many Requests (rate limited)
// 500 - Internal Server Error
```

### Frontend Error Boundaries

- Wrap major sections in error boundaries
- Show user-friendly error messages
- Log errors to monitoring service
- Provide retry actions where appropriate

---

## Responsive Design Requirements

### Breakpoints

```css
/* Mobile first */
sm: 640px   - Small tablets
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1400px - Large screens
```

### Mobile Considerations

- Dashboard sidebar collapses to hamburger menu on mobile
- Tables become card-based views on mobile
- Touch-friendly button sizes (min 44px tap targets)
- Horizontal scroll for data tables when necessary

---

## Performance Requirements

- Initial page load < 3 seconds
- Time to Interactive < 5 seconds
- Lazy load below-fold content
- Optimize images (WebP with PNG fallback)
- Use React.memo for expensive components
- Implement virtual scrolling for long lists

---

## Accessibility Requirements

- All text meets WCAG AA contrast ratios
- Keyboard navigation support
- Focus indicators visible
- ARIA labels on interactive elements
- Screen reader friendly
- Semantic HTML structure

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_STARTER=
STRIPE_PRICE_PRO=
STRIPE_PRICE_BUSINESS=

# External Services
RAGAURD_API_SECRET=
RAGAURD_DEFENSE_URL=http://3.18.141.124:9000
RAGAURD_AUDIO_URL=http://localhost:5000
RAGAURD_REDTEAM_URL=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## File Structure

```
ragaurd/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Homepage
│   │   ├── pricing/page.tsx
│   │   └── docs/
│   │       ├── page.tsx
│   │       ├── quickstart/page.tsx
│   │       ├── api/page.tsx
│   │       ├── text-defense/page.tsx
│   │       ├── audio-defense/page.tsx
│   │       └── red-team/page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── defense/
│   │       │   ├── page.tsx
│   │       │   ├── text/page.tsx
│   │       │   └── audio/page.tsx
│   │       ├── redteam/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── api-keys/page.tsx
│   │       ├── usage/page.tsx
│   │       ├── billing/page.tsx
│   │       ├── team/page.tsx
│   │       └── settings/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── users/page.tsx
│   │       ├── organizations/page.tsx
│   │       ├── revenue/page.tsx
│   │       ├── usage/page.tsx
│   │       └── system/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── v1/
│   │   │   └── defend/
│   │   │       ├── route.ts         # Text defense
│   │   │       └── audio/route.ts   # Audio defense
│   │   ├── redteam/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── keys/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── dashboard/
│   │   │   ├── stats/route.ts
│   │   │   ├── usage/route.ts
│   │   │   └── requests/route.ts
│   │   └── admin/
│   │       ├── stats/route.ts
│   │       ├── users/route.ts
│   │       ├── organizations/route.ts
│   │       ├── usage/route.ts
│   │       └── revenue/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                          # Radix UI components
│   ├── dashboard/                   # Dashboard components
│   ├── marketing/                   # Marketing components
│   └── shared/                      # Shared components
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── services/
│   │   ├── auth/
│   │   ├── db/
│   │   └── defense/
│   ├── utils.ts
│   └── constants/
│       ├── plans.ts
│       └── routes.ts
├── hooks/
│   ├── useDashboard.ts
│   ├── useApiKeys.ts
│   ├── useRedteam.ts
│   └── useUsage.ts
├── stores/
│   ├── authStore.ts
│   └── dashboardStore.ts
├── types/
│   └── index.ts
├── middleware.ts
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Implementation Priority

### Phase 1: Core Infrastructure
1. Set up Next.js project with TypeScript and Tailwind
2. Implement design system and UI components
3. Set up Supabase connection and database schema
4. Implement authentication (demo mode first)
5. Create basic layouts (marketing, dashboard, admin)

### Phase 2: Marketing & Auth
1. Build all marketing pages
2. Implement login/signup flows
3. Set up protected routes

### Phase 3: User Dashboard
1. Dashboard home with stats
2. API key management
3. Text defense tester
4. Audio defense tester
5. Usage analytics
6. Red team scanning

### Phase 4: Admin & Billing
1. Admin dashboard and management pages
2. Stripe integration
3. Billing page and plan management
4. Team management

### Phase 5: Polish
1. Error handling and loading states
2. Responsive design fixes
3. Performance optimization
4. Accessibility audit

---

## Success Criteria

The frontend is complete when:

1. ✅ All marketing pages are responsive and on-brand
2. ✅ Users can sign up, log in, and manage their account
3. ✅ Users can create and manage API keys
4. ✅ Users can test text and audio defense in the dashboard
5. ✅ Users can run and view red team scans
6. ✅ Users can view usage analytics
7. ✅ Users can manage billing and subscriptions
8. ✅ Admins can view platform stats and manage users/orgs
9. ✅ All API endpoints are connected and functional
10. ✅ The app is performant and accessible

---

## Notes for Development

- Start with demo mode auth (hardcoded credentials) before integrating Auth0
- Use mock data initially, then connect to real APIs
- Build mobile-responsive from the start
- Test with both admin and regular user accounts
- Keep the UI dense and operational for dashboard (like a SOC console)
- Keep the marketing pages clean and professional

---

*This prompt should give you everything needed to build the complete Ragaurd frontend SaaS. Good luck!*

# Ragaurd - Voice AI Security Platform

## Overview

Ragaurd is a Voice AI security platform that protects voice agents from prompt injection, jailbreaking, deepfakes, and data exfiltration. The application provides multi-layer threat detection with a 99.53% attack block rate, offering real-time protection for voice AI deployments.

The platform consists of:
- **Marketing site** - Landing page explaining the product and pricing
- **Dashboard** - User-facing interface for monitoring threats, managing API keys, and running security scans
- **Admin panel** - Internal management for users, organizations, and system health
- **Defense API** - REST endpoints for real-time text and audio threat detection

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **React**: Version 18.3 with TypeScript
- **Styling**: TailwindCSS with V3 Obsidian design system (marketing) and Navy Clinical design system (dashboard)
- **Components**: Radix UI primitives (dialogs, dropdowns, tabs, tooltips, etc.)
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **State Management**: Zustand for global state, TanStack React Query for server state

### Route Structure (App Router)
- `app/(marketing)/` - Public landing pages with Navbar and Footer
- `app/(dashboard)/` - Protected user dashboard with Sidebar and Header
- `app/(admin)/` - Admin panel with separate navigation
- `app/(auth)/` - Authentication flows
- `app/api/` - API routes for auth, defense, keys, redteam, dashboard data

### Authentication & Sessions
- JWT-based sessions using `jose` library
- Session cookie named `ragaurd_session` (consistent between `lib/session.ts` and `middleware.ts`)
- Demo credentials available for testing (admin@ragaurd.com / Ragaurd2024!)
- Auth0 integration prepared but currently using local demo auth
- Middleware handles rate limiting per route type

### Database
- **Supabase** (PostgreSQL) for data storage
- Tables: users, organizations, org_members, api_keys, usage_daily
- Row Level Security (RLS) policies defined
- Migrations in `supabase/migrations/`

### Security Features
- Rate limiting in middleware (in-memory, production should use Redis)
- Security headers configured in `next.config.js` (HSTS, X-Frame-Options, CSP-ready)
- CORS configuration for API routes
- Input validation with Zod
- JWT session tokens with expiration

### Design System
The marketing landing page uses a "V3 Obsidian" design system:
- **Void (Obsidian Black)**: #050507 to #3a3a47 - Dark, tactical backgrounds
- **Electric Cyan**: #00e5ff - Primary accent for CTAs, highlights, and key data
- **Violet**: #8b5cf6 - Secondary accent for badges and premium features
- **Threat Red**: #f43f5e - Danger indicators, attack alerts
- **Secure Green**: #10b981 - Success states, protected status
- **Warning Amber**: #f59e0b - Caution indicators

Marketing components use dark obsidian backgrounds with electric cyan/violet glowing accents,
corner decorations, scan line animations, and glass-morphism effects for a premium B2B security feel.

The dashboard retains the legacy "Navy Clinical" design system:
- Primary colors: Navy blues (#0a1628 to #f4f9fd)
- Semantic colors: secure (green), warning (amber), danger (red), accent (blue)
- White variants for dark contexts
- Consistent spacing and typography scales

## External Dependencies

### Third-Party Services
- **Supabase**: PostgreSQL database and authentication infrastructure
- **Auth0**: Enterprise SSO and user management (prepared, not fully integrated)
- **Stripe**: Payment processing for subscription plans
- **Resend**: Transactional email service

### Key npm Packages
- `@supabase/supabase-js` - Database client
- `@auth0/nextjs-auth0` - Auth0 SDK
- `stripe` / `@stripe/stripe-js` - Payment processing
- `jose` - JWT handling for sessions
- `zod` - Schema validation
- `recharts` - Dashboard charts
- `@radix-ui/*` - Accessible UI primitives

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SESSION_SECRET (min 32 chars, required in production)
ALLOWED_ORIGINS (comma-separated list for CORS)
```
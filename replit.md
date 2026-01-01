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
- **Styling**: TailwindCSS with Navy & White Premium design system
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

### Design System - Navy & White Premium

The marketing landing page uses a "Navy & White Premium" design system inspired by Stripe, Linear, and Mercury:

**Navy Blues (Primary Palette)**
- `navy-950`: #0a1628 - Deepest navy for dark sections and text
- `navy-900`: #0f2042 - Dark navy
- `navy-800`: #1a3a5c - Navy for cards on dark backgrounds
- `navy-700`: #234b72 - Medium navy
- `navy-600`: #2d5f8a - Interactive navy
- `navy-500`: #3b7cb8 - Bright navy accent
- `navy-400`: #5a9fd4 - Light navy
- `navy-300`: #8bbde8 - Pale navy
- `navy-200`: #bdd9f4 - Very light navy
- `navy-100`: #e8f2fb - Near white navy tint
- `navy-50`: #f0f7ff - Lightest navy tint

**Whites**
- `white`: #ffffff - Pure white backgrounds
- `off-white`: #fafbfc - Off-white for sections
- `warm-white`: #f8f9fb - Warm white

**Semantic Colors**
- `success`: #059669 - Success states
- `danger`: #dc2626 - Error and danger states
- `warning`: #f59e0b - Warning indicators

**Design Principles**
- White/off-white backgrounds with subtle gradient dynamics
- Navy-950 for primary text, navy-500/600 for secondary text
- Clean, minimal aesthetic - no neon colors or hacker effects
- Subtle animations: fade-up reveals, hover shadows
- Premium typography with tight letter-spacing for headlines
- Fortune 500 CISO trust aesthetic

**Pricing Tiers (exact)**
- Free: $0/month
- Starter: $79/month
- Pro: $249/month (featured)
- Business: $649/month

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

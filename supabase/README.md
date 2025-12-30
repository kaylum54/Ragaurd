# RAGuard Supabase Setup

## Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and keys from Settings > API

### 2. Run Migrations

In the Supabase Dashboard, go to **SQL Editor** and run these files in order:

1. `migrations/001_initial_schema.sql` - Creates all tables, indexes, and RLS policies
2. `migrations/002_seed_data.sql` - Inserts demo data for testing

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase (from your project settings)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### 4. Verify Setup

Run the app and check the dashboard:

```bash
npm run dev
```

Visit `http://localhost:3000/login` and sign in with:
- Email: `demo@ragaurd.com`
- Password: `demo123`

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (linked to Auth0) |
| `organizations` | Workspaces that own API keys |
| `org_members` | Team members within orgs |
| `api_keys` | API keys (hashed) for authentication |
| `usage_daily` | Aggregated daily usage stats |
| `request_log` | Individual request audit trail |
| `redteam_scans` | Red team attack simulations |
| `plan_limits` | Subscription tier limits |

### Relationships

```
users ─┬─< org_members >─┬─ organizations
       │                 │
       │                 ├─< api_keys
       │                 ├─< usage_daily
       │                 ├─< request_log
       │                 └─< redteam_scans
       │
       └─ (owner_id) ────┘
```

## Demo API Key

After running seed data, you can use this test key:

```
rg_test_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

Test with curl:
```bash
curl -X POST http://localhost:3000/api/v1/defend \
  -H "Authorization: Bearer rg_test_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello world", "profile": "balanced"}'
```

## Row Level Security

All tables have RLS enabled. The service role key bypasses RLS for backend operations.

For frontend queries (using anon key), you'll need to add appropriate policies based on your auth implementation.

-- RAGuard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'business', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  billing_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_owner_id ON organizations(owner_id);

-- ============================================
-- ORG_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_members_org_id ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user_id ON org_members(user_id);

-- ============================================
-- API_KEYS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT UNIQUE NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['defend:text'],
  rate_limit_per_min INTEGER DEFAULT 60,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON api_keys(org_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- ============================================
-- USAGE_DAILY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS usage_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  text_requests INTEGER DEFAULT 0,
  audio_requests INTEGER DEFAULT 0,
  redteam_attacks INTEGER DEFAULT 0,
  blocked_count INTEGER DEFAULT 0,
  avg_latency_ms INTEGER,
  UNIQUE(org_id, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_daily_org_id ON usage_daily(org_id);
CREATE INDEX IF NOT EXISTS idx_usage_daily_date ON usage_daily(date);
CREATE INDEX IF NOT EXISTS idx_usage_daily_org_date ON usage_daily(org_id, date);

-- ============================================
-- REQUEST_LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS request_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('text', 'audio', 'redteam')),
  status TEXT NOT NULL CHECK (status IN ('blocked', 'passed', 'error')),
  blocked_by TEXT,
  threat_category TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_request_log_org_id ON request_log(org_id);
CREATE INDEX IF NOT EXISTS idx_request_log_created_at ON request_log(created_at);
CREATE INDEX IF NOT EXISTS idx_request_log_status ON request_log(status);
CREATE INDEX IF NOT EXISTS idx_request_log_org_created ON request_log(org_id, created_at DESC);

-- ============================================
-- REDTEAM_SCANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS redteam_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'queued', 'running', 'completed', 'failed', 'cancelled')),
  target_endpoint TEXT NOT NULL,
  attack_suite TEXT DEFAULT 'standard' CHECK (attack_suite IN ('basic', 'standard', 'comprehensive', 'custom')),
  total_attacks INTEGER DEFAULT 0,
  blocked_attacks INTEGER DEFAULT 0,
  passed_attacks INTEGER DEFAULT 0,
  error_attacks INTEGER DEFAULT 0,
  block_rate DECIMAL(5,2),
  avg_latency_ms INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  report_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redteam_scans_org_id ON redteam_scans(org_id);
CREATE INDEX IF NOT EXISTS idx_redteam_scans_status ON redteam_scans(status);

-- ============================================
-- PLAN_LIMITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS plan_limits (
  plan TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  price_monthly INTEGER,
  text_requests_monthly INTEGER,
  audio_requests_monthly INTEGER,
  redteam_attacks_monthly INTEGER,
  max_api_keys INTEGER,
  max_team_members INTEGER,
  latency_sla_ms INTEGER,
  audio_enabled BOOLEAN DEFAULT FALSE,
  redteam_enabled BOOLEAN DEFAULT FALSE,
  support_level TEXT DEFAULT 'community'
);

-- Insert default plan limits
INSERT INTO plan_limits (plan, display_name, price_monthly, text_requests_monthly, audio_requests_monthly, redteam_attacks_monthly, max_api_keys, max_team_members, latency_sla_ms, audio_enabled, redteam_enabled, support_level)
VALUES
  ('free', 'Free', 0, 1000, NULL, NULL, 2, 1, NULL, FALSE, FALSE, 'community'),
  ('starter', 'Starter', 49, 10000, NULL, NULL, 5, 3, 500, FALSE, FALSE, 'email'),
  ('pro', 'Pro', 199, 100000, 1000, 100, 10, 10, 200, TRUE, TRUE, 'priority'),
  ('business', 'Business', 499, 500000, 5000, 500, 25, 25, 100, TRUE, TRUE, 'dedicated'),
  ('enterprise', 'Enterprise', NULL, NULL, NULL, NULL, NULL, NULL, 50, TRUE, TRUE, 'dedicated')
ON CONFLICT (plan) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  price_monthly = EXCLUDED.price_monthly,
  text_requests_monthly = EXCLUDED.text_requests_monthly,
  audio_requests_monthly = EXCLUDED.audio_requests_monthly,
  redteam_attacks_monthly = EXCLUDED.redteam_attacks_monthly,
  max_api_keys = EXCLUDED.max_api_keys,
  max_team_members = EXCLUDED.max_team_members,
  latency_sla_ms = EXCLUDED.latency_sla_ms,
  audio_enabled = EXCLUDED.audio_enabled,
  redteam_enabled = EXCLUDED.redteam_enabled,
  support_level = EXCLUDED.support_level;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE redteam_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

-- Plan limits are public read
DROP POLICY IF EXISTS "Plan limits are viewable by everyone" ON plan_limits;
CREATE POLICY "Plan limits are viewable by everyone" ON plan_limits
  FOR SELECT USING (true);

-- Service role bypass (for backend operations)
-- Note: These policies allow the service role to perform all operations
-- In production, you may want more restrictive policies

DROP POLICY IF EXISTS "Service role full access to users" ON users;
CREATE POLICY "Service role full access to users" ON users
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to organizations" ON organizations;
CREATE POLICY "Service role full access to organizations" ON organizations
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to org_members" ON org_members;
CREATE POLICY "Service role full access to org_members" ON org_members
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to api_keys" ON api_keys;
CREATE POLICY "Service role full access to api_keys" ON api_keys
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to usage_daily" ON usage_daily;
CREATE POLICY "Service role full access to usage_daily" ON usage_daily
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to request_log" ON request_log;
CREATE POLICY "Service role full access to request_log" ON request_log
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access to redteam_scans" ON redteam_scans;
CREATE POLICY "Service role full access to redteam_scans" ON redteam_scans
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User accounts linked to Auth0';
COMMENT ON TABLE organizations IS 'Organizations/workspaces that own API keys and usage';
COMMENT ON TABLE org_members IS 'Team members within organizations';
COMMENT ON TABLE api_keys IS 'API keys for authentication (key_hash stores SHA256 hash)';
COMMENT ON TABLE usage_daily IS 'Daily aggregated usage statistics';
COMMENT ON TABLE request_log IS 'Individual request logs for audit trail';
COMMENT ON TABLE redteam_scans IS 'Red team attack simulation scans';
COMMENT ON TABLE plan_limits IS 'Subscription plan limits and features';

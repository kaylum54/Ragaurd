-- RAGuard Seed Data for Development/Testing
-- Run this AFTER 001_initial_schema.sql

-- ============================================
-- DEMO USER
-- ============================================
INSERT INTO users (id, auth0_id, email, name, is_admin)
VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'auth0|demo', 'demo@ragaurd.com', 'Demo User', FALSE),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'auth0|admin', 'admin@ragaurd.com', 'Admin User', TRUE)
ON CONFLICT (auth0_id) DO NOTHING;

-- ============================================
-- DEMO ORGANIZATION
-- ============================================
INSERT INTO organizations (id, name, slug, owner_id, plan)
VALUES
  ('demo-org-001', 'Demo Organization', 'demo-org', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'pro')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ORG MEMBERS
-- ============================================
INSERT INTO org_members (org_id, user_id, role)
VALUES
  ('demo-org-001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'owner'),
  ('demo-org-001', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'admin')
ON CONFLICT (org_id, user_id) DO NOTHING;

-- ============================================
-- DEMO API KEY
-- Note: This is a pre-generated test key for development
-- Key: rg_test_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
-- Hash: SHA256 of the above key
-- ============================================
INSERT INTO api_keys (id, org_id, name, key_hash, key_prefix, scopes, rate_limit_per_min, is_active)
VALUES
  ('key-001', 'demo-org-001', 'Development Key',
   '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', -- hash of test key
   'rg_test_012345...',
   ARRAY['defend:text', 'defend:audio', 'redteam:scan'],
   100,
   TRUE)
ON CONFLICT (key_hash) DO NOTHING;

-- ============================================
-- SAMPLE USAGE DATA (Last 7 days)
-- ============================================
INSERT INTO usage_daily (org_id, date, text_requests, audio_requests, redteam_attacks, blocked_count, avg_latency_ms)
VALUES
  ('demo-org-001', CURRENT_DATE - INTERVAL '6 days', 245, 12, 5, 28, 95),
  ('demo-org-001', CURRENT_DATE - INTERVAL '5 days', 312, 18, 8, 45, 88),
  ('demo-org-001', CURRENT_DATE - INTERVAL '4 days', 287, 15, 3, 38, 92),
  ('demo-org-001', CURRENT_DATE - INTERVAL '3 days', 456, 22, 12, 67, 85),
  ('demo-org-001', CURRENT_DATE - INTERVAL '2 days', 523, 28, 15, 82, 78),
  ('demo-org-001', CURRENT_DATE - INTERVAL '1 day', 398, 20, 10, 54, 91),
  ('demo-org-001', CURRENT_DATE, 167, 8, 4, 22, 87)
ON CONFLICT (org_id, date) DO UPDATE SET
  text_requests = EXCLUDED.text_requests,
  audio_requests = EXCLUDED.audio_requests,
  redteam_attacks = EXCLUDED.redteam_attacks,
  blocked_count = EXCLUDED.blocked_count,
  avg_latency_ms = EXCLUDED.avg_latency_ms;

-- ============================================
-- SAMPLE REQUEST LOGS (Recent activity)
-- ============================================
INSERT INTO request_log (org_id, api_key_id, request_type, status, blocked_by, threat_category, latency_ms, created_at)
VALUES
  ('demo-org-001', 'key-001', 'text', 'passed', NULL, NULL, 85, NOW() - INTERVAL '5 minutes'),
  ('demo-org-001', 'key-001', 'text', 'blocked', 'semantic_analysis', 'prompt_injection', 92, NOW() - INTERVAL '12 minutes'),
  ('demo-org-001', 'key-001', 'text', 'passed', NULL, NULL, 78, NOW() - INTERVAL '18 minutes'),
  ('demo-org-001', 'key-001', 'text', 'blocked', 'llm_guard', 'jailbreak', 105, NOW() - INTERVAL '25 minutes'),
  ('demo-org-001', 'key-001', 'text', 'passed', NULL, NULL, 82, NOW() - INTERVAL '32 minutes'),
  ('demo-org-001', 'key-001', 'audio', 'passed', NULL, NULL, 1250, NOW() - INTERVAL '45 minutes'),
  ('demo-org-001', 'key-001', 'text', 'blocked', 'pattern_matching', 'data_exfiltration', 45, NOW() - INTERVAL '1 hour'),
  ('demo-org-001', 'key-001', 'text', 'passed', NULL, NULL, 91, NOW() - INTERVAL '1 hour 15 minutes'),
  ('demo-org-001', 'key-001', 'text', 'blocked', 'context_validation', 'role_manipulation', 88, NOW() - INTERVAL '1 hour 30 minutes'),
  ('demo-org-001', 'key-001', 'text', 'passed', NULL, NULL, 79, NOW() - INTERVAL '2 hours'),
  ('demo-org-001', 'key-001', 'redteam', 'blocked', 'llm_guard', 'jailbreak', 120, NOW() - INTERVAL '3 hours'),
  ('demo-org-001', 'key-001', 'text', 'passed', NULL, NULL, 88, NOW() - INTERVAL '4 hours'),
  ('demo-org-001', 'key-001', 'text', 'blocked', 'embedding_similarity', 'prompt_injection', 95, NOW() - INTERVAL '5 hours');

-- ============================================
-- SAMPLE REDTEAM SCAN
-- ============================================
INSERT INTO redteam_scans (id, org_id, name, status, target_endpoint, attack_suite, total_attacks, blocked_attacks, passed_attacks, error_attacks, block_rate, avg_latency_ms, started_at, completed_at)
VALUES
  ('scan-001', 'demo-org-001', 'Initial Security Audit', 'completed', 'https://api.example.com/chat', 'comprehensive', 150, 142, 6, 2, 94.67, 112, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '45 minutes')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify seed data was inserted correctly:
-- SELECT
--   (SELECT COUNT(*) FROM users) as users,
--   (SELECT COUNT(*) FROM organizations) as orgs,
--   (SELECT COUNT(*) FROM api_keys) as api_keys,
--   (SELECT COUNT(*) FROM usage_daily) as usage_days,
--   (SELECT COUNT(*) FROM request_log) as request_logs;

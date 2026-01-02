-- Migration: Saved Endpoints
-- Allows organizations to save and reuse endpoints (e.g., ElevenLabs agents) for red team scans

CREATE TABLE IF NOT EXISTS saved_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  endpoint_type TEXT NOT NULL DEFAULT 'voice_agent', -- voice_agent, chat_api, custom
  description TEXT,
  config JSONB DEFAULT '{}', -- Store additional config like headers, auth type, etc.
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick org lookups
CREATE INDEX IF NOT EXISTS idx_saved_endpoints_org_id ON saved_endpoints(org_id);

-- Row Level Security
ALTER TABLE saved_endpoints ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their org's endpoints
CREATE POLICY "Users can view their org endpoints" ON saved_endpoints
  FOR SELECT USING (true); -- Actual org check done in application

CREATE POLICY "Users can insert their org endpoints" ON saved_endpoints
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their org endpoints" ON saved_endpoints
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their org endpoints" ON saved_endpoints
  FOR DELETE USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_saved_endpoints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_saved_endpoints_updated_at
  BEFORE UPDATE ON saved_endpoints
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_endpoints_updated_at();

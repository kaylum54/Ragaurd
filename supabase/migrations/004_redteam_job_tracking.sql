-- Add job tracking fields to redteam_scans table
-- This migration adds support for Garak and PyRIT job IDs and additional metrics

-- Add new columns if they don't exist
ALTER TABLE redteam_scans
ADD COLUMN IF NOT EXISTS error_attacks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avg_latency_ms REAL,
ADD COLUMN IF NOT EXISTS report_json JSONB,
ADD COLUMN IF NOT EXISTS garak_job_id TEXT,
ADD COLUMN IF NOT EXISTS pyrit_job_id TEXT;

-- Add index for job ID lookups
CREATE INDEX IF NOT EXISTS idx_redteam_scans_garak_job_id ON redteam_scans(garak_job_id) WHERE garak_job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_redteam_scans_pyrit_job_id ON redteam_scans(pyrit_job_id) WHERE pyrit_job_id IS NOT NULL;

-- Add index for status lookups (useful for finding running scans)
CREATE INDEX IF NOT EXISTS idx_redteam_scans_status ON redteam_scans(status);

-- Update the check constraint to include 'cancelled' status if not already there
-- First drop the existing constraint if it exists
ALTER TABLE redteam_scans DROP CONSTRAINT IF EXISTS redteam_scans_status_check;

-- Add the updated constraint
ALTER TABLE redteam_scans ADD CONSTRAINT redteam_scans_status_check
CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'));

-- Comment on new columns
COMMENT ON COLUMN redteam_scans.error_attacks IS 'Number of attacks that resulted in errors';
COMMENT ON COLUMN redteam_scans.avg_latency_ms IS 'Average latency of attack responses in milliseconds';
COMMENT ON COLUMN redteam_scans.report_json IS 'Full aggregated results from Garak and PyRIT';
COMMENT ON COLUMN redteam_scans.garak_job_id IS 'Job ID from Garak service';
COMMENT ON COLUMN redteam_scans.pyrit_job_id IS 'Job ID from PyRIT service';

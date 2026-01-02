// Types for Red Team service integrations (Garak & PyRIT)

export interface ScanJobRequest {
  scan_id: string;
  target_endpoint: string;
  attack_suite: 'basic' | 'standard' | 'comprehensive';
  total_attacks: number;
  config?: ScanConfig;
}

export interface ScanConfig {
  timeout?: number;
  retries?: number;
  concurrency?: number;
  headers?: Record<string, string>;
  skip_patterns?: string[];
}

export interface AttackPayload {
  id: string;
  category: string;
  name: string;
  payload: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, unknown>;
}

export interface AttackResult {
  id: string;
  attack_id: string;
  category: string;
  payload: string;
  result: 'blocked' | 'passed' | 'error';
  blocked_by?: string;
  threat_category?: string;
  latency_ms: number;
  confidence?: number;
  response?: string;
  error_message?: string;
}

export interface ScanProgress {
  completed: number;
  total: number;
  blocked: number;
  passed: number;
  errors: number;
}

export interface ScanJobResponse {
  job_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: ScanProgress;
  results?: AttackResult[];
  error?: string;
  started_at?: string;
  completed_at?: string;
}

export interface ServiceHealthResponse {
  healthy: boolean;
  service: 'garak' | 'pyrit';
  version?: string;
  latency_ms: number;
  error?: string;
}

export interface AggregatedResults {
  total_attacks: number;
  blocked_attacks: number;
  passed_attacks: number;
  error_attacks: number;
  block_rate: number;
  avg_latency_ms: number;
  results: AttackResult[];
  categories: Record<string, { blocked: number; passed: number; total: number }>;
  garak_job_id?: string;
  pyrit_job_id?: string;
}

export interface OrchestratedScan {
  scan_id: string;
  garak_job_id?: string;
  pyrit_job_id?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: ScanProgress;
  started_at?: Date;
  error?: string;
}

// Attack suite configuration
export const ATTACK_SUITE_CONFIG = {
  basic: {
    attacks: 50,
    timeout_minutes: 10,
    description: 'Quick scan with common attack patterns',
  },
  standard: {
    attacks: 200,
    timeout_minutes: 30,
    description: 'Comprehensive scan with varied attack vectors',
  },
  comprehensive: {
    attacks: 500,
    timeout_minutes: 60,
    description: 'Full security assessment with advanced attacks',
  },
} as const;

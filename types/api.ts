// Defense API types
export interface DefendRequest {
  input: string;
  profile?: 'strict' | 'balanced' | 'permissive';
}

export interface DefendResponse {
  allowed: boolean;
  blocked_by?: string;
  threat_category?: string;
  confidence?: number;
  latency_ms: number;
  layers: {
    name: string;
    passed: boolean;
    details?: string;
  }[];
}

export interface DefendAudioRequest {
  audio: string; // base64 encoded
  format: 'wav' | 'mp3' | 'ogg' | 'webm';
}

export interface DefendAudioResponse {
  is_authentic: boolean;
  is_deepfake: boolean;
  confidence: number;
  model_scores: {
    aasist: number;
    lcnn: number;
  };
  latency_ms: number;
}

// Red Team API types
export interface RedTeamScanRequest {
  name?: string;
  target_endpoint: string;
  attack_suite: 'basic' | 'standard' | 'comprehensive' | 'custom';
  custom_attacks?: string[];
}

export interface RedTeamScanResponse {
  scan_id: string;
  status: 'queued' | 'running';
  estimated_duration_minutes?: number;
}

export interface RedTeamScanResult {
  scan_id: string;
  status: 'completed' | 'failed' | 'cancelled';
  total_attacks: number;
  blocked_attacks: number;
  passed_attacks: number;
  error_attacks: number;
  block_rate: number;
  avg_latency_ms: number;
  attacks: {
    id: string;
    category: string;
    name: string;
    payload: string;
    result: 'blocked' | 'passed' | 'error';
    response?: string;
    latency_ms: number;
  }[];
}

// Usage API types
export interface UsageStats {
  period: {
    start: string;
    end: string;
  };
  text_requests: number;
  audio_requests: number;
  redteam_attacks: number;
  blocked_count: number;
  block_rate: number;
  avg_latency_ms: number;
  daily: {
    date: string;
    text_requests: number;
    audio_requests: number;
    blocked_count: number;
  }[];
}

export interface UsageLimits {
  text_requests: {
    used: number;
    limit: number | null;
    percentage: number;
  };
  audio_requests: {
    used: number;
    limit: number | null;
    percentage: number;
  };
  redteam_attacks: {
    used: number;
    limit: number | null;
    percentage: number;
  };
  api_keys: {
    used: number;
    limit: number | null;
  };
  team_members: {
    used: number;
    limit: number | null;
  };
}

// API Error response
export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// API Success response wrapper
export interface ApiResponse<T> {
  data: T;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
  };
}

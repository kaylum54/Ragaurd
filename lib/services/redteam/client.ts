// Red Team API v2.0 Client - Multi-Platform Support
// This client calls local API proxy routes to avoid CORS issues

const REQUEST_TIMEOUT = 60000; // 60 seconds for scan operations

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============ Types ============

export type Platform = 'ragaurd' | 'elevenlabs' | 'vapi' | 'retell' | 'bland' | 'custom';

export interface PlatformInfo {
  id: Platform;
  name: string;
  description: string;
}

export interface StartScanRequest {
  platform: Platform;
  max_attacks?: number;
  profile?: 'strict' | 'balanced' | 'permissive';
  // Platform-specific fields
  agent_id?: string;
  api_key?: string;
  target_url?: string;
  custom_headers?: Record<string, string>;
  custom_payload_field?: string;
  // Legacy fields for backward compatibility
  attack_suite?: 'basic' | 'standard' | 'comprehensive';
}

export interface StartScanResponse {
  scan_id: string;
  status: string;
  attack_count: number;
  platform?: Platform;
  local_scan_id?: string; // ID in local database for tracking
}

export interface ScanProgress {
  completed: number;
  total: number;
  blocked: number;
  passed: number;
  errors: number;
}

export interface ScanStatusResponse {
  scan_id: string;
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed';
  platform?: Platform;
  progress: ScanProgress;
  block_rate: number;
}

export interface AttackResult {
  id: number;
  payload: string;
  result: 'blocked' | 'passed' | 'error';
  blocked_by?: string | null;
  response_preview?: string | null;
  latency_ms?: number;
}

export interface ScanResultsResponse {
  scan_id: string;
  status: string;
  platform?: Platform;
  summary: {
    total_attacks: number;
    blocked: number;
    passed: number;
    errors?: number;
    block_rate: number;
  };
  attacks: AttackResult[];
}

export interface AttackSuite {
  id: string;
  name: string;
  attack_count: number;
  description?: string;
}

// ============ API Functions ============
// All functions call local API proxy routes to avoid CORS issues

/**
 * Check if the red team service is healthy
 */
export async function checkHealth(): Promise<{
  healthy: boolean;
  latencyMs?: number;
  error?: string;
}> {
  try {
    const response = await fetch('/api/redteam/health');
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get list of supported platforms
 */
export async function getPlatforms(): Promise<PlatformInfo[]> {
  try {
    const response = await fetch('/api/redteam/platforms');

    if (!response.ok) {
      throw new Error(`Failed to get platforms: ${response.status}`);
    }

    const data = await response.json();
    return data.platforms || [];
  } catch (error) {
    console.error('Error getting platforms:', error);
    // Return default platforms as fallback
    return [
      { id: 'ragaurd', name: 'Ragaurd Defense', description: 'Test Ragaurd defense stack directly' },
      { id: 'elevenlabs', name: 'ElevenLabs', description: 'ElevenLabs Conversational AI agents' },
      { id: 'vapi', name: 'Vapi', description: 'Vapi voice agents' },
      { id: 'retell', name: 'Retell AI', description: 'Retell AI voice agents' },
      { id: 'bland', name: 'Bland AI', description: 'Bland AI phone agents' },
      { id: 'custom', name: 'Custom', description: 'Custom HTTP endpoint' },
    ];
  }
}

/**
 * Get available attack suites (legacy)
 */
export async function getAttackSuites(): Promise<AttackSuite[]> {
  // Return default suites - this is a legacy function
  return [
    { id: 'basic', name: 'Basic', attack_count: 36 },
    { id: 'standard', name: 'Standard', attack_count: 100 },
    { id: 'comprehensive', name: 'Comprehensive', attack_count: 250 },
  ];
}

/**
 * Start a new red team scan
 */
export async function startScan(request: StartScanRequest): Promise<StartScanResponse> {
  const response = await fetchWithTimeout(
    '/api/redteam/start',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || `Failed to start scan: ${response.status}`);
  }

  return response.json();
}

/**
 * Get scan status and progress
 */
export async function getScanStatus(scanId: string): Promise<ScanStatusResponse> {
  const response = await fetchWithTimeout(
    `/api/redteam/${scanId}/status`,
    { method: 'GET' },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get scan status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get detailed scan results
 */
export async function getScanResults(scanId: string): Promise<ScanResultsResponse> {
  const response = await fetchWithTimeout(
    `/api/redteam/${scanId}/results`,
    { method: 'GET' },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get scan results: ${response.status}`);
  }

  return response.json();
}

/**
 * List all scans
 */
export async function listScans(): Promise<{ scans: ScanStatusResponse[] }> {
  const response = await fetchWithTimeout(
    '/api/redteam',
    { method: 'GET' },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to list scans: ${response.status}`);
  }

  return response.json();
}

/**
 * Get platform-specific field requirements
 */
export function getPlatformFields(platform: Platform): {
  fields: { name: string; label: string; type: string; placeholder: string; required: boolean }[];
} {
  switch (platform) {
    case 'ragaurd':
      return { fields: [] }; // No extra fields needed
    case 'elevenlabs':
      return {
        fields: [
          { name: 'agent_id', label: 'Agent ID', type: 'text', placeholder: 'agent_abc123...', required: true },
          { name: 'api_key', label: 'API Key', type: 'password', placeholder: 'xi-xxxxxxxxxxxx', required: true },
        ],
      };
    case 'vapi':
      return {
        fields: [
          { name: 'agent_id', label: 'Assistant ID', type: 'text', placeholder: 'assistant_abc123...', required: true },
          { name: 'api_key', label: 'API Key', type: 'password', placeholder: 'vapi_xxxxxxxxxxxx', required: true },
        ],
      };
    case 'retell':
      return {
        fields: [
          { name: 'agent_id', label: 'Agent ID', type: 'text', placeholder: 'agent_abc123...', required: true },
          { name: 'api_key', label: 'API Key', type: 'password', placeholder: 'retell_xxxxxxxxxxxx', required: true },
        ],
      };
    case 'bland':
      return {
        fields: [
          { name: 'api_key', label: 'API Key', type: 'password', placeholder: 'bland_xxxxxxxxxxxx', required: true },
        ],
      };
    case 'custom':
      return {
        fields: [
          { name: 'target_url', label: 'Target URL', type: 'text', placeholder: 'https://your-api.com/endpoint', required: true },
          { name: 'custom_payload_field', label: 'Payload Field Name', type: 'text', placeholder: 'message', required: false },
        ],
      };
    default:
      return { fields: [] };
  }
}

// Garak LLM Vulnerability Scanner Client
import type {
  ScanJobRequest,
  ScanJobResponse,
  AttackResult,
  ServiceHealthResponse,
} from './types';

const GARAK_SERVICE_URL = process.env.GARAK_SERVICE_URL || 'http://localhost:8081';
const GARAK_API_KEY = process.env.GARAK_API_KEY;
const REQUEST_TIMEOUT = 30000; // 30 seconds
const HEALTH_CHECK_TIMEOUT = 5000; // 5 seconds

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

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (GARAK_API_KEY) {
    headers['Authorization'] = `Bearer ${GARAK_API_KEY}`;
  }
  return headers;
}

export async function checkGarakHealth(): Promise<ServiceHealthResponse> {
  const startTime = Date.now();

  try {
    const response = await fetchWithTimeout(
      `${GARAK_SERVICE_URL}/health`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
      HEALTH_CHECK_TIMEOUT
    );

    const latency = Date.now() - startTime;

    if (!response.ok) {
      return {
        healthy: false,
        service: 'garak',
        latency_ms: latency,
        error: `Health check failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      healthy: true,
      service: 'garak',
      version: data.version,
      latency_ms: latency,
    };
  } catch (error) {
    return {
      healthy: false,
      service: 'garak',
      latency_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function startGarakScan(
  request: ScanJobRequest
): Promise<{ job_id: string; estimated_duration_minutes: number }> {
  const response = await fetchWithTimeout(
    `${GARAK_SERVICE_URL}/api/v1/scan/start`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        scan_id: request.scan_id,
        target_endpoint: request.target_endpoint,
        attack_suite: request.attack_suite,
        total_attacks: request.total_attacks,
        config: request.config,
      }),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to start Garak scan: ${error}`);
  }

  return response.json();
}

export async function getGarakScanStatus(jobId: string): Promise<ScanJobResponse> {
  const response = await fetchWithTimeout(
    `${GARAK_SERVICE_URL}/api/v1/scan/${jobId}/status`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get Garak scan status: ${response.status}`);
  }

  return response.json();
}

export async function getGarakResults(jobId: string): Promise<AttackResult[]> {
  const response = await fetchWithTimeout(
    `${GARAK_SERVICE_URL}/api/v1/scan/${jobId}/results`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get Garak results: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export async function cancelGarakScan(jobId: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `${GARAK_SERVICE_URL}/api/v1/scan/${jobId}/cancel`,
      {
        method: 'POST',
        headers: getHeaders(),
      },
      REQUEST_TIMEOUT
    );

    return response.ok;
  } catch {
    return false;
  }
}

export async function getAvailableAttacks(): Promise<{
  attacks: { id: string; category: string; name: string }[];
  suites: { basic: number; standard: number; comprehensive: number };
}> {
  const response = await fetchWithTimeout(
    `${GARAK_SERVICE_URL}/api/v1/attacks`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get available attacks: ${response.status}`);
  }

  return response.json();
}

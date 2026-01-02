// PyRIT (Python Risk Identification Tool) Client
import type {
  ScanJobRequest,
  ScanJobResponse,
  AttackResult,
  ServiceHealthResponse,
} from './types';

const PYRIT_SERVICE_URL = process.env.PYRIT_SERVICE_URL || 'http://localhost:8082';
const PYRIT_API_KEY = process.env.PYRIT_API_KEY;
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
  if (PYRIT_API_KEY) {
    headers['Authorization'] = `Bearer ${PYRIT_API_KEY}`;
  }
  return headers;
}

export async function checkPyritHealth(): Promise<ServiceHealthResponse> {
  const startTime = Date.now();

  try {
    const response = await fetchWithTimeout(
      `${PYRIT_SERVICE_URL}/health`,
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
        service: 'pyrit',
        latency_ms: latency,
        error: `Health check failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      healthy: true,
      service: 'pyrit',
      version: data.version,
      latency_ms: latency,
    };
  } catch (error) {
    return {
      healthy: false,
      service: 'pyrit',
      latency_ms: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function startPyritAnalysis(
  request: ScanJobRequest
): Promise<{ job_id: string; estimated_duration_minutes: number }> {
  const response = await fetchWithTimeout(
    `${PYRIT_SERVICE_URL}/api/v1/analyze/start`,
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
    throw new Error(`Failed to start PyRIT analysis: ${error}`);
  }

  return response.json();
}

export async function getPyritAnalysisStatus(jobId: string): Promise<ScanJobResponse> {
  const response = await fetchWithTimeout(
    `${PYRIT_SERVICE_URL}/api/v1/analyze/${jobId}/status`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get PyRIT analysis status: ${response.status}`);
  }

  return response.json();
}

export async function getPyritResults(jobId: string): Promise<AttackResult[]> {
  const response = await fetchWithTimeout(
    `${PYRIT_SERVICE_URL}/api/v1/analyze/${jobId}/results`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
    REQUEST_TIMEOUT
  );

  if (!response.ok) {
    throw new Error(`Failed to get PyRIT results: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

export async function cancelPyritAnalysis(jobId: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `${PYRIT_SERVICE_URL}/api/v1/analyze/${jobId}/cancel`,
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

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high' | 'critical';
  risk_score: number; // 0-100
  vulnerabilities: {
    category: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    count: number;
    description: string;
  }[];
  recommendations: string[];
}

export async function getRiskAssessment(jobId: string): Promise<RiskAssessment | null> {
  try {
    const response = await fetchWithTimeout(
      `${PYRIT_SERVICE_URL}/api/v1/analyze/${jobId}/risk-assessment`,
      {
        method: 'GET',
        headers: getHeaders(),
      },
      REQUEST_TIMEOUT
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

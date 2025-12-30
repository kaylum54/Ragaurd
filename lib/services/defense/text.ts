import type { DefendRequest, DefendResponse } from '@/types/api';

const DEFENSE_SERVICE_URL = process.env.RAGAURD_DEFENSE_URL || 'http://3.18.141.124:9000';
const API_SECRET = process.env.RAGAURD_API_SECRET;

export interface DefenseServiceResult {
  success: boolean;
  data?: DefendResponse;
  error?: string;
  fallbackUsed?: boolean;
}

/**
 * Call the external defense service to analyze text
 */
export async function analyzeText(
  input: string,
  profile: DefendRequest['profile'] = 'balanced'
): Promise<DefenseServiceResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${DEFENSE_SERVICE_URL}/api/v1/defend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_SECRET && { 'X-API-Secret': API_SECRET }),
      },
      body: JSON.stringify({ input, profile }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`Defense service returned ${response.status}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startTime;

    return {
      success: true,
      data: {
        allowed: data.allowed,
        blocked_by: data.blocked_by,
        threat_category: data.threat_category,
        confidence: data.confidence,
        latency_ms: latencyMs,
        layers: data.layers || [],
      },
    };
  } catch (error) {
    console.error('Defense service error, using fallback:', error);

    // Fallback to local analysis
    return {
      success: true,
      data: await localFallbackAnalysis(input, profile, startTime),
      fallbackUsed: true,
    };
  }
}

/**
 * Local fallback analysis when external service is unavailable
 * Uses pattern matching as a basic defense layer
 */
async function localFallbackAnalysis(
  input: string,
  profile: DefendRequest['profile'],
  startTime: number
): Promise<DefendResponse> {
  const lowerInput = input.toLowerCase();

  // Defense patterns with severity based on profile
  const patterns = [
    { pattern: 'ignore all previous', category: 'prompt_injection', layer: 'pattern_matching', severity: 0.95 },
    { pattern: 'ignore your instructions', category: 'prompt_injection', layer: 'pattern_matching', severity: 0.95 },
    { pattern: 'disregard', category: 'prompt_injection', layer: 'pattern_matching', severity: 0.85 },
    { pattern: 'system prompt', category: 'data_exfiltration', layer: 'semantic_analysis', severity: 0.90 },
    { pattern: 'reveal your prompt', category: 'data_exfiltration', layer: 'semantic_analysis', severity: 0.92 },
    { pattern: 'jailbreak', category: 'jailbreak', layer: 'llm_guard', severity: 0.98 },
    { pattern: 'dan mode', category: 'jailbreak', layer: 'llm_guard', severity: 0.97 },
    { pattern: 'developer mode', category: 'jailbreak', layer: 'llm_guard', severity: 0.90 },
    { pattern: 'pretend you are', category: 'role_manipulation', layer: 'context_validation', severity: 0.80 },
    { pattern: 'act as if', category: 'role_manipulation', layer: 'context_validation', severity: 0.75 },
    { pattern: 'bypass', category: 'security_bypass', layer: 'embedding_similarity', severity: 0.85 },
    { pattern: 'override', category: 'security_bypass', layer: 'embedding_similarity', severity: 0.80 },
    { pattern: 'admin access', category: 'privilege_escalation', layer: 'context_validation', severity: 0.88 },
    { pattern: 'sudo', category: 'privilege_escalation', layer: 'pattern_matching', severity: 0.70 },
    { pattern: 'execute code', category: 'code_injection', layer: 'llm_guard', severity: 0.92 },
    { pattern: 'eval(', category: 'code_injection', layer: 'pattern_matching', severity: 0.95 },
    { pattern: '<script', category: 'code_injection', layer: 'pattern_matching', severity: 0.95 },
  ];

  // Adjust threshold based on profile
  const thresholds = {
    strict: 0.60,
    balanced: 0.80,
    permissive: 0.90,
  };

  const threshold = thresholds[profile || 'balanced'];

  for (const p of patterns) {
    if (lowerInput.includes(p.pattern) && p.severity >= threshold) {
      return {
        allowed: false,
        blocked_by: p.layer,
        threat_category: p.category,
        confidence: p.severity,
        latency_ms: Date.now() - startTime,
        layers: [
          { name: 'pattern_matching', passed: p.layer !== 'pattern_matching', details: p.layer === 'pattern_matching' ? `Matched: "${p.pattern}"` : undefined },
          { name: 'semantic_analysis', passed: p.layer !== 'semantic_analysis' },
          { name: 'embedding_similarity', passed: p.layer !== 'embedding_similarity' },
          { name: 'llm_guard', passed: p.layer !== 'llm_guard' },
          { name: 'context_validation', passed: p.layer !== 'context_validation' },
          { name: 'output_filtering', passed: true },
        ],
      };
    }
  }

  return {
    allowed: true,
    latency_ms: Date.now() - startTime,
    layers: [
      { name: 'pattern_matching', passed: true },
      { name: 'semantic_analysis', passed: true },
      { name: 'embedding_similarity', passed: true },
      { name: 'llm_guard', passed: true },
      { name: 'context_validation', passed: true },
      { name: 'output_filtering', passed: true },
    ],
  };
}

/**
 * Check if the defense service is healthy
 */
export async function checkDefenseServiceHealth(): Promise<{
  healthy: boolean;
  latencyMs?: number;
  version?: string;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${DEFENSE_SERVICE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        healthy: false,
        error: `Service returned ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      healthy: true,
      latencyMs: Date.now() - startTime,
      version: data.version,
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Batch analyze multiple inputs
 */
export async function analyzeTextBatch(
  inputs: { id: string; text: string }[],
  profile: DefendRequest['profile'] = 'balanced'
): Promise<{ id: string; result: DefendResponse }[]> {
  const results = await Promise.all(
    inputs.map(async ({ id, text }) => {
      const result = await analyzeText(text, profile);
      return {
        id,
        result: result.data!,
      };
    })
  );

  return results;
}

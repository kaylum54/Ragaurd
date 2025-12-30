import type { DefendAudioRequest, DefendAudioResponse } from '@/types/api';

const AUDIO_SERVICE_URL = process.env.RAGAURD_AUDIO_URL || 'http://localhost:5000';
const API_SECRET = process.env.RAGAURD_API_SECRET;

export interface AudioDefenseResult {
  success: boolean;
  data?: DefendAudioResponse;
  error?: string;
  fallbackUsed?: boolean;
}

/**
 * Analyze audio for deepfake detection
 */
export async function analyzeAudio(
  audio: string,
  format: DefendAudioRequest['format']
): Promise<AudioDefenseResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${AUDIO_SERVICE_URL}/api/v1/defend/audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_SECRET && { 'X-API-Secret': API_SECRET }),
      },
      body: JSON.stringify({ audio, format }),
      signal: AbortSignal.timeout(30000), // 30 second timeout for audio processing
    });

    if (!response.ok) {
      throw new Error(`Audio service returned ${response.status}`);
    }

    const data = await response.json();
    const latencyMs = Date.now() - startTime;

    return {
      success: true,
      data: {
        is_authentic: data.is_authentic,
        is_deepfake: data.is_deepfake,
        confidence: data.confidence,
        model_scores: data.model_scores || { aasist: 0, lcnn: 0 },
        latency_ms: latencyMs,
      },
    };
  } catch (error) {
    console.error('Audio defense service error:', error);

    // Return error - no fallback for audio since it requires ML models
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Audio analysis failed',
    };
  }
}

/**
 * Check if the audio defense service is healthy
 */
export async function checkAudioServiceHealth(): Promise<{
  healthy: boolean;
  latencyMs?: number;
  modelsLoaded?: boolean;
  error?: string;
}> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${AUDIO_SERVICE_URL}/health`, {
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
      modelsLoaded: data.models_loaded,
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate audio base64 format
 */
export function validateAudioInput(
  audio: string,
  format: string
): { valid: boolean; error?: string } {
  // Check format
  const validFormats = ['wav', 'mp3', 'ogg', 'webm'];
  if (!validFormats.includes(format)) {
    return { valid: false, error: `Invalid format. Must be one of: ${validFormats.join(', ')}` };
  }

  // Check if base64 is valid
  try {
    const decoded = Buffer.from(audio, 'base64');
    if (decoded.length === 0) {
      return { valid: false, error: 'Empty audio data' };
    }

    // Max size: 10MB
    if (decoded.length > 10 * 1024 * 1024) {
      return { valid: false, error: 'Audio file too large. Maximum size is 10MB' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid base64 encoding' };
  }
}

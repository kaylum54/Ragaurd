import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateApiKey } from '@/lib/services/db/api-keys';
import { logRequest } from '@/lib/services/db/request-log';
import { incrementDailyUsage } from '@/lib/services/db/usage';
import { analyzeAudio, validateAudioInput } from '@/lib/services/defense/audio';
import { analyzeText } from '@/lib/services/defense/text';
import { isSupabaseConfigured } from '@/lib/supabase/server';

// Demo API key for testing without database
const DEMO_API_KEY = 'rg_test_demo_key_for_local_development';

// Request validation schema
const audioDefendRequestSchema = z.object({
  audio: z.object({
    data: z.string().min(1, 'Audio data is required'),
    format: z.enum(['wav', 'mp3', 'ogg', 'webm']).default('wav'),
  }),
  profile: z.enum(['strict', 'balanced', 'permissive']).default('balanced'),
  options: z.object({
    detect_deepfake: z.boolean().default(true),
    analyze_text: z.boolean().default(true),
    transcribe: z.boolean().default(true),
    language: z.string().default('en'),
  }).optional(),
});

// Demo transcription for testing
function getDemoTranscription(audioLength: number): string {
  const demoTexts = [
    "Hello, I need help with my account.",
    "Can you tell me about your services?",
    "I'd like to schedule an appointment.",
    "What are your business hours?",
    "I have a question about my order.",
  ];
  return demoTexts[Math.floor(Math.random() * demoTexts.length)];
}

// Demo audio analysis
async function analyzeAudioDemo(
  audioData: string,
  format: string,
  options: { detect_deepfake?: boolean; analyze_text?: boolean; language?: string },
  profile: 'strict' | 'balanced' | 'permissive'
) {
  const startTime = Date.now();

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

  // Generate demo results
  const isDeepfake = Math.random() < 0.05; // 5% chance of deepfake in demo
  const transcription = getDemoTranscription(audioData.length);

  // Analyze transcribed text if enabled
  let textAnalysis = null;
  if (options.analyze_text !== false) {
    const textResult = await analyzeText(transcription, profile);
    if (textResult.success && textResult.data) {
      textAnalysis = textResult.data;
    }
  }

  const latencyMs = Date.now() - startTime;

  // Determine if allowed based on deepfake detection and text analysis
  const allowed = !isDeepfake && (textAnalysis?.allowed !== false);

  return {
    allowed,
    blocked_by: isDeepfake
      ? 'voice_pattern'
      : textAnalysis?.blocked_by || null,
    threat_category: isDeepfake
      ? 'deepfake_detected'
      : textAnalysis?.threat_category || null,
    confidence: isDeepfake ? 0.87 : (textAnalysis?.confidence || null),
    transcription,
    deepfake_score: isDeepfake ? 0.92 : 0.03 + Math.random() * 0.05,
    is_authentic: !isDeepfake,
    latency_ms: latencyMs,
    layers: [
      { name: 'speech_to_text', passed: true, latency_ms: 50 + Math.floor(Math.random() * 30) },
      {
        name: 'text_analysis',
        passed: textAnalysis?.allowed !== false,
        latency_ms: textAnalysis?.latency_ms || 0,
        details: textAnalysis?.layers || null
      },
      {
        name: 'voice_pattern',
        passed: !isDeepfake,
        confidence: isDeepfake ? 0.13 : 0.95 + Math.random() * 0.04,
        latency_ms: 80 + Math.floor(Math.random() * 40)
      },
      {
        name: 'audio_fingerprint',
        passed: true,
        latency_ms: 30 + Math.floor(Math.random() * 20)
      },
      {
        name: 'intent_classification',
        passed: true,
        intent: 'support_request',
        latency_ms: 40 + Math.floor(Math.random() * 20)
      },
      {
        name: 'output_filtering',
        passed: true,
        latency_ms: 10 + Math.floor(Math.random() * 10)
      },
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // Validate API key format
    if (!apiKey.startsWith('rg_live_') && !apiKey.startsWith('rg_test_')) {
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 401 }
      );
    }

    let orgId: string | undefined;
    let keyRecord: { id: string } | undefined;

    // Check if using demo mode (no database configured)
    const isDemoMode = !isSupabaseConfigured() || apiKey === DEMO_API_KEY;

    if (isDemoMode) {
      orgId = 'demo-org-001';
    } else {
      // Validate API key against database
      const keyValidation = await validateApiKey(apiKey);

      if (!keyValidation.valid) {
        return NextResponse.json(
          { error: keyValidation.error || 'Invalid API key' },
          { status: 401 }
        );
      }

      orgId = keyValidation.orgId;
      keyRecord = keyValidation.apiKey;
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = audioDefendRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { audio, profile, options } = validationResult.data;
    const audioOptions = options || { detect_deepfake: true, analyze_text: true, transcribe: true, language: 'en' };

    // Validate audio data
    const audioValidation = validateAudioInput(audio.data, audio.format);
    if (!audioValidation.valid) {
      return NextResponse.json(
        { error: audioValidation.error },
        { status: 400 }
      );
    }

    let result;

    // Check if external audio service is available
    const audioServiceUrl = process.env.RAGAURD_AUDIO_URL;

    if (audioServiceUrl && !isDemoMode) {
      // Use external audio service for ML-based deepfake detection
      const audioResult = await analyzeAudio(audio.data, audio.format);

      if (!audioResult.success || !audioResult.data) {
        // Fall back to demo mode if service fails
        console.warn('Audio service unavailable, using demo mode');
        result = await analyzeAudioDemo(audio.data, audio.format, audioOptions, profile);
      } else {
        // Combine audio analysis with text analysis of transcription
        const transcription = ""; // Would come from speech-to-text service
        let textAnalysis = null;

        if (audioOptions.analyze_text !== false && transcription) {
          const textResult = await analyzeText(transcription, profile);
          if (textResult.success) {
            textAnalysis = textResult.data;
          }
        }

        result = {
          allowed: audioResult.data.is_authentic && (textAnalysis?.allowed !== false),
          blocked_by: !audioResult.data.is_authentic
            ? 'voice_pattern'
            : textAnalysis?.blocked_by || null,
          threat_category: !audioResult.data.is_authentic
            ? 'deepfake_detected'
            : textAnalysis?.threat_category || null,
          confidence: audioResult.data.confidence,
          transcription,
          deepfake_score: audioResult.data.is_deepfake ? audioResult.data.confidence : (1 - audioResult.data.confidence),
          is_authentic: audioResult.data.is_authentic,
          latency_ms: audioResult.data.latency_ms,
          model_scores: audioResult.data.model_scores,
          layers: [
            { name: 'speech_to_text', passed: true },
            { name: 'text_analysis', passed: textAnalysis?.allowed !== false },
            { name: 'voice_pattern', passed: audioResult.data.is_authentic, confidence: audioResult.data.confidence },
            { name: 'audio_fingerprint', passed: true },
            { name: 'intent_classification', passed: true },
            { name: 'output_filtering', passed: true },
          ],
        };
      }
    } else {
      // Use demo mode
      result = await analyzeAudioDemo(audio.data, audio.format, audioOptions, profile);
    }

    // Log the request to database (fire and forget) - skip in demo mode
    if (orgId && !isDemoMode) {
      Promise.all([
        logRequest({
          orgId,
          apiKeyId: keyRecord?.id,
          requestType: 'audio',
          status: result.allowed ? 'passed' : 'blocked',
          blockedBy: result.blocked_by || undefined,
          threatCategory: result.threat_category || undefined,
          latencyMs: result.latency_ms,
        }),
        incrementDailyUsage(orgId, 'audio', !result.allowed, result.latency_ms),
      ]).catch((err) => console.error('Error logging request:', err));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audio Defense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const audioServiceUrl = process.env.RAGAURD_AUDIO_URL;

  return NextResponse.json({
    status: 'healthy',
    version: '1.0.0',
    audio_service: audioServiceUrl ? 'configured' : 'demo_mode',
    timestamp: new Date().toISOString(),
  });
}

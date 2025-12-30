import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateApiKey } from '@/lib/services/db/api-keys';
import { logRequest } from '@/lib/services/db/request-log';
import { incrementDailyUsage } from '@/lib/services/db/usage';
import { analyzeText } from '@/lib/services/defense/text';
import { isSupabaseConfigured } from '@/lib/supabase/server';

// Demo API key for testing without database
const DEMO_API_KEY = 'rg_test_demo_key_for_local_development';

// Request validation schema
const defendRequestSchema = z.object({
  input: z.string().min(1, 'Input is required').max(10000, 'Input too long'),
  profile: z.enum(['strict', 'balanced', 'permissive']).default('balanced'),
});

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
      // Demo mode - skip database validation
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

    // Check rate limiting (basic check using key's rate limit)
    // In production, use Redis for distributed rate limiting

    // Parse and validate request body
    const body = await request.json();
    const validationResult = defendRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { input, profile } = validationResult.data;

    // Call defense service (external or fallback)
    const defenseResult = await analyzeText(input, profile);

    if (!defenseResult.success || !defenseResult.data) {
      return NextResponse.json(
        { error: 'Defense analysis failed' },
        { status: 500 }
      );
    }

    const result = defenseResult.data;

    // Log the request to database (fire and forget) - skip in demo mode
    if (orgId && !isDemoMode) {
      Promise.all([
        logRequest({
          orgId,
          apiKeyId: keyRecord?.id,
          requestType: 'text',
          status: result.allowed ? 'passed' : 'blocked',
          blockedBy: result.blocked_by,
          threatCategory: result.threat_category,
          latencyMs: result.latency_ms,
        }),
        incrementDailyUsage(orgId, 'text', !result.allowed, result.latency_ms),
      ]).catch((err) => console.error('Error logging request:', err));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Defense API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}

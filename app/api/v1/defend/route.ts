import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateApiKey } from '@/lib/services/db/api-keys';
import { logRequest } from '@/lib/services/db/request-log';
import { incrementDailyUsage } from '@/lib/services/db/usage';
import { analyzeText } from '@/lib/services/defense/text';
import { isSupabaseConfigured } from '@/lib/supabase/server';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { logError } from '@/lib/utils/safe-error';

// Maximum request body size (1MB for text input)
const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB

// Request validation schema
const defendRequestSchema = z.object({
  input: z.string().min(1, 'Input is required').max(10000, 'Input too long'),
  profile: z.enum(['strict', 'balanced', 'permissive']).default('balanced'),
});

/**
 * Check if the provided API key is a valid demo key
 * Demo keys only work in development with demo mode enabled
 */
function isValidDemoApiKey(apiKey: string): boolean {
  if (!isDemoModeEnabled()) {
    return false;
  }

  const demoKey = process.env.DEMO_API_KEY;
  if (!demoKey) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (apiKey.length !== demoKey.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < apiKey.length; i++) {
    result |= apiKey.charCodeAt(i) ^ demoKey.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  try {
    // Check Content-Length to prevent oversized requests
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large. Maximum size is 1MB.' },
        { status: 413 }
      );
    }

    // Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

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
    let isDemoRequest = false;

    // Check if using demo key (development only)
    if (isValidDemoApiKey(apiKey)) {
      orgId = getDemoOrgId();
      isDemoRequest = true;
    } else if (!isSupabaseConfigured()) {
      // Database not configured - only allow in development demo mode
      if (isDemoModeEnabled()) {
        orgId = getDemoOrgId();
        isDemoRequest = true;
      } else {
        return NextResponse.json(
          { error: 'Service not configured' },
          { status: 503 }
        );
      }
    } else {
      // Validate API key against database
      const keyValidation = await validateApiKey(apiKey);

      if (!keyValidation.valid) {
        return NextResponse.json(
          { error: keyValidation.error || 'Invalid API key' },
          { status: 401 }
        );
      }

      // Enforce scope - API key must have 'defend:text' permission
      const requiredScope = 'defend:text';
      if (!keyValidation.apiKey?.scopes?.includes(requiredScope)) {
        return NextResponse.json(
          { error: `API key lacks required scope: ${requiredScope}` },
          { status: 403 }
        );
      }

      orgId = keyValidation.orgId;
      keyRecord = keyValidation.apiKey;
    }

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
    if (orgId && !isDemoRequest) {
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
      ]).catch((err) => logError('Error logging request', err));
    }

    return NextResponse.json(result);
  } catch (error) {
    logError('Defense API error', error);
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

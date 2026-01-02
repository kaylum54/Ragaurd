import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { analyzeText } from '@/lib/services/defense/text';
import { logError } from '@/lib/utils/safe-error';

// Request validation schema
const testRequestSchema = z.object({
  input: z.string().min(1, 'Input is required').max(10000, 'Input too long'),
  profile: z.enum(['strict', 'balanced', 'permissive']).default('balanced'),
});

/**
 * Dashboard endpoint to test the defense service
 * Uses session auth instead of API key auth
 */
export async function POST(request: NextRequest) {
  try {
    // Verify session (dashboard users are already authenticated)
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = testRequestSchema.safeParse(body);

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

    // Call defense service
    const defenseResult = await analyzeText(input, profile);

    if (!defenseResult.success || !defenseResult.data) {
      return NextResponse.json(
        { error: 'Defense analysis failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...defenseResult.data,
      fallbackUsed: defenseResult.fallbackUsed || false,
    });
  } catch (error) {
    logError('Dashboard defense test error', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

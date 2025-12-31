import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { createApiKey, getApiKeysByOrg } from '@/lib/services/db/api-keys';
import { logError } from '@/lib/utils/safe-error';

// Valid API key scopes - exported for use in other modules
export const VALID_API_SCOPES = [
  'defend:text',   // Text defense API
  'defend:audio',  // Audio defense API
  'redteam:run',   // Run redteam scans
  'keys:read',     // Read API keys
] as const;

export type ApiScope = typeof VALID_API_SCOPES[number];

const createKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  scopes: z.array(z.enum(VALID_API_SCOPES)).optional().default(['defend:text']),
  expiresInDays: z.number().min(1).max(365).optional(),
});

// List API keys
export async function GET() {
  try {
    // Get session (required)
    const session = await getSession();

    let orgId: string;

    if (session) {
      orgId = session.orgId;
    } else if (isDemoModeEnabled()) {
      // Only allow demo mode fallback in development
      orgId = getDemoOrgId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keys = await getApiKeysByOrg(orgId);

    // Don't expose the hash
    const safeKeys = keys.map((key) => ({
      id: key.id,
      name: key.name,
      prefix: key.key_prefix,
      scopes: key.scopes,
      rateLimitPerMin: key.rate_limit_per_min,
      lastUsedAt: key.last_used_at,
      expiresAt: key.expires_at,
      createdAt: key.created_at,
    }));

    return NextResponse.json({ keys: safeKeys });
  } catch (error) {
    logError('List API keys error', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// Create new API key
export async function POST(request: NextRequest) {
  try {
    // Get session (required)
    const session = await getSession();

    let orgId: string;

    if (session) {
      orgId = session.orgId;
    } else if (isDemoModeEnabled()) {
      // Only allow demo mode fallback in development
      orgId = getDemoOrgId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = createKeySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, scopes, expiresInDays } = validationResult.data;

    // Calculate expiration date if provided
    let expiresAt: string | null = null;
    if (expiresInDays) {
      const expDate = new Date();
      expDate.setDate(expDate.getDate() + expiresInDays);
      expiresAt = expDate.toISOString();
    }

    const result = await createApiKey({
      orgId,
      name,
      scopes,
      expiresAt,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      key: {
        id: result.apiKey.id,
        name: result.apiKey.name,
        prefix: result.apiKey.key_prefix,
        scopes: result.apiKey.scopes,
        expiresAt: result.apiKey.expires_at,
        createdAt: result.apiKey.created_at,
      },
      secretKey: result.secretKey, // Only returned once!
    });
  } catch (error) {
    logError('Create API key error', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

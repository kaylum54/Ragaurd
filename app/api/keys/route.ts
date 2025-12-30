import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession, getDemoOrgId } from '@/lib/services/auth/session';
import { createApiKey, getApiKeysByOrg } from '@/lib/services/db/api-keys';

// Demo mode for development without auth
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

const createKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  scopes: z.array(z.string()).optional(),
  expiresInDays: z.number().min(1).max(365).optional(),
});

// List API keys
export async function GET() {
  try {
    let orgId: string;

    if (isDemoMode()) {
      orgId = getDemoOrgId();
    } else {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      orgId = session.orgId || getDemoOrgId();
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
    console.error('List API keys error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// Create new API key
export async function POST(request: NextRequest) {
  try {
    let orgId: string;

    if (isDemoMode()) {
      orgId = getDemoOrgId();
    } else {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      orgId = session.orgId || getDemoOrgId();
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
    console.error('Create API key error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

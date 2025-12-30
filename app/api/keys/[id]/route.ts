import { NextRequest, NextResponse } from 'next/server';
import { getSession, getDemoOrgId } from '@/lib/services/auth/session';
import { revokeApiKey, deleteApiKey, getApiKeyById } from '@/lib/services/db/api-keys';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get single API key details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const key = await getApiKeyById(id);

    if (!key) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Verify ownership
    const orgId = session.orgId || getDemoOrgId();
    if (key.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      key: {
        id: key.id,
        name: key.name,
        prefix: key.key_prefix,
        scopes: key.scopes,
        rateLimitPerMin: key.rate_limit_per_min,
        lastUsedAt: key.last_used_at,
        expiresAt: key.expires_at,
        isActive: key.is_active,
        createdAt: key.created_at,
      },
    });
  } catch (error) {
    console.error('Get API key error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

// Revoke (soft delete) API key
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orgId = session.orgId || getDemoOrgId();

    const success = await revokeApiKey(id, orgId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    return NextResponse.json(
      { error: 'Failed to revoke API key' },
      { status: 500 }
    );
  }
}

// Delete API key permanently
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orgId = session.orgId || getDemoOrgId();

    const success = await deleteApiKey(id, orgId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'API key deleted' });
  } catch (error) {
    console.error('Delete API key error:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSavedEndpointById, updateSavedEndpoint, deleteSavedEndpoint } from '@/lib/services/db/endpoints';
import { logError } from '@/lib/utils/safe-error';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/endpoints/[id] - Get a single endpoint
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orgId = session.orgId;

    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const endpoint = await getSavedEndpointById(id);

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }

    // Verify ownership
    if (endpoint.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ endpoint });
  } catch (error) {
    logError('Get endpoint error', error);
    return NextResponse.json(
      { error: 'Failed to fetch endpoint' },
      { status: 500 }
    );
  }
}

// PATCH /api/endpoints/[id] - Update an endpoint
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orgId = session.orgId;

    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Verify ownership first
    const existing = await getSavedEndpointById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }
    if (existing.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, endpoint_url, endpoint_type, description, config } = body;

    // Validate URL if provided
    if (endpoint_url) {
      try {
        new URL(endpoint_url);
      } catch {
        return NextResponse.json(
          { error: 'Invalid endpoint URL format' },
          { status: 400 }
        );
      }
    }

    // Validate endpoint_type if provided
    const validTypes = ['voice_agent', 'chat_api', 'custom'];
    if (endpoint_type && !validTypes.includes(endpoint_type)) {
      return NextResponse.json(
        { error: 'Invalid endpoint type' },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (endpoint_url !== undefined) updates.endpoint_url = endpoint_url.trim();
    if (endpoint_type !== undefined) updates.endpoint_type = endpoint_type;
    if (description !== undefined) updates.description = description?.trim() || null;
    if (config !== undefined) updates.config = config;

    const endpoint = await updateSavedEndpoint(id, orgId, updates);

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Failed to update endpoint' },
        { status: 500 }
      );
    }

    return NextResponse.json({ endpoint });
  } catch (error) {
    logError('Update endpoint error', error);
    return NextResponse.json(
      { error: 'Failed to update endpoint' },
      { status: 500 }
    );
  }
}

// DELETE /api/endpoints/[id] - Delete an endpoint
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const orgId = session.orgId;

    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Verify ownership first
    const existing = await getSavedEndpointById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
    }
    if (existing.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const success = await deleteSavedEndpoint(id, orgId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete endpoint' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Endpoint deleted' });
  } catch (error) {
    logError('Delete endpoint error', error);
    return NextResponse.json(
      { error: 'Failed to delete endpoint' },
      { status: 500 }
    );
  }
}

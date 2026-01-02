import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSavedEndpoints, createSavedEndpoint } from '@/lib/services/db/endpoints';
import { logError } from '@/lib/utils/safe-error';

// GET /api/endpoints - List all saved endpoints for the org
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = session.orgId;
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const endpoints = await getSavedEndpoints(orgId);

    return NextResponse.json({ endpoints });
  } catch (error) {
    logError('Get endpoints error', error);
    return NextResponse.json(
      { error: 'Failed to fetch endpoints' },
      { status: 500 }
    );
  }
}

// POST /api/endpoints - Create a new saved endpoint
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = session.orgId;
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const { name, endpoint_url, endpoint_type, description, config } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!endpoint_url || typeof endpoint_url !== 'string') {
      return NextResponse.json(
        { error: 'Endpoint URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(endpoint_url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid endpoint URL format' },
        { status: 400 }
      );
    }

    // Validate endpoint_type
    const validTypes = ['voice_agent', 'chat_api', 'custom'];
    if (endpoint_type && !validTypes.includes(endpoint_type)) {
      return NextResponse.json(
        { error: 'Invalid endpoint type. Must be one of: voice_agent, chat_api, custom' },
        { status: 400 }
      );
    }

    const endpoint = await createSavedEndpoint(orgId, {
      name: name.trim(),
      endpoint_url: endpoint_url.trim(),
      endpoint_type: endpoint_type || 'voice_agent',
      description: description?.trim() || null,
      config: config || {},
    });

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Failed to create endpoint' },
        { status: 500 }
      );
    }

    return NextResponse.json({ endpoint }, { status: 201 });
  } catch (error) {
    logError('Create endpoint error', error);
    return NextResponse.json(
      { error: 'Failed to create endpoint' },
      { status: 500 }
    );
  }
}

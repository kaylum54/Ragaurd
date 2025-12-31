import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRedteamScanById, updateScanStatus, deleteScan } from '@/lib/services/db/redteam';
import { logError } from '@/lib/utils/safe-error';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get single scan details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const scan = await getRedteamScanById(id);

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    // Verify org ID exists
    const orgId = session.orgId;
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Verify ownership
    if (scan.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      scan: {
        id: scan.id,
        name: scan.name,
        status: scan.status,
        targetEndpoint: scan.target_endpoint,
        attackSuite: scan.attack_suite,
        totalAttacks: scan.total_attacks,
        blockedAttacks: scan.blocked_attacks,
        passedAttacks: scan.passed_attacks,
        blockRate: scan.block_rate,
        config: scan.config,
        results: scan.results,
        errorMessage: scan.error_message,
        createdAt: scan.created_at,
        startedAt: scan.started_at,
        completedAt: scan.completed_at,
      },
    });
  } catch (error) {
    logError('Get redteam scan error', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan' },
      { status: 500 }
    );
  }
}

// Update scan (start, stop, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, ...updates } = body;

    const scan = await getRedteamScanById(id);

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    // Verify org ID exists
    const orgId = session.orgId;
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Verify ownership
    if (scan.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Handle actions
    if (action === 'start') {
      await updateScanStatus(id, 'running');
      return NextResponse.json({ success: true, message: 'Scan started' });
    }

    if (action === 'stop') {
      await updateScanStatus(id, 'completed', updates);
      return NextResponse.json({ success: true, message: 'Scan stopped' });
    }

    // Generic status update
    if (updates.status) {
      await updateScanStatus(id, updates.status, updates);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError('Update redteam scan error', error);
    return NextResponse.json(
      { error: 'Failed to update scan' },
      { status: 500 }
    );
  }
}

// Delete scan
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

    const success = await deleteScan(id, orgId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete scan' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Scan deleted' });
  } catch (error) {
    logError('Delete redteam scan error', error);
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    );
  }
}

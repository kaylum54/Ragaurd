import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRedteamScanById } from '@/lib/services/db/redteam';
import { logError } from '@/lib/utils/safe-error';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Get scan progress for polling
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

    const orgId = session.orgId;
    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Verify ownership
    if (scan.org_id !== orgId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Calculate completion percentage
    const completedAttacks = scan.blocked_attacks + scan.passed_attacks + scan.error_attacks;
    const progressPercent = scan.total_attacks > 0
      ? Math.round((completedAttacks / scan.total_attacks) * 100)
      : 0;

    return NextResponse.json({
      id: scan.id,
      status: scan.status,
      progress: {
        completed: completedAttacks,
        total: scan.total_attacks,
        blocked: scan.blocked_attacks,
        passed: scan.passed_attacks,
        errors: scan.error_attacks,
        percent: progressPercent,
      },
      blockRate: scan.block_rate,
      avgLatencyMs: scan.avg_latency_ms,
      startedAt: scan.started_at,
      completedAt: scan.completed_at,
      errorMessage: scan.error_message,
    });
  } catch (error) {
    logError('Get scan progress error', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

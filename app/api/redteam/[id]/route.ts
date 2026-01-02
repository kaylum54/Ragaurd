import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRedteamScanById, updateScanStatus, deleteScan, getRedteamScans, updateScanProgress } from '@/lib/services/db/redteam';
import { startScan as startRedteamScan, getScanStatus, getScanResults, checkHealth } from '@/lib/services/redteam/client';
import { logError } from '@/lib/utils/safe-error';

// Concurrency limits
const MAX_CONCURRENT_SCANS_PER_ORG = 2;

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
        errorAttacks: scan.error_attacks,
        blockRate: scan.block_rate,
        avgLatencyMs: scan.avg_latency_ms,
        config: scan.config,
        results: scan.results,
        reportJson: scan.report_json,
        errorMessage: scan.error_message,
        garakJobId: scan.garak_job_id,
        pyritJobId: scan.pyrit_job_id,
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
      // Check if scan is already running or completed
      if (scan.status === 'running') {
        return NextResponse.json({ error: 'Scan is already running' }, { status: 400 });
      }
      if (scan.status === 'completed') {
        return NextResponse.json({ error: 'Scan has already completed' }, { status: 400 });
      }

      // Check concurrency limits
      const orgScans = await getRedteamScans(orgId);
      const runningOrgScans = orgScans.filter(s => s.status === 'running').length;

      if (runningOrgScans >= MAX_CONCURRENT_SCANS_PER_ORG) {
        return NextResponse.json(
          { error: `Maximum ${MAX_CONCURRENT_SCANS_PER_ORG} concurrent scans per organization` },
          { status: 429 }
        );
      }

      // Check service health
      const health = await checkHealth();
      if (!health.healthy) {
        return NextResponse.json(
          { error: 'Red team service is not available' },
          { status: 503 }
        );
      }

      try {
        // Start scan on the external red team server
        const externalScan = await startRedteamScan({
          platform: 'ragaurd', // Default to ragaurd platform for legacy scans
          attack_suite: scan.attack_suite as 'basic' | 'standard' | 'comprehensive',
          max_attacks: scan.total_attacks,
          profile: 'balanced',
        });

        // Update local database with external scan ID and running status
        await updateScanStatus(id, 'running');
        await updateScanProgress(id, {
          garak_job_id: externalScan.scan_id, // Store external scan_id
        });

        // Start background polling to update progress
        pollScanProgress(id, externalScan.scan_id);

        return NextResponse.json({
          success: true,
          message: 'Scan started',
          externalScanId: externalScan.scan_id,
        });
      } catch (error) {
        logError('Failed to start scan on red team server', error);
        return NextResponse.json(
          { error: 'Failed to start scan on red team server' },
          { status: 500 }
        );
      }
    }

    if (action === 'cancel') {
      if (scan.status !== 'running') {
        return NextResponse.json({ error: 'Scan is not running' }, { status: 400 });
      }

      // Mark as cancelled in database
      await updateScanStatus(id, 'cancelled');

      return NextResponse.json({ success: true, message: 'Scan cancelled' });
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

// Background polling function to update scan progress
const POLL_INTERVAL_MS = 2000; // 2 seconds
const MAX_POLL_ATTEMPTS = 1800; // 1 hour at 2s intervals

function pollScanProgress(localScanId: string, externalScanId: string): void {
  let attempts = 0;

  const poll = async () => {
    attempts++;

    if (attempts > MAX_POLL_ATTEMPTS) {
      console.log(`[RedTeam] Polling timeout for scan ${localScanId}`);
      await updateScanStatus(localScanId, 'failed', {
        error_message: 'Scan timed out',
      });
      return;
    }

    try {
      // Get status from external red team server
      const status = await getScanStatus(externalScanId);

      // Update local database with progress
      await updateScanProgress(localScanId, {
        blocked_attacks: status.progress.blocked,
        passed_attacks: status.progress.passed,
        error_attacks: status.progress.errors,
        block_rate: status.block_rate,
      });

      // Check if scan is complete
      if (status.status === 'completed') {
        try {
          // Fetch detailed results
          const results = await getScanResults(externalScanId);

          // Update with final results
          await updateScanStatus(localScanId, 'completed', {
            blocked_attacks: results.summary.blocked,
            passed_attacks: results.summary.passed,
            block_rate: results.summary.block_rate,
            report_json: results as unknown as Record<string, unknown>,
          });

          console.log(`[RedTeam] Scan ${localScanId} completed successfully`);
        } catch (error) {
          logError('Failed to fetch final results', error);
          await updateScanStatus(localScanId, 'completed', {
            blocked_attacks: status.progress.blocked,
            passed_attacks: status.progress.passed,
            block_rate: status.block_rate,
          });
        }
        return;
      }

      if (status.status === 'failed') {
        await updateScanStatus(localScanId, 'failed', {
          error_message: 'Scan failed on red team server',
        });
        return;
      }

      // Continue polling
      setTimeout(poll, POLL_INTERVAL_MS);
    } catch (error) {
      logError('Error polling scan status', error);
      // Retry on transient errors
      setTimeout(poll, POLL_INTERVAL_MS * 2);
    }
  };

  // Start polling
  setTimeout(poll, POLL_INTERVAL_MS);
}

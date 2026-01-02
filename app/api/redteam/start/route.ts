import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { checkRedteamLimit, checkRedteamFeatureAccess } from '@/lib/services/billing/enforcement';
import { createRedteamScan, updateScanProgress } from '@/lib/services/db/redteam';
import { logError } from '@/lib/utils/safe-error';

const REDTEAM_SERVICE_URL = process.env.RAGAURD_REDTEAM_URL || 'http://18.188.163.13:8000';
const REQUEST_TIMEOUT = 60000;

// Validation schema for scan request
const startScanSchema = z.object({
  platform: z.enum(['ragaurd', 'elevenlabs', 'vapi', 'retell', 'bland', 'custom']),
  max_attacks: z.number().min(1).max(1000).optional(),
  profile: z.enum(['strict', 'balanced', 'permissive']).optional(),
  agent_id: z.string().max(200).optional(),
  api_key: z.string().max(500).optional(),
  target_url: z.string().url().max(2000).optional(),
  custom_headers: z.record(z.string()).optional(),
  custom_payload_field: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get session (required)
    const session = await getSession();

    let orgId: string;

    if (session) {
      orgId = session.orgId;
    } else if (isDemoModeEnabled()) {
      orgId = getDemoOrgId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check feature access - redteam requires Pro plan or higher
    // Skip checks in demo mode or development
    const skipBillingChecks = isDemoModeEnabled() || process.env.NODE_ENV === 'development';

    if (!skipBillingChecks) {
      const featureCheck = await checkRedteamFeatureAccess(orgId);
      if (!featureCheck.allowed) {
        return NextResponse.json(
          {
            error: featureCheck.error || 'Red team testing not available on your plan',
            requiredPlan: featureCheck.requiredPlan,
            currentPlan: featureCheck.currentPlan,
          },
          { status: 403 }
        );
      }

      // Check usage limits
      const limitCheck = await checkRedteamLimit(orgId);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          {
            error: limitCheck.error || 'Usage limit exceeded',
            usage: {
              current: limitCheck.currentUsage,
              limit: limitCheck.limit,
              percentUsed: limitCheck.percentUsed,
            },
          },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const validationResult = startScanSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const scanRequest = validationResult.data;

    // Forward to external Red Team service
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${REDTEAM_SERVICE_URL}/v1/redteam/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanRequest),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Failed to start scan: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Save scan to local database for tracking
    try {
      const platformName = scanRequest.platform.charAt(0).toUpperCase() + scanRequest.platform.slice(1);
      const localScan = await createRedteamScan({
        orgId,
        name: `${platformName} Security Scan`,
        targetEndpoint: scanRequest.target_url || `${scanRequest.platform}:${scanRequest.agent_id || 'agent'}`,
        attackSuite: 'custom',
        totalAttacks: result.attack_count || scanRequest.max_attacks || 50,
        config: {
          platform: scanRequest.platform,
          profile: scanRequest.profile,
          external_scan_id: result.scan_id,
        },
      });

      if (localScan) {
        // Update with external scan ID and set to running
        await updateScanProgress(localScan.id, {
          garak_job_id: result.scan_id,
          status: 'running',
        });

        // Return both IDs so frontend can track
        return NextResponse.json({
          ...result,
          local_scan_id: localScan.id,
        });
      }
    } catch (dbError) {
      console.error('Failed to save scan to local database:', dbError);
      // Continue anyway - scan is running on external service
    }

    return NextResponse.json(result);
  } catch (error) {
    logError('Start redteam scan error', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to start scan' },
      { status: 500 }
    );
  }
}

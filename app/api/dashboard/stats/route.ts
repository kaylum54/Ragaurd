import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { getRequestStats } from '@/lib/services/db/request-log';
import { getUsageLimits, getCurrentMonthUsage } from '@/lib/services/db/usage';
import { getApiKeyCount } from '@/lib/services/db/api-keys';
import { getMemberCount } from '@/lib/services/db/organizations';
import { logError } from '@/lib/utils/safe-error';

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

    const plan = 'pro'; // In production, get from org record

    // Fetch all stats in parallel
    const [requestStats, usageLimits, monthUsage, apiKeyCount, memberCount] = await Promise.all([
      getRequestStats(orgId, 24),
      getUsageLimits(orgId, plan),
      getCurrentMonthUsage(orgId),
      getApiKeyCount(orgId),
      getMemberCount(orgId),
    ]);

    // Calculate derived stats
    const totalRequests = monthUsage.text_requests + monthUsage.audio_requests;
    const blockRate = requestStats.total > 0
      ? Math.round((requestStats.blocked / requestStats.total) * 100)
      : 0;

    return NextResponse.json({
      stats: {
        totalRequests,
        blockedThreats: requestStats.blocked,
        blockRate,
        avgLatencyMs: requestStats.avgLatencyMs,
        activeApiKeys: apiKeyCount,
        teamMembers: memberCount,
      },
      usage: {
        text: usageLimits.text_requests,
        audio: usageLimits.audio_requests,
        redteam: usageLimits.redteam_attacks,
      },
      threats: {
        breakdown: requestStats.threatBreakdown,
        last24h: {
          total: requestStats.total,
          blocked: requestStats.blocked,
          passed: requestStats.passed,
          errors: requestStats.errors,
        },
      },
    });
  } catch (error) {
    logError('Dashboard stats error', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getSession, getDemoOrgId } from '@/lib/services/auth/session';
import { getRequestStats } from '@/lib/services/db/request-log';
import { getUsageLimits, getCurrentMonthUsage } from '@/lib/services/db/usage';
import { getApiKeyCount } from '@/lib/services/db/api-keys';
import { getMemberCount } from '@/lib/services/db/organizations';

// Demo mode for development without auth
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

export async function GET() {
  try {
    let orgId: string;

    if (isDemoMode()) {
      // Allow unauthenticated access in demo mode
      orgId = getDemoOrgId();
    } else {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      orgId = session.orgId || getDemoOrgId();
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
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}

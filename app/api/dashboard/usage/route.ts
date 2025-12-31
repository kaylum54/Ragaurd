import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { getUsageStats, getDailyUsageChart } from '@/lib/services/db/usage';
import { logError } from '@/lib/utils/safe-error';

export async function GET(request: NextRequest) {
  try {
    // Get session (required)
    const session = await getSession();

    let orgId: string;

    if (session) {
      orgId = session.orgId;
    } else if (isDemoModeEnabled()) {
      // Only allow demo mode fallback in development with explicit flag
      orgId = getDemoOrgId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    const type = searchParams.get('type') || 'chart';

    if (type === 'chart') {
      const chartData = await getDailyUsageChart(orgId, days);
      return NextResponse.json({ data: chartData });
    }

    // Full usage stats
    const usageStats = await getUsageStats(orgId, days);
    return NextResponse.json({ data: usageStats });
  } catch (error) {
    logError('Usage data error', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

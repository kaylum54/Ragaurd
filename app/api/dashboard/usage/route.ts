import { NextRequest, NextResponse } from 'next/server';
import { getSession, getDemoOrgId } from '@/lib/services/auth/session';
import { getUsageStats, getDailyUsageChart } from '@/lib/services/db/usage';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = session.orgId || getDemoOrgId();

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
    console.error('Usage data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

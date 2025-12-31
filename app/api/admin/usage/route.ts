import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPlatformUsage, getGrowthData } from '@/lib/services/db/admin';
import { logError } from '@/lib/utils/safe-error';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get('days') || '30', 10), 365); // Cap at 365 days
    const type = searchParams.get('type') || 'usage';

    if (type === 'growth') {
      const growth = await getGrowthData(days);
      return NextResponse.json(growth);
    }

    const usage = await getPlatformUsage(days);
    return NextResponse.json(usage);
  } catch (error) {
    logError('Admin usage error', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

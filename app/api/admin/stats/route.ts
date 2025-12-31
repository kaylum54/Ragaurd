import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getPlatformStats } from '@/lib/services/db/admin';
import { logError } from '@/lib/utils/safe-error';

export async function GET() {
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

    const stats = await getPlatformStats();
    return NextResponse.json(stats);
  } catch (error) {
    logError('Admin stats error', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getRevenueData } from '@/lib/services/db/admin';
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

    const revenue = await getRevenueData();
    return NextResponse.json(revenue);
  } catch (error) {
    logError('Admin revenue error', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

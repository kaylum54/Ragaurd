import { NextRequest, NextResponse } from 'next/server';
import { getPlatformUsage, getGrowthData } from '@/lib/services/db/admin';

// Demo mode for development
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

export async function GET(request: NextRequest) {
  try {
    if (!isDemoMode()) {
      // TODO: Check if user is admin
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const type = searchParams.get('type') || 'usage';

    if (type === 'growth') {
      const growth = await getGrowthData(days);
      return NextResponse.json(growth);
    }

    const usage = await getPlatformUsage(days);
    return NextResponse.json(usage);
  } catch (error) {
    console.error('Admin usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

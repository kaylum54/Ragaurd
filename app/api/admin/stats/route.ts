import { NextResponse } from 'next/server';
import { getPlatformStats } from '@/lib/services/db/admin';

// Demo mode for development
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

export async function GET() {
  try {
    // In production, verify admin access here
    if (!isDemoMode()) {
      // TODO: Check if user is admin
    }

    const stats = await getPlatformStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

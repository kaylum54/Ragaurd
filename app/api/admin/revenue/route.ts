import { NextResponse } from 'next/server';
import { getRevenueData } from '@/lib/services/db/admin';

// Demo mode for development
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

export async function GET() {
  try {
    if (!isDemoMode()) {
      // TODO: Check if user is admin
    }

    const revenue = await getRevenueData();
    return NextResponse.json(revenue);
  } catch (error) {
    console.error('Admin revenue error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/services/db/admin';

// Demo mode for development
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

export async function GET(request: NextRequest) {
  try {
    if (!isDemoMode()) {
      // TODO: Check if user is admin
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || undefined;

    const { users, total } = await getAllUsers(page, limit, search);

    return NextResponse.json({
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

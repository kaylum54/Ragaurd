import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { logError } from '@/lib/utils/safe-error';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Return user data (without sensitive session info)
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
    });
  } catch (error) {
    logError('Session verification error', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

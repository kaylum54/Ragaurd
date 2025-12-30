import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { User } from '@/lib/auth';

interface SessionData {
  user: User;
  expires: number;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Decode the session token
    const sessionData: SessionData = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );

    // Check if session has expired
    if (Date.now() > sessionData.expires) {
      cookieStore.delete('session');
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: sessionData.user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

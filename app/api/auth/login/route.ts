import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = validateCredentials(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create a simple session token (in production, use proper JWT or session management)
    const sessionData = JSON.stringify({
      user,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Base64 encode the session (in production, encrypt this)
    const sessionToken = Buffer.from(sessionData).toString('base64');

    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user,
      redirectTo: user.role === 'admin' ? '/admin' : '/dashboard',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

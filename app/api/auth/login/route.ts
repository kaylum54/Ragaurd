import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/auth';

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

    // Create session data
    const sessionData = JSON.stringify({
      user,
      expires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const sessionToken = Buffer.from(sessionData).toString('base64');

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user,
      redirectTo: user.role === 'admin' ? '/admin' : '/dashboard',
    });

    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getSignedWebSocketUrl } from '@/lib/services/elevenlabs';
import { logError } from '@/lib/utils/safe-error';

export async function POST(request: NextRequest) {
  try {
    console.log('[SignedURL] Request received');
    const session = await getSession();

    if (!session) {
      console.log('[SignedURL] No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[SignedURL] Session user role:', session.user?.role);

    // Only admins can use this for now
    if (session.user?.role !== 'admin') {
      console.log('[SignedURL] User is not admin');
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { agentId, apiKey } = body;

    if (!agentId || !apiKey) {
      return NextResponse.json(
        { error: 'Agent ID and API key are required' },
        { status: 400 }
      );
    }

    console.log('[SignedURL] Fetching signed URL for agent:', agentId);
    const result = await getSignedWebSocketUrl(agentId, apiKey);

    if (!result.success) {
      console.log('[SignedURL] Failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to get signed URL' },
        { status: 400 }
      );
    }

    console.log('[SignedURL] Success, URL:', result.signedUrl);
    return NextResponse.json({
      signedUrl: result.signedUrl,
    });
  } catch (error) {
    logError('Get signed URL error', error);
    return NextResponse.json(
      { error: 'Failed to get signed URL' },
      { status: 500 }
    );
  }
}

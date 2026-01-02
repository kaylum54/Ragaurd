import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { isDemoModeEnabled } from '@/lib/auth';
import { logError } from '@/lib/utils/safe-error';

const REDTEAM_SERVICE_URL = process.env.RAGAURD_REDTEAM_URL || 'http://18.188.163.13:8000';
const REQUEST_TIMEOUT = 30000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session && !isDemoModeEnabled()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${REDTEAM_SERVICE_URL}/v1/redteam/scan/${id}/results`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to get scan results: ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    logError('Get scan results error', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get scan results' },
      { status: 500 }
    );
  }
}

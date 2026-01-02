import { NextResponse } from 'next/server';

const REDTEAM_SERVICE_URL = process.env.RAGAURD_REDTEAM_URL || 'http://18.188.163.13:8000';
const HEALTH_CHECK_TIMEOUT = 5000;

export async function GET() {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

    const response = await fetch(`${REDTEAM_SERVICE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json({
        healthy: false,
        latencyMs,
        error: `Health check failed with status ${response.status}`,
      });
    }

    return NextResponse.json({
      healthy: true,
      latencyMs,
    });
  } catch (error) {
    return NextResponse.json({
      healthy: false,
      latencyMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

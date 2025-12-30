import { NextRequest, NextResponse } from 'next/server';
import { getSession, getDemoOrgId } from '@/lib/services/auth/session';
import { getRecentRequests, getThreatCategories, getBlockedByLayer } from '@/lib/services/db/request-log';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orgId = session.orgId || getDemoOrgId();

    // Get query params
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const type = searchParams.get('type') || 'recent';

    if (type === 'threats') {
      const threats = await getThreatCategories(orgId, 30);
      return NextResponse.json({ data: threats });
    }

    if (type === 'layers') {
      const layers = await getBlockedByLayer(orgId, 30);
      return NextResponse.json({ data: layers });
    }

    // Recent requests
    const requests = await getRecentRequests(orgId, limit);

    // Transform for frontend
    const formattedRequests = requests.map((req) => ({
      id: req.id,
      timestamp: req.created_at,
      type: req.request_type,
      status: req.status,
      blockedBy: req.blocked_by,
      threatCategory: req.threat_category,
      latencyMs: req.latency_ms,
    }));

    return NextResponse.json({ data: formattedRequests });
  } catch (error) {
    console.error('Requests data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

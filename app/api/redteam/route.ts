import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession, getDemoOrgId } from '@/lib/services/auth/session';
import { getRedteamScans, getRedteamStats, createRedteamScan } from '@/lib/services/db/redteam';

// Demo mode for development without auth
const isDemoMode = () => process.env.NODE_ENV === 'development' || !process.env.AUTH0_CLIENT_ID;

const ATTACK_COUNTS: Record<string, number> = {
  basic: 50,
  standard: 200,
  comprehensive: 500,
};

const createScanSchema = z.object({
  name: z.string().optional(),
  targetEndpoint: z.string().url('Must be a valid URL'),
  attackSuite: z.enum(['basic', 'standard', 'comprehensive']),
  config: z.record(z.unknown()).optional(),
});

// List scans and stats
export async function GET(request: NextRequest) {
  try {
    let orgId: string;

    if (isDemoMode()) {
      orgId = getDemoOrgId();
    } else {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      orgId = session.orgId || getDemoOrgId();
    }
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'stats') {
      const stats = await getRedteamStats(orgId);
      return NextResponse.json(stats);
    }

    const scans = await getRedteamScans(orgId);

    // Transform for frontend
    const transformedScans = scans.map(scan => ({
      id: scan.id,
      name: scan.name,
      status: scan.status,
      targetEndpoint: scan.target_endpoint,
      attackSuite: scan.attack_suite,
      totalAttacks: scan.total_attacks,
      blockedAttacks: scan.blocked_attacks,
      passedAttacks: scan.passed_attacks,
      blockRate: scan.block_rate,
      createdAt: scan.created_at,
      startedAt: scan.started_at,
      completedAt: scan.completed_at,
    }));

    return NextResponse.json({ scans: transformedScans });
  } catch (error) {
    console.error('List redteam scans error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scans' },
      { status: 500 }
    );
  }
}

// Create new scan
export async function POST(request: NextRequest) {
  try {
    let orgId: string;

    if (isDemoMode()) {
      orgId = getDemoOrgId();
    } else {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      orgId = session.orgId || getDemoOrgId();
    }

    const body = await request.json();
    const validationResult = createScanSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, targetEndpoint, attackSuite, config } = validationResult.data;
    const totalAttacks = ATTACK_COUNTS[attackSuite] || 200;

    const scan = await createRedteamScan({
      orgId,
      name: name || `${attackSuite.charAt(0).toUpperCase() + attackSuite.slice(1)} Scan`,
      targetEndpoint,
      attackSuite,
      totalAttacks,
      config,
    });

    if (!scan) {
      // Demo mode: return fake scan
      const demoScan = {
        id: `demo-${Date.now()}`,
        name: name || `${attackSuite.charAt(0).toUpperCase() + attackSuite.slice(1)} Scan`,
        status: 'pending',
        targetEndpoint,
        attackSuite,
        totalAttacks,
        blockedAttacks: 0,
        passedAttacks: 0,
        blockRate: 0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
      };

      return NextResponse.json({ scan: demoScan });
    }

    return NextResponse.json({
      scan: {
        id: scan.id,
        name: scan.name,
        status: scan.status,
        targetEndpoint: scan.target_endpoint,
        attackSuite: scan.attack_suite,
        totalAttacks: scan.total_attacks,
        blockedAttacks: scan.blocked_attacks,
        passedAttacks: scan.passed_attacks,
        blockRate: scan.block_rate,
        createdAt: scan.created_at,
        startedAt: scan.started_at,
        completedAt: scan.completed_at,
      },
    });
  } catch (error) {
    console.error('Create redteam scan error:', error);
    return NextResponse.json(
      { error: 'Failed to create scan' },
      { status: 500 }
    );
  }
}

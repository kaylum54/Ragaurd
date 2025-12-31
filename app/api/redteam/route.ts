import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { isDemoModeEnabled, getDemoOrgId } from '@/lib/auth';
import { getRedteamScans, getRedteamStats, createRedteamScan } from '@/lib/services/db/redteam';
import { logError } from '@/lib/utils/safe-error';
import { checkRedteamLimit, checkRedteamFeatureAccess } from '@/lib/services/billing/enforcement';

const ATTACK_COUNTS: Record<string, number> = {
  basic: 50,
  standard: 200,
  comprehensive: 500,
};

// Strict config schema to prevent arbitrary data storage
const scanConfigSchema = z.object({
  timeout: z.number().min(1).max(3600).optional(),      // Max 1 hour timeout
  retries: z.number().min(0).max(5).optional(),          // Max 5 retries
  concurrency: z.number().min(1).max(10).optional(),     // Max 10 concurrent
  headers: z.record(z.string().max(1000)).optional(),    // Custom headers (limited size)
  skipPatterns: z.array(z.string().max(200)).max(20).optional(), // Attack patterns to skip
}).optional();

// Custom URL validator that only allows http/https protocols (prevents javascript: XSS)
const safeUrlSchema = z.string().max(2000).refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid HTTP or HTTPS URL' }
);

const createScanSchema = z.object({
  name: z.string().max(100).optional(),
  targetEndpoint: safeUrlSchema,
  attackSuite: z.enum(['basic', 'standard', 'comprehensive']),
  config: scanConfigSchema,
});

// List scans and stats
export async function GET(request: NextRequest) {
  try {
    // Get session (required)
    const session = await getSession();

    let orgId: string;

    if (session) {
      orgId = session.orgId;
    } else if (isDemoModeEnabled()) {
      // Only allow demo mode fallback in development
      orgId = getDemoOrgId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    logError('List redteam scans error', error);
    return NextResponse.json(
      { error: 'Failed to fetch scans' },
      { status: 500 }
    );
  }
}

// Create new scan
export async function POST(request: NextRequest) {
  try {
    // Get session (required)
    const session = await getSession();

    let orgId: string;

    if (session) {
      orgId = session.orgId;
    } else if (isDemoModeEnabled()) {
      // Only allow demo mode fallback in development
      orgId = getDemoOrgId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check feature access - redteam requires Pro plan or higher (skip for demo)
    if (!isDemoModeEnabled()) {
      const featureCheck = await checkRedteamFeatureAccess(orgId);
      if (!featureCheck.allowed) {
        return NextResponse.json(
          {
            error: featureCheck.error || 'Red team testing not available on your plan',
            requiredPlan: featureCheck.requiredPlan,
            currentPlan: featureCheck.currentPlan,
          },
          { status: 403 }
        );
      }

      // Check usage limits before processing
      const limitCheck = await checkRedteamLimit(orgId);
      if (!limitCheck.allowed) {
        return NextResponse.json(
          {
            error: limitCheck.error || 'Usage limit exceeded',
            usage: {
              current: limitCheck.currentUsage,
              limit: limitCheck.limit,
              percentUsed: limitCheck.percentUsed,
            },
          },
          { status: 429 }
        );
      }
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
    logError('Create redteam scan error', error);
    return NextResponse.json(
      { error: 'Failed to create scan' },
      { status: 500 }
    );
  }
}

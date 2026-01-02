import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';
import { getPlanLimits, getPlanFeatures, PlanType } from '@/lib/services/db/plans';
import { getOrganizationById } from '@/lib/services/db/organizations';
import { getUsageLimits } from '@/lib/services/db/usage';
import { logError } from '@/lib/utils/safe-error';

export async function GET(req: NextRequest) {
  try {
    // Get session from cookie
    const sessionToken = req.cookies.get('ragaurd_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifySessionToken(sessionToken);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { orgId, user } = session;
    if (!orgId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    // Get organization details
    const organization = await getOrganizationById(orgId);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const plan = organization.plan as PlanType;

    // Get plan limits and features
    const [planLimits, usageLimits] = await Promise.all([
      getPlanLimits(plan),
      getUsageLimits(orgId, plan),
    ]);

    const features = getPlanFeatures(plan);

    // If admin, grant all features
    const effectiveFeatures = isAdmin
      ? {
          audioDefense: true,
          redTeam: true,
          textDefense: true,
          apiKeys: true,
          usage: true,
          billing: true,
          team: true,
          settings: true,
        }
      : features;

    // If admin, set unlimited usage
    const effectiveLimits = isAdmin
      ? {
          ...planLimits,
          text_requests_monthly: null, // null = unlimited
          audio_requests_monthly: null,
          redteam_attacks_monthly: null,
          max_api_keys: null,
          max_team_members: null,
          audio_enabled: true,
          redteam_enabled: true,
        }
      : planLimits;

    return NextResponse.json({
      plan: {
        name: isAdmin ? 'enterprise' : plan, // Admins show as enterprise
        displayName: isAdmin ? 'Admin (Unlimited)' : (planLimits?.display_name || plan),
        priceMonthly: planLimits?.price_monthly || 0,
      },
      features: effectiveFeatures,
      limits: effectiveLimits,
      usage: usageLimits,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      isAdmin,
    });
  } catch (error) {
    logError('Error fetching user plan', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan information' },
      { status: 500 }
    );
  }
}

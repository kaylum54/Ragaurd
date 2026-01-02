// Billing enforcement module for checking feature access and usage limits

import { checkUsageLimit, getOrgPlan } from '@/lib/services/db/usage';
import { createServiceClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/server';

interface LimitCheckResult {
  allowed: boolean;
  error?: string;
  currentUsage?: number;
  limit?: number;
  percentUsed?: number;
}

interface FeatureCheckResult {
  allowed: boolean;
  error?: string;
  requiredPlan?: string;
  currentPlan?: string;
}

/**
 * Check if demo mode should bypass checks
 */
function shouldBypassChecks(): boolean {
  return !isSupabaseConfigured() || process.env.DEMO_MODE === 'true';
}

interface PlanFeatures {
  redteam_enabled: boolean;
  audio_enabled: boolean;
}

/**
 * Check if the organization has access to redteam feature
 */
export async function checkRedteamFeatureAccess(orgId: string): Promise<FeatureCheckResult> {
  if (shouldBypassChecks()) {
    return { allowed: true };
  }

  try {
    const plan = await getOrgPlan(orgId);
    const supabase = createServiceClient();

    const { data } = await supabase
      .from('plan_limits')
      .select('redteam_enabled')
      .eq('plan', plan)
      .single();

    const planLimits = data as PlanFeatures | null;

    if (!planLimits?.redteam_enabled) {
      return {
        allowed: false,
        error: 'Red team testing is not available on your current plan',
        requiredPlan: 'pro',
        currentPlan: plan,
      };
    }

    return { allowed: true };
  } catch {
    // Fail open in case of error
    return { allowed: true };
  }
}

/**
 * Check if the organization has remaining redteam scans
 */
export async function checkRedteamLimit(orgId: string): Promise<LimitCheckResult> {
  if (shouldBypassChecks()) {
    return {
      allowed: true,
      currentUsage: 5,
      limit: 1000,
      percentUsed: 0.5,
    };
  }

  try {
    const plan = await getOrgPlan(orgId);
    const limitCheck = await checkUsageLimit(orgId, plan, 'redteam');

    return {
      allowed: limitCheck.allowed,
      error: limitCheck.reason,
      currentUsage: limitCheck.current,
      limit: limitCheck.limit ?? undefined,
      percentUsed: limitCheck.percentage,
    };
  } catch {
    // Fail open in case of error
    return { allowed: true };
  }
}

/**
 * Check if the organization has access to text defense feature
 */
export async function checkTextDefenseAccess(orgId: string): Promise<FeatureCheckResult> {
  // Text defense is available on all plans
  return { allowed: true };
}

/**
 * Check text defense usage limits
 */
export async function checkTextDefenseLimit(orgId: string): Promise<LimitCheckResult> {
  if (shouldBypassChecks()) {
    return {
      allowed: true,
      currentUsage: 100,
      limit: 25000,
      percentUsed: 0.4,
    };
  }

  try {
    const plan = await getOrgPlan(orgId);
    const limitCheck = await checkUsageLimit(orgId, plan, 'text');

    return {
      allowed: limitCheck.allowed,
      error: limitCheck.reason,
      currentUsage: limitCheck.current,
      limit: limitCheck.limit ?? undefined,
      percentUsed: limitCheck.percentage,
    };
  } catch {
    // Fail open in case of error
    return { allowed: true };
  }
}

/**
 * Check if the organization has access to audio defense feature
 */
export async function checkAudioDefenseAccess(orgId: string): Promise<FeatureCheckResult> {
  if (shouldBypassChecks()) {
    return { allowed: true };
  }

  try {
    const plan = await getOrgPlan(orgId);
    const supabase = createServiceClient();

    const { data } = await supabase
      .from('plan_limits')
      .select('audio_enabled')
      .eq('plan', plan)
      .single();

    const planLimits = data as PlanFeatures | null;

    if (!planLimits?.audio_enabled) {
      return {
        allowed: false,
        error: 'Audio defense is not available on your current plan',
        requiredPlan: 'pro',
        currentPlan: plan,
      };
    }

    return { allowed: true };
  } catch {
    // Fail open in case of error
    return { allowed: true };
  }
}

/**
 * Check audio defense usage limits
 */
export async function checkAudioDefenseLimit(orgId: string): Promise<LimitCheckResult> {
  if (shouldBypassChecks()) {
    return {
      allowed: true,
      currentUsage: 10,
      limit: 50000,
      percentUsed: 0.02,
    };
  }

  try {
    const plan = await getOrgPlan(orgId);
    const limitCheck = await checkUsageLimit(orgId, plan, 'audio');

    return {
      allowed: limitCheck.allowed,
      error: limitCheck.reason,
      currentUsage: limitCheck.current,
      limit: limitCheck.limit ?? undefined,
      percentUsed: limitCheck.percentage,
    };
  } catch {
    // Fail open in case of error
    return { allowed: true };
  }
}

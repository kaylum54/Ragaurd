import { createServiceClient } from '@/lib/supabase/server';

export type PlanType = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  plan: PlanType;
  display_name: string;
  price_monthly: number | null;
  text_requests_monthly: number | null;
  audio_requests_monthly: number | null;
  redteam_attacks_monthly: number | null;
  max_api_keys: number | null;
  max_team_members: number | null;
  latency_sla_ms: number | null;
  audio_enabled: boolean;
  redteam_enabled: boolean;
  support_level: string;
}

export interface PlanFeatures {
  audioDefense: boolean;
  redTeam: boolean;
  textDefense: boolean;
  apiKeys: boolean;
  usage: boolean;
  billing: boolean;
  team: boolean;
  settings: boolean;
}

// Get plan limits from database
export async function getPlanLimits(plan: PlanType): Promise<PlanLimits | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('plan_limits')
    .select('*')
    .eq('plan', plan)
    .single();

  if (error) {
    console.error('Error fetching plan limits:', error);
    return null;
  }

  return data as PlanLimits;
}

// Get all plan limits for comparison
export async function getAllPlanLimits(): Promise<PlanLimits[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('plan_limits')
    .select('*')
    .order('price_monthly', { ascending: true, nullsFirst: true });

  if (error) {
    console.error('Error fetching all plan limits:', error);
    return [];
  }

  return (data as PlanLimits[]) || [];
}

// Check which features are available for a plan
export function getPlanFeatures(plan: PlanType): PlanFeatures {
  // Base features available to ALL plans (including free)
  const baseFeatures: PlanFeatures = {
    textDefense: true,
    apiKeys: true,
    usage: true,      // Always available
    billing: true,    // Always available
    settings: true,   // Always available
    audioDefense: false,
    redTeam: false,
    team: false,
  };

  switch (plan) {
    case 'free':
      return {
        ...baseFeatures,
        // Free plan: no audio, no redteam, no team
      };
    case 'starter':
      return {
        ...baseFeatures,
        team: true,  // Starter adds team feature
      };
    case 'pro':
    case 'business':
    case 'enterprise':
      return {
        ...baseFeatures,
        audioDefense: true,
        redTeam: true,
        team: true,
      };
    default:
      return baseFeatures;
  }
}

// Check if a specific feature is available for a plan
export function hasFeatureAccess(plan: PlanType, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(plan);
  return features[feature];
}

// Get organization's plan
export async function getOrganizationPlan(orgId: string): Promise<PlanType | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('plan')
    .eq('id', orgId)
    .single();

  if (error) {
    console.error('Error fetching organization plan:', error);
    return null;
  }

  return (data as { plan: PlanType })?.plan || null;
}

// Check if organization can use a feature
export async function canUseFeature(orgId: string, feature: keyof PlanFeatures): Promise<boolean> {
  const plan = await getOrganizationPlan(orgId);
  if (!plan) return false;
  return hasFeatureAccess(plan, feature);
}

// Check usage against plan limits
export async function checkUsageLimits(
  orgId: string,
  type: 'text' | 'audio' | 'redteam' | 'api_keys' | 'team_members',
  currentCount: number
): Promise<{ allowed: boolean; limit: number | null; remaining: number | null }> {
  const plan = await getOrganizationPlan(orgId);
  if (!plan) {
    return { allowed: false, limit: null, remaining: null };
  }

  const limits = await getPlanLimits(plan);
  if (!limits) {
    return { allowed: false, limit: null, remaining: null };
  }

  let limit: number | null = null;

  switch (type) {
    case 'text':
      limit = limits.text_requests_monthly;
      break;
    case 'audio':
      if (!limits.audio_enabled) {
        return { allowed: false, limit: 0, remaining: 0 };
      }
      limit = limits.audio_requests_monthly;
      break;
    case 'redteam':
      if (!limits.redteam_enabled) {
        return { allowed: false, limit: 0, remaining: 0 };
      }
      limit = limits.redteam_attacks_monthly;
      break;
    case 'api_keys':
      limit = limits.max_api_keys;
      break;
    case 'team_members':
      limit = limits.max_team_members;
      break;
  }

  // null limit means unlimited
  if (limit === null) {
    return { allowed: true, limit: null, remaining: null };
  }

  const remaining = limit - currentCount;
  return {
    allowed: currentCount < limit,
    limit,
    remaining: remaining > 0 ? remaining : 0,
  };
}

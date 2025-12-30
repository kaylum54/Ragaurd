export type PlanType = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

export interface PlanLimits {
  displayName: string;
  priceMonthly: number | null;
  textRequestsMonthly: number | null;
  audioRequestsMonthly: number | null;
  redteamAttacksMonthly: number | null;
  maxApiKeys: number | null;
  maxTeamMembers: number | null;
  latencySlams: number;
  audioEnabled: boolean;
  redteamEnabled: boolean;
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated' | '24/7';
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    displayName: 'Free',
    priceMonthly: 0,
    textRequestsMonthly: 500,
    audioRequestsMonthly: 0,
    redteamAttacksMonthly: 0,
    maxApiKeys: 1,
    maxTeamMembers: 1,
    latencySlams: 1000,
    audioEnabled: false,
    redteamEnabled: false,
    supportLevel: 'community',
  },
  starter: {
    displayName: 'Starter',
    priceMonthly: 7900,
    textRequestsMonthly: 25000,
    audioRequestsMonthly: 0,
    redteamAttacksMonthly: 0,
    maxApiKeys: 3,
    maxTeamMembers: 3,
    latencySlams: 500,
    audioEnabled: false,
    redteamEnabled: false,
    supportLevel: 'email',
  },
  pro: {
    displayName: 'Professional',
    priceMonthly: 24900,
    textRequestsMonthly: 150000,
    audioRequestsMonthly: 50000,
    redteamAttacksMonthly: 1000,
    maxApiKeys: 10,
    maxTeamMembers: 10,
    latencySlams: 200,
    audioEnabled: true,
    redteamEnabled: true,
    supportLevel: 'priority',
  },
  business: {
    displayName: 'Business',
    priceMonthly: 64900,
    textRequestsMonthly: 500000,
    audioRequestsMonthly: 200000,
    redteamAttacksMonthly: 10000,
    maxApiKeys: 25,
    maxTeamMembers: 25,
    latencySlams: 100,
    audioEnabled: true,
    redteamEnabled: true,
    supportLevel: 'dedicated',
  },
  enterprise: {
    displayName: 'Enterprise',
    priceMonthly: null,
    textRequestsMonthly: null,
    audioRequestsMonthly: null,
    redteamAttacksMonthly: null,
    maxApiKeys: null,
    maxTeamMembers: null,
    latencySlams: 50,
    audioEnabled: true,
    redteamEnabled: true,
    supportLevel: '24/7',
  },
};

export const PLAN_ORDER: PlanType[] = ['free', 'starter', 'pro', 'business', 'enterprise'];

export function isPlanAtLeast(currentPlan: PlanType, requiredPlan: PlanType): boolean {
  return PLAN_ORDER.indexOf(currentPlan) >= PLAN_ORDER.indexOf(requiredPlan);
}

export function canAccessFeature(
  plan: PlanType,
  feature: 'audio' | 'redteam' | 'team' | 'advancedReports'
): boolean {
  const limits = PLAN_LIMITS[plan];
  switch (feature) {
    case 'audio':
      return limits.audioEnabled;
    case 'redteam':
      return limits.redteamEnabled;
    case 'team':
      return (limits.maxTeamMembers ?? 0) > 1;
    case 'advancedReports':
      return isPlanAtLeast(plan, 'business');
    default:
      return false;
  }
}

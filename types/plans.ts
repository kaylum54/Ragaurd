export type PlanType = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';
export type SupportLevel = 'community' | 'email' | 'priority' | 'dedicated' | '24/7';

export interface PlanFeature {
  name: string;
  included: boolean;
  value?: string | number | null;
  tooltip?: string;
}

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  features: PlanFeature[];
  limits: {
    textRequestsMonthly: number | null;
    audioRequestsMonthly: number | null;
    redteamAttacksMonthly: number | null;
    maxApiKeys: number | null;
    maxTeamMembers: number | null;
    latencySlaMs: number;
  };
  capabilities: {
    audioEnabled: boolean;
    redteamEnabled: boolean;
    teamEnabled: boolean;
    advancedReportsEnabled: boolean;
    customIntegrationsEnabled: boolean;
    slaEnabled: boolean;
  };
  supportLevel: SupportLevel;
  stripePriceId?: string;
  highlighted?: boolean;
}

export interface Subscription {
  id: string;
  plan: PlanType;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { PlanFeatures } from '@/lib/services/db/plans';

export type PlanType = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

interface PlanInfo {
  name: PlanType;
  displayName: string;
  priceMonthly: number;
}

interface UsageLimit {
  used: number;
  limit: number | null;
  percentage?: number;
}

interface UsageLimits {
  text_requests: UsageLimit;
  audio_requests: UsageLimit;
  redteam_attacks: UsageLimit;
  api_keys: UsageLimit;
  team_members: UsageLimit;
}

interface PlanLimits {
  text_requests_monthly: number | null;
  audio_requests_monthly: number | null;
  redteam_attacks_monthly: number | null;
  max_api_keys: number | null;
  max_team_members: number | null;
  audio_enabled: boolean;
  redteam_enabled: boolean;
}

interface OrganizationInfo {
  id: string;
  name: string;
  slug: string;
}

interface PlanContextType {
  plan: PlanInfo | null;
  features: PlanFeatures | null;
  limits: PlanLimits | null;
  usage: UsageLimits | null;
  organization: OrganizationInfo | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  refetch: () => Promise<void>;
  canUseFeature: (feature: keyof PlanFeatures) => boolean;
  isProFeature: (feature: keyof PlanFeatures) => boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [features, setFeatures] = useState<PlanFeatures | null>(null);
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [usage, setUsage] = useState<UsageLimits | null>(null);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/plan');

      if (!response.ok) {
        if (response.status === 401) {
          // Not logged in - this is okay, just set defaults
          setFeatures({
            audioDefense: false,
            redTeam: false,
            textDefense: false,
            apiKeys: false,
            usage: false,
            billing: false,
            team: false,
            settings: false,
          });
          return;
        }
        throw new Error('Failed to fetch plan data');
      }

      const data = await response.json();

      setPlan(data.plan);
      setFeatures(data.features);
      setLimits(data.limits);
      setUsage(data.usage);
      setOrganization(data.organization);
      setIsAdmin(data.isAdmin || false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  const canUseFeature = (feature: keyof PlanFeatures): boolean => {
    // Admins have access to all features
    if (isAdmin) return true;
    if (!features) return false;
    return features[feature];
  };

  // Features that require Pro or higher
  const proFeatures: (keyof PlanFeatures)[] = ['audioDefense', 'redTeam'];

  const isProFeature = (feature: keyof PlanFeatures): boolean => {
    return proFeatures.includes(feature);
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        features,
        limits,
        usage,
        organization,
        loading,
        error,
        isAdmin,
        refetch: fetchPlanData,
        canUseFeature,
        isProFeature,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}

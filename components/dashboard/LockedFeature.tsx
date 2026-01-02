'use client';

import Link from 'next/link';
import { Lock, Zap, ArrowRight } from 'lucide-react';
import { usePlan } from '@/lib/contexts/PlanContext';
import type { PlanFeatures } from '@/lib/services/db/plans';

interface LockedFeatureProps {
  feature: keyof PlanFeatures;
  title: string;
  description: string;
  requiredPlan?: string;
  children: React.ReactNode;
}

export function LockedFeature({
  feature,
  title,
  description,
  requiredPlan = 'Pro',
  children,
}: LockedFeatureProps) {
  const { canUseFeature, loading, plan } = usePlan();

  // Show children while loading to avoid flash
  if (loading) {
    return <>{children}</>;
  }

  // If user has access, show the actual content
  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  // Show locked state
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-page-title flex items-center gap-3">
            {title}
            <Lock className="h-6 w-6 text-dash-text-muted" />
          </h1>
          <p className="dash-page-subtitle">{description}</p>
        </div>
        <span className="dash-badge bg-slate-500/20 text-slate-400 border-slate-500/40">
          {requiredPlan}+ Only
        </span>
      </div>

      {/* Locked Card */}
      <div className="dash-card">
        <div className="dash-card-body text-center py-16">
          <div className="h-20 w-20 mx-auto mb-6 bg-dash-accent/10 border-2 border-dash-accent/30 flex items-center justify-center">
            <Lock className="h-10 w-10 text-dash-accent" />
          </div>
          <h2 className="text-2xl font-bold text-dash-text-primary mb-3">
            Upgrade to {requiredPlan} to Unlock
          </h2>
          <p className="text-dash-text-secondary max-w-md mx-auto mb-8">
            {title} is available on the {requiredPlan} plan and above. Upgrade your subscription to access this feature.
          </p>

          {/* Current plan info */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-dash-bg-secondary border-2 border-dash-border mb-6">
            <span className="text-sm text-dash-text-muted">Current Plan:</span>
            <span className="text-sm font-bold text-dash-text-primary capitalize">
              {plan?.displayName || 'Free'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/billing" className="dash-btn dash-btn-primary px-8">
              <Zap className="h-4 w-4" />
              Upgrade to {requiredPlan}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/billing" className="dash-btn dash-btn-secondary">
              View All Plans
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Preview (blurred) */}
      <div className="relative">
        <div className="absolute inset-0 bg-dash-bg-primary/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-8 w-8 text-dash-text-muted mx-auto mb-2" />
            <p className="text-sm font-medium text-dash-text-muted">Preview locked</p>
          </div>
        </div>
        <div className="opacity-30 pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
}

// Simpler version that just wraps content with a check
export function RequireFeature({
  feature,
  children,
  fallback,
}: {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { canUseFeature, loading } = usePlan();

  if (loading) return null;

  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

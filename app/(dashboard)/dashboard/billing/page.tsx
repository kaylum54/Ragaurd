'use client';

import { CreditCard, Check, Download, ExternalLink, Zap, Loader2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlan } from '@/lib/contexts/PlanContext';

// Plan details for display
const planDetails = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '1,000 text requests/month',
      '2 API keys',
      'Community support',
    ],
    lockedFeatures: [
      'Audio defense',
      'Red team scans',
      'Team members',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 4900,
    features: [
      '10,000 text requests/month',
      '5 API keys',
      '3 team members',
      'Email support',
    ],
    lockedFeatures: [
      'Audio defense',
      'Red team scans',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19900,
    popular: true,
    features: [
      '100,000 text requests/month',
      '1,000 audio requests/month',
      '100 red team attacks/month',
      '10 API keys',
      '10 team members',
      'Priority support',
    ],
    lockedFeatures: [],
  },
  {
    id: 'business',
    name: 'Business',
    price: 49900,
    features: [
      '500,000 text requests/month',
      '5,000 audio requests/month',
      '500 red team attacks/month',
      '25 API keys',
      '25 team members',
      'Dedicated support',
      'SLA guarantee',
    ],
    lockedFeatures: [],
  },
];

export default function BillingPage() {
  const { plan, usage, limits, loading, organization } = usePlan();

  const currentPlanId = plan?.name || 'free';
  const currentPlanIndex = planDetails.findIndex(p => p.id === currentPlanId);

  // Calculate usage percentages
  const textPercent = usage?.text_requests?.limit
    ? (usage.text_requests.used / usage.text_requests.limit) * 100
    : 0;
  const audioPercent = usage?.audio_requests?.limit
    ? (usage.audio_requests.used / usage.audio_requests.limit) * 100
    : 0;
  const redteamPercent = usage?.redteam_attacks?.limit
    ? (usage.redteam_attacks.used / usage.redteam_attacks.limit) * 100
    : 0;

  const isFreePlan = currentPlanId === 'free';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="dash-page-title">Billing & Subscription</h1>
        <p className="dash-page-subtitle">
          Manage your plan and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Current Plan</span>
          <span className={cn(
            'dash-badge uppercase',
            isFreePlan ? 'bg-slate-500/20 text-slate-400 border-slate-500/40' : 'dash-badge-success'
          )}>
            {isFreePlan ? 'Free Tier' : 'Active'}
          </span>
        </div>
        <div className="dash-card-body space-y-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              'h-12 w-12 border-2 flex items-center justify-center',
              isFreePlan
                ? 'bg-slate-500/20 border-slate-500/30'
                : 'bg-dash-accent/20 border-dash-accent/30'
            )}>
              <Zap className={cn(
                'h-6 w-6',
                isFreePlan ? 'text-slate-400' : 'text-dash-accent'
              )} />
            </div>
            <div>
              <div className="text-lg font-bold text-dash-text-primary">
                {plan?.displayName || 'Free'} Plan
              </div>
              <div className="text-xs text-dash-text-muted">
                {isFreePlan ? (
                  'Upgrade to unlock more features'
                ) : (
                  `$${((plan?.priceMonthly || 0) / 100).toFixed(0)}/month`
                )}
              </div>
            </div>
          </div>

          {/* Usage */}
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-dash-text-muted" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Text Requests */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-dash-text-secondary">Text Requests</span>
                  <span className="text-xs text-dash-text-muted tabular-nums font-medium">
                    {(usage?.text_requests?.used || 0).toLocaleString()} / {(usage?.text_requests?.limit || limits?.text_requests_monthly || 1000).toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-dash-bg-tertiary overflow-hidden">
                  <div
                    className="h-full bg-dash-accent transition-all"
                    style={{ width: `${Math.min(textPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Audio Requests - Show locked for free plan */}
              <div className={cn(!limits?.audio_enabled && 'opacity-50')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-dash-text-secondary flex items-center gap-2">
                    Audio Requests
                    {!limits?.audio_enabled && <Lock className="h-3 w-3 text-dash-text-muted" />}
                  </span>
                  <span className="text-xs text-dash-text-muted tabular-nums font-medium">
                    {limits?.audio_enabled
                      ? `${(usage?.audio_requests?.used || 0).toLocaleString()} / ${(usage?.audio_requests?.limit || 0).toLocaleString()}`
                      : 'Pro+ only'
                    }
                  </span>
                </div>
                <div className="h-2 bg-dash-bg-tertiary overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: limits?.audio_enabled ? `${Math.min(audioPercent, 100)}%` : '0%' }}
                  />
                </div>
              </div>

              {/* Red Team Attacks - Show locked for free plan */}
              <div className={cn(!limits?.redteam_enabled && 'opacity-50')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-dash-text-secondary flex items-center gap-2">
                    Red Team Attacks
                    {!limits?.redteam_enabled && <Lock className="h-3 w-3 text-dash-text-muted" />}
                  </span>
                  <span className="text-xs text-dash-text-muted tabular-nums font-medium">
                    {limits?.redteam_enabled
                      ? `${(usage?.redteam_attacks?.used || 0).toLocaleString()} / ${(usage?.redteam_attacks?.limit || 0).toLocaleString()}`
                      : 'Pro+ only'
                    }
                  </span>
                </div>
                <div className="h-2 bg-dash-bg-tertiary overflow-hidden">
                  <div
                    className="h-full bg-dash-warning transition-all"
                    style={{ width: limits?.redteam_enabled ? `${Math.min(redteamPercent, 100)}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {!isFreePlan && (
            <div className="flex gap-2 pt-4 border-t-2 border-dash-border">
              <button className="dash-btn dash-btn-secondary">
                <ExternalLink className="h-4 w-4" />
                Manage Subscription
              </button>
              <button className="dash-btn dash-btn-secondary">
                Update Payment Method
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-sm font-bold text-dash-text-secondary uppercase tracking-wider mb-4">
          {isFreePlan ? 'Upgrade Your Plan' : 'Available Plans'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {planDetails.map((planItem, index) => {
            const isCurrent = planItem.id === currentPlanId;
            const isDowngrade = index < currentPlanIndex;
            const isUpgrade = index > currentPlanIndex;

            return (
              <div
                key={planItem.id}
                className={cn(
                  'dash-card relative',
                  isCurrent && 'border-dash-accent',
                  planItem.popular && !isCurrent && 'border-purple-500/50'
                )}
              >
                {planItem.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold uppercase tracking-wide px-3 py-1">
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div className="bg-dash-accent text-white text-xs font-bold uppercase tracking-wide text-center py-2">
                    Current Plan
                  </div>
                )}
                <div className="dash-card-body">
                  <div className="text-sm font-bold text-dash-text-primary">{planItem.name}</div>
                  <div className="mt-2">
                    {planItem.price === 0 ? (
                      <span className="dash-stats-value">Free</span>
                    ) : (
                      <>
                        <span className="dash-stats-value">
                          ${(planItem.price / 100).toFixed(0)}
                        </span>
                        <span className="text-xs text-dash-text-muted">/month</span>
                      </>
                    )}
                  </div>

                  {/* Included Features */}
                  <ul className="mt-4 space-y-2">
                    {planItem.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-dash-text-secondary">
                        <Check className="h-4 w-4 text-dash-success shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Locked Features */}
                  {planItem.lockedFeatures.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {planItem.lockedFeatures.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-dash-text-muted">
                          <Lock className="h-4 w-4 text-dash-text-muted shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    className={cn(
                      'dash-btn w-full mt-4',
                      isCurrent
                        ? 'bg-dash-bg-tertiary text-dash-text-muted cursor-not-allowed border-dash-border'
                        : isUpgrade
                          ? 'dash-btn-primary'
                          : 'dash-btn-secondary'
                    )}
                    disabled={isCurrent}
                  >
                    {isCurrent
                      ? 'Current Plan'
                      : isUpgrade
                        ? 'Upgrade'
                        : 'Downgrade'
                    }
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice History - Only show for paid plans */}
      {!isFreePlan && (
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Invoice History</span>
          </div>
          <div className="dash-card-body p-0">
            <div className="flex items-center justify-center py-8 text-dash-text-muted">
              <p className="text-sm">No invoices yet. Invoices will appear here after your first payment.</p>
            </div>
          </div>
        </div>
      )}

      {/* Free Plan CTA */}
      {isFreePlan && (
        <div className="dash-card bg-gradient-to-r from-dash-accent/10 to-purple-500/10 border-dash-accent/30">
          <div className="dash-card-body text-center py-8">
            <Zap className="h-12 w-12 text-dash-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dash-text-primary mb-2">
              Unlock the Full Power of Ragaurd
            </h3>
            <p className="text-dash-text-secondary mb-6 max-w-md mx-auto">
              Upgrade to Pro to access audio defense, red team scanning, and priority support.
            </p>
            <button className="dash-btn dash-btn-primary px-8">
              Upgrade to Pro - $199/month
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

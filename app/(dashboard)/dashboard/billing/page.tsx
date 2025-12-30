'use client';

import { CreditCard, Check, Download, ExternalLink, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUsageStats } from '@/hooks/useUsage';

// Mock subscription data (would come from Stripe in production)
const subscription = {
  plan: 'pro',
  planName: 'Professional',
  status: 'active',
  currentPeriodStart: '2024-12-01',
  currentPeriodEnd: '2025-01-01',
  priceMonthly: 24900, // cents
};

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 7900,
    features: ['25K text requests', 'Email support', '3 team members'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 24900,
    features: ['150K text requests', '50K audio requests', '1K red team attacks', 'Priority support'],
    current: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 64900,
    features: ['500K text requests', '200K audio requests', '10K red team attacks', 'Dedicated support'],
  },
];

const invoices = [
  { id: 'inv_001', date: '2024-12-01', amount: 24900, status: 'paid' },
  { id: 'inv_002', date: '2024-11-01', amount: 24900, status: 'paid' },
  { id: 'inv_003', date: '2024-10-01', amount: 24900, status: 'paid' },
];

export default function BillingPage() {
  const { stats, loading } = useUsageStats();

  const textPercent = stats.text.limit > 0 ? (stats.text.used / stats.text.limit) * 100 : 0;
  const audioPercent = stats.audio.limit > 0 ? (stats.audio.used / stats.audio.limit) * 100 : 0;
  const redteamPercent = stats.redteam.limit > 0 ? (stats.redteam.used / stats.redteam.limit) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-midnight-950">Billing & Subscription</h1>
        <p className="text-xs text-midnight-500 mt-0.5">
          Manage your plan and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
        <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60 flex items-center justify-between">
          <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Current Plan</h2>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-secure-600 text-white rounded uppercase">
            {subscription.status}
          </span>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded bg-accent-100 border border-accent-200 flex items-center justify-center">
              <Zap className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-midnight-950">{subscription.planName}</div>
              <div className="text-xs text-midnight-500">
                ${(subscription.priceMonthly / 100).toFixed(0)}/month · Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Usage */}
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-midnight-400" />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-midnight-700">Text Requests</span>
                  <span className="text-xs text-midnight-500 tabular-nums font-medium">
                    {stats.text.used.toLocaleString()} / {stats.text.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-midnight-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-midnight-700 rounded-sm transition-all"
                    style={{ width: `${Math.min(textPercent, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-midnight-700">Audio Requests</span>
                  <span className="text-xs text-midnight-500 tabular-nums font-medium">
                    {stats.audio.used.toLocaleString()} / {stats.audio.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-midnight-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-accent-600 rounded-sm transition-all"
                    style={{ width: `${Math.min(audioPercent, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-midnight-700">Red Team Attacks</span>
                  <span className="text-xs text-midnight-500 tabular-nums font-medium">
                    {stats.redteam.used.toLocaleString()} / {stats.redteam.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-midnight-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-warning-600 rounded-sm transition-all"
                    style={{ width: `${Math.min(redteamPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-midnight-100">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-midnight-200 text-midnight-700 hover:bg-midnight-50 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" />
              Manage Subscription
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded border border-midnight-200 text-midnight-700 hover:bg-midnight-50 transition-colors">
              Update Payment Method
            </button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-sm font-semibold text-midnight-900 mb-3">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'bg-white rounded border overflow-hidden',
                plan.current ? 'border-accent-500 border-2' : 'border-midnight-300/60'
              )}
            >
              {plan.current && (
                <div className="bg-accent-600 text-white text-[10px] font-bold uppercase tracking-wide text-center py-1">
                  Current Plan
                </div>
              )}
              <div className="p-4">
                <div className="text-sm font-semibold text-midnight-900">{plan.name}</div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-midnight-950 tabular-nums">
                    ${(plan.price / 100).toFixed(0)}
                  </span>
                  <span className="text-xs text-midnight-500">/month</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-1.5 text-xs text-midnight-600">
                      <Check className="h-3.5 w-3.5 text-secure-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    'w-full mt-4 px-3 py-1.5 text-xs font-semibold rounded transition-colors',
                    plan.current
                      ? 'bg-midnight-100 text-midnight-500 cursor-not-allowed'
                      : 'bg-midnight-800 text-white hover:bg-midnight-700'
                  )}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
        <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
          <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Invoice History</h2>
        </div>
        <div className="divide-y divide-midnight-100">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-midnight-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-midnight-100 flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-midnight-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-midnight-900">
                    {new Date(invoice.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-midnight-500 tabular-nums">
                    ${(invoice.amount / 100).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-secure-100 text-secure-700 rounded uppercase">
                  {invoice.status}
                </span>
                <button className="flex items-center gap-1 text-xs font-medium text-midnight-600 hover:text-midnight-900 transition-colors">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

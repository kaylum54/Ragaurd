'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface RevenueData {
  mrr: number;
  arr: number;
  planBreakdown: { plan: string; count: number; revenue: number }[];
  recentTransactions: { date: string; amount: number; org: string; type: string }[];
  mrrHistory: { date: string; mrr: number }[];
}

const planColors: Record<string, string> = {
  starter: 'bg-accent-600',
  pro: 'bg-accent-700',
  business: 'bg-secure-600',
  enterprise: 'bg-midnight-700',
};

export default function AdminRevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch('/api/admin/revenue');
        const revenue = await res.json();
        setData(revenue);
      } catch (error) {
        console.error('Failed to fetch revenue:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-midnight-500 py-12">
        Failed to load revenue data
      </div>
    );
  }

  // Calculate MRR growth
  const lastMonth = data.mrrHistory[data.mrrHistory.length - 2]?.mrr || 0;
  const currentMrr = data.mrrHistory[data.mrrHistory.length - 1]?.mrr || 0;
  const growth = lastMonth > 0 ? ((currentMrr - lastMonth) / lastMonth) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="dash-page-title">Revenue</h1>
        <p className="dash-page-subtitle">MRR, ARR, and subscription metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">MRR</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">{formatCurrency(data.mrr)}</div>
              <p className={`text-xs flex items-center gap-1 mt-1.5 ${growth >= 0 ? 'text-secure-700' : 'text-critical-700'}`}>
                {growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(growth).toFixed(1)}% vs last month
              </p>
            </div>
            <div className="w-9 h-9 bg-secure-50 rounded flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-secure-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">ARR</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">{formatCurrency(data.arr)}</div>
              <p className="text-xs text-midnight-500 mt-1.5">Annual recurring revenue</p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Subscriptions</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {data.planBreakdown.reduce((acc, p) => acc + p.count, 0)}
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">Active paid</p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">ARPU</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {formatCurrency(
                  data.planBreakdown.reduce((acc, p) => acc + p.count, 0) > 0
                    ? data.mrr / data.planBreakdown.reduce((acc, p) => acc + p.count, 0)
                    : 0
                )}
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">Per customer</p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <PieChart className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* MRR Chart */}
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="mb-5">
            <h2 className="text-base font-medium text-midnight-950">MRR Over Time</h2>
            <p className="text-xs text-midnight-500 mt-0.5">Last 12 months</p>
          </div>
          <div className="h-44 flex items-end justify-between gap-1">
            {data.mrrHistory.map((item, index) => {
              const maxMrr = Math.max(...data.mrrHistory.map(h => h.mrr));
              const height = maxMrr > 0 ? (item.mrr / maxMrr) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-secure-600 rounded-t transition-colors hover:bg-secure-500"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${formatCurrency(item.mrr)}`}
                  />
                  <span className="text-[10px] text-midnight-500 tabular-nums">
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Breakdown */}
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="mb-5">
            <h2 className="text-base font-medium text-midnight-950">Revenue by Plan</h2>
            <p className="text-xs text-midnight-500 mt-0.5">Current distribution</p>
          </div>
          <div className="space-y-4">
            {data.planBreakdown.length > 0 ? (
              data.planBreakdown.map((plan) => {
                const percentage = data.mrr > 0 ? (plan.revenue / data.mrr) * 100 : 0;
                return (
                  <div key={plan.plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded text-white capitalize ${planColors[plan.plan] || 'bg-midnight-600'}`}>
                          {plan.plan}
                        </span>
                        <span className="text-xs text-midnight-500">{plan.count} customers</span>
                      </div>
                      <span className="text-sm font-medium text-midnight-900 tabular-nums">
                        {formatCurrency(plan.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-midnight-100 rounded-sm overflow-hidden">
                      <div
                        className={`h-full ${planColors[plan.plan] || 'bg-midnight-600'} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-midnight-500 text-center py-8 text-sm">No paid subscriptions</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded border border-midnight-200 overflow-hidden">
        <div className="p-5 border-b border-midnight-100">
          <h2 className="text-base font-medium text-midnight-950">Recent Transactions</h2>
          <p className="text-xs text-midnight-500 mt-0.5">Latest subscription activity</p>
        </div>
        {data.recentTransactions.length > 0 ? (
          <div className="divide-y divide-midnight-100">
            {data.recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-midnight-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secure-50 rounded flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-secure-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-midnight-900">{tx.org}</p>
                    <p className="text-xs text-midnight-500 capitalize">{tx.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secure-700 tabular-nums">+{formatCurrency(tx.amount)}</p>
                  <p className="text-xs text-midnight-500">{formatDate(tx.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-midnight-500 text-sm">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}

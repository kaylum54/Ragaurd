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
import { Badge } from '@/components/ui/badge';

interface RevenueData {
  mrr: number;
  arr: number;
  planBreakdown: { plan: string; count: number; revenue: number }[];
  recentTransactions: { date: string; amount: number; org: string; type: string }[];
  mrrHistory: { date: string; mrr: number }[];
}

const planColors: Record<string, string> = {
  starter: 'bg-violet-600',
  pro: 'bg-sky-600',
  business: 'bg-emerald-600',
  enterprise: 'bg-amber-600',
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
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-slate-500 py-12">
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
        <p className="text-sm text-slate-500 mt-1">Track MRR, ARR, and subscription metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">MRR</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatCurrency(data.mrr)}</div>
          <p className={`text-xs flex items-center gap-1 mt-2 ${growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {growth >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(growth).toFixed(1)}% from last month
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">ARR</span>
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{formatCurrency(data.arr)}</div>
          <p className="text-xs text-slate-500 mt-2">Annual recurring revenue</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Subscriptions</span>
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-sky-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {data.planBreakdown.reduce((acc, p) => acc + p.count, 0)}
          </div>
          <p className="text-xs text-slate-500 mt-2">Active paid subscriptions</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Avg Revenue</span>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <PieChart className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {formatCurrency(
              data.planBreakdown.reduce((acc, p) => acc + p.count, 0) > 0
                ? data.mrr / data.planBreakdown.reduce((acc, p) => acc + p.count, 0)
                : 0
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">Per customer (ARPU)</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* MRR Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">MRR Over Time</h2>
            <p className="text-sm text-slate-500">Last 12 months</p>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {data.mrrHistory.map((item, index) => {
              const maxMrr = Math.max(...data.mrrHistory.map(h => h.mrr));
              const height = maxMrr > 0 ? (item.mrr / maxMrr) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all hover:from-emerald-500 hover:to-emerald-300"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${formatCurrency(item.mrr)}`}
                  />
                  <span className="text-[10px] text-slate-500">
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Revenue by Plan</h2>
            <p className="text-sm text-slate-500">Current distribution</p>
          </div>
          <div className="space-y-4">
            {data.planBreakdown.length > 0 ? (
              data.planBreakdown.map((plan) => {
                const percentage = data.mrr > 0 ? (plan.revenue / data.mrr) * 100 : 0;
                return (
                  <div key={plan.plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${planColors[plan.plan] || 'bg-slate-600'} text-white capitalize`}>
                          {plan.plan}
                        </Badge>
                        <span className="text-sm text-slate-500">{plan.count} customers</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(plan.revenue)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${planColors[plan.plan] || 'bg-slate-600'} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-500 text-center py-8">No paid subscriptions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Recent Transactions</h2>
          <p className="text-sm text-slate-500">Latest subscription activity</p>
        </div>
        {data.recentTransactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.recentTransactions.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{tx.org}</p>
                    <p className="text-xs text-slate-500 capitalize">{tx.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600">+{formatCurrency(tx.amount)}</p>
                  <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}

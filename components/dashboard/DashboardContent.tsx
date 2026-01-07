'use client';

import { Shield, Zap, AlertTriangle, Activity, Key, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboard';
import Link from 'next/link';

export function DashboardContent() {
  const { data, loading } = useDashboardStats();

  const textUsagePercent = data.usage.text.percentage;
  const audioUsagePercent = data.usage.audio.percentage;

  // Get current billing period dates
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-midnight-950">Dashboard</h1>
          <p className="text-xs text-midnight-500 mt-0.5">
            Voice AI security monitoring
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-secure-600 rounded text-[10px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          OPERATIONAL
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          subtitle="30d"
          value={loading ? '—' : data.stats.totalRequests.toLocaleString()}
          icon={Activity}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Threats Blocked"
          value={loading ? '—' : data.stats.blockedThreats.toLocaleString()}
          icon={AlertTriangle}
          trend={{ value: -8, isPositive: true }}
        />
        <StatsCard
          title="Block Rate"
          value={loading ? '—' : `${data.stats.blockRate}%`}
          icon={Shield}
        />
        <StatsCard
          title="Avg Latency"
          value={loading ? '—' : `${data.stats.avgLatencyMs}ms`}
          icon={Zap}
          trend={{ value: -5, isPositive: true }}
        />
      </div>

      {/* Usage Progress */}
      <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60 flex items-center justify-between">
          <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Usage This Month</h2>
          <span className="text-[10px] text-midnight-400">
            {formatDate(startOfMonth)} - {formatDate(endOfMonth)}
          </span>
        </div>
        {/* Body */}
        <div className="p-3 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-midnight-700">Text Requests</span>
              <span className="text-xs text-midnight-500 tabular-nums font-medium">
                {data.usage.text.used.toLocaleString()} / {data.usage.text.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-2 bg-midnight-100 rounded-sm overflow-hidden">
              <div
                className="h-full bg-midnight-700 rounded-sm transition-all duration-300"
                style={{ width: `${Math.min(textUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-midnight-700">Audio Requests</span>
                <span className="text-[9px] font-bold px-1 py-0 bg-accent-600 text-white rounded">PRO</span>
              </div>
              <span className="text-xs text-midnight-500 tabular-nums font-medium">
                {data.usage.audio.used.toLocaleString()} / {data.usage.audio.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-2 bg-midnight-100 rounded-sm overflow-hidden">
              <div
                className="h-full bg-accent-600 rounded-sm transition-all duration-300"
                style={{ width: `${Math.min(audioUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-midnight-100/60">
            <div className="flex items-center gap-3 text-[11px] text-midnight-500">
              <span className="flex items-center gap-1">
                <Key className="h-3 w-3" />
                {data.stats.activeApiKeys} API keys
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {data.stats.teamMembers} team members
              </span>
            </div>
            <Link
              href="/dashboard/usage"
              className="text-[11px] font-semibold text-accent-600 hover:text-accent-700"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-3 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRequests />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}

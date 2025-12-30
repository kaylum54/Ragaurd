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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-midnight-950">Dashboard</h1>
          <p className="text-sm text-midnight-500 mt-0.5">
            Voice AI security monitoring
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-secure-50 border border-secure-200 rounded text-xs font-medium text-secure-700">
          <span className="h-1.5 w-1.5 rounded-full bg-secure-500" />
          All systems operational
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          subtitle="30 days"
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
      <div className="bg-white rounded border border-midnight-200 p-5">
        <div className="mb-5">
          <h2 className="text-base font-medium text-midnight-950">Usage This Month</h2>
          <p className="text-xs text-midnight-500 mt-0.5">
            {formatDate(startOfMonth)} - {formatDate(endOfMonth)}
          </p>
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-midnight-700">Text Requests</span>
              <span className="text-sm text-midnight-500 tabular-nums">
                {data.usage.text.used.toLocaleString()} / {data.usage.text.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-1.5 bg-midnight-100 rounded-sm overflow-hidden">
              <div
                className="h-full bg-midnight-600 rounded-sm transition-all duration-300"
                style={{ width: `${Math.min(textUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-midnight-700">Audio Requests</span>
                <span className="text-xs font-medium px-1.5 py-0.5 bg-accent-50 text-accent-700 border border-accent-200 rounded">Pro</span>
              </div>
              <span className="text-sm text-midnight-500 tabular-nums">
                {data.usage.audio.used.toLocaleString()} / {data.usage.audio.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-1.5 bg-midnight-100 rounded-sm overflow-hidden">
              <div
                className="h-full bg-accent-600 rounded-sm transition-all duration-300"
                style={{ width: `${Math.min(audioUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-midnight-100">
            <div className="flex items-center gap-4 text-xs text-midnight-500">
              <span className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                {data.stats.activeApiKeys} API keys
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {data.stats.teamMembers} team members
              </span>
            </div>
            <Link
              href="/dashboard/usage"
              className="text-sm font-medium text-accent-600 hover:text-accent-700"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRequests />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}

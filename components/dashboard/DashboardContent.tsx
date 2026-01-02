'use client';

import { Shield, Zap, AlertTriangle, Activity, Key, Users } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useDashboardStats } from '@/hooks/useDashboard';
import Link from 'next/link';
import Image from 'next/image';

export function DashboardContent() {
  const { data, loading } = useDashboardStats();

  const textUsagePercent = data.usage.text.percentage;
  const audioUsagePercent = data.usage.audio.percentage;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-5">
      {/* Page Header with Logo */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-navy-200 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src="/images/ragaurd-logo.png"
            alt="Ragaurd"
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <div className="h-8 w-px bg-navy-200" />
          <div>
            <h1 className="text-lg font-bold text-navy-950">Security Dashboard</h1>
            <p className="text-xs text-navy-500">
              Voice AI threat monitoring and defense analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="bg-white rounded-lg border border-navy-200 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-navy-50 border-b border-navy-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-navy-800">Monthly Usage</h2>
          <span className="text-xs text-navy-500">
            {formatDate(startOfMonth)} - {formatDate(endOfMonth)}
          </span>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-navy-700">Text Requests</span>
              <span className="text-sm text-navy-600 tabular-nums font-medium">
                {data.usage.text.used.toLocaleString()} / {data.usage.text.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-2.5 bg-navy-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-navy-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(textUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-navy-700">Audio Requests</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-navy-600 text-white rounded">PRO</span>
              </div>
              <span className="text-sm text-navy-600 tabular-nums font-medium">
                {data.usage.audio.used.toLocaleString()} / {data.usage.audio.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-2.5 bg-navy-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(audioUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-navy-100">
            <div className="flex items-center gap-4 text-xs text-navy-500">
              <span className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                {data.stats.activeApiKeys} API keys active
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {data.stats.teamMembers} team members
              </span>
            </div>
            <Link
              href="/dashboard/usage"
              className="text-xs font-semibold text-navy-600 hover:text-navy-800 transition-colors"
            >
              View Details →
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

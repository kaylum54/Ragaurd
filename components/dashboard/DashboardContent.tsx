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
          <h1 className="text-2xl font-bold text-steel-100">Dashboard</h1>
          <p className="text-steel-500">
            Monitor your Voice AI security in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            All systems operational
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests (30d)"
          value={loading ? '—' : data.stats.totalRequests.toLocaleString()}
          icon={Activity}
          trend={{ value: 12.5, isPositive: true }}
          description="vs last month"
        />
        <StatsCard
          title="Threats Blocked"
          value={loading ? '—' : data.stats.blockedThreats.toLocaleString()}
          icon={AlertTriangle}
          trend={{ value: -8, isPositive: true }}
          description="this period"
        />
        <StatsCard
          title="Block Rate"
          value={loading ? '—' : `${data.stats.blockRate}%`}
          icon={Shield}
          description="of malicious inputs"
        />
        <StatsCard
          title="Avg Latency"
          value={loading ? '—' : `${data.stats.avgLatencyMs}ms`}
          icon={Zap}
          trend={{ value: -5, isPositive: true }}
          description="within SLA"
        />
      </div>

      {/* Usage Progress */}
      <div className="dashboard-card">
        <div className="mb-6">
          <h2 className="section-header mb-1">Usage This Month</h2>
          <p className="text-sm text-steel-500">
            Current billing period: {formatDate(startOfMonth)} - {formatDate(endOfMonth)}
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-steel-100">Text Requests</span>
              <span className="text-sm text-steel-400 tabular-nums">
                {data.usage.text.used.toLocaleString()} / {data.usage.text.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <Progress value={textUsagePercent} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-steel-100">Audio Requests</span>
                <Badge variant="info" className="text-[10px]">Pro+</Badge>
              </div>
              <span className="text-sm text-steel-400 tabular-nums">
                {data.usage.audio.used.toLocaleString()} / {data.usage.audio.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <Progress value={audioUsagePercent} />
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center gap-4 text-sm text-steel-500">
              <span className="flex items-center gap-1.5">
                <Key className="h-4 w-4" />
                {data.stats.activeApiKeys} API keys
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {data.stats.teamMembers} team members
              </span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/usage">View Details</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRequests />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}

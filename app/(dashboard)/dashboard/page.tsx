import { Metadata } from 'next';
import { Shield, Zap, AlertTriangle, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Monitor your Voice AI security in real-time',
};

// Mock data - in production, this would come from your API
const stats = {
  totalRequests: 12547,
  blockedToday: 234,
  blockRate: 99.53,
  avgLatency: 156,
  usage: {
    text: { used: 8234, limit: 25000 },
    audio: { used: 1245, limit: 50000 },
  },
};

export default function DashboardPage() {
  const textUsagePercent = (stats.usage.text.used / stats.usage.text.limit) * 100;
  const audioUsagePercent = (stats.usage.audio.used / stats.usage.audio.limit) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your Voice AI security in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            All systems operational
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests (30d)"
          value={stats.totalRequests.toLocaleString()}
          icon={Activity}
          trend={{ value: 12.5, isPositive: true }}
          description="vs last month"
        />
        <StatsCard
          title="Blocked Today"
          value={stats.blockedToday}
          icon={AlertTriangle}
          trend={{ value: -8, isPositive: true }}
          description="threats detected"
        />
        <StatsCard
          title="Block Rate"
          value={`${stats.blockRate}%`}
          icon={Shield}
          description="industry-leading"
        />
        <StatsCard
          title="Avg Latency"
          value={`${stats.avgLatency}ms`}
          icon={Zap}
          trend={{ value: -5, isPositive: true }}
          description="within SLA"
        />
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
          <CardDescription>
            Current billing period: Dec 1 - Dec 31, 2024
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Text Requests</span>
              <span className="text-sm text-muted-foreground">
                {stats.usage.text.used.toLocaleString()} / {stats.usage.text.limit.toLocaleString()}
              </span>
            </div>
            <Progress value={textUsagePercent} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Audio Requests</span>
                <Badge variant="outline" className="text-xs">Pro+</Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.usage.audio.used.toLocaleString()} / {stats.usage.audio.limit.toLocaleString()}
              </span>
            </div>
            <Progress value={audioUsagePercent} className="h-2" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/usage">View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRequests />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}

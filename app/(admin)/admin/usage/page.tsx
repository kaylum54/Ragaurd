'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Clock,
  Zap,
  Loader2,
  TrendingUp,
  BarChart3,
  Building,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PlatformUsage {
  totalRequests: number;
  textRequests: number;
  audioRequests: number;
  redteamAttacks: number;
  blockedCount: number;
  avgLatency: number;
  dailyUsage: { date: string; text: number; audio: number; blocked: number }[];
  topOrgs: { name: string; requests: number }[];
}

interface GrowthData {
  usersByDay: { date: string; count: number }[];
  orgsByDay: { date: string; count: number }[];
  totalUsers: number;
  totalOrgs: number;
}

export default function AdminUsagePage() {
  const [usage, setUsage] = useState<PlatformUsage | null>(null);
  const [growth, setGrowth] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usageRes, growthRes] = await Promise.all([
          fetch(`/api/admin/usage?days=${days}`),
          fetch(`/api/admin/usage?type=growth&days=${days}`),
        ]);

        const usageData = await usageRes.json();
        const growthData = await growthRes.json();

        setUsage(usageData);
        setGrowth(growthData);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-electric-500" />
      </div>
    );
  }

  if (!usage || !growth) {
    return (
      <div className="text-center text-steel-500 py-12">
        Failed to load usage data
      </div>
    );
  }

  const blockRate = usage.totalRequests > 0
    ? ((usage.blockedCount / usage.totalRequests) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-steel-100">Platform Usage</h1>
          <p className="text-sm text-steel-500 mt-1">
            Monitor requests, threats, and growth metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <Button
              key={d}
              variant={days === d ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDays(d)}
              className={
                days === d
                  ? 'bg-electric-600 text-white'
                  : 'border-[rgba(59,130,246,0.2)] text-steel-300 hover:bg-[rgba(59,130,246,0.1)]'
              }
            >
              {d}d
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Total Requests</span>
            <div className="w-10 h-10 bg-[rgba(59,130,246,0.1)] rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-electric-500" />
            </div>
          </div>
          <div className="metric-display">{usage.totalRequests.toLocaleString()}</div>
          <p className="text-xs text-steel-500 mt-2">
            Text: {usage.textRequests.toLocaleString()} | Audio: {usage.audioRequests.toLocaleString()}
          </p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Threats Blocked</span>
            <div className="w-10 h-10 bg-[rgba(239,68,68,0.1)] rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-danger" />
            </div>
          </div>
          <div className="metric-display">{usage.blockedCount.toLocaleString()}</div>
          <p className="text-xs text-steel-500 mt-2">{blockRate}% block rate</p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Avg Latency</span>
            <div className="w-10 h-10 bg-[rgba(16,185,129,0.1)] rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="metric-display">{usage.avgLatency}ms</div>
          <p className="text-xs text-steel-500 mt-2">Defense processing time</p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Red Team</span>
            <div className="w-10 h-10 bg-[rgba(245,158,11,0.1)] rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="metric-display">{usage.redteamAttacks.toLocaleString()}</div>
          <p className="text-xs text-steel-500 mt-2">Simulated attacks run</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Daily Usage Chart */}
        <div className="dashboard-card">
          <div className="mb-6">
            <h2 className="section-header mb-1">Daily Requests</h2>
            <p className="text-sm text-steel-500">Request volume over time</p>
          </div>
          <div className="h-48 flex items-end justify-between gap-0.5">
            {usage.dailyUsage.slice(-30).map((item, index) => {
              const total = item.text + item.audio;
              const maxTotal = Math.max(...usage.dailyUsage.map(d => d.text + d.audio));
              const height = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
              const blockedHeight = maxTotal > 0 ? (item.blocked / maxTotal) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col-reverse" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-gradient-to-t from-electric-600 to-electric-400 rounded-t"
                      style={{ height: `${Math.max(height, 1)}%` }}
                      title={`Total: ${total} | Blocked: ${item.blocked}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-steel-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-electric-500 rounded" />
              Requests
            </span>
          </div>
        </div>

        {/* User Growth */}
        <div className="dashboard-card">
          <div className="mb-6">
            <h2 className="section-header mb-1">User Growth</h2>
            <p className="text-sm text-steel-500">New signups over time</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[rgba(59,130,246,0.05)] rounded-lg">
              <div className="text-2xl font-bold text-steel-100">{growth.totalUsers}</div>
              <div className="text-sm text-steel-500">Total Users</div>
            </div>
            <div className="p-4 bg-[rgba(139,92,246,0.05)] rounded-lg">
              <div className="text-2xl font-bold text-steel-100">{growth.totalOrgs}</div>
              <div className="text-sm text-steel-500">Total Orgs</div>
            </div>
          </div>
          <div className="h-32 flex items-end justify-between gap-0.5">
            {growth.usersByDay.slice(-30).map((item, index) => {
              const maxCount = Math.max(...growth.usersByDay.map(d => d.count), 1);
              const height = (item.count / maxCount) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all"
                    style={{ height: `${Math.max(height, item.count > 0 ? 10 : 2)}%` }}
                    title={`${item.count} new users`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Organizations */}
      <div className="dashboard-card p-0 overflow-hidden">
        <div className="p-6 border-b border-[rgba(59,130,246,0.1)]">
          <h2 className="section-header mb-1">Top Organizations by Usage</h2>
          <p className="text-sm text-steel-500">Most active organizations</p>
        </div>
        {usage.topOrgs.length > 0 ? (
          <div className="divide-y divide-[rgba(59,130,246,0.1)]">
            {usage.topOrgs.map((org, index) => {
              const maxRequests = usage.topOrgs[0]?.requests || 1;
              const percentage = (org.requests / maxRequests) * 100;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 hover:bg-[rgba(59,130,246,0.02)] transition-colors"
                >
                  <div className="w-8 h-8 bg-[rgba(59,130,246,0.1)] rounded-lg flex items-center justify-center text-sm font-medium text-electric-400">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-steel-100">{org.name}</span>
                      <span className="text-sm text-steel-400">{org.requests.toLocaleString()} requests</span>
                    </div>
                    <div className="h-1.5 bg-steel-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-electric-600 to-electric-400 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-steel-500">
            <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
            No usage data yet
          </div>
        )}
      </div>
    </div>
  );
}

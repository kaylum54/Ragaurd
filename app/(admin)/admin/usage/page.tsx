'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Clock,
  Zap,
  Loader2,
  Building,
} from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
      </div>
    );
  }

  if (!usage || !growth) {
    return (
      <div className="text-center text-midnight-500 py-12">
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
          <h1 className="text-xl font-semibold text-midnight-950">Platform Usage</h1>
          <p className="text-sm text-midnight-500 mt-0.5">
            Requests, threats, and growth metrics
          </p>
        </div>
        <div className="flex border border-midnight-200 rounded overflow-hidden">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                days === d
                  ? 'bg-midnight-800 text-white'
                  : 'bg-white text-midnight-600 hover:bg-midnight-50'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Total Requests</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">{usage.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-midnight-500 mt-1.5">
                Text: {usage.textRequests.toLocaleString()} | Audio: {usage.audioRequests.toLocaleString()}
              </p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Activity className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Threats Blocked</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">{usage.blockedCount.toLocaleString()}</div>
              <p className="text-xs text-midnight-500 mt-1.5">{blockRate}% block rate</p>
            </div>
            <div className="w-9 h-9 bg-critical-50 rounded flex items-center justify-center">
              <Shield className="h-4 w-4 text-critical-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Avg Latency</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">{usage.avgLatency}ms</div>
              <p className="text-xs text-midnight-500 mt-1.5">Defense processing</p>
            </div>
            <div className="w-9 h-9 bg-secure-50 rounded flex items-center justify-center">
              <Clock className="h-4 w-4 text-secure-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Red Team</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">{usage.redteamAttacks.toLocaleString()}</div>
              <p className="text-xs text-midnight-500 mt-1.5">Simulated attacks</p>
            </div>
            <div className="w-9 h-9 bg-warning-50 rounded flex items-center justify-center">
              <Zap className="h-4 w-4 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Daily Usage Chart */}
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="mb-5">
            <h2 className="text-base font-medium text-midnight-950">Daily Requests</h2>
            <p className="text-xs text-midnight-500 mt-0.5">Request volume over time</p>
          </div>
          <div className="h-44 flex items-end justify-between gap-0.5">
            {usage.dailyUsage.slice(-30).map((item, index) => {
              const total = item.text + item.audio;
              const maxTotal = Math.max(...usage.dailyUsage.map(d => d.text + d.audio));
              const height = maxTotal > 0 ? (total / maxTotal) * 100 : 0;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col-reverse" style={{ height: '100%' }}>
                    <div
                      className="w-full bg-midnight-600 rounded-t hover:bg-midnight-500 transition-colors"
                      style={{ height: `${Math.max(height, 1)}%` }}
                      title={`Total: ${total} | Blocked: ${item.blocked}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-midnight-500">
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-midnight-600 rounded-sm" />
              Requests
            </span>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="mb-5">
            <h2 className="text-base font-medium text-midnight-950">User Growth</h2>
            <p className="text-xs text-midnight-500 mt-0.5">New signups over time</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 bg-midnight-50 border border-midnight-200 rounded">
              <div className="text-xl font-semibold text-midnight-950 tabular-nums">{growth.totalUsers}</div>
              <div className="text-xs text-midnight-500">Total Users</div>
            </div>
            <div className="p-3 bg-midnight-50 border border-midnight-200 rounded">
              <div className="text-xl font-semibold text-midnight-950 tabular-nums">{growth.totalOrgs}</div>
              <div className="text-xs text-midnight-500">Total Orgs</div>
            </div>
          </div>
          <div className="h-28 flex items-end justify-between gap-0.5">
            {growth.usersByDay.slice(-30).map((item, index) => {
              const maxCount = Math.max(...growth.usersByDay.map(d => d.count), 1);
              const height = (item.count / maxCount) * 100;

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-accent-600 rounded-t hover:bg-accent-500 transition-colors"
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
      <div className="bg-white rounded border border-midnight-200 overflow-hidden">
        <div className="p-5 border-b border-midnight-100">
          <h2 className="text-base font-medium text-midnight-950">Top Organizations</h2>
          <p className="text-xs text-midnight-500 mt-0.5">Most active by usage</p>
        </div>
        {usage.topOrgs.length > 0 ? (
          <div className="divide-y divide-midnight-100">
            {usage.topOrgs.map((org, index) => {
              const maxRequests = usage.topOrgs[0]?.requests || 1;
              const percentage = (org.requests / maxRequests) * 100;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 hover:bg-midnight-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-midnight-100 rounded flex items-center justify-center text-xs font-medium text-midnight-700">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-midnight-900">{org.name}</span>
                      <span className="text-xs text-midnight-500 tabular-nums">{org.requests.toLocaleString()} requests</span>
                    </div>
                    <div className="h-1.5 bg-midnight-100 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-midnight-600 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-midnight-500">
            <Building className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No usage data yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

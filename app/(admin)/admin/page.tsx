'use client';

import { useState, useEffect } from 'react';
import { Users, Building, DollarSign, Activity, TrendingUp, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalOrgs: number;
  activeSubscriptions: number;
  mrr: number;
  totalRequests: number;
  blockedThreats: number;
  newUsersToday: number;
  newOrgsToday: number;
}

const systemStatus = [
  { name: 'Orchestrator (18.220.113.81)', status: 'healthy', latency: '12ms' },
  { name: 'Text Defense (3.18.141.124)', status: 'healthy', latency: '8ms' },
  { name: 'Testing Stack (18.188.163.13)', status: 'healthy', latency: '15ms' },
  { name: 'Audio Defense', status: 'pending', latency: '-' },
];

export default function AdminPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setStats({
          totalUsers: 0,
          totalOrgs: 0,
          activeSubscriptions: 0,
          mrr: 0,
          totalRequests: 0,
          blockedThreats: 0,
          newUsersToday: 0,
          newOrgsToday: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
      </div>
    );
  }

  const recentActivity = [
    { type: 'signup', message: `${stats?.newUsersToday || 0} new users today`, time: 'Today' },
    { type: 'signup', message: `${stats?.newOrgsToday || 0} new organizations today`, time: 'Today' },
    { type: 'alert', message: `${(stats?.blockedThreats || 0).toLocaleString()} threats blocked`, time: 'All time' },
    { type: 'upgrade', message: `${stats?.activeSubscriptions || 0} active subscriptions`, time: 'Current' },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-midnight-950">Overview</h1>
        <p className="text-sm text-midnight-500 mt-0.5">Platform metrics and system health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Users</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {(stats?.totalUsers || 0).toLocaleString()}
              </div>
              <p className="text-xs text-secure-700 flex items-center gap-1 mt-1.5">
                <TrendingUp className="h-3 w-3" />
                +{stats?.newUsersToday || 0} today
              </p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Users className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Organizations</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {(stats?.totalOrgs || 0).toLocaleString()}
              </div>
              <p className="text-xs text-secure-700 flex items-center gap-1 mt-1.5">
                <TrendingUp className="h-3 w-3" />
                +{stats?.newOrgsToday || 0} today
              </p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Building className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">MRR</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                ${((stats?.mrr || 0) / 100).toLocaleString()}
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">
                {stats?.activeSubscriptions || 0} subscriptions
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
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Requests</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {formatNumber(stats?.totalRequests || 0)}
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">
                {(stats?.blockedThreats || 0).toLocaleString()} blocked
              </p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Activity className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* System Status */}
        <div className="bg-white rounded border border-midnight-200 overflow-hidden">
          <div className="p-5 border-b border-midnight-100">
            <h2 className="text-base font-medium text-midnight-950">System Status</h2>
            <p className="text-xs text-midnight-500 mt-0.5">AWS instance health</p>
          </div>
          <div className="divide-y divide-midnight-100">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-4 hover:bg-midnight-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      system.status === 'healthy' ? 'bg-secure-500' :
                      system.status === 'pending' ? 'bg-warning-500' : 'bg-critical-500'
                    }`}
                  />
                  <span className="text-sm text-midnight-900">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-midnight-500 font-mono tabular-nums">{system.latency}</span>
                  <span className={`text-xs uppercase tracking-wide font-medium ${
                    system.status === 'healthy' ? 'text-secure-700' : 'text-warning-700'
                  }`}>
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Summary */}
        <div className="bg-white rounded border border-midnight-200 overflow-hidden">
          <div className="p-5 border-b border-midnight-100">
            <h2 className="text-base font-medium text-midnight-950">Platform Summary</h2>
            <p className="text-xs text-midnight-500 mt-0.5">Key platform metrics</p>
          </div>
          <div className="divide-y divide-midnight-100">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-4 hover:bg-midnight-50 transition-colors">
                <div
                  className={`w-8 h-8 flex items-center justify-center shrink-0 rounded ${
                    activity.type === 'signup' ? 'bg-midnight-100' :
                    activity.type === 'upgrade' ? 'bg-secure-50' :
                    activity.type === 'downgrade' ? 'bg-warning-50' :
                    'bg-critical-50'
                  }`}
                >
                  {activity.type === 'alert' ? (
                    <AlertTriangle className="h-4 w-4 text-critical-600" />
                  ) : activity.type === 'upgrade' ? (
                    <CheckCircle className="h-4 w-4 text-secure-600" />
                  ) : (
                    <Users className={`h-4 w-4 ${
                      activity.type === 'signup' ? 'text-midnight-600' : 'text-warning-600'
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-midnight-900">{activity.message}</p>
                  <p className="text-xs text-midnight-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

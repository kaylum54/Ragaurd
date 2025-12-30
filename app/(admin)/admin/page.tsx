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
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Platform metrics and system health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Users</span>
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {(stats?.totalUsers || 0).toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +{stats?.newUsersToday || 0} today
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Organizations</span>
            <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-sky-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {(stats?.totalOrgs || 0).toLocaleString()}
          </div>
          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +{stats?.newOrgsToday || 0} today
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">MRR</span>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            ${((stats?.mrr || 0) / 100).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats?.activeSubscriptions || 0} active subscriptions
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-500">Requests</span>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {formatNumber(stats?.totalRequests || 0)}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {(stats?.blockedThreats || 0).toLocaleString()} threats blocked
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* System Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">System Status</h2>
            <p className="text-sm text-slate-500">AWS instance health</p>
          </div>
          <div className="divide-y divide-slate-100">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      system.status === 'healthy' ? 'bg-emerald-500 animate-pulse' :
                      system.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-sm text-slate-900">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-mono tabular-nums">{system.latency}</span>
                  <span className={`text-xs uppercase tracking-wider font-medium ${
                    system.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Platform Summary</h2>
            <p className="text-sm text-slate-500">Key platform metrics</p>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors">
                <div
                  className={`w-10 h-10 flex items-center justify-center shrink-0 rounded-lg ${
                    activity.type === 'signup' ? 'bg-violet-100' :
                    activity.type === 'upgrade' ? 'bg-emerald-100' :
                    activity.type === 'downgrade' ? 'bg-amber-100' :
                    'bg-rose-100'
                  }`}
                >
                  {activity.type === 'alert' ? (
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                  ) : activity.type === 'upgrade' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Users className={`h-4 w-4 ${
                      activity.type === 'signup' ? 'text-violet-600' : 'text-amber-600'
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
        // Use fallback data if API fails
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
        <Loader2 className="h-8 w-8 animate-spin text-electric-500" />
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
        <h1 className="text-2xl font-semibold text-steel-100">Overview</h1>
        <p className="text-sm text-steel-500 mt-1">Platform metrics and system health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Users</span>
            <div className="w-10 h-10 bg-[rgba(59,130,246,0.1)] rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-electric-500" />
            </div>
          </div>
          <div className="metric-display">
            {(stats?.totalUsers || 0).toLocaleString()}
          </div>
          <p className="text-xs text-success flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +{stats?.newUsersToday || 0} today
          </p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Organizations</span>
            <div className="w-10 h-10 bg-[rgba(139,92,246,0.1)] rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="metric-display">
            {(stats?.totalOrgs || 0).toLocaleString()}
          </div>
          <p className="text-xs text-success flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +{stats?.newOrgsToday || 0} today
          </p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">MRR</span>
            <div className="w-10 h-10 bg-[rgba(16,185,129,0.1)] rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="metric-display">
            ${((stats?.mrr || 0) / 100).toLocaleString()}
          </div>
          <p className="text-xs text-steel-500 mt-2">
            {stats?.activeSubscriptions || 0} active subscriptions
          </p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Requests</span>
            <div className="w-10 h-10 bg-[rgba(6,182,212,0.1)] rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div className="metric-display">
            {formatNumber(stats?.totalRequests || 0)}
          </div>
          <p className="text-xs text-steel-500 mt-2">
            {(stats?.blockedThreats || 0).toLocaleString()} threats blocked
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* System Status */}
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="p-6 border-b border-[rgba(59,130,246,0.1)]">
            <h2 className="section-header mb-1">System Status</h2>
            <p className="text-sm text-steel-500">AWS instance health</p>
          </div>
          <div className="divide-y divide-[rgba(59,130,246,0.1)]">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-4 hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      system.status === 'healthy' ? 'bg-success animate-pulse' :
                      system.status === 'pending' ? 'bg-warning' : 'bg-danger'
                    }`}
                  />
                  <span className="text-sm text-steel-100">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-steel-500 font-mono tabular-nums">{system.latency}</span>
                  <span className={`text-xs uppercase tracking-wider font-medium ${
                    system.status === 'healthy' ? 'text-success' : 'text-warning'
                  }`}>
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Summary */}
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="p-6 border-b border-[rgba(59,130,246,0.1)]">
            <h2 className="section-header mb-1">Platform Summary</h2>
            <p className="text-sm text-steel-500">Key platform metrics</p>
          </div>
          <div className="divide-y divide-[rgba(59,130,246,0.1)]">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-[rgba(59,130,246,0.02)] transition-colors">
                <div
                  className={`w-10 h-10 flex items-center justify-center shrink-0 rounded-lg ${
                    activity.type === 'signup' ? 'bg-[rgba(59,130,246,0.1)]' :
                    activity.type === 'upgrade' ? 'bg-[rgba(16,185,129,0.1)]' :
                    activity.type === 'downgrade' ? 'bg-[rgba(245,158,11,0.1)]' :
                    'bg-[rgba(239,68,68,0.1)]'
                  }`}
                >
                  {activity.type === 'alert' ? (
                    <AlertTriangle className="h-4 w-4 text-danger" />
                  ) : activity.type === 'upgrade' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Users className={`h-4 w-4 ${
                      activity.type === 'signup' ? 'text-electric-500' : 'text-warning'
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-steel-100">{activity.message}</p>
                  <p className="text-xs text-steel-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

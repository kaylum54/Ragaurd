import { Metadata } from 'next';
import { Users, Building, DollarSign, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Platform administration and monitoring',
};

// Mock data
const stats = {
  totalUsers: 1247,
  totalOrgs: 456,
  activeSubscriptions: 234,
  mrr: 4567800,
  totalRequests: 12547890,
  blockedThreats: 234567,
};

const recentActivity = [
  { type: 'signup', message: 'New user registered: john@example.com', time: '2 min ago' },
  { type: 'upgrade', message: 'Acme Inc upgraded to Business plan', time: '15 min ago' },
  { type: 'alert', message: 'High threat volume detected from IP 192.168.1.1', time: '32 min ago' },
  { type: 'signup', message: 'New organization created: TechCorp', time: '1 hour ago' },
  { type: 'downgrade', message: 'StartupXYZ downgraded to Starter plan', time: '2 hours ago' },
];

const systemStatus = [
  { name: 'Orchestrator (18.220.113.81)', status: 'healthy', latency: '12ms' },
  { name: 'Text Defense (3.18.141.124)', status: 'healthy', latency: '8ms' },
  { name: 'Testing Stack (18.188.163.13)', status: 'healthy', latency: '15ms' },
  { name: 'Audio Defense', status: 'pending', latency: '-' },
];

export default function AdminPage() {
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
            {stats.totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-success flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +12% from last month
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
            {stats.totalOrgs.toLocaleString()}
          </div>
          <p className="text-xs text-success flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +8% from last month
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
            ${(stats.mrr / 100).toLocaleString()}
          </div>
          <p className="text-xs text-success flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +15% from last month
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
            {(stats.totalRequests / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-steel-500 mt-2">
            {stats.blockedThreats.toLocaleString()} threats blocked
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

        {/* Recent Activity */}
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="p-6 border-b border-[rgba(59,130,246,0.1)]">
            <h2 className="section-header mb-1">Recent Activity</h2>
            <p className="text-sm text-steel-500">Latest platform events</p>
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
                  ) : (
                    <Users className={`h-4 w-4 ${
                      activity.type === 'signup' ? 'text-electric-500' :
                      activity.type === 'upgrade' ? 'text-success' :
                      'text-warning'
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

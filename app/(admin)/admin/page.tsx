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
        <h1 className="text-2xl font-medium text-white">Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">Platform metrics and system health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-px bg-neutral-800 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-black p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">Users</span>
            <Users className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="text-3xl font-medium text-white mono">
            {stats.totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +12% from last month
          </p>
        </div>

        <div className="bg-black p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">Organizations</span>
            <Building className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="text-3xl font-medium text-white mono">
            {stats.totalOrgs.toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +8% from last month
          </p>
        </div>

        <div className="bg-black p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">MRR</span>
            <DollarSign className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="text-3xl font-medium text-white mono">
            ${(stats.mrr / 100).toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +15% from last month
          </p>
        </div>

        <div className="bg-black p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-neutral-500 uppercase tracking-widest">Requests</span>
            <Activity className="h-4 w-4 text-neutral-600" />
          </div>
          <div className="text-3xl font-medium text-white mono">
            {(stats.totalRequests / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {stats.blockedThreats.toLocaleString()} threats blocked
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* System Status */}
        <div className="border border-neutral-800">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-lg font-medium text-white">System Status</h2>
            <p className="text-sm text-neutral-500 mt-1">AWS instance health</p>
          </div>
          <div className="divide-y divide-neutral-800">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 ${
                      system.status === 'healthy' ? 'bg-green-500' :
                      system.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-white">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-neutral-500 mono">{system.latency}</span>
                  <span className={`text-xs uppercase tracking-wider ${
                    system.status === 'healthy' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border border-neutral-800">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-lg font-medium text-white">Recent Activity</h2>
            <p className="text-sm text-neutral-500 mt-1">Latest platform events</p>
          </div>
          <div className="divide-y divide-neutral-800">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <div
                  className={`w-8 h-8 flex items-center justify-center shrink-0 ${
                    activity.type === 'signup' ? 'bg-blue-500/10' :
                    activity.type === 'upgrade' ? 'bg-green-500/10' :
                    activity.type === 'downgrade' ? 'bg-yellow-500/10' :
                    'bg-red-500/10'
                  }`}
                >
                  {activity.type === 'alert' ? (
                    <AlertTriangle className={`h-4 w-4 text-red-400`} />
                  ) : (
                    <Users className={`h-4 w-4 ${
                      activity.type === 'signup' ? 'text-blue-400' :
                      activity.type === 'upgrade' ? 'text-green-400' :
                      'text-yellow-400'
                    }`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-neutral-600 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

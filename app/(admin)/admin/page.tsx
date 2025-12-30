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
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Platform metrics and system health</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Users</span>
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white">
            {stats.totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +12% from last month
          </p>
        </div>

        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Organizations</span>
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Building className="h-4 w-4 text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white">
            {stats.totalOrgs.toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +8% from last month
          </p>
        </div>

        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">MRR</span>
            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white">
            ${(stats.mrr / 100).toLocaleString()}
          </div>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3" />
            +15% from last month
          </p>
        </div>

        <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Requests</span>
            <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
              <Activity className="h-4 w-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-white">
            {(stats.totalRequests / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.blockedThreats.toLocaleString()} threats blocked
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Status */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">System Status</h2>
            <p className="text-sm text-slate-400 mt-1">AWS instance health</p>
          </div>
          <div className="divide-y divide-slate-700/50">
            {systemStatus.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      system.status === 'healthy' ? 'bg-green-500' :
                      system.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-white">{system.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-mono">{system.latency}</span>
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
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <p className="text-sm text-slate-400 mt-1">Latest platform events</p>
          </div>
          <div className="divide-y divide-slate-700/50">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4">
                <div
                  className={`w-8 h-8 flex items-center justify-center shrink-0 rounded-lg ${
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

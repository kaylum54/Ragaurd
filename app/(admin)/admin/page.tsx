import { Metadata } from 'next';
import { Users, Building, DollarSign, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Platform administration and monitoring',
};

// Mock data
const stats = {
  totalUsers: 1247,
  totalOrgs: 456,
  activeSubscriptions: 234,
  mrr: 4567800, // cents
  arr: 54813600, // cents
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-slate-400">
          Platform metrics and system health
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Organizations</CardTitle>
            <Building className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalOrgs.toLocaleString()}
            </div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">MRR</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${(stats.mrr / 100).toLocaleString()}
            </div>
            <p className="text-xs text-success flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {(stats.totalRequests / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-slate-400">
              {stats.blockedThreats.toLocaleString()} threats blocked
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Status */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
            <CardDescription className="text-slate-400">
              AWS instance health and latency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((system) => (
                <div
                  key={system.name}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        system.status === 'healthy' ? 'bg-success animate-pulse' :
                        system.status === 'pending' ? 'bg-warning' : 'bg-danger'
                      }`}
                    />
                    <span className="text-white font-medium">{system.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{system.latency}</span>
                    <Badge
                      variant={system.status === 'healthy' ? 'default' : 'outline'}
                      className={system.status === 'healthy' ? 'bg-success' : 'border-warning text-warning'}
                    >
                      {system.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Latest platform events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === 'signup' ? 'bg-primary-600' :
                      activity.type === 'upgrade' ? 'bg-success' :
                      activity.type === 'downgrade' ? 'bg-warning' :
                      'bg-danger'
                    }`}
                  >
                    {activity.type === 'alert' ? (
                      <AlertTriangle className="h-4 w-4 text-white" />
                    ) : (
                      <Users className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Revenue Overview</CardTitle>
          <CardDescription className="text-slate-400">
            Monthly recurring revenue trend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Revenue chart would appear here</p>
              <p className="text-sm">Connected to Stripe for live data</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

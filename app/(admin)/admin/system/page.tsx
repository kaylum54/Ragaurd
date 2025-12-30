'use client';

import { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Database,
  Globe,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SystemStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'pending';
  latency: string;
  uptime: string;
  lastCheck: string;
  endpoint?: string;
}

// These would come from actual health checks in production
const getSystemStatus = (): SystemStatus[] => [
  {
    name: 'Orchestrator API',
    status: 'healthy',
    latency: '12ms',
    uptime: '99.99%',
    lastCheck: new Date().toISOString(),
    endpoint: '18.220.113.81',
  },
  {
    name: 'Text Defense Engine',
    status: 'healthy',
    latency: '8ms',
    uptime: '99.98%',
    lastCheck: new Date().toISOString(),
    endpoint: '3.18.141.124',
  },
  {
    name: 'Red Team Testing Stack',
    status: 'healthy',
    latency: '15ms',
    uptime: '99.95%',
    lastCheck: new Date().toISOString(),
    endpoint: '18.188.163.13',
  },
  {
    name: 'Audio Defense Engine',
    status: 'pending',
    latency: '-',
    uptime: '-',
    lastCheck: new Date().toISOString(),
    endpoint: 'Not deployed',
  },
  {
    name: 'Supabase Database',
    status: 'healthy',
    latency: '5ms',
    uptime: '99.99%',
    lastCheck: new Date().toISOString(),
    endpoint: 'supabase.co',
  },
  {
    name: 'Auth0 Authentication',
    status: 'pending',
    latency: '-',
    uptime: '-',
    lastCheck: new Date().toISOString(),
    endpoint: 'Not configured',
  },
];

const statusConfig = {
  healthy: {
    color: 'bg-success',
    textColor: 'text-success',
    label: 'Healthy',
    icon: CheckCircle,
  },
  degraded: {
    color: 'bg-warning',
    textColor: 'text-warning',
    label: 'Degraded',
    icon: AlertTriangle,
  },
  down: {
    color: 'bg-danger',
    textColor: 'text-danger',
    label: 'Down',
    icon: AlertTriangle,
  },
  pending: {
    color: 'bg-steel-500',
    textColor: 'text-steel-400',
    label: 'Pending',
    icon: Clock,
  },
};

export default function AdminSystemPage() {
  const [systems, setSystems] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    setSystems(getSystemStatus());
  }, []);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setSystems(getSystemStatus());
      setLastRefresh(new Date());
      setLoading(false);
    }, 1000);
  };

  const healthyCount = systems.filter((s) => s.status === 'healthy').length;
  const totalCount = systems.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-steel-100">System Status</h1>
          <p className="text-sm text-steel-500 mt-1">
            Monitor infrastructure health and performance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading}
          className="border-[rgba(59,130,246,0.2)] text-steel-300 hover:bg-[rgba(59,130,246,0.1)]"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview */}
      <div className="grid gap-5 md:grid-cols-4">
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Overall Status</span>
            <div className={`w-3 h-3 rounded-full ${
              healthyCount === totalCount ? 'bg-success animate-pulse' :
              healthyCount > 0 ? 'bg-warning' : 'bg-danger'
            }`} />
          </div>
          <div className="metric-display">
            {healthyCount}/{totalCount}
          </div>
          <p className="text-xs text-steel-500 mt-2">Services operational</p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Avg Latency</span>
            <Clock className="h-5 w-5 text-electric-500" />
          </div>
          <div className="metric-display">
            {Math.round(
              systems
                .filter((s) => s.latency !== '-')
                .reduce((acc, s) => acc + parseInt(s.latency), 0) /
                systems.filter((s) => s.latency !== '-').length || 0
            )}ms
          </div>
          <p className="text-xs text-steel-500 mt-2">Across all services</p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Uptime</span>
            <Activity className="h-5 w-5 text-success" />
          </div>
          <div className="metric-display">99.9%</div>
          <p className="text-xs text-steel-500 mt-2">Last 30 days</p>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-4">
            <span className="section-header">Last Check</span>
            <RefreshCw className="h-5 w-5 text-steel-500" />
          </div>
          <div className="text-lg font-semibold text-steel-100">
            {lastRefresh.toLocaleTimeString()}
          </div>
          <p className="text-xs text-steel-500 mt-2">
            {lastRefresh.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Service Status */}
      <div className="dashboard-card p-0 overflow-hidden">
        <div className="p-6 border-b border-[rgba(59,130,246,0.1)]">
          <h2 className="section-header mb-1">Service Health</h2>
          <p className="text-sm text-steel-500">Individual service status</p>
        </div>
        <div className="divide-y divide-[rgba(59,130,246,0.1)]">
          {systems.map((system, index) => {
            const config = statusConfig[system.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-5 hover:bg-[rgba(59,130,246,0.02)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      system.status === 'healthy'
                        ? 'bg-[rgba(16,185,129,0.1)]'
                        : system.status === 'pending'
                        ? 'bg-[rgba(100,116,139,0.1)]'
                        : 'bg-[rgba(239,68,68,0.1)]'
                    }`}
                  >
                    <Server
                      className={`h-6 w-6 ${
                        system.status === 'healthy'
                          ? 'text-success'
                          : system.status === 'pending'
                          ? 'text-steel-500'
                          : 'text-danger'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-steel-100">{system.name}</span>
                      <Badge
                        className={`${config.color} text-white text-xs`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-steel-500 mt-1">
                      {system.endpoint}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-medium text-steel-100">{system.latency}</div>
                    <div className="text-xs text-steel-500">Latency</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-steel-100">{system.uptime}</div>
                    <div className="text-xs text-steel-500">Uptime</div>
                  </div>
                  <StatusIcon className={`h-5 w-5 ${config.textColor}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Infrastructure Info */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[rgba(59,130,246,0.1)] rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-electric-500" />
            </div>
            <div>
              <h3 className="font-medium text-steel-100">Region</h3>
              <p className="text-sm text-steel-500">us-east-2 (Ohio)</p>
            </div>
          </div>
          <div className="text-sm text-steel-400">
            Primary deployment region for all services
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[rgba(139,92,246,0.1)] rounded-lg flex items-center justify-center">
              <Cpu className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-steel-100">Compute</h3>
              <p className="text-sm text-steel-500">AWS EC2</p>
            </div>
          </div>
          <div className="text-sm text-steel-400">
            Auto-scaling groups with load balancing
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[rgba(16,185,129,0.1)] rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-medium text-steel-100">Database</h3>
              <p className="text-sm text-steel-500">Supabase PostgreSQL</p>
            </div>
          </div>
          <div className="text-sm text-steel-400">
            Managed database with automatic backups
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-header mb-1">Active Alerts</h2>
            <p className="text-sm text-steel-500">System notifications and warnings</p>
          </div>
        </div>
        <div className="space-y-3">
          {systems.filter((s) => s.status === 'pending').length > 0 ? (
            systems
              .filter((s) => s.status === 'pending')
              .map((system, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] rounded-lg"
                >
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-steel-100">
                      {system.name} - Configuration Required
                    </p>
                    <p className="text-xs text-steel-500 mt-1">
                      This service needs to be configured before going live
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center gap-4 p-4 bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] rounded-lg">
              <CheckCircle className="h-5 w-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-medium text-steel-100">All Systems Operational</p>
                <p className="text-xs text-steel-500 mt-1">
                  No active alerts or warnings
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

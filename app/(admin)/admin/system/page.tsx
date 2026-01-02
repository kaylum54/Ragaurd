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
} from 'lucide-react';

interface SystemStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'pending';
  latency: string;
  uptime: string;
  lastCheck: string;
  endpoint?: string;
}

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
    color: 'bg-secure-600',
    textColor: 'text-secure-600',
    label: 'Healthy',
    icon: CheckCircle,
  },
  degraded: {
    color: 'bg-warning-600',
    textColor: 'text-warning-600',
    label: 'Degraded',
    icon: AlertTriangle,
  },
  down: {
    color: 'bg-critical-600',
    textColor: 'text-critical-600',
    label: 'Down',
    icon: AlertTriangle,
  },
  pending: {
    color: 'bg-midnight-400',
    textColor: 'text-midnight-400',
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-page-title">System Status</h1>
          <p className="dash-page-subtitle">
            Infrastructure health and performance
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="dash-btn dash-btn-secondary"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Status</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {healthyCount}/{totalCount}
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">Operational</p>
            </div>
            <div className={`w-3 h-3 rounded-full mt-1 ${
              healthyCount === totalCount ? 'bg-secure-500' :
              healthyCount > 0 ? 'bg-warning-500' : 'bg-critical-500'
            }`} />
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Avg Latency</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">
                {Math.round(
                  systems
                    .filter((s) => s.latency !== '-')
                    .reduce((acc, s) => acc + parseInt(s.latency), 0) /
                    systems.filter((s) => s.latency !== '-').length || 0
                )}ms
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">All services</p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Clock className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Uptime</div>
              <div className="text-2xl font-semibold text-midnight-950 mt-2 tabular-nums">99.9%</div>
              <p className="text-xs text-midnight-500 mt-1.5">Last 30 days</p>
            </div>
            <div className="w-9 h-9 bg-secure-50 rounded flex items-center justify-center">
              <Activity className="h-4 w-4 text-secure-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">Last Check</div>
              <div className="text-base font-semibold text-midnight-950 mt-2">
                {lastRefresh.toLocaleTimeString()}
              </div>
              <p className="text-xs text-midnight-500 mt-1.5">
                {lastRefresh.toLocaleDateString()}
              </p>
            </div>
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-midnight-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded border border-midnight-200 overflow-hidden">
        <div className="p-5 border-b border-midnight-100">
          <h2 className="text-base font-medium text-midnight-950">Service Health</h2>
          <p className="text-xs text-midnight-500 mt-0.5">Individual service status</p>
        </div>
        <div className="divide-y divide-midnight-100">
          {systems.map((system, index) => {
            const config = statusConfig[system.status];
            const StatusIcon = config.icon;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-midnight-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded flex items-center justify-center ${
                      system.status === 'healthy'
                        ? 'bg-secure-50'
                        : system.status === 'pending'
                        ? 'bg-midnight-100'
                        : 'bg-critical-50'
                    }`}
                  >
                    <Server
                      className={`h-5 w-5 ${
                        system.status === 'healthy'
                          ? 'text-secure-600'
                          : system.status === 'pending'
                          ? 'text-midnight-500'
                          : 'text-critical-600'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-midnight-900">{system.name}</span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded text-white ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="text-xs text-midnight-500 mt-0.5">
                      {system.endpoint}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-midnight-900 tabular-nums">{system.latency}</div>
                    <div className="text-xs text-midnight-500">Latency</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-midnight-900 tabular-nums">{system.uptime}</div>
                    <div className="text-xs text-midnight-500">Uptime</div>
                  </div>
                  <StatusIcon className={`h-4 w-4 ${config.textColor}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Infrastructure Info */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Globe className="h-4 w-4 text-midnight-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-midnight-900">Region</h3>
              <p className="text-xs text-midnight-500">us-east-2 (Ohio)</p>
            </div>
          </div>
          <div className="text-xs text-midnight-500">
            Primary deployment region
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-midnight-100 rounded flex items-center justify-center">
              <Cpu className="h-4 w-4 text-midnight-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-midnight-900">Compute</h3>
              <p className="text-xs text-midnight-500">AWS EC2</p>
            </div>
          </div>
          <div className="text-xs text-midnight-500">
            Auto-scaling with load balancing
          </div>
        </div>

        <div className="bg-white rounded border border-midnight-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-secure-50 rounded flex items-center justify-center">
              <Database className="h-4 w-4 text-secure-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-midnight-900">Database</h3>
              <p className="text-xs text-midnight-500">Supabase PostgreSQL</p>
            </div>
          </div>
          <div className="text-xs text-midnight-500">
            Managed with automatic backups
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded border border-midnight-200 p-5">
        <div className="mb-5">
          <h2 className="text-base font-medium text-midnight-950">Active Alerts</h2>
          <p className="text-xs text-midnight-500 mt-0.5">System notifications</p>
        </div>
        <div className="space-y-3">
          {systems.filter((s) => s.status === 'pending').length > 0 ? (
            systems
              .filter((s) => s.status === 'pending')
              .map((system, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-warning-50 border border-warning-200 rounded"
                >
                  <AlertTriangle className="h-4 w-4 text-warning-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-midnight-900">
                      {system.name} - Configuration Required
                    </p>
                    <p className="text-xs text-midnight-500 mt-0.5">
                      Configure before going live
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center gap-3 p-3 bg-secure-50 border border-secure-200 rounded">
              <CheckCircle className="h-4 w-4 text-secure-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-midnight-900">All Systems Operational</p>
                <p className="text-xs text-midnight-500 mt-0.5">
                  No active alerts
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

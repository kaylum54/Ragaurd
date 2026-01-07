'use client';

import { Shield, Zap, AlertTriangle, Activity, Key, Users, ArrowRight, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import { RecentRequests } from '@/components/dashboard/RecentRequests';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useDashboardStats } from '@/hooks/useDashboard';
import Link from 'next/link';
import Image from 'next/image';

export function DashboardContent() {
  const { data, loading } = useDashboardStats();

  const textUsagePercent = data.usage.text.percentage;
  const audioUsagePercent = data.usage.audio.percentage;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const systemStatus = [
    { name: 'Text Defense API', status: 'operational', latency: '12ms' },
    { name: 'Audio Defense API', status: 'operational', latency: '34ms' },
    { name: 'Threat Intelligence', status: 'operational', latency: '8ms' },
    { name: 'Rate Limiting', status: 'operational', latency: '2ms' },
  ];

  return (
    <div className="space-y-0">
      {/* Top Bar - Branding & Status */}
      <div className="bg-white border-b border-slate-200 -mx-4 -mt-4 px-5 py-3 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Image
              src="/images/ragaurd-logo.png"
              alt="Ragaurd"
              width={200}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <h1 className="text-base font-semibold text-slate-900 tracking-tight">Security Dashboard</h1>
              <p className="text-xs text-slate-500">Real-time threat monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Last Updated</p>
              <p className="text-xs text-slate-600 tabular-nums">{new Date().toLocaleTimeString()}</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-700 text-white text-xs font-semibold tracking-wide">
              <span className="h-1.5 w-1.5 bg-emerald-300 animate-pulse" />
              ALL SYSTEMS OPERATIONAL
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-4 gap-px bg-slate-200 border border-slate-200 mb-5">
        <div className="bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Requests</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                {loading ? '—' : data.stats.totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-8 bg-slate-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-slate-500" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-600">+12.5%</span>
            <span className="text-xs text-slate-400">30d</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Threats Blocked</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                {loading ? '—' : data.stats.blockedThreats.toLocaleString()}
              </p>
            </div>
            <div className="h-8 w-8 bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <TrendingDown className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-600">-8%</span>
            <span className="text-xs text-slate-400">attacks</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Block Rate</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                {loading ? '—' : `${data.stats.blockRate}%`}
              </p>
            </div>
            <div className="h-8 w-8 bg-blue-50 flex items-center justify-center">
              <Shield className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <Minus className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-400">Industry leading</span>
          </div>
        </div>

        <div className="bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Avg Latency</p>
              <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">
                {loading ? '—' : `${data.stats.avgLatencyMs}ms`}
              </p>
            </div>
            <div className="h-8 w-8 bg-amber-50 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <TrendingDown className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-600">-5ms</span>
            <span className="text-xs text-slate-400">improved</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Usage & System Status */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {/* Usage Panel - 2 cols */}
        <div className="col-span-2 bg-white border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">API Usage</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(startOfMonth)} — {formatDate(endOfMonth)}</p>
            </div>
            <Link href="/dashboard/usage" className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-600">Text Requests</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {data.usage.text.used.toLocaleString()} / {data.usage.text.limit?.toLocaleString() || '∞'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100">
                  <div className="h-full bg-slate-600 transition-all" style={{ width: `${Math.min(textUsagePercent, 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">{textUsagePercent.toFixed(1)}% utilized</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Audio Requests</span>
                    <span className="text-[9px] font-bold px-1 py-0.5 bg-slate-700 text-white uppercase">Pro</span>
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {data.usage.audio.used.toLocaleString()} / {data.usage.audio.limit?.toLocaleString() || '∞'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100">
                  <div className="h-full bg-blue-600 transition-all" style={{ width: `${Math.min(audioUsagePercent, 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">{audioUsagePercent.toFixed(1)}% utilized</p>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Key className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium text-slate-600">{data.stats.activeApiKeys}</span> API keys
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium text-slate-600">{data.stats.teamMembers}</span> team members
              </div>
            </div>
          </div>
        </div>

        {/* System Status Panel - 1 col */}
        <div className="bg-white border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">System Status</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Service health</p>
          </div>
          <div className="divide-y divide-slate-100">
            {systemStatus.map((service) => (
              <div key={service.name} className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-slate-700">{service.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 tabular-nums">{service.latency}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Clock className="h-3 w-3" />
              99.99% uptime (30d)
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Request Volume</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">7-day trend</p>
          </div>
          <div className="p-4">
            <UsageChart />
          </div>
        </div>
        <div className="bg-white border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Threat Distribution</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">By category</p>
          </div>
          <div className="p-4">
            <AttackChart />
          </div>
        </div>
      </div>

      {/* Bottom Row - Activity & Actions */}
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Recent Activity</h2>
              <p className="text-[10px] text-slate-500 mt-0.5">Latest defense events</p>
            </div>
            <Link href="/dashboard/usage" className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-0">
            <RecentRequests />
          </div>
        </div>
        <div className="bg-white border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-800">Quick Actions</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Common tasks</p>
          </div>
          <div className="p-0">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

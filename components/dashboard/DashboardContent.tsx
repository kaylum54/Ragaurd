'use client';

import { Shield, Zap, AlertTriangle, Activity, Key, Users, ArrowRight } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
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
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-6">
          <Image
            src="/images/ragaurd-logo.png"
            alt="Ragaurd"
            width={280}
            height={70}
            className="h-16 w-auto"
            priority
          />
          <div className="h-12 w-px bg-slate-300" />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Security Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time threat monitoring and defense analytics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium">
            <span className="h-2 w-2 bg-white animate-pulse" />
            OPERATIONAL
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Requests</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : data.stats.totalRequests.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
            </div>
            <div className="h-10 w-10 bg-slate-100 flex items-center justify-center">
              <Activity className="h-5 w-5 text-slate-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-emerald-600">+12.5%</span>
            <span className="text-xs text-slate-500 ml-1">vs last period</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Threats Blocked</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : data.stats.blockedThreats.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total blocked</p>
            </div>
            <div className="h-10 w-10 bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-emerald-600">-8%</span>
            <span className="text-xs text-slate-500 ml-1">attack attempts</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Block Rate</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : `${data.stats.blockRate}%`}
              </p>
              <p className="text-xs text-slate-500 mt-1">Detection accuracy</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">Industry leading</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg Latency</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1 tabular-nums">
                {loading ? '—' : `${data.stats.avgLatencyMs}ms`}
              </p>
              <p className="text-xs text-slate-500 mt-1">Response time</p>
            </div>
            <div className="h-10 w-10 bg-amber-50 flex items-center justify-center">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-emerald-600">-5%</span>
            <span className="text-xs text-slate-500 ml-1">improvement</span>
          </div>
        </div>
      </div>

      {/* Usage Section */}
      <div className="bg-white border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Monthly Usage</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatDate(startOfMonth)} — {formatDate(endOfMonth)}
            </p>
          </div>
          <Link
            href="/dashboard/usage"
            className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            View Details
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Text Requests</span>
              <span className="text-sm text-slate-600 tabular-nums">
                {data.usage.text.used.toLocaleString()} / {data.usage.text.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-2 bg-slate-100">
              <div
                className="h-full bg-slate-700 transition-all duration-300"
                style={{ width: `${Math.min(textUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Audio Requests</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-800 text-white uppercase tracking-wide">Pro</span>
              </div>
              <span className="text-sm text-slate-600 tabular-nums">
                {data.usage.audio.used.toLocaleString()} / {data.usage.audio.limit?.toLocaleString() || '∞'}
              </span>
            </div>
            <div className="h-2 bg-slate-100">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${Math.min(audioUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                {data.stats.activeApiKeys} API keys
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {data.stats.teamMembers} team members
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentRequests />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { Calendar, Loader2, RotateCw } from 'lucide-react';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { AttackChart } from '@/components/dashboard/AttackChart';
import { ExportDropdown } from '@/components/dashboard/ExportDropdown';
import { useUsageStats, useDailyBreakdown } from '@/hooks/useUsage';
import type { UsageExportData } from '@/lib/utils/export';

export default function UsagePage() {
  const { stats, loading: statsLoading, refetch } = useUsageStats();
  const { data: dailyStats, loading: dailyLoading } = useDailyBreakdown(7);

  const textLimit = stats.text?.limit ?? 0;
  const audioLimit = stats.audio?.limit ?? 0;
  const redteamLimit = stats.redteam?.limit ?? 0;
  const textUsed = stats.text?.used ?? 0;
  const audioUsed = stats.audio?.used ?? 0;
  const redteamUsed = stats.redteam?.used ?? 0;
  const blocked = stats.blocked ?? 0;
  const passed = stats.passed ?? 0;
  const avgLatency = stats.avgLatency ?? 0;

  const textPercent = textLimit > 0 ? (textUsed / textLimit) * 100 : 0;
  const audioPercent = audioLimit > 0 ? (audioUsed / audioLimit) * 100 : 0;
  const redteamPercent = redteamLimit > 0 ? (redteamUsed / redteamLimit) * 100 : 0;
  const totalRequests = blocked + passed;
  const blockRate = totalRequests > 0 ? (blocked / totalRequests) * 100 : 0;

  // Prepare export data
  const exportData: UsageExportData | null = useMemo(() => {
    if (statsLoading || dailyLoading) return null;

    return {
      period: {
        start: stats.period.start,
        end: stats.period.end,
      },
      summary: {
        textRequests: textUsed,
        audioRequests: audioUsed,
        redteamAttacks: redteamUsed,
        totalBlocked: blocked,
        totalPassed: passed,
        blockRate,
        avgLatencyMs: avgLatency,
      },
      daily: dailyStats.map((day) => ({
        date: day.day,
        requests: day.requests,
        blocked: day.blocked,
        passed: day.requests - day.blocked,
      })),
    };
  }, [statsLoading, dailyLoading, stats, textUsed, audioUsed, redteamUsed, blocked, passed, blockRate, avgLatency, dailyStats]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-page-title">Usage & Analytics</h1>
          <p className="dash-page-subtitle">
            Monitor your API usage and security metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="dash-badge dash-badge-info flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(stats.period.start)} - {formatDate(stats.period.end)}
          </span>
          <button className="dash-btn dash-btn-secondary" onClick={() => refetch()}>
            <RotateCw className="h-4 w-4" />
            Refresh
          </button>
          <ExportDropdown data={exportData} loading={statsLoading || dailyLoading} />
        </div>
      </div>

      {/* Usage Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="dash-card">
          <div className="dash-card-header pb-2">
            <span className="text-sm font-semibold text-dash-text-muted">Text Requests</span>
          </div>
          <div className="dash-card-body pt-0">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value">
                  {textUsed.toLocaleString()}
                </div>
                <div className="mt-2 h-2 bg-dash-bg-tertiary overflow-hidden">
                  <div
                    className="h-full bg-dash-accent transition-all"
                    style={{ width: `${Math.min(textPercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-dash-text-muted mt-2 tabular-nums">
                  {Math.round(textPercent)}% of {textLimit.toLocaleString()} limit
                </p>
              </>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header pb-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-dash-text-muted">Audio Requests</span>
              <span className="dash-badge dash-badge-accent">Pro+</span>
            </div>
          </div>
          <div className="dash-card-body pt-0">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value">
                  {audioUsed.toLocaleString()}
                </div>
                <div className="mt-2 h-2 bg-dash-bg-tertiary overflow-hidden">
                  <div
                    className="h-full bg-purple-500 transition-all"
                    style={{ width: `${Math.min(audioPercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-dash-text-muted mt-2 tabular-nums">
                  {Math.round(audioPercent)}% of {audioLimit.toLocaleString()} limit
                </p>
              </>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header pb-2">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-semibold text-dash-text-muted">Red Team Attacks</span>
              <span className="dash-badge dash-badge-accent">Pro+</span>
            </div>
          </div>
          <div className="dash-card-body pt-0">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value">
                  {redteamUsed.toLocaleString()}
                </div>
                <div className="mt-2 h-2 bg-dash-bg-tertiary overflow-hidden">
                  <div
                    className="h-full bg-dash-warning transition-all"
                    style={{ width: `${Math.min(redteamPercent, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-dash-text-muted mt-2 tabular-nums">
                  {Math.round(redteamPercent)}% of {redteamLimit.toLocaleString()} limit
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Total Requests</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted mt-2" />
            ) : (
              <div className="dash-stats-value mt-1">
                {totalRequests.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Blocked</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted mt-2" />
            ) : (
              <div className="dash-stats-value text-dash-danger mt-1">
                {blocked.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Block Rate</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted mt-2" />
            ) : (
              <div className="dash-stats-value text-dash-accent mt-1">
                {blockRate.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider">Avg Latency</div>
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted mt-2" />
            ) : (
              <div className="dash-stats-value text-dash-success mt-1">
                {avgLatency}ms
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UsageChart />
        <AttackChart />
      </div>

      {/* Daily Breakdown */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Daily Breakdown (Last 7 Days)</span>
        </div>
        <div className="dash-card-body">
          {dailyLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-dash-text-muted" />
            </div>
          ) : (
            <div className="space-y-4">
              {dailyStats.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-12 font-semibold text-dash-text-secondary">{day.day}</div>
                  <div className="flex-1">
                    <div className="flex h-4 overflow-hidden bg-dash-bg-tertiary">
                      <div
                        className="bg-dash-success transition-all"
                        style={{ width: `${Math.min(((day.requests - day.blocked) / 10000) * 100, 100)}%` }}
                      />
                      <div
                        className="bg-dash-danger transition-all"
                        style={{ width: `${Math.min((day.blocked / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-dash-text-muted w-24 text-right tabular-nums">
                    {day.requests.toLocaleString()} total
                  </div>
                  <div className="text-sm text-dash-danger w-20 text-right tabular-nums">
                    {day.blocked} blocked
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

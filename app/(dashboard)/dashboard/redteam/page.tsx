'use client';

import Link from 'next/link';
import { Target, Plus, Play, Clock, CheckCircle, XCircle, ArrowRight, Loader2, RotateCw, Trash2, Mic, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRedteamScans, useRedteamStats, type RedteamScan } from '@/hooks/useRedteam';
import { useState } from 'react';
import { LockedFeature } from '@/components/dashboard/LockedFeature';

const getStatusIcon = (status: RedteamScan['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-dash-success" />;
    case 'running':
      return <Play className="h-4 w-4 text-dash-accent animate-pulse" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-dash-danger" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-dash-warning" />;
    default:
      return <Clock className="h-4 w-4 text-dash-warning" />;
  }
};

const getStatusBadgeClass = (status: RedteamScan['status']) => {
  const variants: Record<RedteamScan['status'], string> = {
    completed: 'dash-badge-success',
    running: 'dash-badge-accent',
    queued: 'dash-badge-accent',
    failed: 'dash-badge-danger',
    pending: 'dash-badge-warning',
    cancelled: 'dash-badge-info',
  };
  return variants[status] || 'dash-badge-info';
};

export default function RedTeamPage() {
  const { scans, loading, refetch, startScan, deleteScan } = useRedteamScans();
  const { stats, loading: statsLoading } = useRedteamStats();
  const [scanToDelete, setScanToDelete] = useState<RedteamScan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!scanToDelete) return;
    setDeleting(true);
    try {
      await deleteScan(scanToDelete.id);
      setScanToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleStart = async (id: string) => {
    await startScan(id);
  };

  return (
    <LockedFeature
      feature="redTeam"
      title="Red Team Testing"
      description="Automated security scanning and vulnerability testing"
      requiredPlan="Pro"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="dash-page-title">Red Team Testing</h1>
            <p className="dash-page-subtitle">
              Automated security scanning and vulnerability testing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="dash-btn dash-btn-secondary" onClick={() => refetch()}>
              <RotateCw className="h-4 w-4" />
              Refresh
            </button>
            <Link href="/dashboard/redteam/test" className="dash-btn dash-btn-secondary">
              <Mic className="h-4 w-4" />
              Test Agent
            </Link>
            <Link href="/dashboard/redteam/voice" className="dash-btn dash-btn-secondary">
              <Phone className="h-4 w-4" />
              Live Voice
            </Link>
            <Link href="/dashboard/redteam/new" className="dash-btn dash-btn-primary">
              <Plus className="h-4 w-4" />
              New Scan
            </Link>
          </div>
        </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="dash-card">
          <div className="dash-card-body">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value">{stats.totalScans}</div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider mt-1">Total Scans</div>
              </>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value">{stats.completedScans}</div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider mt-1">Completed</div>
              </>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value text-dash-success">{stats.avgBlockRate.toFixed(1)}%</div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider mt-1">Avg Block Rate</div>
              </>
            )}
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
            ) : (
              <>
                <div className="dash-stats-value">{stats.totalAttacks.toLocaleString()}</div>
                <div className="text-xs font-semibold text-dash-text-muted uppercase tracking-wider mt-1">Total Attacks</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scans Table */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Recent Scans</span>
        </div>
        <div className="dash-card-body p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-dash-text-muted" />
            </div>
          ) : scans.length === 0 ? (
            <div className="text-center py-12 text-dash-text-muted">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium">No scans yet. Create one to get started.</p>
              <Link href="/dashboard/redteam/new" className="dash-btn dash-btn-primary mt-4 inline-flex">
                <Plus className="h-4 w-4" />
                Create Your First Scan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-dash-border">
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Target</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Suite</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Block Rate</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Progress</th>
                    <th className="w-[100px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border">
                  {scans.map((scan) => {
                    const progress = scan.status === 'completed'
                      ? 100
                      : scan.totalAttacks > 0
                        ? ((scan.blockedAttacks + scan.passedAttacks) / scan.totalAttacks) * 100
                        : 0;

                    return (
                      <tr key={scan.id} className="hover:bg-dash-bg-hover transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(scan.status)}
                            <span className="font-semibold text-dash-text-primary">{scan.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn('dash-badge', getStatusBadgeClass(scan.status))}>
                            {scan.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-dash-bg-secondary px-2 py-1 font-mono text-dash-text-secondary border-2 border-dash-border">
                            {scan.targetEndpoint.length > 30
                              ? scan.targetEndpoint.substring(0, 30) + '...'
                              : scan.targetEndpoint}
                          </code>
                        </td>
                        <td className="py-3 px-4 capitalize text-sm text-dash-text-secondary font-medium">{scan.attackSuite}</td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            'font-bold tabular-nums',
                            scan.blockRate >= 99 && 'text-dash-success',
                            scan.blockRate >= 95 && scan.blockRate < 99 && 'text-dash-warning',
                            scan.blockRate < 95 && scan.blockRate > 0 && 'text-dash-danger'
                          )}>
                            {scan.status === 'pending' ? '-' : `${scan.blockRate.toFixed(1)}%`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-dash-bg-tertiary overflow-hidden">
                              <div
                                className="h-full bg-dash-accent transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-dash-text-muted tabular-nums">
                              {scan.blockedAttacks + scan.passedAttacks}/{scan.totalAttacks}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {scan.status === 'pending' && (
                              <button
                                className="p-1.5 text-dash-text-muted hover:text-dash-text-primary hover:bg-dash-bg-hover transition-colors"
                                onClick={() => handleStart(scan.id)}
                              >
                                <Play className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              className="p-1.5 text-dash-text-muted hover:text-dash-danger transition-colors"
                              onClick={() => setScanToDelete(scan)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/dashboard/redteam/${scan.id}`}
                              className="p-1.5 text-dash-text-muted hover:text-dash-text-primary transition-colors"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {scanToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="dash-card max-w-md w-full mx-4">
            <div className="dash-card-header">
              <span className="dash-card-title">Delete Scan</span>
            </div>
            <div className="dash-card-body space-y-4">
              <p className="text-sm text-dash-text-secondary">
                Are you sure you want to delete &quot;{scanToDelete.name}&quot;? This action cannot be undone
                and all scan results will be permanently lost.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="dash-btn dash-btn-secondary"
                  onClick={() => setScanToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="dash-btn bg-dash-danger text-white border-dash-danger hover:bg-dash-danger/90"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Delete Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attack Suites Info */}
      <div className="grid gap-6 md:grid-cols-3">
        {['basic', 'standard', 'comprehensive'].map((suite) => (
          <div key={suite} className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title capitalize">{suite}</span>
              <span className="text-xs text-dash-text-muted font-medium">
                {suite === 'basic' && '50 attacks • ~5 min'}
                {suite === 'standard' && '200 attacks • ~15 min'}
                {suite === 'comprehensive' && '500+ attacks • ~45 min'}
              </span>
            </div>
            <div className="dash-card-body">
              <ul className="space-y-2 text-sm text-dash-text-secondary">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-dash-accent" />
                  Prompt injection attacks
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-dash-accent" />
                  Jailbreak attempts
                </li>
                {suite !== 'basic' && (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-dash-accent" />
                      Role manipulation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-dash-accent" />
                      Data exfiltration
                    </li>
                  </>
                )}
                {suite === 'comprehensive' && (
                  <>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-dash-accent" />
                      Custom payloads
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-dash-accent" />
                      Advanced evasion
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          ))}
        </div>
      </div>
    </LockedFeature>
  );
}

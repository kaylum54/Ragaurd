'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Loader2,
  RotateCw,
  ExternalLink,
  Mic,
  Phone,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRedteamScan, type AttackResult } from '@/hooks/useRedteam';

const platformIcons: Record<string, typeof Mic> = {
  ragaurd: Shield,
  elevenlabs: Mic,
  vapi: Phone,
  retell: Phone,
  bland: Phone,
  custom: Globe,
};

export default function ScanDetailPage() {
  const params = useParams();
  const scanId = params.id as string;
  const { scan, progress, attacks, loading, error, refetch } = useRedteamScan(scanId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-dash-accent mx-auto mb-4" />
          <p className="text-dash-text-muted">Loading scan data...</p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/redteam"
          className="inline-flex items-center text-sm text-dash-text-muted hover:text-dash-text-primary font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Red Team
        </Link>
        <div className="dash-card">
          <div className="dash-card-body flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-dash-warning mb-4" />
            <h2 className="text-lg font-bold text-dash-text-primary mb-2">Scan Not Found</h2>
            <p className="text-dash-text-muted mb-4">
              The scan may still be initializing. Try refreshing in a few seconds.
            </p>
            <div className="flex gap-3">
              <button onClick={() => refetch()} className="dash-btn dash-btn-secondary">
                <RotateCw className="h-4 w-4" />
                Retry
              </button>
              <Link href="/dashboard/redteam" className="dash-btn dash-btn-primary">
                View All Scans
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = scan.status === 'completed'
    ? 100
    : scan.totalAttacks > 0
      ? ((scan.blockedAttacks + scan.passedAttacks) / scan.totalAttacks) * 100
      : 0;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-dash-success" />;
      case 'running':
      case 'queued':
        return <Play className="h-5 w-5 text-dash-accent animate-pulse" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-dash-danger" />;
      default:
        return <Clock className="h-5 w-5 text-dash-warning" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'dash-badge-success',
      running: 'dash-badge-accent',
      queued: 'dash-badge-accent',
      failed: 'dash-badge-danger',
      pending: 'dash-badge-warning',
    };
    return variants[status] || 'dash-badge-info';
  };

  const getResultBadgeClass = (result: string) => {
    switch (result) {
      case 'blocked':
        return 'dash-badge-success';
      case 'passed':
        return 'dash-badge-danger';
      case 'error':
        return 'dash-badge-warning';
      default:
        return 'dash-badge-info';
    }
  };

  const PlatformIcon = scan.platform ? (platformIcons[scan.platform] || Target) : Target;

  // Group attacks by result for summary
  const attackSummary = attacks.reduce((acc, attack) => {
    acc[attack.result] = (acc[attack.result] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/redteam"
          className="inline-flex items-center text-sm text-dash-text-muted hover:text-dash-text-primary mb-4 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Red Team
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {getStatusIcon(scan.status)}
            <div>
              <h1 className="dash-page-title flex items-center gap-2">
                {scan.platform && <PlatformIcon className="h-6 w-6 text-dash-accent" />}
                {scan.name}
              </h1>
              <p className="dash-page-subtitle">
                {scan.attackSuite.charAt(0).toUpperCase() + scan.attackSuite.slice(1)} scan · {scan.totalAttacks} attacks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('dash-badge uppercase', getStatusBadgeClass(scan.status))}>
              {scan.status}
            </span>
            <button onClick={() => refetch()} className="dash-btn dash-btn-secondary">
              <RotateCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-bold text-dash-text-muted uppercase tracking-wider mb-1">Block Rate</div>
            <div className={cn(
              'dash-stats-value',
              scan.blockRate >= 99 && 'text-dash-success',
              scan.blockRate >= 95 && scan.blockRate < 99 && 'text-dash-warning',
              scan.blockRate < 95 && scan.blockRate > 0 && 'text-dash-danger'
            )}>
              {scan.status === 'pending' ? '-' : `${scan.blockRate.toFixed(1)}%`}
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-bold text-dash-text-muted uppercase tracking-wider mb-1">Blocked</div>
            <div className="dash-stats-value text-dash-success">
              {scan.blockedAttacks.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-bold text-dash-text-muted uppercase tracking-wider mb-1">Passed</div>
            <div className="dash-stats-value text-dash-danger">
              {scan.passedAttacks.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-body">
            <div className="text-xs font-bold text-dash-text-muted uppercase tracking-wider mb-1">Total</div>
            <div className="dash-stats-value">
              {scan.totalAttacks.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Progress for running scans */}
      {(scan.status === 'running' || scan.status === 'queued') && (
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-dash-accent" />
              Scan In Progress
            </span>
            <span className="text-xs text-dash-text-muted tabular-nums">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="dash-card-body">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dash-text-secondary">
                  {scan.blockedAttacks + scan.passedAttacks} / {scan.totalAttacks} attacks completed
                </span>
                <span className="text-dash-text-muted">
                  {progress?.progress?.blocked || 0} blocked, {progress?.progress?.passed || 0} passed
                </span>
              </div>
              <div className="h-3 bg-dash-bg-tertiary overflow-hidden">
                <div
                  className="h-full bg-dash-accent transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scan Details */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Scan Details</span>
          </div>
          <div className="dash-card-body space-y-4">
            {scan.platform && (
              <div className="flex items-center justify-between">
                <span className="text-dash-text-muted">Platform</span>
                <span className="font-medium text-dash-text-primary flex items-center gap-2">
                  <PlatformIcon className="h-4 w-4 text-dash-accent" />
                  {scan.platform.charAt(0).toUpperCase() + scan.platform.slice(1)}
                </span>
              </div>
            )}
            {scan.targetEndpoint && (
              <div className="flex items-center justify-between">
                <span className="text-dash-text-muted">Target</span>
                {scan.targetEndpoint.startsWith('http://') || scan.targetEndpoint.startsWith('https://') ? (
                  <a
                    href={scan.targetEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-dash-accent hover:underline"
                  >
                    {scan.targetEndpoint.length > 40
                      ? scan.targetEndpoint.substring(0, 40) + '...'
                      : scan.targetEndpoint}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-sm font-medium text-dash-text-primary">
                    {scan.targetEndpoint.length > 40
                      ? scan.targetEndpoint.substring(0, 40) + '...'
                      : scan.targetEndpoint}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-dash-text-muted">Attack Suite</span>
              <span className="font-medium text-dash-text-primary capitalize">{scan.attackSuite}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dash-text-muted">Created</span>
              <span className="font-medium text-dash-text-primary tabular-nums">{formatDate(scan.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dash-text-muted">Started</span>
              <span className="font-medium text-dash-text-primary tabular-nums">{formatDate(scan.startedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-dash-text-muted">Completed</span>
              <span className="font-medium text-dash-text-primary tabular-nums">{formatDate(scan.completedAt)}</span>
            </div>
          </div>
        </div>

        {/* Attack Summary */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Attack Summary</span>
          </div>
          <div className="dash-card-body">
            {attacks.length > 0 ? (
              <div className="space-y-4">
                <div className="flex h-4 overflow-hidden bg-dash-bg-tertiary">
                  {scan.blockedAttacks > 0 && (
                    <div
                      className="bg-dash-success transition-all"
                      style={{ width: `${(scan.blockedAttacks / scan.totalAttacks) * 100}%` }}
                    />
                  )}
                  {scan.passedAttacks > 0 && (
                    <div
                      className="bg-dash-danger transition-all"
                      style={{ width: `${(scan.passedAttacks / scan.totalAttacks) * 100}%` }}
                    />
                  )}
                  {scan.errorAttacks > 0 && (
                    <div
                      className="bg-dash-warning transition-all"
                      style={{ width: `${(scan.errorAttacks / scan.totalAttacks) * 100}%` }}
                    />
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dash-success tabular-nums">
                      {scan.blockedAttacks}
                    </div>
                    <div className="text-xs text-dash-text-muted uppercase tracking-wider">Blocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dash-danger tabular-nums">
                      {scan.passedAttacks}
                    </div>
                    <div className="text-xs text-dash-text-muted uppercase tracking-wider">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dash-warning tabular-nums">
                      {scan.errorAttacks}
                    </div>
                    <div className="text-xs text-dash-text-muted uppercase tracking-wider">Errors</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-dash-text-muted">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {scan.status === 'running' || scan.status === 'queued'
                    ? 'Results will appear as the scan progresses...'
                    : 'No attack results available'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attack Log */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Attack Log</span>
          <span className="text-xs text-dash-text-muted">
            {attacks.length > 0 ? `${attacks.length} attacks` : 'Waiting for results...'}
          </span>
        </div>
        <div className="dash-card-body p-0">
          {attacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-dash-border">
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">#</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Payload</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Result</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Blocked By</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Response</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-dash-text-muted uppercase tracking-wider">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border">
                  {attacks.map((attack: AttackResult, index: number) => (
                    <tr key={attack.id || index} className="hover:bg-dash-bg-hover transition-colors">
                      <td className="py-3 px-4 text-sm text-dash-text-muted tabular-nums">
                        {attack.id || index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs bg-dash-bg-secondary px-2 py-1 font-mono text-dash-text-secondary border border-dash-border max-w-[300px] block truncate">
                          {attack.payload}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('dash-badge uppercase', getResultBadgeClass(attack.result))}>
                          {attack.result}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {attack.blocked_by ? (
                          <span className="text-xs text-dash-text-secondary font-medium">
                            {attack.blocked_by}
                          </span>
                        ) : (
                          <span className="text-dash-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {attack.response_preview ? (
                          <span className="text-xs text-dash-text-muted max-w-[200px] block truncate">
                            {attack.response_preview}
                          </span>
                        ) : (
                          <span className="text-dash-text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {attack.latency_ms ? (
                          <span className="text-xs text-dash-text-secondary tabular-nums font-medium">
                            {attack.latency_ms}ms
                          </span>
                        ) : (
                          <span className="text-dash-text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-dash-text-muted">
              {scan.status === 'running' || scan.status === 'queued' ? (
                <>
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-dash-accent" />
                  <p className="text-sm">Scan in progress. Results will appear here...</p>
                </>
              ) : (
                <>
                  <Target className="h-8 w-8 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No attack results available for this scan.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/redteam" className="dash-btn dash-btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Scans
        </Link>
        {scan.status === 'completed' && (
          <Link href="/dashboard/redteam/new" className="dash-btn dash-btn-primary">
            <RotateCw className="h-4 w-4" />
            New Scan
          </Link>
        )}
      </div>
    </div>
  );
}

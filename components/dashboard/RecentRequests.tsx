'use client';

import { Shield, AlertTriangle, Clock, Loader2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecentRequests } from '@/hooks/useDashboard';
import Link from 'next/link';

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RecentRequests() {
  const { data: requests, loading } = useRecentRequests(8);

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <span className="dash-card-title">Recent Requests</span>
        <Link
          href="/dashboard/usage"
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-dash-accent hover:text-dash-accent-hover transition-colors"
        >
          View All
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-dash-text-muted" />
        </div>
      ) : (
        <div className="overflow-x-auto dash-scrollbar">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Type</th>
                <th>Details</th>
                <th className="text-right">Latency</th>
                <th className="text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id} className="group">
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-8 w-8 flex items-center justify-center transition-all border-2',
                          'group-hover:scale-110',
                          request.status === 'blocked' && 'bg-dash-danger/10 border-dash-danger/30',
                          request.status === 'passed' && 'bg-dash-success/10 border-dash-success/30',
                          request.status === 'error' && 'bg-dash-warning/10 border-dash-warning/30'
                        )}
                      >
                        {request.status === 'blocked' ? (
                          <AlertTriangle className="h-4 w-4 text-dash-danger" />
                        ) : (
                          <Shield className="h-4 w-4 text-dash-success" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'dash-badge uppercase',
                          request.status === 'blocked'
                            ? 'dash-badge-danger'
                            : 'dash-badge-success'
                        )}
                      >
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs font-bold px-2 py-1 bg-dash-bg-secondary text-dash-text-secondary uppercase tracking-wider border border-dash-border">
                      {request.type}
                    </span>
                  </td>
                  <td>
                    {request.threatCategory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-dash-text-secondary">
                          {request.blockedBy?.replace(/_/g, ' ')}
                        </span>
                        <span className="text-dash-text-muted">-</span>
                        <span className="text-sm text-dash-text-muted">
                          {request.threatCategory.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-dash-text-muted">-</span>
                    )}
                  </td>
                  <td className="text-right">
                    <span className={cn(
                      'text-sm font-medium tabular-nums',
                      request.latencyMs && request.latencyMs < 100
                        ? 'text-dash-success'
                        : request.latencyMs && request.latencyMs < 200
                        ? 'text-dash-text-primary'
                        : 'text-dash-warning'
                    )}>
                      {request.latencyMs ? `${request.latencyMs}ms` : '-'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center gap-1.5 justify-end text-dash-text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs">{formatTimeAgo(request.timestamp)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

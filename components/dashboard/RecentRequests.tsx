'use client';

import { Shield, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecentRequests } from '@/hooks/useDashboard';

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

export function RecentRequests() {
  const { data: requests, loading } = useRecentRequests(6);

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {requests.map((request) => (
        <div key={request.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'h-7 w-7 flex items-center justify-center',
                request.status === 'blocked' ? 'bg-red-50' : 'bg-emerald-50'
              )}
            >
              {request.status === 'blocked' ? (
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              ) : (
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5',
                    request.status === 'blocked'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  )}
                >
                  {request.status}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">{request.type}</span>
              </div>
              {request.threatCategory && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {request.threatCategory.replace(/_/g, ' ')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <span className={cn(
              'text-xs font-medium tabular-nums',
              request.latencyMs && request.latencyMs < 100 ? 'text-emerald-600' : 'text-slate-600'
            )}>
              {request.latencyMs ? `${request.latencyMs}ms` : '—'}
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] tabular-nums">{formatTimeAgo(request.timestamp)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

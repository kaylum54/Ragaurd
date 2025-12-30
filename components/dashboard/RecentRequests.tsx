'use client';

import { Shield, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRecentRequests } from '@/hooks/useDashboard';

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
    <div className="bg-white rounded border border-midnight-300/60 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
        <h2 className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">Recent Requests</h2>
      </div>

      {loading ? (
        <div className="h-[220px] flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-midnight-400" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-midnight-50/50 border-b border-midnight-200/60">
              <tr>
                <th className="px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-midnight-500">Status</th>
                <th className="px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-midnight-500">Type</th>
                <th className="px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wide text-midnight-500">Details</th>
                <th className="px-2.5 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-midnight-500">Latency</th>
                <th className="px-2.5 py-1.5 text-right text-[10px] font-semibold uppercase tracking-wide text-midnight-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-100/60">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-midnight-50/50 transition-colors">
                  <td className="px-2.5 py-2">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={cn(
                          'h-5 w-5 rounded flex items-center justify-center',
                          request.status === 'blocked' && 'bg-critical-100',
                          request.status === 'passed' && 'bg-secure-100',
                          request.status === 'error' && 'bg-warning-100'
                        )}
                      >
                        {request.status === 'blocked' ? (
                          <AlertTriangle className="h-3 w-3 text-critical-600" />
                        ) : (
                          <Shield className="h-3 w-3 text-secure-600" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize',
                          request.status === 'blocked'
                            ? 'bg-critical-600 text-white'
                            : 'bg-secure-600 text-white'
                        )}
                      >
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-2.5 py-2">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-midnight-200 text-midnight-700 rounded capitalize">
                      {request.type}
                    </span>
                  </td>
                  <td className="px-2.5 py-2">
                    {request.threatCategory ? (
                      <span className="text-[11px] text-midnight-600">
                        {request.blockedBy?.replace(/_/g, ' ')} - {request.threatCategory.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      <span className="text-[11px] text-midnight-400">—</span>
                    )}
                  </td>
                  <td className="px-2.5 py-2 text-right">
                    <span className="text-[11px] font-semibold text-midnight-900 tabular-nums">
                      {request.latencyMs ? `${request.latencyMs}ms` : '—'}
                    </span>
                  </td>
                  <td className="px-2.5 py-2 text-right">
                    <div className="flex items-center gap-1 justify-end text-midnight-500">
                      <Clock className="h-2.5 w-2.5" />
                      <span className="text-[10px]">{formatTimeAgo(request.timestamp)}</span>
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

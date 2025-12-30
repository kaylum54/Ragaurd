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
    <div className="bg-white rounded border border-midnight-200 p-5">
      <div className="mb-5">
        <h2 className="text-base font-medium text-midnight-950">Recent Requests</h2>
        <p className="text-xs text-midnight-500 mt-0.5">Latest API requests and status</p>
      </div>

      {loading ? (
        <div className="h-[280px] flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-midnight-400" />
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-midnight-200">
          <table className="w-full">
            <thead className="bg-midnight-50 border-b border-midnight-200">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-midnight-500">Status</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-midnight-500">Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-midnight-500">Details</th>
                <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-midnight-500">Latency</th>
                <th className="px-3 py-2.5 text-right text-xs font-medium uppercase tracking-wide text-midnight-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-midnight-50 transition-colors">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-6 w-6 rounded flex items-center justify-center',
                          request.status === 'blocked' && 'bg-critical-50',
                          request.status === 'passed' && 'bg-secure-50',
                          request.status === 'error' && 'bg-warning-50'
                        )}
                      >
                        {request.status === 'blocked' ? (
                          <AlertTriangle className="h-3.5 w-3.5 text-critical-600" />
                        ) : (
                          <Shield className="h-3.5 w-3.5 text-secure-600" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium px-1.5 py-0.5 rounded border capitalize',
                          request.status === 'blocked'
                            ? 'bg-critical-50 text-critical-700 border-critical-200'
                            : 'bg-secure-50 text-secure-700 border-secure-200'
                        )}
                      >
                        {request.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs font-medium px-1.5 py-0.5 bg-midnight-100 text-midnight-700 border border-midnight-200 rounded capitalize">
                      {request.type}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {request.threatCategory ? (
                      <span className="text-xs text-midnight-600">
                        {request.blockedBy?.replace(/_/g, ' ')} - {request.threatCategory.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      <span className="text-xs text-midnight-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="text-xs font-medium text-midnight-900 tabular-nums">
                      {request.latencyMs ? `${request.latencyMs}ms` : '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center gap-1 justify-end text-midnight-500">
                      <Clock className="h-3 w-3" />
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

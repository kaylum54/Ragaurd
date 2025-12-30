'use client';

import { Shield, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Recent Requests</h2>
        <p className="text-sm text-slate-500">Latest API requests and their status</p>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Details</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Latency</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center',
                          request.status === 'blocked' && 'bg-rose-100',
                          request.status === 'passed' && 'bg-emerald-100',
                          request.status === 'error' && 'bg-amber-100'
                        )}
                      >
                        {request.status === 'blocked' ? (
                          <AlertTriangle className="h-4 w-4 text-rose-600" />
                        ) : (
                          <Shield className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <Badge
                        className={cn(
                          'capitalize',
                          request.status === 'blocked'
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        )}
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-700">
                      {request.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {request.threatCategory ? (
                      <span className="text-sm text-slate-600">
                        {request.blockedBy?.replace(/_/g, ' ')} - {request.threatCategory.replace(/_/g, ' ')}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-slate-900">
                      {request.latencyMs ? `${request.latencyMs}ms` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end text-slate-500">
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

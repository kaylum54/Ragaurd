'use client';

import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Request {
  id: string;
  type: 'text' | 'audio';
  status: 'blocked' | 'passed' | 'error';
  blockedBy?: string;
  threatCategory?: string;
  latencyMs: number;
  createdAt: string;
}

interface RecentRequestsProps {
  requests?: Request[];
}

// Mock data
const mockRequests: Request[] = [
  {
    id: '1',
    type: 'text',
    status: 'blocked',
    blockedBy: 'semantic_analysis',
    threatCategory: 'prompt_injection',
    latencyMs: 145,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'text',
    status: 'passed',
    latencyMs: 89,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'text',
    status: 'passed',
    latencyMs: 112,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'text',
    status: 'blocked',
    blockedBy: 'pattern_matching',
    threatCategory: 'jailbreak',
    latencyMs: 67,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'audio',
    status: 'passed',
    latencyMs: 234,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
];

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

export function RecentRequests({ requests = mockRequests }: RecentRequestsProps) {
  return (
    <div className="dashboard-card">
      <div className="mb-6">
        <h2 className="section-header mb-1">Recent Requests</h2>
        <p className="text-sm text-steel-500">Latest API requests and their status</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-[rgba(59,130,246,0.1)]">
        <table className="w-full">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell">Type</th>
              <th className="table-header-cell">Details</th>
              <th className="table-header-cell text-right">Latency</th>
              <th className="table-header-cell text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center',
                        request.status === 'blocked' && 'bg-[rgba(239,68,68,0.1)]',
                        request.status === 'passed' && 'bg-[rgba(16,185,129,0.1)]',
                        request.status === 'error' && 'bg-[rgba(245,158,11,0.1)]'
                      )}
                    >
                      {request.status === 'blocked' ? (
                        <AlertTriangle className="h-4 w-4 text-danger" />
                      ) : (
                        <Shield className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <Badge
                      variant={request.status === 'blocked' ? 'destructive' : 'success'}
                      className="capitalize"
                    >
                      {request.status}
                    </Badge>
                  </div>
                </td>
                <td className="table-cell">
                  <Badge variant="secondary" className="capitalize">
                    {request.type}
                  </Badge>
                </td>
                <td className="table-cell">
                  {request.threatCategory ? (
                    <span className="text-sm text-steel-400">
                      {request.blockedBy?.replace('_', ' ')} - {request.threatCategory.replace('_', ' ')}
                    </span>
                  ) : (
                    <span className="text-sm text-steel-500">—</span>
                  )}
                </td>
                <td className="table-cell table-cell-numeric">
                  <span className="text-sm font-medium text-steel-100">{request.latencyMs}ms</span>
                </td>
                <td className="table-cell table-cell-numeric">
                  <div className="flex items-center gap-1 justify-end text-steel-500">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{formatTimeAgo(request.createdAt)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

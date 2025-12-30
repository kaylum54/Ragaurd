'use client';

import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
        <CardDescription>Latest API requests and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center',
                    request.status === 'blocked' && 'bg-danger/10',
                    request.status === 'passed' && 'bg-success/10',
                    request.status === 'error' && 'bg-warning/10'
                  )}
                >
                  {request.status === 'blocked' ? (
                    <AlertTriangle className="h-4 w-4 text-danger" />
                  ) : (
                    <Shield className="h-4 w-4 text-success" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={request.status === 'blocked' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {request.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {request.type}
                    </Badge>
                  </div>
                  {request.threatCategory && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {request.blockedBy?.replace('_', ' ')} - {request.threatCategory.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{request.latencyMs}ms</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(request.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

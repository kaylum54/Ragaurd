'use client';

import Link from 'next/link';
import { Target, Plus, Play, Clock, CheckCircle, XCircle, ArrowRight, Loader2, RotateCw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useRedteamScans, useRedteamStats, type RedteamScan } from '@/hooks/useRedteam';
import { useState } from 'react';

const getStatusIcon = (status: RedteamScan['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'running':
      return <Play className="h-4 w-4 text-primary-600 animate-pulse" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-danger" />;
    default:
      return <Clock className="h-4 w-4 text-warning" />;
  }
};

const getStatusBadge = (status: RedteamScan['status']) => {
  const variants: Record<RedteamScan['status'], string> = {
    completed: 'bg-success text-white',
    running: 'bg-primary-600 text-white',
    failed: 'bg-danger text-white',
    pending: 'bg-warning text-white',
  };
  return variants[status] || 'bg-slate-500 text-white';
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Red Team Testing</h1>
          <p className="text-muted-foreground">
            Automated security scanning and vulnerability testing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/dashboard/redteam/new">
              <Plus className="mr-2 h-4 w-4" />
              New Scan
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalScans}</div>
                <div className="text-sm text-muted-foreground">Total Scans</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completedScans}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-success">{stats.avgBlockRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Avg Block Rate</div>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            {statsLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalAttacks.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Attacks</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>
            View and manage your security scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : scans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scans yet. Create one to get started.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/redteam/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Scan
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Suite</TableHead>
                  <TableHead>Block Rate</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => {
                  const progress = scan.status === 'completed'
                    ? 100
                    : scan.totalAttacks > 0
                      ? ((scan.blockedAttacks + scan.passedAttacks) / scan.totalAttacks) * 100
                      : 0;

                  return (
                    <TableRow key={scan.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(scan.status)}
                          <span className="font-medium">{scan.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(scan.status)}>
                          {scan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                          {scan.targetEndpoint.length > 30
                            ? scan.targetEndpoint.substring(0, 30) + '...'
                            : scan.targetEndpoint}
                        </code>
                      </TableCell>
                      <TableCell className="capitalize">{scan.attackSuite}</TableCell>
                      <TableCell>
                        <span className={cn(
                          'font-medium',
                          scan.blockRate >= 99 && 'text-success',
                          scan.blockRate >= 95 && scan.blockRate < 99 && 'text-warning',
                          scan.blockRate < 95 && scan.blockRate > 0 && 'text-danger'
                        )}>
                          {scan.status === 'pending' ? '-' : `${scan.blockRate.toFixed(1)}%`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-2 w-24" />
                          <span className="text-xs text-muted-foreground">
                            {scan.blockedAttacks + scan.passedAttacks}/{scan.totalAttacks}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {scan.status === 'pending' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStart(scan.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger hover:text-danger"
                            onClick={() => setScanToDelete(scan)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/redteam/${scan.id}`}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!scanToDelete} onOpenChange={(open) => !open && setScanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{scanToDelete?.name}&quot;? This action cannot be undone
              and all scan results will be permanently lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-danger text-white hover:bg-danger/90"
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Scan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Attack Suites Info */}
      <div className="grid gap-6 md:grid-cols-3">
        {['basic', 'standard', 'comprehensive'].map((suite) => (
          <Card key={suite}>
            <CardHeader>
              <CardTitle className="capitalize">{suite}</CardTitle>
              <CardDescription>
                {suite === 'basic' && '50 attacks • ~5 min'}
                {suite === 'standard' && '200 attacks • ~15 min'}
                {suite === 'comprehensive' && '500+ attacks • ~45 min'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Prompt injection attacks</li>
                <li>• Jailbreak attempts</li>
                {suite !== 'basic' && <li>• Role manipulation</li>}
                {suite !== 'basic' && <li>• Data exfiltration</li>}
                {suite === 'comprehensive' && <li>• Custom payloads</li>}
                {suite === 'comprehensive' && <li>• Advanced evasion</li>}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

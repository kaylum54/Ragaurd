'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Plus, Play, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
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
import { cn } from '@/lib/utils';

interface Scan {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  targetEndpoint: string;
  attackSuite: string;
  totalAttacks: number;
  blockedAttacks: number;
  passedAttacks: number;
  blockRate: number;
  createdAt: string;
  completedAt: string | null;
}

// Mock data
const mockScans: Scan[] = [
  {
    id: '1',
    name: 'Production Security Audit',
    status: 'completed',
    targetEndpoint: 'https://api.example.com/chat',
    attackSuite: 'comprehensive',
    totalAttacks: 500,
    blockedAttacks: 497,
    passedAttacks: 3,
    blockRate: 99.4,
    createdAt: '2024-12-28T10:00:00Z',
    completedAt: '2024-12-28T10:45:00Z',
  },
  {
    id: '2',
    name: 'Weekly Scan',
    status: 'running',
    targetEndpoint: 'https://api.example.com/agent',
    attackSuite: 'standard',
    totalAttacks: 200,
    blockedAttacks: 156,
    passedAttacks: 4,
    blockRate: 97.5,
    createdAt: '2024-12-30T08:00:00Z',
    completedAt: null,
  },
  {
    id: '3',
    name: 'Quick Vulnerability Check',
    status: 'completed',
    targetEndpoint: 'https://api.example.com/voice',
    attackSuite: 'basic',
    totalAttacks: 50,
    blockedAttacks: 50,
    passedAttacks: 0,
    blockRate: 100,
    createdAt: '2024-12-27T14:00:00Z',
    completedAt: '2024-12-27T14:15:00Z',
  },
];

const getStatusIcon = (status: Scan['status']) => {
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

const getStatusBadge = (status: Scan['status']) => {
  const variants: Record<Scan['status'], string> = {
    completed: 'bg-success text-white',
    running: 'bg-primary-600 text-white',
    failed: 'bg-danger text-white',
    pending: 'bg-warning text-white',
  };
  return variants[status] || 'bg-slate-500 text-white';
};

export default function RedTeamPage() {
  const [scans] = useState<Scan[]>(mockScans);

  // Stats
  const totalScans = scans.length;
  const completedScans = scans.filter(s => s.status === 'completed').length;
  const avgBlockRate = scans.filter(s => s.status === 'completed')
    .reduce((acc, s) => acc + s.blockRate, 0) / completedScans || 0;
  const totalAttacks = scans.reduce((acc, s) => acc + s.totalAttacks, 0);

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
        <Button asChild>
          <Link href="/dashboard/redteam/new">
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalScans}</div>
            <div className="text-sm text-muted-foreground">Total Scans</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{completedScans}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">{avgBlockRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Avg Block Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalAttacks.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Attacks</div>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Suite</TableHead>
                <TableHead>Block Rate</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan) => {
                const progress = scan.status === 'completed'
                  ? 100
                  : ((scan.blockedAttacks + scan.passedAttacks) / scan.totalAttacks) * 100;

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
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
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
                        scan.blockRate < 95 && 'text-danger'
                      )}>
                        {scan.blockRate.toFixed(1)}%
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/redteam/${scan.id}`}>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Attack Suites */}
      <div className="grid gap-6 md:grid-cols-3">
        {['basic', 'standard', 'comprehensive'].map((suite) => (
          <Card key={suite}>
            <CardHeader>
              <CardTitle className="capitalize">{suite}</CardTitle>
              <CardDescription>
                {suite === 'basic' && '50 attacks • 5 min'}
                {suite === 'standard' && '200 attacks • 15 min'}
                {suite === 'comprehensive' && '500+ attacks • 45 min'}
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

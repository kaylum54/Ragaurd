'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getScanStatus,
  getScanResults,
  type ScanStatusResponse,
  type ScanResultsResponse,
  type AttackResult,
} from '@/lib/services/redteam/client';

export interface RedteamScan {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'queued';
  targetEndpoint: string;
  attackSuite: string;
  platform?: string;
  totalAttacks: number;
  blockedAttacks: number;
  passedAttacks: number;
  errorAttacks: number;
  blockRate: number;
  avgLatencyMs: number | null;
  config?: Record<string, unknown>;
  results?: Record<string, unknown>;
  reportJson?: Record<string, unknown>;
  errorMessage: string | null;
  garakJobId: string | null;
  pyritJobId: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  attacks?: AttackResult[];
}

export type { AttackResult } from '@/lib/services/redteam/client';

export interface ScanProgress {
  id: string;
  status: RedteamScan['status'];
  progress: {
    completed: number;
    total: number;
    blocked: number;
    passed: number;
    errors: number;
    percent: number;
  };
  blockRate: number;
  avgLatencyMs: number | null;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
}

export interface RedteamStats {
  totalScans: number;
  completedScans: number;
  runningScans: number;
  avgBlockRate: number;
  totalAttacks: number;
  totalBlocked: number;
}

interface CreateScanParams {
  name?: string;
  targetEndpoint: string;
  attackSuite: 'basic' | 'standard' | 'comprehensive';
  config?: Record<string, unknown>;
}

// Demo data for fallback
const demoScans: RedteamScan[] = [
  {
    id: 'demo-1',
    name: 'Production Security Audit',
    status: 'completed',
    targetEndpoint: 'https://api.example.com/chat',
    attackSuite: 'comprehensive',
    totalAttacks: 500,
    blockedAttacks: 497,
    passedAttacks: 3,
    errorAttacks: 0,
    blockRate: 99.4,
    avgLatencyMs: 145,
    errorMessage: null,
    garakJobId: null,
    pyritJobId: null,
    createdAt: '2024-12-28T10:00:00Z',
    startedAt: '2024-12-28T10:00:30Z',
    completedAt: '2024-12-28T10:45:00Z',
  },
  {
    id: 'demo-2',
    name: 'Weekly Scan',
    status: 'running',
    targetEndpoint: 'https://api.example.com/agent',
    attackSuite: 'standard',
    totalAttacks: 200,
    blockedAttacks: 156,
    passedAttacks: 4,
    errorAttacks: 0,
    blockRate: 97.5,
    avgLatencyMs: 120,
    errorMessage: null,
    garakJobId: null,
    pyritJobId: null,
    createdAt: '2024-12-30T08:00:00Z',
    startedAt: '2024-12-30T08:00:15Z',
    completedAt: null,
  },
  {
    id: 'demo-3',
    name: 'Quick Vulnerability Check',
    status: 'completed',
    targetEndpoint: 'https://api.example.com/voice',
    attackSuite: 'basic',
    totalAttacks: 50,
    blockedAttacks: 50,
    passedAttacks: 0,
    errorAttacks: 0,
    blockRate: 100,
    avgLatencyMs: 98,
    errorMessage: null,
    garakJobId: null,
    pyritJobId: null,
    createdAt: '2024-12-27T14:00:00Z',
    startedAt: '2024-12-27T14:00:10Z',
    completedAt: '2024-12-27T14:15:00Z',
  },
];

const demoStats: RedteamStats = {
  totalScans: 3,
  completedScans: 2,
  runningScans: 1,
  avgBlockRate: 98.97,
  totalAttacks: 750,
  totalBlocked: 703,
};

export function useRedteamScans() {
  const [scans, setScans] = useState<RedteamScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/redteam');

      if (!response.ok) {
        throw new Error('Failed to fetch scans');
      }

      const result = await response.json();
      setScans(result.scans || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching redteam scans:', err);
      // Use demo data as fallback
      setScans(demoScans);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScans();
  }, [fetchScans]);

  const createScan = async (params: CreateScanParams): Promise<RedteamScan | null> => {
    try {
      const response = await fetch('/api/redteam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to create scan');
      }

      const result = await response.json();
      const newScan = result.scan;

      setScans((prev) => [newScan, ...prev]);
      return newScan;
    } catch (err) {
      console.error('Error creating scan:', err);

      // Demo mode: create fake scan
      const attackCounts: Record<string, number> = {
        basic: 50,
        standard: 200,
        comprehensive: 500,
      };

      const demoScan: RedteamScan = {
        id: `demo-${Date.now()}`,
        name: params.name || `${params.attackSuite.charAt(0).toUpperCase() + params.attackSuite.slice(1)} Scan`,
        status: 'pending',
        targetEndpoint: params.targetEndpoint,
        attackSuite: params.attackSuite,
        totalAttacks: attackCounts[params.attackSuite] || 200,
        blockedAttacks: 0,
        passedAttacks: 0,
        errorAttacks: 0,
        blockRate: 0,
        avgLatencyMs: null,
        errorMessage: null,
        garakJobId: null,
        pyritJobId: null,
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
      };

      setScans((prev) => [demoScan, ...prev]);
      return demoScan;
    }
  };

  const startScan = async (id: string): Promise<{ success: boolean; error?: string; services?: { garak: boolean; pyrit: boolean } }> => {
    try {
      const response = await fetch(`/api/redteam/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to start scan' };
      }

      // Update local state
      setScans((prev) => prev.map((s) =>
        s.id === id ? { ...s, status: 'running' as const, startedAt: new Date().toISOString() } : s
      ));

      return { success: true, services: result.services };
    } catch (err) {
      console.error('Error starting scan:', err);
      // Demo mode: just update state
      setScans((prev) => prev.map((s) =>
        s.id === id ? { ...s, status: 'running' as const, startedAt: new Date().toISOString() } : s
      ));
      return { success: true };
    }
  };

  const cancelScan = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/redteam/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel scan');
      }

      // Update local state
      setScans((prev) => prev.map((s) =>
        s.id === id ? { ...s, status: 'cancelled' as const, completedAt: new Date().toISOString() } : s
      ));

      return true;
    } catch (err) {
      console.error('Error cancelling scan:', err);
      return false;
    }
  };

  const deleteScan = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/redteam/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete scan');
      }

      setScans((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting scan:', err);
      // Demo mode: just update state
      setScans((prev) => prev.filter((s) => s.id !== id));
      return true;
    }
  };

  return {
    scans,
    loading,
    error,
    refetch: fetchScans,
    createScan,
    startScan,
    cancelScan,
    deleteScan,
  };
}

export function useRedteamStats() {
  const [stats, setStats] = useState<RedteamStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/redteam?type=stats');

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const result = await response.json();
        setStats(result);
      } catch (err) {
        console.error('Error fetching redteam stats:', err);
        // Use demo stats as fallback
        setStats(demoStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats: stats || demoStats, loading };
}

const PROGRESS_POLL_INTERVAL = 3000; // 3 seconds

export function useRedteamScan(id: string) {
  const [scan, setScan] = useState<RedteamScan | null>(null);
  const [progress, setProgress] = useState<ScanProgress | null>(null);
  const [attacks, setAttacks] = useState<AttackResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scan from external Red Team API
  const fetchExternalScan = useCallback(async () => {
    try {
      const statusResponse = await getScanStatus(id);

      const scanData: RedteamScan = {
        id: statusResponse.scan_id,
        name: `${statusResponse.platform || 'Security'} Scan`,
        status: statusResponse.status,
        targetEndpoint: '',
        attackSuite: 'custom',
        platform: statusResponse.platform,
        totalAttacks: statusResponse.progress.total,
        blockedAttacks: statusResponse.progress.blocked,
        passedAttacks: statusResponse.progress.passed,
        errorAttacks: statusResponse.progress.errors,
        blockRate: statusResponse.block_rate,
        avgLatencyMs: null,
        errorMessage: null,
        garakJobId: null,
        pyritJobId: null,
        createdAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        completedAt: statusResponse.status === 'completed' ? new Date().toISOString() : null,
      };

      setScan(scanData);
      setProgress({
        id: statusResponse.scan_id,
        status: statusResponse.status,
        progress: {
          completed: statusResponse.progress.completed,
          total: statusResponse.progress.total,
          blocked: statusResponse.progress.blocked,
          passed: statusResponse.progress.passed,
          errors: statusResponse.progress.errors,
          percent: statusResponse.progress.total > 0
            ? (statusResponse.progress.completed / statusResponse.progress.total) * 100
            : 0,
        },
        blockRate: statusResponse.block_rate,
        avgLatencyMs: null,
        startedAt: new Date().toISOString(),
        completedAt: statusResponse.status === 'completed' ? new Date().toISOString() : null,
        errorMessage: null,
      });

      // If completed, fetch results
      if (statusResponse.status === 'completed') {
        try {
          const resultsResponse = await getScanResults(id);
          setAttacks(resultsResponse.attacks || []);
          setScan(prev => prev ? { ...prev, attacks: resultsResponse.attacks } : null);
        } catch (resultsErr) {
          console.error('Error fetching results:', resultsErr);
        }
      }

      return scanData;
    } catch (err) {
      console.error('Error fetching external scan:', err);
      throw err;
    }
  }, [id]);

  const fetchScan = useCallback(async () => {
    try {
      // Try external service first for real-time data
      const externalScan = await fetchExternalScan();
      setLoading(false);
      return externalScan;
    } catch (externalErr) {
      console.log('External fetch failed, trying local API:', externalErr);

      // Then try the local API
      try {
        const response = await fetch(`/api/redteam/${id}`);

        if (response.ok) {
          const result = await response.json();
          setScan(result.scan);
          setLoading(false);
          return result.scan;
        }
      } catch (localErr) {
        console.error('Error fetching scan from local API:', localErr);
      }

      // Check if it's a demo scan
      const demoScan = demoScans.find(s => s.id === id);
      if (demoScan) {
        setScan(demoScan);
        setLoading(false);
        return demoScan;
      }

      setError('Scan not found');
      setLoading(false);
      return null;
    }
  }, [id, fetchExternalScan]);

  const fetchProgress = useCallback(async () => {
    try {
      // Try external API first for real-time updates
      const statusResponse = await getScanStatus(id);

      const progressData: ScanProgress = {
        id: statusResponse.scan_id,
        status: statusResponse.status,
        progress: {
          completed: statusResponse.progress.completed,
          total: statusResponse.progress.total,
          blocked: statusResponse.progress.blocked,
          passed: statusResponse.progress.passed,
          errors: statusResponse.progress.errors,
          percent: statusResponse.progress.total > 0
            ? (statusResponse.progress.completed / statusResponse.progress.total) * 100
            : 0,
        },
        blockRate: statusResponse.block_rate,
        avgLatencyMs: null,
        startedAt: null,
        completedAt: statusResponse.status === 'completed' ? new Date().toISOString() : null,
        errorMessage: null,
      };

      setProgress(progressData);

      // Update scan with progress data
      setScan((prev) => prev ? {
        ...prev,
        status: statusResponse.status,
        blockedAttacks: statusResponse.progress.blocked,
        passedAttacks: statusResponse.progress.passed,
        errorAttacks: statusResponse.progress.errors,
        totalAttacks: statusResponse.progress.total,
        blockRate: statusResponse.block_rate,
        completedAt: statusResponse.status === 'completed' ? new Date().toISOString() : null,
      } : null);

      // Fetch attack results if completed
      if (statusResponse.status === 'completed') {
        try {
          const resultsResponse = await getScanResults(id);
          setAttacks(resultsResponse.attacks || []);
          setScan(prev => prev ? { ...prev, attacks: resultsResponse.attacks } : null);
        } catch (resultsErr) {
          console.error('Error fetching results:', resultsErr);
        }
      }

      return progressData;
    } catch (err) {
      // Fallback to local API
      try {
        const response = await fetch(`/api/redteam/${id}/progress`);

        if (!response.ok) {
          return null;
        }

        const progressData = await response.json();
        setProgress(progressData);

        // Update scan with progress data
        setScan((prev) => prev ? {
          ...prev,
          status: progressData.status,
          blockedAttacks: progressData.progress.blocked,
          passedAttacks: progressData.progress.passed,
          errorAttacks: progressData.progress.errors,
          blockRate: progressData.blockRate,
          avgLatencyMs: progressData.avgLatencyMs,
          completedAt: progressData.completedAt,
          errorMessage: progressData.errorMessage,
        } : null);

        return progressData;
      } catch {
        console.error('Error fetching progress:', err);
        return null;
      }
    }
  }, [id]);

  // Initial fetch
  useEffect(() => {
    if (id) {
      fetchScan();
    }
  }, [id, fetchScan]);

  // Progress polling for running/queued scans
  useEffect(() => {
    if (!scan || (scan.status !== 'running' && scan.status !== 'queued')) {
      return;
    }

    const pollProgress = async () => {
      const progressData = await fetchProgress();

      // Stop polling if scan is no longer running
      if (progressData && progressData.status !== 'running' && progressData.status !== 'queued') {
        // Refetch full scan data
        fetchScan();
      }
    };

    // Initial poll
    pollProgress();

    // Set up interval
    const interval = setInterval(pollProgress, PROGRESS_POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [scan?.status, fetchProgress, fetchScan]);

  return { scan, progress, attacks, loading, error, refetch: fetchScan };
}

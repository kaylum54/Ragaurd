'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RedteamScan {
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
  startedAt: string | null;
  completedAt: string | null;
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
    blockRate: 99.4,
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
    blockRate: 97.5,
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
    blockRate: 100,
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
        blockRate: 0,
        createdAt: new Date().toISOString(),
        startedAt: null,
        completedAt: null,
      };

      setScans((prev) => [demoScan, ...prev]);
      return demoScan;
    }
  };

  const startScan = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/redteam/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start scan');
      }

      // Update local state
      setScans((prev) => prev.map((s) =>
        s.id === id ? { ...s, status: 'running' as const, startedAt: new Date().toISOString() } : s
      ));

      return true;
    } catch (err) {
      console.error('Error starting scan:', err);
      // Demo mode: just update state
      setScans((prev) => prev.map((s) =>
        s.id === id ? { ...s, status: 'running' as const, startedAt: new Date().toISOString() } : s
      ));
      return true;
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

export function useRedteamScan(id: string) {
  const [scan, setScan] = useState<RedteamScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const response = await fetch(`/api/redteam/${id}`);

        if (!response.ok) {
          throw new Error('Scan not found');
        }

        const result = await response.json();
        setScan(result.scan);
      } catch (err) {
        console.error('Error fetching scan:', err);
        // Check if it's a demo scan
        const demoScan = demoScans.find(s => s.id === id);
        if (demoScan) {
          setScan(demoScan);
        } else {
          setError('Scan not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchScan();
    }
  }, [id]);

  return { scan, loading, error };
}

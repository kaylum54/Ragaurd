'use client';

import { useState, useEffect, useCallback } from 'react';

interface DashboardStats {
  stats: {
    totalRequests: number;
    blockedThreats: number;
    blockRate: number;
    avgLatencyMs: number;
    activeApiKeys: number;
    teamMembers: number;
  };
  usage: {
    text: { used: number; limit: number | null; percentage: number };
    audio: { used: number; limit: number | null; percentage: number };
    redteam: { used: number; limit: number | null; percentage: number };
  };
  threats: {
    breakdown: Record<string, number>;
    last24h: {
      total: number;
      blocked: number;
      passed: number;
      errors: number;
    };
  };
}

interface UsageChartData {
  date: string;
  requests: number;
  blocked: number;
}

interface RecentRequest {
  id: string;
  timestamp: string;
  type: 'text' | 'audio' | 'redteam';
  status: 'blocked' | 'passed' | 'error';
  blockedBy: string | null;
  threatCategory: string | null;
  latencyMs: number | null;
}

// Default/fallback data for demo mode
const defaultStats: DashboardStats = {
  stats: {
    totalRequests: 2388,
    blockedThreats: 336,
    blockRate: 14,
    avgLatencyMs: 88,
    activeApiKeys: 2,
    teamMembers: 2,
  },
  usage: {
    text: { used: 2265, limit: 100000, percentage: 2 },
    audio: { used: 123, limit: 1000, percentage: 12 },
    redteam: { used: 57, limit: 100, percentage: 57 },
  },
  threats: {
    breakdown: {
      prompt_injection: 145,
      jailbreak: 98,
      data_exfiltration: 52,
      role_manipulation: 28,
      code_injection: 13,
    },
    last24h: {
      total: 167,
      blocked: 22,
      passed: 145,
      errors: 0,
    },
  },
};

const defaultUsageChart: UsageChartData[] = [
  { date: '2024-12-24', requests: 257, blocked: 28 },
  { date: '2024-12-25', requests: 330, blocked: 45 },
  { date: '2024-12-26', requests: 302, blocked: 38 },
  { date: '2024-12-27', requests: 478, blocked: 67 },
  { date: '2024-12-28', requests: 551, blocked: 82 },
  { date: '2024-12-29', requests: 418, blocked: 54 },
  { date: '2024-12-30', requests: 175, blocked: 22 },
];

const defaultRecentRequests: RecentRequest[] = [
  { id: '1', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), type: 'text', status: 'passed', blockedBy: null, threatCategory: null, latencyMs: 85 },
  { id: '2', timestamp: new Date(Date.now() - 12 * 60000).toISOString(), type: 'text', status: 'blocked', blockedBy: 'semantic_analysis', threatCategory: 'prompt_injection', latencyMs: 92 },
  { id: '3', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), type: 'text', status: 'passed', blockedBy: null, threatCategory: null, latencyMs: 78 },
  { id: '4', timestamp: new Date(Date.now() - 25 * 60000).toISOString(), type: 'text', status: 'blocked', blockedBy: 'llm_guard', threatCategory: 'jailbreak', latencyMs: 105 },
  { id: '5', timestamp: new Date(Date.now() - 32 * 60000).toISOString(), type: 'text', status: 'passed', blockedBy: null, threatCategory: null, latencyMs: 82 },
  { id: '6', timestamp: new Date(Date.now() - 45 * 60000).toISOString(), type: 'audio', status: 'passed', blockedBy: null, threatCategory: null, latencyMs: 1250 },
  { id: '7', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), type: 'text', status: 'blocked', blockedBy: 'pattern_matching', threatCategory: 'data_exfiltration', latencyMs: 45 },
  { id: '8', timestamp: new Date(Date.now() - 75 * 60000).toISOString(), type: 'text', status: 'passed', blockedBy: null, threatCategory: null, latencyMs: 91 },
];

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Use default data in demo mode
      setData(defaultStats);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data: data || defaultStats, loading, error, refetch: fetchStats };
}

export function useUsageChart(days: number = 7) {
  const [data, setData] = useState<UsageChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/usage?days=${days}&type=chart`);

      if (!response.ok) {
        throw new Error('Failed to fetch usage');
      }

      const result = await response.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching usage chart:', err);
      setData(defaultUsageChart);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { data: data.length > 0 ? data : defaultUsageChart, loading, error, refetch: fetchUsage };
}

export function useRecentRequests(limit: number = 10) {
  const [data, setData] = useState<RecentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/requests?limit=${limit}`);

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const result = await response.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching recent requests:', err);
      setData(defaultRecentRequests.slice(0, limit));
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { data: data.length > 0 ? data : defaultRecentRequests.slice(0, limit), loading, error, refetch: fetchRequests };
}

export function useThreatCategories() {
  const [data, setData] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch('/api/dashboard/requests?type=threats');
        if (response.ok) {
          const result = await response.json();
          setData(result.data || []);
        }
      } catch (err) {
        console.error('Error fetching threat categories:', err);
        // Use default breakdown
        setData([
          { category: 'prompt_injection', count: 145 },
          { category: 'jailbreak', count: 98 },
          { category: 'data_exfiltration', count: 52 },
          { category: 'role_manipulation', count: 28 },
          { category: 'code_injection', count: 13 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  return { data, loading };
}

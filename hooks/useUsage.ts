'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UsageStats {
  period: { start: string; end: string };
  text: { used: number; limit: number };
  audio: { used: number; limit: number };
  redteam: { used: number; limit: number };
  blocked: number;
  passed: number;
  avgLatency: number;
}

export interface DailyStats {
  day: string;
  date: string;
  requests: number;
  blocked: number;
}

// Default demo data
const defaultUsageStats: UsageStats = {
  period: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
  text: { used: 45230, limit: 150000 },
  audio: { used: 12456, limit: 50000 },
  redteam: { used: 234, limit: 1000 },
  blocked: 1247,
  passed: 56685,
  avgLatency: 156,
};

const defaultDailyStats: DailyStats[] = [
  { day: 'Mon', date: '2024-12-23', requests: 8234, blocked: 156 },
  { day: 'Tue', date: '2024-12-24', requests: 7891, blocked: 143 },
  { day: 'Wed', date: '2024-12-25', requests: 9012, blocked: 189 },
  { day: 'Thu', date: '2024-12-26', requests: 8567, blocked: 167 },
  { day: 'Fri', date: '2024-12-27', requests: 7234, blocked: 134 },
  { day: 'Sat', date: '2024-12-28', requests: 4123, blocked: 78 },
  { day: 'Sun', date: '2024-12-29', requests: 3891, blocked: 72 },
];

export function useUsageStats() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch usage stats');
      }

      const result = await response.json();

      // Transform API response to UsageStats format
      const transformedStats: UsageStats = {
        period: {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0],
        },
        text: result.usage?.text || { used: 0, limit: 150000 },
        audio: result.usage?.audio || { used: 0, limit: 50000 },
        redteam: result.usage?.redteam || { used: 0, limit: 1000 },
        blocked: result.stats?.blockedThreats || 0,
        passed: (result.stats?.totalRequests || 0) - (result.stats?.blockedThreats || 0),
        avgLatency: result.stats?.avgLatencyMs || 0,
      };

      setStats(transformedStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching usage stats:', err);
      setStats(defaultUsageStats);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats: stats || defaultUsageStats, loading, error, refetch: fetchStats };
}

export function useDailyBreakdown(days: number = 7) {
  const [data, setData] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const response = await fetch(`/api/dashboard/usage?days=${days}&type=chart`);

        if (!response.ok) {
          throw new Error('Failed to fetch daily stats');
        }

        const result = await response.json();

        // Transform to DailyStats format
        const dailyData: DailyStats[] = (result.data || []).map((item: { date: string; requests: number; blocked: number }) => {
          const date = new Date(item.date);
          const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return {
            day: dayNames[date.getDay()],
            date: item.date,
            requests: item.requests,
            blocked: item.blocked,
          };
        });

        setData(dailyData);
      } catch (err) {
        console.error('Error fetching daily breakdown:', err);
        setData(defaultDailyStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDaily();
  }, [days]);

  return { data: data.length > 0 ? data : defaultDailyStats, loading };
}

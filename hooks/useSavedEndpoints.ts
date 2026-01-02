'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SavedEndpoint, SavedEndpointInsert, SavedEndpointUpdate } from '@/types/database';

export function useSavedEndpoints() {
  const [endpoints, setEndpoints] = useState<SavedEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEndpoints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/endpoints');
      if (!res.ok) {
        throw new Error('Failed to fetch endpoints');
      }
      const data = await res.json();
      setEndpoints(data.endpoints || []);
    } catch (err) {
      console.error('Error fetching endpoints:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch endpoints');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  const createEndpoint = useCallback(async (endpoint: SavedEndpointInsert): Promise<SavedEndpoint | null> => {
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create endpoint');
      }

      const data = await res.json();
      setEndpoints(prev => [data.endpoint, ...prev]);
      return data.endpoint;
    } catch (err) {
      console.error('Error creating endpoint:', err);
      setError(err instanceof Error ? err.message : 'Failed to create endpoint');
      return null;
    }
  }, []);

  const updateEndpoint = useCallback(async (id: string, updates: SavedEndpointUpdate): Promise<SavedEndpoint | null> => {
    try {
      const res = await fetch(`/api/endpoints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update endpoint');
      }

      const data = await res.json();
      setEndpoints(prev => prev.map(ep => ep.id === id ? data.endpoint : ep));
      return data.endpoint;
    } catch (err) {
      console.error('Error updating endpoint:', err);
      setError(err instanceof Error ? err.message : 'Failed to update endpoint');
      return null;
    }
  }, []);

  const deleteEndpoint = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/endpoints/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete endpoint');
      }

      setEndpoints(prev => prev.filter(ep => ep.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting endpoint:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete endpoint');
      return false;
    }
  }, []);

  return {
    endpoints,
    loading,
    error,
    refetch: fetchEndpoints,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
  };
}

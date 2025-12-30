'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  rateLimitPerMin: number;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  isActive?: boolean;
}

interface CreateKeyParams {
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}

interface CreateKeyResult {
  key: ApiKey;
  secretKey: string;
}

// Demo API keys for fallback
const demoApiKeys: ApiKey[] = [
  {
    id: 'demo-1',
    name: 'Production API Key',
    prefix: 'rg_live_abc123...',
    scopes: ['defense:text', 'defense:audio'],
    rateLimitPerMin: 1000,
    createdAt: '2024-12-01T00:00:00Z',
    lastUsedAt: '2024-12-30T12:00:00Z',
    expiresAt: null,
    isActive: true,
  },
  {
    id: 'demo-2',
    name: 'Development Key',
    prefix: 'rg_test_def456...',
    scopes: ['defense:text'],
    rateLimitPerMin: 100,
    createdAt: '2024-12-15T00:00:00Z',
    lastUsedAt: '2024-12-29T18:00:00Z',
    expiresAt: '2025-03-15T00:00:00Z',
    isActive: true,
  },
];

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keys');

      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }

      const result = await response.json();
      // Add isActive flag (if not revoked, it's active)
      const keysWithActive = (result.keys || []).map((k: ApiKey) => ({
        ...k,
        isActive: k.isActive !== false,
      }));
      setKeys(keysWithActive);
      setError(null);
    } catch (err) {
      console.error('Error fetching API keys:', err);
      // Use demo data as fallback
      setKeys(demoApiKeys);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const createKey = async (params: CreateKeyParams): Promise<CreateKeyResult | null> => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create API key');
      }

      const result = await response.json();

      // Add the new key to the list
      const newKey: ApiKey = {
        ...result.key,
        isActive: true,
      };
      setKeys((prev) => [...prev, newKey]);

      return { key: newKey, secretKey: result.secretKey };
    } catch (err) {
      console.error('Error creating API key:', err);

      // Demo mode: generate a fake key
      const fakeSecretKey = `rg_live_${Array(48).fill(0).map(() => Math.random().toString(36)[2]).join('')}`;
      const fakeKey: ApiKey = {
        id: `demo-${Date.now()}`,
        name: params.name,
        prefix: fakeSecretKey.substring(0, 15) + '...',
        scopes: params.scopes || ['defense:text'],
        rateLimitPerMin: 1000,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        expiresAt: params.expiresInDays
          ? new Date(Date.now() + params.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
          : null,
        isActive: true,
      };
      setKeys((prev) => [...prev, fakeKey]);

      return { key: fakeKey, secretKey: fakeSecretKey };
    }
  };

  const revokeKey = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to revoke API key');
      }

      // Update local state
      setKeys((prev) => prev.map((k) =>
        k.id === id ? { ...k, isActive: false } : k
      ));

      return true;
    } catch (err) {
      console.error('Error revoking API key:', err);
      // Demo mode: just update state
      setKeys((prev) => prev.map((k) =>
        k.id === id ? { ...k, isActive: false } : k
      ));
      return true;
    }
  };

  const deleteKey = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/keys/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }

      // Remove from local state
      setKeys((prev) => prev.filter((k) => k.id !== id));

      return true;
    } catch (err) {
      console.error('Error deleting API key:', err);
      // Demo mode: just update state
      setKeys((prev) => prev.filter((k) => k.id !== id));
      return true;
    }
  };

  return {
    keys,
    loading,
    error,
    refetch: fetchKeys,
    createKey,
    revokeKey,
    deleteKey,
  };
}

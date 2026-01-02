'use client';

import { useState } from 'react';
import { Plus, Copy, Check, Trash2, Shield, Loader2, RotateCw, AlertTriangle, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApiKeys, type ApiKey } from '@/hooks/useApiKeys';

export default function ApiKeysPage() {
  const { keys, loading, createKey, revokeKey, deleteKey, refetch } = useApiKeys();
  const [showNewKey, setShowNewKey] = useState(false);
  const [newSecretKey, setNewSecretKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyExpiry, setKeyExpiry] = useState('never');
  const [creating, setCreating] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [revoking, setRevoking] = useState(false);

  const handleCreateKey = async () => {
    setCreating(true);
    try {
      const expiresInDays = getDaysFromExpiry(keyExpiry);
      const result = await createKey({
        name: keyName || 'Unnamed Key',
        scopes: ['defense:text', 'defense:audio'],
        expiresInDays: expiresInDays > 0 ? expiresInDays : undefined,
      });

      if (result) {
        setNewSecretKey(result.secretKey);
      }
    } finally {
      setCreating(false);
    }
  };

  const getDaysFromExpiry = (expiry: string): number => {
    switch (expiry) {
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 0;
    }
  };

  const copyKey = () => {
    if (newSecretKey) {
      navigator.clipboard.writeText(newSecretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevokeKey = async () => {
    if (!keyToRevoke) return;
    setRevoking(true);
    try {
      await revokeKey(keyToRevoke.id);
      setKeyToRevoke(null);
    } finally {
      setRevoking(false);
    }
  };

  const resetDialog = () => {
    setShowNewKey(false);
    setNewSecretKey(null);
    setKeyName('');
    setKeyExpiry('never');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const activeKeys = keys.filter(k => k.isActive !== false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="dash-page-title">API Keys</h1>
          <p className="dash-page-subtitle">
            Manage your API keys for authentication
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="dash-btn dash-btn-secondary"
          >
            <RotateCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowNewKey(true)}
            className="dash-btn dash-btn-primary"
          >
            <Plus className="h-4 w-4" />
            Create API Key
          </button>
        </div>
      </div>

      {/* Keys Table */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Your API Keys</span>
          <span className="text-xs text-dash-text-muted">
            {activeKeys.length} active · {keys.length} total
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-dash-text-muted" />
          </div>
        ) : keys.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-dash-accent/10 w-fit mx-auto mb-4">
              <Key className="h-8 w-8 text-dash-accent" />
            </div>
            <p className="text-dash-text-secondary mb-2">No API keys yet</p>
            <p className="text-sm text-dash-text-muted">Create one to get started with the API</p>
          </div>
        ) : (
          <div className="overflow-x-auto dash-scrollbar">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Scopes</th>
                  <th>Last Used</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th className="w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className={cn('group', key.isActive === false && 'opacity-50')}>
                    <td className="font-medium text-dash-text-primary">{key.name}</td>
                    <td>
                      <code className="text-sm bg-white/[0.05] px-2 py-1 rounded font-mono text-dash-text-secondary">
                        {key.prefix}
                      </code>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(key.scopes || []).map((scope) => (
                          <span key={scope} className="dash-badge dash-badge-info">
                            {scope.replace(':', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-dash-text-muted">
                      {key.lastUsedAt ? formatDate(key.lastUsedAt) : 'Never'}
                    </td>
                    <td className="text-dash-text-muted">
                      {key.expiresAt ? formatDate(key.expiresAt) : 'Never'}
                    </td>
                    <td>
                      {key.isActive !== false ? (
                        <span className="dash-badge dash-badge-success">Active</span>
                      ) : (
                        <span className="dash-badge bg-white/[0.1] text-dash-text-muted border-white/[0.1]">Revoked</span>
                      )}
                    </td>
                    <td>
                      {key.isActive !== false && (
                        <button
                          className="p-2 rounded-lg text-dash-text-muted hover:text-dash-danger hover:bg-dash-danger/10 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={() => setKeyToRevoke(key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Security Tips */}
      <div className="dash-card">
        <div className="dash-card-header">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-dash-accent" />
            <span className="dash-card-title">Security Best Practices</span>
          </div>
        </div>
        <div className="dash-card-body">
          <ul className="space-y-3">
            {[
              'Never share your API keys or commit them to version control',
              'Use environment variables to store your keys securely',
              'Rotate your keys regularly and revoke unused ones',
              'Use different keys for development and production',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-dash-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-dash-text-secondary">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Start */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">Quick Start</span>
          <span className="text-xs text-dash-text-muted">Use your API key to make requests</span>
        </div>
        <div className="dash-card-body">
          <div className="bg-dash-bg-primary rounded-lg p-4 overflow-x-auto border border-white/[0.06]">
            <pre className="text-sm text-dash-text-secondary font-mono">
              <code>{`curl -X POST https://api.ragaurd.com/v1/defend \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input": "Your text to analyze"}'`}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Create Key Dialog */}
      {showNewKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-dash-bg-tertiary rounded-lg border border-white/[0.1] w-full max-w-md mx-4 shadow-dash-lg">
            {!newSecretKey ? (
              <>
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <h3 className="text-lg font-semibold text-dash-text-primary">Create New API Key</h3>
                  <p className="text-sm text-dash-text-muted mt-1">Generate a new API key for your application</p>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label className="dash-card-title block mb-2">Key Name</label>
                    <input
                      placeholder="e.g., Production API Key"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      className="dash-input"
                    />
                  </div>
                  <div>
                    <label className="dash-card-title block mb-2">Expiration</label>
                    <select
                      value={keyExpiry}
                      onChange={(e) => setKeyExpiry(e.target.value)}
                      className="dash-input"
                    >
                      <option value="30d">30 days</option>
                      <option value="90d">90 days</option>
                      <option value="1y">1 year</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end px-6 py-4 bg-white/[0.02] border-t border-white/[0.06]">
                  <button onClick={resetDialog} className="dash-btn dash-btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleCreateKey} disabled={creating} className="dash-btn dash-btn-primary">
                    {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Key
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <h3 className="text-lg font-semibold text-dash-text-primary">API Key Created</h3>
                  <p className="text-sm text-dash-text-muted mt-1">Copy your new API key now. You won't be able to see it again!</p>
                </div>
                <div className="px-6 py-4">
                  <div className="p-3 rounded-lg bg-dash-warning/10 border border-dash-warning/30 mb-4">
                    <div className="flex items-center gap-2 text-dash-warning">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">Important</span>
                    </div>
                    <p className="text-sm text-dash-text-secondary mt-1">
                      This is the only time you'll see this key. Store it securely.
                    </p>
                  </div>
                  <div className="relative">
                    <code className="block p-4 bg-dash-bg-primary rounded-lg text-sm break-all font-mono text-dash-text-primary border border-white/[0.06]">
                      {newSecretKey}
                    </code>
                    <button
                      className="absolute top-2 right-2 p-2 rounded-lg hover:bg-white/[0.1] transition-colors"
                      onClick={copyKey}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-dash-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-dash-text-muted" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end px-6 py-4 bg-white/[0.02] border-t border-white/[0.06]">
                  <button onClick={resetDialog} className="dash-btn dash-btn-primary">
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      {keyToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-dash-bg-tertiary rounded-lg border border-white/[0.1] w-full max-w-md mx-4 shadow-dash-lg">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-dash-text-primary">Revoke API Key</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-dash-text-secondary">
                Are you sure you want to revoke "<span className="text-dash-text-primary font-medium">{keyToRevoke.name}</span>"?
                This action cannot be undone and will immediately stop all requests using this key.
              </p>
            </div>
            <div className="flex gap-3 justify-end px-6 py-4 bg-white/[0.02] border-t border-white/[0.06]">
              <button onClick={() => setKeyToRevoke(null)} className="dash-btn dash-btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleRevokeKey}
                disabled={revoking}
                className="dash-btn bg-dash-danger text-white hover:bg-red-600"
              >
                {revoking && <Loader2 className="h-4 w-4 animate-spin" />}
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

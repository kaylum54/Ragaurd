'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Shield,
  ShieldOff,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mic,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttackResult {
  payload: string;
  blocked: boolean;
  blockedBy: string | null;
  agentResponse: string | null;
  suspiciousResponse: boolean;
  latencyMs: number;
  error?: string;
}

interface TestSummary {
  mode: string;
  totalAttacks: number;
  blocked: number;
  passed: number;
  suspiciousResponses: number;
  blockRate: number;
  vulnerabilityRate: number;
}

export default function TestEndpointPage() {
  const [agentId, setAgentId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [mode, setMode] = useState<'direct' | 'protected'>('direct');
  const [attackCount, setAttackCount] = useState(5);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<AttackResult[] | null>(null);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    if (!agentId || !apiKey) {
      setError('Please enter both Agent ID and API Key');
      return;
    }

    setTesting(true);
    setError(null);
    setResults(null);
    setSummary(null);

    try {
      const response = await fetch('/api/redteam/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          apiKey,
          mode,
          attackCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Test failed');
      }

      setResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/redteam"
          className="inline-flex items-center text-sm text-dash-text-muted hover:text-dash-text-primary mb-4 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Red Team
        </Link>
        <h1 className="dash-page-title flex items-center gap-3">
          <Mic className="h-8 w-8 text-dash-accent" />
          Test Voice Agent
        </h1>
        <p className="dash-page-subtitle">
          Run prompt injection attacks against your ElevenLabs conversational agent
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration */}
        <div className="space-y-6">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Agent Configuration</span>
            </div>
            <div className="dash-card-body space-y-4">
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  ElevenLabs Agent ID *
                </label>
                <input
                  type="text"
                  placeholder="agent_xxxxxxxxxxxx"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="dash-input font-mono"
                />
                <p className="text-xs text-dash-text-muted mt-1">
                  Found in your ElevenLabs dashboard under Conversational AI
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  ElevenLabs API Key *
                </label>
                <input
                  type="password"
                  placeholder="Your ElevenLabs API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="dash-input font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  Test Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('direct')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 transition-colors',
                      mode === 'direct'
                        ? 'border-dash-danger bg-dash-danger/10 text-dash-danger'
                        : 'border-dash-border bg-dash-bg-secondary text-dash-text-secondary hover:border-dash-border-hover'
                    )}
                  >
                    <ShieldOff className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Direct</div>
                      <div className="text-xs opacity-75">No protection (baseline)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setMode('protected')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 transition-colors',
                      mode === 'protected'
                        ? 'border-dash-success bg-dash-success/10 text-dash-success'
                        : 'border-dash-border bg-dash-bg-secondary text-dash-text-secondary hover:border-dash-border-hover'
                    )}
                  >
                    <Shield className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Protected</div>
                      <div className="text-xs opacity-75">Via RAGuard</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">
                  Number of Attacks: {attackCount}
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={attackCount}
                  onChange={(e) => setAttackCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-dash-text-muted mt-1">
                  <span>Quick (1)</span>
                  <span>Full (20)</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-dash-danger/10 border-2 border-dash-danger/30 text-dash-danger text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={runTest}
                disabled={testing || !agentId || !apiKey}
                className="dash-btn dash-btn-primary w-full"
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running {attackCount} attacks...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Test
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Test Summary</span>
                <span className={cn(
                  'dash-badge',
                  mode === 'protected' ? 'dash-badge-success' : 'dash-badge-warning'
                )}>
                  {mode === 'protected' ? 'Protected' : 'Direct'}
                </span>
              </div>
              <div className="dash-card-body">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                    <div className="dash-stats-value text-dash-success">
                      {summary.blockRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-dash-text-muted uppercase tracking-wider mt-1">
                      Block Rate
                    </div>
                  </div>
                  <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                    <div className={cn(
                      'dash-stats-value',
                      summary.vulnerabilityRate > 0 ? 'text-dash-danger' : 'text-dash-success'
                    )}>
                      {summary.vulnerabilityRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-dash-text-muted uppercase tracking-wider mt-1">
                      Vulnerability Rate
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-dash-text-muted">Total Attacks</span>
                    <span className="font-bold text-dash-text-primary">{summary.totalAttacks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-muted">Blocked by RAGuard</span>
                    <span className="font-bold text-dash-success">{summary.blocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-muted">Reached Agent</span>
                    <span className="font-bold text-dash-warning">{summary.passed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dash-text-muted">Suspicious Responses</span>
                    <span className={cn(
                      'font-bold',
                      summary.suspiciousResponses > 0 ? 'text-dash-danger' : 'text-dash-text-primary'
                    )}>
                      {summary.suspiciousResponses}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Attack Results</span>
            {results && (
              <span className="text-xs text-dash-text-muted">
                {results.length} attacks
              </span>
            )}
          </div>
          <div className="dash-card-body p-0">
            {!results && !testing && (
              <div className="text-center py-16 text-dash-text-muted">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">No test results yet</p>
                <p className="text-xs mt-1">Configure and run a test to see results</p>
              </div>
            )}

            {testing && (
              <div className="text-center py-16">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-dash-accent" />
                <p className="text-sm font-medium text-dash-text-primary">Running attacks...</p>
                <p className="text-xs text-dash-text-muted mt-1">This may take a few minutes</p>
              </div>
            )}

            {results && (
              <div className="divide-y divide-dash-border max-h-[600px] overflow-y-auto dash-scrollbar">
                {results.map((result, index) => (
                  <div key={index} className="p-4 hover:bg-dash-bg-hover transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-1.5 shrink-0',
                        result.blocked
                          ? 'bg-dash-success/20'
                          : result.suspiciousResponse
                          ? 'bg-dash-danger/20'
                          : 'bg-dash-warning/20'
                      )}>
                        {result.blocked ? (
                          <CheckCircle className="h-4 w-4 text-dash-success" />
                        ) : result.suspiciousResponse ? (
                          <XCircle className="h-4 w-4 text-dash-danger" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-dash-warning" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            'text-xs font-bold uppercase',
                            result.blocked
                              ? 'text-dash-success'
                              : result.suspiciousResponse
                              ? 'text-dash-danger'
                              : 'text-dash-warning'
                          )}>
                            {result.blocked
                              ? 'Blocked'
                              : result.suspiciousResponse
                              ? 'Vulnerable'
                              : 'Passed'}
                          </span>
                          {result.blockedBy && (
                            <span className="text-xs text-dash-text-muted">
                              by {result.blockedBy}
                            </span>
                          )}
                          <span className="text-xs text-dash-text-muted ml-auto">
                            {result.latencyMs}ms
                          </span>
                        </div>
                        <p className="text-sm text-dash-text-secondary font-medium mb-2">
                          &ldquo;{result.payload}&rdquo;
                        </p>
                        {result.agentResponse && (
                          <div className="mt-2 p-2 bg-dash-bg-tertiary border border-dash-border text-xs text-dash-text-muted">
                            <span className="font-bold text-dash-text-secondary">Agent: </span>
                            {result.agentResponse.substring(0, 200)}
                            {result.agentResponse.length > 200 && '...'}
                          </div>
                        )}
                        {result.error && (
                          <p className="text-xs text-dash-danger mt-1">{result.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">How It Works</span>
        </div>
        <div className="dash-card-body">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-dash-danger flex items-center gap-2 mb-2">
                <ShieldOff className="h-4 w-4" />
                Direct Mode (Baseline)
              </h3>
              <p className="text-sm text-dash-text-secondary">
                Attack payloads are sent directly to your ElevenLabs agent without any protection.
                This reveals your agent&apos;s inherent vulnerabilities to prompt injection attacks.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-dash-success flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                Protected Mode (RAGuard)
              </h3>
              <p className="text-sm text-dash-text-secondary">
                Attacks are first analyzed by RAGuard&apos;s defense layer. Malicious prompts are blocked
                before reaching your agent, showing how RAGuard protects your voice AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

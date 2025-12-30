'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Target, Loader2, Shield, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRedteamScans, useRedteamStats } from '@/hooks/useRedteam';

const attackSuites = [
  {
    id: 'basic' as const,
    name: 'Basic',
    description: 'Quick vulnerability check',
    attacks: 50,
    duration: '~5 min',
    features: ['Prompt injection', 'Jailbreak attempts', 'Role confusion'],
  },
  {
    id: 'standard' as const,
    name: 'Standard',
    description: 'Comprehensive security scan',
    attacks: 200,
    duration: '~15 min',
    features: ['All basic attacks', 'Data exfiltration', 'Context manipulation', 'Multi-turn attacks'],
    recommended: true,
  },
  {
    id: 'comprehensive' as const,
    name: 'Comprehensive',
    description: 'Full security audit',
    attacks: 500,
    duration: '~45 min',
    features: ['All standard attacks', 'Advanced evasion', 'Custom payloads', 'Edge cases', 'Fuzzing'],
  },
];

export default function NewScanPage() {
  const router = useRouter();
  const { createScan } = useRedteamScans();
  const { stats, loading: statsLoading } = useRedteamStats();
  const [name, setName] = useState('');
  const [targetEndpoint, setTargetEndpoint] = useState('');
  const [selectedSuite, setSelectedSuite] = useState<'basic' | 'standard' | 'comprehensive'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!targetEndpoint) {
      setError('Please enter a target endpoint');
      return;
    }

    // Validate URL
    try {
      new URL(targetEndpoint);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const scan = await createScan({
        name: name || undefined,
        targetEndpoint,
        attackSuite: selectedSuite,
      });

      if (scan) {
        router.push('/dashboard/redteam');
      }
    } catch (err) {
      console.error('Error creating scan:', err);
      setError('Failed to create scan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSuiteInfo = attackSuites.find(s => s.id === selectedSuite);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Link
          href="/dashboard/redteam"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Red Team
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">New Security Scan</h1>
        <p className="text-muted-foreground">
          Configure and start a new red team scan
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Configuration</CardTitle>
              <CardDescription>
                Configure the target and scan options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Scan Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Security Audit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="target">Target Endpoint *</Label>
                <Input
                  id="target"
                  placeholder="https://api.example.com/chat"
                  value={targetEndpoint}
                  onChange={(e) => {
                    setTargetEndpoint(e.target.value);
                    setError(null);
                  }}
                  className={cn('mt-1', error && 'border-danger')}
                />
                {error ? (
                  <p className="text-xs text-danger mt-1">{error}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    The API endpoint to test. Must be accessible and protected by RAGuard.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Attack Suite Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Attack Suite</CardTitle>
              <CardDescription>
                Choose the scope of your security scan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {attackSuites.map((suite) => (
                  <button
                    key={suite.id}
                    onClick={() => setSelectedSuite(suite.id)}
                    className={cn(
                      'relative p-4 rounded-lg border-2 text-left transition-colors',
                      selectedSuite === suite.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {suite.recommended && (
                      <Badge className="absolute top-2 right-2 bg-primary-600">
                        Recommended
                      </Badge>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                        <Target className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{suite.name}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {suite.description}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            {suite.attacks} attacks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {suite.duration}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {suite.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary & Start */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suite</span>
                <span className="font-medium capitalize">{selectedSuite}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attacks</span>
                <span className="font-medium">
                  {selectedSuiteInfo?.attacks}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Duration</span>
                <span className="font-medium">
                  {selectedSuiteInfo?.duration}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium text-sm truncate max-w-[150px]">
                  {targetEndpoint || '-'}
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!targetEndpoint || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Scan...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Usage This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Attacks Used</span>
                    <span>{stats.totalAttacks.toLocaleString()} / 10,000</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all"
                      style={{ width: `${Math.min((stats.totalAttacks / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                  <span>We send attack payloads to your endpoint</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                  <span>RAGuard defenses analyze and block threats</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                  <span>We report which attacks were blocked vs passed</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

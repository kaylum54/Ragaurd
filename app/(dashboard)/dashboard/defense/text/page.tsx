'use client';

import { useState } from 'react';
import { Shield, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const defenseLayers = [
  {
    id: 'pattern_matching',
    name: 'Pattern Matching',
    description: 'Detects known attack patterns and signatures',
    enabled: true,
    configurable: true,
  },
  {
    id: 'semantic_analysis',
    name: 'Semantic Analysis',
    description: 'Classifies intent using NLP models',
    enabled: true,
    configurable: true,
  },
  {
    id: 'embedding_similarity',
    name: 'Embedding Similarity',
    description: 'Vector-based comparison to known attacks',
    enabled: true,
    configurable: true,
  },
  {
    id: 'llm_guard',
    name: 'LLM Guard',
    description: 'AI-powered threat analysis',
    enabled: true,
    configurable: true,
  },
  {
    id: 'context_validation',
    name: 'Context Validation',
    description: 'Enforces role boundaries and context',
    enabled: true,
    configurable: true,
  },
  {
    id: 'output_filtering',
    name: 'Output Filtering',
    description: 'Sanitizes responses for sensitive data',
    enabled: true,
    configurable: true,
  },
];

export default function TextDefensePage() {
  const [profile, setProfile] = useState('balanced');
  const [layers, setLayers] = useState(defenseLayers);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<null | { allowed: boolean; latencyMs: number }>(null);
  const [testing, setTesting] = useState(false);

  const toggleLayer = (id: string) => {
    setLayers(layers.map(l =>
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const runTest = async () => {
    if (!testInput.trim()) return;

    setTesting(true);
    setTestResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    const isAttack = testInput.toLowerCase().includes('ignore') ||
      testInput.toLowerCase().includes('system prompt') ||
      testInput.toLowerCase().includes('jailbreak');

    setTestResult({
      allowed: !isAttack,
      latencyMs: Math.floor(80 + Math.random() * 100),
    });
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Text Defense Configuration</h1>
        <p className="text-muted-foreground">
          Configure your 6-layer text defense stack
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Layer Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Defense Profile</CardTitle>
              <CardDescription>
                Choose a preset profile or customize individual layers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {['strict', 'balanced', 'permissive'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setProfile(p)}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-colors',
                      profile === p
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="font-medium capitalize">{p}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {p === 'strict' && 'Maximum protection, may block edge cases'}
                      {p === 'balanced' && 'Recommended for most use cases'}
                      {p === 'permissive' && 'Minimum blocking, higher risk'}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Layer Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Defense Layers</CardTitle>
              <CardDescription>
                Enable or disable individual defense layers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium',
                      layer.enabled
                        ? 'bg-success text-white'
                        : 'bg-slate-300 text-slate-600'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <Label htmlFor={layer.id} className="font-medium">
                        {layer.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={layer.id}
                    checked={layer.enabled}
                    onCheckedChange={() => toggleLayer(layer.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Test Endpoint */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Endpoint</CardTitle>
              <CardDescription>
                Test your configuration with sample inputs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profile-select">Profile</Label>
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="permissive">Permissive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="test-input">Test Input</Label>
                <Textarea
                  id="test-input"
                  placeholder="Enter a test message..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <Button
                className="w-full"
                onClick={runTest}
                disabled={!testInput.trim() || testing}
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Test Defense
                  </>
                )}
              </Button>

              {testResult && (
                <div className={cn(
                  'p-4 rounded-lg',
                  testResult.allowed ? 'bg-success/10' : 'bg-danger/10'
                )}>
                  <div className="flex items-center gap-2">
                    {testResult.allowed ? (
                      <Check className="h-5 w-5 text-success" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-danger" />
                    )}
                    <span className={cn(
                      'font-medium',
                      testResult.allowed ? 'text-success' : 'text-danger'
                    )}>
                      {testResult.allowed ? 'Allowed' : 'Blocked'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Latency: {testResult.latencyMs}ms
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Layers</span>
                <Badge variant="secondary">
                  {layers.filter(l => l.enabled).length}/6
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Profile</span>
                <Badge variant="outline" className="capitalize">{profile}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="success" className="bg-success text-white">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

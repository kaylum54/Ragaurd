'use client';

import { useState, useRef } from 'react';
import { Shield, Check, AlertTriangle, Loader2, XCircle, Mic, Upload, Play, Pause, Volume2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LayerResult {
  name: string;
  passed: boolean;
  details?: string;
}

interface DefenseResult {
  allowed: boolean;
  blocked_by?: string;
  threat_category?: string;
  confidence?: number;
  latency_ms: number;
  transcription?: string;
  layers: LayerResult[];
}

const defenseLayers = [
  {
    id: 'speech_to_text',
    name: 'Speech-to-Text',
    description: 'Transcribes audio for analysis',
    enabled: true,
    configurable: false,
  },
  {
    id: 'text_analysis',
    name: 'Text Analysis',
    description: 'Analyzes transcribed content for threats',
    enabled: true,
    configurable: true,
  },
  {
    id: 'voice_pattern',
    name: 'Voice Pattern Detection',
    description: 'Detects synthetic or cloned voices',
    enabled: true,
    configurable: true,
  },
  {
    id: 'audio_fingerprint',
    name: 'Audio Fingerprinting',
    description: 'Identifies manipulated audio samples',
    enabled: true,
    configurable: true,
  },
  {
    id: 'intent_classification',
    name: 'Intent Classification',
    description: 'Classifies speaker intent from tone and words',
    enabled: true,
    configurable: true,
  },
  {
    id: 'output_filtering',
    name: 'Output Filtering',
    description: 'Sanitizes response audio for sensitive data',
    enabled: true,
    configurable: true,
  },
];

export default function AudioDefensePage() {
  const [profile, setProfile] = useState('balanced');
  const [layers, setLayers] = useState(defenseLayers);
  const [testResult, setTestResult] = useState<DefenseResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleLayer = (id: string) => {
    setLayers(layers.map(l =>
      l.id === id ? { ...l, enabled: !l.enabled } : l
    ));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
      setTestResult(null);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      // In production, would stop MediaRecorder and save audio
    } else {
      setRecording(true);
      // In production, would start MediaRecorder
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const runTest = async () => {
    if (!audioFile && !audioUrl) return;

    setTesting(true);
    setTestResult(null);

    // Simulate API call for audio analysis
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Demo result
    const isAttack = Math.random() > 0.7; // 30% chance of attack for demo
    const demoResult: DefenseResult = {
      allowed: !isAttack,
      blocked_by: isAttack ? 'intent_classification' : undefined,
      threat_category: isAttack ? 'social_engineering' : undefined,
      confidence: isAttack ? 0.87 : undefined,
      latency_ms: Math.floor(150 + Math.random() * 200),
      transcription: 'Sample transcription of the audio content would appear here...',
      layers: [
        { name: 'speech_to_text', passed: true },
        { name: 'text_analysis', passed: !isAttack || Math.random() > 0.5 },
        { name: 'voice_pattern', passed: true },
        { name: 'audio_fingerprint', passed: true },
        { name: 'intent_classification', passed: !isAttack },
        { name: 'output_filtering', passed: true },
      ],
    };

    setTestResult(demoResult);
    setTesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audio Defense Configuration</h1>
          <p className="text-muted-foreground">
            Configure your voice AI security stack
          </p>
        </div>
        <Badge className="bg-primary-600">Pro+ Feature</Badge>
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
                      {p === 'strict' && 'Maximum voice protection'}
                      {p === 'balanced' && 'Recommended for voice AI'}
                      {p === 'permissive' && 'Minimal voice checks'}
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
                  {layer.configurable ? (
                    <Switch
                      id={layer.id}
                      checked={layer.enabled}
                      onCheckedChange={() => toggleLayer(layer.id)}
                    />
                  ) : (
                    <Badge variant="secondary" className="text-xs">Required</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Voice Detection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Threat Detection Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Voice Cloning</div>
                  <p className="text-xs text-muted-foreground">
                    Detects synthetic or AI-generated voices attempting impersonation
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Audio Injection</div>
                  <p className="text-xs text-muted-foreground">
                    Identifies malicious audio payloads embedded in speech
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Social Engineering</div>
                  <p className="text-xs text-muted-foreground">
                    Recognizes manipulation tactics and persuasion attacks
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Prompt Injection</div>
                  <p className="text-xs text-muted-foreground">
                    Blocks verbal attempts to hijack AI behavior
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Test Endpoint */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Audio Defense</CardTitle>
              <CardDescription>
                Upload or record audio to test your configuration
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

              {/* Audio Input Options */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Audio File
                </Button>

                <Button
                  variant="outline"
                  className={cn('w-full', recording && 'border-danger text-danger')}
                  onClick={toggleRecording}
                >
                  <Mic className={cn('mr-2 h-4 w-4', recording && 'animate-pulse')} />
                  {recording ? 'Stop Recording' : 'Record Audio'}
                </Button>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10"
                      onClick={togglePlayback}
                    >
                      {playing ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {audioFile?.name || 'Recorded audio'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {audioFile ? `${(audioFile.size / 1024).toFixed(1)} KB` : 'Ready for analysis'}
                      </div>
                    </div>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              <Button
                className="w-full"
                onClick={runTest}
                disabled={!audioUrl || testing}
              >
                {testing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Analyze Audio
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

                  {testResult.transcription && (
                    <div className="mt-3 p-2 bg-white rounded text-sm">
                      <span className="text-muted-foreground">Transcription: </span>
                      <span className="italic">&quot;{testResult.transcription}&quot;</span>
                    </div>
                  )}

                  {!testResult.allowed && testResult.threat_category && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">Threat: </span>
                      <Badge variant="outline" className="capitalize">
                        {testResult.threat_category.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground mt-2">
                    Latency: {testResult.latency_ms}ms
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Layer Results */}
          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Layer Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {testResult.layers.map((layer) => (
                  <div
                    key={layer.name}
                    className="flex items-center justify-between p-2 bg-slate-50 rounded"
                  >
                    <span className="text-sm capitalize">
                      {layer.name.replace('_', ' ')}
                    </span>
                    {layer.passed ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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

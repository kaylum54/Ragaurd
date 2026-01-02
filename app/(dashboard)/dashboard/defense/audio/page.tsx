'use client';

import { useState, useRef } from 'react';
import { Shield, Check, AlertTriangle, Loader2, XCircle, Mic, Upload, Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LockedFeature } from '@/components/dashboard/LockedFeature';

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
    } else {
      setRecording(true);
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

    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    const isAttack = Math.random() > 0.7;
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
    <LockedFeature
      feature="audioDefense"
      title="Audio Defense"
      description="Configure your voice AI security stack"
      requiredPlan="Pro"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="dash-page-title">Audio Defense Configuration</h1>
            <p className="dash-page-subtitle">
              Configure your voice AI security stack
            </p>
          </div>
          <span className="dash-badge dash-badge-accent">Pro+ Feature</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Layer Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Selection */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Defense Profile</span>
            </div>
            <div className="dash-card-body">
              <p className="text-sm text-dash-text-muted mb-4">
                Choose a preset profile or customize individual layers
              </p>
              <div className="grid grid-cols-3 gap-4">
                {['strict', 'balanced', 'permissive'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setProfile(p)}
                    className={cn(
                      'p-4 text-left transition-colors border-2',
                      profile === p
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-dash-border bg-dash-bg-secondary hover:border-dash-border-hover'
                    )}
                  >
                    <div className="font-bold text-dash-text-primary capitalize">{p}</div>
                    <div className="text-xs text-dash-text-muted mt-1">
                      {p === 'strict' && 'Maximum voice protection'}
                      {p === 'balanced' && 'Recommended for voice AI'}
                      {p === 'permissive' && 'Minimal voice checks'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Layer Configuration */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Defense Layers</span>
            </div>
            <div className="dash-card-body space-y-3">
              {layers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-4 bg-dash-bg-secondary border-2 border-dash-border hover:border-dash-border-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'h-8 w-8 flex items-center justify-center text-sm font-bold',
                      layer.enabled
                        ? 'bg-purple-500 text-white'
                        : 'bg-dash-bg-tertiary text-dash-text-muted border-2 border-dash-border'
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <label htmlFor={layer.id} className="font-semibold text-dash-text-primary cursor-pointer">
                        {layer.name}
                      </label>
                      <p className="text-xs text-dash-text-muted">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                  {layer.configurable ? (
                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={cn(
                        'relative w-11 h-6 transition-colors',
                        layer.enabled ? 'bg-purple-500' : 'bg-dash-bg-tertiary border-2 border-dash-border'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 left-1 w-4 h-4 bg-white transition-transform',
                          layer.enabled ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  ) : (
                    <span className="dash-badge dash-badge-info text-xs">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Voice Detection Info */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Threat Detection Categories</span>
            </div>
            <div className="dash-card-body">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-dash-bg-secondary border-2 border-dash-border">
                  <div className="font-semibold text-sm text-dash-text-primary mb-1">Voice Cloning</div>
                  <p className="text-xs text-dash-text-muted">
                    Detects synthetic or AI-generated voices attempting impersonation
                  </p>
                </div>
                <div className="p-3 bg-dash-bg-secondary border-2 border-dash-border">
                  <div className="font-semibold text-sm text-dash-text-primary mb-1">Audio Injection</div>
                  <p className="text-xs text-dash-text-muted">
                    Identifies malicious audio payloads embedded in speech
                  </p>
                </div>
                <div className="p-3 bg-dash-bg-secondary border-2 border-dash-border">
                  <div className="font-semibold text-sm text-dash-text-primary mb-1">Social Engineering</div>
                  <p className="text-xs text-dash-text-muted">
                    Recognizes manipulation tactics and persuasion attacks
                  </p>
                </div>
                <div className="p-3 bg-dash-bg-secondary border-2 border-dash-border">
                  <div className="font-semibold text-sm text-dash-text-primary mb-1">Prompt Injection</div>
                  <p className="text-xs text-dash-text-muted">
                    Blocks verbal attempts to hijack AI behavior
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Test Endpoint */}
        <div className="space-y-6">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Test Audio Defense</span>
            </div>
            <div className="dash-card-body space-y-4">
              <div>
                <label className="text-xs font-bold text-dash-text-secondary uppercase tracking-wider block mb-2">Profile</label>
                <select
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  className="dash-input"
                >
                  <option value="strict">Strict</option>
                  <option value="balanced">Balanced</option>
                  <option value="permissive">Permissive</option>
                </select>
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

                <button
                  className="dash-btn dash-btn-secondary w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Audio File
                </button>

                <button
                  className={cn(
                    'dash-btn w-full',
                    recording ? 'bg-dash-danger text-white border-dash-danger' : 'dash-btn-secondary'
                  )}
                  onClick={toggleRecording}
                >
                  <Mic className={cn('h-4 w-4', recording && 'animate-pulse')} />
                  {recording ? 'Stop Recording' : 'Record Audio'}
                </button>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <div className="p-4 bg-dash-bg-secondary border-2 border-dash-border">
                  <div className="flex items-center gap-3">
                    <button
                      className="h-10 w-10 flex items-center justify-center bg-dash-bg-tertiary border-2 border-dash-border hover:border-dash-border-hover transition-colors"
                      onClick={togglePlayback}
                    >
                      {playing ? (
                        <Pause className="h-5 w-5 text-dash-text-primary" />
                      ) : (
                        <Play className="h-5 w-5 text-dash-text-primary" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-dash-text-primary">
                        {audioFile?.name || 'Recorded audio'}
                      </div>
                      <div className="text-xs text-dash-text-muted">
                        {audioFile ? `${(audioFile.size / 1024).toFixed(1)} KB` : 'Ready for analysis'}
                      </div>
                    </div>
                    <Volume2 className="h-4 w-4 text-dash-text-muted" />
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              <button
                className="dash-btn dash-btn-primary w-full"
                onClick={runTest}
                disabled={!audioUrl || testing}
              >
                {testing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Analyze Audio
                  </>
                )}
              </button>

              {testResult && (
                <div className={cn(
                  'p-4 border-2',
                  testResult.allowed
                    ? 'bg-dash-success/10 border-dash-success/30'
                    : 'bg-dash-danger/10 border-dash-danger/30'
                )}>
                  <div className="flex items-center gap-2">
                    {testResult.allowed ? (
                      <Check className="h-5 w-5 text-dash-success" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-dash-danger" />
                    )}
                    <span className={cn(
                      'font-bold',
                      testResult.allowed ? 'text-dash-success' : 'text-dash-danger'
                    )}>
                      {testResult.allowed ? 'Allowed' : 'Blocked'}
                    </span>
                  </div>

                  {testResult.transcription && (
                    <div className="mt-3 p-2 bg-dash-bg-secondary border-2 border-dash-border text-sm">
                      <span className="text-dash-text-muted">Transcription: </span>
                      <span className="italic text-dash-text-secondary">&quot;{testResult.transcription}&quot;</span>
                    </div>
                  )}

                  {!testResult.allowed && testResult.threat_category && (
                    <div className="mt-2 text-sm">
                      <span className="text-dash-text-muted">Threat: </span>
                      <span className="dash-badge dash-badge-danger capitalize">
                        {testResult.threat_category.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-dash-text-muted mt-2">
                    Latency: {testResult.latency_ms}ms
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Layer Results */}
          {testResult && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Layer Results</span>
              </div>
              <div className="dash-card-body space-y-2">
                {testResult.layers.map((layer) => (
                  <div
                    key={layer.name}
                    className="flex items-center justify-between p-3 bg-dash-bg-secondary border-2 border-dash-border"
                  >
                    <span className="text-sm font-medium text-dash-text-secondary capitalize">
                      {layer.name.replace('_', ' ')}
                    </span>
                    {layer.passed ? (
                      <Check className="h-4 w-4 text-dash-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-dash-danger" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Current Status</span>
            </div>
            <div className="dash-card-body space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-dash-text-secondary">Active Layers</span>
                <span className="dash-badge dash-badge-info">
                  {layers.filter(l => l.enabled).length}/6
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-dash-text-secondary">Profile</span>
                <span className="dash-badge dash-badge-accent capitalize">{profile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-dash-text-secondary">Status</span>
                <span className="dash-badge dash-badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </LockedFeature>
  );
}

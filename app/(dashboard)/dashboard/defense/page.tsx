'use client';

import Link from 'next/link';
import { Shield, Mic, ArrowRight, Check, Zap } from 'lucide-react';

const textLayers = [
  { name: 'Pattern Matching', status: 'active', description: 'Known attack signatures' },
  { name: 'Semantic Analysis', status: 'active', description: 'Intent classification' },
  { name: 'Embedding Similarity', status: 'active', description: 'Vector-based detection' },
  { name: 'LLM Guard', status: 'active', description: 'AI-powered analysis' },
  { name: 'Context Validation', status: 'active', description: 'Role boundary enforcement' },
  { name: 'Output Filtering', status: 'active', description: 'Response sanitization' },
];

export default function DefensePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="dash-page-title">Defense Configuration</h1>
        <p className="dash-page-subtitle">
          Manage your text and audio defense layers
        </p>
      </div>

      {/* Defense Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text Defense */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center bg-dash-accent/20 border-2 border-dash-accent/30">
                <Shield className="h-6 w-6 text-dash-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dash-text-primary">Text Defense</h3>
                <p className="text-sm text-dash-text-muted">6-layer protection stack</p>
              </div>
            </div>
            <span className="dash-badge dash-badge-success">Active</span>
          </div>
          <div className="dash-card-body space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <div className="dash-stats-value text-dash-accent">99.53%</div>
                <div className="text-xs text-dash-text-muted font-semibold uppercase tracking-wider mt-1">Block Rate</div>
              </div>
              <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <div className="dash-stats-value">0%</div>
                <div className="text-xs text-dash-text-muted font-semibold uppercase tracking-wider mt-1">False Positives</div>
              </div>
              <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <div className="dash-stats-value text-dash-success">156ms</div>
                <div className="text-xs text-dash-text-muted font-semibold uppercase tracking-wider mt-1">Avg Latency</div>
              </div>
            </div>

            {/* Layers */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-dash-text-secondary uppercase tracking-[0.15em]">Defense Layers</div>
              <div className="space-y-2">
                {textLayers.map((layer, index) => (
                  <div
                    key={layer.name}
                    className="flex items-center gap-3 p-3 bg-dash-bg-secondary border-2 border-dash-border hover:border-dash-border-hover transition-colors"
                  >
                    <div className="h-7 w-7 bg-dash-success text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-dash-text-primary">{layer.name}</div>
                      <div className="text-xs text-dash-text-muted">{layer.description}</div>
                    </div>
                    <Check className="h-4 w-4 text-dash-success" />
                  </div>
                ))}
              </div>
            </div>

            <Link href="/dashboard/defense/text" className="dash-btn dash-btn-primary w-full">
              Configure Text Defense
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Audio Defense */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center bg-purple-500/20 border-2 border-purple-500/30">
                <Mic className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dash-text-primary">Audio Defense</h3>
                <p className="text-sm text-dash-text-muted">Deepfake detection</p>
              </div>
            </div>
            <span className="dash-badge dash-badge-accent">Pro+</span>
          </div>
          <div className="dash-card-body space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <div className="dash-stats-value text-purple-400">0.83%</div>
                <div className="text-xs text-dash-text-muted font-semibold uppercase tracking-wider mt-1">EER</div>
              </div>
              <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <div className="dash-stats-value">2</div>
                <div className="text-xs text-dash-text-muted font-semibold uppercase tracking-wider mt-1">Detection Models</div>
              </div>
              <div className="text-center p-4 bg-dash-bg-secondary border-2 border-dash-border">
                <div className="dash-stats-value text-dash-success">234ms</div>
                <div className="text-xs text-dash-text-muted font-semibold uppercase tracking-wider mt-1">Avg Latency</div>
              </div>
            </div>

            {/* Models */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-dash-text-secondary uppercase tracking-[0.15em]">Detection Models</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-dash-bg-secondary border-2 border-dash-border hover:border-dash-border-hover transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center bg-purple-500/20 border-2 border-purple-500/30">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-dash-text-primary">AASIST-L</div>
                    <div className="text-xs text-dash-text-muted">State-of-the-art deepfake detection</div>
                  </div>
                  <span className="dash-badge dash-badge-success">Active</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-dash-bg-secondary border-2 border-dash-border hover:border-dash-border-hover transition-colors">
                  <div className="h-10 w-10 flex items-center justify-center bg-purple-500/20 border-2 border-purple-500/30">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-dash-text-primary">LCNN</div>
                    <div className="text-xs text-dash-text-muted">Light CNN for fast detection</div>
                  </div>
                  <span className="dash-badge dash-badge-success">Active</span>
                </div>
              </div>
            </div>

            <Link href="/dashboard/defense/audio" className="dash-btn dash-btn-primary w-full">
              Configure Audio Defense
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

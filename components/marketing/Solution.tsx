'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Brain, Shield, Lock, Fingerprint, Mic, Zap, FileText, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const layers = [
  { number: 1, title: 'Pattern Detection', description: '183 attack signatures across 13 categories', tech: 'Regex-based, 99.7% precision', icon: Search, color: 'cyan' },
  { number: 2, title: 'ML Classification', description: 'DeBERTa classifier catches novel attacks', tech: 'Fine-tuned, 98.2% accuracy', icon: Brain, color: 'cyan' },
  { number: 3, title: 'Input Sanitization', description: 'SQL, XSS, command injection protection', tech: 'OWASP-compliant rules', icon: Shield, color: 'secure' },
  { number: 4, title: 'PII Detection', description: 'GDPR, HIPAA, SOC2 compliance support', tech: 'Named entity recognition', icon: Lock, color: 'secure' },
  { number: 5, title: 'Semantic Analysis', description: 'Context-aware manipulation detection', tech: 'Transformer-based intent', icon: Fingerprint, color: 'violet' },
  { number: 6, title: 'Audio Verification', description: 'Deepfake detection with 0.83% EER', tech: 'AASIST-L + LCNN ensemble', icon: Mic, badge: 'Pro', color: 'violet' },
];

const benefits = [
  { icon: Zap, label: 'Real-time', detail: '<200ms latency' },
  { icon: Shield, label: 'Zero FP', detail: '0% false positives' },
  { icon: FileText, label: 'Logging', detail: 'Full threat data' },
  { icon: Clock, label: 'Simple', detail: 'REST API & SDKs' },
];

// Data flow visualization
function DataFlowDiagram() {
  return (
    <div className="relative flex items-center justify-center gap-6 py-10">
      {/* Input */}
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-void-200 border border-void-400 flex items-center justify-center">
          <span className="text-2xl">📥</span>
        </div>
        <span className="mt-2 text-xs font-medium text-void-600">Input</span>
      </div>

      {/* Arrow with particles */}
      <div className="relative w-20 h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-void-400 to-cyan-500/50 rounded-full" />
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-data-flow" style={{ top: '-2px' }} />
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-data-flow" style={{ top: '-2px', animationDelay: '1.2s' }} />
      </div>

      {/* Ragaurd */}
      <div className="relative flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border-2 border-cyan-500 flex items-center justify-center glow-cyan animate-pulse-glow">
          <Shield className="w-9 h-9 text-cyan-400" />
        </div>
        <span className="mt-2 text-xs font-bold text-cyan-400">Ragaurd</span>
        <span className="text-[10px] text-void-500">6 layers</span>
      </div>

      {/* Arrow with particles */}
      <div className="relative w-20 h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/50 to-secure-500/50 rounded-full" />
        <div className="absolute w-2 h-2 rounded-full bg-secure-400 animate-data-flow" style={{ top: '-2px', animationDelay: '0.6s' }} />
      </div>

      {/* Agent */}
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-secure-500/10 border-2 border-secure-500 flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <span className="mt-2 text-xs font-medium text-secure-400">Agent</span>
      </div>

      {/* Blocked indicator */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-threat-400">
        <span className="w-1.5 h-1.5 rounded-full bg-threat-500" />
        Attacks blocked
      </div>
    </div>
  );
}

// Scroll animation hook
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

export function Solution() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  const colorStyles = {
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    secure: { bg: 'bg-secure-500/10', border: 'border-secure-500/30', text: 'text-secure-400' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void relative" id="solution">
      {/* Background */}
      <div className="absolute inset-0 bg-noir-radial opacity-30" />
      <div className="divider-glow absolute top-0" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div
            className={`badge-secure mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Solution</span>
          </div>

          <h2
            className={`heading-1 text-white mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            One API.<br />
            <span className="gradient-text-cyan">Six Layers of Defense.</span>
          </h2>

          <p
            className={`text-lg text-void-700 leading-relaxed opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Ragaurd inspects every input before it reaches your agent's LLM,
            blocking attacks in real-time while allowing legitimate traffic through.
          </p>
        </div>

        {/* Data flow diagram */}
        <div
          className={`max-w-xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <DataFlowDiagram />
        </div>

        {/* Layers accordion */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="space-y-3">
            {layers.map((layer, index) => {
              const colors = colorStyles[layer.color as keyof typeof colorStyles];
              const isExpanded = expandedLayer === index;

              return (
                <div
                  key={layer.number}
                  className={`noir-card-glow rounded-2xl overflow-hidden opacity-0 ${isVisible ? 'animate-cascade-up' : ''} ${isExpanded ? 'ring-1 ring-cyan-500/30' : ''}`}
                  style={{ animationDelay: `${500 + index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : index)}
                    className="w-full flex items-center gap-4 p-5 text-left group"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${colors.bg} border ${colors.border}`}>
                      <span className={`text-lg font-bold ${colors.text}`}>{layer.number}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {layer.title}
                        </h4>
                        {layer.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan-500 text-void rounded-full uppercase">
                            {layer.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-void-600 mt-0.5 line-clamp-1">{layer.description}</p>
                    </div>

                    <layer.icon className={`w-5 h-5 shrink-0 ${colors.text} opacity-50 group-hover:opacity-100`} />
                    <ChevronDown className={`w-5 h-5 text-void-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-32' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 pl-[76px]">
                      <p className="text-sm text-void-700 mb-3">{layer.description}</p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-void-200 rounded-lg">
                        <span className="text-xs text-void-500">Technical:</span>
                        <span className="text-xs text-void-700 font-mono">{layer.tech}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`h-0.5 bg-gradient-to-r from-cyan-500 to-secure-500 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits bar */}
        <div
          className={`max-w-4xl mx-auto opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
        >
          <div className="noir-card rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-wrap justify-center gap-8">
                {benefits.map((benefit) => (
                  <div key={benefit.label} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg bg-secure-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-5 h-5 text-secure-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{benefit.label}</p>
                      <p className="text-xs text-void-500">{benefit.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium group">
                Documentation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

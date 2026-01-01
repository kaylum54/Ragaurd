'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Brain, Shield, Lock, Fingerprint, Mic, Zap, FileText, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const layers = [
  { number: 1, title: 'Pattern Detection', description: '183 attack signatures across 13 categories', tech: 'Regex-based, 99.7% precision', icon: Search },
  { number: 2, title: 'ML Classification', description: 'DeBERTa classifier catches novel attacks', tech: 'Fine-tuned, 98.2% accuracy', icon: Brain },
  { number: 3, title: 'Input Sanitization', description: 'SQL, XSS, command injection protection', tech: 'OWASP-compliant rules', icon: Shield },
  { number: 4, title: 'PII Detection', description: 'GDPR, HIPAA, SOC2 compliance support', tech: 'Named entity recognition', icon: Lock },
  { number: 5, title: 'Semantic Analysis', description: 'Context-aware manipulation detection', tech: 'Transformer-based intent', icon: Fingerprint },
  { number: 6, title: 'Audio Verification', description: 'Deepfake detection with 0.83% EER', tech: 'AASIST-L + LCNN ensemble', icon: Mic, badge: 'Pro' },
];

const benefits = [
  { icon: Zap, label: 'Real-time', detail: '<200ms latency' },
  { icon: Shield, label: 'Zero FP', detail: '0% false positives' },
  { icon: FileText, label: 'Logging', detail: 'Full threat data' },
  { icon: Clock, label: 'Simple', detail: 'REST API & SDKs' },
];

function DataFlowDiagram() {
  return (
    <div className="relative flex items-center justify-center gap-4 md:gap-8 py-12">
      {/* Input */}
      <div className="relative flex flex-col items-center group">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-navy-800/50 border border-navy-600/50 flex items-center justify-center backdrop-blur-sm group-hover:border-navy-500 transition-colors">
          <span className="text-2xl md:text-3xl">📥</span>
        </div>
        <span className="mt-3 text-xs font-medium text-navy-400">Input</span>
      </div>

      {/* Animated connection line */}
      <div className="relative w-16 md:w-24 h-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-600 to-navy-500 rounded-full" />
        <div className="absolute w-3 h-3 -top-[5px] bg-navy-400 rounded-full animate-[flow_2s_ease-in-out_infinite]" />
      </div>

      {/* Ragaurd Shield */}
      <div className="relative flex flex-col items-center group">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-navy-400/20 rounded-2xl blur-xl group-hover:bg-navy-400/30 transition-colors" />
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-800 border-2 border-navy-400/50 flex items-center justify-center shadow-xl group-hover:border-navy-300/50 transition-colors">
            <Shield className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
        </div>
        <span className="mt-3 text-xs font-bold text-white">Ragaurd</span>
        <span className="text-[10px] text-navy-400">6 layers</span>
      </div>

      {/* Animated connection line */}
      <div className="relative w-16 md:w-24 h-[2px]">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-500 to-success-500/50 rounded-full" />
        <div className="absolute w-3 h-3 -top-[5px] bg-success-400 rounded-full animate-[flow_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
      </div>

      {/* Agent */}
      <div className="relative flex flex-col items-center group">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-navy-800/50 border-2 border-success-500/30 flex items-center justify-center backdrop-blur-sm group-hover:border-success-400/50 transition-colors">
          <span className="text-2xl md:text-3xl">🤖</span>
        </div>
        <span className="mt-3 text-xs font-medium text-success-400">Agent</span>
      </div>

      {/* Blocked indicator */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-danger-400">
        <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
        <span className="font-medium">Attacks blocked</span>
      </div>
    </div>
  );
}

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

  return (
    <section ref={sectionRef} className="py-20 md:py-28 section-navy relative overflow-hidden" id="solution">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pattern)" />
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-navy-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-[300px] h-[300px] bg-navy-400/10 rounded-full blur-[100px]" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Shield className="w-4 h-4 text-navy-300" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Solution</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            One API.<br />
            <span className="bg-gradient-to-r from-navy-300 to-navy-200 bg-clip-text text-transparent">Six Layers of Defense.</span>
          </h2>

          <p
            className={`text-lg text-white/50 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Ragaurd inspects every input before it reaches your agent's LLM,
            blocking attacks in real-time while allowing legitimate traffic through.
          </p>
        </div>

        {/* Data flow diagram */}
        <div
          className={`max-w-2xl mx-auto mb-20 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <DataFlowDiagram />
        </div>

        {/* Layers accordion */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="space-y-3">
            {layers.map((layer, index) => {
              const isExpanded = expandedLayer === index;

              return (
                <div
                  key={layer.number}
                  className={`group relative rounded-2xl overflow-hidden opacity-0 transition-all duration-300 ${isVisible ? 'animate-fade-up' : ''} ${isExpanded ? 'ring-1 ring-navy-400/30' : ''}`}
                  style={{ animationDelay: `${500 + index * 80}ms`, animationFillMode: 'forwards' }}
                >
                  {/* Glass background */}
                  <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />
                  <div className="absolute inset-0 border border-white/5 rounded-2xl" />
                  
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : index)}
                    className="relative w-full flex items-center gap-4 p-5 text-left"
                  >
                    {/* Layer number */}
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-navy-700 to-navy-800 border border-white/10 group-hover:border-white/20 transition-colors">
                      <span className="text-xl font-bold text-navy-300">{layer.number}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-semibold text-white group-hover:text-navy-200 transition-colors">
                          {layer.title}
                        </h4>
                        {layer.badge && (
                          <span className="text-[9px] font-bold px-2.5 py-1 bg-gradient-to-r from-navy-500 to-navy-600 text-white rounded-full uppercase tracking-wider">
                            {layer.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/40 mt-1 line-clamp-1">{layer.description}</p>
                    </div>

                    <layer.icon className="w-5 h-5 shrink-0 text-navy-400 opacity-40 group-hover:opacity-70 transition-opacity" />
                    <ChevronDown className={`w-5 h-5 text-navy-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40' : 'max-h-0'}`}>
                    <div className="px-5 pb-5 pl-[88px]">
                      <p className="text-sm text-white/50 mb-4">{layer.description}</p>
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-navy-800/50 rounded-xl border border-white/5">
                        <span className="text-[10px] text-navy-400 uppercase tracking-wider font-medium">Technical:</span>
                        <span className="text-xs text-white/70 font-mono">{layer.tech}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active indicator */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-navy-500 to-navy-300 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits bar */}
        <div
          className={`max-w-4xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />
            <div className="absolute inset-0 border border-white/5 rounded-2xl" />
            
            <div className="relative p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {benefits.map((benefit) => (
                    <div key={benefit.label} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <benefit.icon className="w-5 h-5 text-navy-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{benefit.label}</p>
                        <p className="text-xs text-white/40">{benefit.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-navy-300 hover:text-white font-medium group transition-colors">
                  Documentation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Brain, Shield, Lock, Fingerprint, Mic, ArrowRight, Layers } from 'lucide-react';
import Link from 'next/link';

const layers = [
  { number: 1, title: 'Pattern Detection', description: '183 attack signatures across 13 categories. Real-time pattern matching catches known attack vectors before they execute.', tech: 'Regex-based, 99.7% precision', icon: Search },
  { number: 2, title: 'ML Classification', description: 'DeBERTa transformer model catches novel attacks that haven\'t been seen before, learning from millions of attack examples.', tech: 'Fine-tuned LLM, 98.2% accuracy', icon: Brain },
  { number: 3, title: 'Input Sanitization', description: 'SQL injection, XSS, and command injection protection built on OWASP security standards.', tech: 'OWASP-compliant sanitization', icon: Shield },
  { number: 4, title: 'PII Detection', description: 'Automatic detection and handling of personally identifiable information for GDPR, HIPAA, and SOC2 compliance.', tech: 'Named entity recognition', icon: Lock },
  { number: 5, title: 'Semantic Analysis', description: 'Context-aware detection of manipulation attempts using transformer-based intent analysis.', tech: 'Transformer intent classification', icon: Fingerprint },
  { number: 6, title: 'Audio Verification', description: 'Real-time deepfake detection identifies synthetic voices with 0.83% equal error rate using AASIST-L and LCNN models.', tech: 'AASIST-L + LCNN ensemble', icon: Mic, badge: 'Pro' },
];

const stats = [
  { value: '<20ms', label: 'Average Latency' },
  { value: '99.53%', label: 'Attack Block Rate' },
  { value: '0%', label: 'False Positives' },
  { value: '5min', label: 'Integration Time' },
];

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
  const [activeLayer, setActiveLayer] = useState(0);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void-100 relative overflow-hidden" id="solution">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Layers className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">The Solution</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            One API.{' '}
            <span className="text-gradient-cyan">Six Layers of Defense.</span>
          </h2>

          <p
            className={`text-lg text-white-60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Ragaurd inspects every input before it reaches your agent's LLM,
            blocking attacks in real-time while allowing legitimate traffic through.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <div
            className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="space-y-2">
              {layers.map((layer, index) => (
                <button
                  key={layer.number}
                  onClick={() => setActiveLayer(index)}
                  className={`w-full text-left p-4 border transition-all duration-300 ${
                    activeLayer === index
                      ? 'bg-cyan-500/10 border-cyan-500'
                      : 'bg-void-200 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors ${
                      activeLayer === index ? 'bg-cyan-500 text-void' : 'bg-void-400 text-white-60'
                    }`}>
                      {layer.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{layer.title}</h4>
                        {layer.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-violet-500/20 text-violet-400 uppercase tracking-wider">
                            {layer.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <layer.icon className={`w-4 h-4 transition-colors ${
                      activeLayer === index ? 'text-cyan-500' : 'text-white-40'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="sticky top-24">
              <div className="bg-void-200 border border-cyan-500/30 p-8 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-500" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-500" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-500" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-500" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-cyan-500 flex items-center justify-center">
                    {(() => {
                      const LayerIcon = layers[activeLayer].icon;
                      return <LayerIcon className="w-7 h-7 text-void" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Layer {layers[activeLayer].number}</h3>
                    <p className="text-cyan-400">{layers[activeLayer].title}</p>
                  </div>
                </div>

                <p className="text-white-60 leading-relaxed mb-6">
                  {layers[activeLayer].description}
                </p>

                <div className="p-4 bg-void border border-white/10">
                  <p className="text-[10px] text-white-40 uppercase tracking-wider mb-2 font-medium">Technical Implementation</p>
                  <code className="text-sm text-cyan-400 font-mono">{layers[activeLayer].tech}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-px bg-cyan-500/20 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-void-200 p-6 md:p-8 text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-500 mb-2">{stat.value}</div>
              <div className="text-xs text-white-40 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <Link
            href="/signup"
            className="btn-primary group"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs"
            className="btn-secondary"
          >
            Read Documentation
          </Link>
        </div>
      </div>
    </section>
  );
}

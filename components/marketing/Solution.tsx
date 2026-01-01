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
  { value: '<200ms', label: 'Average Latency' },
  { value: '99.53%', label: 'Attack Block Rate' },
  { value: '0%', label: 'False Positives' },
  { value: '5 min', label: 'Integration Time' },
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-white-off relative overflow-hidden" id="solution">
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`inline-block text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            The Solution
          </span>

          <h2
            className={`heading-1 mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            One API.{' '}
            <span className="text-navy-500">Six Layers of Defense.</span>
          </h2>

          <p
            className={`body-large opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Ragaurd inspects every input before it reaches your agent's LLM,
            blocking attacks in real-time while allowing legitimate traffic through.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
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
                      ? 'bg-navy-950 border-navy-950 text-white'
                      : 'bg-white border-navy-100 hover:border-navy-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors ${
                      activeLayer === index ? 'bg-white text-navy-950' : 'bg-navy-50 text-navy-600'
                    }`}>
                      {layer.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${activeLayer === index ? 'text-white' : 'text-navy-950'}`}>
                          {layer.title}
                        </h4>
                        {layer.badge && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-navy-500 text-white uppercase tracking-wider">
                            {layer.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <layer.icon className={`w-4 h-4 transition-colors ${
                      activeLayer === index ? 'text-white/70' : 'text-navy-400'
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
              <div className="bg-white border border-navy-200 shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-navy-950 flex items-center justify-center">
                    {(() => {
                      const LayerIcon = layers[activeLayer].icon;
                      return <LayerIcon className="w-7 h-7 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-navy-950">Layer {layers[activeLayer].number}</h3>
                    <p className="text-navy-500">{layers[activeLayer].title}</p>
                  </div>
                </div>

                <p className="text-navy-600 leading-relaxed mb-6">
                  {layers[activeLayer].description}
                </p>

                <div className="p-4 bg-navy-50 border border-navy-100">
                  <p className="text-[10px] text-navy-500 uppercase tracking-wider mb-2 font-medium">Technical Implementation</p>
                  <code className="text-sm text-navy-700 font-mono">{layers[activeLayer].tech}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-navy-100 p-6 md:p-8 text-center shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-navy-950 mb-2">{stat.value}</div>
              <div className="text-sm text-navy-500">{stat.label}</div>
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

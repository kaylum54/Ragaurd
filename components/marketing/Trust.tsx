'use client';

import { useEffect, useRef, useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';

const metrics = [
  { label: 'Attack Block Rate', value: '99.53%', detail: '(426/428 attacks blocked)' },
  { label: 'False Positive Rate', value: '0.00%', detail: '(0/30 legitimate inputs blocked)' },
  { label: 'Average Latency', value: '19.2ms', detail: '' },
  { label: 'Audio Deepfake Detection (EER)', value: '0.83%', detail: '' },
];

const methodology = [
  '428+ unique attack patterns in our core test suite',
  'Cross-referenced against published jailbreak repositories',
  'Tested against real-world attack samples observed in production environments',
  'Evaluated for false positive rates using legitimate conversation datasets',
];

const whatWeDoNot = [
  "We don't claim 100% protection. No security system does.",
  "We don't fabricate testimonials or inflate statistics.",
  "We don't sell snake oil. This is infrastructure, not magic.",
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

export function Trust() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-16 bg-void border-t border-white/5" id="trust">
      <div className="container">
        <div className="max-w-3xl">
          <h2
            className={`text-2xl font-semibold text-white opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Built by Security Practitioners
          </h2>
          <p
            className={`mt-3 text-sm text-white-60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Ragaurd was developed by engineers with backgrounds in enterprise infrastructure, penetration testing, and AI security research.
          </p>

          <div
            className={`mt-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <h3 className="text-sm font-medium text-white mb-4">Our Testing Methodology</h3>
            <p className="text-sm text-white-60 mb-4">
              We validate our detection capabilities against continuously updated attack datasets:
            </p>
            <div className="space-y-2">
              {methodology.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-secure-500 shrink-0 mt-2" />
                  <span className="text-sm text-white-60">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <h3 className="text-sm font-medium text-white mb-4">Current Performance</h3>
            <div className="overflow-hidden border border-white/10">
              <table className="w-full">
                <thead className="bg-void-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-white-60 uppercase tracking-wide">Metric</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-white-60 uppercase tracking-wide">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-void-100 divide-y divide-white/5">
                  {metrics.map((metric) => (
                    <tr key={metric.label}>
                      <td className="px-4 py-3 text-sm text-white-60">{metric.label}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-cyan-500 tabular-nums">{metric.value}</span>
                        {metric.detail && (
                          <span className="text-xs text-white-40 ml-1">{metric.detail}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-white-40">
              These numbers reflect testing against our combined attack suite as of December 2024. We publish updated benchmarks as our detection capabilities evolve.
            </p>
          </div>

          <div
            className={`mt-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <h3 className="text-sm font-medium text-white mb-4">What We Don't Do</h3>
            <div className="space-y-2">
              {whatWeDoNot.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-white-40 shrink-0 mt-0.5" />
                  <span className="text-sm text-white-60">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-8 p-5 bg-void-200 border border-white/10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <p className="text-sm text-white-60">
              Ragaurd is a defense layer that significantly raises the difficulty of attacking your voice agents. It's not a silver bullet — it's a necessary component of a responsible AI deployment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Shield, Mic, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Text Defense',
    description: '6-layer detection: pattern matching, semantic analysis, embedding similarity, LLM guard, context validation, output filtering.',
    stat: '99.5%',
    statLabel: 'Detection rate',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description: 'Real-time deepfake detection using AASIST-L and LCNN models. Identify synthetic voices before they reach your agent.',
    stat: '0.83%',
    statLabel: 'Equal error rate',
    badge: 'Pro',
  },
  {
    icon: Target,
    title: 'Red Team Testing',
    description: 'Automated security scanning with 10,000+ attack vectors. Find vulnerabilities before attackers do.',
    stat: '10K+',
    statLabel: 'Attack vectors',
    badge: 'Pro',
  },
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

export function Features() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-16 bg-void border-t border-white/5" id="features">
      <div className="container">
        <div className="max-w-xl mb-12">
          <h2
            className={`text-2xl font-semibold text-white opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Complete protection stack
          </h2>
          <p
            className={`mt-2 text-sm text-white-60 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Multi-layer defense for text and audio, plus automated security testing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`p-6 bg-void-200 hover:border-cyan-500/30 transition-colors opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-cyan-500" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-medium text-white">{feature.title}</h3>
                {feature.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 bg-violet-500/20 text-violet-400 uppercase tracking-wider">
                    {feature.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-white-60 leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-white/5">
                <div className="text-xl font-semibold text-cyan-500 tabular-nums">{feature.stat}</div>
                <div className="text-xs font-medium text-white-40 uppercase tracking-wide mt-0.5">{feature.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            View documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

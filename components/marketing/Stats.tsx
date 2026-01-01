'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, TrendingUp, Volume2 } from 'lucide-react';

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

export function Stats() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-16 bg-void-100">
      <div className="container">
        <div className="max-w-xl mb-10">
          <h2
            className={`text-2xl font-semibold text-white opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            The threat landscape
          </h2>
          <p
            className={`mt-2 text-sm text-white-60 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Voice AI systems are increasingly targeted. Without protection, your agents are exposed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          <div
            className={`p-6 bg-void-200 border-l-2 border-threat-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 bg-threat-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-threat-500" />
            </div>
            <div className="text-3xl font-semibold text-white tabular-nums mb-2">78%</div>
            <p className="text-sm text-white-60">
              of voice AI deployments lack security protection
            </p>
          </div>

          <div
            className={`p-6 bg-void-200 border-l-2 border-warning-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 bg-warning-500/20 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-semibold text-white tabular-nums mb-2">$4.2M</div>
            <p className="text-sm text-white-60">
              average cost of an AI-targeted breach in 2024
            </p>
          </div>

          <div
            className={`p-6 bg-void-200 border-l-2 border-warning-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 bg-warning-500/20 flex items-center justify-center mb-4">
              <Volume2 className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-semibold text-white tabular-nums mb-2">340%</div>
            <p className="text-sm text-white-60">
              increase in deepfake attacks on voice systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

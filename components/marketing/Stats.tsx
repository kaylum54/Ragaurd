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
    <section ref={sectionRef} className="py-16 bg-white-off">
      <div className="container">
        <div className="max-w-xl mb-10">
          <h2
            className={`text-2xl font-semibold text-navy-950 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            The threat landscape
          </h2>
          <p
            className={`mt-2 text-sm text-navy-600 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Voice AI systems are increasingly targeted. Without protection, your agents are exposed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div
            className={`p-6 bg-white border border-navy-100 shadow-sm border-l-4 border-l-danger-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 bg-danger-50 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-danger-500" />
            </div>
            <div className="text-3xl font-semibold text-navy-950 tabular-nums mb-2">78%</div>
            <p className="text-sm text-navy-600">
              of voice AI deployments lack security protection
            </p>
          </div>

          <div
            className={`p-6 bg-white border border-navy-100 shadow-sm border-l-4 border-l-warning-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 bg-warning-50 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-semibold text-navy-950 tabular-nums mb-2">$4.2M</div>
            <p className="text-sm text-navy-600">
              average cost of an AI-targeted breach in 2024
            </p>
          </div>

          <div
            className={`p-6 bg-white border border-navy-100 shadow-sm border-l-4 border-l-warning-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="w-10 h-10 bg-warning-50 flex items-center justify-center mb-4">
              <Volume2 className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-semibold text-navy-950 tabular-nums mb-2">340%</div>
            <p className="text-sm text-navy-600">
              increase in deepfake attacks on voice systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

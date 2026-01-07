'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

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

export function FinalCTA() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-navy-800/50 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-700/50 blur-[100px]" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white/90">Start Protecting Today</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Secure Your Voice AI
            <br />
            <span className="text-navy-300">Before It's Too Late</span>
          </h2>

          <p
            className={`text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Stop wondering if you're vulnerable. Start with 500 free requests and see exactly what Ragaurd catches.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Link
              href="#beta"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-navy-950 hover:bg-navy-50 transition-all shadow-lg group"
            >
              Apply for Beta
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div
            className={`flex flex-wrap items-center justify-center gap-8 text-sm text-white/60 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-white/80" />
              <span>5 minute integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white/80" />
              <span>500 free requests/month</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-white/80" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


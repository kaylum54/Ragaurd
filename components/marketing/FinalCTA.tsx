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
    <section ref={sectionRef} className="py-24 md:py-32 bg-void relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 blur-[100px]" />
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Start Protecting Today</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Your Voice AI Is{' '}
            <span className="text-gradient-cyan">Under Attack</span>
          </h2>

          <p
            className={`text-lg md:text-xl text-white-60 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Stop wondering if you're vulnerable. Start with 500 free requests and see exactly what Ragaurd catches.
          </p>

          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Link
              href="/signup"
              className="btn-primary text-lg px-8 py-4 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demo"
              className="btn-secondary text-lg px-8 py-4"
            >
              Schedule Demo
            </Link>
          </div>

          <div
            className={`flex flex-wrap items-center justify-center gap-8 text-sm text-white-40 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-500" />
              <span>5 minute integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-secure-500" />
              <span>500 free requests/month</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

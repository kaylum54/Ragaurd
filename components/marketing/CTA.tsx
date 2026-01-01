'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Clock, Lock } from 'lucide-react';

const stats = [
  { value: '5 min', label: 'Integration', icon: Clock },
  { value: '6', label: 'Defense layers', icon: Shield },
  { value: '99.53%', label: 'Block rate', icon: Lock },
  { value: '<200ms', label: 'Latency', icon: Zap },
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

function AnimatedStat({ icon: Icon, value, label, delay }: { icon: typeof Shield; value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 border border-white/20 mb-3">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-xs text-white/60 mt-1">{label}</div>
    </div>
  );
}

export function CTA() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-navy-800/50 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-700/50 blur-[100px]" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 text-center rounded-xl">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Shield className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white/90">Get Protected</span>
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Your Agents Are Live.
              <br />
              <span className="text-navy-300">Enhance Your Security Today.</span>
            </h2>

            <p
              className={`text-lg text-white/70 max-w-xl mx-auto mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Voice AI attacks are documented, reproducible, and happening now.
              Add security enhancements before an incident — not after.
            </p>

            <div
              className={`mb-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-semibold bg-white text-navy-950 hover:bg-navy-50 transition-all shadow-lg group"
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-4 text-sm text-white/50">
                500 requests/month free - No credit card required
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-white/10">
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  delay={500 + index * 100}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

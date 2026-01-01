'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, AlertCircle, Code, Mic2, Calendar, Target, ShieldOff } from 'lucide-react';

const timeline = [
  { year: '2024', title: 'Early Adoption', description: 'Voice AI pilots begin, security overlooked', icon: Calendar, status: 'past' },
  { year: '2025', title: 'Production Scale', description: 'Enterprise deployments, attacks emerge', icon: Target, status: 'current' },
  { year: '2026', title: 'Critical Window', description: 'Attack sophistication outpaces defenses', icon: ShieldOff, status: 'future' },
];

const factors = [
  { icon: TrendingUp, text: 'Prompt injection techniques becoming more sophisticated with multi-turn attacks', color: 'warning' },
  { icon: Code, text: 'Open-source jailbreak repositories actively maintained and expanding', color: 'threat' },
  { icon: Mic2, text: 'Voice cloning quality now passes human verification', color: 'violet' },
  { icon: AlertCircle, text: 'AI-powered red teaming lowering the barrier for attackers', color: 'warning' },
];

function StatBlock({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 2000, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 4)) * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="bg-void-200 border border-white/5 p-6 text-center">
      <div className="text-4xl font-bold text-warning-400 tabular-nums">{count}{suffix}</div>
      <p className="mt-2 text-xs text-white-40 uppercase tracking-wider">{label}</p>
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

export function WhyNow() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warning-500/30 to-transparent" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-warning-500/10 border border-warning-500/30 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <AlertCircle className="w-4 h-4 text-warning-500" />
            <span className="text-xs font-semibold text-warning-400 uppercase tracking-wider">Time-Sensitive</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            The Risk Window Is{' '}
            <span className="text-warning-400">Open</span>
          </h2>

          <p
            className={`text-lg text-white-60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Voice AI adoption is accelerating. Enterprise deployments are scaling from pilots to production.
            Customer-facing agents are handling real conversations with real data.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {timeline.map((item) => {
              const isCurrent = item.status === 'current';
              const isFuture = item.status === 'future';
              
              return (
                <div
                  key={item.year}
                  className={`bg-void-200 p-6 text-center relative ${isCurrent ? 'ring-2 ring-warning-500 ring-inset' : ''}`}
                >
                  {isCurrent && <div className="absolute top-0 left-0 right-0 h-0.5 bg-warning-500" />}
                  
                  <div className={`w-12 h-12 mx-auto flex items-center justify-center mb-4 ${
                    isCurrent ? 'bg-warning-500/20 text-warning-400' : isFuture ? 'bg-threat-500/20 text-threat-400' : 'bg-void-400 text-white-40'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  
                  <p className={`text-2xl font-bold ${isCurrent ? 'text-warning-400' : isFuture ? 'text-threat-400' : 'text-white-40'}`}>
                    {item.year}
                  </p>
                  <p className="text-sm font-semibold text-white mt-2">{item.title}</p>
                  <p className="text-xs text-white-40 mt-1">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`grid grid-cols-3 gap-px bg-white/5 max-w-2xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          <StatBlock value={10} suffix="x" label="Projected attack increase" />
          <StatBlock value={0} suffix="" label="Built-in security" />
          <StatBlock value={85} suffix="%" label="Enterprises unaware" />
        </div>

        <div
          className={`max-w-2xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <div className="bg-void-200 border border-warning-500/30 p-8 text-center">
            <p className="text-xl font-bold text-white mb-2">Security tooling hasn't kept pace.</p>
            <p className="text-white-60">
              Most voice AI platforms ship without built-in security. Protection is treated as an afterthought.
            </p>
          </div>
        </div>

        <div
          className={`max-w-4xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-2 h-2 bg-threat-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">The attack landscape is evolving</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {factors.map((factor, index) => {
              const colorStyles = {
                warning: 'text-warning-400',
                threat: 'text-threat-400',
                violet: 'text-violet-400',
              };
              return (
                <div
                  key={index}
                  className="bg-void-200 p-5 flex gap-4"
                >
                  <div className={`w-10 h-10 bg-void-400 flex items-center justify-center shrink-0 ${colorStyles[factor.color as keyof typeof colorStyles]}`}>
                    <factor.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-white-60 leading-relaxed">
                    {factor.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`mt-16 max-w-3xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <div className="bg-void-200 border-l-4 border-warning-500 p-6 flex items-center gap-6">
            <p className="text-base font-medium text-white">
              The question isn't whether to add security. It's whether you add it before or after an incident.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

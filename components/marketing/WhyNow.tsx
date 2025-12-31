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
  { icon: Mic2, text: 'Voice cloning quality now passes human verification', color: 'cyan' },
  { icon: AlertCircle, text: 'AI-powered red teaming lowering the barrier for attackers', color: 'warning' },
];

// Progress ring stat
function StatRing({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
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

  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (count / value) * circumference;
  const strokeColor = color === 'threat' ? '#f43f5e' : color === 'warning' ? '#f59e0b' : '#00e5ff';

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="36" fill="none" strokeWidth="4" className="stroke-void-300" />
          <circle
            cx="48" cy="48" r="36" fill="none" strokeWidth="4" strokeLinecap="round"
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={hasAnimated ? offset : circumference}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{count}{suffix}</span>
        </div>
      </div>
      <p className="mt-3 text-xs text-void-600 text-center max-w-[120px]">{label}</p>
    </div>
  );
}

// Scroll animation hook
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-void-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void to-void-50" />
      <div className="absolute inset-0 bg-grid-noir opacity-20" />

      {/* Divider */}
      <div className="divider-cyan absolute top-0" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`badge-threat mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Time-Sensitive</span>
          </div>

          <h2
            className={`heading-1 text-white mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            The Risk Window Is<br />
            <span className="gradient-text-mixed">Open — And Widening</span>
          </h2>

          <p
            className={`text-lg text-void-700 leading-relaxed opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Voice AI adoption is accelerating. Enterprise deployments are scaling from pilots to production.
            Customer-facing agents are handling real conversations with real data.
          </p>
        </div>

        {/* Timeline - horizontal on desktop */}
        <div
          className={`max-w-4xl mx-auto mb-20 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-void-400 via-warning-500 to-threat-500" />

            <div className="grid md:grid-cols-3 gap-8">
              {timeline.map((item, index) => {
                const statusStyles = {
                  past: 'border-void-400 bg-void-200 text-void-600',
                  current: 'border-warning-500 bg-warning-500/20 text-warning-400 animate-pulse-glow',
                  future: 'border-threat-500 bg-threat-500/20 text-threat-400',
                };
                const yearColor = item.status === 'current' ? 'text-warning-400' : item.status === 'future' ? 'text-threat-400' : 'text-void-500';

                return (
                  <div key={item.year} className="flex flex-col items-center text-center">
                    <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${statusStyles[item.status as keyof typeof statusStyles]}`}>
                      <item.icon className="w-7 h-7" />
                    </div>
                    <p className={`text-2xl font-bold mt-4 ${yearColor}`}>{item.year}</p>
                    <p className="text-sm font-semibold text-white mt-1">{item.title}</p>
                    <p className="text-xs text-void-600 mt-1">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key statement */}
        <div
          className={`max-w-2xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          <div className="noir-card rounded-2xl p-8 text-center border-l-4 border-warning-500">
            <p className="text-xl font-semibold text-white mb-2">Security tooling hasn't kept pace.</p>
            <p className="text-void-600">
              Most voice AI platforms ship without built-in security. Protection is treated as an afterthought.
            </p>
          </div>
        </div>

        {/* Stats with rings */}
        <div
          className={`flex flex-wrap justify-center gap-12 mb-16 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <StatRing value={10} suffix="x" label="Projected increase in voice AI attacks" color="threat" />
          <StatRing value={0} suffix="" label="Built-in security on most platforms" color="warning" />
          <StatRing value={85} suffix="%" label="Enterprises unaware of voice AI risks" color="cyan" />
        </div>

        {/* Attack factors grid */}
        <div
          className={`max-w-4xl mx-auto opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-threat-500 animate-pulse" />
            <h3 className="text-base font-semibold text-white">The attack landscape is evolving</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {factors.map((factor, index) => {
              const colorStyles = {
                warning: 'bg-warning-500/10 text-warning-400',
                threat: 'bg-threat-500/10 text-threat-400',
                cyan: 'bg-cyan-500/10 text-cyan-400',
              };
              return (
                <div
                  key={index}
                  className="group noir-card-glow rounded-xl p-5 flex gap-4"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${colorStyles[factor.color as keyof typeof colorStyles]}`}>
                    <factor.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-void-600 leading-relaxed group-hover:text-void-700 transition-colors">
                    {factor.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 max-w-3xl mx-auto opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <div className="noir-card rounded-xl p-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-warning-500 to-threat-500" />
              <p className="text-base font-medium text-white">
                The question isn't whether to add security. It's whether you add it before or after an incident.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

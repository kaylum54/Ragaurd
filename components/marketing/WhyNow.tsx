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
  { icon: Code, text: 'Open-source jailbreak repositories actively maintained and expanding', color: 'danger' },
  { icon: Mic2, text: 'Voice cloning quality now passes human verification', color: 'navy' },
  { icon: AlertCircle, text: 'AI-powered red teaming lowering the barrier for attackers', color: 'warning' },
];

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
  const strokeColor = color === 'danger' ? '#ef4444' : color === 'warning' ? '#f59e0b' : '#3b7cb8';

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90">
          <circle cx="48" cy="48" r="36" fill="none" strokeWidth="4" className="stroke-navy-700" />
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
      <p className="mt-3 text-xs text-navy-400 text-center max-w-[120px]">{label}</p>
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
    <section ref={sectionRef} className="py-20 md:py-28 bg-navy-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-warning-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-danger-500/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="whynow-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#whynow-grid)" />
        </svg>
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning-500/10 border border-warning-500/20 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <AlertCircle className="w-4 h-4 text-warning-500" />
            <span className="text-xs font-semibold text-warning-500 uppercase tracking-wider">Time-Sensitive</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            The Risk Window Is<br />
            <span className="bg-gradient-to-r from-warning-400 via-danger-400 to-warning-500 bg-clip-text text-transparent">Open — And Widening</span>
          </h2>

          <p
            className={`text-lg text-white/50 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Voice AI adoption is accelerating. Enterprise deployments are scaling from pilots to production.
            Customer-facing agents are handling real conversations with real data.
          </p>
        </div>

        {/* Timeline */}
        <div
          className={`max-w-4xl mx-auto mb-20 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-navy-600 via-warning-500 to-danger-500" />

            <div className="grid md:grid-cols-3 gap-8">
              {timeline.map((item) => {
                const statusStyles = {
                  past: 'border-navy-600 bg-navy-800/50 text-navy-400',
                  current: 'border-warning-500 bg-warning-500/10 text-warning-400 shadow-lg shadow-warning-500/20',
                  future: 'border-danger-500 bg-danger-500/10 text-danger-400',
                };
                const yearColor = item.status === 'current' ? 'text-warning-400' : item.status === 'future' ? 'text-danger-400' : 'text-navy-500';

                return (
                  <div key={item.year} className="flex flex-col items-center text-center">
                    <div className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-all ${statusStyles[item.status as keyof typeof statusStyles]}`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <p className={`text-3xl font-bold mt-5 ${yearColor}`}>{item.year}</p>
                    <p className="text-sm font-semibold text-white mt-2">{item.title}</p>
                    <p className="text-xs text-navy-400 mt-1">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Key statement */}
        <div
          className={`max-w-2xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-warning-500/50 via-warning-500/20 to-warning-500/50">
            <div className="bg-navy-900/90 backdrop-blur-xl rounded-2xl p-8 text-center">
              <p className="text-xl font-bold text-white mb-3">Security tooling hasn't kept pace.</p>
              <p className="text-navy-400">
                Most voice AI platforms ship without built-in security. Protection is treated as an afterthought.
              </p>
            </div>
          </div>
        </div>

        {/* Stats with rings */}
        <div
          className={`flex flex-wrap justify-center gap-12 mb-16 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <StatRing value={10} suffix="x" label="Projected increase in voice AI attacks" color="danger" />
          <StatRing value={0} suffix="" label="Built-in security on most platforms" color="warning" />
          <StatRing value={85} suffix="%" label="Enterprises unaware of voice AI risks" color="navy" />
        </div>

        {/* Attack factors grid */}
        <div
          className={`max-w-4xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-danger-500 animate-pulse" />
            <h3 className="text-base font-semibold text-white">The attack landscape is evolving</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {factors.map((factor, index) => {
              const colorStyles = {
                warning: 'bg-warning-500/10 text-warning-400 border-warning-500/20',
                danger: 'bg-danger-500/10 text-danger-400 border-danger-500/20',
                navy: 'bg-navy-500/10 text-navy-300 border-navy-500/20',
              };
              return (
                <div
                  key={index}
                  className={`group relative rounded-xl p-5 flex gap-4 border backdrop-blur-sm transition-all hover:-translate-y-1 ${colorStyles[factor.color as keyof typeof colorStyles]}`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-white/5`}>
                    <factor.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
                    {factor.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 max-w-3xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-warning-500/30 via-danger-500/30 to-warning-500/30">
            <div className="bg-navy-900/90 backdrop-blur-xl rounded-xl p-6 flex items-center gap-6">
              <div className="w-1.5 h-14 rounded-full bg-gradient-to-b from-warning-500 to-danger-500 shrink-0" />
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

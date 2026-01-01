'use client';

import { useEffect, useRef, useState } from 'react';
import { TrendingUp, AlertCircle, Code, Mic2, Calendar, Target, ShieldOff } from 'lucide-react';
import { ThreatInterceptionBackground } from './shared/ThreatInterceptionBackground';

const timeline = [
  { year: '2024', title: 'Early Adoption', description: 'Voice AI pilots begin, security overlooked', icon: Calendar, status: 'past' },
  { year: '2025', title: 'Critical Window', description: 'Enterprise deployments, attacks emerge', icon: Target, status: 'past' },
  { year: '2026', title: 'Maximum Risk', description: 'Attack sophistication outpaces defenses', icon: ShieldOff, status: 'current' },
];

const factors = [
  { icon: TrendingUp, text: 'Prompt injection techniques becoming more sophisticated with multi-turn attacks' },
  { icon: Code, text: 'Open-source jailbreak repositories actively maintained and expanding' },
  { icon: Mic2, text: 'Voice cloning quality now passes human verification' },
  { icon: AlertCircle, text: 'AI-powered red teaming lowering the barrier for attackers' },
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
    <div ref={ref} className="bg-white border border-navy-100 p-6 text-center shadow-sm">
      <div className="text-4xl font-bold text-navy-950 tabular-nums">{count}{suffix}</div>
      <p className="mt-2 text-sm text-navy-500">{label}</p>
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-white relative overflow-hidden" id="now">
      <ThreatInterceptionBackground accentColor="danger" opacity={0.6} centerOpacity={0.9} />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`inline-block text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Time-Sensitive
          </span>

          <h2
            className={`heading-1 mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            The Risk Window Is{' '}
            <span className="text-danger-500">Open</span>
          </h2>

          <p
            className={`body-large opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
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
          <div className="grid md:grid-cols-3 gap-6">
            {timeline.map((item) => {
              const isCurrent = item.status === 'current';
              const isFuture = item.status === 'future';
              
              return (
                <div
                  key={item.year}
                  className={`bg-white p-6 text-center relative border ${
                    isCurrent ? 'border-navy-950 shadow-lg' : 'border-navy-100'
                  }`}
                >
                  {isCurrent && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-navy-950 text-white text-xs font-bold uppercase tracking-wider">Now</div>}
                  
                  <div className={`w-12 h-12 mx-auto flex items-center justify-center mb-4 ${
                    isCurrent ? 'bg-navy-950 text-white' : isFuture ? 'bg-danger-50 text-danger-500' : 'bg-navy-100 text-navy-500'
                  }`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  
                  <p className={`text-2xl font-bold ${isCurrent ? 'text-navy-950' : isFuture ? 'text-danger-500' : 'text-navy-400'}`}>
                    {item.year}
                  </p>
                  <p className="text-sm font-semibold text-navy-950 mt-2">{item.title}</p>
                  <p className="text-xs text-navy-500 mt-1">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
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
          <div className="bg-navy-950 p-8 text-center text-white">
            <p className="text-xl font-bold mb-2">Security tooling hasn't kept pace.</p>
            <p className="text-white/70">
              Most voice AI platforms ship without built-in security. Protection is treated as an afterthought.
            </p>
          </div>
        </div>

        <div
          className={`max-w-4xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-2 h-2 bg-danger-500 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-navy-950 uppercase tracking-wider">The attack landscape is evolving</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {factors.map((factor, index) => (
              <div
                key={index}
                className="bg-white border border-navy-100 p-5 flex gap-4 shadow-sm"
              >
                <div className="w-10 h-10 bg-navy-50 flex items-center justify-center shrink-0 text-navy-600">
                  <factor.icon className="w-5 h-5" />
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {factor.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-16 max-w-3xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <div className="bg-navy-950 p-6 flex items-center gap-6 text-white">
            <p className="text-base font-medium">
              The question isn't whether to add security. It's whether you add it before or after an incident.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

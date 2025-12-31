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

// Magnetic button hook
function useMagneticButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const maxDistance = 100;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance;
        setOffset({ x: distanceX * strength * 0.3, y: distanceY * strength * 0.3 });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { buttonRef, offset };
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
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-cyan-400" />
      </div>
      <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
      <div className="text-xs text-void-600 mt-1">{label}</div>
    </div>
  );
}

export function CTA() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  const { buttonRef, offset } = useMagneticButton();

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-noir-mesh" />
      <div className="divider-glow absolute top-0" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-breathe" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <div className="noir-card rounded-3xl p-10 md:p-14 text-center">
            {/* Badge */}
            <div
              className={`badge-cyan mb-8 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Get Protected</span>
            </div>

            {/* Headline */}
            <h2
              className={`heading-1 text-white mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Your Agents Are Live.<br />
              <span className="gradient-text-cyan">Enhance Your Security Today.</span>
            </h2>

            {/* Subtext */}
            <p
              className={`text-lg text-void-700 max-w-xl mx-auto mb-10 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Voice AI attacks are documented, reproducible, and happening now.
              Add security enhancements before an incident — not after.
            </p>

            {/* CTA Button - Magnetic */}
            <div
              className={`mb-12 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <Link
                ref={buttonRef}
                href="/signup"
                className="magnetic-btn group inline-flex items-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-void font-bold text-lg px-10 py-5 rounded-2xl transition-all hover:shadow-glow-cyan"
                style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="mt-4 text-sm text-void-600">
                500 requests/month free • No credit card required
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-void-300">
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

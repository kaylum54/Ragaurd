'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

// Animated counter hook with scroll trigger
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Live threat counter that increments
function useLiveThreatCounter() {
  const [count, setCount] = useState(847293);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return count;
}

// Hero Background with animated gradient
function HeroBackground() {
  return (
    <>
      <div className="hero-gradient-bg">
        <div className="hero-grid-overlay" />
        {/* Security nodes */}
        <div className="security-node" style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
        <div className="security-node" style={{ top: '60%', left: '80%', animationDelay: '-2s' }} />
        <div className="security-node" style={{ top: '40%', left: '60%', animationDelay: '-4s' }} />
        <div className="security-node" style={{ top: '75%', left: '25%', animationDelay: '-1s' }} />
        <div className="security-node" style={{ top: '30%', left: '85%', animationDelay: '-3s' }} />
      </div>
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
    </>
  );
}

// Threat visualization shield
function ThreatShield() {
  const threatCount = useLiveThreatCounter();

  return (
    <div className="relative">
      {/* Outer glow rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-72 h-72 rounded-full border border-navy-400/20 animate-pulse-subtle" />
        <div className="absolute w-56 h-56 rounded-full border border-navy-400/30" />
      </div>

      {/* Main shield container */}
      <div className="relative w-52 h-52 rounded-full bg-navy-900/80 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-navy-glow-lg">
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-navy-800/50 to-transparent" />

        {/* Center content */}
        <div className="relative text-center z-10">
          <div className="text-4xl font-bold text-white tabular-nums">
            {threatCount.toLocaleString()}
          </div>
          <div className="text-xs text-navy-300 uppercase tracking-wider mt-1">
            Threats Blocked
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full animate-pulse-subtle shadow-lg" />
        <div className="absolute top-6 -left-2 w-3 h-3 bg-navy-400 rounded-full animate-pulse-subtle" style={{ animationDelay: '-0.5s' }} />
      </div>
    </div>
  );
}

// Stat card component
function StatCard({
  icon: Icon,
  value,
  label,
  delay
}: {
  icon: typeof Shield;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <div
      className="glass-card-dark rounded-xl p-4 opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-navy-300" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-white/50">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { count: blockRate, ref: blockRateRef } = useCounter(99, 1500);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <HeroBackground />

      <div className="container relative z-10 py-20 md:py-32">
        {/* Grid layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left content - spans 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 badge-navy-dark opacity-0 ${isLoaded ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Enterprise Voice AI Security</span>
            </div>

            {/* Main headline */}
            <h1
              className={`heading-display text-white opacity-0 ${isLoaded ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Protect Your Voice AI
              <br />
              <span className="text-navy-300">From Every Threat</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-xl text-white/60 max-w-xl leading-relaxed opacity-0 ${isLoaded ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
            >
              Prompt injection. Jailbreaking. Data exfiltration.
              <span className="text-white"> Ragaurd adds a defense layer </span>
              between your voice agents and the threats targeting them.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-wrap gap-4 opacity-0 ${isLoaded ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              <Link
                href="/signup"
                className="btn-primary-light group text-lg px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-outline-light text-lg px-8 py-4"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust indicator */}
            <p
              className={`text-sm text-white/40 opacity-0 ${isLoaded ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}
            >
              500 free requests/month &bull; No credit card required &bull; 5 minute integration
            </p>
          </div>

          {/* Right content - spans 5 columns */}
          <div className="lg:col-span-5 relative">
            {/* Threat shield - centered */}
            <div
              className={`flex justify-center lg:justify-end opacity-0 ${isLoaded ? 'animate-slide-left' : ''}`}
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <ThreatShield />
            </div>

            {/* Floating stat cards */}
            <div className="hidden lg:block absolute -left-16 top-4">
              <StatCard icon={Shield} value="6" label="Defense Layers" delay={800} />
            </div>

            <div className="hidden lg:block absolute -left-12 bottom-4">
              <StatCard icon={Zap} value="<20ms" label="Avg Latency" delay={950} />
            </div>

            <div className="hidden lg:block absolute right-0 -bottom-8">
              <div ref={blockRateRef}>
                <StatCard icon={Lock} value={`${blockRate}.53%`} label="Block Rate" delay={1100} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats row - mobile only */}
        <div className="grid grid-cols-3 gap-4 mt-12 lg:hidden">
          <StatCard icon={Shield} value="6" label="Defense Layers" delay={800} />
          <StatCard icon={Zap} value="<20ms" label="Avg Latency" delay={950} />
          <div ref={blockRateRef}>
            <StatCard icon={Lock} value={`${blockRate}.53%`} label="Block Rate" delay={1100} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

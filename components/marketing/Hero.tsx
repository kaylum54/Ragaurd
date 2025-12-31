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

// Floating geometric shapes
function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large cyan orb */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 float-element"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Violet orb */}
      <div
        className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full opacity-20 float-element-delay-1"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Small floating elements */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-float-diagonal opacity-60" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-violet-500 rounded-full animate-float-diagonal opacity-40" style={{ animationDelay: '-5s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-float-diagonal opacity-50" style={{ animationDelay: '-10s' }} />
      <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-threat-400 rounded-full animate-float-diagonal opacity-40" style={{ animationDelay: '-15s' }} />

      {/* Orbital rings */}
      <div className="absolute top-20 right-20 w-32 h-32 orbital-ring" style={{ animationDuration: '25s' }} />
      <div className="absolute bottom-40 right-40 w-48 h-48 orbital-ring" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
    </div>
  );
}

// Threat visualization orb
function ThreatOrb() {
  const threatCount = useLiveThreatCounter();

  return (
    <div className="relative">
      {/* Pulsing rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-64 h-64 rounded-full border border-threat-500/20 animate-ping-ring" />
        <div className="absolute w-48 h-48 rounded-full border border-threat-500/30 animate-ping-ring" style={{ animationDelay: '-0.5s' }} />
        <div className="absolute w-32 h-32 rounded-full border border-threat-500/40 animate-ping-ring" style={{ animationDelay: '-1s' }} />
      </div>

      {/* Main orb */}
      <div className="relative w-56 h-56 rounded-full bg-void-100 border border-threat-500/30 flex items-center justify-center glow-threat">
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-threat-600/20 to-transparent" />

        {/* Scan line */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-threat-500/10 via-transparent to-transparent animate-scan-beam" />
        </div>

        {/* Center content */}
        <div className="relative text-center z-10">
          <div className="text-3xl font-bold text-threat-400 tabular-nums">
            {threatCount.toLocaleString()}
          </div>
          <div className="text-xs text-threat-500/80 uppercase tracking-wider mt-1">
            Attacks Today
          </div>
        </div>

        {/* Threat indicators */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-threat-500 rounded-full animate-pulse" />
        <div className="absolute top-8 -left-4 w-3 h-3 bg-threat-400 rounded-full animate-pulse" style={{ animationDelay: '-0.5s' }} />
        <div className="absolute -bottom-1 right-8 w-2 h-2 bg-threat-600 rounded-full animate-pulse" style={{ animationDelay: '-1s' }} />
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
      className="noir-card-glow rounded-xl p-4 opacity-0 animate-cascade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-void-600">{label}</div>
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-void">
      {/* Background layers */}
      <div className="absolute inset-0 bg-noir-mesh" />
      <div className="absolute inset-0 bg-grid-noir opacity-50" />
      <div className="noise-overlay" />

      {/* Floating shapes */}
      <FloatingShapes />

      {/* Gradient overlays */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void to-transparent" />

      <div className="container relative z-10 py-20 md:py-32">
        {/* Asymmetric grid layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left content - spans 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 badge-cyan opacity-0 ${isLoaded ? 'animate-hero-rise' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Voice AI Security Layer</span>
            </div>

            {/* Main headline - dramatic sizing */}
            <h1
              className={`heading-display text-white opacity-0 ${isLoaded ? 'animate-hero-rise' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Your Voice Agents
              <br />
              <span className="gradient-text-cyan">Are Under Attack</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-xl text-void-700 max-w-xl leading-relaxed opacity-0 ${isLoaded ? 'animate-hero-rise' : ''}`}
              style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
            >
              Prompt injection. Social engineering. Data exfiltration.
              <span className="text-white"> Ragaurd adds a security layer </span>
              between your voice AI and the threats targeting it.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-wrap gap-4 opacity-0 ${isLoaded ? 'animate-hero-rise' : ''}`}
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              <Link
                href="/signup"
                className="btn-primary group text-lg px-8 py-4"
              >
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="btn-secondary text-lg px-8 py-4"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust indicator */}
            <p
              className={`text-sm text-void-600 opacity-0 ${isLoaded ? 'animate-hero-rise' : ''}`}
              style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}
            >
              500 free requests/month • No credit card required • 5 min integration
            </p>
          </div>

          {/* Right content - spans 5 columns, offset */}
          <div className="lg:col-span-5 relative">
            {/* Threat orb - positioned off-center */}
            <div
              className={`flex justify-center lg:justify-end lg:-mr-8 opacity-0 ${isLoaded ? 'animate-hero-slide-left' : ''}`}
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <ThreatOrb />
            </div>

            {/* Floating stat cards - asymmetric positioning */}
            <div className="hidden lg:block absolute -left-12 top-0">
              <StatCard icon={Shield} value="6" label="Defense Layers" delay={800} />
            </div>

            <div className="hidden lg:block absolute -left-8 bottom-8">
              <StatCard icon={Zap} value="<20ms" label="Avg Latency" delay={950} />
            </div>

            <div className="hidden lg:block absolute right-0 -bottom-4">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-hero-fade" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
        <div className="flex flex-col items-center gap-2 text-void-600">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-void-600 to-transparent" />
        </div>
      </div>
    </section>
  );
}

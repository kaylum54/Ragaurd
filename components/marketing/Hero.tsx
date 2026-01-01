'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock, ShieldCheck } from 'lucide-react';

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

function HeroBackground() {
  return (
    <>
      <div className="hero-gradient-bg">
        <div className="hero-grid-overlay" />
        
        {/* Hexagonal security pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="rgba(139, 189, 232, 0.5)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
        
        {/* Radial gradient overlays for depth */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-navy-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-navy-400/8 rounded-full blur-[100px]" />
        
        {/* Security nodes with connecting lines */}
        <div className="security-node" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
        <div className="security-node" style={{ top: '25%', left: '25%', animationDelay: '-1s' }} />
        <div className="security-node" style={{ top: '70%', left: '85%', animationDelay: '-2s' }} />
        <div className="security-node" style={{ top: '45%', left: '70%', animationDelay: '-4s' }} />
        <div className="security-node" style={{ top: '80%', left: '20%', animationDelay: '-1.5s' }} />
        <div className="security-node" style={{ top: '35%', left: '90%', animationDelay: '-3s' }} />
        <div className="security-node" style={{ top: '60%', left: '40%', animationDelay: '-2.5s' }} />
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent" />
    </>
  );
}

function ThreatShield() {
  const threatCount = useLiveThreatCounter();

  return (
    <div className="relative">
      {/* Animated outer rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-80 h-80 rounded-full border border-navy-400/10 animate-[spin_30s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-400/40 rounded-full" />
        </div>
        <div className="absolute w-72 h-72 rounded-full border border-navy-400/20 animate-[spin_25s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-navy-300/50 rounded-full" />
        </div>
        <div className="absolute w-64 h-64 rounded-full border border-navy-400/30" />
      </div>

      {/* Inner glow ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-navy-500/20 to-transparent animate-pulse-subtle" />
      </div>

      {/* Main shield container */}
      <div className="relative w-56 h-56 rounded-full flex items-center justify-center">
        {/* Glass background */}
        <div className="absolute inset-0 rounded-full bg-navy-900/60 backdrop-blur-xl border border-white/10 shadow-2xl" />
        
        {/* Inner gradient ring */}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-navy-700/50 via-transparent to-navy-800/50" />
        
        {/* Animated scan line */}
        <div className="absolute inset-4 rounded-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-300/10 to-transparent animate-[scan_3s_ease-in-out_infinite]" 
               style={{ transform: 'translateY(-100%)' }} />
        </div>

        {/* Center content */}
        <div className="relative text-center z-10">
          <div className="flex items-center justify-center mb-2">
            <ShieldCheck className="w-8 h-8 text-navy-300" />
          </div>
          <div className="text-4xl font-bold text-white tabular-nums tracking-tight">
            {threatCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-navy-300 uppercase tracking-[0.2em] mt-1 font-medium">
            Threats Blocked
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute -top-2 -right-2">
          <div className="relative">
            <div className="w-5 h-5 bg-success-500 rounded-full animate-pulse-subtle shadow-lg shadow-success-500/50" />
            <div className="absolute inset-0 w-5 h-5 bg-success-500 rounded-full animate-ping opacity-50" />
          </div>
        </div>
        
        <div className="absolute top-8 -left-4">
          <div className="w-3 h-3 bg-navy-400 rounded-full animate-pulse-subtle" style={{ animationDelay: '-0.5s' }} />
        </div>
        
        <div className="absolute -bottom-1 right-8">
          <div className="w-2.5 h-2.5 bg-navy-300 rounded-full animate-pulse-subtle" style={{ animationDelay: '-1s' }} />
        </div>
      </div>
    </div>
  );
}

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
      className="relative group opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      {/* Glass card with gradient border */}
      <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/20 via-white/5 to-transparent">
        <div className="bg-navy-900/80 backdrop-blur-xl rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-700 to-navy-800 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5 text-navy-300" />
            </div>
            <div>
              <div className="text-xl font-bold text-white tracking-tight">{value}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-navy-400/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
    </div>
  );
}

export function Hero() {
  const { count: blockRate, ref: blockRateRef } = useCounter(99, 1500);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <HeroBackground />

      <div className="container relative z-10 py-24 md:py-32">
        {/* Grid layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left content - spans 7 columns */}
          <div className="lg:col-span-7 space-y-8">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Enterprise Voice AI Security</span>
            </div>

            {/* Main headline */}
            <h1
              className="animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Protect Your
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-2">
                <span className="bg-gradient-to-r from-navy-300 via-navy-200 to-navy-400 bg-clip-text text-transparent">Voice AI</span>
              </span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mt-2">
                From Every Threat
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed animate-fade-up"
              style={{ animationDelay: '350ms' }}
            >
              Prompt injection. Jailbreaking. Data exfiltration.
              <span className="text-white/80"> Ragaurd adds a defense layer </span>
              between your voice agents and the threats targeting them.
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-4 pt-2 animate-fade-up"
              style={{ animationDelay: '500ms' }}
            >
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300"
              >
                {/* Button gradient background */}
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-navy-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <span className="relative text-navy-950">Start Free Trial</span>
                <ArrowRight className="relative w-5 h-5 text-navy-950 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/30 transition-all duration-300"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="flex flex-wrap items-center gap-6 pt-4 animate-fade-up"
              style={{ animationDelay: '650ms' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-navy-400" />
                <span className="text-sm text-white/40">500 free requests/month</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-navy-400" />
                <span className="text-sm text-white/40">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-navy-400" />
                <span className="text-sm text-white/40">5 minute integration</span>
              </div>
            </div>
          </div>

          {/* Right content - spans 5 columns */}
          <div className="lg:col-span-5 relative">
            {/* Threat shield - centered */}
            <div
              className="flex justify-center lg:justify-end animate-slide-left"
              style={{ animationDelay: '400ms' }}
            >
              <ThreatShield />
            </div>

            {/* Floating stat cards */}
            <div className="hidden lg:block absolute -left-20 top-0">
              <StatCard icon={Shield} value="6" label="Defense Layers" delay={800} />
            </div>

            <div className="hidden lg:block absolute -left-16 bottom-8">
              <StatCard icon={Zap} value="<20ms" label="Avg Latency" delay={950} />
            </div>

            <div className="hidden lg:block absolute right-4 -bottom-12">
              <div ref={blockRateRef}>
                <StatCard icon={Lock} value={`${blockRate}.53%`} label="Block Rate" delay={1100} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats row - mobile only */}
        <div className="grid grid-cols-3 gap-4 mt-16 lg:hidden">
          <StatCard icon={Shield} value="6" label="Defense Layers" delay={800} />
          <StatCard icon={Zap} value="<20ms" label="Avg Latency" delay={950} />
          <div ref={blockRateRef}>
            <StatCard icon={Lock} value={`${blockRate}.53%`} label="Block Rate" delay={1100} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1.5s' }}>
        <div className="flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock, CheckCircle2, Play } from 'lucide-react';

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
    <div className="absolute inset-0 bg-navy-950 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,124,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,124,184,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="absolute top-0 right-0 w-1/2 h-full">
        <div className="absolute inset-0 bg-gradient-to-l from-navy-800/50 via-transparent to-transparent" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-navy-500/10 blur-[100px]" />
        <div className="absolute bottom-40 right-40 w-[300px] h-[300px] bg-navy-400/5 blur-[80px]" />
      </div>

      <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-navy-500/30 to-transparent" />
      <div className="absolute top-1/3 left-20 w-px h-48 bg-gradient-to-b from-transparent via-navy-400/20 to-transparent" />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-navy-500/30 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />
    </div>
  );
}

function SecurityVisualization() {
  const threatCount = useLiveThreatCounter();

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-0 bg-navy-500/5 blur-[60px]" />
      
      <div className="relative bg-navy-900/80 border border-navy-700/50 backdrop-blur-sm p-8">
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-navy-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-navy-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-navy-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-navy-500" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-success-500 animate-pulse" />
          <span className="text-xs text-navy-300 uppercase tracking-widest font-medium">Live Protection Active</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white tabular-nums tracking-tight">{threatCount.toLocaleString()}</span>
          </div>
          <p className="text-sm text-navy-400 uppercase tracking-wider">Threats Blocked Today</p>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-700/50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-[10px] text-navy-400 uppercase tracking-wider mt-1">Defense Layers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">&lt;20ms</div>
              <div className="text-[10px] text-navy-400 uppercase tracking-wider mt-1">Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.5%</div>
              <div className="text-[10px] text-navy-400 uppercase tracking-wider mt-1">Block Rate</div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-navy-500/10 blur-xl" />
      </div>
    </div>
  );
}

export function Hero() {
  const { count: blockRate, ref: blockRateRef } = useCounter(99, 1500);

  return (
    <section className="relative min-h-screen flex items-center">
      <HeroBackground />

      <div className="container relative z-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

          <div className="space-y-8">
            <div
              className="inline-flex items-center gap-3 px-4 py-2 bg-navy-800/50 border border-navy-700/50 animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="w-2 h-2 bg-success-500" />
              <span className="text-xs font-medium text-navy-200 uppercase tracking-wider">Enterprise-Grade Voice AI Security</span>
            </div>

            <h1
              className="animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Stop Attacks on
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mt-2 text-navy-300">
                Your Voice Agents
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mt-2">
                Before They Start
              </span>
            </h1>

            <p
              className="text-lg text-navy-300 max-w-lg leading-relaxed animate-fade-up"
              style={{ animationDelay: '350ms' }}
            >
              Ragaurd defends your voice AI from <span className="text-white font-medium">prompt injection</span>, <span className="text-white font-medium">jailbreaking</span>, and <span className="text-white font-medium">data exfiltration</span> with enterprise-grade protection that deploys in minutes.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{ animationDelay: '500ms' }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-navy-950 font-semibold text-lg hover:bg-navy-100 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-navy-600 text-white font-semibold text-lg hover:bg-navy-800/50 hover:border-navy-500 transition-all"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </Link>
            </div>

            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 animate-fade-up"
              style={{ animationDelay: '650ms' }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-sm text-navy-400">500 free requests/month</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-sm text-navy-400">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span className="text-sm text-navy-400">5 minute integration</span>
              </div>
            </div>
          </div>

          <div
            className="relative animate-fade-up lg:animate-slide-left"
            style={{ animationDelay: '400ms' }}
          >
            <SecurityVisualization />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1.5s' }}>
        <div className="flex flex-col items-center gap-3 text-navy-500">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll to learn more</span>
          <div className="w-px h-8 bg-gradient-to-b from-navy-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}

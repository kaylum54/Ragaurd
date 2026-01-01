'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Shield, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

function ThreatCounter() {
  const [count, setCount] = useState(847293);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-5xl md:text-6xl font-bold text-cyan-500 tabular-nums tracking-tight">
      {count.toLocaleString()}
    </div>
  );
}

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
      <div className="text-xs text-white-40 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void pt-20">
      <div className="hero-gradient" />
      <div className="grid-overlay" />
      <div className="scan-line" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-void pointer-events-none" />

      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-threat-500/10 border border-threat-500/30 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <AlertTriangle className="w-4 h-4 text-threat-500 animate-pulse" />
              <span className="text-xs font-semibold text-threat-400 uppercase tracking-wider">Live Threat Detection Active</span>
            </div>

            <h1 
              className={`heading-display text-white mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Your Voice AI Has a{' '}
              <span className="text-gradient-cyan">Security Hole</span>
            </h1>

            <p 
              className={`text-lg md:text-xl text-white-60 max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Attackers are already targeting production voice agents. Ragaurd blocks prompt injection, jailbreaking, and deepfake attacks with 99.53% accuracy — before they reach your AI.
            </p>

            <div 
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <Link
                href="/signup"
                className="btn-primary group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="btn-secondary group"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </Link>
            </div>
          </div>

          <div 
            className={`bg-void-200/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-threat-500 animate-pulse" />
                  <span className="text-xs font-semibold text-white-40 uppercase tracking-wider">Attacks Blocked Today</span>
                </div>
                <ThreatCounter />
                <p className="text-sm text-white-40 mt-4">
                  Real-time protection across all connected voice agents
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <AnimatedStat value="6" label="Defense Layers" delay={500} />
                <AnimatedStat value="<20ms" label="Latency" delay={600} />
                <AnimatedStat value="99.5%" label="Block Rate" delay={700} />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white-40">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-500" />
                  <span>5 minute integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secure-500" />
                  <span>SOC 2 compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secure-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white-40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}

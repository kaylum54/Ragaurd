'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Shield, Zap, CheckCircle2 } from 'lucide-react';

import { ThreatInterceptionBackground } from './shared/ThreatInterceptionBackground';

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
      <div className="text-3xl md:text-4xl font-bold text-navy-950">{value}</div>
      <div className="text-sm text-navy-500 mt-1">{label}</div>
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-32 md:pt-40">
      <ThreatInterceptionBackground />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 
              className={`heading-display mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Protect Your Voice AI
              <br />
              <span className="text-navy-500">From Day One</span>
            </h1>

            <p 
              className={`text-lg md:text-xl text-navy-600 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              Ragaurd blocks prompt injection, jailbreaking, and deepfake attacks with 99.53% accuracy. One API call. Five minute integration.
            </p>

            <div 
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <Link
                href="/signup"
                className="btn-primary group text-base px-8 py-4"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="btn-secondary group text-base px-8 py-4"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </Link>
            </div>
          </div>

          <div 
            className={`bg-white border border-navy-100 shadow-xl rounded-xl p-8 md:p-12 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <AnimatedStat value="99.53%" label="Block Rate" delay={500} />
              <AnimatedStat value="6" label="Defense Layers" delay={600} />
              <AnimatedStat value="<200ms" label="Latency" delay={700} />
              <AnimatedStat value="5 min" label="Integration" delay={800} />
            </div>

            <div className="mt-10 pt-8 border-t border-navy-100">
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-navy-500">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-navy-600" />
                  <span>No architecture changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-navy-600" />
                  <span>SOC 2 compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-navy-600" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

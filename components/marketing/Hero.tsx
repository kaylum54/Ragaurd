'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Shield, Zap, CheckCircle2 } from 'lucide-react';

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

function GridBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = requestAnimationFrame(() => {
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary Infrastructure Grid - The "Structural" Layer */}
      <div 
        className="absolute inset-0 opacity-[0.05] transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #0a1628 1.5px, transparent 1.5px), linear-gradient(to bottom, #0a1628 1.5px, transparent 1.5px)',
          backgroundSize: '100px 100px',
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 25%, transparent 75%, black 100%), linear-gradient(to right, black 0%, transparent 25%, transparent 75%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 25%, transparent 75%, black 100%), linear-gradient(to right, black 0%, transparent 25%, transparent 75%, black 100%)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'source-out'
        }}
      />
      
      {/* Secondary Dynamic Grid - The "Data" Layer (Softer, denser) */}
      <div 
        className="absolute inset-0 opacity-[0.02] transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #0a1628 1px, transparent 1px), linear-gradient(to bottom, #0a1628 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `translate(${mousePos.x * 1.1}px, ${mousePos.y * 1.1}px) rotate(0.5deg)`,
          maskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 100%)'
        }}
      />

      {/* Tertiary Horizon Lines - The "Architecture" Layer */}
      <div 
        className="absolute inset-0 opacity-[0.015] transition-transform duration-1000 ease-out"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #0a1628 1px, transparent 1px)',
          backgroundSize: '400px 100%',
          transform: `translate(${mousePos.x * 1.8}px, ${mousePos.y * 0.6}px) rotate(-1deg)`,
          maskImage: 'linear-gradient(to right, black 0%, transparent 35%, transparent 65%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 35%, transparent 65%, black 100%)'
        }}
      />
      
      {/* Global atmosphere and softening */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_95%)] opacity-50" />
    </div>
  );
}

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-20">
      <GridBackground />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-navy-50 border border-navy-200 rounded-full mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Shield className="w-4 h-4 text-navy-600" />
              <span className="text-sm font-medium text-navy-700">AI Security for Voice Agents</span>
            </div>

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

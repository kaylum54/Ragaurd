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

interface ThreatLine {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  speed: number;
  delay: number;
}

function ThreatInterceptionBackground() {
  const [lines, setLines] = useState<ThreatLine[]>([]);

  useEffect(() => {
    const generateLines = (): ThreatLine[] => {
      const newLines: ThreatLine[] = [];
      const lineCount = 18;
      
      for (let i = 0; i < lineCount; i++) {
        const side = i % 4;
        let startX: number, startY: number, angle: number;
        
        if (side === 0) {
          startX = 5 + Math.random() * 90;
          startY = -10;
          angle = 170 + Math.random() * 20;
        } else if (side === 1) {
          startX = 110;
          startY = 5 + Math.random() * 50;
          angle = 200 + Math.random() * 30;
        } else if (side === 2) {
          startX = -10;
          startY = 5 + Math.random() * 50;
          angle = 310 + Math.random() * 30;
        } else {
          startX = 10 + Math.random() * 80;
          startY = -15;
          angle = 165 + Math.random() * 30;
        }
        
        newLines.push({
          id: i,
          startX,
          startY,
          angle,
          length: 60 + Math.random() * 80,
          speed: 15 + Math.random() * 10,
          delay: i * 1.2 + Math.random() * 3,
        });
      }
      return newLines;
    };

    setLines(generateLines());
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {lines.map((line) => {
        const radians = (line.angle * Math.PI) / 180;
        const translateX = Math.cos(radians) * 400;
        const translateY = Math.sin(radians) * 400;
        
        return (
          <div
            key={line.id}
            className="absolute bg-navy-950"
            style={{
              left: `${line.startX}%`,
              top: `${line.startY}%`,
              width: `${line.length}px`,
              height: '1.5px',
              opacity: 0,
              transform: `rotate(${line.angle}deg)`,
              animation: `threatMove ${line.speed}s ease-in-out ${line.delay}s infinite`,
              ['--tx' as string]: `${translateX}px`,
              ['--ty' as string]: `${translateY}px`,
            }}
          />
        );
      })}

      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.4) 75%, transparent 100%)',
        }}
      />

      <style jsx>{`
        @keyframes threatMove {
          0% {
            opacity: 0;
            transform: rotate(var(--angle, 180deg)) translateX(0) translateY(0);
          }
          8% {
            opacity: 0.18;
          }
          50% {
            opacity: 0.18;
          }
          75% {
            opacity: 0.08;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--angle, 180deg)) translateX(var(--tx)) translateY(var(--ty));
          }
        }
      `}</style>
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
      <ThreatInterceptionBackground />
      
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

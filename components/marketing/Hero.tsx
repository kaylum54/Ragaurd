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

interface ThreatRay {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  speed: number;
  delay: number;
  interceptLayer: 1 | 2 | 3;
  behavior: 'fade' | 'deflect' | 'fragment';
}

function ThreatInterceptionBackground() {
  const [rays, setRays] = useState<ThreatRay[]>([]);

  useEffect(() => {
    const generateRays = (): ThreatRay[] => {
      const newRays: ThreatRay[] = [];
      const rayCount = 24;
      
      for (let i = 0; i < rayCount; i++) {
        const quadrant = i % 4;
        let startX: number, startY: number, angle: number;
        
        if (quadrant === 0) {
          startX = 10 + Math.random() * 35;
          startY = -8;
          angle = 100 + Math.random() * 25;
        } else if (quadrant === 1) {
          startX = 55 + Math.random() * 35;
          startY = -8;
          angle = 55 + Math.random() * 25;
        } else if (quadrant === 2) {
          startX = -5;
          startY = 10 + Math.random() * 40;
          angle = 20 + Math.random() * 30;
        } else {
          startX = 105;
          startY = 10 + Math.random() * 40;
          angle = 130 + Math.random() * 30;
        }
        
        const interceptLayer = ((i % 3) + 1) as 1 | 2 | 3;
        const behaviors: Array<'fade' | 'deflect' | 'fragment'> = ['fade', 'deflect', 'fragment'];
        const behavior = behaviors[i % 3];
        
        newRays.push({
          id: i,
          startX,
          startY,
          angle,
          length: 100 + Math.random() * 60,
          speed: 8 + Math.random() * 6,
          delay: (i * 0.8) + Math.random() * 2,
          interceptLayer,
          behavior,
        });
      }
      return newRays;
    };

    setRays(generateRays());
  }, []);

  const getAnimationClass = (layer: number, behavior: string) => {
    if (behavior === 'fade') return `threatFadeL${layer}`;
    if (behavior === 'deflect') return `threatDeflectL${layer}`;
    return `threatFragmentL${layer}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Defense Layer 3 - Outermost perimeter */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[130%] border border-navy-300/30 rounded-full"
      />
      
      {/* Defense Layer 2 - Middle barrier */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[95%] border border-navy-400/35 rounded-full"
      />
      
      {/* Defense Layer 1 - Inner shield */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[65%] border-2 border-navy-500/25 rounded-full"
      />

      {/* Threat rays */}
      {rays.map((ray) => (
        <div
          key={ray.id}
          className="absolute bg-navy-800"
          style={{
            left: `${ray.startX}%`,
            top: `${ray.startY}%`,
            width: `${ray.length}px`,
            height: '2px',
            opacity: 0,
            transformOrigin: '0 50%',
            transform: `rotate(${ray.angle}deg)`,
            animation: `${getAnimationClass(ray.interceptLayer, ray.behavior)} ${ray.speed}s ease-out ${ray.delay}s infinite`,
          }}
        />
      ))}

      {/* Fragment particles - appear at interception points */}
      {rays.filter(r => r.behavior === 'fragment').map((ray) => (
        <div
          key={`frag-${ray.id}`}
          className="absolute"
          style={{
            left: `${ray.startX + 25}%`,
            top: `${ray.startY + 35}%`,
            opacity: 0,
            animation: `fragmentBurst ${ray.speed}s ease-out ${ray.delay + ray.speed * 0.5}s infinite`,
          }}
        >
          <div className="absolute w-1 h-1 bg-navy-600/60 -translate-x-1 -translate-y-1" />
          <div className="absolute w-1 h-1 bg-navy-600/40 translate-x-2 -translate-y-2" />
          <div className="absolute w-1 h-1 bg-navy-600/50 -translate-x-2 translate-y-1" />
        </div>
      ))}

      {/* Content protection zone - softens center for text readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 38% 32% at 50% 45%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 60%, transparent 100%)',
        }}
      />

      <style jsx>{`
        /* Layer 1 interceptions - closest to center, strongest defense */
        @keyframes threatFadeL1 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0); }
          15% { opacity: 0.35; }
          55% { opacity: 0.3; }
          70% { opacity: 0.1; }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(280px); }
        }
        @keyframes threatDeflectL1 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0) scaleX(1); }
          15% { opacity: 0.35; }
          50% { opacity: 0.3; transform: rotate(var(--angle)) translateX(200px) scaleX(1); }
          70% { opacity: 0.15; transform: rotate(calc(var(--angle) + 35deg)) translateX(260px) scaleX(0.5); }
          100% { opacity: 0; transform: rotate(calc(var(--angle) + 50deg)) translateX(320px) scaleX(0.2); }
        }
        @keyframes threatFragmentL1 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0) scaleX(1); }
          15% { opacity: 0.35; }
          50% { opacity: 0.3; transform: rotate(var(--angle)) translateX(180px) scaleX(1); }
          60% { opacity: 0.2; transform: rotate(var(--angle)) translateX(220px) scaleX(0.4); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(240px) scaleX(0); }
        }

        /* Layer 2 interceptions - middle defense */
        @keyframes threatFadeL2 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0); }
          12% { opacity: 0.32; }
          45% { opacity: 0.28; }
          65% { opacity: 0.08; }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(220px); }
        }
        @keyframes threatDeflectL2 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0) scaleX(1); }
          12% { opacity: 0.32; }
          40% { opacity: 0.28; transform: rotate(var(--angle)) translateX(150px) scaleX(1); }
          60% { opacity: 0.12; transform: rotate(calc(var(--angle) + 25deg)) translateX(200px) scaleX(0.6); }
          100% { opacity: 0; transform: rotate(calc(var(--angle) + 40deg)) translateX(260px) scaleX(0.3); }
        }
        @keyframes threatFragmentL2 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0) scaleX(1); }
          12% { opacity: 0.32; }
          40% { opacity: 0.28; transform: rotate(var(--angle)) translateX(140px) scaleX(1); }
          55% { opacity: 0.15; transform: rotate(var(--angle)) translateX(170px) scaleX(0.5); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(190px) scaleX(0); }
        }

        /* Layer 3 interceptions - outer perimeter */
        @keyframes threatFadeL3 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0); }
          10% { opacity: 0.28; }
          35% { opacity: 0.22; }
          55% { opacity: 0.05; }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(160px); }
        }
        @keyframes threatDeflectL3 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0) scaleX(1); }
          10% { opacity: 0.28; }
          30% { opacity: 0.22; transform: rotate(var(--angle)) translateX(100px) scaleX(1); }
          50% { opacity: 0.1; transform: rotate(calc(var(--angle) + 20deg)) translateX(140px) scaleX(0.7); }
          100% { opacity: 0; transform: rotate(calc(var(--angle) + 35deg)) translateX(180px) scaleX(0.4); }
        }
        @keyframes threatFragmentL3 {
          0% { opacity: 0; transform: rotate(var(--angle)) translateX(0) scaleX(1); }
          10% { opacity: 0.28; }
          30% { opacity: 0.22; transform: rotate(var(--angle)) translateX(90px) scaleX(1); }
          45% { opacity: 0.1; transform: rotate(var(--angle)) translateX(110px) scaleX(0.6); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateX(130px) scaleX(0); }
        }

        /* Fragment burst particles */
        @keyframes fragmentBurst {
          0%, 45% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.6; transform: scale(1); }
          70% { opacity: 0.3; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2); }
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

'use client';

import { useEffect, useState } from 'react';

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

export function ThreatInterceptionBackground({ 
  opacity = 1,
  centerOpacity = 0.7,
  accentColor = 'navy'
}: { 
  opacity?: number;
  centerOpacity?: number;
  accentColor?: 'navy' | 'danger';
}) {
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

  const rayColor = accentColor === 'danger' ? 'bg-danger-500/40' : 'bg-navy-800';
  const particleColor = accentColor === 'danger' ? 'bg-danger-400' : 'bg-navy-600';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
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
          className={`absolute ${rayColor}`}
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

      {/* Fragment particles */}
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
          <div className={`absolute w-1 h-1 ${particleColor}/60 -translate-x-1 -translate-y-1`} />
          <div className={`absolute w-1 h-1 ${particleColor}/40 translate-x-2 -translate-y-2`} />
          <div className={`absolute w-1 h-1 ${particleColor}/50 -translate-x-2 translate-y-1`} />
        </div>
      ))}

      {/* Content protection zone */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 38% 32% at 50% 45%, rgba(255,255,255,${centerOpacity}) 0%, rgba(255,255,255,${centerOpacity * 0.4}) 60%, transparent 100%)`,
        }}
      />

      <style jsx>{`
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

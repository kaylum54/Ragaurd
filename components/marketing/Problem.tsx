'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Shield, Database, Mic, FileWarning } from 'lucide-react';

const threats = [
  {
    icon: AlertTriangle,
    title: 'Prompt Injection',
    description: 'Hidden instructions override your agent\'s system prompt, taking control of responses.',
    stat: '73%',
    statLabel: 'of attacks',
  },
  {
    icon: Shield,
    title: 'Jailbreaking',
    description: 'Social engineering techniques bypass safety guidelines and restrictions.',
    stat: '52%',
    statLabel: 'success rate',
  },
  {
    icon: Database,
    title: 'Data Exfiltration',
    description: 'Attackers extract system prompts, business logic, and sensitive information.',
    stat: '89%',
    statLabel: 'leak rate',
  },
  {
    icon: Mic,
    title: 'Deepfake Audio',
    description: 'Voice cloning technology impersonates authorized users for verification bypass.',
    stat: '340%',
    statLabel: 'YoY increase',
  },
  {
    icon: FileWarning,
    title: 'Compliance Exposure',
    description: 'PII and PHI handling creates GDPR, HIPAA, and SOC2 compliance liability.',
    stat: '$4.5M',
    statLabel: 'avg breach cost',
  },
];

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export function Problem() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-white relative" id="problem">
      <div className="container relative">
        <div className="max-w-3xl mb-16">
          <span
            className={`inline-block text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            The Problem
          </span>

          <h2
            className={`heading-1 mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Voice AI is Being Deployed{' '}
            <span className="text-navy-500">Faster Than Security</span>
          </h2>

          <p
            className={`body-large max-w-2xl opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Sales agents, support bots, and healthcare assistants have direct access to customers and sensitive data—often without adequate protection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {threats.slice(0, 3).map((threat, index) => (
            <div
              key={threat.title}
              className={`card p-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-12 h-12 bg-navy-50 border border-navy-100 flex items-center justify-center mb-6">
                <threat.icon className="w-6 h-6 text-navy-600" />
              </div>

              <h3 className="text-lg font-semibold text-navy-950 mb-3">{threat.title}</h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-6">
                {threat.description}
              </p>

              <div className="pt-4 border-t border-navy-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-navy-950">{threat.stat}</span>
                  <span className="text-xs text-navy-500">{threat.statLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {threats.slice(3).map((threat, index) => (
            <div
              key={threat.title}
              className={`card p-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: `${700 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-12 h-12 bg-navy-50 border border-navy-100 flex items-center justify-center mb-6">
                <threat.icon className="w-6 h-6 text-navy-600" />
              </div>

              <h3 className="text-lg font-semibold text-navy-950 mb-3">{threat.title}</h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-6">
                {threat.description}
              </p>

              <div className="pt-4 border-t border-navy-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-navy-950">{threat.stat}</span>
                  <span className="text-xs text-navy-500">{threat.statLabel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 p-8 bg-navy-950 text-white relative opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 max-w-4xl">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-danger-500 rounded-full animate-pulse" />
            </div>

            <div>
              <p className="text-xl font-semibold mb-2">
                These aren't theoretical risks.
              </p>
              <p className="text-white/70">
                They're documented attack patterns being used against production voice agents right now.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

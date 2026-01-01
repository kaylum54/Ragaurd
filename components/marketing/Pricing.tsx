'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';

const plans = [
  { name: 'Free', price: '$0', period: '/month', description: 'Get started', textDefense: '500/mo', audioDefense: '—', redTeam: '—', apiKeys: '1', latency: 'Best effort', support: 'Community', cta: 'Start Free', href: '/signup' },
  { name: 'Starter', price: '$79', period: '/month', description: 'Small teams', textDefense: '25,000/mo', audioDefense: '—', redTeam: '—', apiKeys: '3', latency: '<500ms', support: 'Email', cta: 'Get Started', href: '/signup?plan=starter' },
  { name: 'Pro', price: '$249', period: '/month', description: 'Growing teams', textDefense: '150,000/mo', audioDefense: '50,000/mo', redTeam: '1,000/mo', apiKeys: '10', latency: '<200ms', support: 'Priority', cta: 'Get Started', href: '/signup?plan=pro', featured: true },
  { name: 'Business', price: '$649', period: '/month', description: 'Enterprise', textDefense: '500,000/mo', audioDefense: '200,000/mo', redTeam: '10,000/mo', apiKeys: '25', latency: '<100ms', support: 'Dedicated', cta: 'Get Started', href: '/signup?plan=business' },
];

const features = [
  { label: 'Text Defense', key: 'textDefense' },
  { label: 'Audio Defense', key: 'audioDefense' },
  { label: 'Red Team Testing', key: 'redTeam' },
  { label: 'API Keys', key: 'apiKeys' },
  { label: 'Latency SLA', key: 'latency' },
  { label: 'Support', key: 'support' },
];

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

export function Pricing() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-navy-950 relative" id="pricing">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy-700 to-transparent" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Pricing</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Simple, Transparent <span className="text-navy-300">Pricing</span>
          </h2>

          <p
            className={`text-lg text-navy-400 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            All plans include dashboard access, usage analytics, and threat logging.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-navy-800 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-navy-900 p-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''} ${plan.featured ? 'ring-2 ring-white ring-inset' : ''}`}
              style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {plan.featured && (
                <div className="absolute -top-px left-0 right-0 h-0.5 bg-white" />
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-navy-300">{plan.name}</span>
                  {plan.featured && (
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-white text-navy-950 uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                  <span className="text-sm text-navy-500">{plan.period}</span>
                </div>
                <p className="text-xs text-navy-500 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {features.map((feature) => {
                  const value = plan[feature.key as keyof typeof plan];
                  const isDisabled = value === '—';
                  return (
                    <div key={feature.key} className="flex items-center justify-between text-sm">
                      <span className="text-navy-500">{feature.label}</span>
                      <span className={`font-medium ${isDisabled ? 'text-navy-700' : 'text-white'}`}>
                        {isDisabled ? <X className="w-4 h-4" /> : value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Link
                href={plan.href}
                className={`block w-full py-3 px-4 text-sm font-semibold text-center transition-all ${
                  plan.featured
                    ? 'bg-white hover:bg-navy-100 text-navy-950'
                    : 'bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 hover:border-navy-600'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div
          className={`max-w-3xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <div className="bg-navy-900 border border-navy-800 p-8 text-center">
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-navy-600" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-navy-600" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-navy-600" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-navy-600" />
            
            <p className="text-lg font-semibold text-white mb-2">Need custom limits or on-premise deployment?</p>
            <p className="text-sm text-navy-400 mb-6">Enterprise plans include dedicated support, custom integrations, and SLAs.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-white font-medium hover:text-navy-300 transition-colors group"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

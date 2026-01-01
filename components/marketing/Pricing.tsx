'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X, Sparkles } from 'lucide-react';

const plans = [
  { name: 'Free', price: '$0', period: '/month', description: 'Try it out', textDefense: '500/mo', audioDefense: '—', redTeam: '—', apiKeys: '1', latency: 'Best effort', support: 'Community', cta: 'Start Free', href: '/signup' },
  { name: 'Starter', price: '$79', period: '/month', description: 'For small teams', textDefense: '25,000/mo', audioDefense: '—', redTeam: '—', apiKeys: '3', latency: '<500ms', support: 'Email', cta: 'Get Started', href: '/signup?plan=starter' },
  { name: 'Pro', price: '$249', period: '/month', description: 'Most popular', textDefense: '150,000/mo', audioDefense: '50,000/mo', redTeam: '1,000/mo', apiKeys: '10', latency: '<200ms', support: 'Priority', cta: 'Get Started', href: '/signup?plan=pro', featured: true },
  { name: 'Business', price: '$649', period: '/month', description: 'For enterprises', textDefense: '500,000/mo', audioDefense: '200,000/mo', redTeam: '10,000/mo', apiKeys: '25', latency: '<100ms', support: 'Dedicated', cta: 'Get Started', href: '/signup?plan=business' },
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-void-100 relative" id="pricing">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Pricing</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Simple, Transparent{' '}
            <span className="text-gradient-violet">Pricing</span>
          </h2>

          <p
            className={`text-lg text-white-60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            All plans include dashboard access, usage analytics, and threat logging.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-void-200 p-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''} ${plan.featured ? 'ring-2 ring-cyan-500 ring-inset' : ''}`}
              style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {plan.featured && (
                <div className="absolute -top-px left-0 right-0 h-0.5 bg-cyan-500" />
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white-60">{plan.name}</span>
                  {plan.featured && (
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan-500 text-void uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                  <span className="text-sm text-white-40">{plan.period}</span>
                </div>
                <p className="text-xs text-white-40 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {features.map((feature) => {
                  const value = plan[feature.key as keyof typeof plan];
                  const isDisabled = value === '—';
                  return (
                    <div key={feature.key} className="flex items-center justify-between text-sm">
                      <span className="text-white-40">{feature.label}</span>
                      <span className={`font-medium ${isDisabled ? 'text-white-20' : 'text-white'}`}>
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
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-void'
                    : 'bg-void-400 hover:bg-void-500 text-white border border-white/10 hover:border-white/20'
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
          <div className="bg-void-200 border border-white/10 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-violet-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-violet-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-violet-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-violet-500" />
            
            <p className="text-lg font-semibold text-white mb-2">Need custom limits or on-premise deployment?</p>
            <p className="text-sm text-white-40 mb-6">Enterprise plans include dedicated support, custom integrations, and SLAs.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors group"
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

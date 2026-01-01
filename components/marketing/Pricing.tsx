'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X } from 'lucide-react';

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
    <section ref={sectionRef} className="py-24 md:py-32 bg-white-off relative" id="pricing">
      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span
            className={`inline-block text-sm font-semibold text-navy-500 uppercase tracking-wider mb-4 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Pricing
          </span>

          <h2
            className={`heading-1 mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Simple, Transparent{' '}
            <span className="text-navy-500">Pricing</span>
          </h2>

          <p
            className={`body-large opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            All plans include dashboard access, usage analytics, and threat logging.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white border p-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''} ${
                plan.featured 
                  ? 'border-navy-950 shadow-xl' 
                  : 'border-navy-100 shadow-sm hover:shadow-md'
              } transition-shadow`}
              style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold px-3 py-1 bg-navy-950 text-white uppercase tracking-wider">
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6 pt-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-navy-600">{plan.name}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-navy-950 tracking-tight">{plan.price}</span>
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
                      <span className={`font-medium ${isDisabled ? 'text-navy-300' : 'text-navy-950'}`}>
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
                    ? 'bg-navy-950 hover:bg-navy-800 text-white'
                    : 'bg-white hover:bg-navy-50 text-navy-950 border border-navy-200 hover:border-navy-300'
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
          <div className="bg-navy-950 p-8 text-center text-white">
            <p className="text-lg font-semibold mb-2">Need custom limits or on-premise deployment?</p>
            <p className="text-sm text-white/70 mb-6">Enterprise plans include dedicated support, custom integrations, and SLAs.</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-white font-medium hover:underline group"
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

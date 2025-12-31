'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';

const plans = [
  { name: 'Free', price: '$0', period: '/month', description: 'Try it out', textDefense: '500/mo', audioDefense: '—', redTeam: '—', apiKeys: '1', latency: 'Best effort', support: 'Community', cta: 'Start free', href: '/signup' },
  { name: 'Starter', price: '$79', period: '/month', description: 'For small teams', textDefense: '25,000/mo', audioDefense: '—', redTeam: '—', apiKeys: '3', latency: '<500ms', support: 'Email', cta: 'Get started', href: '/signup?plan=starter' },
  { name: 'Pro', price: '$249', period: '/month', description: 'Most popular', textDefense: '150,000/mo', audioDefense: '50,000/mo', redTeam: '1,000/mo', apiKeys: '10', latency: '<200ms', support: 'Priority', cta: 'Get started', href: '/signup?plan=pro', featured: true },
  { name: 'Business', price: '$649', period: '/month', description: 'For enterprises', textDefense: '500,000/mo', audioDefense: '200,000/mo', redTeam: '10,000/mo', apiKeys: '25', latency: '<100ms', support: 'Dedicated', cta: 'Get started', href: '/signup?plan=business' },
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-void relative" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-noir-radial opacity-20" />
      <div className="divider-noir absolute top-0" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`badge-cyan mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pricing</span>
          </div>

          <h2
            className={`heading-1 text-white mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Pricing That<br />
            <span className="gradient-text-cyan">Scales With You</span>
          </h2>

          <p
            className={`text-lg text-void-700 leading-relaxed opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            All plans include dashboard access, usage analytics, and threat logging.
          </p>

          <div
            className={`inline-flex items-center gap-2 mt-6 text-sm text-void-600 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Check className="w-4 h-4 text-secure-500" />
            No credit card required for free tier
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group relative noir-card-glow rounded-2xl p-6 opacity-0 hover-lift ${isVisible ? 'animate-cascade-up' : ''} ${
                plan.featured ? 'ring-2 ring-cyan-500/50 glow-cyan' : ''
              }`}
              style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 text-void text-[10px] font-bold uppercase tracking-wide rounded-full shadow-lg shadow-cyan-500/30">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5 pt-2">
                <div className="text-sm font-medium text-void-600">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-void-500">{plan.period}</span>
                </div>
                <div className="text-xs text-void-500 mt-1">{plan.description}</div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {features.map((feature) => {
                  const value = plan[feature.key as keyof typeof plan];
                  const isDisabled = value === '—';
                  return (
                    <div key={feature.key} className="flex items-center justify-between text-sm">
                      <span className="text-void-600">{feature.label}</span>
                      <span className={`font-medium ${isDisabled ? 'text-void-400' : 'text-void-700'}`}>
                        {isDisabled ? <X className="w-4 h-4 text-void-400" /> : value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all ${
                  plan.featured
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-void shadow-lg shadow-cyan-500/20'
                    : 'bg-void-200 hover:bg-void-300 text-white border border-void-400'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-all ${
                plan.featured ? 'bg-cyan-500' : 'bg-transparent group-hover:bg-void-400'
              }`} />
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div
          className={`opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
          style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
        >
          <div className="noir-card rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-sm text-void-600 max-w-lg">
                  Unlimited requests, custom limits, dedicated infrastructure, SLA guarantees, 24/7 support + TAM.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="btn-primary group shrink-0"
            >
              Contact sales
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

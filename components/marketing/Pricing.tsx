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
    <section ref={sectionRef} className="py-20 md:py-28 section-navy relative overflow-hidden" id="pricing">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="price-dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#price-dots)" />
        </svg>
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-navy-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] bg-navy-400/10 rounded-full blur-[100px]" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Sparkles className="w-4 h-4 text-navy-300" />
            <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Pricing</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Pricing That<br />
            <span className="bg-gradient-to-r from-navy-300 to-navy-200 bg-clip-text text-transparent">Scales With You</span>
          </h2>

          <p
            className={`text-lg text-white/50 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            All plans include dashboard access, usage analytics, and threat logging.
          </p>

          <div
            className={`inline-flex items-center gap-3 mt-8 text-sm text-white/50 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Check className="w-5 h-5 text-success-500" />
            <span>No credit card required for free tier</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group relative rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-2 opacity-0 ${isVisible ? 'animate-fade-up' : ''} ${
                plan.featured
                  ? 'bg-gradient-to-br from-navy-400/50 via-navy-500/30 to-navy-400/50'
                  : 'bg-white/5'
              }`}
              style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Card inner */}
              <div className={`relative h-full rounded-2xl p-6 ${
                plan.featured
                  ? 'bg-navy-900'
                  : 'bg-navy-900/80 backdrop-blur-xl'
              }`}>
                {/* Featured badge */}
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-navy-400 to-navy-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-navy-500/30">
                      <Sparkles className="w-3 h-3" />
                      Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6 pt-3">
                  <div className="text-sm font-medium text-navy-300">{plan.name}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                    <span className="text-sm text-white/40">{plan.period}</span>
                  </div>
                  <div className="text-xs text-white/40 mt-2">{plan.description}</div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {features.map((feature) => {
                    const value = plan[feature.key as keyof typeof plan];
                    const isDisabled = value === '—';
                    return (
                      <div key={feature.key} className="flex items-center justify-between text-sm">
                        <span className="text-white/50">{feature.label}</span>
                        <span className={`font-medium ${isDisabled ? 'text-white/20' : 'text-white/80'}`}>
                          {isDisabled ? <X className="w-4 h-4 text-white/20" /> : value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={`block w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-center transition-all duration-300 ${
                    plan.featured
                      ? 'bg-white hover:bg-navy-50 text-navy-950 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>

              {/* Glow effect for featured */}
              {plan.featured && (
                <div className="absolute inset-0 rounded-2xl bg-navy-400/20 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div
          className={`max-w-3xl mx-auto opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
        >
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-white/10 via-white/5 to-white/10">
            <div className="bg-navy-900/80 backdrop-blur-xl rounded-2xl p-8 text-center">
              <p className="text-lg font-semibold text-white mb-2">Need custom limits or on-premise deployment?</p>
              <p className="text-sm text-white/50 mb-6">Enterprise plans include dedicated support, custom integrations, and SLAs.</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm text-navy-300 hover:text-white font-medium transition-colors group"
              >
                Contact Sales
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

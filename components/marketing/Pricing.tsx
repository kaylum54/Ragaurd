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
    <section ref={sectionRef} className="py-16 md:py-20 section-navy relative overflow-hidden" id="pricing">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div
            className={`badge-navy-dark mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pricing</span>
          </div>

          <h2
            className={`heading-1 text-white mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Pricing That<br />
            <span className="text-navy-300">Scales With You</span>
          </h2>

          <p
            className={`text-lg text-white/60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            All plans include dashboard access, usage analytics, and threat logging.
          </p>

          <div
            className={`inline-flex items-center gap-2 mt-6 text-sm text-white/50 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <Check className="w-4 h-4 text-success-500" />
            No credit card required for free tier
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group relative glass-card-dark rounded-2xl p-6 opacity-0 transition-all duration-300 hover:-translate-y-1 ${isVisible ? 'animate-fade-up' : ''} ${plan.featured ? 'ring-2 ring-navy-400/50 shadow-navy-glow' : ''
                }`}
              style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-navy-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5 pt-2">
                <div className="text-sm font-medium text-navy-300">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
                <div className="text-xs text-white/40 mt-1">{plan.description}</div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {features.map((feature) => {
                  const value = plan[feature.key as keyof typeof plan];
                  const isDisabled = value === '—';
                  return (
                    <div key={feature.key} className="flex items-center justify-between text-sm">
                      <span className="text-white/50">{feature.label}</span>
                      <span className={`font-medium ${isDisabled ? 'text-white/30' : 'text-white/80'}`}>
                        {isDisabled ? <X className="w-4 h-4 text-white/30" /> : value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all ${plan.featured
                    ? 'bg-white hover:bg-navy-50 text-navy-950'
                    : 'bg-navy-800 hover:bg-navy-700 text-white border border-navy-600'
                  }`}
              >
                {plan.cta}
              </Link>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl transition-all ${plan.featured ? 'bg-navy-400' : 'bg-transparent group-hover:bg-navy-600'
                }`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

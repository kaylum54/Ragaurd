import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    requests: '500',
    features: ['Text defense', '1 API key', 'Community support'],
    cta: 'Start free',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/mo',
    requests: '150K',
    features: ['Text + Audio defense', 'Red team testing', '10 API keys', 'Priority support'],
    cta: 'Get started',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Business',
    price: '$649',
    period: '/mo',
    requests: '500K',
    features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
    cta: 'Get started',
    href: '/signup?plan=business',
  },
];

export function Pricing() {
  return (
    <section className="py-24 border-b border-neutral-800" id="pricing">
      <div className="container">
        {/* Section Label */}
        <div className="text-xs text-neutral-600 uppercase tracking-widest mb-16">
          Pricing
        </div>

        {/* Header */}
        <div className="max-w-xl mb-16">
          <h2 className="text-3xl font-medium text-white mb-4">
            Simple pricing.
            <br />
            <span className="text-neutral-600">No surprises.</span>
          </h2>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-px bg-neutral-800">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 ${plan.featured ? 'bg-neutral-900 border-t-2 border-white' : 'bg-black'}`}
            >
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <div className="text-sm text-neutral-400">{plan.name}</div>
                  <div className="mt-2">
                    <span className="text-3xl font-medium text-white mono">{plan.price}</span>
                    {plan.period && <span className="text-neutral-600 text-sm">{plan.period}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-medium text-white mono">{plan.requests}</div>
                  <div className="text-xs text-neutral-600 uppercase">requests/mo</div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-neutral-400">
                    <Check className="w-4 h-4 text-neutral-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-3 text-sm font-medium transition-colors ${
                  plan.featured
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'border border-neutral-800 text-white hover:bg-neutral-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-px bg-neutral-900 p-8 flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-400">Enterprise</div>
            <div className="text-sm text-neutral-500 mt-1">
              Unlimited requests, custom SLA, dedicated support
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-400 transition-colors"
          >
            Contact sales
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

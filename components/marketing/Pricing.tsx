import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with basic protection',
    requests: '500 requests/mo',
    features: ['Text defense (6 layers)', '1 API key', 'Community support', 'Basic analytics'],
    cta: 'Start free',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/month',
    description: 'Full protection suite',
    requests: '150K requests/mo',
    features: ['Text + Audio defense', 'Red team testing', '10 API keys', 'Priority support', 'Advanced analytics'],
    cta: 'Get started',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Business',
    price: '$649',
    period: '/month',
    description: 'For scaling teams',
    requests: '500K requests/mo',
    features: ['Everything in Pro', 'Dedicated support', 'SLA guarantee', 'Custom integrations', 'SSO'],
    cta: 'Get started',
    href: '/signup?plan=business',
  },
];

export function Pricing() {
  return (
    <section className="py-20" id="pricing">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-slate-400">
            Start free, upgrade as you grow. No hidden fees.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-lg border ${
                plan.featured
                  ? 'bg-blue-600/10 border-blue-500/30'
                  : 'bg-slate-800/30 border-slate-700/50'
              }`}
            >
              {plan.featured && (
                <div className="text-xs text-blue-400 font-medium mb-4">Most popular</div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-semibold text-white">{plan.price}</span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
                <div className="text-sm text-slate-400 mt-1">{plan.requests}</div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center py-2.5 text-sm font-medium rounded-md transition-colors ${
                  plan.featured
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-slate-700/50 text-white hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-8 max-w-5xl mx-auto p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-white">Enterprise</h3>
            <p className="text-sm text-slate-400 mt-1">
              Unlimited requests, custom SLA, dedicated support, on-premise options
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            Contact sales
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

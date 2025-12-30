import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Basic protection to get started',
    requests: '500 requests/mo',
    features: [
      'Text defense (6 layers)',
      '1 API key',
      'Community support',
      'Basic analytics',
      '1 team member',
    ],
    cta: 'Start free',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/month',
    description: 'Full protection for growing teams',
    requests: '150K requests/mo',
    features: [
      'Text + Audio defense',
      'Red team testing (5 scans/mo)',
      '10 API keys',
      'Priority support',
      'Advanced analytics',
      'Up to 5 team members',
    ],
    cta: 'Get started',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Business',
    price: '$649',
    period: '/month',
    description: 'For scaling organizations',
    requests: '500K requests/mo',
    features: [
      'Everything in Pro',
      'Red team (25 scans/mo)',
      'Unlimited API keys',
      'Dedicated support',
      '99.9% SLA',
      'SSO / SAML',
    ],
    cta: 'Get started',
    href: '/signup?plan=business',
  },
];

export function Pricing() {
  return (
    <section className="py-16 bg-white border-t border-midnight-200" id="pricing">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <h2 className="text-2xl font-semibold text-midnight-950">
            Pricing
          </h2>
          <p className="mt-2 text-sm text-midnight-600">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-6 rounded border transition-colors ${
                plan.featured
                  ? 'border-accent-600 bg-accent-50/30'
                  : 'border-midnight-200 hover:border-midnight-300'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-4">
                  <span className="inline-flex items-center px-2 py-0.5 bg-accent-600 text-white text-xs font-medium rounded">
                    Recommended
                  </span>
                </div>
              )}

              <div className={plan.featured ? 'pt-1' : ''}>
                <h3 className="text-base font-medium text-midnight-950">{plan.name}</h3>
                <p className="text-xs text-midnight-500 mt-0.5">{plan.description}</p>
              </div>

              <div className="mt-4 mb-6">
                <span className="text-3xl font-semibold text-midnight-950">{plan.price}</span>
                <span className="text-sm text-midnight-500">{plan.period}</span>
                <div className="text-xs font-medium text-accent-600 mt-1">{plan.requests}</div>
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-secure-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-midnight-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-6 w-full py-2 px-4 rounded text-sm font-medium text-center transition-colors ${
                  plan.featured
                    ? 'bg-midnight-800 hover:bg-midnight-900 text-white'
                    : 'bg-midnight-100 hover:bg-midnight-200 text-midnight-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-10 max-w-4xl">
          <div className="bg-midnight-800 rounded p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                <p className="text-sm text-midnight-400 mt-1 max-w-md">
                  Unlimited requests, custom SLA, dedicated support, on-premise options.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-midnight-50 text-midnight-900 font-medium px-4 py-2 rounded transition-colors shrink-0 text-sm"
              >
                Contact sales
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <p className="mt-8 text-xs text-midnight-500 max-w-4xl">
          14-day free trial on all paid plans. No credit card required.
        </p>
      </div>
    </section>
  );
}

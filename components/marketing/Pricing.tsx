import Link from 'next/link';
import { Check, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with basic protection',
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
    <section className="py-24 bg-white" id="pricing">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-2xl border-2 transition-all duration-200 ${
                plan.featured
                  ? 'border-violet-500 shadow-xl shadow-violet-500/10 scale-105'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-full shadow-lg">
                    <Zap className="w-3 h-3" />
                    Most popular
                  </span>
                </div>
              )}

              <div className={plan.featured ? 'pt-2' : ''}>
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mt-6 mb-8">
                <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-slate-500">{plan.period}</span>
                <div className="text-sm text-violet-600 font-medium mt-2">{plan.requests}</div>
              </div>

              <ul className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 w-full py-3 px-4 rounded-lg font-medium text-center transition-colors ${
                  plan.featured
                    ? 'bg-violet-600 hover:bg-violet-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-violet-600 to-sky-500 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">Enterprise</h3>
                <p className="text-violet-100 mt-2 max-w-md">
                  Unlimited requests, custom SLA, dedicated support, and on-premise options.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-violet-700 font-medium px-6 py-3 rounded-lg transition-colors shrink-0"
              >
                Contact sales
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <p className="text-center mt-10 text-slate-500">
          14-day free trial on all paid plans. No credit card required.
        </p>
      </div>
    </section>
  );
}

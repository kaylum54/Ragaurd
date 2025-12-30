import Link from 'next/link';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    subtext: 'per month',
    features: [
      '500 text requests/mo',
      '1 API key',
      'Community support',
      'Dashboard access',
    ],
    cta: 'Start Free',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Starter',
    price: '$79',
    subtext: 'per month',
    features: [
      '25,000 text requests/mo',
      '3 API keys',
      'Email support',
      '<500ms latency SLA',
    ],
    cta: 'Get Started',
    href: '/signup?plan=starter',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$249',
    subtext: 'per month',
    features: [
      '150,000 text requests/mo',
      '50,000 audio requests/mo',
      '1,000 red team attacks/mo',
      '10 API keys',
      'Priority support',
      '<200ms latency SLA',
    ],
    cta: 'Get Started',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Business',
    price: '$649',
    subtext: 'per month',
    features: [
      '500,000 text requests/mo',
      '200,000 audio requests/mo',
      '10,000 red team attacks/mo',
      '25 API keys',
      'Dedicated support',
      '<100ms latency SLA',
    ],
    cta: 'Get Started',
    href: '/signup?plan=business',
    featured: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    subtext: 'contact us',
    features: [
      'Unlimited requests',
      'Unlimited API keys',
      'Custom integrations',
      'Dedicated infrastructure',
      '24/7 support + TAM',
      '<50ms latency SLA',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section className="py-24 bg-bg-dark" id="pricing">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Pricing
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-bg-card-dark rounded-lg p-6 text-center ${
                plan.featured
                  ? 'border-2 border-primary'
                  : 'border border-border-dark'
              }`}
            >
              {/* Recommended Badge */}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="text-base font-semibold text-white mt-2">
                {plan.name}
              </div>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl md:text-4xl font-semibold text-white">
                  {plan.price}
                </span>
              </div>
              <div className="text-sm text-text-dark-muted">
                {plan.subtext}
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3 text-left">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-status-passed shrink-0 mt-0.5" />
                    <span className="text-sm text-text-dark-bg">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  href={plan.href}
                  className={`block w-full py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                    plan.featured
                      ? 'bg-primary hover:bg-primary-hover text-white'
                      : 'bg-transparent border border-border-dark hover:border-text-dark-muted text-text-dark-bg'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

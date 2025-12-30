import { Metadata } from 'next';
import { Pricing } from '@/components/marketing/Pricing';
import { CTA } from '@/components/marketing/CTA';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Voice AI security. Start free, scale as you grow.',
};

const faqs = [
  {
    question: 'What counts as a request?',
    answer: 'Each API call to our defense endpoints counts as one request. This includes text defense calls and audio defense calls (Pro+ plans).',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can upgrade or downgrade at any time. Changes take effect immediately, and we\'ll prorate your billing.',
  },
  {
    question: 'What happens if I exceed my limits?',
    answer: 'We\'ll notify you when you\'re approaching your limits. If you exceed them, requests will be rate-limited until your next billing cycle or until you upgrade.',
  },
  {
    question: 'Do you offer annual billing?',
    answer: 'Yes! Annual billing saves you 20% compared to monthly. Contact us for annual plans.',
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.',
  },
  {
    question: 'What\'s included in Enterprise?',
    answer: 'Enterprise includes unlimited requests, custom SLAs, dedicated support, on-premise deployment options, and custom integrations.',
  },
];

const allFeatures = [
  { category: 'Defense', features: ['Text defense (6 layers)', 'Audio deepfake detection', 'Real-time threat blocking', 'Custom defense profiles'] },
  { category: 'Testing', features: ['Red team scanning', 'Vulnerability reports', 'Attack simulation', 'Security scoring'] },
  { category: 'Analytics', features: ['Real-time dashboard', 'Usage analytics', 'Threat reports', 'API logs'] },
  { category: 'Support', features: ['Documentation', 'Email support', 'Priority support', 'Dedicated success manager'] },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-900">
              Plans for every stage of growth
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Start with our free tier and scale up as your needs grow.
              All plans include our core text defense features.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <Pricing />

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
              Everything you need to secure your AI
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {allFeatures.map((group) => (
              <Card key={group.category}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">{group.category}</h3>
                  <ul className="space-y-3">
                    {group.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
              Frequently asked questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}

import Link from 'next/link';
import { Check, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get started with basic protection',
    features: [
      { name: '500 text requests/mo', included: true },
      { name: '1 API key', included: true },
      { name: 'Community support', included: true },
      { name: 'Audio defense', included: false },
      { name: 'Red team testing', included: false },
      { name: 'Team members', included: false },
    ],
    cta: 'Start Free',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Starter',
    price: '$79',
    period: '/month',
    description: 'For growing applications',
    features: [
      { name: '25,000 text requests/mo', included: true },
      { name: '3 API keys', included: true },
      { name: 'Email support', included: true },
      { name: '3 team members', included: true },
      { name: '<500ms latency SLA', included: true },
      { name: 'Audio defense', included: false },
      { name: 'Red team testing', included: false },
    ],
    cta: 'Get Started',
    href: '/signup?plan=starter',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$249',
    period: '/month',
    description: 'Full security suite',
    features: [
      { name: '150,000 text requests/mo', included: true },
      { name: '50,000 audio requests/mo', included: true },
      { name: '1,000 red team attacks/mo', included: true },
      { name: '10 API keys', included: true },
      { name: '10 team members', included: true },
      { name: '<200ms latency SLA', included: true },
      { name: 'Priority support', included: true },
    ],
    cta: 'Get Started',
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Business',
    price: '$649',
    period: '/month',
    description: 'For large-scale deployments',
    features: [
      { name: '500,000 text requests/mo', included: true },
      { name: '200,000 audio requests/mo', included: true },
      { name: '10,000 red team attacks/mo', included: true },
      { name: '25 API keys', included: true },
      { name: '25 team members', included: true },
      { name: '<100ms latency SLA', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Advanced reports', included: true },
    ],
    cta: 'Get Started',
    href: '/signup?plan=business',
    popular: false,
  },
];

const enterprise = {
  name: 'Enterprise',
  description: 'Custom solutions for enterprise needs',
  features: [
    'Unlimited requests',
    'Unlimited team members',
    '<50ms latency SLA',
    '24/7 support + TAM',
    'Custom integrations',
    'SLA agreements',
    'On-premise options',
  ],
};

export function Pricing() {
  return (
    <section className="py-20 md:py-32 bg-slate-50" id="pricing">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col',
                plan.popular && 'border-primary-500 border-2 shadow-lg'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-success shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          !feature.included && 'text-muted-foreground'
                        )}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <Card className="bg-primary-900 text-white border-0">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {enterprise.name}
                </h3>
                <p className="text-primary-100 mb-6">{enterprise.description}</p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary-900 hover:bg-slate-100"
                  asChild
                >
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
              <div>
                <ul className="grid grid-cols-2 gap-3">
                  {enterprise.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-success shrink-0" />
                      <span className="text-sm text-primary-100">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

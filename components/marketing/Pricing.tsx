import Link from 'next/link';
import { Check, ArrowRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    description: 'Full protection suite for growing teams',
    requests: '150K requests/mo',
    features: [
      'Text + Audio defense',
      'Red team testing (5 scans/mo)',
      '10 API keys',
      'Priority email support',
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
      'Red team testing (25 scans/mo)',
      'Unlimited API keys',
      'Dedicated support',
      '99.9% SLA guarantee',
      'Custom integrations',
      'SSO / SAML',
      'Unlimited team members',
    ],
    cta: 'Get started',
    href: '/signup?plan=business',
  },
];

export function Pricing() {
  return (
    <section className="py-20 bg-slate-50" id="pricing">
      <div className="container">
        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative flex flex-col',
                plan.featured && 'border-primary-500 border-2 shadow-lg'
              )}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600">
                    <Zap className="w-3 h-3 mr-1" />
                    Most popular
                  </Badge>
                </div>
              )}

              <CardHeader className={cn(plan.featured && 'pt-8')}>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                  <div className="text-sm text-primary-600 font-medium mt-1">{plan.requests}</div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.featured ? 'default' : 'outline'}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enterprise */}
        <Card className="mt-8 max-w-5xl mx-auto bg-primary-50 border-primary-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold text-primary-900">Enterprise</h3>
                <p className="text-slate-600 mt-1">
                  Unlimited requests, custom SLA, dedicated support, and on-premise deployment options
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/contact">
                  Contact sales
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Money-back guarantee */}
        <div className="text-center mt-8 text-sm text-slate-500">
          14-day free trial on all paid plans. No credit card required.
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { CreditCard, Check, ArrowRight, ExternalLink, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useUsageStats } from '@/hooks/useUsage';

// Mock subscription data (would come from Stripe in production)
const subscription = {
  plan: 'pro',
  planName: 'Professional',
  status: 'active',
  currentPeriodStart: '2024-12-01',
  currentPeriodEnd: '2025-01-01',
  priceMonthly: 24900, // cents
};

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 7900,
    features: ['25K text requests', 'Email support', '3 team members'],
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 24900,
    features: ['150K text requests', '50K audio requests', '1K red team attacks', 'Priority support'],
    current: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 64900,
    features: ['500K text requests', '200K audio requests', '10K red team attacks', 'Dedicated support'],
  },
];

const invoices = [
  { id: 'inv_001', date: '2024-12-01', amount: 24900, status: 'paid' },
  { id: 'inv_002', date: '2024-11-01', amount: 24900, status: 'paid' },
  { id: 'inv_003', date: '2024-10-01', amount: 24900, status: 'paid' },
];

export default function BillingPage() {
  const { stats, loading } = useUsageStats();

  const textPercent = stats.text.limit > 0 ? (stats.text.used / stats.text.limit) * 100 : 0;
  const audioPercent = stats.audio.limit > 0 ? (stats.audio.used / stats.audio.limit) * 100 : 0;
  const redteamPercent = stats.redteam.limit > 0 ? (stats.redteam.used / stats.redteam.limit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your subscription renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </CardDescription>
            </div>
            <Badge variant="success" className="bg-success text-white">
              {subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-primary-100 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{subscription.planName}</div>
              <div className="text-muted-foreground">
                ${(subscription.priceMonthly / 100).toFixed(0)}/month
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Text Requests</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.text.used.toLocaleString()} / {stats.text.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={textPercent} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Audio Requests</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.audio.used.toLocaleString()} / {stats.audio.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={audioPercent} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Red Team Attacks</span>
                    <span className="text-sm text-muted-foreground">
                      {stats.redteam.used.toLocaleString()} / {stats.redteam.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={redteamPercent} className="h-2" />
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
          <Button variant="outline">Update Payment Method</Button>
        </CardFooter>
      </Card>

      {/* Available Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                'relative',
                plan.current && 'border-primary-500 border-2'
              )}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary-600">Current Plan</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div>
                  <span className="text-3xl font-bold">
                    ${(plan.price / 100).toFixed(0)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.current ? 'outline' : 'default'}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>
            Download past invoices and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${(invoice.amount / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="success" className="bg-success/10 text-success">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Download
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

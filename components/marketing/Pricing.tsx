import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    textDefense: '500/mo',
    audioDefense: '—',
    redTeam: '—',
    apiKeys: '1',
    latency: 'Best effort',
    support: 'Community',
    cta: 'Start free',
    href: '/signup',
  },
  {
    name: 'Starter',
    price: '$79',
    period: '/month',
    textDefense: '25,000/mo',
    audioDefense: '—',
    redTeam: '—',
    apiKeys: '3',
    latency: '<500ms',
    support: 'Email',
    cta: 'Get started',
    href: '/signup?plan=starter',
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/month',
    textDefense: '150,000/mo',
    audioDefense: '50,000/mo',
    redTeam: '1,000 attacks/mo',
    apiKeys: '10',
    latency: '<200ms',
    support: 'Priority',
    cta: 'Get started',
    href: '/signup?plan=pro',
    featured: true,
  },
  {
    name: 'Business',
    price: '$649',
    period: '/month',
    textDefense: '500,000/mo',
    audioDefense: '200,000/mo',
    redTeam: '10,000 attacks/mo',
    apiKeys: '25',
    latency: '<100ms',
    support: 'Dedicated',
    cta: 'Get started',
    href: '/signup?plan=business',
  },
];

const tableRows = [
  { label: 'Text Defense', key: 'textDefense' },
  { label: 'Audio Defense', key: 'audioDefense' },
  { label: 'Red Team Testing', key: 'redTeam' },
  { label: 'API Keys', key: 'apiKeys' },
  { label: 'Latency SLA', key: 'latency' },
  { label: 'Support', key: 'support' },
];

export function Pricing() {
  return (
    <section className="py-16 bg-white border-t border-midnight-200" id="pricing">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-xl mb-10">
          <h2 className="text-2xl font-semibold text-midnight-950">
            Pricing That Scales With You
          </h2>
          <p className="mt-2 text-sm text-midnight-600">
            All plans include access to the dashboard, usage analytics, and threat logging.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left py-3 pr-4 w-40"></th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    className={`text-left py-3 px-4 ${
                      plan.featured ? 'bg-accent-50/50' : ''
                    }`}
                  >
                    <div className="relative">
                      {plan.featured && (
                        <span className="absolute -top-6 left-0 text-[10px] font-medium px-2 py-0.5 bg-accent-600 text-white rounded">
                          Popular
                        </span>
                      )}
                      <div className="text-base font-medium text-midnight-950">{plan.name}</div>
                      <div className="mt-1">
                        <span className="text-2xl font-semibold text-midnight-950">{plan.price}</span>
                        <span className="text-sm text-midnight-500">{plan.period}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-100">
              {tableRows.map((row) => (
                <tr key={row.key}>
                  <td className="py-3 pr-4 text-sm font-medium text-midnight-700">{row.label}</td>
                  {plans.map((plan) => (
                    <td
                      key={plan.name}
                      className={`py-3 px-4 text-sm text-midnight-600 ${
                        plan.featured ? 'bg-accent-50/50' : ''
                      }`}
                    >
                      {plan[row.key as keyof typeof plan] === '—' ? (
                        <span className="text-midnight-400">—</span>
                      ) : (
                        plan[row.key as keyof typeof plan]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="py-4 pr-4"></td>
                {plans.map((plan) => (
                  <td
                    key={plan.name}
                    className={`py-4 px-4 ${plan.featured ? 'bg-accent-50/50' : ''}`}
                  >
                    <Link
                      href={plan.href}
                      className={`inline-block w-full py-2 px-4 rounded text-sm font-medium text-center transition-colors ${
                        plan.featured
                          ? 'bg-midnight-800 hover:bg-midnight-900 text-white'
                          : 'bg-midnight-100 hover:bg-midnight-200 text-midnight-900'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Enterprise */}
        <div className="mt-10 max-w-4xl">
          <div className="bg-midnight-800 rounded p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Enterprise</h3>
                <p className="text-sm text-midnight-400 mt-1 max-w-md">
                  Unlimited requests, custom limits, dedicated infrastructure, SLA guarantees, 24/7 support + TAM.
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

        {/* Note */}
        <p className="mt-6 text-xs text-midnight-500 max-w-4xl">
          Need higher volume? Enterprise plans include custom limits, dedicated infrastructure, and SLA guarantees.
        </p>
      </div>
    </section>
  );
}

import { Shield, Mic, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Text Defense',
    description: '6-layer detection: pattern matching, semantic analysis, embedding similarity, LLM guard, context validation, output filtering.',
    stat: '99.5%',
    statLabel: 'Detection rate',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description: 'Real-time deepfake detection using AASIST-L and LCNN models. Identify synthetic voices before they reach your agent.',
    stat: '0.83%',
    statLabel: 'Equal error rate',
    badge: 'Pro',
  },
  {
    icon: Target,
    title: 'Red Team Testing',
    description: 'Automated security scanning with 10,000+ attack vectors. Find vulnerabilities before attackers do.',
    stat: '10K+',
    statLabel: 'Attack vectors',
    badge: 'Pro',
  },
];

export function Features() {
  return (
    <section className="py-16 bg-white border-t border-midnight-200" id="features">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <h2 className="text-2xl font-semibold text-midnight-950">
            Complete protection stack
          </h2>
          <p className="mt-2 text-sm text-midnight-600">
            Multi-layer defense for text and audio, plus automated security testing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-white border border-midnight-200 rounded hover:border-midnight-300 transition-colors"
            >
              <div className="w-10 h-10 rounded bg-midnight-100 flex items-center justify-center mb-5">
                <feature.icon className="w-5 h-5 text-midnight-700" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-medium text-midnight-950">{feature.title}</h3>
                {feature.badge && (
                  <span className="text-xs font-medium px-1.5 py-0.5 bg-accent-50 text-accent-700 border border-accent-200 rounded">
                    {feature.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-midnight-600 leading-relaxed mb-6">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-midnight-100">
                <div className="text-xl font-semibold text-midnight-950 tabular-nums">{feature.stat}</div>
                <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide mt-0.5">{feature.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
          >
            View documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

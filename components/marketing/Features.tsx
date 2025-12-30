import { Shield, Mic, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Text Defense',
    description: '6-layer detection stack: pattern matching, semantic analysis, embedding similarity, LLM guard, context validation, and output filtering.',
    stat: '99.53%',
    statLabel: 'Detection rate',
    color: 'blue',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description: 'Real-time deepfake detection using AASIST-L and LCNN models. Identify synthetic voices before they reach your agent.',
    stat: '0.83%',
    statLabel: 'Equal error rate',
    color: 'purple',
    pro: true,
  },
  {
    icon: Target,
    title: 'Red Team Testing',
    description: 'Automated security scanning with 10,000+ attack vectors. Discover vulnerabilities before attackers do.',
    stat: '10K+',
    statLabel: 'Attack vectors',
    color: 'rose',
    pro: true,
  },
];

export function Features() {
  return (
    <section className="py-20" id="features">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Complete protection stack
          </h2>
          <p className="mt-3 text-slate-400">
            Multi-layer defense for text and audio, plus automated security testing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:border-slate-600/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                feature.color === 'blue' ? 'bg-blue-500/10' :
                feature.color === 'purple' ? 'bg-purple-500/10' :
                'bg-rose-500/10'
              }`}>
                <feature.icon className={`w-5 h-5 ${
                  feature.color === 'blue' ? 'text-blue-400' :
                  feature.color === 'purple' ? 'text-purple-400' :
                  'text-rose-400'
                }`} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                {feature.pro && (
                  <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">Pro</span>
                )}
              </div>

              <p className="text-sm text-slate-400 mb-6">
                {feature.description}
              </p>

              <div className="pt-4 border-t border-slate-700/50">
                <div className="text-2xl font-semibold text-white">{feature.stat}</div>
                <div className="text-xs text-slate-500">{feature.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View full documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

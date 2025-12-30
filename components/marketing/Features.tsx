import { Shield, Mic, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Shield,
    title: 'Text Defense',
    description: '6-layer detection stack: pattern matching, semantic analysis, embedding similarity, LLM guard, context validation, and output filtering.',
    stat: '99.5%',
    statLabel: 'Detection rate',
    color: 'violet',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description: 'Real-time deepfake detection using AASIST-L and LCNN models. Identify synthetic voices before they reach your agent.',
    stat: '0.83%',
    statLabel: 'Equal error rate',
    color: 'emerald',
    badge: 'Pro',
  },
  {
    icon: Target,
    title: 'Red Team Testing',
    description: 'Automated security scanning with 10,000+ attack vectors. Discover vulnerabilities before attackers do.',
    stat: '10K+',
    statLabel: 'Attack vectors',
    color: 'amber',
    badge: 'Pro',
  },
];

const colorClasses = {
  violet: {
    bg: 'bg-violet-100',
    icon: 'text-violet-600',
    stat: 'text-violet-600',
  },
  emerald: {
    bg: 'bg-emerald-100',
    icon: 'text-emerald-600',
    stat: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
    stat: 'text-amber-600',
  },
};

export function Features() {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Complete protection stack
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Multi-layer defense for text and audio, plus automated security testing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={feature.title}
                className="p-8 bg-white border border-slate-200 rounded-2xl hover:shadow-lg hover:border-slate-300 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colors.bg}`}>
                  <feature.icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  {feature.badge && (
                    <span className="text-xs font-medium px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  {feature.description}
                </p>

                <div className="pt-6 border-t border-slate-100">
                  <div className={`text-3xl font-bold ${colors.stat}`}>{feature.stat}</div>
                  <div className="text-sm text-slate-500 mt-1">{feature.statLabel}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
          >
            View full documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

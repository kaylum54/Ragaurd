import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const capabilities = [
  {
    id: '01',
    title: 'Text Defense',
    subtitle: '6-layer detection',
    description: 'Pattern matching, semantic analysis, embedding similarity, LLM guard, context validation, and output filtering. Each layer runs independently.',
    stat: '99.53%',
    statLabel: 'detection rate',
  },
  {
    id: '02',
    title: 'Audio Defense',
    subtitle: 'Deepfake detection',
    description: 'AASIST-L and LCNN models analyze voice patterns in real-time. Detect synthetic audio before it reaches your agent.',
    stat: '0.83%',
    statLabel: 'equal error rate',
    pro: true,
  },
  {
    id: '03',
    title: 'Red Team',
    subtitle: 'Automated testing',
    description: '10,000+ attack vectors run against your agent continuously. Find vulnerabilities before attackers do.',
    stat: '10K+',
    statLabel: 'attack vectors',
    pro: true,
  },
];

export function Features() {
  return (
    <section className="py-24 border-b border-neutral-800" id="features">
      <div className="container">
        {/* Section Label */}
        <div className="text-xs text-neutral-600 uppercase tracking-widest mb-16">
          Capabilities
        </div>

        {/* Feature List */}
        <div className="space-y-0">
          {capabilities.map((cap, index) => (
            <div
              key={cap.id}
              className="grid md:grid-cols-12 gap-8 py-12 border-t border-neutral-800 group"
            >
              {/* Number */}
              <div className="md:col-span-1">
                <span className="text-xs text-neutral-600 mono">{cap.id}</span>
              </div>

              {/* Title */}
              <div className="md:col-span-3">
                <h3 className="text-xl font-medium text-white">{cap.title}</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  {cap.subtitle}
                  {cap.pro && <span className="ml-2 text-xs text-blue-500 uppercase">Pro</span>}
                </p>
              </div>

              {/* Description */}
              <div className="md:col-span-5">
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>

              {/* Stat */}
              <div className="md:col-span-3 text-right">
                <div className="text-3xl font-medium text-white mono">{cap.stat}</div>
                <div className="text-xs text-neutral-600 uppercase tracking-wider mt-1">{cap.statLabel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex items-center gap-8">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-400 transition-colors"
          >
            View full documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';

const stats = [
  { value: '99.53%', label: 'Attack block rate' },
  { value: '0.00%', label: 'False positive rate' },
  { value: '<200ms', label: 'Response latency' },
  { value: '6', label: 'Defense layers' },
];

export function Hero() {
  return (
    <section className="relative bg-bg-dark pt-32 pb-20">
      <div className="container max-w-[800px] mx-auto text-center">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-white leading-[1.1]">
          Your Voice Agents Are Unprotected
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg md:text-xl text-text-dark-bg leading-relaxed max-w-[640px] mx-auto">
          Voice AI is entering production without security controls. Ragaurd is the
          defense layer that blocks prompt injection, jailbreaks, and deepfake audio
          before they reach your agents.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-medium px-8 py-4 rounded-md transition-colors"
          >
            Start Free
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center bg-transparent text-text-dark-bg border border-border hover:border-white font-medium px-8 py-4 rounded-md transition-colors"
          >
            View Documentation
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 pt-8 border-t border-border-dark">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-text-dark-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

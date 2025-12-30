import Link from 'next/link';

export function CTA() {
  return (
    <section className="py-24 bg-bg-dark">
      <div className="container max-w-[640px] text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Your Agents Are Live. Your Security Should Be Too.
        </h2>

        {/* Body */}
        <p className="mt-4 text-lg text-text-dark-bg">
          Voice AI attacks are documented, reproducible, and happening now. Ragaurd adds
          the security layer your agents are missing.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-white font-medium px-8 py-4 rounded-md transition-colors"
          >
            Start Free
          </Link>
        </div>

        {/* Secondary Text */}
        <p className="mt-3 text-sm text-text-dark-muted">
          500 requests/month &middot; No credit card required
        </p>
      </div>
    </section>
  );
}

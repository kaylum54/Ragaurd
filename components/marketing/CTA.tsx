import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative p-12 bg-card border border-[rgba(59,130,246,0.2)] rounded-lg overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] rounded-full mb-6">
              <Shield className="w-4 h-4 text-electric-400" />
              <span className="text-sm text-electric-400">Start protecting today</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-steel-100 leading-tight">
              Ready to secure your
              <span className="gradient-primary-text"> voice AI?</span>
            </h2>

            <p className="mt-4 text-steel-400 max-w-lg">
              500 free requests per month. No credit card required.
              Start protecting in under 5 minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center gap-2"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Request demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

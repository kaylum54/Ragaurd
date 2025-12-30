import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative p-12 bg-gradient-to-br from-blue-600/20 to-slate-800/50 border border-blue-500/20 rounded-lg overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Start protecting today</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
              Ready to secure your
              <span className="text-blue-500"> voice AI?</span>
            </h2>

            <p className="mt-4 text-slate-400 max-w-lg">
              500 free requests per month. No credit card required.
              Start protecting in under 5 minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 transition-colors"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700/50 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
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

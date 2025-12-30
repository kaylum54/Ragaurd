import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container">
        <div className="relative p-12 md:p-16 bg-gradient-to-br from-violet-600 via-violet-700 to-slate-900 rounded-3xl overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">Start protecting today</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready to secure your voice AI?
            </h2>

            <p className="mt-6 text-lg text-violet-200 max-w-lg mx-auto">
              500 free requests per month. No credit card required. Start protecting in under 5 minutes.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-violet-700 font-medium px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg backdrop-blur-sm transition-colors"
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

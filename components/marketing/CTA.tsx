import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-32 border-b border-neutral-800">
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-medium text-white leading-tight">
            Stop leaving your
            <br />
            <span className="text-neutral-600">voice AI exposed.</span>
          </h2>

          <p className="mt-8 text-lg text-neutral-500 max-w-lg">
            500 free requests per month. No credit card required.
            Start protecting in under 5 minutes.
          </p>

          <div className="mt-12 flex items-center gap-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors"
            >
              GET STARTED FREE
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="text-sm text-neutral-500 hover:text-white transition-colors"
            >
              Request demo →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

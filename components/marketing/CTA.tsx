import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 bg-[#F9FAFB] border-t border-midnight-200">
      <div className="container">
        <div className="bg-midnight-900 rounded p-8 md:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-white">
              Start protecting your voice AI
            </h2>

            <p className="mt-3 text-sm text-midnight-400">
              500 free requests per month. No credit card required. Deploy in under 5 minutes.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white hover:bg-midnight-50 text-midnight-900 font-medium px-4 py-2 rounded transition-colors text-sm"
              >
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 text-midnight-300 hover:text-white font-medium px-4 py-2 transition-colors text-sm"
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

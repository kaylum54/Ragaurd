import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 bg-white border-t border-midnight-200">
      <div className="container">
        <div className="bg-midnight-900 rounded p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-white">
              Your Agents Are Live. Your Security Should Be Too.
            </h2>

            <p className="mt-4 text-sm text-midnight-400 leading-relaxed">
              Voice AI attacks are documented, reproducible, and happening now. Every unprotected conversation is an opportunity for data exfiltration, prompt manipulation, or compliance failure.
            </p>

            <p className="mt-3 text-sm text-midnight-300">
              Ragaurd adds the security layer your voice agents are missing. One API. Real-time protection. Deployed in minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white hover:bg-midnight-50 text-midnight-900 font-medium px-5 py-2.5 rounded transition-colors text-sm"
              >
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-sm text-midnight-500">
                500 requests/month, no credit card
              </span>
            </div>

            <div className="mt-6">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-sm text-midnight-400 hover:text-midnight-200 font-medium transition-colors"
              >
                View Documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

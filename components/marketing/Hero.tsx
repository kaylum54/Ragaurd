import Link from 'next/link';
import { ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-20">
      <div className="container">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span className="text-sm text-blue-400">
              Protecting 50M+ API calls monthly
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1]">
            Security layer for
            <span className="text-blue-500"> Voice AI</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
            Protect your voice agents from prompt injection, jailbreaking, and deepfake attacks.
            One API call, complete protection.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors rounded-md"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 text-slate-300 hover:text-white transition-colors"
            >
              View documentation
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              5 minute setup
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              SOC2 compliant
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-slate-800/50">
          <div>
            <div className="text-3xl md:text-4xl font-semibold text-white">99.53%</div>
            <div className="text-sm text-slate-500 mt-1">Attack block rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-semibold text-white">&lt;200ms</div>
            <div className="text-sm text-slate-500 mt-1">Average latency</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-semibold text-green-500">0%</div>
            <div className="text-sm text-slate-500 mt-1">False positive rate</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-semibold text-white">6</div>
            <div className="text-sm text-slate-500 mt-1">Defense layers</div>
          </div>
        </div>

        {/* Platform Support */}
        <div className="mt-12 text-sm text-slate-600">
          Works with Vapi, Retell, Bland AI, and any voice platform
        </div>
      </div>
    </section>
  );
}

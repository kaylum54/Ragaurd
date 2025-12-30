import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-electric-500 rounded-full animate-pulse" />
            <span className="text-sm text-electric-400">
              Protecting 50M+ API calls monthly
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-steel-100 leading-[1.1] animate-slide-up">
            Security layer for
            <span className="gradient-primary-text"> Voice AI</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-steel-400 max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Protect your voice agents from prompt injection, jailbreaking, and deepfake attacks.
            One API call, complete protection.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/signup"
              className="btn-primary inline-flex items-center gap-2"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/docs"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View documentation
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-steel-500 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              5 minute setup
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              SOC2 compliant
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-[rgba(59,130,246,0.1)]">
          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-steel-100 tabular-nums">99.53%</div>
            <div className="text-sm text-steel-500 mt-1">Attack block rate</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-steel-100 tabular-nums">&lt;200ms</div>
            <div className="text-sm text-steel-500 mt-1">Average latency</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-success tabular-nums">0%</div>
            <div className="text-sm text-steel-500 mt-1">False positive rate</div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
            <div className="text-3xl md:text-4xl font-bold gradient-primary-text tabular-nums">6</div>
            <div className="text-sm text-steel-500 mt-1">Defense layers</div>
          </div>
        </div>

        {/* Platform Support */}
        <div className="mt-12 text-sm text-steel-600 animate-fade-in" style={{ animationDelay: '800ms' }}>
          Works with Vapi, Retell, Bland AI, and any voice platform
        </div>
      </div>
    </section>
  );
}

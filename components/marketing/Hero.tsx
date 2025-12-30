import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-white" />

      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 hero-mesh opacity-60" />

      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-full mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-violet-700">
              Trusted by 500+ voice AI companies
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-fade-up">
            Secure your
            <span className="gradient-text"> Voice AI</span>
            <br />
            in minutes
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-up-delay-1">
            Stop prompt injections, jailbreaks, and deepfakes before they reach your voice agents.
            One API. Complete protection.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up-delay-2">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-violet-500/25"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium px-6 py-3 rounded-lg border border-slate-200 transition-colors"
            >
              See it in action
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              SOC2 Compliant
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              &lt;200ms latency
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-violet-500" />
              No credit card required
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-slate-900 tabular-nums">99.5%</div>
            <div className="text-sm text-slate-500 mt-2">Block rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-slate-900 tabular-nums">&lt;200ms</div>
            <div className="text-sm text-slate-500 mt-2">Avg latency</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-emerald-600 tabular-nums">0%</div>
            <div className="text-sm text-slate-500 mt-2">False positives</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text tabular-nums">6</div>
            <div className="text-sm text-slate-500 mt-2">Defense layers</div>
          </div>
        </div>

        {/* Platform Logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 mb-6">Works with your favorite voice platforms</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <span className="font-semibold">Vapi</span>
            <span className="font-semibold">Retell</span>
            <span className="font-semibold">Bland AI</span>
            <span className="font-semibold">ElevenLabs</span>
            <span className="font-semibold">+ more</span>
          </div>
        </div>
      </div>
    </section>
  );
}

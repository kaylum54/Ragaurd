import Link from 'next/link';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 bg-[#F9FAFB]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-midnight-200 rounded mb-8">
            <span className="w-1.5 h-1.5 bg-secure-500 rounded-full" />
            <span className="text-xs font-medium text-midnight-600">
              Trusted by 500+ voice AI companies
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-midnight-950 leading-[1.15]">
            Voice AI Security
            <br />
            Infrastructure
          </h1>

          {/* Subheadline */}
          <p className="mt-5 text-base text-midnight-600 max-w-xl mx-auto leading-relaxed">
            Detect and block prompt injections, jailbreaks, and deepfakes before they reach your voice agents. One API. Enterprise-grade protection.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-midnight-800 hover:bg-midnight-900 text-white font-medium px-5 py-2.5 rounded transition-colors"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-white hover:bg-midnight-50 text-midnight-700 font-medium px-5 py-2.5 rounded border border-midnight-300 transition-colors"
            >
              Request demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-midnight-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-secure-600" />
              SOC2 Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-warning-600" />
              &lt;200ms latency
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-midnight-500" />
              No credit card required
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-4 bg-white border border-midnight-200 rounded">
            <div className="text-2xl font-semibold text-midnight-950 tabular-nums">99.5%</div>
            <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide mt-1">Block rate</div>
          </div>
          <div className="text-center p-4 bg-white border border-midnight-200 rounded">
            <div className="text-2xl font-semibold text-midnight-950 tabular-nums">&lt;200ms</div>
            <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide mt-1">Avg latency</div>
          </div>
          <div className="text-center p-4 bg-white border border-midnight-200 rounded">
            <div className="text-2xl font-semibold text-secure-700 tabular-nums">0.1%</div>
            <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide mt-1">False positive rate</div>
          </div>
          <div className="text-center p-4 bg-white border border-midnight-200 rounded">
            <div className="text-2xl font-semibold text-midnight-950 tabular-nums">6</div>
            <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide mt-1">Defense layers</div>
          </div>
        </div>

        {/* Platform Compatibility */}
        <div className="mt-12 text-center">
          <p className="text-xs font-medium text-midnight-400 uppercase tracking-wide mb-4">Works with your stack</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-midnight-500 font-medium">
            <span>Vapi</span>
            <span>Retell</span>
            <span>Bland AI</span>
            <span>ElevenLabs</span>
            <span className="text-midnight-400">+ more</span>
          </div>
        </div>
      </div>
    </section>
  );
}

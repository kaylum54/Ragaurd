import Link from 'next/link';
import { ArrowRight, Shield, Zap, Ban, Clock } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 bg-[#F9FAFB]">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-midnight-950 leading-[1.15]">
            Your Voice AI Agents Are
            <br />
            Already Being Attacked
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base text-midnight-600 max-w-2xl mx-auto leading-relaxed">
            Ragaurd is the security layer that sits between your voice agents and the threats targeting them. One API. Real-time protection. No false positives.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-midnight-800 hover:bg-midnight-900 text-white font-medium px-5 py-2.5 rounded transition-colors"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-midnight-500">
              500 requests/month, no credit card required
            </p>
          </div>

          {/* Hero Stats Bar */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-midnight-600">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-secure-600" />
              <span className="font-medium">99.53%</span> attack block rate
            </span>
            <span className="flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-secure-600" />
              <span className="font-medium">0%</span> false positives
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-midnight-500" />
              <span className="font-medium">&lt;200ms</span> latency
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-midnight-500" />
              <span className="font-medium">6-layer</span> defense
            </span>
          </div>
        </div>

        {/* Platform Compatibility */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-midnight-400 uppercase tracking-wide mb-4">Works with your stack</p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-midnight-500 font-medium">
            <span>Vapi</span>
            <span>Retell</span>
            <span>Bland AI</span>
            <span>ElevenLabs</span>
            <span className="text-midnight-400">+ custom implementations</span>
          </div>
        </div>
      </div>
    </section>
  );
}

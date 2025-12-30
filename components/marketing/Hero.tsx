import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-20 pb-32 grid-pattern">
      <div className="container">
        {/* Threat Alert */}
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-red-500/20 bg-red-500/5 mb-12">
          <span className="w-1.5 h-1.5 bg-red-500" />
          <span className="text-xs uppercase tracking-widest text-red-400 font-medium">
            2.4M voice AI attacks detected this month
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white max-w-4xl leading-[0.95]">
          Your voice AI is
          <br />
          <span className="text-neutral-600">unprotected.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-8 text-lg text-neutral-500 max-w-lg leading-relaxed">
          Prompt injection. Jailbreaking. Deepfakes. Every call to your voice agent
          is an attack surface. We close it.
        </p>

        {/* Key Stats */}
        <div className="mt-16 flex flex-wrap gap-16 border-l border-neutral-800 pl-8">
          <div>
            <div className="text-4xl font-medium text-white mono tracking-tight">99.53%</div>
            <div className="text-sm text-neutral-600 mt-2 uppercase tracking-wider">Block rate</div>
          </div>
          <div>
            <div className="text-4xl font-medium text-white mono tracking-tight">&lt;200ms</div>
            <div className="text-sm text-neutral-600 mt-2 uppercase tracking-wider">Latency</div>
          </div>
          <div>
            <div className="text-4xl font-medium text-red-500 mono tracking-tight">0</div>
            <div className="text-sm text-neutral-600 mt-2 uppercase tracking-wider">False positives</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex items-center gap-8">
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors"
          >
            START PROTECTING NOW
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="text-sm text-neutral-500 hover:text-white transition-colors tracking-wide"
          >
            Documentation →
          </Link>
        </div>

        {/* Platform Support */}
        <div className="mt-24 text-xs text-neutral-700 uppercase tracking-widest">
          Vapi · Retell · Bland AI · Any voice platform
        </div>
      </div>
    </section>
  );
}

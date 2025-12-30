import Link from 'next/link';
import { ArrowRight, Play, Shield, Zap, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DynamicBackground } from './DynamicBackground';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center py-20 md:py-32">
      {/* Dynamic Animated Background */}
      <DynamicBackground />

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary-900/50 border border-primary-500/30 text-primary-200 backdrop-blur-sm"
          >
            <Shield className="h-3.5 w-3.5 mr-2 text-cyber-glow" />
            <span className="text-sm font-medium">Now protecting 50M+ API calls monthly</span>
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold tracking-tight text-white leading-tight">
            Protect Your Voice AI
            <span className="block mt-2 gradient-text">From Attacks</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            The only security platform with{' '}
            <span className="font-semibold text-cyber-glow">text AND audio</span> defense layers.
            Stop prompt injection, jailbreaking, and deepfakes before they reach your AI agents.
          </p>

          {/* Stats Bar */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-cyber-glow tracking-tight">99.53%</span>
              <span className="text-sm text-slate-400 mt-1 font-medium">Block Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-emerald-400 tracking-tight">0%</span>
              <span className="text-sm text-slate-400 mt-1 font-medium">False Positives</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold text-primary-300 tracking-tight">&lt;200ms</span>
              <span className="text-sm text-slate-400 mt-1 font-medium">Latency</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-900/50 border-0"
              asChild
            >
              <Link href="/signup">
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base px-8 py-6 border-slate-600 text-slate-200 hover:bg-slate-800/50 hover:text-white backdrop-blur-sm"
              asChild
            >
              <Link href="/demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <div className="flex items-center gap-2 text-slate-400">
              <Lock className="h-4 w-4 text-primary-400" />
              <span className="text-sm font-medium">SOC2 Ready</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4 text-primary-400" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Zap className="h-4 w-4 text-primary-400" />
              <span className="text-sm font-medium">GDPR Ready</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden bg-slate-900/80 backdrop-blur-sm mx-auto max-w-5xl">
            <div className="p-3 bg-slate-800/80 flex items-center gap-3 border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center text-sm text-slate-400 font-mono">
                dashboard.ragaurd.com
              </div>
            </div>
            <div className="p-6 md:p-8">
              {/* Dashboard preview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="h-28 rounded-lg bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-emerald-400">1.2M</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Requests Protected</div>
                </div>
                <div className="h-28 rounded-lg bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-cyber-glow">99.53%</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Block Rate</div>
                </div>
                <div className="h-28 rounded-lg bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-white">156ms</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">Avg Latency</div>
                </div>
              </div>
              <div className="mt-4 h-48 rounded-lg bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                {/* Fake chart visualization */}
                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around px-4 gap-1">
                  {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75, 65, 90, 55, 70, 80, 60, 75, 85, 70, 95].map((height, i) => (
                    <div
                      key={i}
                      className="w-full bg-gradient-to-t from-primary-600 to-cyber-glow rounded-t opacity-60"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-slate-800/50" />
                <span className="relative text-slate-400 text-sm font-medium">Real-time Threat Detection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

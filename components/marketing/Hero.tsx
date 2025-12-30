import Link from 'next/link';
import { ArrowRight, Play, Shield, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-background py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Shield className="h-3.5 w-3.5 mr-2 text-primary-600" />
            Now protecting 50M+ API calls monthly
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-900">
            Protect Your Voice AI
            <span className="block text-primary-600">From Attacks</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            The only security platform with{' '}
            <span className="font-semibold text-primary-700">text AND audio</span> defense layers.
            Stop prompt injection, jailbreaking, and deepfakes before they reach your AI agents.
          </p>

          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-10 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-primary-600">99.53%</span>
              <span className="text-slate-600">Block Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-success">0%</span>
              <span className="text-slate-600">False Positives</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl md:text-3xl font-bold text-primary-600">&lt;200ms</span>
              <span className="text-slate-600">Latency</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <Link href="/signup">
                Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
              <Link href="/demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>SOC2 Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>GDPR Ready</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 md:mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border shadow-2xl overflow-hidden bg-slate-900 mx-auto max-w-5xl">
            <div className="p-2 bg-slate-800 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-xs text-slate-400">
                dashboard.ragaurd.com
              </div>
            </div>
            <div className="p-6 md:p-8">
              {/* Placeholder dashboard preview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 rounded-lg bg-slate-800 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-success">1.2M</div>
                  <div className="text-xs text-slate-400">Requests Protected</div>
                </div>
                <div className="h-24 rounded-lg bg-slate-800 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-primary-400">99.53%</div>
                  <div className="text-xs text-slate-400">Block Rate</div>
                </div>
                <div className="h-24 rounded-lg bg-slate-800 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-white">156ms</div>
                  <div className="text-xs text-slate-400">Avg Latency</div>
                </div>
              </div>
              <div className="mt-4 h-48 rounded-lg bg-slate-800 flex items-center justify-center">
                <div className="text-slate-500 text-sm">Real-time threat detection chart</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

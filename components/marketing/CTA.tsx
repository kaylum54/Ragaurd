import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary-600 to-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-8">
            <Shield className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Start protecting your Voice AI today
          </h2>

          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join the companies using Ragaurd to secure their AI agents.
            500 free requests per month, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-primary-900 hover:bg-slate-100 text-base px-8"
              asChild
            >
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-base px-8"
              asChild
            >
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-primary-200">
            Works with Vapi, Retell, Bland AI, and any voice AI platform
          </p>
        </div>
      </div>
    </section>
  );
}

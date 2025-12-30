import { Badge } from '@/components/ui/badge';
import { UserPlus, Key, Shield, Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up',
    description: 'Create your free account in seconds. No credit card required.',
  },
  {
    number: '02',
    icon: Key,
    title: 'Get API Key',
    description: 'Generate your API key from the dashboard with one click.',
  },
  {
    number: '03',
    icon: Shield,
    title: 'Add Protection',
    description: 'Route your AI requests through Ragaurd with a simple API call.',
  },
  {
    number: '04',
    icon: Check,
    title: 'Stay Protected',
    description: 'Monitor threats in real-time and get alerts on attack attempts.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800 relative" id="how-it-works">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary-900/50 text-primary-300 border-primary-500/30">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Protected in minutes, not days
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Simple integration with any voice AI platform. Add enterprise-grade security
            without changing your existing architecture.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-primary-500/50 to-transparent">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-500/50" />
                </div>
              )}

              <div className="text-center relative">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-slate-800/50 border border-slate-700/50 mb-6 group-hover:border-primary-500/50 transition-colors">
                  <step.icon className="h-10 w-10 text-primary-400" />
                </div>
                <div className="absolute top-0 right-1/3 bg-gradient-to-br from-primary-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-slate-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="mt-20 max-w-2xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-sm text-slate-400 ml-2 font-mono">integration.js</span>
            </div>
            <div className="bg-slate-900 p-6 text-sm font-mono">
              <pre className="text-slate-300 overflow-x-auto leading-relaxed">
                <code>
{`const response = await fetch('https://api.ragaurd.com/v1/defend', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer rg_live_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: userMessage,
    profile: 'balanced'
  })
});

const { allowed, blocked_by } = await response.json();

if (allowed) {
  // Safe to send to your AI agent
  await sendToAgent(userMessage);
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

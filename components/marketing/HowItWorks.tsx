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
    <section className="py-20 md:py-32 bg-white" id="how-it-works">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Protected in minutes, not days
          </h2>
          <p className="mt-4 text-lg text-slate-600">
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
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-200">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-slate-300" />
                </div>
              )}

              <div className="text-center relative">
                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-50 border-4 border-white shadow-lg mb-6">
                  <step.icon className="h-10 w-10 text-primary-600" />
                </div>
                <div className="absolute top-0 right-1/3 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Code Example */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-slate-400 ml-2">integration.js</span>
            </div>
            <div className="bg-slate-900 p-6 text-sm font-mono">
              <pre className="text-slate-300 overflow-x-auto">
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
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

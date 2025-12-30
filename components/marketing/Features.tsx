import {
  Shield,
  Mic,
  Target,
  Gauge,
  Lock,
  BarChart3,
  Layers,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Shield,
    title: 'Text Defense (6 Layers)',
    description:
      'Multi-layer protection against prompt injection, jailbreaking, and manipulation attempts. Each request passes through 6 independent detection engines.',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description:
      'Real-time deepfake detection using AASIST-L and LCNN models. 0.83% Equal Error Rate - industry leading accuracy for voice authentication.',
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10',
    badge: 'Pro+',
  },
  {
    icon: Target,
    title: 'Red Team Testing',
    description:
      'Automated security scanning with 10,000+ attack vectors. Find vulnerabilities before attackers do with comprehensive penetration testing.',
    gradient: 'from-rose-500 to-red-500',
    bg: 'bg-rose-500/10',
    badge: 'Pro+',
  },
  {
    icon: Gauge,
    title: 'Sub-200ms Latency',
    description:
      'Enterprise-grade performance that won\'t slow down your AI agents. Real-time protection without the wait.',
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Lock,
    title: 'Zero False Positives',
    description:
      'Our multi-layer approach ensures legitimate requests always pass through. Security that doesn\'t block your users.',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Comprehensive dashboard with attack patterns, threat categories, and usage metrics. Know exactly what\'s happening.',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-500/10',
  },
];

const defenseLayers = [
  { name: 'Pattern Matching', description: 'Known attack signatures' },
  { name: 'Semantic Analysis', description: 'Intent classification' },
  { name: 'Embedding Similarity', description: 'Vector-based detection' },
  { name: 'LLM Guard', description: 'AI-powered analysis' },
  { name: 'Context Validation', description: 'Role boundary enforcement' },
  { name: 'Output Filtering', description: 'Response sanitization' },
];

export function Features() {
  return (
    <section className="py-24 md:py-32 bg-slate-900 relative" id="features">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-primary-900/50 text-primary-300 border-primary-500/30">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-display-sm font-bold tracking-tight text-white">
            Complete Voice AI Security Stack
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            The only platform offering both text AND audio defense layers, plus automated red team testing.
            Enterprise-grade security made simple.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-slate-800/50 border-slate-700/50 hover:border-primary-500/50 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${feature.bg} border border-slate-700/50`}>
                    <feature.icon className={`h-6 w-6 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} style={{ color: feature.gradient.includes('blue') ? '#3b82f6' : feature.gradient.includes('violet') ? '#8b5cf6' : feature.gradient.includes('rose') ? '#f43f5e' : feature.gradient.includes('emerald') ? '#10b981' : feature.gradient.includes('amber') ? '#f59e0b' : '#06b6d4' }} />
                  </div>
                  {feature.badge && (
                    <Badge className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4 text-white group-hover:text-primary-300 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base text-slate-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Defense Layers Section */}
        <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-primary-900/50 text-primary-300 border-primary-500/30">
              <Layers className="h-3.5 w-3.5 mr-2" />
              6-Layer Defense Stack
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Multiple layers of protection for complete security
            </h3>
            <p className="mt-4 text-slate-400">
              Every request passes through 6 independent detection engines. If any layer detects a threat,
              the request is blocked. Multiple confirmations for safe content ensures zero false positives.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {defenseLayers.map((layer, index) => (
                <div key={layer.name} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-primary-400 font-semibold text-sm border border-primary-500/30">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">{layer.name}</div>
                    <div className="text-xs text-slate-500">{layer.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 backdrop-blur-sm">
              <div className="space-y-3">
                {defenseLayers.map((layer, index) => (
                  <div
                    key={layer.name}
                    className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-primary-500/30 transition-colors"
                    style={{ marginLeft: `${index * 8}px` }}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-600 to-cyan-500 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-white">{layer.name}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

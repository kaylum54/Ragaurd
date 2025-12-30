import {
  Shield,
  Mic,
  Target,
  Gauge,
  Lock,
  BarChart3,
  Layers,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Shield,
    title: 'Text Defense (6 Layers)',
    description:
      'Multi-layer protection against prompt injection, jailbreaking, and manipulation attempts. Each request passes through 6 independent detection engines.',
    color: 'text-primary-600',
    bg: 'bg-primary-100',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description:
      'Real-time deepfake detection using AASIST-L and LCNN models. 0.83% Equal Error Rate - industry leading accuracy for voice authentication.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    badge: 'Pro+',
  },
  {
    icon: Target,
    title: 'Red Team Testing',
    description:
      'Automated security scanning with 10,000+ attack vectors. Find vulnerabilities before attackers do with comprehensive penetration testing.',
    color: 'text-danger',
    bg: 'bg-red-100',
    badge: 'Pro+',
  },
  {
    icon: Gauge,
    title: 'Sub-200ms Latency',
    description:
      'Enterprise-grade performance that won\'t slow down your AI agents. Real-time protection without the wait.',
    color: 'text-success',
    bg: 'bg-green-100',
  },
  {
    icon: Lock,
    title: 'Zero False Positives',
    description:
      'Our multi-layer approach ensures legitimate requests always pass through. Security that doesn\'t block your users.',
    color: 'text-warning',
    bg: 'bg-yellow-100',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Comprehensive dashboard with attack patterns, threat categories, and usage metrics. Know exactly what\'s happening.',
    color: 'text-info',
    bg: 'bg-blue-100',
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
    <section className="py-20 md:py-32 bg-white" id="features">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Complete Voice AI Security Stack
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            The only platform offering both text AND audio defense layers, plus automated red team testing.
            Enterprise-grade security made simple.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-2 hover:border-primary-200 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${feature.bg}`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  {feature.badge && (
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Defense Layers Section */}
        <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              <Layers className="h-3.5 w-3.5 mr-2" />
              6-Layer Defense Stack
            </Badge>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
              Multiple layers of protection for complete security
            </h3>
            <p className="mt-4 text-slate-600">
              Every request passes through 6 independent detection engines. If any layer detects a threat,
              the request is blocked. Multiple confirmations for safe content ensures zero false positives.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {defenseLayers.map((layer, index) => (
                <div key={layer.name} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{layer.name}</div>
                    <div className="text-xs text-muted-foreground">{layer.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-8">
              <div className="space-y-3">
                {defenseLayers.map((layer, index) => (
                  <div
                    key={layer.name}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white border shadow-sm"
                    style={{ marginLeft: `${index * 8}px` }}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{layer.name}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-success" />
                      <span className="text-xs text-success">Active</span>
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

import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  Layers,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Text Defense - Documentation',
  description: 'Learn about Ragaurd\'s 6-layer text defense stack for protecting against prompt injection and jailbreaking.',
};

const defenseLayers = [
  {
    name: 'Pattern Matching',
    description: 'Fast regex-based detection of known attack signatures and patterns. Catches common injection attempts like "ignore previous instructions" or delimiter attacks.',
    performance: '< 5ms',
    coverage: 'Known attacks',
  },
  {
    name: 'Semantic Analysis',
    description: 'NLP-powered intent classification that understands the meaning behind text. Identifies manipulation tactics even when obfuscated or rephrased.',
    performance: '10-20ms',
    coverage: 'Intent detection',
  },
  {
    name: 'Embedding Similarity',
    description: 'Vector-based comparison against a database of known attack embeddings. Catches novel attacks that are semantically similar to known threats.',
    performance: '15-25ms',
    coverage: 'Novel variations',
  },
  {
    name: 'LLM Guard',
    description: 'AI-powered analysis using a specialized security model. Provides deep understanding of context and sophisticated attack detection.',
    performance: '50-100ms',
    coverage: 'Complex attacks',
  },
  {
    name: 'Context Validation',
    description: 'Enforces role boundaries and validates that inputs are appropriate for the configured context. Prevents role confusion attacks.',
    performance: '< 10ms',
    coverage: 'Role enforcement',
  },
  {
    name: 'Output Filtering',
    description: 'Scans LLM responses for leaked sensitive data, PII, or harmful content before returning to users.',
    performance: '10-15ms',
    coverage: 'Data leakage',
  },
];

const profiles = [
  {
    name: 'Strict',
    description: 'Maximum protection with lowest false negative rate. May block some edge-case legitimate inputs.',
    recommended: 'High-security applications, financial services',
    color: 'bg-danger/10 border-danger/20 text-danger',
  },
  {
    name: 'Balanced',
    description: 'Optimal trade-off between security and usability. Recommended for most applications.',
    recommended: 'General purpose, customer-facing apps',
    color: 'bg-primary-100 border-primary-200 text-primary-700',
  },
  {
    name: 'Permissive',
    description: 'Minimal blocking, suitable for low-risk scenarios or when you need maximum throughput.',
    recommended: 'Internal tools, development environments',
    color: 'bg-warning/10 border-warning/20 text-warning',
  },
];

const threatCategories = [
  { name: 'Prompt Injection', description: 'Attempts to override system instructions or inject malicious commands' },
  { name: 'Jailbreaking', description: 'Techniques to bypass safety guidelines and content policies' },
  { name: 'Data Exfiltration', description: 'Attempts to extract sensitive information or training data' },
  { name: 'Role Confusion', description: 'Attacks that trick the AI into assuming a different identity or role' },
  { name: 'Context Manipulation', description: 'Exploiting conversation history or multi-turn context' },
  { name: 'Encoding Attacks', description: 'Obfuscation using base64, unicode, or other encodings' },
];

export default function TextDefensePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/docs"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documentation
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <Badge variant="secondary" className="mb-4">
            <Shield className="h-3.5 w-3.5 mr-2" />
            Text Defense
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            6-Layer Text Defense Stack
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Protect your AI applications with our multi-layered defense system. Each layer
            provides a different type of protection, working together to catch threats that
            might slip through individual defenses.
          </p>
        </div>

        {/* Defense Layers */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold">Defense Layers</h2>
          </div>

          <div className="space-y-4">
            {defenseLayers.map((layer, index) => (
              <Card key={layer.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{layer.name}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{layer.performance}</Badge>
                      <Badge variant="secondary">{layer.coverage}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{layer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Defense Profiles */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold">Defense Profiles</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <Card key={profile.name} className={profile.color}>
                <CardHeader>
                  <CardTitle className="text-lg">{profile.name}</CardTitle>
                  <CardDescription className="text-inherit opacity-80">
                    {profile.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Recommended for:</p>
                  <p className="text-sm opacity-80">{profile.recommended}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Threat Categories */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-danger" />
            </div>
            <h2 className="text-2xl font-bold">Threat Categories</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {threatCategories.map((threat) => (
              <Card key={threat.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{threat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{threat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* API Usage */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">API Usage</h2>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                  POST /v1/defend
                </div>
                <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                  <code>{`{
  "input": "User message to analyze",
  "profile": "balanced",
  "context": {
    "role": "customer_support",
    "allowed_topics": ["billing", "account"]
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-success/10 border-success/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <CardTitle className="text-base text-success">Allowed Response</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-slate-700 overflow-x-auto">
                  <code>{`{
  "allowed": true,
  "latency_ms": 67,
  "layers": [...]
}`}</code>
                </pre>
              </CardContent>
            </Card>
            <Card className="bg-danger/10 border-danger/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-danger" />
                  <CardTitle className="text-base text-danger">Blocked Response</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-slate-700 overflow-x-auto">
                  <code>{`{
  "allowed": false,
  "blocked_by": "semantic_analysis",
  "threat_category": "prompt_injection",
  "confidence": 0.94
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Next Steps */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/quickstart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quickstart
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/audio-defense">
              Audio Defense
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

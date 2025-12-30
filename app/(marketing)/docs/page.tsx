import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Book,
  Code,
  Shield,
  Mic,
  Target,
  Key,
  Zap,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Learn how to integrate Ragaurd into your Voice AI application.',
};

const quickstartCards = [
  {
    icon: Key,
    title: 'Getting Started',
    description: 'Create your account and get your first API key in minutes.',
    href: '/docs/quickstart',
  },
  {
    icon: Shield,
    title: 'Text Defense',
    description: 'Protect against prompt injection and jailbreaking attacks.',
    href: '/docs/text-defense',
  },
  {
    icon: Mic,
    title: 'Audio Defense',
    description: 'Detect deepfakes and verify voice authenticity.',
    href: '/docs/audio-defense',
  },
  {
    icon: Target,
    title: 'Red Team',
    description: 'Test your AI agents with automated attack simulations.',
    href: '/docs/red-team',
  },
];

const codeExamples = {
  curl: `curl -X POST https://api.ragaurd.com/v1/defend \\
  -H "Authorization: Bearer rg_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Your user message here",
    "profile": "balanced"
  }'`,
  python: `import requests

response = requests.post(
    "https://api.ragaurd.com/v1/defend",
    headers={
        "Authorization": "Bearer rg_live_xxx",
        "Content-Type": "application/json"
    },
    json={
        "input": "Your user message here",
        "profile": "balanced"
    }
)

result = response.json()
if result["allowed"]:
    # Safe to process
    pass`,
  javascript: `const response = await fetch('https://api.ragaurd.com/v1/defend', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer rg_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: 'Your user message here',
    profile: 'balanced'
  })
});

const { allowed, blocked_by } = await response.json();`,
};

const apiReference = [
  { method: 'POST', endpoint: '/v1/defend', description: 'Text defense endpoint' },
  { method: 'POST', endpoint: '/v1/defend/audio', description: 'Audio defense endpoint' },
  { method: 'POST', endpoint: '/v1/redteam/scan', description: 'Start red team scan' },
  { method: 'GET', endpoint: '/v1/redteam/scan/:id', description: 'Get scan results' },
  { method: 'GET', endpoint: '/v1/usage', description: 'Get usage statistics' },
];

export default function DocsPage() {
  return (
    <>
      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary-50 to-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Book className="h-3.5 w-3.5 mr-2" />
              Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-900">
              Build secure Voice AI applications
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Everything you need to integrate Ragaurd into your application.
              Simple APIs, comprehensive protection.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/docs/quickstart">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/ragaurd/examples" target="_blank">
                  <Code className="mr-2 h-5 w-5" />
                  View Examples
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Cards */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickstartCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="h-full hover:border-primary-300 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                      <card.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 bg-slate-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Code className="h-3.5 w-3.5 mr-2" />
                Quick Integration
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
                Add protection with a single API call
              </h2>
            </div>

            <div className="space-y-6">
              {/* cURL */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">cURL</Badge>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                    Terminal
                  </div>
                  <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                    <code>{codeExamples.curl}</code>
                  </pre>
                </div>
              </div>

              {/* JavaScript */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">JavaScript</Badge>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                    app.js
                  </div>
                  <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                    <code>{codeExamples.javascript}</code>
                  </pre>
                </div>
              </div>

              {/* Python */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Python</Badge>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                    main.py
                  </div>
                  <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                    <code>{codeExamples.python}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Zap className="h-3.5 w-3.5 mr-2" />
                API Reference
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-900">
                Core API Endpoints
              </h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {apiReference.map((api) => (
                    <div key={api.endpoint} className="flex items-center gap-4 p-4 hover:bg-slate-50">
                      <Badge
                        variant={api.method === 'GET' ? 'secondary' : 'default'}
                        className="font-mono text-xs w-16 justify-center"
                      >
                        {api.method}
                      </Badge>
                      <code className="text-sm font-mono flex-1">{api.endpoint}</code>
                      <span className="text-sm text-muted-foreground hidden md:block">
                        {api.description}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link href="/docs/api">
                  View Full API Reference
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

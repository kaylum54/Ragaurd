import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Key,
  Shield,
  Terminal,
  Copy,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Getting Started - Documentation',
  description: 'Get started with Ragaurd in minutes. Create your account, get an API key, and make your first API call.',
};

const steps = [
  {
    step: 1,
    title: 'Create an account',
    description: 'Sign up for a free Ragaurd account to get started.',
    action: {
      label: 'Sign Up Free',
      href: '/signup',
    },
  },
  {
    step: 2,
    title: 'Get your API key',
    description: 'Navigate to the API Keys page in your dashboard and create a new key.',
    action: {
      label: 'Go to API Keys',
      href: '/dashboard/api-keys',
    },
  },
  {
    step: 3,
    title: 'Make your first API call',
    description: 'Test the defense endpoint with a sample request.',
  },
];

export default function QuickstartPage() {
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
            <Key className="h-3.5 w-3.5 mr-2" />
            Getting Started
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Quickstart Guide
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Get up and running with Ragaurd in under 5 minutes. This guide will walk you through
            creating an account, getting your API key, and making your first API call.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((item, index) => (
            <Card key={item.step}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="mt-1 text-base">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              {item.action && (
                <CardContent>
                  <Button asChild>
                    <Link href={item.action.href}>
                      {item.action.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              )}
              {item.step === 3 && (
                <CardContent className="space-y-4">
                  <div className="rounded-lg overflow-hidden">
                    <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 flex items-center justify-between">
                      <span>Terminal</span>
                      <button className="hover:text-white">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                      <code>{`curl -X POST https://api.ragaurd.com/v1/defend \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Hello, how can you help me?",
    "profile": "balanced"
  }'`}</code>
                    </pre>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                      Response
                    </div>
                    <pre className="bg-slate-900 p-4 text-sm text-green-400 overflow-x-auto">
                      <code>{`{
  "allowed": true,
  "latency_ms": 45,
  "layers": [
    { "name": "pattern_matching", "passed": true },
    { "name": "semantic_analysis", "passed": true },
    { "name": "embedding_similarity", "passed": true },
    { "name": "llm_guard", "passed": true },
    { "name": "context_validation", "passed": true },
    { "name": "output_filtering", "passed": true }
  ]
}`}</code>
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Success */}
        <Card className="bg-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-success">You&apos;re all set!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your API is now protected by Ragaurd. Explore the documentation to learn about
                  advanced features like audio defense and red team testing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Next Steps</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/docs/text-defense">
              <Card className="h-full hover:border-primary-300 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                    <Shield className="h-5 w-5 text-primary-600" />
                  </div>
                  <CardTitle className="text-lg">Text Defense</CardTitle>
                  <CardDescription>
                    Learn about the 6-layer defense stack and configuration options.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/docs/api">
              <Card className="h-full hover:border-primary-300 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                    <Terminal className="h-5 w-5 text-primary-600" />
                  </div>
                  <CardTitle className="text-lg">API Reference</CardTitle>
                  <CardDescription>
                    Complete API documentation with all endpoints and parameters.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

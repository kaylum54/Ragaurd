import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Terminal,
  Key,
  Shield,
  Mic,
  Target,
  BarChart3,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Reference - Documentation',
  description: 'Complete API reference for Ragaurd. Learn about all endpoints, parameters, and response formats.',
};

const endpoints = [
  {
    category: 'Authentication',
    icon: Key,
    items: [
      {
        method: 'POST',
        path: '/v1/auth/token',
        description: 'Generate a short-lived access token from your API key.',
        request: `{
  "api_key": "rg_live_xxx"
}`,
        response: `{
  "access_token": "eyJ...",
  "expires_in": 3600
}`,
      },
    ],
  },
  {
    category: 'Text Defense',
    icon: Shield,
    items: [
      {
        method: 'POST',
        path: '/v1/defend',
        description: 'Analyze text input for threats and attacks.',
        request: `{
  "input": "User message to analyze",
  "profile": "balanced",
  "context": {
    "role": "assistant",
    "allowed_topics": ["support"]
  }
}`,
        response: `{
  "allowed": true,
  "blocked_by": null,
  "threat_category": null,
  "confidence": null,
  "latency_ms": 67,
  "layers": [
    { "name": "pattern_matching", "passed": true },
    { "name": "semantic_analysis", "passed": true },
    { "name": "embedding_similarity", "passed": true },
    { "name": "llm_guard", "passed": true },
    { "name": "context_validation", "passed": true },
    { "name": "output_filtering", "passed": true }
  ]
}`,
      },
    ],
  },
  {
    category: 'Audio Defense',
    icon: Mic,
    items: [
      {
        method: 'POST',
        path: '/v1/defend/audio',
        description: 'Analyze audio input for threats, deepfakes, and attacks.',
        request: `{
  "audio": {
    "data": "base64_encoded_audio...",
    "format": "wav"
  },
  "profile": "balanced",
  "options": {
    "detect_deepfake": true,
    "analyze_intent": true
  }
}`,
        response: `{
  "allowed": true,
  "transcription": "Hello, I need help.",
  "deepfake_score": 0.02,
  "latency_ms": 245,
  "layers": [
    { "name": "speech_to_text", "passed": true },
    { "name": "text_analysis", "passed": true },
    { "name": "voice_pattern", "passed": true },
    { "name": "audio_fingerprint", "passed": true },
    { "name": "intent_classification", "passed": true },
    { "name": "output_filtering", "passed": true }
  ]
}`,
      },
    ],
  },
  {
    category: 'Red Team',
    icon: Target,
    items: [
      {
        method: 'POST',
        path: '/v1/redteam/scan',
        description: 'Start a new red team security scan.',
        request: `{
  "name": "Security Audit",
  "target_endpoint": "https://api.example.com/chat",
  "attack_suite": "comprehensive",
  "auth": {
    "type": "bearer",
    "token": "your_token"
  }
}`,
        response: `{
  "id": "scan_abc123",
  "status": "pending",
  "created_at": "2024-12-30T10:00:00Z"
}`,
      },
      {
        method: 'GET',
        path: '/v1/redteam/scan/:id',
        description: 'Get the status and results of a scan.',
        request: null,
        response: `{
  "id": "scan_abc123",
  "status": "completed",
  "total_attacks": 503,
  "blocked_attacks": 498,
  "passed_attacks": 5,
  "block_rate": 99.01,
  "started_at": "2024-12-30T10:00:05Z",
  "completed_at": "2024-12-30T10:14:12Z"
}`,
      },
      {
        method: 'GET',
        path: '/v1/redteam/scans',
        description: 'List all scans for your organization.',
        request: null,
        response: `{
  "scans": [
    {
      "id": "scan_abc123",
      "name": "Security Audit",
      "status": "completed",
      "block_rate": 99.01
    }
  ],
  "total": 1,
  "page": 1
}`,
      },
    ],
  },
  {
    category: 'Usage & Analytics',
    icon: BarChart3,
    items: [
      {
        method: 'GET',
        path: '/v1/usage',
        description: 'Get usage statistics for the current billing period.',
        request: null,
        response: `{
  "period": {
    "start": "2024-12-01T00:00:00Z",
    "end": "2024-12-31T23:59:59Z"
  },
  "text": {
    "used": 45230,
    "limit": 100000
  },
  "audio": {
    "used": 1240,
    "limit": 10000
  },
  "redteam": {
    "used": 2,
    "limit": 10
  }
}`,
      },
      {
        method: 'GET',
        path: '/v1/usage/daily',
        description: 'Get daily breakdown of usage and blocked threats.',
        request: null,
        response: `{
  "days": [
    {
      "date": "2024-12-30",
      "requests": 5432,
      "blocked": 23,
      "latency_avg_ms": 58
    }
  ]
}`,
      },
    ],
  },
];

const errorCodes = [
  { code: 400, name: 'Bad Request', description: 'Invalid request parameters or malformed JSON.' },
  { code: 401, name: 'Unauthorized', description: 'Missing or invalid API key.' },
  { code: 403, name: 'Forbidden', description: 'API key lacks required permissions.' },
  { code: 404, name: 'Not Found', description: 'Requested resource does not exist.' },
  { code: 429, name: 'Rate Limited', description: 'Too many requests. Slow down and retry.' },
  { code: 500, name: 'Server Error', description: 'Internal server error. Contact support if persistent.' },
];

export default function ApiReferencePage() {
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
            <Terminal className="h-3.5 w-3.5 mr-2" />
            API Reference
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Complete API Reference
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Full documentation for all Ragaurd API endpoints. All requests require authentication
            via API key in the Authorization header.
          </p>
        </div>

        {/* Base URL */}
        <Card className="mb-12 bg-slate-50">
          <CardHeader>
            <CardTitle className="text-base">Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-lg font-mono">https://api.ragaurd.com</code>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-base">Authentication</CardTitle>
            <CardDescription>
              All API requests require authentication using your API key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden">
              <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                Headers
              </div>
              <pre className="bg-slate-900 p-4 text-sm text-slate-300">
                <code>Authorization: Bearer rg_live_your_api_key</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints by Category */}
        {endpoints.map((category) => (
          <section key={category.category} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <category.icon className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold">{category.category}</h2>
            </div>

            <div className="space-y-6">
              {category.items.map((endpoint) => (
                <Card key={endpoint.path}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                        className="font-mono"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-base font-mono">{endpoint.path}</code>
                    </div>
                    <CardDescription className="mt-2">
                      {endpoint.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {endpoint.request && (
                      <div>
                        <div className="text-sm font-medium mb-2">Request Body</div>
                        <div className="rounded-lg overflow-hidden">
                          <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                            <code>{endpoint.request}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium mb-2">Response</div>
                      <div className="rounded-lg overflow-hidden">
                        <pre className="bg-slate-900 p-4 text-sm text-green-400 overflow-x-auto">
                          <code>{endpoint.response}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {/* Error Codes */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Error Codes</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {errorCodes.map((error) => (
                  <div key={error.code} className="flex items-center gap-4 p-4">
                    <Badge
                      variant="outline"
                      className={
                        error.code >= 500
                          ? 'border-danger text-danger'
                          : error.code >= 400
                          ? 'border-warning text-warning'
                          : ''
                      }
                    >
                      {error.code}
                    </Badge>
                    <div className="flex-1">
                      <span className="font-medium">{error.name}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        {error.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Rate Limits</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Free tier</span>
                  <Badge variant="outline">100 requests/minute</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pro tier</span>
                  <Badge variant="outline">1,000 requests/minute</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Enterprise tier</span>
                  <Badge variant="outline">Custom limits</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Rate limit headers are included in all responses: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Back */}
        <div className="pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/red-team">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Red Team Testing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

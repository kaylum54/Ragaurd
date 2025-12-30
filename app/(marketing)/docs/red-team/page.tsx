import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Zap,
  Clock,
  Shield,
  BarChart3,
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Red Team Testing - Documentation',
  description: 'Learn how to use Ragaurd\'s automated red team testing to find vulnerabilities in your AI applications.',
};

const attackSuites = [
  {
    name: 'Comprehensive',
    attacks: '500+',
    description: 'Full attack suite covering all threat categories. Best for thorough security audits.',
    duration: '~15 minutes',
  },
  {
    name: 'Quick Scan',
    attacks: '100',
    description: 'Fast scan with the most common and effective attacks. Good for rapid testing.',
    duration: '~3 minutes',
  },
  {
    name: 'Prompt Injection',
    attacks: '150',
    description: 'Focused attacks on prompt injection vulnerabilities including jailbreaks.',
    duration: '~5 minutes',
  },
  {
    name: 'Data Exfiltration',
    attacks: '75',
    description: 'Tests for information leakage and sensitive data extraction.',
    duration: '~3 minutes',
  },
  {
    name: 'Custom',
    attacks: 'Variable',
    description: 'Build your own attack suite from our library or upload custom payloads.',
    duration: 'Varies',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Automated Testing',
    description: 'Run hundreds of attacks automatically without manual intervention.',
  },
  {
    icon: Target,
    title: 'Real Attack Payloads',
    description: 'Attack library based on real-world vulnerabilities and research papers.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Reporting',
    description: 'Get comprehensive reports with block rates, response times, and vulnerability analysis.',
  },
  {
    icon: Clock,
    title: 'Scheduled Scans',
    description: 'Set up recurring scans to continuously monitor your security posture.',
  },
];

const workflow = [
  {
    step: 1,
    title: 'Configure Target',
    description: 'Specify your API endpoint and authentication details.',
  },
  {
    step: 2,
    title: 'Select Attack Suite',
    description: 'Choose from predefined suites or create a custom attack set.',
  },
  {
    step: 3,
    title: 'Run Scan',
    description: 'Execute the scan and monitor progress in real-time.',
  },
  {
    step: 4,
    title: 'Review Results',
    description: 'Analyze which attacks were blocked and identify vulnerabilities.',
  },
  {
    step: 5,
    title: 'Remediate',
    description: 'Adjust your defense configuration based on findings.',
  },
];

export default function RedTeamPage() {
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
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary">
              <Target className="h-3.5 w-3.5 mr-2" />
              Red Team
            </Badge>
            <Badge className="bg-primary-600">Pro+ Feature</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Automated Red Team Testing
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Proactively test your AI applications with automated attack simulations.
            Identify vulnerabilities before attackers do by running comprehensive security scans.
          </p>
        </div>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center mb-2">
                    <feature.icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Attack Suites */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Attack Suites</h2>
          <div className="space-y-4">
            {attackSuites.map((suite) => (
              <Card key={suite.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{suite.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{suite.attacks} attacks</Badge>
                      <Badge variant="secondary">{suite.duration}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{suite.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Testing Workflow</h2>
          <div className="space-y-4">
            {workflow.map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Usage */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">API Usage</h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Start a Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                  POST /v1/redteam/scan
                </div>
                <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                  <code>{`{
  "name": "Weekly Security Audit",
  "target_endpoint": "https://api.yourapp.com/v1/chat",
  "attack_suite": "comprehensive",
  "auth": {
    "type": "bearer",
    "token": "your_api_token"
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-base">Check Scan Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                  GET /v1/redteam/scan/:id
                </div>
                <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                  <code>{`{
  "id": "scan_abc123",
  "status": "completed",
  "total_attacks": 503,
  "blocked_attacks": 498,
  "passed_attacks": 5,
  "block_rate": 99.01,
  "duration_seconds": 847,
  "vulnerabilities": [
    {
      "type": "multi_turn_attack",
      "severity": "medium",
      "payload": "...",
      "recommendation": "Enable context validation"
    }
  ]
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Best Practices */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

          <Card className="bg-primary-50 border-primary-200">
            <CardContent className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Run scans in a staging environment before testing production</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Schedule weekly scans to catch regressions early</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Use the comprehensive suite for initial assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Review passed attacks and adjust defense configuration accordingly</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <span>A 99%+ block rate is recommended for production deployments</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Next Steps */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/audio-defense">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Audio Defense
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/api">
              API Reference
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

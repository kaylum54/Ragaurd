import { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ArrowLeft,
  Mic,
  Layers,
  AlertTriangle,
  Volume2,
  Fingerprint,
  Brain,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Audio Defense - Documentation',
  description: 'Learn about Ragaurd\'s audio defense capabilities for detecting deepfakes, voice cloning, and audio attacks.',
};

const audioLayers = [
  {
    name: 'Speech-to-Text',
    description: 'Accurate transcription of audio input for downstream text analysis. Supports multiple languages and handles background noise.',
    icon: Volume2,
    required: true,
  },
  {
    name: 'Text Analysis',
    description: 'Applies the full text defense stack to transcribed audio content, catching prompt injection and manipulation attempts.',
    icon: Brain,
    required: false,
  },
  {
    name: 'Voice Pattern Detection',
    description: 'Analyzes voice characteristics to detect synthetic or AI-generated speech. Identifies cloned voices and deepfakes.',
    icon: Fingerprint,
    required: false,
  },
  {
    name: 'Audio Fingerprinting',
    description: 'Detects manipulated audio samples by analyzing spectral patterns and identifying splicing or editing artifacts.',
    icon: Fingerprint,
    required: false,
  },
  {
    name: 'Intent Classification',
    description: 'Combines tone analysis with semantic understanding to classify speaker intent and detect social engineering.',
    icon: Brain,
    required: false,
  },
  {
    name: 'Output Filtering',
    description: 'Sanitizes AI voice responses to prevent disclosure of sensitive information or harmful content.',
    icon: Volume2,
    required: false,
  },
];

const audioThreats = [
  {
    name: 'Voice Cloning',
    description: 'AI-generated voices impersonating authorized users to bypass voice authentication or social engineer systems.',
    severity: 'Critical',
  },
  {
    name: 'Audio Injection',
    description: 'Malicious audio payloads embedded within speech that exploit speech-to-text or downstream AI systems.',
    severity: 'High',
  },
  {
    name: 'Social Engineering',
    description: 'Verbal manipulation tactics designed to extract sensitive information or bypass security procedures.',
    severity: 'High',
  },
  {
    name: 'Prompt Injection (Verbal)',
    description: 'Spoken attempts to hijack AI behavior by embedding instructions in natural conversation.',
    severity: 'High',
  },
  {
    name: 'Deepfake Audio',
    description: 'Highly realistic synthetic audio that mimics real individuals for fraud or misinformation.',
    severity: 'Critical',
  },
  {
    name: 'Audio Adversarial Attacks',
    description: 'Specially crafted sounds that cause speech recognition systems to transcribe hidden commands.',
    severity: 'Medium',
  },
];

const useCases = [
  {
    title: 'Voice AI Assistants',
    description: 'Protect customer-facing voice assistants from manipulation and unauthorized access.',
  },
  {
    title: 'Voice Authentication',
    description: 'Add deepfake detection to voice biometric systems for enhanced security.',
  },
  {
    title: 'Call Centers',
    description: 'Screen incoming calls for social engineering attempts and fraud indicators.',
  },
  {
    title: 'Voice-Controlled Systems',
    description: 'Secure IoT and automotive voice interfaces against injection attacks.',
  },
];

export default function AudioDefensePage() {
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
              <Mic className="h-3.5 w-3.5 mr-2" />
              Audio Defense
            </Badge>
            <Badge className="bg-primary-600">Pro+ Feature</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-900">
            Voice AI Security Stack
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Protect voice-enabled AI applications from deepfakes, voice cloning, and audio-based attacks.
            Our audio defense stack analyzes both the acoustic properties and semantic content of audio input.
          </p>
        </div>

        {/* Defense Layers */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold">Audio Defense Layers</h2>
          </div>

          <div className="space-y-4">
            {audioLayers.map((layer, index) => (
              <Card key={layer.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{layer.name}</CardTitle>
                    </div>
                    {layer.required && (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{layer.description}</p>
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
            <h2 className="text-2xl font-bold">Audio Threat Categories</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {audioThreats.map((threat) => (
              <Card key={threat.name}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{threat.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        threat.severity === 'Critical'
                          ? 'border-danger text-danger'
                          : threat.severity === 'High'
                          ? 'border-warning text-warning'
                          : 'border-slate-400'
                      }
                    >
                      {threat.severity}
                    </Badge>
                  </div>
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
              <CardTitle className="text-base">Audio Defense Request</CardTitle>
              <CardDescription>
                Send audio data as base64-encoded content or provide a URL to the audio file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400">
                  POST /v1/defend/audio
                </div>
                <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                  <code>{`{
  "audio": {
    "data": "base64_encoded_audio...",
    "format": "wav"
  },
  "profile": "balanced",
  "options": {
    "detect_deepfake": true,
    "analyze_intent": true,
    "language": "en"
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden">
                <pre className="bg-slate-900 p-4 text-sm text-slate-300 overflow-x-auto">
                  <code>{`{
  "allowed": true,
  "latency_ms": 245,
  "transcription": "Hello, I need help with my account.",
  "deepfake_score": 0.02,
  "layers": [
    { "name": "speech_to_text", "passed": true },
    { "name": "text_analysis", "passed": true },
    { "name": "voice_pattern", "passed": true, "confidence": 0.98 },
    { "name": "audio_fingerprint", "passed": true },
    { "name": "intent_classification", "passed": true, "intent": "support_request" },
    { "name": "output_filtering", "passed": true }
  ]
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Use Cases</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {useCases.map((useCase) => (
              <Card key={useCase.title}>
                <CardHeader>
                  <CardTitle className="text-base">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Next Steps */}
        <div className="flex items-center justify-between pt-8 border-t">
          <Button variant="outline" asChild>
            <Link href="/docs/text-defense">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Text Defense
            </Link>
          </Button>
          <Button asChild>
            <Link href="/docs/red-team">
              Red Team Testing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

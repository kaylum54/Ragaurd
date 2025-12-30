import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Mic, ArrowRight, Check, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Defense',
  description: 'Configure your text and audio defense layers',
};

const textLayers = [
  { name: 'Pattern Matching', status: 'active', description: 'Known attack signatures' },
  { name: 'Semantic Analysis', status: 'active', description: 'Intent classification' },
  { name: 'Embedding Similarity', status: 'active', description: 'Vector-based detection' },
  { name: 'LLM Guard', status: 'active', description: 'AI-powered analysis' },
  { name: 'Context Validation', status: 'active', description: 'Role boundary enforcement' },
  { name: 'Output Filtering', status: 'active', description: 'Response sanitization' },
];

export default function DefensePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Defense Configuration</h1>
        <p className="text-muted-foreground">
          Manage your text and audio defense layers
        </p>
      </div>

      {/* Defense Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text Defense */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <CardTitle>Text Defense</CardTitle>
                  <CardDescription>6-layer protection stack</CardDescription>
                </div>
              </div>
              <Badge variant="success" className="bg-success text-white">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">99.53%</div>
                <div className="text-xs text-muted-foreground">Block Rate</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold">0%</div>
                <div className="text-xs text-muted-foreground">False Positives</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-success">156ms</div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
            </div>

            {/* Layers */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Defense Layers</div>
              <div className="space-y-2">
                {textLayers.map((layer, index) => (
                  <div
                    key={layer.name}
                    className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                  >
                    <div className="h-6 w-6 rounded-full bg-success text-white flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{layer.name}</div>
                      <div className="text-xs text-muted-foreground">{layer.description}</div>
                    </div>
                    <Check className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/dashboard/defense/text">
                Configure Text Defense
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Audio Defense */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Mic className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Audio Defense</CardTitle>
                  <CardDescription>Deepfake detection</CardDescription>
                </div>
              </div>
              <Badge variant="outline">Pro+</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">0.83%</div>
                <div className="text-xs text-muted-foreground">EER</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold">2</div>
                <div className="text-xs text-muted-foreground">Detection Models</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-success">234ms</div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
            </div>

            {/* Models */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Detection Models</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">AASIST-L</div>
                    <div className="text-xs text-muted-foreground">
                      State-of-the-art deepfake detection
                    </div>
                  </div>
                  <Badge variant="success" className="bg-success text-white">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">LCNN</div>
                    <div className="text-xs text-muted-foreground">
                      Light CNN for fast detection
                    </div>
                  </div>
                  <Badge variant="success" className="bg-success text-white">Active</Badge>
                </div>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href="/dashboard/defense/audio">
                Configure Audio Defense
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

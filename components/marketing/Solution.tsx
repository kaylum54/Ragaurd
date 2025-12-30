import { Search, Brain, Shield, Lock, Fingerprint, Mic, Zap, FileText, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const layers = [
  {
    number: 1,
    title: 'Pattern Detection',
    description: '183 attack signatures across 13 categories — prompt injection, jailbreaks, delimiter attacks, encoding bypasses, social engineering, and more. Patterns are updated continuously as new attack vectors emerge.',
    icon: Search,
  },
  {
    number: 2,
    title: 'ML Classification',
    description: 'DeBERTa-based classifier trained on adversarial datasets. Catches novel attacks that don\'t match known patterns.',
    icon: Brain,
  },
  {
    number: 3,
    title: 'Input Sanitization',
    description: 'SQL injection, XSS, command injection, and path traversal detection. Defense in depth for inputs that could reach backend systems.',
    icon: Shield,
  },
  {
    number: 4,
    title: 'PII Detection',
    description: 'Identifies and flags personally identifiable information before it enters your pipeline. Supports compliance requirements for GDPR, HIPAA, and SOC2.',
    icon: Lock,
  },
  {
    number: 5,
    title: 'Semantic Analysis',
    description: 'Context-aware analysis that detects manipulation attempts even when attackers use synonyms, paraphrasing, or multi-turn strategies.',
    icon: Fingerprint,
  },
  {
    number: 6,
    title: 'Audio Verification',
    description: 'AASIST-L and LCNN models detect synthetic and cloned audio with 0.83% Equal Error Rate. Identifies deepfakes before your agent processes the conversation.',
    icon: Mic,
    badge: 'Pro',
  },
];

const benefits = [
  { icon: Zap, label: 'Real-time protection', detail: 'Sub-200ms latency, no perceptible delay' },
  { icon: Shield, label: 'Zero false positives', detail: '0% FP rate in testing across 30+ legitimate input patterns' },
  { icon: FileText, label: 'Detailed logging', detail: 'Every blocked request includes threat category, confidence score, and matched pattern' },
  { icon: Clock, label: 'Simple integration', detail: 'REST API, SDKs for JavaScript and Python, webhook support' },
];

export function Solution() {
  return (
    <section className="py-16 bg-[#F9FAFB] border-t border-midnight-200" id="solution">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <h2 className="text-2xl font-semibold text-midnight-950">
            One API. Six Layers of Defense.
          </h2>
          <p className="mt-3 text-sm text-midnight-600 leading-relaxed">
            Ragaurd is a security API purpose-built for voice AI. It inspects every input before it reaches your agent's LLM, blocking attacks in real-time while allowing legitimate traffic through.
          </p>
        </div>

        {/* How It Works - Code */}
        <div className="mb-12 max-w-xl">
          <h3 className="text-sm font-medium text-midnight-900 mb-4">How It Works</h3>
          <div className="bg-midnight-900 rounded border border-midnight-700 overflow-hidden">
            <div className="px-4 py-2 border-b border-midnight-700">
              <span className="text-xs text-midnight-400 font-mono">integration flow</span>
            </div>
            <div className="p-4">
              <pre className="text-xs text-midnight-300 font-mono">
                <code>User Input → Ragaurd API → [Blocked or Passed] → Your Agent</code>
              </pre>
            </div>
          </div>
          <p className="mt-3 text-sm text-midnight-500">
            Add one API call to your voice pipeline. Ragaurd handles the rest.
          </p>
        </div>

        {/* Defense Layers */}
        <div className="mb-12">
          <h3 className="text-sm font-medium text-midnight-900 mb-6">Defense Layers</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layers.map((layer) => (
              <div
                key={layer.number}
                className="p-5 bg-white border border-midnight-200 rounded hover:border-midnight-300 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-midnight-800 rounded flex items-center justify-center text-xs font-semibold text-white shrink-0">
                    {layer.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-midnight-950">{layer.title}</h4>
                      {layer.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-accent-600 text-white rounded">
                          {layer.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-midnight-600 leading-relaxed">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What You Get */}
        <div className="max-w-3xl">
          <h3 className="text-sm font-medium text-midnight-900 mb-4">What You Get</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="flex gap-3">
                <div className="w-8 h-8 bg-secure-100 rounded flex items-center justify-center shrink-0">
                  <benefit.icon className="w-4 h-4 text-secure-700" />
                </div>
                <div>
                  <div className="text-sm font-medium text-midnight-900">{benefit.label}</div>
                  <div className="text-xs text-midnight-500 mt-0.5">{benefit.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
          >
            View documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

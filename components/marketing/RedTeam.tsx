import { Target, Code, Globe, Mic, FileCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const attackCategories = [
  'Direct prompt injection',
  'Indirect prompt injection',
  'Role manipulation and jailbreaks',
  'Data exfiltration attempts',
  'Social engineering patterns',
  'Encoding and obfuscation bypasses',
  'Multi-language attacks',
  'Voice-specific exploits (ASR artifacts, phonetic manipulation)',
];

const results = [
  { label: 'Block rate score with category breakdown' },
  { label: 'Specific vulnerabilities identified' },
  { label: 'Remediation guidance' },
  { label: 'Comparison against baseline security profiles' },
];

export function RedTeam() {
  return (
    <section className="py-16 bg-white border-t border-midnight-200" id="redteam">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Content */}
          <div>
            {/* Section Header */}
            <h2 className="text-2xl font-semibold text-midnight-950">
              Know Your Vulnerabilities Before Attackers Do
            </h2>
            <p className="mt-3 text-sm text-midnight-600 leading-relaxed">
              Ragaurd includes automated red team testing that probes your voice agents using the same techniques attackers use.
            </p>

            {/* Attack Coverage */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-midnight-900 mb-4">Attack Coverage</h3>
              <p className="text-sm text-midnight-600 mb-4">
                Our test suites include <span className="font-medium text-midnight-900">4,900+ attack probes</span> across:
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {attackCategories.map((category) => (
                  <div key={category} className="flex items-center gap-2 text-sm text-midnight-600">
                    <div className="w-1.5 h-1.5 bg-midnight-400 rounded-full shrink-0" />
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* Testing Tools */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-midnight-900 mb-3">Testing Tools</h3>
              <p className="text-sm text-midnight-600">
                Built on <span className="font-medium">NVIDIA Garak</span> and <span className="font-medium">Microsoft PyRIT</span> — the same frameworks used by security researchers to evaluate LLM vulnerabilities.
              </p>
            </div>

            {/* What You Receive */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-midnight-900 mb-4">What You Receive</h3>
              <div className="space-y-2">
                {results.map((result) => (
                  <div key={result.label} className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-secure-600 shrink-0" />
                    <span className="text-sm text-midnight-600">{result.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-midnight-500">
              Run tests on-demand or schedule continuous monitoring. Identify weaknesses before they become incidents.
            </p>
          </div>

          {/* Right - Visual */}
          <div className="bg-midnight-900 rounded border border-midnight-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-midnight-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-critical-400" />
                <span className="text-xs text-midnight-400 font-mono">red_team_results.json</span>
              </div>
              <span className="text-xs font-medium px-2 py-0.5 bg-secure-600 text-white rounded">COMPLETE</span>
            </div>
            <div className="p-4">
              <pre className="text-xs text-midnight-300 font-mono leading-relaxed overflow-x-auto">
                <code>
{`{
  "scan_id": "rt_8x9k2m",
  "timestamp": "2024-12-30T10:30:00Z",
  "probes_run": 4932,
  "results": {
    "blocked": 4909,
    "passed": 23,
    "block_rate": "99.53%"
  },
  "categories": {
    "prompt_injection": { "blocked": 1247, "total": 1250 },
    "jailbreak": { "blocked": 892, "total": 895 },
    "data_exfil": { "blocked": 634, "total": 634 },
    "role_manipulation": { "blocked": 523, "total": 528 },
    "encoding_bypass": { "blocked": 445, "total": 445 }
  },
  "vulnerabilities": [
    { "type": "multi_turn_injection", "risk": "medium" },
    { "type": "unicode_bypass", "risk": "low" }
  ],
  "recommendation": "Enable Layer 5 semantic analysis"
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/docs/red-team"
            className="inline-flex items-center gap-1.5 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
          >
            Learn about red team testing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Target, FileCheck, ArrowRight } from 'lucide-react';
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

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

export function RedTeam() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-void relative overflow-hidden" id="redteam">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-threat-500/30 to-transparent" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-threat-500/10 border border-threat-500/30 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Target className="w-4 h-4 text-threat-500" />
              <span className="text-xs font-semibold text-threat-400 uppercase tracking-wider">Red Team Testing</span>
            </div>

            <h2
              className={`text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Know Your Vulnerabilities{' '}
              <span className="text-gradient-cyan">Before Attackers Do</span>
            </h2>
            <p
              className={`text-base text-white-60 leading-relaxed mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Ragaurd includes automated red team testing that probes your voice agents using the same techniques attackers use.
            </p>

            <div
              className={`mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <h3 className="text-sm font-bold text-white mb-4">Attack Coverage</h3>
              <p className="text-sm text-white-60 mb-5">
                Our test suites include <span className="font-semibold text-cyan-400">4,900+ attack probes</span> across:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {attackCategories.map((category) => (
                  <div
                    key={category}
                    className="flex items-center gap-3 text-sm text-white-60 group"
                  >
                    <div className="w-2 h-2 bg-cyan-500 shrink-0 group-hover:scale-125 transition-transform" />
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              <h3 className="text-sm font-bold text-white mb-3">Testing Tools</h3>
              <p className="text-sm text-white-60">
                Built on <span className="font-semibold text-violet-400">NVIDIA Garak</span> and <span className="font-semibold text-violet-400">Microsoft PyRIT</span> — the same frameworks used by security researchers to evaluate LLM vulnerabilities.
              </p>
            </div>

            <div
              className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
            >
              <h3 className="text-sm font-bold text-white mb-4">What You Receive</h3>
              <div className="space-y-3">
                {results.map((result) => (
                  <div key={result.label} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-secure-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileCheck className="w-4 h-4 text-secure-400" />
                    </div>
                    <span className="text-sm text-white-60">{result.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className={`mt-8 text-sm text-white-40 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
            >
              Run tests on-demand or schedule continuous monitoring. Identify weaknesses before they become incidents.
            </p>
          </div>

          <div
            className={`opacity-0 ${isVisible ? 'animate-slide-left' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-void-100 border border-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-threat-500" />
                    <div className="w-3 h-3 bg-warning-500" />
                    <div className="w-3 h-3 bg-secure-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-threat-400" />
                    <span className="text-xs text-white-40 font-mono">red_team_results.json</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 bg-secure-500/20 text-secure-400 uppercase tracking-wider">Complete</span>
              </div>
              
              <div className="p-5">
                <pre className="text-xs text-white-60 font-mono leading-relaxed overflow-x-auto">
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
              
              <div className="px-5 py-4 border-t border-white/10 bg-void-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-secure-500 animate-pulse" />
                    <span className="text-xs text-white-40">Scan completed in 4.2s</span>
                  </div>
                  <span className="text-xs text-white-20">4,932 probes tested</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <Link
            href="/docs/red-team"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
          >
            Learn about red team testing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

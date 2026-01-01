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
    <section ref={sectionRef} className="py-20 md:py-28 bg-white relative overflow-hidden" id="redteam">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="redteam-dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#0a1628"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#redteam-dots)" />
        </svg>
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Content */}
          <div>
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-danger-500/10 border border-danger-500/20 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Target className="w-4 h-4 text-danger-500" />
              <span className="text-xs font-semibold text-danger-600 uppercase tracking-wider">Red Team Testing</span>
            </div>

            {/* Section Header */}
            <h2
              className={`text-3xl md:text-4xl font-bold text-navy-950 mb-5 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Know Your Vulnerabilities Before Attackers Do
            </h2>
            <p
              className={`text-base text-navy-600 leading-relaxed mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Ragaurd includes automated red team testing that probes your voice agents using the same techniques attackers use.
            </p>

            {/* Attack Coverage */}
            <div
              className={`mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <h3 className="text-sm font-bold text-navy-950 mb-4">Attack Coverage</h3>
              <p className="text-sm text-navy-600 mb-5">
                Our test suites include <span className="font-semibold text-navy-950">4,900+ attack probes</span> across:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {attackCategories.map((category, index) => (
                  <div
                    key={category}
                    className="flex items-center gap-3 text-sm text-navy-600 group"
                  >
                    <div className="w-2 h-2 bg-gradient-to-br from-navy-400 to-navy-600 rounded-full shrink-0 group-hover:scale-125 transition-transform" />
                    {category}
                  </div>
                ))}
              </div>
            </div>

            {/* Testing Tools */}
            <div
              className={`mb-10 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              <h3 className="text-sm font-bold text-navy-950 mb-3">Testing Tools</h3>
              <p className="text-sm text-navy-600">
                Built on <span className="font-semibold">NVIDIA Garak</span> and <span className="font-semibold">Microsoft PyRIT</span> — the same frameworks used by security researchers to evaluate LLM vulnerabilities.
              </p>
            </div>

            {/* What You Receive */}
            <div
              className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
            >
              <h3 className="text-sm font-bold text-navy-950 mb-4">What You Receive</h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={result.label} className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-success-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileCheck className="w-4 h-4 text-success-600" />
                    </div>
                    <span className="text-sm text-navy-600">{result.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className={`mt-8 text-sm text-navy-500 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
            >
              Run tests on-demand or schedule continuous monitoring. Identify weaknesses before they become incidents.
            </p>
          </div>

          {/* Right - Visual */}
          <div
            className={`opacity-0 ${isVisible ? 'animate-slide-left' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-navy-950 rounded-2xl overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="px-5 py-4 border-b border-navy-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger-500/60" />
                    <div className="w-3 h-3 rounded-full bg-warning-500/60" />
                    <div className="w-3 h-3 rounded-full bg-success-500/60" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-danger-400" />
                    <span className="text-xs text-navy-400 font-mono">red_team_results.json</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 bg-success-500/20 text-success-400 rounded-full uppercase tracking-wider">Complete</span>
              </div>
              
              {/* Code content */}
              <div className="p-5">
                <pre className="text-xs text-navy-300 font-mono leading-relaxed overflow-x-auto">
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
              
              {/* Footer */}
              <div className="px-5 py-4 border-t border-navy-800 bg-navy-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-success-500 animate-pulse" />
                    <span className="text-xs text-navy-400">Scan completed in 4.2s</span>
                  </div>
                  <span className="text-xs text-navy-500">4,932 probes tested</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`mt-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <Link
            href="/docs/red-team"
            className="inline-flex items-center gap-2 text-sm text-navy-700 hover:text-navy-950 font-semibold transition-colors group"
          >
            Learn about red team testing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

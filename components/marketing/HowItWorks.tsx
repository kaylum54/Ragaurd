'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Terminal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  { number: 1, title: 'Create Account', description: 'Free tier with 500 requests. No credit card required.', time: '30 sec' },
  { number: 2, title: 'Generate API Key', description: 'One-click generation from your dashboard.', time: '10 sec' },
  { number: 3, title: 'Add API Call', description: 'Route messages through Ragaurd before your agent.', time: '2 min' },
  { number: 4, title: 'Protection Active', description: 'All 6 layers running with real-time monitoring.', isComplete: true },
];

const codeLines = [
  { text: 'const { allowed } = await fetch(', type: 'keyword' },
  { text: "  'https://api.ragaurd.com/v1/defend',", type: 'string' },
  { text: '  {', type: 'default' },
  { text: "    method: 'POST',", type: 'string' },
  { text: '    headers: {', type: 'default' },
  { text: "      'Authorization': 'Bearer rg_...',", type: 'string' },
  { text: "      'Content-Type': 'application/json'", type: 'string' },
  { text: '    },', type: 'default' },
  { text: '    body: JSON.stringify({', type: 'default' },
  { text: '      input: userMessage', type: 'variable' },
  { text: '    })', type: 'default' },
  { text: '  }', type: 'default' },
  { text: ').then(r => r.json());', type: 'keyword' },
  { text: '', type: 'default' },
  { text: 'if (allowed) {', type: 'keyword' },
  { text: '  sendToAgent(userMessage);', type: 'function' },
  { text: '}', type: 'keyword' },
];

const codeExample = `const { allowed } = await fetch(
  'https://api.ragaurd.com/v1/defend',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer rg_...',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: userMessage
    })
  }
).then(r => r.json());

if (allowed) {
  sendToAgent(userMessage);
}`;

function TypewriterCode({ isVisible }: { isVisible: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
      const interval = setInterval(() => {
        setVisibleLines(prev => {
          if (prev >= codeLines.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isVisible, hasStarted]);

  const typeStyles = {
    keyword: 'text-cyan-400',
    string: 'text-secure-400',
    function: 'text-violet-400',
    variable: 'text-warning-400',
    default: 'text-white-60',
  };

  return (
    <div className="font-mono text-xs leading-relaxed">
      {codeLines.map((line, index) => (
        <div
          key={index}
          className={`transition-all duration-200 ${index < visibleLines ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="text-white-20 select-none mr-4 inline-block w-6 text-right">{String(index + 1).padStart(2, ' ')}</span>
          <span className={typeStyles[line.type as keyof typeof typeStyles]}>
            {line.text}
          </span>
          {index === visibleLines - 1 && visibleLines < codeLines.length && (
            <span className="animate-pulse text-cyan-500 ml-0.5">|</span>
          )}
        </div>
      ))}
    </div>
  );
}

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

export function HowItWorks() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void relative" id="how-it-works">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Quick Setup</span>
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Integrate in <span className="text-gradient-cyan">5 Minutes</span>
          </h2>

          <p
            className={`text-lg text-white-60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            No architecture changes. No complex setup. One API call.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div
            className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex gap-6 p-5 border-l-2 border-void-500 hover:border-cyan-500 hover:bg-void-200 transition-all group"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4">
                    {step.isComplete ? (
                      <div className="w-4 h-4 bg-secure-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-void" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-cyan-500 text-void text-[10px] font-bold flex items-center justify-center">
                        {step.number}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-white">{step.title}</h3>
                      {step.time && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-void-400 text-white-60">
                          ~{step.time}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white-40">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-void-200 border border-secure-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-secure-500" />
                <span className="text-sm font-semibold text-white">Average integration time</span>
              </div>
              <p className="text-3xl font-bold text-cyan-500">4.2 minutes</p>
            </div>
          </div>

          <div
            className={`opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-void-100 border border-white/10 h-full flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-threat-500" />
                    <div className="w-3 h-3 bg-warning-500" />
                    <div className="w-3 h-3 bg-secure-500" />
                  </div>
                  <span className="text-xs text-white-40 font-mono">integration.ts</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-all ${
                    copied ? 'bg-secure-500/20 text-secure-400' : 'bg-void-400 text-white-60 hover:bg-void-500 hover:text-white'
                  }`}
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              <div className="flex-1 p-5 overflow-x-auto">
                <TypewriterCode isVisible={isVisible} />
              </div>

              <div className="px-5 py-4 border-t border-white/10">
                <p className="text-xs text-white-40">
                  That's it. Your agent is now protected by 6 defense layers.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 flex justify-center opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <Link
            href="/docs"
            className="btn-secondary"
          >
            View Full Documentation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Zap } from 'lucide-react';

const steps = [
  { number: 1, title: 'Create your account', description: 'Free tier with 500 requests. No credit card.', time: '30 sec' },
  { number: 2, title: 'Generate API key', description: 'One-click from your dashboard.', time: '10 sec' },
  { number: 3, title: 'Add one API call', description: 'Route messages through Ragaurd first.', time: '2 min' },
  { number: 4, title: 'Protection active', description: 'All 6 layers running. Real-time monitoring.', isComplete: true },
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

// Typewriter code with syntax highlighting
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
    keyword: 'text-violet-400',
    string: 'text-secure-400',
    function: 'text-cyan-400',
    variable: 'text-threat-300',
    default: 'text-void-700',
  };

  return (
    <div className="font-mono text-xs leading-relaxed">
      {codeLines.map((line, index) => (
        <div
          key={index}
          className={`transition-all duration-200 ${index < visibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
        >
          <span className="text-void-500 select-none mr-4">{String(index + 1).padStart(2, ' ')}</span>
          <span className={typeStyles[line.type as keyof typeof typeStyles]}>
            {line.text}
          </span>
          {index === visibleLines - 1 && visibleLines < codeLines.length && (
            <span className="animate-blink-caret text-cyan-400 ml-0.5">|</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Scroll animation hook
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
  const [activeStep, setActiveStep] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void-50 relative" id="how-it-works">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void to-void-50" />
      <div className="divider-cyan absolute top-0" />

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div
            className={`badge-cyan mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Setup</span>
          </div>

          <h2
            className={`heading-1 text-white mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Integration in<br />
            <span className="gradient-text-cyan">5 minutes</span>
          </h2>

          <p
            className={`text-lg text-void-700 leading-relaxed opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            No architecture changes. One API call. That's it.
          </p>

          <div
            className={`inline-flex items-center gap-3 mt-6 noir-card rounded-full px-5 py-2.5 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <span className="w-2 h-2 rounded-full bg-secure-500 animate-pulse" />
            <span className="text-sm text-void-600">Average integration:</span>
            <span className="text-sm font-bold text-secure-400">4.2 minutes</span>
          </div>
        </div>

        {/* Two column layout */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Steps */}
          <div
            className={`opacity-0 ${isVisible ? 'animate-cascade-left' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="noir-card rounded-2xl p-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-void-400 via-cyan-500/50 to-secure-500" />

                <div className="space-y-1">
                  {steps.map((step, index) => {
                    const isActive = activeStep === index;
                    const isPast = activeStep > index;

                    return (
                      <div
                        key={index}
                        className={`relative flex gap-5 p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-cyan-500/10' : 'hover:bg-void-200'}`}
                        onClick={() => setActiveStep(index)}
                      >
                        <div className="relative z-10 shrink-0">
                          {step.isComplete || isPast ? (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.isComplete ? 'bg-secure-500' : 'bg-cyan-500'}`}>
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all ${
                              isActive ? 'bg-cyan-500 text-void ring-4 ring-cyan-500/30' : 'bg-void-300 text-void-600 border border-void-400'
                            }`}>
                              {step.number}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-base font-semibold transition-colors ${isActive ? 'text-cyan-400' : 'text-white'}`}>
                              {step.title}
                            </h3>
                            {step.time && (
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-void-300 text-void-500'}`}>
                                ~{step.time}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-void-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Code */}
          <div
            className={`opacity-0 ${isVisible ? 'animate-cascade-right' : ''}`}
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <div className="noir-card rounded-2xl overflow-hidden h-full flex flex-col">
              {/* Terminal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-void-300 bg-void-100">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-threat-500/60" />
                    <div className="w-3 h-3 rounded-full bg-warning-500/60" />
                    <div className="w-3 h-3 rounded-full bg-secure-500/60" />
                  </div>
                  <span className="text-xs text-void-500 font-mono">integration.ts</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copied ? 'bg-secure-500/20 text-secure-400' : 'bg-void-200 text-void-500 hover:bg-void-300 hover:text-white'
                  }`}
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              {/* Code content */}
              <div className="p-4 overflow-x-auto flex-1 bg-void-100/50">
                <TypewriterCode isVisible={isVisible} />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-void-300 bg-void-100/30">
                <p className="text-xs text-void-500">
                  That's it. Your voice agent is now protected by 6 defense layers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

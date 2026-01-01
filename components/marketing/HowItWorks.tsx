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
    keyword: 'text-navy-300',
    string: 'text-success-400',
    function: 'text-navy-400',
    variable: 'text-warning-400',
    default: 'text-white/80',
  };

  return (
    <div className="font-mono text-xs leading-relaxed">
      {codeLines.map((line, index) => (
        <div
          key={index}
          className={`transition-all duration-200 ${index < visibleLines ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
        >
          <span className="text-navy-500 select-none mr-4">{String(index + 1).padStart(2, ' ')}</span>
          <span className={typeStyles[line.type as keyof typeof typeStyles]}>
            {line.text}
          </span>
          {index === visibleLines - 1 && visibleLines < codeLines.length && (
            <span className="animate-pulse text-navy-300 ml-0.5">|</span>
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
    <section ref={sectionRef} className="py-16 md:py-20 section-white relative overflow-hidden" id="how-it-works">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0a1628 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div
            className={`badge-navy mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Setup</span>
          </div>

          <h2
            className={`heading-1 text-navy-950 mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Integration in<br />
            <span className="text-navy-600">5 minutes</span>
          </h2>

          <p
            className={`text-lg text-navy-600 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            No architecture changes. One API call. That's it.
          </p>

          <div
            className={`inline-flex items-center gap-3 mt-6 white-card rounded-full px-5 py-2.5 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-sm text-navy-600">Average integration:</span>
            <span className="text-sm font-bold text-navy-950">4.2 minutes</span>
          </div>
        </div>

        {/* Two column layout */}
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Steps */}
          <div
            className={`opacity-0 ${isVisible ? 'animate-slide-right' : ''}`}
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <div className="white-card rounded-2xl p-6">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-navy-200 via-navy-400 to-success-500" />

                <div className="space-y-1">
                  {steps.map((step, index) => {
                    const isActive = activeStep === index;
                    const isPast = activeStep > index;

                    return (
                      <div
                        key={index}
                        className={`relative flex gap-5 p-4 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-navy-50' : 'hover:bg-navy-50/50'}`}
                        onClick={() => setActiveStep(index)}
                      >
                        <div className="relative z-10 shrink-0">
                          {step.isComplete || isPast ? (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.isComplete ? 'bg-success-500' : 'bg-navy-500'}`}>
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold transition-all ${
                              isActive ? 'bg-navy-950 text-white ring-4 ring-navy-200' : 'bg-navy-100 text-navy-600 border border-navy-200'
                            }`}>
                              {step.number}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`text-base font-semibold transition-colors ${isActive ? 'text-navy-950' : 'text-navy-700'}`}>
                              {step.title}
                            </h3>
                            {step.time && (
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-navy-100 text-navy-700' : 'bg-navy-50 text-navy-500'}`}>
                                ~{step.time}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-navy-500 mt-1">{step.description}</p>
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
            className={`opacity-0 ${isVisible ? 'animate-slide-left' : ''}`}
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <div className="code-block rounded-2xl overflow-hidden h-full flex flex-col">
              {/* Terminal header */}
              <div className="code-block-header">
                <div className="flex items-center gap-3">
                  <div className="code-block-dots">
                    <div className="code-block-dot bg-danger-500/60" />
                    <div className="code-block-dot bg-warning-500/60" />
                    <div className="code-block-dot bg-success-500/60" />
                  </div>
                  <span className="text-xs text-navy-400 font-mono">integration.ts</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    copied ? 'bg-success-500/20 text-success-400' : 'bg-navy-800 text-navy-400 hover:bg-navy-700 hover:text-white'
                  }`}
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>

              {/* Code content */}
              <div className="code-block-body flex-1">
                <TypewriterCode isVisible={isVisible} />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-navy-800 bg-navy-900/50">
                <p className="text-xs text-navy-400">
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

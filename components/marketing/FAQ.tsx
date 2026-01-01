'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Mail, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  { question: 'How long does integration take?', answer: 'Most teams are live within an hour. Add one API call to your voice pipeline, configure your security profile, and you\'re protected.' },
  { question: 'Will this slow down my voice agents?', answer: 'No. Average latency is 19.2ms. For real-time voice applications, this is imperceptible. Pro plans and above include latency SLAs.' },
  { question: 'What happens when an attack is blocked?', answer: 'Ragaurd returns a structured response indicating the input was blocked, including the threat category and confidence score. You control how your agent responds.' },
  { question: 'Do you store conversation data?', answer: 'We process inputs in real-time for threat detection. Request metadata is retained for your dashboard. Full input text is not stored unless you enable logging.' },
  { question: 'What voice AI platforms do you work with?', answer: 'Ragaurd is platform-agnostic. If your voice pipeline has a point where you can call an API before sending input to your LLM, Ragaurd integrates there. Tested with Vapi, Retell, Bland AI, and custom implementations.' },
  { question: 'Can I test before committing?', answer: 'Yes. The free tier includes 500 requests per month — enough to validate integration and test against real traffic. No credit card required.' },
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

export function FAQ() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-void relative" id="faq">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,229,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <HelpCircle className="w-4 h-4 text-white-60" />
              <span className="text-xs font-semibold text-white-60 uppercase tracking-wider">FAQ</span>
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Common Questions
            </h2>

            <p
              className={`text-lg text-white-60 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Everything you need to know about Ragaurd
            </p>
          </div>

          <div className="space-y-0 border border-white/10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const isLast = index === faqs.length - 1;

              return (
                <div
                  key={index}
                  className={cn(
                    'bg-void-200 opacity-0',
                    isVisible ? 'animate-fade-up' : '',
                    !isLast && 'border-b border-white/10'
                  )}
                  style={{ animationDelay: `${400 + index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className={cn(
                      'text-base font-medium transition-colors pr-4',
                      isOpen ? 'text-white' : 'text-white-60 group-hover:text-white'
                    )}>
                      {faq.question}
                    </span>

                    <div className={cn(
                      'w-8 h-8 flex items-center justify-center shrink-0 transition-all duration-300',
                      isOpen ? 'bg-cyan-500 rotate-180' : 'bg-void-400 group-hover:bg-void-500'
                    )}>
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-colors',
                        isOpen ? 'text-void' : 'text-white-60'
                      )} />
                    </div>
                  </button>

                  <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-60' : 'max-h-0'
                  )}>
                    <div className="px-6 pb-6">
                      <p className="text-sm text-white-40 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`mt-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-void-200 border border-white/10 p-8 text-center">
              <p className="text-sm text-white-40 mb-4">Still have questions?</p>
              <a
                href="mailto:support@ragaurd.com"
                className="inline-flex items-center gap-3 text-base font-semibold text-white hover:text-cyan-400 transition-colors group"
              >
                <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center group-hover:bg-cyan-400 transition-colors">
                  <Mail className="w-5 h-5 text-void" />
                </div>
                Contact our team
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

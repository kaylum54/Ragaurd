'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-void-50 relative" id="faq">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void to-void-50" />
      <div className="divider-cyan absolute top-0" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div
              className={`badge-violet mb-6 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </div>

            <h2
              className={`heading-1 text-white mb-4 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Common Questions
            </h2>

            <p
              className={`text-lg text-void-700 leading-relaxed opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Everything you need to know about Ragaurd
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={cn(
                    'noir-card rounded-2xl overflow-hidden transition-all duration-500 opacity-0',
                    isVisible ? 'animate-cascade-up' : '',
                    isOpen ? 'ring-1 ring-cyan-500/30' : ''
                  )}
                  style={{ animationDelay: `${400 + index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left group relative"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    {/* Left accent bar */}
                    <div className={cn(
                      'absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 transition-opacity duration-300',
                      isOpen ? 'opacity-100' : 'opacity-0'
                    )} />

                    <span className={cn(
                      'text-base font-medium transition-colors pr-4',
                      isOpen ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'
                    )}>
                      {faq.question}
                    </span>

                    <ChevronDown className={cn(
                      'w-5 h-5 shrink-0 transition-all duration-300',
                      isOpen ? 'rotate-180 text-cyan-400' : 'text-void-500 group-hover:text-void-600'
                    )} />
                  </button>

                  <div className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    <div className="px-6 pb-5">
                      <p className="text-sm text-void-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div
            className={`mt-12 opacity-0 ${isVisible ? 'animate-cascade-up' : ''}`}
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <div className="noir-card rounded-2xl p-6 text-center">
              <p className="text-sm text-void-600 mb-2">Still have questions?</p>
              <a
                href="mailto:support@ragaurd.com"
                className="inline-flex items-center gap-2 text-base font-medium text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                Contact our team
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

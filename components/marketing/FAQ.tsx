'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';
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
    <section ref={sectionRef} className="py-20 md:py-28 section-white relative overflow-hidden" id="faq">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="faq-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0a1628" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#faq-grid)" />
        </svg>
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-100/50 border border-navy-200/50 mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <HelpCircle className="w-4 h-4 text-navy-600" />
              <span className="text-xs font-semibold text-navy-700 uppercase tracking-wider">FAQ</span>
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold text-navy-950 mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Common Questions
            </h2>

            <p
              className={`text-lg text-navy-600 leading-relaxed opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              Everything you need to know about Ragaurd
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={cn(
                    'bg-white rounded-2xl overflow-hidden transition-all duration-500 shadow-lg shadow-navy-950/5 border opacity-0',
                    isVisible ? 'animate-fade-up' : '',
                    isOpen ? 'border-navy-200 shadow-xl' : 'border-navy-100/50'
                  )}
                  style={{ animationDelay: `${400 + index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left group relative"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    {/* Left accent bar */}
                    <div className={cn(
                      'absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-navy-400 to-navy-600 transition-opacity duration-300',
                      isOpen ? 'opacity-100' : 'opacity-0'
                    )} />

                    <span className={cn(
                      'text-base font-semibold transition-colors pr-4',
                      isOpen ? 'text-navy-950' : 'text-navy-800 group-hover:text-navy-950'
                    )}>
                      {faq.question}
                    </span>

                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
                      isOpen ? 'bg-navy-100 rotate-180' : 'bg-navy-50 group-hover:bg-navy-100'
                    )}>
                      <ChevronDown className={cn(
                        'w-5 h-5 transition-colors',
                        isOpen ? 'text-navy-700' : 'text-navy-400'
                      )} />
                    </div>
                  </button>

                  <div className={cn(
                    'overflow-hidden transition-all duration-300 ease-out',
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    <div className="px-6 pb-6">
                      <p className="text-sm text-navy-600 leading-relaxed">
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
            className={`mt-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <div className="bg-gradient-to-br from-navy-50 to-white rounded-2xl p-8 text-center border border-navy-100/50 shadow-lg shadow-navy-950/5">
              <p className="text-sm text-navy-500 mb-3">Still have questions?</p>
              <a
                href="mailto:support@ragaurd.com"
                className="inline-flex items-center gap-3 text-base font-semibold text-navy-950 hover:text-navy-700 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center group-hover:bg-navy-200 transition-colors">
                  <Mail className="w-5 h-5 text-navy-600" />
                </div>
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

'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How long does integration take?',
    answer: 'Most teams are live within an hour. Add one API call to your voice pipeline, configure your security profile, and you\'re protected.',
  },
  {
    question: 'Will this slow down my voice agents?',
    answer: 'No. Average latency is 19.2ms. For real-time voice applications, this is imperceptible. Pro plans and above include latency SLAs.',
  },
  {
    question: 'What happens when an attack is blocked?',
    answer: 'Ragaurd returns a structured response indicating the input was blocked, including the threat category and confidence score. You control how your agent responds.',
  },
  {
    question: 'Do you store conversation data?',
    answer: 'We process inputs in real-time for threat detection. Request metadata is retained for your dashboard. Full input text is not stored unless you explicitly enable logging.',
  },
  {
    question: 'What platforms do you work with?',
    answer: 'Ragaurd is platform-agnostic. If your voice pipeline has a point where you can call an API before sending input to your LLM, Ragaurd integrates there. Tested with Vapi, Retell, Bland AI, and custom implementations.',
  },
  {
    question: 'Can I test before committing?',
    answer: 'Yes. The free tier includes 500 requests per month. No credit card required.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-bg-light" id="faq">
      <div className="container max-w-[800px]">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-text-light-bg">
            Questions
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-border rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-base font-semibold text-text-light-bg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-text-light-muted transition-transform shrink-0',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-[15px] text-text-light-muted leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    answer: 'Ragaurd returns a structured response indicating the input was blocked, including the threat category and confidence score. You control how your agent responds — we recommend a neutral fallback message.',
  },
  {
    question: 'Do you store conversation data?',
    answer: 'We process inputs in real-time for threat detection. Request metadata (timestamps, threat categories, latency) is retained for your dashboard. Full input text is not stored unless you explicitly enable logging for debugging purposes.',
  },
  {
    question: 'What voice AI platforms do you work with?',
    answer: 'Ragaurd is platform-agnostic. If your voice pipeline has a point where you can call an API before sending input to your LLM, Ragaurd integrates there. We\'ve tested with Vapi, Retell, Bland AI, and custom implementations.',
  },
  {
    question: 'Can I test before committing?',
    answer: 'Yes. The free tier includes 500 requests per month — enough to validate integration and test against real traffic. No credit card required.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-[#F9FAFB] border-t border-midnight-200" id="faq">
      <div className="container">
        <div className="max-w-2xl">
          {/* Section Header */}
          <h2 className="text-2xl font-semibold text-midnight-950 mb-8">
            Common Questions
          </h2>

          {/* FAQ Items */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-midnight-200 rounded overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-sm font-medium text-midnight-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-midnight-500 transition-transform shrink-0 ml-3',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-midnight-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

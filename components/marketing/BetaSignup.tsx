'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

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

export function BetaSignup() {
  const { ref: sectionRef, isVisible } = useScrollAnimation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    useCase: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit application');
      }

      setStatus('success');
      setFormData({ name: '', email: '', company: '', useCase: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <section id="beta" ref={sectionRef} className="py-24 md:py-32 bg-gradient-to-b from-navy-50 to-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-navy-100/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="container relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 bg-navy-950 text-white rounded-full mb-6 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Beta Access</span>
            </div>

            <h2
              className={`text-4xl md:text-5xl font-bold text-navy-950 mb-6 tracking-tight opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
            >
              Apply for Early Access
            </h2>

            <p
              className={`text-lg text-navy-600 max-w-2xl mx-auto mb-8 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
              style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
            >
              We're launching soon. Join the waitlist to be among the first to protect your Voice AI with Ragaurd.
            </p>
          </div>

          <div
            className={`bg-white border border-navy-100 shadow-xl rounded-2xl p-8 md:p-12 opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-navy-950 mb-3">You're on the list!</h3>
                <p className="text-navy-600 mb-6">
                  Thanks for applying. We'll be in touch soon with your beta access.
                </p>
                <p className="text-sm text-navy-500">
                  Follow us on X for updates: <a href="https://x.com/ragaurd" target="_blank" rel="noopener noreferrer" className="text-navy-950 font-medium hover:underline">@ragaurd</a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-navy-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-navy-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <label htmlFor="useCase" className="block text-sm font-medium text-navy-700 mb-2">
                    How will you use Ragaurd?
                  </label>
                  <textarea
                    id="useCase"
                    rows={3}
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your Voice AI project..."
                  />
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full btn-primary py-4 text-lg justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Apply for Beta Access
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-navy-500">
                  By applying, you agree to receive updates about Ragaurd. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

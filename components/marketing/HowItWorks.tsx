export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50" id="how-it-works">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Get protected in 5 minutes
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
            Simple integration. No architecture changes. Just add one API call.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left - Steps */}
          <div className="space-y-8">
            <div className="flex gap-5">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Create your account</h3>
                <p className="text-slate-600 mt-1">Free tier includes 500 requests. No credit card needed.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Generate your API key</h3>
                <p className="text-slate-600 mt-1">One-click key generation from your dashboard.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Add one API call</h3>
                <p className="text-slate-600 mt-1">Route user messages through RAGuard before your agent.</p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">You&apos;re protected</h3>
                <p className="text-slate-600 mt-1">All 6 defense layers active. Real-time monitoring begins.</p>
              </div>
            </div>
          </div>

          {/* Right - Code */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-sm text-slate-400 font-mono">integration.ts</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
            </div>
            <div className="p-6">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed overflow-x-auto">
                <code>
{`const { allowed } = await fetch(
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
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="py-16 bg-[#F9FAFB] border-t border-midnight-200" id="how-it-works">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-xl mb-12">
          <h2 className="text-2xl font-semibold text-midnight-950">
            Integration in 5 minutes
          </h2>
          <p className="mt-2 text-sm text-midnight-600">
            No architecture changes. One API call.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Steps */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-midnight-800 rounded flex items-center justify-center text-xs font-semibold text-white shrink-0">
                1
              </div>
              <div>
                <h3 className="text-sm font-medium text-midnight-950">Create your account</h3>
                <p className="text-sm text-midnight-600 mt-0.5">Free tier includes 500 requests. No credit card.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-midnight-800 rounded flex items-center justify-center text-xs font-semibold text-white shrink-0">
                2
              </div>
              <div>
                <h3 className="text-sm font-medium text-midnight-950">Generate API key</h3>
                <p className="text-sm text-midnight-600 mt-0.5">One-click generation from your dashboard.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-midnight-800 rounded flex items-center justify-center text-xs font-semibold text-white shrink-0">
                3
              </div>
              <div>
                <h3 className="text-sm font-medium text-midnight-950">Add one API call</h3>
                <p className="text-sm text-midnight-600 mt-0.5">Route user messages through RAGuard before your agent.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-secure-700 rounded flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-midnight-950">Protection active</h3>
                <p className="text-sm text-midnight-600 mt-0.5">All 6 defense layers running. Real-time monitoring begins.</p>
              </div>
            </div>
          </div>

          {/* Right - Code */}
          <div className="bg-midnight-900 rounded border border-midnight-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-midnight-700 flex items-center justify-between">
              <span className="text-xs text-midnight-400 font-mono">integration.ts</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-midnight-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-midnight-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-midnight-600" />
              </div>
            </div>
            <div className="p-4">
              <pre className="text-xs text-midnight-300 font-mono leading-relaxed overflow-x-auto">
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

export function HowItWorks() {
  return (
    <section className="py-20 bg-slate-900/50" id="how-it-works">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Get started in minutes
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Simple integration with any voice AI platform. No architecture changes required.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Steps */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-medium text-white shrink-0">
                1
              </div>
              <div>
                <h3 className="font-medium text-white">Create your account</h3>
                <p className="text-sm text-slate-400 mt-1">Free tier includes 500 requests. No credit card needed.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-medium text-white shrink-0">
                2
              </div>
              <div>
                <h3 className="font-medium text-white">Generate your API key</h3>
                <p className="text-sm text-slate-400 mt-1">One-click key generation from your dashboard.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-medium text-white shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-white">Add one API call</h3>
                <p className="text-sm text-slate-400 mt-1">Route user messages through Ragaurd before your agent.</p>
              </div>
            </div>
          </div>

          {/* Right - Code */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">integration.ts</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              </div>
            </div>
            <div className="p-5">
              <pre className="text-sm text-slate-300 font-mono leading-relaxed overflow-x-auto">
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
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

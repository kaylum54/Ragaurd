export function HowItWorks() {
  return (
    <section className="py-24 border-b border-neutral-800" id="how-it-works">
      <div className="container">
        {/* Section Label */}
        <div className="text-xs text-neutral-600 uppercase tracking-widest mb-16">
          Integration
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Steps */}
          <div>
            <h2 className="text-3xl font-medium text-white mb-12">
              Protected in
              <br />
              <span className="text-neutral-600">five minutes.</span>
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="text-xs text-neutral-600 mono pt-1">01</div>
                <div>
                  <div className="text-sm font-medium text-white">Create account</div>
                  <div className="text-sm text-neutral-500 mt-1">No credit card required</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-xs text-neutral-600 mono pt-1">02</div>
                <div>
                  <div className="text-sm font-medium text-white">Generate API key</div>
                  <div className="text-sm text-neutral-500 mt-1">One click from dashboard</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-xs text-neutral-600 mono pt-1">03</div>
                <div>
                  <div className="text-sm font-medium text-white">Add one API call</div>
                  <div className="text-sm text-neutral-500 mt-1">Route requests through Ragaurd</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Code */}
          <div>
            <div className="border border-neutral-800 bg-neutral-900/50">
              <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500 mono">integration.ts</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-neutral-700" />
                  <div className="w-2 h-2 bg-neutral-700" />
                  <div className="w-2 h-2 bg-neutral-700" />
                </div>
              </div>
              <div className="p-6">
                <pre className="text-sm text-neutral-400 font-mono leading-relaxed overflow-x-auto">
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
      </div>
    </section>
  );
}

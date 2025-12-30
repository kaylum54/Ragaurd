export function Stats() {
  return (
    <section className="py-24 border-y border-neutral-800">
      <div className="container">
        {/* Section Label */}
        <div className="text-xs text-neutral-600 uppercase tracking-widest mb-16">
          The threat landscape
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-16">
          <div className="border-l border-neutral-800 pl-8">
            <div className="text-5xl font-medium text-red-500 mono">78%</div>
            <div className="mt-4 text-sm text-neutral-400 leading-relaxed">
              of voice AI deployments have no security layer protecting against prompt injection attacks.
            </div>
          </div>

          <div className="border-l border-neutral-800 pl-8">
            <div className="text-5xl font-medium text-white mono">$4.2M</div>
            <div className="mt-4 text-sm text-neutral-400 leading-relaxed">
              average cost of a successful AI-targeted breach in 2024, up 40% from the previous year.
            </div>
          </div>

          <div className="border-l border-neutral-800 pl-8">
            <div className="text-5xl font-medium text-orange-500 mono">340%</div>
            <div className="mt-4 text-sm text-neutral-400 leading-relaxed">
              increase in deepfake-enabled fraud targeting voice authentication systems.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

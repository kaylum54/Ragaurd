const leftColumnItems = [
  'Direct prompt injection',
  'Indirect prompt injection',
  'Role manipulation',
  'Jailbreak patterns',
  'Data exfiltration',
  'Social engineering',
];

const rightColumnItems = [
  'Encoding bypasses',
  'Delimiter injection',
  'Multi-language attacks',
  'Voice-specific exploits',
  'Context manipulation',
  'Obfuscation techniques',
];

export function RedTeam() {
  return (
    <section className="py-24 bg-bg-dark" id="redteam">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Know Your Vulnerabilities First
          </h2>
          <p className="mt-4 text-lg text-text-dark-bg max-w-[640px] mx-auto">
            Ragaurd includes automated red team testing that probes your agents using
            the same techniques attackers use.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-16 mb-12">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-white">4,900+</div>
            <div className="mt-2 text-sm text-text-dark-muted">Attack probes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-white">13</div>
            <div className="mt-2 text-sm text-text-dark-muted">Threat categories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-semibold text-white">Continuous</div>
            <div className="mt-2 text-sm text-text-dark-muted">Monitoring</div>
          </div>
        </div>

        {/* Test Coverage List */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-12">
          <ul className="space-y-4">
            {leftColumnItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-base text-text-dark-bg">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <ul className="space-y-4">
            {rightColumnItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-base text-text-dark-bg">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools Badge */}
        <div className="flex justify-center">
          <div className="px-6 py-3 bg-bg-card-dark border border-border-dark rounded-md">
            <span className="text-sm text-text-dark-muted">
              Built on NVIDIA Garak + Microsoft PyRIT
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

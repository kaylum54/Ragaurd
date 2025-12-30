const timelineItems = [
  {
    year: '2024',
    title: 'Early Adoption',
    points: ['Limited deployment', 'Few documented attacks'],
  },
  {
    year: '2025',
    title: 'Rapid Scaling',
    points: ['Production deployments accelerating', 'Attack techniques maturing', 'Security gap widening'],
  },
  {
    year: '2026',
    title: 'Critical Mass',
    points: ['Widespread voice AI', 'Sophisticated attack tooling', 'Regulatory scrutiny increasing'],
  },
];

export function WhyNow() {
  return (
    <section className="py-24 bg-bg-dark">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Copy */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              The Risk Window Is Open
            </h2>

            <div className="mt-8 space-y-6 text-lg text-text-dark-bg leading-relaxed">
              <p>
                Voice AI adoption is accelerating through 2025 and into 2026. Customer-facing
                agents are handling real conversations with real data.
              </p>

              <p className="font-medium text-white">
                Security tooling hasn't kept pace.
              </p>

              <p>
                Most voice AI platforms ship without built-in protection. Security is treated
                as an afterthought — something to address "after launch" or "when we scale."
              </p>

              <p>
                This creates a window where deployed agents are exposed to known attack
                vectors with no defensive layer in place.
              </p>

              <p>
                The attack landscape is evolving in parallel:
              </p>

              <ul className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Prompt injection techniques are becoming more sophisticated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Open-source jailbreak repositories are actively maintained</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Voice cloning quality now passes human verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                  <span>Automated attack tooling is lowering the barrier for adversaries</span>
                </li>
              </ul>

              <p>
                By mid-2026, the volume of production voice agents will have multiplied.
                So will the attacks targeting them.
              </p>

              <p>
                The teams deploying today without protection are building liability that
                compounds with every conversation.
              </p>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border-dark" />

            <div className="space-y-12">
              {timelineItems.map((item) => (
                <div key={item.year} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-8 top-0 w-2 h-2 rounded-full bg-primary" />

                  <div className="text-sm font-semibold text-white mb-2">
                    {item.year}: {item.title}
                  </div>
                  <ul className="space-y-1">
                    {item.points.map((point, index) => (
                      <li key={index} className="text-sm text-text-dark-muted">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

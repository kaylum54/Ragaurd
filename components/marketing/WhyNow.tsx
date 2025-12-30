import { TrendingUp, AlertCircle, Code, Mic2 } from 'lucide-react';

const factors = [
  {
    icon: TrendingUp,
    text: 'Prompt injection techniques are becoming more sophisticated, with multi-turn attacks and encoding-based bypasses',
  },
  {
    icon: Code,
    text: 'Open-source jailbreak repositories are actively maintained and expanding',
  },
  {
    icon: Mic2,
    text: 'Voice cloning quality has reached the point where synthetic audio passes human verification',
  },
  {
    icon: AlertCircle,
    text: 'Automated attack tooling (including AI-powered red teaming) is lowering the barrier for attackers',
  },
];

export function WhyNow() {
  return (
    <section className="py-16 bg-white border-t border-midnight-200">
      <div className="container">
        <div className="max-w-3xl">
          {/* Section Header */}
          <h2 className="text-2xl font-semibold text-midnight-950">
            The Risk Window Is Open — And Widening
          </h2>

          <div className="mt-6 space-y-4 text-sm text-midnight-600 leading-relaxed">
            <p>
              Voice AI adoption is accelerating through 2025 and into 2026. Enterprise deployments are scaling from pilots to production. Customer-facing agents are handling real conversations with real data.
            </p>
            <p className="font-medium text-midnight-900">
              Security tooling hasn't kept pace.
            </p>
            <p>
              Most voice AI platforms ship without built-in security. Protection is treated as an afterthought — something to address "after launch" or "when we scale." This creates a window where deployed agents are exposed to known attack vectors with no defensive layer in place.
            </p>
          </div>

          {/* Attack Landscape */}
          <div className="mt-8">
            <p className="text-sm text-midnight-600 mb-4">
              The attack landscape is evolving in parallel:
            </p>
            <div className="space-y-3">
              {factors.map((factor, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 bg-warning-100 rounded flex items-center justify-center shrink-0 mt-0.5">
                    <factor.icon className="w-3.5 h-3.5 text-warning-700" />
                  </div>
                  <p className="text-sm text-midnight-600">{factor.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm text-midnight-600 leading-relaxed">
            <p>
              By mid-2026, the number of production voice agents will have multiplied significantly. So will the volume of attacks targeting them.
            </p>
            <p>
              The teams deploying voice AI today without a security layer are building technical debt that compounds with every conversation their agents handle.
            </p>
          </div>

          {/* Call Out Box */}
          <div className="mt-8 p-5 bg-midnight-50 border border-midnight-200 rounded">
            <p className="text-sm font-medium text-midnight-900">
              The question isn't whether to add security. It's whether you add it before or after an incident.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

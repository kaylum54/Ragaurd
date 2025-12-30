import { AlertTriangle, TrendingUp, Volume2 } from 'lucide-react';

export function Stats() {
  return (
    <section className="py-16 bg-midnight-900">
      <div className="container">
        {/* Section Header */}
        <div className="max-w-xl mb-10">
          <h2 className="text-2xl font-semibold text-white">
            The threat landscape
          </h2>
          <p className="mt-2 text-sm text-midnight-400">
            Voice AI systems are increasingly targeted. Without protection, your agents are exposed.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-midnight-800 border border-midnight-700 rounded">
            <div className="w-10 h-10 bg-critical-700/20 rounded flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-critical-500" />
            </div>
            <div className="text-3xl font-semibold text-white tabular-nums mb-2">78%</div>
            <p className="text-sm text-midnight-400">
              of voice AI deployments lack security protection
            </p>
          </div>

          <div className="p-6 bg-midnight-800 border border-midnight-700 rounded">
            <div className="w-10 h-10 bg-warning-700/20 rounded flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-semibold text-white tabular-nums mb-2">$4.2M</div>
            <p className="text-sm text-midnight-400">
              average cost of an AI-targeted breach in 2024
            </p>
          </div>

          <div className="p-6 bg-midnight-800 border border-midnight-700 rounded">
            <div className="w-10 h-10 bg-warning-700/20 rounded flex items-center justify-center mb-4">
              <Volume2 className="w-5 h-5 text-warning-500" />
            </div>
            <div className="text-3xl font-semibold text-white tabular-nums mb-2">340%</div>
            <p className="text-sm text-midnight-400">
              increase in deepfake attacks on voice systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

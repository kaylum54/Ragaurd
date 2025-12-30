import { AlertTriangle, TrendingUp, Volume2 } from 'lucide-react';

export function Stats() {
  return (
    <section className="py-20 bg-slate-900/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            The threat is real
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Voice AI systems are increasingly targeted. Without protection, your agents are vulnerable.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-4xl font-semibold text-white">78%</div>
            <p className="mt-2 text-sm text-slate-400">
              of voice AI deployments lack security protection against prompt injection.
            </p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-4xl font-semibold text-white">$4.2M</div>
            <p className="mt-2 text-sm text-slate-400">
              average cost of an AI-targeted breach in 2024, up 40% year over year.
            </p>
          </div>

          <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
              <Volume2 className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-4xl font-semibold text-white">340%</div>
            <p className="mt-2 text-sm text-slate-400">
              increase in deepfake attacks targeting voice authentication systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

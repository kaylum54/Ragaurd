import { AlertTriangle, TrendingUp, Volume2 } from 'lucide-react';

export function Stats() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            The threat is real
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Voice AI systems are increasingly targeted. Without protection, your agents are exposed.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-2xl text-center">
            <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-3">78%</div>
            <p className="text-slate-400">
              of voice AI deployments lack security protection
            </p>
          </div>

          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-2xl text-center">
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-3">$4.2M</div>
            <p className="text-slate-400">
              average cost of an AI-targeted breach in 2024
            </p>
          </div>

          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-2xl text-center">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Volume2 className="w-7 h-7 text-orange-400" />
            </div>
            <div className="text-5xl font-bold text-white mb-3">340%</div>
            <p className="text-slate-400">
              increase in deepfake attacks on voice systems
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

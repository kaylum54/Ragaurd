import { TrendingUp, Shield, Zap, Users } from 'lucide-react';

const stats = [
  {
    value: '99.53%',
    label: 'Attack Block Rate',
    description: 'Industry-leading detection across all attack vectors',
    icon: Shield,
    color: 'text-cyber-glow',
  },
  {
    value: '0.83%',
    label: 'Equal Error Rate',
    description: 'Audio deepfake detection accuracy',
    icon: TrendingUp,
    color: 'text-emerald-400',
  },
  {
    value: '<200ms',
    label: 'Average Latency',
    description: 'Real-time protection without delays',
    icon: Zap,
    color: 'text-amber-400',
  },
  {
    value: '0%',
    label: 'False Positive Rate',
    description: 'Never blocks legitimate requests',
    icon: Users,
    color: 'text-violet-400',
  },
];

export function Stats() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#020817] to-slate-900 relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-4 group-hover:border-primary-500/50 transition-colors">
                <stat.icon className={`h-7 w-7 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-300 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 hidden md:block max-w-[180px] mx-auto">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

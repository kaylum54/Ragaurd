import { TrendingUp, Shield, Zap, Users } from 'lucide-react';

const stats = [
  {
    value: '99.53%',
    label: 'Attack Block Rate',
    description: 'Industry-leading detection across all attack vectors',
    icon: Shield,
    color: 'text-primary-600',
  },
  {
    value: '0.83%',
    label: 'Equal Error Rate',
    description: 'Audio deepfake detection accuracy',
    icon: TrendingUp,
    color: 'text-success',
  },
  {
    value: '<200ms',
    label: 'Average Latency',
    description: 'Real-time protection without delays',
    icon: Zap,
    color: 'text-warning',
  },
  {
    value: '0%',
    label: 'False Positive Rate',
    description: 'Never blocks legitimate requests',
    icon: Users,
    color: 'text-info',
  },
];

export function Stats() {
  return (
    <section className="py-16 bg-primary-900">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/10 mb-4">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-primary-200 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-primary-300/70 hidden md:block">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

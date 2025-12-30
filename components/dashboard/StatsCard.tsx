import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  subtitle,
  value,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded border border-midnight-200 p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-midnight-500 uppercase tracking-wide">
            {title}
            {subtitle && <span className="text-midnight-400 ml-1">({subtitle})</span>}
          </div>
          <div className="text-2xl font-semibold text-midnight-950 tabular-nums mt-2">{value}</div>
          {trend && (
            <div className="mt-1.5">
              <span
                className={cn(
                  'text-xs font-medium tabular-nums',
                  trend.isPositive ? 'text-secure-700' : 'text-critical-700'
                )}
              >
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="h-9 w-9 rounded bg-midnight-100 flex items-center justify-center">
            <Icon className="h-4 w-4 text-midnight-600" />
          </div>
        )}
      </div>
    </div>
  );
}

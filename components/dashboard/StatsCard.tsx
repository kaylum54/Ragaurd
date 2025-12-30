import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
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
        'bg-white rounded border border-midnight-300/60 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-midnight-50/80 border-b border-midnight-200/60">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-midnight-600 uppercase tracking-wide">
            {title}
          </span>
          {subtitle && (
            <span className="text-[10px] text-midnight-400">{subtitle}</span>
          )}
        </div>
      </div>
      {/* Body */}
      <div className="px-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-midnight-950 tabular-nums tracking-tight">{value}</div>
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-secure-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-critical-600" />
                )}
                <span
                  className={cn(
                    'text-[11px] font-semibold tabular-nums',
                    trend.isPositive ? 'text-secure-600' : 'text-critical-600'
                  )}
                >
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="h-10 w-10 rounded bg-midnight-100 border border-midnight-200/60 flex items-center justify-center">
              <Icon className="h-5 w-5 text-midnight-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

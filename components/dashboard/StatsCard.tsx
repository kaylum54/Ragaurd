import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'dashboard-card dashboard-card-interactive animate-slide-up',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="section-header">{title}</span>
        {Icon && (
          <div className="h-10 w-10 rounded-lg bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
            <Icon className="h-5 w-5 text-electric-500" />
          </div>
        )}
      </div>
      <div className="metric-display tabular-nums">{value}</div>
      {(description || trend) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span
              className={cn(
                'text-xs font-medium tabular-nums',
                trend.isPositive ? 'text-success' : 'text-danger'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          {description && (
            <span className="text-xs text-steel-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

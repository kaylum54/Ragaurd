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
        'bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <Icon className="h-5 w-5 text-violet-600" />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 tabular-nums">{value}</div>
      {(description || trend) && (
        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span
              className={cn(
                'text-xs font-medium tabular-nums',
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

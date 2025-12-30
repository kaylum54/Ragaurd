import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gradient-primary text-white',
        secondary: 'bg-[rgba(59,130,246,0.1)] text-electric-400 border border-[rgba(59,130,246,0.2)]',
        destructive: 'bg-[rgba(239,68,68,0.15)] text-danger border border-[rgba(239,68,68,0.2)]',
        outline: 'border border-[rgba(59,130,246,0.2)] text-steel-400',
        success: 'bg-[rgba(16,185,129,0.15)] text-success border border-[rgba(16,185,129,0.2)]',
        warning: 'bg-[rgba(245,158,11,0.15)] text-warning border border-[rgba(245,158,11,0.2)]',
        info: 'bg-[rgba(6,182,212,0.15)] text-cyan-400 border border-[rgba(6,182,212,0.2)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  href?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, size = 'default', showText = true, href = '/', variant = 'light' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    default: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl' },
  };

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative">
        <Shield
          className={cn(
            sizes[size].icon,
            variant === 'light'
              ? 'text-electric-500 fill-electric-500/20'
              : 'text-electric-600 fill-electric-100'
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight', sizes[size].text)}>
          <span className={variant === 'light' ? 'text-steel-100' : 'text-navy-900'}>RA</span>
          <span className="gradient-primary-text">Guard</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

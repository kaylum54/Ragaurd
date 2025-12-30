import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  href?: string;
}

export function Logo({ className, size = 'default', showText = true, href = '/' }: LogoProps) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    default: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl' },
  };

  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Shield
          className={cn(
            sizes[size].icon,
            'text-primary-600 fill-primary-100'
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
        </div>
      </div>
      {showText && (
        <span className={cn('font-bold tracking-tight', sizes[size].text)}>
          <span className="text-primary-900">Rag</span>
          <span className="text-primary-600">aurd</span>
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

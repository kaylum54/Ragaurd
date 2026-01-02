import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  href?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className, size = 'default', showText = true, href = '/', variant = 'light' }: LogoProps) {
  // 150% bigger than original (2.5x)
  const sizes = {
    sm: { height: 'h-20', width: 450, imgHeight: 112 },
    default: { height: 'h-[7.5rem]', width: 675, imgHeight: 168 },
    lg: { height: 'h-40', width: 900, imgHeight: 225 },
  };

  const content = (
    <div className={cn('flex items-center', className)}>
      <Image
        src="/images/ragaurd-logo.png"
        alt="Ragaurd - AI Voice Defense System"
        width={sizes[size].width}
        height={sizes[size].imgHeight}
        className={cn(sizes[size].height, 'w-auto')}
        priority
      />
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

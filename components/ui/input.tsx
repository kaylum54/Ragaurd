import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-[rgba(59,130,246,0.2)] bg-card px-4 py-2 text-sm text-steel-100 transition-all duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-steel-500 focus:outline-none focus:border-electric-500 focus:shadow-input-focus disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

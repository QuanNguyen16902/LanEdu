import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-xs font-semibold text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-9 w-full rounded-lg border border-border bg-surface px-3 py-1 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-disabled focus-visible:outline-none focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-error focus-visible:ring-error/20 focus:border-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[10px] text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

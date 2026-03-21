import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children?: React.ReactNode;
  className?: string;
}

export function Badge({ children, className, variant = 'neutral', ...props }: BadgeProps) {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-error/10 text-error border-error/20',
    info: 'bg-info/10 text-info border-info/20',
    neutral: 'bg-background text-text-secondary border-border',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0 rounded-md text-[10px] font-bold border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

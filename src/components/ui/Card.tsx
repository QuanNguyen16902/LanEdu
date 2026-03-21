import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  key?: string | number;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("bg-surface rounded-lg border border-border shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("px-5 py-4 border-b border-border", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 className={cn("text-base font-semibold text-text-primary", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("px-5 py-4 bg-background border-t border-border", className)} {...props}>
      {children}
    </div>
  );
}

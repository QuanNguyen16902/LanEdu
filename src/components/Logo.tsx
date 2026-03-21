import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}

export function Logo({ className, showText = true, size = 'md', dark = false }: LogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center", iconSizes[size])}>
        {/* Abstract Orchid Flower Shape */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-gold-500"
        >
          <path
            d="M12 22C12 22 16 18 16 14C16 10 12 8 12 8C12 8 8 10 8 14C8 18 12 22 Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          <path
            d="M12 8C12 8 18 6 20 10C22 14 18 16 18 16C18 16 16 12 12 8Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M12 8C12 8 6 6 4 10C2 14 6 16 6 16C6 16 8 12 12 8Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <circle cx="12" cy="10" r="2" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className={cn(
          "font-bold tracking-tight",
          dark ? "text-white" : "text-gray-900",
          size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-xl'
        )}>
          Lan<span className="text-gold-500">Edu</span>
        </span>
      )}
    </div>
  );
}

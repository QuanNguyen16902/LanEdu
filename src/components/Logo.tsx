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
        <img 
          src="/assets/images/orchid_logo.png" 
          alt="LanEdu Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to SVG if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
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

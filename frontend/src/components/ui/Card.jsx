import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Universal Card Component
 * Default: Clean white card, subtle border #E5E1D7, 16-20px radius
 */
export const Card = forwardRef(
  ({ children, hover = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white rounded-[18px] border border-[#E5E1D7] shadow-xs',
          hover && 'transition-all duration-250 hover:shadow-md hover:border-[#164A35]/30 hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

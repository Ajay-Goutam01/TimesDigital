import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Spinner = ({ size = 'md', className }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2
      className={cn('animate-spin text-[#164A35]', sizeMap[size], className)}
    />
  );
};

export const PageLoader = ({ message = 'Loading TIME Public School...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-[#164A35]/10 flex items-center justify-center text-[#164A35]">
        <Spinner size="lg" />
      </div>
      <p className="text-sm font-semibold text-[#68736D] tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export const InlineLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="py-8 flex items-center justify-center gap-2 text-xs font-semibold text-[#68736D]">
      <Spinner size="sm" />
      <span>{message}</span>
    </div>
  );
};

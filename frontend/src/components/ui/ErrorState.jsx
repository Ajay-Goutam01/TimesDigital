import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const ErrorState = ({
  title = 'Failed to load content',
  message = 'We encountered an issue fetching data from the server. Please try again.',
  onRetry,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full py-12 px-6 rounded-[20px] bg-white border border-[#E5E1D7] text-center flex flex-col items-center justify-center space-y-4 shadow-xs',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-[#C94A4A]/10 text-[#C94A4A] flex items-center justify-center">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-[#17231D]">{title}</h3>
        <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
      {action && !onRetry && <div className="pt-2">{action}</div>}
    </div>
  );
};

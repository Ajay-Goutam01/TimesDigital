import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'green',
  size = 'md',
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-sans font-bold tracking-wide rounded-full select-none';

  const variants = {
    green: 'bg-[#164A35]/10 text-[#164A35] border border-[#164A35]/20',
    gold: 'bg-[#C5A55A]/15 text-[#8A6D23] border border-[#C5A55A]/30',
    dark: 'bg-[#103728] text-white',
    cream: 'bg-[#F3F0E7] text-[#17231D] border border-[#E5E1D7]',
    success: 'bg-[#2F7D57]/15 text-[#2F7D57] border border-[#2F7D57]/30',
    danger: 'bg-[#C94A4A]/15 text-[#C94A4A] border border-[#C94A4A]/30',
    warning: 'bg-[#B88332]/15 text-[#B88332] border border-[#B88332]/30',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-xs sm:text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

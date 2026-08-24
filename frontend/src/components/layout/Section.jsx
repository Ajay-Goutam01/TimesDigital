import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Universal Section Component
 * Spacing: Desktop 72-96px (py-16 md:py-20 lg:py-24), Tablet 56-72px, Mobile 44-60px (py-12 sm:py-14)
 * Variants: cream (#FAF8F2), white (#FFFFFF), green (#164A35), dark (#103728)
 */
export const Section = ({
  children,
  variant = 'cream',
  spacing = 'default',
  className,
  id,
  ...props
}) => {
  const variants = {
    cream: 'bg-[#FAF8F2] text-[#17231D]',
    white: 'bg-white text-[#17231D]',
    green: 'bg-[#164A35] text-white',
    dark: 'bg-[#103728] text-white',
    'light-cream': 'bg-[#F3F0E7] text-[#17231D]',
  };

  const spacings = {
    none: 'py-0',
    sm: 'py-8 sm:py-10 md:py-12',
    default: 'py-12 sm:py-14 md:py-16 lg:py-20',
    lg: 'py-16 sm:py-20 md:py-24 lg:py-28',
  };

  return (
    <section
      id={id}
      className={cn('w-full relative', variants[variant], spacings[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
};

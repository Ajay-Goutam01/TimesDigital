import React from 'react';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export const SectionHeading = ({
  badge,
  badgeVariant = 'green',
  title,
  subtitle,
  align = 'center', // 'left', 'center', 'right'
  className,
  titleClassName,
  isDark = false,
}) => {
  const alignMap = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div
      className={cn(
        'flex flex-col max-w-3xl space-y-3 sm:space-y-4 mb-8 sm:mb-12',
        alignMap[align],
        className
      )}
    >
      {badge && <Badge variant={badgeVariant}>{badge}</Badge>}

      {title && (
        <h2
          className={cn(
            'text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.18]',
            isDark ? 'text-white' : 'text-[#164A35]',
            titleClassName
          )}
        >
          {title}
        </h2>
      )}

      {subtitle && (
        <p
          className={cn(
            'text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl',
            isDark ? 'text-white/80' : 'text-[#68736D]'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

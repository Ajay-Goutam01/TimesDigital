import React from 'react';
import { Container } from './Container';
import { Badge } from '../ui/Badge';
import { Breadcrumb } from './Breadcrumb';
import { cn } from '../../utils/cn';

export const PageHero = ({
  badge,
  title,
  subtitle,
  breadcrumbs = [],
  variant = 'cream',
  actions,
  children,
  className,
}) => {
  const isDark = variant === 'green' || variant === 'dark';

  return (
    <div
      className={cn(
        'relative border-b',
        isDark
          ? 'bg-[#103728] text-white border-[#164A35] py-8 sm:py-12 md:py-14'
          : variant === 'white'
          ? 'bg-white text-[#17231D] border-[#E5E1D7] py-8 sm:py-12 md:py-14'
          : 'bg-[#FAF8F2] text-[#17231D] border-[#E5E1D7] py-8 sm:py-12 md:py-14',
        className
      )}
    >
      <Container>
        {/* Breadcrumb row */}
        {breadcrumbs.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <Breadcrumb items={breadcrumbs} isDark={isDark} />
          </div>
        )}

        <div className="max-w-3xl space-y-3 sm:space-y-4">
          {badge && (
            <div>
              <Badge variant={isDark ? 'gold' : 'green'}>{badge}</Badge>
            </div>
          )}

          <h1
            className={cn(
              'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]',
              isDark ? 'text-white' : 'text-[#164A35]'
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className={cn(
                'text-sm sm:text-base md:text-lg leading-relaxed',
                isDark ? 'text-white/80' : 'text-[#68736D]'
              )}
            >
              {subtitle}
            </p>
          )}

          {actions && <div className="pt-2 flex flex-wrap gap-3">{actions}</div>}

          {children}
        </div>
      </Container>
    </div>
  );
};

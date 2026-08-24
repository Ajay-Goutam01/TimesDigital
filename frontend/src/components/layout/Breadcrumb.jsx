import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Breadcrumb = ({ items = [], isDark = false, className }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-xs sm:text-[13px] font-medium select-none', className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li>
          <Link
            to="/"
            className={cn(
              'inline-flex items-center gap-1 transition-colors',
              isDark ? 'text-white/70 hover:text-white' : 'text-[#68736D] hover:text-[#164A35]'
            )}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight
                className={cn('w-3 h-3', isDark ? 'text-white/40' : 'text-[#68736D]/60')}
              />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className={cn(
                    'transition-colors',
                    isDark ? 'text-white/70 hover:text-white' : 'text-[#68736D] hover:text-[#164A35]'
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'font-bold truncate max-w-[200px] sm:max-w-xs',
                    isDark ? 'text-[#C5A55A]' : 'text-[#164A35]'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

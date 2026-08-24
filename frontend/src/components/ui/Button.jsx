import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

/**
 * Universal Button Component
 * Palette: Forest Green primary, Muted Gold accent, Clean Secondary
 */
export const Button = forwardRef(
  (
    {
      children,
      type = 'button',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className,
      icon: Icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center max-w-full font-sans font-semibold rounded-[11px] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A35] focus-visible:ring-offset-2 text-center select-none';

    const variants = {
      primary:
        'bg-[#164A35] text-white hover:bg-[#103728] active:bg-[#0D2E21] shadow-xs hover:shadow-sm',
      secondary:
        'bg-transparent border border-[#164A35] text-[#164A35] hover:bg-[#164A35] hover:text-white active:bg-[#103728]',
      gold:
        'bg-[#C5A55A] text-[#103728] hover:bg-[#D4B56B] active:bg-[#B5954B] font-bold shadow-xs hover:shadow-sm',
      'outline-white':
        'bg-transparent border border-white/85 text-white hover:bg-white/10 active:bg-white/20',
      'outline-gold':
        'bg-transparent border border-[#C5A55A] text-[#C5A55A] hover:bg-[#C5A55A]/10 active:bg-[#C5A55A]/20',
      ghost:
        'bg-transparent text-[#164A35] hover:bg-[#F3F0E7] active:bg-[#E5E1D7]',
      danger:
        'bg-[#C94A4A] text-white hover:bg-[#B33939] active:bg-[#992828] shadow-xs',
      white:
        'bg-white text-[#164A35] hover:bg-[#FAF8F2] active:bg-[#F3F0E7] shadow-xs border border-[#E5E1D7]',
    };

    const sizes = {
      sm: 'min-h-[36px] px-3.5 text-xs gap-1.5 rounded-[9px]',
      md: 'min-h-[44px] px-5 text-sm md:text-[15px] gap-2 rounded-[11px]',
      lg: 'min-h-[50px] px-7 text-sm sm:text-base gap-2.5 rounded-[12px]',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

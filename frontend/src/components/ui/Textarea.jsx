import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Textarea = forwardRef(
  ({ label, error, helperText, rows = 4, className, id, required, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold text-[#17231D]"
          >
            {label}
            {required && <span className="text-[#C94A4A] ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5E1D7] rounded-[11px] text-[#17231D] placeholder-[#68736D]/60 transition-colors focus:border-[#164A35] focus:ring-1 focus:ring-[#164A35] focus:outline-none disabled:bg-[#F3F0E7] disabled:text-[#68736D] disabled:cursor-not-allowed resize-y',
            error && 'border-[#C94A4A] focus:border-[#C94A4A] focus:ring-[#C94A4A]',
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-[#C94A4A] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#68736D]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Select = forwardRef(
  (
    {
      label,
      options = [],
      placeholder = 'Select an option',
      error,
      helperText,
      className,
      id,
      required,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-[#17231D]"
          >
            {label}
            {required && <span className="text-[#C94A4A] ml-0.5">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full min-h-[44px] px-3.5 py-2 text-sm bg-white border border-[#E5E1D7] rounded-[11px] text-[#17231D] transition-colors focus:border-[#164A35] focus:ring-1 focus:ring-[#164A35] focus:outline-none disabled:bg-[#F3F0E7] disabled:text-[#68736D] disabled:cursor-not-allowed cursor-pointer',
            error && 'border-[#C94A4A] focus:border-[#C94A4A] focus:ring-[#C94A4A]',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>

        {error && <p className="text-xs text-[#C94A4A] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#68736D]">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

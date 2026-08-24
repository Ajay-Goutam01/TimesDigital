import React from 'react';
import { cn } from '../../utils/cn';

export const Container = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

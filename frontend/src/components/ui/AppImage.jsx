import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export const AppImage = ({
  src,
  alt = 'TIME School Media',
  aspectRatio = 'course', // 'faculty' (4:5), 'course' (4:3), 'batch' (16:10), 'banner' (21:9), 'square' (1:1), 'auto'
  rounded = 'md',
  className,
  priority = false,
  fallbackText,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectMap = {
    faculty: 'aspect-[4/5]',
    course: 'aspect-[4/3]',
    batch: 'aspect-[16/10]',
    banner: 'aspect-[21/9]',
    square: 'aspect-square',
    auto: '',
  };

  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded-[8px]',
    md: 'rounded-[14px]',
    lg: 'rounded-[18px]',
    full: 'rounded-full',
  };

  if (!src || error) {
    return (
      <div
        className={cn(
          'w-full bg-[#F3F0E7] flex flex-col items-center justify-center p-4 text-center border border-[#E5E1D7]',
          aspectMap[aspectRatio] || 'aspect-[4/3]',
          roundedMap[rounded],
          className
        )}
      >
        <ImageIcon className="w-8 h-8 text-[#C5A55A]/80 mb-1" />
        <span className="text-[11px] font-semibold text-[#68736D] max-w-[85%] truncate">
          {fallbackText || alt}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#F3F0E7] w-full',
        aspectMap[aspectRatio],
        roundedMap[rounded],
        className
      )}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-[#E5E1D7]/60 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'w-full h-full object-cover transition-all duration-350',
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        )}
      />
    </div>
  );
};

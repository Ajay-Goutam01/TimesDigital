import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-[10px] bg-[#E5E1D7]/70', className)}
      {...props}
    />
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[18px] border border-[#E5E1D7] p-5 space-y-4 shadow-xs"
        >
          <Skeleton className="h-44 w-full rounded-[14px]" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
          <div className="pt-2 flex justify-between items-center">
            <Skeleton className="h-8 w-24 rounded-[8px]" />
            <Skeleton className="h-8 w-28 rounded-[8px]" />
          </div>
        </div>
      ))}
    </>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-white rounded-[18px] border border-[#E5E1D7] overflow-hidden p-4 space-y-3">
      <Skeleton className="h-10 w-full rounded-[8px] mb-4" />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 items-center py-2 border-b border-[#E5E1D7]/40 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-5 flex-1 rounded-[6px]" />
          ))}
        </div>
      ))}
    </div>
  );
};

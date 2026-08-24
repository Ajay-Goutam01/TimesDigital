import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  message = 'There is currently no data available in this section.',
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full py-12 px-6 rounded-[20px] bg-white border border-[#E5E1D7] text-center flex flex-col items-center justify-center space-y-4 shadow-xs',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-[#FAF8F2] border border-[#E5E1D7] flex items-center justify-center text-[#C5A55A]">
        <Icon className="w-7 h-7" />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-base font-bold text-[#17231D]">{title}</h3>
        <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">{message}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

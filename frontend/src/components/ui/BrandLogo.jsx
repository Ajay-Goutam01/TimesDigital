import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useGetWebsiteSettingsQuery } from '../../features/school/services/websiteSettingsApi';
import { cn } from '../../utils/cn';

export const BrandLogo = ({
  variant = 'dark', // 'dark' (on light background) or 'light' (on dark background)
  showTagline = true,
  className,
}) => {
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const settings = settingsData?.data || {};

  const isLight = variant === 'light';

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2.5 sm:gap-3 group select-none', className)}
    >
      {/* Emblem Icon */}
      {settings.logo?.url ? (
        <img
          src={settings.logo.url}
          alt={settings.schoolName || 'TIME Public School'}
          className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-full border border-[#E5E1D7]"
        />
      ) : (
        <div
          className={cn(
            'w-10 h-10 sm:w-11 sm:h-11 rounded-[12px] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 shadow-xs',
            isLight
              ? 'bg-[#FAF8F2] text-[#164A35]'
              : 'bg-[#164A35] text-[#C5A55A]'
          )}
        >
          <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      )}

      {/* Typography */}
      <div className="flex flex-col text-left leading-tight">
        <span
          className={cn(
            'font-extrabold text-sm sm:text-base tracking-tight transition-colors',
            isLight ? 'text-white' : 'text-[#164A35]'
          )}
        >
          {settings.schoolName || 'TIME PUBLIC SCHOOL'}
        </span>
        <span
          className={cn(
            'font-bold text-[10px] sm:text-[11px] tracking-wider uppercase',
            isLight ? 'text-[#C5A55A]' : 'text-[#C5A55A]'
          )}
        >
          {settings.coachingName || 'TIMES DIGITAL'}
          <span className="hidden sm:inline font-normal text-[#68736D] lowercase ml-1">
            • {settings.locationTag || 'Shahdol'}
          </span>
        </span>
      </div>
    </Link>
  );
};

import React from 'react';
import { Trophy, Users, Award, Calendar } from 'lucide-react';
import { Container } from '../../../components/layout/Container';

export const AchievementsSection = ({ data }) => {
  const stats = data?.items || [
    { label: 'Students Enrolled', value: '2500+' },
    { label: 'IIT / NEET Selections', value: '500+' },
    { label: 'Kota Expert Faculty', value: '50+' },
    { label: 'Years of Excellence', value: '15+' },
  ];

  const icons = [Users, Trophy, Award, Calendar];

  return (
    <div className="bg-white border-b border-[#E5E1D7] py-6 sm:py-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E1D7]">
          {stats.map((stat, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 p-2 sm:px-4 first:pt-0 sm:first:pt-2 pt-4"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[12px] bg-[#FAF8F2] border border-[#E5E1D7] flex items-center justify-center text-[#C5A55A] shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#164A35]" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#164A35] block leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#68736D]">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

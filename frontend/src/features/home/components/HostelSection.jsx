import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Utensils, Bed, BookOpen, ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';

export const HostelSection = ({ data }) => {
  const highlights = [
    { label: 'Nutritious Veg Meals', icon: Utensils },
    { label: '24/7 CCTV & Security', icon: ShieldCheck },
    { label: 'Spacious AC & Non-AC Rooms', icon: Bed },
    { label: 'Evening Supervised Study Hours', icon: BookOpen },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <div className="bg-white rounded-[24px] border border-[#E5E1D7] p-6 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <Badge variant="green" size="md">
              Residential Wing
            </Badge>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#164A35] leading-tight">
              {data?.title || 'Safe, Disciplined & Comfortable Hostel Environment'}
            </h2>

            <p className="text-sm sm:text-base text-[#68736D] leading-relaxed">
              {data?.description ||
                'Designed specifically for outstation competitive exam aspirants, our residential campus ensures zero distraction, healthy nutrition, and structured daily revision routines.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-[12px] bg-[#FAF8F2] border border-[#E5E1D7] text-xs font-semibold text-[#17231D]"
                  >
                    <Icon className="w-4 h-4 text-[#C5A55A] shrink-0" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/facilities">
                <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                  Hostel Details
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="md">
                  Book Campus Visit
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <AppImage
              src={data?.image?.url}
              alt="Hostel Wing at TIME Public School"
              aspectRatio="course"
              rounded="lg"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

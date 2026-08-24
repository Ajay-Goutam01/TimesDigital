import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { AppImage } from '../../../components/ui/AppImage';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicTestimonialsQuery } from '../../testimonials/services/testimonialApi';

export const TestimonialsSection = ({ data }) => {
  const { data: testData, isLoading } = useGetPublicTestimonialsQuery({ limit: 3 });
  const testimonials = testData?.data?.testimonials || testData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <SectionHeading
          badge="Voices of Trust"
          title={data?.title || 'What Parents & Students Say About Us'}
          subtitle={
            data?.subtitle ||
            'Real experiences from students who cracked premier exams and parents who trust our academic guidance.'
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <Card
                key={item._id}
                hover
                className="p-6 flex flex-col justify-between space-y-4 bg-white border border-[#E5E1D7]"
              >
                <div className="space-y-3">
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#C5A55A]">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-[#17231D] leading-relaxed italic">
                    "{item.message}"
                  </p>
                </div>

                {/* Author Details */}
                <div className="pt-3 border-t border-[#E5E1D7] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E5E1D7]">
                    <AppImage
                      src={item.photo?.url}
                      alt={item.name}
                      aspectRatio="square"
                      rounded="full"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#164A35] leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-[#68736D] block">
                      {item.role || item.studentOrParent || 'Student / Parent'}
                      {item.classOrCourse ? ` • ${item.classOrCourse}` : ''}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
};

import React, { useState } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { AppImage } from '../../../components/ui/AppImage';
import { EmptyState } from '../../../components/ui/EmptyState';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicTestimonialsQuery } from '../services/testimonialApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const TestimonialsPage = () => {
  useDocumentTitle('Student & Parent Testimonials');
  const [selectedRole, setSelectedRole] = useState('All');

  const { data, isLoading } = useGetPublicTestimonialsQuery();
  const testimonials = data?.data?.testimonials || data?.data || [];

  const roleFilters = ['All', 'Student', 'Parent', 'Alumnus'];

  const filteredTestimonials =
    selectedRole === 'All'
      ? testimonials
      : testimonials.filter((t) =>
          (t.role || t.studentOrParent || '')
            .toLowerCase()
            .includes(selectedRole.toLowerCase())
        );

  return (
    <div className="w-full">
      <PageHero
        badge="Testimonials & Reviews"
        title="Real Stories of Growth, Discipline & Success"
        subtitle="Read candid feedback from our students who secured dream college selections and parents who appreciate our nurturing atmosphere."
        breadcrumbs={[{ label: 'Testimonials' }]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          {/* Role Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
            {roleFilters.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedRole === role
                    ? 'bg-[#164A35] text-white shadow-xs'
                    : 'bg-white text-[#17231D] border border-[#E5E1D7] hover:bg-[#F3F0E7]'
                }`}
              >
                {role} {role !== 'All' && 'Reviews'}
              </button>
            ))}
          </div>

          {/* Testimonials Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton count={6} />
            </div>
          ) : filteredTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTestimonials.map((item) => (
                <Card
                  key={item._id}
                  hover
                  className="p-6 flex flex-col justify-between space-y-4 bg-white border border-[#E5E1D7]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#C5A55A]">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[#17231D] leading-relaxed italic">
                      "{item.message}"
                    </p>
                  </div>

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
          ) : (
            <EmptyState
              title="No reviews found"
              message="No reviews match the selected filter."
            />
          )}
        </Container>
      </section>
    </div>
  );
};

export default TestimonialsPage;

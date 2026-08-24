import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { useGetPublicFacilitiesQuery } from '../../facilities/services/facilityApi';

export const FacilitiesSection = ({ data }) => {
  const { data: facData, isLoading } = useGetPublicFacilitiesQuery({ limit: 3 });
  const facilities = facData?.data?.facilities || facData?.data || [];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white border-y border-[#E5E1D7]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <SectionHeading
            badge="Campus Infrastructure"
            title={data?.title || 'World-Class Learning Infrastructure'}
            subtitle={
              data?.subtitle ||
              'Explore smart classrooms, advanced science labs, digital libraries, and sports arena.'
            }
            align="left"
            className="mb-0"
          />

          <Link to="/facilities" className="hidden sm:inline-block shrink-0">
            <Button variant="secondary" size="md" icon={ArrowRight} iconPosition="right">
              View All Facilities
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton count={3} />
          </div>
        ) : facilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <Card key={fac._id} hover className="overflow-hidden group flex flex-col h-full">
                <AppImage
                  src={fac.images?.[0]?.url || fac.image?.url}
                  alt={fac.title}
                  aspectRatio="course"
                  rounded="none"
                />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#C5A55A] uppercase tracking-wider block">
                      {fac.category || 'Campus Facility'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#17231D] group-hover:text-[#164A35] transition-colors">
                      {fac.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#68736D] line-clamp-2 leading-relaxed">
                      {fac.description}
                    </p>
                  </div>
                  <Link
                    to={`/facilities/${fac.slug || fac._id}`}
                    className="text-xs font-bold text-[#164A35] flex items-center gap-1 hover:text-[#103728]"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A55A]" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : null}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/facilities">
            <Button variant="secondary" size="md" className="w-full">
              View All Facilities
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

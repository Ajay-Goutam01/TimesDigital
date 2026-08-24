import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { PageLoader } from '../../../components/ui/Loader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useGetFacilityBySlugQuery } from '../services/facilityApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const FacilityDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetFacilityBySlugQuery(slug);
  const facility = data?.data?.facility || data?.data;

  useDocumentTitle(facility?.title || 'Facility Details');

  if (isLoading) return <PageLoader message="Loading facility details..." />;
  if (isError || !facility) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Facility Not Found"
          message="The requested campus facility details could not be retrieved."
          onRetry={refetch}
        />
      </Container>
    );
  }

  const images = facility.images || [];

  return (
    <div className="w-full">
      <PageHero
        badge={facility.category || 'Campus Infrastructure'}
        title={facility.title}
        subtitle={facility.description}
        breadcrumbs={[
          { label: 'Facilities', path: '/facilities' },
          { label: facility.title },
        ]}
        actions={
          <Link to="/facilities">
            <Button variant="secondary" size="sm" icon={ArrowLeft}>
              All Facilities
            </Button>
          </Link>
        }
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Media & Description (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-[20px] overflow-hidden border border-[#E5E1D7] shadow-xs">
                <AppImage
                  src={images[0]?.url || facility.image?.url}
                  alt={facility.title}
                  aspectRatio="banner"
                  rounded="none"
                />
              </div>

              {/* Description */}
              <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-[#164A35]">
                  Facility Overview & Features
                </h3>
                <div className="text-sm text-[#17231D] leading-relaxed whitespace-pre-line">
                  {facility.description}
                </div>
              </div>

              {/* Photo Gallery of this Facility */}
              {images.length > 1 && (
                <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-4">
                  <h3 className="text-lg font-bold text-[#164A35]">
                    Facility Photographs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.slice(1).map((img, idx) => (
                      <div key={idx} className="rounded-[14px] overflow-hidden border border-[#E5E1D7]">
                        <AppImage
                          src={img.url || img}
                          alt={`${facility.title} photo ${idx + 2}`}
                          aspectRatio="course"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Key Inclusions & Visit CTA (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {facility.features && facility.features.length > 0 && (
                <Card className="p-6 space-y-4 bg-white border border-[#E5E1D7]">
                  <h4 className="text-xs font-bold text-[#68736D] uppercase tracking-wider">
                    Equipment & Inclusions
                  </h4>
                  <ul className="space-y-2.5">
                    {facility.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#17231D]">
                        <CheckCircle2 className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <Card className="p-6 space-y-4 bg-[#103728] text-white">
                <h4 className="text-base font-bold">Experience the Campus in Person</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Schedule a guided tour of our classrooms, science labs, reading rooms, and hostel facilities.
                </p>
                <Link to="/contact" className="block">
                  <Button variant="gold" size="md" className="w-full text-[#103728]">
                    Schedule Campus Visit
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FacilityDetailPage;

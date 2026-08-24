import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Home, Award, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { PageLoader } from '../../../components/ui/Loader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EnquiryForm } from '../../enquiries/components/EnquiryForm';
import { useGetBatchBySlugQuery } from '../services/batchApi';
import { useGetWebsiteSettingsQuery } from '../../school/services/websiteSettingsApi';
import { useGetHomepageDataQuery } from '../../home/services/homeApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const BatchDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetBatchBySlugQuery(slug);
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const { data: homeData } = useGetHomepageDataQuery();

  const batch = data?.data?.batch || data?.data;
  const settings = settingsData?.data || {};
  const homepage = homeData?.data || {};

  useDocumentTitle(batch?.name || 'Batch Details');

  if (isLoading) return <PageLoader message="Loading batch schedule..." />;
  if (isError || !batch) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Batch Not Found"
          message="The requested batch details could not be retrieved."
          onRetry={refetch}
        />
      </Container>
    );
  }

  const isAdmissionOpen = settings.isAdmissionOpen !== false && batch.status === 'admissions-open';
  const isHostelVisible = homepage.hostelSection?.isVisible !== false && batch.hostelAvailable === true;
  const hasScholarship = Boolean(batch.scholarshipInfo || batch.feeStructure?.scholarshipUpto);

  const startDateFormatted = batch.startDate
    ? new Date(batch.startDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'To be announced';

  return (
    <div className="w-full">
      <PageHero
        badge={batch.category || 'Target Batch'}
        title={batch.name}
        subtitle={batch.shortDescription || batch.description}
        breadcrumbs={[
          { label: 'Batches', path: '/batches' },
          { label: batch.name },
        ]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Schedule, Faculty, Inclusions (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Media Preview */}
              <div className="rounded-[20px] overflow-hidden border border-[#E5E1D7] shadow-xs">
                <AppImage
                  src={batch.batchImage?.url}
                  alt={batch.name}
                  aspectRatio="banner"
                  rounded="none"
                />
              </div>

              {/* Key Schedule Information */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-[14px] bg-white border border-[#E5E1D7] space-y-1">
                  <span className="text-[11px] font-bold text-[#68736D] uppercase block">
                    Commencement
                  </span>
                  <span className="text-sm font-extrabold text-[#164A35]">
                    {startDateFormatted}
                  </span>
                </div>
                {batch.timings && (
                  <div className="p-3.5 rounded-[14px] bg-white border border-[#E5E1D7] space-y-1">
                    <span className="text-[11px] font-bold text-[#68736D] uppercase block">
                      Daily Timings
                    </span>
                    <span className="text-sm font-extrabold text-[#164A35]">
                      {batch.timings}
                    </span>
                  </div>
                )}
                {batch.class && (
                  <div className="p-3.5 rounded-[14px] bg-white border border-[#E5E1D7] space-y-1">
                    <span className="text-[11px] font-bold text-[#68736D] uppercase block">
                      Class Level
                    </span>
                    <span className="text-sm font-extrabold text-[#164A35]">
                      Class {batch.class}
                    </span>
                  </div>
                )}
              </div>

              {/* Detailed Overview */}
              <div className="space-y-3 bg-white p-6 sm:p-8 rounded-[20px] border border-[#E5E1D7] shadow-xs">
                <h3 className="text-lg font-bold text-[#164A35]">
                  Batch Curriculum & Structure
                </h3>
                <div className="text-sm text-[#17231D] leading-relaxed whitespace-pre-line">
                  {batch.description}
                </div>
              </div>

              {/* Conditional Amenities: Hostel Card */}
              {isHostelVisible && (
                <div className="p-5 rounded-[18px] bg-[#FAF8F2] border border-[#E5E1D7] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5 text-[#C5A55A]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#164A35]">
                      Residential Hostel Facility Available
                    </h4>
                    <p className="text-xs text-[#68736D] leading-relaxed">
                      Safe accommodation, disciplined evening study hours, and hygienic meals are available for outstation students enrolling in this batch.
                    </p>
                  </div>
                </div>
              )}

              {/* Conditional Amenities: Scholarship Card */}
              {hasScholarship && (
                <div className="p-5 rounded-[18px] bg-[#FAF8F2] border border-[#E5E1D7] flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-[10px] bg-[#C5A55A]/20 text-[#8A6D23] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#8A6D23]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#164A35]">
                      Times Talent Scholarship Applicable
                    </h4>
                    <p className="text-xs text-[#68736D] leading-relaxed">
                      {batch.scholarshipInfo ||
                        `Avail fee concessions up to ${batch.feeStructure?.scholarshipUpto || '100%'} based on TTSE performance and previous school marks.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Inclusions / Highlights */}
              {batch.features && batch.features.length > 0 && (
                <div className="space-y-4 bg-white p-6 sm:p-8 rounded-[20px] border border-[#E5E1D7] shadow-xs">
                  <h3 className="text-lg font-bold text-[#164A35]">
                    Batch Features & Inclusions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {batch.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-[12px] bg-[#FAF8F2] border border-[#E5E1D7] text-xs font-semibold text-[#17231D]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C5A55A] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Lead Form & Apply (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Enquiry Box */}
              <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-sm space-y-6">
                <div className="space-y-1.5">
                  <Badge variant="gold" size="sm">
                    {batch.status === 'seats-full' ? 'Seats Full' : 'Admissions Active'}
                  </Badge>
                  <h3 className="text-xl font-extrabold text-[#164A35]">
                    Inquire for {batch.name}
                  </h3>
                  <p className="text-xs text-[#68736D]">
                    Get immediate information regarding fee structure, scholarship discounts, and batch seat availability.
                  </p>
                </div>

                <EnquiryForm
                  defaultBatch={batch.name}
                  defaultBatchId={batch._id}
                  defaultCourseId={typeof batch.course === 'object' ? batch.course?._id : batch.course}
                  source={`batch_${batch.slug || batch._id}`}
                />
              </div>

              {/* Online Admission Callout */}
              <Card className="p-6 space-y-4 bg-[#103728] text-white">
                <h4 className="text-base font-bold">Confirmed Seat Reservation</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  {isAdmissionOpen
                    ? 'Apply directly online through our digital admissions portal to confirm your seat.'
                    : 'Admissions for this cycle are currently closed. Submit an enquiry above to join the priority waitlist.'}
                </p>
                {isAdmissionOpen && (
                  <Link to="/admissions" className="block">
                    <Button variant="gold" size="md" className="w-full text-[#103728]">
                      Complete Online Application
                    </Button>
                  </Link>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BatchDetailPage;

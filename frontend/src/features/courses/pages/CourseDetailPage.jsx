import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, Calendar } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { PageLoader } from '../../../components/ui/Loader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EnquiryForm } from '../../enquiries/components/EnquiryForm';
import { useGetCourseBySlugQuery } from '../services/courseApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const CourseDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetCourseBySlugQuery(slug);
  const course = data?.data?.course || data?.data;

  useDocumentTitle(course?.title || 'Course Details');

  if (isLoading) return <PageLoader message="Loading program syllabus..." />;
  if (isError || !course) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Course Not Found"
          message="The requested academic program details could not be retrieved."
          onRetry={refetch}
        />
      </Container>
    );
  }

  return (
    <div className="w-full">
      <PageHero
        badge={course.category || 'Academic Program'}
        title={course.title}
        subtitle={course.shortDescription || course.description}
        breadcrumbs={[
          { label: 'Courses', path: '/courses' },
          { label: course.title },
        ]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Details, Curriculum, Features (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Media Preview */}
              <div className="rounded-[20px] overflow-hidden border border-[#E5E1D7] shadow-xs">
                <AppImage
                  src={course.image?.url}
                  alt={course.title}
                  aspectRatio="banner"
                  rounded="none"
                />
              </div>

              {/* Course Key Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {course.duration && (
                  <div className="p-3.5 rounded-[14px] bg-white border border-[#E5E1D7] space-y-1">
                    <span className="text-[11px] font-bold text-[#68736D] uppercase block">
                      Duration
                    </span>
                    <span className="text-sm font-extrabold text-[#164A35]">
                      {course.duration}
                    </span>
                  </div>
                )}
                {course.class && (
                  <div className="p-3.5 rounded-[14px] bg-white border border-[#E5E1D7] space-y-1">
                    <span className="text-[11px] font-bold text-[#68736D] uppercase block">
                      Target Class
                    </span>
                    <span className="text-sm font-extrabold text-[#164A35]">
                      Class {course.class}
                    </span>
                  </div>
                )}
                {course.eligibility && (
                  <div className="p-3.5 rounded-[14px] bg-white border border-[#E5E1D7] space-y-1">
                    <span className="text-[11px] font-bold text-[#68736D] uppercase block">
                      Eligibility
                    </span>
                    <span className="text-sm font-extrabold text-[#164A35] truncate block">
                      {course.eligibility}
                    </span>
                  </div>
                )}
              </div>

              {/* Comprehensive Description */}
              <div className="space-y-3 bg-white p-6 sm:p-8 rounded-[20px] border border-[#E5E1D7] shadow-xs">
                <h3 className="text-lg font-bold text-[#164A35]">
                  Program Overview & Pedagogy
                </h3>
                <div className="text-sm text-[#17231D] leading-relaxed whitespace-pre-line">
                  {course.description}
                </div>
              </div>

              {/* Program Features / Highlights */}
              {course.features && course.features.length > 0 && (
                <div className="space-y-4 bg-white p-6 sm:p-8 rounded-[20px] border border-[#E5E1D7] shadow-xs">
                  <h3 className="text-lg font-bold text-[#164A35]">
                    Key Inclusions & Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.features.map((feat, idx) => (
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

            {/* Right Column: Admission & Enquiry Sidebar (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Quick Admission Card */}
              <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-sm space-y-6">
                <div className="space-y-1.5">
                  <Badge variant="gold" size="sm">
                    Admissions Open 2025–26
                  </Badge>
                  <h3 className="text-xl font-extrabold text-[#164A35]">
                    Enquire for {course.title}
                  </h3>
                  <p className="text-xs text-[#68736D]">
                    Receive batch schedules, faculty details, and scholarship test dates.
                  </p>
                </div>

                <EnquiryForm
                  defaultCourse={course.title}
                  source={`course_${course.slug || course._id}`}
                />
              </div>

              {/* Actions Box */}
              <Card className="p-6 space-y-4 bg-[#103728] text-white">
                <h4 className="text-base font-bold">Ready to Apply Online?</h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  Submit the online application form to reserve your seat in upcoming batches.
                </p>
                <Link to="/admissions" className="block">
                  <Button variant="gold" size="md" className="w-full text-[#103728]">
                    Start Admission Application
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

export default CourseDetailPage;

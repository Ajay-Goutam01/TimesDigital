import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, GraduationCap, BookOpen, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AppImage } from '../../../components/ui/AppImage';
import { PageLoader } from '../../../components/ui/Loader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useGetFacultyBySlugQuery } from '../services/facultyApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const FacultyDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, refetch } = useGetFacultyBySlugQuery(slug);
  const faculty = data?.data?.faculty || data?.data;

  useDocumentTitle(faculty?.name || 'Faculty Profile');

  if (isLoading) return <PageLoader message="Loading mentor profile..." />;
  if (isError || !faculty) {
    return (
      <Container className="py-20">
        <ErrorState
          title="Profile Not Found"
          message="The requested faculty mentor details could not be retrieved."
          onRetry={refetch}
        />
      </Container>
    );
  }

  return (
    <div className="w-full">
      <PageHero
        badge={faculty.subject || 'Faculty Mentor'}
        title={faculty.name}
        subtitle={`${faculty.designation} • ${faculty.qualification || 'Academician'}`}
        breadcrumbs={[
          { label: 'Faculty', path: '/faculty' },
          { label: faculty.name },
        ]}
      />

      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Portrait & Key Badges (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-[22px] overflow-hidden border border-[#E5E1D7] shadow-sm bg-white p-3">
                <AppImage
                  src={faculty.profilePhoto?.url}
                  alt={faculty.name}
                  aspectRatio="faculty"
                  rounded="md"
                />
                <div className="pt-4 text-center space-y-1">
                  <h3 className="text-lg font-bold text-[#17231D]">
                    {faculty.name}
                  </h3>
                  <p className="text-xs text-[#68736D] font-medium">
                    {faculty.designation}
                  </p>
                  <div className="pt-2 flex justify-center gap-2">
                    {faculty.isExKota && (
                      <Badge variant="gold" size="sm">
                        Ex-Kota Faculty
                      </Badge>
                    )}
                    {faculty.category && (
                      <Badge variant="dark" size="sm">
                        {faculty.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Experience Quick Card */}
              <Card className="p-5 space-y-3 bg-white border border-[#E5E1D7]">
                <h4 className="text-xs font-bold text-[#68736D] uppercase tracking-wider">
                  Credentials Summary
                </h4>
                <div className="space-y-2 text-xs text-[#17231D]">
                  {faculty.experienceYears && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#68736D]">Teaching Experience:</span>
                      <span className="font-bold text-[#164A35]">
                        {faculty.experienceYears}+ Years
                      </span>
                    </div>
                  )}
                  {faculty.qualification && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#68736D]">Qualification:</span>
                      <span className="font-bold">{faculty.qualification}</span>
                    </div>
                  )}
                  {faculty.subject && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#68736D]">Core Subject:</span>
                      <span className="font-bold text-[#164A35]">
                        {faculty.subject}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column: Bio, Pedagogy, Specializations (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-[#164A35]">
                  Academic Background & Teaching Philosophy
                </h3>
                <div className="text-sm text-[#17231D] leading-relaxed whitespace-pre-line">
                  {faculty.bio ||
                    `${faculty.name} brings extensive pedagogical experience preparing students for CBSE boards, IIT-JEE, and NEET entrance examinations. With a strong emphasis on conceptual rigor and systematic problem-solving methods, ${faculty.name} has mentored numerous rankers into premier institutions across the nation.`}
                </div>
              </div>

              {faculty.specialization && (
                <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-[#E5E1D7] shadow-xs space-y-3">
                  <h3 className="text-lg font-bold text-[#164A35]">
                    Subject Specializations
                  </h3>
                  <p className="text-sm text-[#17231D] leading-relaxed">
                    {faculty.specialization}
                  </p>
                </div>
              )}

              {/* Bottom Action CTA */}
              <div className="p-6 rounded-[20px] bg-[#103728] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold">Want to Learn from Our Master Faculty?</h4>
                  <p className="text-xs text-white/80">
                    Apply for 2025–26 admissions and attend classroom trial sessions.
                  </p>
                </div>
                <Link to="/admissions" className="shrink-0">
                  <Button variant="gold" size="md" className="text-[#103728]">
                    Apply for Admission
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default FacultyDetailPage;

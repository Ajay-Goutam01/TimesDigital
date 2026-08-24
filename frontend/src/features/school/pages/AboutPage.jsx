import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Eye, Award, Users, BookOpen, ArrowRight } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useGetWebsiteSettingsQuery } from '../services/websiteSettingsApi';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const AboutPage = () => {
  useDocumentTitle('About Us | Legacy & Vision');
  const { data: settingsData } = useGetWebsiteSettingsQuery();
  const settings = settingsData?.data || {};

  return (
    <div className="w-full">
      <PageHero
        badge="About TIME Public School & TIMES DIGITAL"
        title="Pioneering Academic Excellence in Shahdol"
        subtitle="A premier educational destination combining values-driven CBSE schooling with national competitive exam mastery."
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Legacy & Vision Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-[#E5E1D7]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A55A] block">
                Our Foundation Story
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#164A35] leading-tight">
                Bridging the Gap to Premier Higher Education
              </h2>
              <p className="text-sm sm:text-base text-[#68736D] leading-relaxed">
                Founded with a mission to bring top-tier national coaching and holistic CBSE schooling to Shahdol, TIME Public School and TIMES DIGITAL have empowered hundreds of students to achieve their dreams of entering IITs, AIIMS, NITs, and top medical & engineering colleges.
              </p>
              <p className="text-sm sm:text-base text-[#68736D] leading-relaxed">
                By integrating school curriculum with intensive competitive exam rigor, our students excel in board examinations while securing top percentiles in competitive entrance tests.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link to="/courses">
                  <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right">
                    Explore Our Programs
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="md">
                    Campus Location
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-6 space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]">
                <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#C5A55A]" />
                </div>
                <h3 className="text-base font-bold text-[#17231D]">Our Mission</h3>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  To provide accessible, world-class competitive exam mentorship and comprehensive CBSE schooling with individual attention.
                </p>
              </Card>

              <Card className="p-6 space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]">
                <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#C5A55A]" />
                </div>
                <h3 className="text-base font-bold text-[#17231D]">Our Vision</h3>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  To emerge as the most trusted educational benchmark in Central India for engineering, medical, and foundational excellence.
                </p>
              </Card>

              <Card className="p-6 space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]">
                <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#C5A55A]" />
                </div>
                <h3 className="text-base font-bold text-[#17231D]">Kota Pedagogy</h3>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  Systematic problem-solving techniques, curated study modules, and structured test series refined by national coaching veterans.
                </p>
              </Card>

              <Card className="p-6 space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]">
                <div className="w-10 h-10 rounded-[10px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#C5A55A]" />
                </div>
                <h3 className="text-base font-bold text-[#17231D]">Values & Ethics</h3>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  Nurturing integrity, discipline, scientific curiosity, and emotional resilience in every student entrusted to our care.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Target, Sparkles, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero } from '../../../components/layout/PageHero';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useDocumentTitle } from '../../../hooks/shared/useDocumentTitle';

export const TimesDigitalPage = () => {
  useDocumentTitle('TIMES DIGITAL | Premier IIT-JEE & NEET Coaching');

  const coachingFeatures = [
    {
      title: 'Kota Expert Faculty Team',
      desc: 'Master faculties with 10+ years of national coaching experience guiding students with proven test shortcuts and conceptual depth.',
    },
    {
      title: 'Comprehensive Study Modules & DPPs',
      desc: 'Curated chapter-wise theory, daily practice problem sheets (DPPs), and graded exercise levels from beginner to advanced Olympiad level.',
    },
    {
      title: 'All-India Pattern Test Series (AITS)',
      desc: 'Regular CBT (Computer Based Test) mock examinations replicating actual NTA JEE and NEET testing environments.',
    },
    {
      title: 'Personalized 1-on-1 Doubt Counters',
      desc: 'Dedicated daily doubt resolution sessions where students get individual mentor guidance to clear learning bottlenecks.',
    },
  ];

  return (
    <div className="w-full">
      <PageHero
        badge="TIMES DIGITAL"
        title="Premier Competitive Exam Coaching in Shahdol"
        subtitle="Bringing national-standard IIT-JEE (Main & Advanced), NEET-UG, and Foundation pedagogy directly to ambitious aspirants."
        breadcrumbs={[{ label: 'TIMES DIGITAL' }]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Link to="/batches">
              <Button variant="primary" size="md">
                View Target Batches
              </Button>
            </Link>
            <Link to="/results">
              <Button variant="secondary" size="md">
                Hall of Fame
              </Button>
            </Link>
          </div>
        }
      />

      <section className="py-12 sm:py-16 md:py-20 bg-white border-b border-[#E5E1D7]">
        <Container>
          <SectionHeading
            badge="Kota Pedagogy"
            title="The TIMES DIGITAL Advantage"
            subtitle="Engineered to transform sincere hard work into top national ranks in competitive entrance examinations."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coachingFeatures.map((item, idx) => (
              <Card key={idx} hover className="p-6 space-y-3 bg-[#FAF8F2] border border-[#E5E1D7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-[#164A35] text-[#C5A55A] flex items-center justify-center font-extrabold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#17231D]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10 p-8 rounded-[20px] bg-[#103728] text-white text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">
              Ready to Target IIT-JEE or NEET 2026/2027?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto">
              Join our flagship Nurture and Leader batches. Get merit scholarships up to 90% based on your academic track record or TTSE score.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link to="/admissions">
                <Button variant="gold" size="md" className="text-[#103728]">
                  Apply for Admission
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default TimesDigitalPage;

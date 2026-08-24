import React from 'react';
import { ShieldCheck, Users, Target, BookOpen, Clock, Award } from 'lucide-react';
import { Container } from '../../../components/layout/Container';
import { SectionHeading } from '../../../components/layout/SectionHeading';
import { Card } from '../../../components/ui/Card';

export const WhyChooseUsSection = ({ data }) => {
  const pillars = data?.pillars || [
    {
      title: 'Kota Pedagogy in Shahdol',
      description:
        'Experienced faculty from national coaching capitals bringing proven test-taking strategies directly to local students.',
    },
    {
      title: 'Integrated Schooling + Coaching',
      description:
        'Synchronized CBSE board syllabus and competitive exam preparation to avoid burnout and duplication of effort.',
    },
    {
      title: 'Small Batch Attention',
      description:
        'Focused batches with dedicated 1-on-1 doubt resolution, daily practice sheets, and personalized mentor tracking.',
    },
    {
      title: 'State-of-the-Art Labs & Library',
      description:
        'Modern science laboratories, interactive smart classrooms, and extensive competitive reference reading rooms.',
    },
    {
      title: 'Rigorous National Test Series',
      description:
        'Regular chapter-wise, cumulative, and full-syllabus mock exams mapped to real NTA / JEE / NEET exam patterns.',
    },
    {
      title: 'Safe Residential Hostel Wing',
      description:
        'Supervised, disciplined hostel facilities with hygienic food, 24x7 security, and nightly study hours.',
    },
  ];

  const icons = [Award, Users, Target, BookOpen, Clock, ShieldCheck];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-[#FAF8F2]">
      <Container>
        <SectionHeading
          badge="Institutional Pillars"
          title={data?.title || 'Why Choose TIME Public School & TIMES DIGITAL'}
          subtitle={
            data?.subtitle ||
            'A holistic learning ecosystem built on discipline, conceptual clarity, and relentless academic mentorship.'
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <Card key={idx} hover className="p-6 space-y-3 bg-white">
                <div className="w-11 h-11 rounded-[12px] bg-[#164A35]/10 text-[#164A35] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#C5A55A]" />
                </div>
                <h3 className="text-base font-bold text-[#17231D]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#68736D] leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
